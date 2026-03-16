# ============================================================
# Script de Despliegue en 2 Fases para Azure Container Apps
# Fase 1: Infraestructura y Backend
# ============================================================

# Configuración - MODIFICA ESTOS VALORES
$RESOURCE_GROUP = "esports-platform-rg"
$LOCATION = "eastus"
$ACR_NAME = "esportsplatformacr"  # Debe ser único globalmente
$ENVIRONMENT_NAME = "esports-env"
$POSTGRES_SERVER = "esports-postgres-server"
$POSTGRES_DB = "esports_platform"
$POSTGRES_USER = "esports_admin"
$POSTGRES_PASSWORD = "EsP0rts_Pr0d_2024!"

# Variables de la aplicación
$JWT_SECRET = "your-super-secret-jwt-key-for-production-min-32-chars-2024"
$PAYPAL_CLIENT_ID = "AWOzbSQdks7_DSWPGERnpQSJzH1l8O9WYRZY56YvxZ6cssPH63e8jn7eESO2G1f2lx1C6sAcwFuzwH6A"
$PAYPAL_CLIENT_SECRET = "EDQCwFOgEYygbZ8Fxa_ep5973dYp6002M5vDIKZVIZzZtGQasfj6QXXmKUrVXWhAaSUFV1vw3K56h7Ks"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  FASE 1: Infraestructura y Backend" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# Verificar Azure CLI
Write-Host "`n[1/9] Verificando Azure CLI..." -ForegroundColor Yellow
try {
    $azVersion = az version 2>$null | ConvertFrom-Json
    Write-Host "Azure CLI v$($azVersion.'azure-cli') instalado" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Azure CLI no está instalado." -ForegroundColor Red
    Write-Host "Descárgalo de: https://aka.ms/installazurecliwindows" -ForegroundColor Yellow
    exit 1
}

# Iniciar sesión
Write-Host "`n[2/9] Iniciando sesión en Azure..." -ForegroundColor Yellow
az login --only-show-errors

# Registrar proveedores necesarios
Write-Host "`n[3/9] Registrando proveedores de Azure (puede tomar unos minutos)..." -ForegroundColor Yellow
az provider register -n Microsoft.ContainerRegistry --wait
az provider register -n Microsoft.App --wait
az provider register -n Microsoft.DBforPostgreSQL --wait
Write-Host "Proveedores registrados" -ForegroundColor Green

# Crear grupo de recursos
Write-Host "`n[4/9] Creando grupo de recursos..." -ForegroundColor Yellow
az group create --name $RESOURCE_GROUP --location $LOCATION --output none
Write-Host "Grupo de recursos creado: $RESOURCE_GROUP" -ForegroundColor Green

# Crear ACR
Write-Host "`n[5/9] Creando Container Registry..." -ForegroundColor Yellow
az acr create `
    --resource-group $RESOURCE_GROUP `
    --name $ACR_NAME `
    --sku Basic `
    --admin-enabled true `
    --output none

$ACR_LOGIN_SERVER = az acr show --name $ACR_NAME --query loginServer --output tsv
$ACR_USERNAME = az acr credential show --name $ACR_NAME --query username --output tsv
$ACR_PASSWORD = az acr credential show --name $ACR_NAME --query "passwords[0].value" --output tsv
Write-Host "ACR creado: $ACR_LOGIN_SERVER" -ForegroundColor Green

# Crear PostgreSQL
Write-Host "`n[6/9] Creando PostgreSQL (esto toma ~5 minutos)..." -ForegroundColor Yellow
az postgres flexible-server create `
    --resource-group $RESOURCE_GROUP `
    --name $POSTGRES_SERVER `
    --location $LOCATION `
    --admin-user $POSTGRES_USER `
    --admin-password $POSTGRES_PASSWORD `
    --sku-name Standard_B1ms `
    --tier Burstable `
    --storage-size 32 `
    --version 16 `
    --yes `
    --output none

# Crear base de datos
az postgres flexible-server db create `
    --resource-group $RESOURCE_GROUP `
    --server-name $POSTGRES_SERVER `
    --database-name $POSTGRES_DB `
    --output none

# Firewall
az postgres flexible-server firewall-rule create `
    --resource-group $RESOURCE_GROUP `
    --name $POSTGRES_SERVER `
    --rule-name AllowAzureServices `
    --start-ip-address 0.0.0.0 `
    --end-ip-address 0.0.0.0 `
    --output none

$POSTGRES_HOST = az postgres flexible-server show `
    --resource-group $RESOURCE_GROUP `
    --name $POSTGRES_SERVER `
    --query fullyQualifiedDomainName --output tsv
Write-Host "PostgreSQL creado: $POSTGRES_HOST" -ForegroundColor Green

# Crear Container Apps Environment
Write-Host "`n[7/9] Creando Container Apps Environment..." -ForegroundColor Yellow
az containerapp env create `
    --name $ENVIRONMENT_NAME `
    --resource-group $RESOURCE_GROUP `
    --location $LOCATION `
    --output none
Write-Host "Environment creado: $ENVIRONMENT_NAME" -ForegroundColor Green

# Construir y subir Backend
Write-Host "`n[8/9] Construyendo imagen del Backend (puede tomar varios minutos)..." -ForegroundColor Yellow
$backendPath = Join-Path (Split-Path $PSScriptRoot) "backend"
az acr build --registry $ACR_NAME --image esports-backend:latest --file "$backendPath\Dockerfile" $backendPath
Write-Host "Imagen del backend subida" -ForegroundColor Green

# Desplegar Backend
Write-Host "`n[9/9] Desplegando Backend..." -ForegroundColor Yellow
az containerapp create `
    --name esports-backend `
    --resource-group $RESOURCE_GROUP `
    --environment $ENVIRONMENT_NAME `
    --image "$ACR_LOGIN_SERVER/esports-backend:latest" `
    --registry-server $ACR_LOGIN_SERVER `
    --registry-username $ACR_USERNAME `
    --registry-password $ACR_PASSWORD `
    --target-port 3001 `
    --ingress external `
    --min-replicas 1 `
    --max-replicas 2 `
    --cpu 0.5 `
    --memory 1Gi `
    --env-vars `
        NODE_ENV=production `
        PORT=3001 `
        DB_HOST=$POSTGRES_HOST `
        DB_PORT=5432 `
        DB_USERNAME=$POSTGRES_USER `
        DB_PASSWORD=$POSTGRES_PASSWORD `
        DB_DATABASE=$POSTGRES_DB `
        DB_SSL=true `
        JWT_SECRET=$JWT_SECRET `
        JWT_EXPIRATION=7d `
        PAYPAL_CLIENT_ID=$PAYPAL_CLIENT_ID `
        PAYPAL_CLIENT_SECRET=$PAYPAL_CLIENT_SECRET `
        PAYPAL_SANDBOX=true `
        UPLOAD_DIR=/app/uploads `
        MAX_FILE_SIZE=5242880 `
        FRONTEND_URL=https://placeholder.com `
    --output none

$BACKEND_URL = az containerapp show `
    --name esports-backend `
    --resource-group $RESOURCE_GROUP `
    --query properties.configuration.ingress.fqdn --output tsv
$BACKEND_FULL_URL = "https://$BACKEND_URL"

Write-Host "`n============================================" -ForegroundColor Green
Write-Host "  FASE 1 COMPLETADA" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host "`nBackend URL: $BACKEND_FULL_URL" -ForegroundColor Cyan
Write-Host "`nAhora ejecuta:" -ForegroundColor Yellow
Write-Host "  .\deploy-phase2.ps1" -ForegroundColor White

# Guardar variables para fase 2
$envContent = @"
`$BACKEND_FULL_URL = "$BACKEND_FULL_URL"
`$RESOURCE_GROUP = "$RESOURCE_GROUP"
`$ENVIRONMENT_NAME = "$ENVIRONMENT_NAME"
`$ACR_NAME = "$ACR_NAME"
`$ACR_LOGIN_SERVER = "$ACR_LOGIN_SERVER"
`$ACR_USERNAME = "$ACR_USERNAME"
`$ACR_PASSWORD = "$ACR_PASSWORD"
"@
$envContent | Out-File -FilePath ".\phase1-output.ps1" -Encoding UTF8
Write-Host "`nVariables guardadas en phase1-output.ps1" -ForegroundColor Gray

# ============================================================
# Script de Despliegue para Azure Container Apps
# Proyecto: eSports Platform
# ============================================================

# Configuración - MODIFICA ESTOS VALORES
$RESOURCE_GROUP = "esports-platform-rg"
$LOCATION = "eastus"  # Región más económica
$ACR_NAME = "esportsplatformacr"  # Debe ser único globalmente (solo letras minúsculas y números)
$ENVIRONMENT_NAME = "esports-env"
$POSTGRES_SERVER = "esports-postgres-server"
$POSTGRES_DB = "esports_platform"
$POSTGRES_USER = "esports_admin"
$POSTGRES_PASSWORD = "EsP0rts_Pr0d_2024!"  # Cambia esto en producción

# Variables de la aplicación
$JWT_SECRET = "your-super-secret-jwt-key-for-production-min-32-chars-2024"
$PAYPAL_CLIENT_ID = "AWOzbSQdks7_DSWPGERnpQSJzH1l8O9WYRZY56YvxZ6cssPH63e8jn7eESO2G1f2lx1C6sAcwFuzwH6A"
$PAYPAL_CLIENT_SECRET = "EDQCwFOgEYygbZ8Fxa_ep5973dYp6002M5vDIKZVIZzZtGQasfj6QXXmKUrVXWhAaSUFV1vw3K56h7Ks"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Desplegando eSports Platform en Azure" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# Verificar que Azure CLI está instalado
Write-Host "`n[1/10] Verificando Azure CLI..." -ForegroundColor Yellow
$azVersion = az version 2>$null
if (-not $azVersion) {
    Write-Host "ERROR: Azure CLI no está instalado." -ForegroundColor Red
    Write-Host "Descárgalo de: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows" -ForegroundColor Yellow
    exit 1
}
Write-Host "Azure CLI instalado correctamente" -ForegroundColor Green

# Iniciar sesión en Azure
Write-Host "`n[2/10] Iniciando sesión en Azure..." -ForegroundColor Yellow
az login

# Crear grupo de recursos
Write-Host "`n[3/10] Creando grupo de recursos: $RESOURCE_GROUP..." -ForegroundColor Yellow
az group create --name $RESOURCE_GROUP --location $LOCATION

# Crear Azure Container Registry
Write-Host "`n[4/10] Creando Container Registry: $ACR_NAME..." -ForegroundColor Yellow
az acr create `
    --resource-group $RESOURCE_GROUP `
    --name $ACR_NAME `
    --sku Basic `
    --admin-enabled true

# Obtener credenciales del ACR
$ACR_LOGIN_SERVER = az acr show --name $ACR_NAME --query loginServer --output tsv
$ACR_USERNAME = az acr credential show --name $ACR_NAME --query username --output tsv
$ACR_PASSWORD = az acr credential show --name $ACR_NAME --query "passwords[0].value" --output tsv

Write-Host "ACR Server: $ACR_LOGIN_SERVER" -ForegroundColor Gray

# Iniciar sesión en ACR
Write-Host "`n[5/10] Iniciando sesión en Container Registry..." -ForegroundColor Yellow
az acr login --name $ACR_NAME

# Construir y subir imagen del Backend
Write-Host "`n[6/10] Construyendo y subiendo imagen del Backend..." -ForegroundColor Yellow
Set-Location -Path "..\backend"
az acr build --registry $ACR_NAME --image esports-backend:latest --file Dockerfile .

# Construir y subir imagen del Frontend
Write-Host "`n[7/10] Construyendo y subiendo imagen del Frontend..." -ForegroundColor Yellow
Set-Location -Path "..\frontend"
az acr build --registry $ACR_NAME --image esports-frontend:latest --file Dockerfile .

# Volver al directorio de azure
Set-Location -Path "..\azure"

# Crear Azure Database for PostgreSQL Flexible Server
Write-Host "`n[8/10] Creando base de datos PostgreSQL..." -ForegroundColor Yellow
az postgres flexible-server create `
    --resource-group $RESOURCE_GROUP `
    --name $POSTGRES_SERVER `
    --location $LOCATION `
    --admin-user $POSTGRES_USER `
    --admin-password $POSTGRES_PASSWORD `
    --database-name $POSTGRES_DB `
    --sku-name Standard_B1ms `
    --tier Burstable `
    --storage-size 32 `
    --version 16 `
    --yes

# Configurar firewall para permitir servicios de Azure
Write-Host "Configurando firewall de PostgreSQL..." -ForegroundColor Yellow
az postgres flexible-server firewall-rule create `
    --resource-group $RESOURCE_GROUP `
    --name $POSTGRES_SERVER `
    --rule-name AllowAzureServices `
    --start-ip-address 0.0.0.0 `
    --end-ip-address 0.0.0.0

# Obtener hostname de PostgreSQL
$POSTGRES_HOST = az postgres flexible-server show `
    --resource-group $RESOURCE_GROUP `
    --name $POSTGRES_SERVER `
    --query fullyQualifiedDomainName --output tsv

Write-Host "PostgreSQL Host: $POSTGRES_HOST" -ForegroundColor Gray

# Crear Container Apps Environment
Write-Host "`n[9/10] Creando Container Apps Environment..." -ForegroundColor Yellow
az containerapp env create `
    --name $ENVIRONMENT_NAME `
    --resource-group $RESOURCE_GROUP `
    --location $LOCATION

# Desplegar Backend
Write-Host "`n[10/10] Desplegando aplicaciones..." -ForegroundColor Yellow
Write-Host "Desplegando Backend..." -ForegroundColor Yellow

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
    --min-replicas 0 `
    --max-replicas 1 `
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
        JWT_SECRET=$JWT_SECRET `
        JWT_EXPIRATION=7d `
        PAYPAL_CLIENT_ID=$PAYPAL_CLIENT_ID `
        PAYPAL_CLIENT_SECRET=$PAYPAL_CLIENT_SECRET `
        PAYPAL_SANDBOX=true `
        UPLOAD_DIR=/app/uploads `
        MAX_FILE_SIZE=5242880

# Obtener URL del backend
$BACKEND_URL = az containerapp show `
    --name esports-backend `
    --resource-group $RESOURCE_GROUP `
    --query properties.configuration.ingress.fqdn --output tsv

$BACKEND_FULL_URL = "https://$BACKEND_URL"
Write-Host "Backend URL: $BACKEND_FULL_URL" -ForegroundColor Gray

# Actualizar backend con FRONTEND_URL (se actualizará después)
# Por ahora dejamos un placeholder

# Desplegar Frontend
Write-Host "Desplegando Frontend..." -ForegroundColor Yellow

az containerapp create `
    --name esports-frontend `
    --resource-group $RESOURCE_GROUP `
    --environment $ENVIRONMENT_NAME `
    --image "$ACR_LOGIN_SERVER/esports-frontend:latest" `
    --registry-server $ACR_LOGIN_SERVER `
    --registry-username $ACR_USERNAME `
    --registry-password $ACR_PASSWORD `
    --target-port 3000 `
    --ingress external `
    --min-replicas 0 `
    --max-replicas 1 `
    --cpu 0.5 `
    --memory 1Gi `
    --env-vars `
        NODE_ENV=production `
        NEXT_PUBLIC_API_URL=$BACKEND_FULL_URL

# Obtener URL del frontend
$FRONTEND_URL = az containerapp show `
    --name esports-frontend `
    --resource-group $RESOURCE_GROUP `
    --query properties.configuration.ingress.fqdn --output tsv

$FRONTEND_FULL_URL = "https://$FRONTEND_URL"

# Actualizar backend con la URL correcta del frontend
Write-Host "`nActualizando Backend con URL del Frontend..." -ForegroundColor Yellow
az containerapp update `
    --name esports-backend `
    --resource-group $RESOURCE_GROUP `
    --set-env-vars FRONTEND_URL=$FRONTEND_FULL_URL

# ============================================================
# Resumen final
# ============================================================
Write-Host "`n============================================" -ForegroundColor Green
Write-Host "  ¡DESPLIEGUE COMPLETADO EXITOSAMENTE!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green

Write-Host "`nURLs de tu aplicación:" -ForegroundColor Cyan
Write-Host "  Frontend: $FRONTEND_FULL_URL" -ForegroundColor White
Write-Host "  Backend:  $BACKEND_FULL_URL" -ForegroundColor White
Write-Host "  PostgreSQL: $POSTGRES_HOST" -ForegroundColor White

Write-Host "`nCredenciales de la base de datos:" -ForegroundColor Cyan
Write-Host "  Usuario: $POSTGRES_USER" -ForegroundColor White
Write-Host "  Base de datos: $POSTGRES_DB" -ForegroundColor White

Write-Host "`nPróximos pasos:" -ForegroundColor Yellow
Write-Host "  1. Actualiza las URLs de callback en PayPal con tu nueva URL de frontend" -ForegroundColor White
Write-Host "  2. Configura un dominio personalizado (opcional)" -ForegroundColor White
Write-Host "  3. Monitorea el consumo de créditos en el portal de Azure" -ForegroundColor White

Write-Host "`nPara ver los logs:" -ForegroundColor Yellow
Write-Host "  az containerapp logs show --name esports-backend --resource-group $RESOURCE_GROUP --follow" -ForegroundColor Gray
Write-Host "  az containerapp logs show --name esports-frontend --resource-group $RESOURCE_GROUP --follow" -ForegroundColor Gray

Write-Host "`nPara eliminar todo (si ya no lo necesitas):" -ForegroundColor Yellow
Write-Host "  az group delete --name $RESOURCE_GROUP --yes" -ForegroundColor Gray

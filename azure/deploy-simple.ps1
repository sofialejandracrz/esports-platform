# ============================================================
# Script de Despliegue Simplificado para Azure for Students
# Usa Docker Hub (gratis) en lugar de ACR
# ============================================================

# CONFIGURACIÓN - MODIFICAR ESTOS VALORES
$RESOURCE_GROUP = "esports-rg"
$LOCATION = "westus"
$ENVIRONMENT_NAME = "esports-env"

# Docker Hub - Ya autenticado con GitHub
$DOCKER_USERNAME = "levittwl"

# PostgreSQL
$POSTGRES_SERVER = "esports-db-server"
$POSTGRES_DB = "esports_platform"
$POSTGRES_USER = "esportsadmin"
$POSTGRES_PASSWORD = "EsP0rts_2024_Secure!"

# Variables de la aplicacion
$JWT_SECRET = "your-super-secret-jwt-key-for-production-min-32-chars-2024"
$PAYPAL_CLIENT_ID = "AWOzbSQdks7_DSWPGERnpQSJzH1l8O9WYRZY56YvxZ6cssPH63e8jn7eESO2G1f2lx1C6sAcwFuzwH6A"
$PAYPAL_CLIENT_SECRET = "EDQCwFOgEYygbZ8Fxa_ep5973dYp6002M5vDIKZVIZzZtGQasfj6QXXmKUrVXWhAaSUFV1vw3K56h7Ks"

# ============================================================
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Despliegue eSports en Azure for Students" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# Paso 1: Login Azure
Write-Host "`n[1/8] Iniciando sesión en Azure..." -ForegroundColor Yellow
az login --only-show-errors

# Paso 2: Registrar proveedores
Write-Host "`n[2/8] Registrando proveedores..." -ForegroundColor Yellow
az provider register -n Microsoft.App --wait 2>$null
az provider register -n Microsoft.DBforPostgreSQL --wait 2>$null
Write-Host "Proveedores listos" -ForegroundColor Green

# Paso 3: Crear grupo de recursos
Write-Host "`n[3/8] Creando grupo de recursos..." -ForegroundColor Yellow
az group create --name $RESOURCE_GROUP --location $LOCATION --output none
Write-Host "Grupo creado: $RESOURCE_GROUP" -ForegroundColor Green

# Paso 4: Crear postgresql
Write-Host "`n[4/8] Creando postgresql (5-10 minutos)..." -ForegroundColor Yellow
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
    --public-access 0.0.0.0 `
    --yes `
    --output none

# Crear base de datos
az postgres flexible-server db create `
    --resource-group $RESOURCE_GROUP `
    --server-name $POSTGRES_SERVER `
    --database-name $POSTGRES_DB `
    --output none

$POSTGRES_HOST = az postgres flexible-server show `
    --resource-group $RESOURCE_GROUP `
    --name $POSTGRES_SERVER `
    --query fullyQualifiedDomainName --output tsv
Write-Host "PostgreSQL: $POSTGRES_HOST" -ForegroundColor Green

# Paso 5: Construir y subir imagenes a docker Hub
Write-Host "`n[5/8] Construyendo y subiendo imágenes a Docker Hub..." -ForegroundColor Yellow

# Backend
Write-Host "Construyendo Backend..." -ForegroundColor Gray
$backendPath = Join-Path (Split-Path $PSScriptRoot) "backend"
docker build -t "$DOCKER_USERNAME/esports-backend:latest" -f "$backendPath\Dockerfile" --target production $backendPath
docker push "$DOCKER_USERNAME/esports-backend:latest"

# Frontend (necesita URL del backend)
Write-Host "Backend subido a Docker Hub" -ForegroundColor Green

# Paso 6: Crear Container Apps Environment
Write-Host "`n[6/8] Creando Container Apps Environment..." -ForegroundColor Yellow
az containerapp env create `
    --name $ENVIRONMENT_NAME `
    --resource-group $RESOURCE_GROUP `
    --location $LOCATION `
    --output none
Write-Host "Environment creado" -ForegroundColor Green

# Paso 7: Desplegar Backend
Write-Host "`n[7/8] Desplegando Backend..." -ForegroundColor Yellow
az containerapp create `
    --name esports-backend `
    --resource-group $RESOURCE_GROUP `
    --environment $ENVIRONMENT_NAME `
    --image "docker.io/$DOCKER_USERNAME/esports-backend:latest" `
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
        DB_SSL=true `
        JWT_SECRET=$JWT_SECRET `
        JWT_EXPIRATION=7d `
        PAYPAL_CLIENT_ID=$PAYPAL_CLIENT_ID `
        PAYPAL_CLIENT_SECRET=$PAYPAL_CLIENT_SECRET `
        PAYPAL_SANDBOX=true `
        FRONTEND_URL=https://placeholder.com `
    --output none

$BACKEND_URL = az containerapp show `
    --name esports-backend `
    --resource-group $RESOURCE_GROUP `
    --query properties.configuration.ingress.fqdn --output tsv
$BACKEND_FULL_URL = "https://$BACKEND_URL"
Write-Host "Backend desplegado: $BACKEND_FULL_URL" -ForegroundColor Green

# Paso 8: Construir y desplegar Frontend
Write-Host "`n[8/8] Construyendo y desplegando Frontend..." -ForegroundColor Yellow

$frontendPath = Join-Path (Split-Path $PSScriptRoot) "frontend"
docker build -t "$DOCKER_USERNAME/esports-frontend:latest" `
    -f "$frontendPath\Dockerfile" `
    --target production `
    --build-arg NEXT_PUBLIC_API_URL=$BACKEND_FULL_URL `
    $frontendPath
docker push "$DOCKER_USERNAME/esports-frontend:latest"

az containerapp create `
    --name esports-frontend `
    --resource-group $RESOURCE_GROUP `
    --environment $ENVIRONMENT_NAME `
    --image "docker.io/$DOCKER_USERNAME/esports-frontend:latest" `
    --target-port 3000 `
    --ingress external `
    --min-replicas 0 `
    --max-replicas 1 `
    --cpu 0.5 `
    --memory 1Gi `
    --env-vars NODE_ENV=production `
    --output none

$FRONTEND_URL = az containerapp show `
    --name esports-frontend `
    --resource-group $RESOURCE_GROUP `
    --query properties.configuration.ingress.fqdn --output tsv
$FRONTEND_FULL_URL = "https://$FRONTEND_URL"

# Actualizar Backend con URL del Frontend
az containerapp update `
    --name esports-backend `
    --resource-group $RESOURCE_GROUP `
    --set-env-vars FRONTEND_URL=$FRONTEND_FULL_URL `
    --output none

# ============================================================
Write-Host "`n============================================" -ForegroundColor Green
Write-Host "  DESPLIEGUE COMPLETADO!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green

Write-Host "`nURLs:" -ForegroundColor Cyan
Write-Host "   Frontend: $FRONTEND_FULL_URL" -ForegroundColor White
Write-Host "   Backend:  $BACKEND_FULL_URL" -ForegroundColor White
Write-Host "   Database: $POSTGRES_HOST" -ForegroundColor White

Write-Host "`nActualiza PayPal Developer:" -ForegroundColor Yellow
Write-Host "   Return URL: $FRONTEND_FULL_URL/tienda/pago-exitoso" -ForegroundColor Gray
Write-Host "   Cancel URL: $FRONTEND_FULL_URL/tienda/pago-cancelado" -ForegroundColor Gray

Write-Host "`nPara eliminar:" -ForegroundColor Yellow
Write-Host "   az group delete --name $RESOURCE_GROUP --yes" -ForegroundColor Gray

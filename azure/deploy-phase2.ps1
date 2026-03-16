# ============================================================
# Script de Despliegue en 2 Fases para Azure Container Apps
# Fase 2: Frontend (requiere URL del backend)
# ============================================================

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  FASE 2: Desplegando Frontend" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# Cargar variables de fase 1
if (Test-Path ".\phase1-output.ps1") {
    . .\phase1-output.ps1
    Write-Host "Variables cargadas de fase 1" -ForegroundColor Green
} else {
    Write-Host "ERROR: No se encontró phase1-output.ps1" -ForegroundColor Red
    Write-Host "Ejecuta primero: .\deploy-phase1.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host "Backend URL: $BACKEND_FULL_URL" -ForegroundColor Gray

# Construir Frontend con la URL del backend
Write-Host "`n[1/3] Construyendo imagen del Frontend..." -ForegroundColor Yellow
$frontendPath = Join-Path (Split-Path $PSScriptRoot) "frontend"

# Usar az acr build con build args
az acr build `
    --registry $ACR_NAME `
    --image esports-frontend:latest `
    --file "$frontendPath\Dockerfile" `
    --build-arg NEXT_PUBLIC_API_URL=$BACKEND_FULL_URL `
    $frontendPath

Write-Host "Imagen del frontend subida" -ForegroundColor Green

# Desplegar Frontend
Write-Host "`n[2/3] Desplegando Frontend..." -ForegroundColor Yellow
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
    --min-replicas 1 `
    --max-replicas 2 `
    --cpu 0.5 `
    --memory 1Gi `
    --env-vars `
        NODE_ENV=production `
    --output none

$FRONTEND_URL = az containerapp show `
    --name esports-frontend `
    --resource-group $RESOURCE_GROUP `
    --query properties.configuration.ingress.fqdn --output tsv
$FRONTEND_FULL_URL = "https://$FRONTEND_URL"

# Actualizar Backend con URL del Frontend
Write-Host "`n[3/3] Actualizando Backend con URL del Frontend..." -ForegroundColor Yellow
az containerapp update `
    --name esports-backend `
    --resource-group $RESOURCE_GROUP `
    --set-env-vars FRONTEND_URL=$FRONTEND_FULL_URL `
    --output none

# ============================================================
# Resumen final
# ============================================================
Write-Host "`n============================================" -ForegroundColor Green
Write-Host "  ¡DESPLIEGUE COMPLETADO!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green

Write-Host "`n🌐 URLs de tu aplicación:" -ForegroundColor Cyan
Write-Host "   Frontend: $FRONTEND_FULL_URL" -ForegroundColor White
Write-Host "   Backend:  $BACKEND_FULL_URL" -ForegroundColor White

Write-Host "`n📋 Próximos pasos:" -ForegroundColor Yellow
Write-Host "   1. Abre el frontend en tu navegador" -ForegroundColor White
Write-Host "   2. Actualiza las URLs de PayPal Developer:" -ForegroundColor White
Write-Host "      - Return URL: $FRONTEND_FULL_URL/tienda/pago-exitoso" -ForegroundColor Gray
Write-Host "      - Cancel URL: $FRONTEND_FULL_URL/tienda/pago-cancelado" -ForegroundColor Gray

Write-Host "`n📊 Ver logs:" -ForegroundColor Yellow
Write-Host "   az containerapp logs show --name esports-backend --resource-group $RESOURCE_GROUP --follow" -ForegroundColor Gray
Write-Host "   az containerapp logs show --name esports-frontend --resource-group $RESOURCE_GROUP --follow" -ForegroundColor Gray

Write-Host "`n🗑️ Para eliminar todo:" -ForegroundColor Yellow
Write-Host "   .\cleanup.ps1" -ForegroundColor Gray

# Limpiar archivo temporal
Remove-Item ".\phase1-output.ps1" -ErrorAction SilentlyContinue

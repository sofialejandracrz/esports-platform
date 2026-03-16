# ============================================================
# Script para eliminar todos los recursos de Azure
# ¡CUIDADO! Esto eliminará TODO el despliegue
# ============================================================

$RESOURCE_GROUP = "esports-platform-rg"

Write-Host "============================================" -ForegroundColor Red
Write-Host "  ELIMINANDO RECURSOS DE AZURE" -ForegroundColor Red
Write-Host "============================================" -ForegroundColor Red
Write-Host ""
Write-Host "Esto eliminará:" -ForegroundColor Yellow
Write-Host "  - Container Apps (frontend y backend)"
Write-Host "  - Container Registry"
Write-Host "  - Base de datos PostgreSQL"
Write-Host "  - Todos los datos almacenados"
Write-Host ""

$confirm = Read-Host "¿Estás seguro? Escribe 'ELIMINAR' para confirmar"

if ($confirm -eq "ELIMINAR") {
    Write-Host "`nEliminando grupo de recursos: $RESOURCE_GROUP..." -ForegroundColor Yellow
    az group delete --name $RESOURCE_GROUP --yes --no-wait
    Write-Host "Eliminación iniciada. Puede tomar varios minutos." -ForegroundColor Green
} else {
    Write-Host "Operación cancelada." -ForegroundColor Gray
}

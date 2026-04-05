param(
    [string]$ContainerName = "esports_mongo_dw",
    [string]$Database = "esports_analytics",
    [string]$OutputDir = ""
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($OutputDir)) {
    $OutputDir = Join-Path $PSScriptRoot "exports"
}

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    throw "Docker no esta instalado o no esta disponible en PATH."
}

$runningContainer = docker ps --format "{{.Names}}" | Where-Object { $_ -eq $ContainerName }
if (-not $runningContainer) {
    throw "No se encontro el contenedor '$ContainerName' en ejecucion."
}

$mongoexportPath = docker exec $ContainerName sh -lc "command -v mongoexport"
if (-not $mongoexportPath) {
    throw "El contenedor '$ContainerName' no tiene mongoexport disponible."
}

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

$logsFields = "oracle_usuario_id,tipo_evento,ip,user_agent,pais_origen,timestamp,detalle.metodo,detalle.exitoso,detalle.duracion_sesion_min,detalle.termino,detalle.resultados_encontrados,detalle.perfil_visitado_id,detalle.tiempo_visualizacion_seg,detalle.desde_seccion,detalle.torneo_id,detalle.accion,detalle.item_id,detalle.categoria,detalle.seccion,detalle.campo_modificado,detalle.destinatario_id"
$feedbackFields = "oracle_torneo_id,oracle_usuario_id,calificacion,comentario,tags,recomendaria,timestamp"

$tmpLogs = "/tmp/logs_actividad_dw.csv"
$tmpFeedback = "/tmp/feedback_torneos_dw.csv"

Write-Host "Exportando logs_actividad desde MongoDB..."
docker exec $ContainerName sh -lc "mongoexport --db $Database --collection logs_actividad --type=csv --fields '$logsFields' --out $tmpLogs" | Out-Null

Write-Host "Exportando feedback_torneos desde MongoDB..."
docker exec $ContainerName sh -lc "mongoexport --db $Database --collection feedback_torneos --type=csv --fields '$feedbackFields' --out $tmpFeedback" | Out-Null

$logsOut = Join-Path $OutputDir "logs_actividad_dw.csv"
$feedbackOut = Join-Path $OutputDir "feedback_torneos_dw.csv"

docker cp "${ContainerName}:${tmpLogs}" $logsOut | Out-Null
docker cp "${ContainerName}:${tmpFeedback}" $feedbackOut | Out-Null

docker exec $ContainerName sh -lc "rm -f $tmpLogs $tmpFeedback" | Out-Null

$logsRows = (Get-Content $logsOut | Measure-Object -Line).Lines - 1
$feedbackRows = (Get-Content $feedbackOut | Measure-Object -Line).Lines - 1

Write-Host ""
Write-Host "Export completado."
Write-Host "Archivo 1: $logsOut ($logsRows filas)"
Write-Host "Archivo 2: $feedbackOut ($feedbackRows filas)"
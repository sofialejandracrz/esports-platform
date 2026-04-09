[CmdletBinding()]
param([switch]$ForceRebuild)

$ErrorActionPreference = 'Stop'
$PowerBiRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$TemplateName = 'Dashboard_DM1_Ingresos'
$TemplateReportPath = Join-Path $PowerBiRoot "$TemplateName.Report"
$TemplateSemanticPath = Join-Path $PowerBiRoot "$TemplateName.SemanticModel"
$TemplatePbipPath = Join-Path $PowerBiRoot "$TemplateName.pbip"

if (-not (Test-Path $TemplateReportPath)) { throw "No existe plantilla de reporte: $TemplateReportPath" }
if (-not (Test-Path $TemplateSemanticPath)) { throw "No existe plantilla de modelo semantico: $TemplateSemanticPath" }
if (-not (Test-Path $TemplatePbipPath)) { throw "No existe plantilla PBIP: $TemplatePbipPath" }

# ── Dark Mode Palette ──
$C_BG_PAGE     = '#0B0F19'
$C_BG_CARD     = '#141B2D'
$C_BORDER      = '#1E2A3A'
$C_TEXT_PRIMARY = '#E2E8F0'
$C_TEXT_SECONDARY = '#94A3B8'
$C_CYAN        = '#00D4FF'
$C_VIOLET      = '#8B5CF6'
$C_EMERALD     = '#10B981'
$C_AMBER       = '#F59E0B'
$C_ROSE        = '#F43F5E'
$C_SLATE       = '#64748B'

# ── Utility Functions ──
function Ensure-Directory { param([string]$Path); if (-not (Test-Path $Path)) { New-Item -ItemType Directory -Path $Path -Force | Out-Null } }
function Write-Json { param([string]$Path, [object]$Object); $json = $Object | ConvertTo-Json -Depth 100; $utf8 = [System.Text.UTF8Encoding]::new($false); [System.IO.File]::WriteAllText($Path, $json, $utf8) }
function New-Id { return ([guid]::NewGuid().ToString('N').Substring(0, 20)) }
function Quote-Text { param([string]$Text); return "'" + $Text.Replace("'", "''") + "'" }
function LiteralExpr { param([string]$Value); return @{ expr = @{ Literal = @{ Value = $Value } } } }
function SolidColorExpr { param([string]$HexColor); return @{ solid = @{ color = LiteralExpr (Quote-Text $HexColor) } } }

function New-Position {
	param([double]$X, [double]$Y, [double]$Z, [double]$Height, [double]$Width, [double]$TabOrder)
	$p = [ordered]@{ x=$X; y=$Y; z=$Z; height=$Height; width=$Width }
	if ($TabOrder -ge 0) { $p.tabOrder = $TabOrder }
	return $p
}

function New-ColumnProjection {
	param([string]$Entity, [string]$Property, [switch]$Active, [string]$Format)
	$proj = [ordered]@{
		field = [ordered]@{ Column = [ordered]@{ Expression = [ordered]@{ SourceRef = [ordered]@{ Entity = $Entity } }; Property = $Property } }
		queryRef = "$Entity.$Property"
	}
	if ($Active.IsPresent) { $proj.active = $true }
	if ($Format) { $proj.format = $Format }
	return $proj
}

function New-MeasureProjection {
	param([string]$Entity, [string]$Property, [string]$Format)
	$proj = [ordered]@{
		field = [ordered]@{ Measure = [ordered]@{ Expression = [ordered]@{ SourceRef = [ordered]@{ Entity = $Entity } }; Property = $Property } }
		queryRef = "$Entity.$Property"
	}
	if ($Format) { $proj.format = $Format }
	return $proj
}

function New-VisualContainerTitle {
	param([string]$Title, [string]$FontColor = $C_TEXT_PRIMARY, [string]$FontSize = '11D')
	return [ordered]@{
		properties = [ordered]@{
			show = LiteralExpr 'true'
			text = LiteralExpr (Quote-Text $Title)
			fontColor = SolidColorExpr $FontColor
			fontSize = LiteralExpr $FontSize
			fontFamily = LiteralExpr (Quote-Text "'''Segoe UI Semibold'', wf_segoe-ui_semibold, helvetica, arial, sans-serif")
		}
	}
}

function New-DarkContainerStyle {
	return [ordered]@{
		background = @([ordered]@{ properties = [ordered]@{ show = LiteralExpr 'true'; color = SolidColorExpr $C_BG_CARD; transparency = LiteralExpr '0L' } })
		border = @([ordered]@{ properties = [ordered]@{ show = LiteralExpr 'true'; color = SolidColorExpr $C_BORDER; radius = LiteralExpr '8D' } })
		padding = @([ordered]@{ properties = [ordered]@{ top = LiteralExpr '5D'; bottom = LiteralExpr '5D'; left = LiteralExpr '5D'; right = LiteralExpr '5D' } })
	}
}

function New-DarkAxisStyle {
	return [ordered]@{
		categoryAxis = @([ordered]@{ properties = [ordered]@{
			labelColor = SolidColorExpr $C_TEXT_SECONDARY
			fontSize = LiteralExpr '9D'
			fontFamily = LiteralExpr (Quote-Text "'''Segoe UI'', wf_segoe-ui_normal, helvetica, arial, sans-serif")
		} })
		valueAxis = @([ordered]@{ properties = [ordered]@{
			labelColor = SolidColorExpr $C_TEXT_SECONDARY
			fontSize = LiteralExpr '9D'
			gridlineColor = SolidColorExpr $C_BORDER
		} })
	}
}

# ── Visual Builders ──
function New-TextboxVisual {
	param([string]$Name, [hashtable]$Position, [string]$Text, [string]$SubText, [string]$FontSize = '22pt', [string]$Color = $C_TEXT_PRIMARY)
	$textRuns = @([ordered]@{ value = $Text; textStyle = [ordered]@{ fontSize = $FontSize; color = $Color; fontFace = 'Segoe UI Semibold' } })
	$paragraphs = @([ordered]@{ textRuns = $textRuns })
	if ($SubText) {
		$paragraphs += [ordered]@{ textRuns = @([ordered]@{ value = $SubText; textStyle = [ordered]@{ fontSize = '11pt'; color = $C_TEXT_SECONDARY; fontFace = 'Segoe UI' } }) }
	}
	return [ordered]@{
		'$schema' = 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/visualContainer/2.7.0/schema.json'
		name = $Name; position = $Position
		visual = [ordered]@{ visualType = 'textbox'; objects = [ordered]@{ general = @([ordered]@{ properties = [ordered]@{ paragraphs = $paragraphs } }) }; drillFilterOtherVisuals = $true }
	}
}

function New-SlicerVisual {
	param([string]$Name, [hashtable]$Position, [string]$Entity, [string]$Property, [string]$HeaderText)
	$proj = New-ColumnProjection -Entity $Entity -Property $Property -Active
	$containerObj = New-DarkContainerStyle
	$containerObj.title = @((New-VisualContainerTitle -Title $HeaderText -FontSize '10D'))
	return [ordered]@{
		'$schema' = 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/visualContainer/2.2.0/schema.json'
		name = $Name; position = $Position
		visual = [ordered]@{
			visualType = 'slicer'
			query = [ordered]@{ queryState = [ordered]@{ Values = [ordered]@{ projections = @($proj) } } }
			objects = [ordered]@{
				data = @([ordered]@{ properties = [ordered]@{ mode = LiteralExpr (Quote-Text 'Dropdown') } })
				header = @([ordered]@{ properties = [ordered]@{ show = LiteralExpr 'true'; fontColor = SolidColorExpr $C_TEXT_PRIMARY; background = SolidColorExpr $C_BG_CARD; textSize = LiteralExpr '10D' } })
				items = @([ordered]@{ properties = [ordered]@{ fontColor = SolidColorExpr $C_TEXT_PRIMARY; background = SolidColorExpr $C_BG_CARD } })
				general = @([ordered]@{ properties = [ordered]@{ selfFilterEnabled = LiteralExpr 'true' } })
				selection = @([ordered]@{ properties = [ordered]@{ selectAllCheckboxEnabled = LiteralExpr 'false' } })
			}
			visualContainerObjects = $containerObj
			drillFilterOtherVisuals = $true
		}
	}
}

function New-CardVisual {
	param([string]$Name, [hashtable]$Position, [string]$MeasureEntity, [string]$MeasureProperty, [string]$Title, [string]$AccentColor, [string]$MeasureFormat)
	$mProj = New-MeasureProjection -Entity $MeasureEntity -Property $MeasureProperty -Format $MeasureFormat
	$containerObj = New-DarkContainerStyle
	$containerObj.title = @((New-VisualContainerTitle -Title $Title -FontSize '10D' -FontColor $C_TEXT_SECONDARY))
	return [ordered]@{
		'$schema' = 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/visualContainer/2.2.0/schema.json'
		name = $Name; position = $Position
		visual = [ordered]@{
			visualType = 'card'
			query = [ordered]@{ queryState = [ordered]@{ Values = [ordered]@{ projections = @($mProj) } } }
			objects = [ordered]@{
				labels = @([ordered]@{ properties = [ordered]@{
					color = SolidColorExpr $AccentColor
					fontSize = LiteralExpr '22D'
					fontFamily = LiteralExpr (Quote-Text "'''Segoe UI Semibold'', wf_segoe-ui_semibold, helvetica, arial, sans-serif")
				} })
				categoryLabels = @([ordered]@{ properties = [ordered]@{ show = LiteralExpr 'false' } })
			}
			visualContainerObjects = $containerObj
			drillFilterOtherVisuals = $true
		}
	}
}

function New-ChartVisual {
	param([string]$Name, [hashtable]$Position, [string]$VisualType, [string]$CategoryEntity, [string]$CategoryProperty,
		[string]$MeasureEntity, [string]$MeasureProperty, [string]$Title, [string]$Color, [switch]$SortDescending, [string]$MeasureFormat)
	$catProj = New-ColumnProjection -Entity $CategoryEntity -Property $CategoryProperty -Active
	$mProj = New-MeasureProjection -Entity $MeasureEntity -Property $MeasureProperty -Format $MeasureFormat
	$query = [ordered]@{ queryState = [ordered]@{ Category = [ordered]@{ projections = @($catProj) }; Y = [ordered]@{ projections = @($mProj) } } }
	if ($SortDescending.IsPresent) {
		$query.sortDefinition = [ordered]@{ sort = @([ordered]@{ field = [ordered]@{ Measure = [ordered]@{ Expression = [ordered]@{ SourceRef = [ordered]@{ Entity = $MeasureEntity } }; Property = $MeasureProperty } }; direction = 'Descending' }); isDefaultSort = $true }
	}
	$axisStyle = New-DarkAxisStyle
	$objects = [ordered]@{
		labels = @([ordered]@{ properties = [ordered]@{ show = LiteralExpr 'true'; color = SolidColorExpr $C_TEXT_SECONDARY; fontSize = LiteralExpr '8D' } })
		legend = @([ordered]@{ properties = [ordered]@{ show = LiteralExpr 'false' } })
		dataPoint = @([ordered]@{ properties = [ordered]@{ fill = @{ solid = @{ color = LiteralExpr (Quote-Text $Color) } } } })
	}
	$axisStyle.Keys | ForEach-Object { $objects[$_] = $axisStyle[$_] }
	if ($VisualType -eq 'lineChart') {
		$objects.lineStyles = @([ordered]@{ properties = [ordered]@{ showMarker = LiteralExpr 'true'; strokeWidth = LiteralExpr '3D' } })
	}
	$containerObj = New-DarkContainerStyle
	$containerObj.title = @((New-VisualContainerTitle -Title $Title))
	return [ordered]@{
		'$schema' = 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/visualContainer/2.2.0/schema.json'
		name = $Name; position = $Position
		visual = [ordered]@{ visualType = $VisualType; query = $query; objects = $objects; visualContainerObjects = $containerObj; drillFilterOtherVisuals = $true }
	}
}

function New-DonutVisual {
	param([string]$Name, [hashtable]$Position, [string]$CategoryEntity, [string]$CategoryProperty,
		[string]$MeasureEntity, [string]$MeasureProperty, [string]$Title)
	$catProj = New-ColumnProjection -Entity $CategoryEntity -Property $CategoryProperty -Active
	$mProj = New-MeasureProjection -Entity $MeasureEntity -Property $MeasureProperty
	$containerObj = New-DarkContainerStyle
	$containerObj.title = @((New-VisualContainerTitle -Title $Title))
	return [ordered]@{
		'$schema' = 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/visualContainer/2.2.0/schema.json'
		name = $Name; position = $Position
		visual = [ordered]@{
			visualType = 'donutChart'
			query = [ordered]@{ queryState = [ordered]@{ Category = [ordered]@{ projections = @($catProj) }; Y = [ordered]@{ projections = @($mProj) } } }
			objects = [ordered]@{
				labels = @([ordered]@{ properties = [ordered]@{ show = LiteralExpr 'true'; color = SolidColorExpr $C_TEXT_SECONDARY; fontSize = LiteralExpr '9D'; labelStyle = LiteralExpr (Quote-Text 'Both') } })
				legend = @([ordered]@{ properties = [ordered]@{ show = LiteralExpr 'true'; labelColor = SolidColorExpr $C_TEXT_SECONDARY; fontSize = LiteralExpr '9D'; position = LiteralExpr (Quote-Text 'Bottom') } })
			}
			visualContainerObjects = $containerObj
			drillFilterOtherVisuals = $true
		}
	}
}

function New-ComboChartVisual {
	param([string]$Name, [hashtable]$Position, [string]$CategoryEntity, [string]$CategoryProperty,
		[string]$MeasureEntity, [string]$ColumnMeasure, [string]$LineMeasure, [string]$Title, [string]$ColumnColor, [string]$LineColor, [string]$LineFormat)
	$catProj = New-ColumnProjection -Entity $CategoryEntity -Property $CategoryProperty -Active
	$yProj = New-MeasureProjection -Entity $MeasureEntity -Property $ColumnMeasure
	$y2Proj = New-MeasureProjection -Entity $MeasureEntity -Property $LineMeasure -Format $LineFormat
	$colRef = "$MeasureEntity.$ColumnMeasure"; $lineRef = "$MeasureEntity.$LineMeasure"
	$axisStyle = New-DarkAxisStyle
	$objects = [ordered]@{
		labels = @([ordered]@{ properties = [ordered]@{ show = LiteralExpr 'true'; color = SolidColorExpr $C_TEXT_SECONDARY; fontSize = LiteralExpr '8D' } })
		legend = @([ordered]@{ properties = [ordered]@{ show = LiteralExpr 'true'; labelColor = SolidColorExpr $C_TEXT_SECONDARY; fontSize = LiteralExpr '9D' } })
		dataPoint = @(
			[ordered]@{ properties = [ordered]@{ fill = @{ solid = @{ color = LiteralExpr (Quote-Text $ColumnColor) } } }; selector = [ordered]@{ metadata = $colRef } },
			[ordered]@{ properties = [ordered]@{ fill = @{ solid = @{ color = LiteralExpr (Quote-Text $LineColor) } } }; selector = [ordered]@{ metadata = $lineRef } }
		)
	}
	$axisStyle.Keys | ForEach-Object { $objects[$_] = $axisStyle[$_] }
	$containerObj = New-DarkContainerStyle
	$containerObj.title = @((New-VisualContainerTitle -Title $Title))
	return [ordered]@{
		'$schema' = 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/visualContainer/2.2.0/schema.json'
		name = $Name; position = $Position
		visual = [ordered]@{
			visualType = 'lineClusteredColumnComboChart'
			query = [ordered]@{ queryState = [ordered]@{ Category = [ordered]@{ projections = @($catProj) }; Y = [ordered]@{ projections = @($yProj) }; Y2 = [ordered]@{ projections = @($y2Proj) } } }
			objects = $objects; visualContainerObjects = $containerObj; drillFilterOtherVisuals = $true
		}
	}
}

# ── Page & Structure ──
function New-PageDefinition {
	param([string]$PageId, [string]$DisplayName)
	return [ordered]@{
		'$schema' = 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/page/2.1.0/schema.json'
		name = $PageId; displayName = $DisplayName; displayOption = 'FitToPage'; height = 720; width = 1280
		objects = [ordered]@{ background = @([ordered]@{ properties = [ordered]@{ color = SolidColorExpr $C_BG_PAGE; transparency = LiteralExpr '0D' } }) }
	}
}

function Set-PlatformFile { param([string]$Path, [string]$Type, [string]$DisplayName); Write-Json -Path $Path -Object ([ordered]@{ '$schema'='https://developer.microsoft.com/json-schemas/fabric/gitIntegration/platformProperties/2.0.0/schema.json'; metadata=[ordered]@{type=$Type;displayName=$DisplayName}; config=[ordered]@{version='2.0';logicalId=[guid]::NewGuid().ToString()} }) }
function Set-PbipFile { param([string]$Path, [string]$ReportFolderName); Write-Json -Path $Path -Object ([ordered]@{ '$schema'='https://developer.microsoft.com/json-schemas/fabric/pbip/pbipProperties/1.0.0/schema.json'; version='1.0'; artifacts=@([ordered]@{report=[ordered]@{path=$ReportFolderName}}); settings=[ordered]@{enableAutoRecovery=$true} }) }
function Set-PbirDefinition { param([string]$Path, [string]$SemanticFolderName); Write-Json -Path $Path -Object ([ordered]@{ '$schema'='https://developer.microsoft.com/json-schemas/fabric/item/report/definitionProperties/2.0.0/schema.json'; version='4.0'; datasetReference=[ordered]@{byPath=[ordered]@{path="../$SemanticFolderName"}} }) }
function Set-SemanticModelFiles { param([string]$SemanticFolderPath, [string]$CubeName, [string]$DisplayName)
	Write-Json -Path (Join-Path $SemanticFolderPath 'definition.pbism') -Object ([ordered]@{ '$schema'='https://developer.microsoft.com/json-schemas/fabric/item/semanticModel/definitionProperties/1.0.0/schema.json'; version='4.2'; settings=[ordered]@{} })
	Write-Json -Path (Join-Path $SemanticFolderPath 'modelReference.json') -Object ([ordered]@{ '$schema'='https://developer.microsoft.com/json-schemas/fabric/item/semanticModel/modelReference/2.0.0/schema.json'; connectionString="Data Source=localhost;Initial Catalog=SSAS_DW_ESPORTS;Cube=$CubeName"; isMultiDimentional=$true; connectionType='analysisServicesDatabaseLive' })
	Set-PlatformFile -Path (Join-Path $SemanticFolderPath '.platform') -Type 'SemanticModel' -DisplayName $DisplayName
}

function Initialize-DashboardStructure {
	param([string]$DashboardName)
	$reportFolder = Join-Path $PowerBiRoot "$DashboardName.Report"
	$semanticFolder = Join-Path $PowerBiRoot "$DashboardName.SemanticModel"
	$pbipFile = Join-Path $PowerBiRoot "$DashboardName.pbip"
	$requiresTemplateCopy = ($DashboardName -ne $TemplateName)
	if ($requiresTemplateCopy -or $ForceRebuild.IsPresent) {
		if ($requiresTemplateCopy) {
			if (Test-Path $reportFolder) { Remove-Item -Path $reportFolder -Recurse -Force }
			if (Test-Path $semanticFolder) { Remove-Item -Path $semanticFolder -Recurse -Force }
			Copy-Item -Path $TemplateReportPath -Destination $reportFolder -Recurse -Force
			Copy-Item -Path $TemplateSemanticPath -Destination $semanticFolder -Recurse -Force
		}
	}
	Ensure-Directory -Path $reportFolder
	Ensure-Directory -Path $semanticFolder
	return [ordered]@{ ReportFolder=$reportFolder; SemanticFolder=$semanticFolder; PbipFile=$pbipFile }
}

# ── Build Dashboard ──
function Build-Dashboard {
	param([hashtable]$Config)
	$name = $Config.Name
	$paths = Initialize-DashboardStructure -DashboardName $name
	$rFN = "$name.Report"; $sFN = "$name.SemanticModel"
	Set-PbipFile -Path $paths.PbipFile -ReportFolderName $rFN
	Set-PbirDefinition -Path (Join-Path $paths.ReportFolder 'definition.pbir') -SemanticFolderName $sFN
	Set-PlatformFile -Path (Join-Path $paths.ReportFolder '.platform') -Type 'Report' -DisplayName $name
	Set-SemanticModelFiles -SemanticFolderPath $paths.SemanticFolder -CubeName $Config.Cube -DisplayName $name

	# Write dark theme report.json
	$reportJsonPath = Join-Path (Join-Path $paths.ReportFolder 'definition') 'report.json'
	$reportJson = [ordered]@{
		'$schema' = 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/report/3.2.0/schema.json'
		themeCollection = [ordered]@{
			baseTheme = [ordered]@{ name='CY26SU02'; reportVersionAtImport=[ordered]@{visual='2.6.0';report='3.1.0';page='2.3.0'}; type='SharedResources' }
		}
		objects = [ordered]@{
			section = @([ordered]@{ properties = [ordered]@{ verticalAlignment = LiteralExpr "'Top'" } })
			outspacePane = @([ordered]@{ properties = [ordered]@{ visible = LiteralExpr 'true' } })
		}
		resourcePackages = @([ordered]@{ name='SharedResources'; type='SharedResources'; items = @([ordered]@{ name='CY26SU02'; path='BaseThemes/CY26SU02.json'; type='BaseTheme' }) })
		settings = [ordered]@{ useStylableVisualContainerHeader=$true; exportDataMode='AllowSummarized'; defaultDrillFilterOtherVisuals=$true; allowChangeFilterTypes=$true; useEnhancedTooltips=$true; useDefaultAggregateDisplayName=$true }
	}
	Write-Json -Path $reportJsonPath -Object $reportJson

	$definitionPath = Join-Path $paths.ReportFolder 'definition'
	if (Test-Path (Join-Path $definitionPath 'pages')) { Remove-Item -Path (Join-Path $definitionPath 'pages') -Recurse -Force }
	Ensure-Directory -Path (Join-Path $definitionPath 'pages')

	$pageFolder = Join-Path (Join-Path $definitionPath 'pages') $Config.PageId
	$visualsFolder = Join-Path $pageFolder 'visuals'
	Ensure-Directory -Path $visualsFolder

	Write-Json -Path (Join-Path $pageFolder 'page.json') -Object (New-PageDefinition -PageId $Config.PageId -DisplayName $Config.PageDisplayName)
	Write-Json -Path (Join-Path (Join-Path $definitionPath 'pages') 'pages.json') -Object ([ordered]@{ '$schema'='https://developer.microsoft.com/json-schemas/fabric/item/report/definition/pagesMetadata/1.0.0/schema.json'; pageOrder=@($Config.PageId); activePageName=$Config.PageId })

	# ── Build all visuals ──
	$ME = $Config.MeasureEntity
	$visuals = [ordered]@{}

	# Title
	$visuals.v_title = New-TextboxVisual -Name 'v_title' -Position (New-Position -X 20 -Y 8 -Z 0 -Height 52 -Width 880 -TabOrder 0) -Text $Config.PageTitle -SubText $Config.PageSubtitle

	# Slicers
	$visuals.v_slicer_1 = New-SlicerVisual -Name 'v_slicer_1' -Position (New-Position -X 920 -Y 8 -Z 1 -Height 52 -Width 170 -TabOrder 1) -Entity $Config.Slicer1Entity -Property $Config.Slicer1Property -HeaderText $Config.Slicer1Text
	$visuals.v_slicer_2 = New-SlicerVisual -Name 'v_slicer_2' -Position (New-Position -X 1098 -Y 8 -Z 2 -Height 52 -Width 170 -TabOrder 2) -Entity $Config.Slicer2Entity -Property $Config.Slicer2Property -HeaderText $Config.Slicer2Text

	# KPI Cards Row (Y=68, H=72)
	$kpiW = 298; $kpiGap = 12; $kpiY = 68; $kpiH = 72
	for ($i = 0; $i -lt $Config.KPIs.Count; $i++) {
		$kpi = $Config.KPIs[$i]
		$kpiX = 20 + $i * ($kpiW + $kpiGap)
		$visuals["v_kpi_$($i+1)"] = New-CardVisual -Name "v_kpi_$($i+1)" -Position (New-Position -X $kpiX -Y $kpiY -Z (3+$i) -Height $kpiH -Width $kpiW -TabOrder (3+$i)) -MeasureEntity $ME -MeasureProperty $kpi.Measure -Title $kpi.Title -AccentColor $kpi.Color -MeasureFormat $kpi.Format
	}

	# Row 1: 3 charts (Y=150, H=270)
	$r1Y = 150; $r1H = 270; $r1W = 400; $r1Gap = 12; $zBase = 7
	for ($i = 0; $i -lt 3; $i++) {
		$ch = $Config.Row1[$i]
		$chX = 20 + $i * ($r1W + $r1Gap)
		$vName = "v_row1_$($i+1)"
		$visuals[$vName] = switch ($ch.Type) {
			'combo' { New-ComboChartVisual -Name $vName -Position (New-Position -X $chX -Y $r1Y -Z ($zBase+$i) -Height $r1H -Width $r1W -TabOrder ($zBase+$i)) -CategoryEntity $ch.CatEntity -CategoryProperty $ch.CatProp -MeasureEntity $ME -ColumnMeasure $ch.ColMeasure -LineMeasure $ch.LineMeasure -Title $ch.Title -ColumnColor $ch.ColColor -LineColor $ch.LineColor -LineFormat $ch.LineFormat }
			'donut' { New-DonutVisual -Name $vName -Position (New-Position -X $chX -Y $r1Y -Z ($zBase+$i) -Height $r1H -Width $r1W -TabOrder ($zBase+$i)) -CategoryEntity $ch.CatEntity -CategoryProperty $ch.CatProp -MeasureEntity $ME -MeasureProperty $ch.Measure -Title $ch.Title }
			default { New-ChartVisual -Name $vName -Position (New-Position -X $chX -Y $r1Y -Z ($zBase+$i) -Height $r1H -Width $r1W -TabOrder ($zBase+$i)) -VisualType $ch.VisualType -CategoryEntity $ch.CatEntity -CategoryProperty $ch.CatProp -MeasureEntity $ME -MeasureProperty $ch.Measure -Title $ch.Title -Color $ch.Color -SortDescending:([bool]$ch.SortDesc) -MeasureFormat $ch.MeasureFormat }
		}
	}

	# Row 2: 2 charts (Y=430, H=278)
	$r2Y = 430; $r2H = 278; $r2W = 614; $r2Gap = 12; $zBase2 = 10
	for ($i = 0; $i -lt 2; $i++) {
		$ch = $Config.Row2[$i]
		$chX = 20 + $i * ($r2W + $r2Gap)
		$vName = "v_row2_$($i+1)"
		$visuals[$vName] = switch ($ch.Type) {
			'combo' { New-ComboChartVisual -Name $vName -Position (New-Position -X $chX -Y $r2Y -Z ($zBase2+$i) -Height $r2H -Width $r2W -TabOrder ($zBase2+$i)) -CategoryEntity $ch.CatEntity -CategoryProperty $ch.CatProp -MeasureEntity $ME -ColumnMeasure $ch.ColMeasure -LineMeasure $ch.LineMeasure -Title $ch.Title -ColumnColor $ch.ColColor -LineColor $ch.LineColor -LineFormat $ch.LineFormat }
			'donut' { New-DonutVisual -Name $vName -Position (New-Position -X $chX -Y $r2Y -Z ($zBase2+$i) -Height $r2H -Width $r2W -TabOrder ($zBase2+$i)) -CategoryEntity $ch.CatEntity -CategoryProperty $ch.CatProp -MeasureEntity $ME -MeasureProperty $ch.Measure -Title $ch.Title }
			default { New-ChartVisual -Name $vName -Position (New-Position -X $chX -Y $r2Y -Z ($zBase2+$i) -Height $r2H -Width $r2W -TabOrder ($zBase2+$i)) -VisualType $ch.VisualType -CategoryEntity $ch.CatEntity -CategoryProperty $ch.CatProp -MeasureEntity $ME -MeasureProperty $ch.Measure -Title $ch.Title -Color $ch.Color -SortDescending:([bool]$ch.SortDesc) -MeasureFormat $ch.MeasureFormat }
		}
	}

	foreach ($vn in $visuals.Keys) {
		$folder = Join-Path $visualsFolder $vn
		Ensure-Directory -Path $folder
		Write-Json -Path (Join-Path $folder 'visual.json') -Object $visuals[$vn]
	}
	Write-Host "Dashboard generado: $name" -ForegroundColor Green
}

# ══════════════════════════════════════════════════════════
# ══  DASHBOARD CONFIGURATIONS  ═══════════════════════════
# ══════════════════════════════════════════════════════════

$Dashboards = @(
	# ── DM1: Ingresos y Monetizacion ──
	[ordered]@{
		Name = 'Dashboard_DM1_Ingresos'; Cube = 'Cubo_Ingresos'; MeasureEntity = 'Fact Ingresos'
		PageId = 'pag_dm1_ingresos'; PageDisplayName = 'PAG_DM1_Ingresos'
		PageTitle = 'Ingresos y Monetizacion'; PageSubtitle = 'Cubo_Ingresos  |  DW_ESPORTS  |  Vista Ejecutiva'
		Slicer1Entity = 'DIM_Tiempo'; Slicer1Property = 'Anio'; Slicer1Text = 'Anio'
		Slicer2Entity = 'DIM_Region_Ingresos'; Slicer2Property = 'Nombre Region'; Slicer2Text = 'Region'
		KPIs = @(
			@{ Measure = 'Monto Real';          Title = 'Ingresos Reales';    Color = $C_CYAN;    Format = $null },
			@{ Measure = 'Meta Ingresos';        Title = 'Meta de Ingresos';   Color = $C_AMBER;   Format = $null },
			@{ Measure = 'Cantidad';             Title = 'Transacciones';      Color = $C_EMERALD; Format = $null },
			@{ Measure = 'Creditos Otorgados';   Title = 'Creditos Otorgados'; Color = $C_VIOLET;  Format = $null }
		)
		Row1 = @(
			@{ Type='chart'; VisualType='clusteredBarChart'; CatEntity='DIM_Region_Ingresos'; CatProp='Nombre Region'; Measure='Monto Real'; Title='Ingresos por Region'; Color=$C_CYAN; SortDesc=$true },
			@{ Type='combo'; CatEntity='DIM_Tiempo'; CatProp='Mes Nombre'; ColMeasure='Monto Real'; LineMeasure='Meta Ingresos'; Title='Real vs Meta por Mes'; ColColor=$C_CYAN; LineColor=$C_AMBER; LineFormat=$null },
			@{ Type='donut'; CatEntity='DIM_Tipo_Item'; CatProp='Nombre Tipo'; Measure='Monto Real'; Title='Ingresos por Tipo de Item' }
		)
		Row2 = @(
			@{ Type='chart'; VisualType='clusteredColumnChart'; CatEntity='DIM_Origen_Transaccion'; CatProp='Nombre Origen'; Measure='Monto Real'; Title='Ingresos por Origen de Transaccion'; Color=$C_VIOLET; SortDesc=$true },
			@{ Type='chart'; VisualType='lineChart'; CatEntity='DIM_Tiempo'; CatProp='Mes Nombre'; Measure='Monto Real'; Title='Tendencia Mensual de Ingresos'; Color=$C_CYAN; SortDesc=$false }
		)
	},
	# ── DM2: Comportamiento de Usuario ──
	[ordered]@{
		Name = 'Dashboard_DM2_Comportamiento'; Cube = 'Cubo_Comportamiento'; MeasureEntity = 'Fact Actividad Usuario'
		PageId = 'pag_dm2_comportamiento'; PageDisplayName = 'PAG_DM2_Comportamiento'
		PageTitle = 'Comportamiento de Usuario'; PageSubtitle = 'Cubo_Comportamiento  |  DW_ESPORTS  |  Actividad y Engagement'
		Slicer1Entity = 'DIM_Tiempo'; Slicer1Property = 'Anio'; Slicer1Text = 'Anio'
		Slicer2Entity = 'DIM_Juego'; Slicer2Property = 'Nombre Juego'; Slicer2Text = 'Juego'
		KPIs = @(
			@{ Measure = 'Cantidad Eventos';    Title = 'Total Eventos';      Color = $C_CYAN;    Format = $null },
			@{ Measure = 'Horas Jugadas';       Title = 'Horas Jugadas';      Color = $C_EMERALD; Format = $null },
			@{ Measure = 'Victorias';           Title = 'Victorias';          Color = $C_AMBER;   Format = $null },
			@{ Measure = 'Tiempo Sesion Seg';   Title = 'Sesion Total (seg)'; Color = $C_VIOLET;  Format = $null }
		)
		Row1 = @(
			@{ Type='chart'; VisualType='clusteredColumnChart'; CatEntity='DIM_Tipo_Evento'; CatProp='Nombre Evento'; Measure='Cantidad Eventos'; Title='Eventos por Tipo'; Color=$C_CYAN; SortDesc=$true },
			@{ Type='chart'; VisualType='clusteredBarChart'; CatEntity='DIM_Usuario'; CatProp='Nickname'; Measure='Xp Acumulado'; Title='XP Acumulado por Usuario'; Color=$C_VIOLET; SortDesc=$true },
			@{ Type='chart'; VisualType='clusteredColumnChart'; CatEntity='DIM_Pais'; CatProp='Nombre Pais'; Measure='Cantidad Eventos'; Title='Actividad por Pais'; Color=$C_EMERALD; SortDesc=$true }
		)
		Row2 = @(
			@{ Type='chart'; VisualType='clusteredBarChart'; CatEntity='DIM_Juego'; CatProp='Nombre Juego'; Measure='Horas Jugadas'; Title='Horas Jugadas por Juego'; Color=$C_AMBER; SortDesc=$true },
			@{ Type='chart'; VisualType='lineChart'; CatEntity='DIM_Pais'; CatProp='Nombre Pais'; Measure='Tiempo Sesion Seg'; Title='Tiempo de Sesion por Pais'; Color=$C_CYAN; SortDesc=$false }
		)
	},
	# ── DM3: Calidad de Torneos ──
	[ordered]@{
		Name = 'Dashboard_DM3_Torneos'; Cube = 'Cubo_Torneos'; MeasureEntity = 'Fact Torneos'
		PageId = 'pag_dm3_torneos'; PageDisplayName = 'PAG_DM3_Torneos'
		PageTitle = 'Calidad de Torneos'; PageSubtitle = 'Cubo_Torneos  |  DW_ESPORTS  |  Competencia y Satisfaccion'
		Slicer1Entity = 'DIM_Tiempo'; Slicer1Property = 'Anio'; Slicer1Text = 'Anio'
		Slicer2Entity = 'DIM_Plataforma'; Slicer2Property = 'Nombre Plataforma'; Slicer2Text = 'Plataforma'
		KPIs = @(
			@{ Measure = 'Cantidad Torneos';        Title = 'Total Torneos';     Color = $C_CYAN;    Format = $null },
			@{ Measure = 'Total Inscritos';          Title = 'Inscritos';         Color = $C_EMERALD; Format = $null },
			@{ Measure = 'Fondo Premios';            Title = 'Fondo de Premios';  Color = $C_AMBER;   Format = $null },
			@{ Measure = 'Calificacion Promedio';    Title = 'Calificacion Prom'; Color = $C_VIOLET;  Format = '0.00' }
		)
		Row1 = @(
			@{ Type='chart'; VisualType='clusteredColumnChart'; CatEntity='DIM_Juego'; CatProp='Nombre Juego'; Measure='Total Inscritos'; Title='Inscritos por Juego'; Color=$C_CYAN; SortDesc=$true },
			@{ Type='chart'; VisualType='clusteredBarChart'; CatEntity='DIM_Tipo_Torneo'; CatProp='Nombre Tipo'; Measure='Calificacion Promedio'; Title='Calificacion por Tipo de Torneo'; Color=$C_EMERALD; SortDesc=$false; MeasureFormat='0.00' },
			@{ Type='chart'; VisualType='clusteredColumnChart'; CatEntity='DIM_Plataforma'; CatProp='Nombre Plataforma'; Measure='Pct Recomendacion'; Title='Recomendacion por Plataforma'; Color=$C_AMBER; SortDesc=$false; MeasureFormat='0.00' }
		)
		Row2 = @(
			@{ Type='combo'; CatEntity='DIM_Region_Torneo'; CatProp='Nombre Region'; ColMeasure='Fondo Premios'; LineMeasure='Comision'; Title='Fondo vs Comision por Region'; ColColor=$C_CYAN; LineColor=$C_ROSE; LineFormat=$null },
			@{ Type='combo'; CatEntity='DIM_Tipo_Torneo'; CatProp='Nombre Tipo'; ColMeasure='Total Inscritos'; LineMeasure='Capacidad'; Title='Inscritos vs Capacidad por Tipo'; ColColor=$C_VIOLET; LineColor=$C_SLATE; LineFormat=$null }
		)
	},
	# ── DM4: Seguridad y Auditoria ──
	[ordered]@{
		Name = 'Dashboard_DM4_Auditoria'; Cube = 'Cubo_Auditoria'; MeasureEntity = 'Fact Auditoria'
		PageId = 'pag_dm4_auditoria'; PageDisplayName = 'PAG_DM4_Auditoria'
		PageTitle = 'Seguridad y Auditoria'; PageSubtitle = 'Cubo_Auditoria  |  DW_ESPORTS  |  Control y Riesgo Operativo'
		Slicer1Entity = 'DIM_Tiempo'; Slicer1Property = 'Anio'; Slicer1Text = 'Anio'
		Slicer2Entity = 'DIM_Operacion'; Slicer2Property = 'Nombre Operacion'; Slicer2Text = 'Operacion'
		KPIs = @(
			@{ Measure = 'Total Eventos';           Title = 'Eventos Auditados';     Color = $C_CYAN;    Format = $null },
			@{ Measure = 'Tickets Soporte';          Title = 'Tickets Soporte';       Color = $C_AMBER;   Format = $null },
			@{ Measure = 'Tickets Resueltos';        Title = 'Tickets Resueltos';     Color = $C_EMERALD; Format = $null },
			@{ Measure = 'Registros Restringidos';   Title = 'Registros Restringidos'; Color = $C_ROSE;    Format = $null }
		)
		Row1 = @(
			@{ Type='chart'; VisualType='clusteredColumnChart'; CatEntity='DIM_Operacion'; CatProp='Nombre Operacion'; Measure='Total Eventos'; Title='Eventos por Operacion'; Color=$C_CYAN; SortDesc=$true },
			@{ Type='chart'; VisualType='clusteredBarChart'; CatEntity='DIM_Pais_Registro'; CatProp='Nombre Pais'; Measure='Registros Restringidos'; Title='Restringidos por Pais'; Color=$C_ROSE; SortDesc=$true },
			@{ Type='chart'; VisualType='clusteredColumnChart'; CatEntity='DIM_Tabla_Auditada'; CatProp='Nombre Tabla'; Measure='Total Eventos'; Title='Eventos por Tabla Auditada'; Color=$C_VIOLET; SortDesc=$true }
		)
		Row2 = @(
			@{ Type='chart'; VisualType='clusteredBarChart'; CatEntity='DIM_Rol_Usuario'; CatProp='Nombre Rol'; Measure='Tickets Soporte'; Title='Tickets por Rol de Usuario'; Color=$C_AMBER; SortDesc=$true },
			@{ Type='combo'; CatEntity='DIM_Operacion'; CatProp='Nombre Operacion'; ColMeasure='Total Eventos'; LineMeasure='Registros Restringidos'; Title='Eventos vs Restringidos por Operacion'; ColColor=$C_CYAN; LineColor=$C_ROSE; LineFormat=$null }
		)
	}
)

foreach ($dashboard in $Dashboards) { Build-Dashboard -Config $dashboard }

Write-Host ''
Write-Host 'Listo. Se generaron los 4 dashboards PBIP profesionales (Dark Mode) en DataWarehouse/PowerBI.' -ForegroundColor Cyan
Write-Host 'Abre cada archivo .pbip en Power BI Desktop para revisar campos y ajustar detalles finales.' -ForegroundColor Cyan

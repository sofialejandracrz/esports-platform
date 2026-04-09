[CmdletBinding()]
param(
	[switch]$ForceRebuild
)

$ErrorActionPreference = 'Stop'

$PowerBiRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$TemplateName = 'Dashboard_DM1_Ingresos'

$TemplateReportPath = Join-Path $PowerBiRoot "$TemplateName.Report"
$TemplateSemanticPath = Join-Path $PowerBiRoot "$TemplateName.SemanticModel"
$TemplatePbipPath = Join-Path $PowerBiRoot "$TemplateName.pbip"

if (-not (Test-Path $TemplateReportPath)) {
	throw "No existe plantilla de reporte: $TemplateReportPath"
}
if (-not (Test-Path $TemplateSemanticPath)) {
	throw "No existe plantilla de modelo semantico: $TemplateSemanticPath"
}
if (-not (Test-Path $TemplatePbipPath)) {
	throw "No existe plantilla PBIP: $TemplatePbipPath"
}

function Ensure-Directory {
	param([Parameter(Mandatory = $true)][string]$Path)
	if (-not (Test-Path $Path)) {
		New-Item -ItemType Directory -Path $Path -Force | Out-Null
	}
}

function Write-Json {
	param(
		[Parameter(Mandatory = $true)][string]$Path,
		[Parameter(Mandatory = $true)][object]$Object
	)
	$json = $Object | ConvertTo-Json -Depth 100
	$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
	[System.IO.File]::WriteAllText($Path, $json, $utf8NoBom)
}

function New-Id {
	return ([guid]::NewGuid().ToString('N').Substring(0, 20))
}

function Quote-Text {
	param([Parameter(Mandatory = $true)][string]$Text)
	return "'" + $Text.Replace("'", "''") + "'"
}

function LiteralExpr {
	param([Parameter(Mandatory = $true)][string]$Value)
	return @{ expr = @{ Literal = @{ Value = $Value } } }
}

function SolidColorExpr {
	param([Parameter(Mandatory = $true)][string]$HexColor)
	return @{ solid = @{ color = LiteralExpr (Quote-Text $HexColor) } }
}

function New-Position {
	param(
		[double]$X,
		[double]$Y,
		[double]$Z,
		[double]$Height,
		[double]$Width,
		[double]$TabOrder
	)

	$position = [ordered]@{
		x = $X
		y = $Y
		z = $Z
		height = $Height
		width = $Width
	}
	if ($TabOrder -ge 0) {
		$position.tabOrder = $TabOrder
	}
	return $position
}

function New-ColumnProjection {
	param(
		[Parameter(Mandatory = $true)][string]$Entity,
		[Parameter(Mandatory = $true)][string]$Property,
		[switch]$Active,
		[string]$Format
	)

	$proj = [ordered]@{
		field = [ordered]@{
			Column = [ordered]@{
				Expression = [ordered]@{
					SourceRef = [ordered]@{
						Entity = $Entity
					}
				}
				Property = $Property
			}
		}
		queryRef = "$Entity.$Property"
	}

	if ($Active.IsPresent) {
		$proj.active = $true
	}
	if ($Format) {
		$proj.format = $Format
	}

	return $proj
}

function New-MeasureProjection {
	param(
		[Parameter(Mandatory = $true)][string]$Entity,
		[Parameter(Mandatory = $true)][string]$Property,
		[string]$Format
	)

	$proj = [ordered]@{
		field = [ordered]@{
			Measure = [ordered]@{
				Expression = [ordered]@{
					SourceRef = [ordered]@{
						Entity = $Entity
					}
				}
				Property = $Property
			}
		}
		queryRef = "$Entity.$Property"
	}

	if ($Format) {
		$proj.format = $Format
	}

	return $proj
}

function New-VisualContainerTitle {
	param(
		[Parameter(Mandatory = $true)][string]$Title,
		[string]$FontColor = '#1F2D3D',
		[string]$FontSize = '12D',
		[string]$FontFamily = "'''Segoe UI Semibold'', wf_segoe-ui_semibold, helvetica, arial, sans-serif"
	)

	return [ordered]@{
		properties = [ordered]@{
			show = LiteralExpr 'true'
			text = LiteralExpr (Quote-Text $Title)
			fontColor = SolidColorExpr $FontColor
			fontSize = LiteralExpr $FontSize
			fontFamily = LiteralExpr (Quote-Text $FontFamily)
		}
	}
}

function New-VisualContainerStyle {
	param()
	return [ordered]@{
		background = @(
			[ordered]@{
				properties = [ordered]@{
					show = LiteralExpr 'true'
					transparency = LiteralExpr '0L'
				}
			}
		)
		border = @(
			[ordered]@{
				properties = [ordered]@{
					show = LiteralExpr 'true'
					color = SolidColorExpr '#D9E2EC'
				}
			}
		)
	}
}

function New-TextboxVisual {
	param(
		[Parameter(Mandatory = $true)][string]$Name,
		[Parameter(Mandatory = $true)][hashtable]$Position,
		[Parameter(Mandatory = $true)][string]$Text,
		[string]$FontSize = '20pt',
		[string]$Color = '#0f1e3a'
	)

	return [ordered]@{
		'$schema' = 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/visualContainer/2.7.0/schema.json'
		name = $Name
		position = $Position
		visual = [ordered]@{
			visualType = 'textbox'
			objects = [ordered]@{
				general = @(
					[ordered]@{
						properties = [ordered]@{
							paragraphs = @(
								[ordered]@{
									textRuns = @(
										[ordered]@{
											value = $Text
											textStyle = [ordered]@{
												fontSize = $FontSize
												color = $Color
											}
										}
									)
								}
							)
						}
					}
				)
			}
			drillFilterOtherVisuals = $true
		}
	}
}

function New-SlicerVisual {
	param(
		[Parameter(Mandatory = $true)][string]$Name,
		[Parameter(Mandatory = $true)][hashtable]$Position,
		[Parameter(Mandatory = $true)][string]$Entity,
		[Parameter(Mandatory = $true)][string]$Property,
		[Parameter(Mandatory = $true)][string]$HeaderText
	)

	$projection = New-ColumnProjection -Entity $Entity -Property $Property -Active

	return [ordered]@{
		'$schema' = 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/visualContainer/2.2.0/schema.json'
		name = $Name
		position = $Position
		visual = [ordered]@{
			visualType = 'slicer'
			query = [ordered]@{
				queryState = [ordered]@{
					Values = [ordered]@{
						projections = @($projection)
					}
				}
			}
			objects = [ordered]@{
				data = @(
					[ordered]@{
						properties = [ordered]@{
							mode = LiteralExpr (Quote-Text 'Dropdown')
						}
					}
				)
				header = @(
					[ordered]@{
						properties = [ordered]@{
							show = LiteralExpr 'true'
							textSize = LiteralExpr '10D'
							fontFamily = LiteralExpr (Quote-Text "'''Segoe UI Semibold'', wf_segoe-ui_semibold, helvetica, arial, sans-serif")
						}
					}
				)
				general = @(
					[ordered]@{
						properties = [ordered]@{
							selfFilterEnabled = LiteralExpr 'true'
						}
					}
				)
				selection = @(
					[ordered]@{
						properties = [ordered]@{
							selectAllCheckboxEnabled = LiteralExpr 'false'
						}
					}
				)
				title = @(
					[ordered]@{
						properties = [ordered]@{
							show = LiteralExpr 'true'
							text = LiteralExpr (Quote-Text $HeaderText)
						}
					}
				)
			}
			visualContainerObjects = [ordered]@{
				title = @(
					(New-VisualContainerTitle -Title $HeaderText -FontSize '11D')
				)
				background = @(
					[ordered]@{
						properties = [ordered]@{
							show = LiteralExpr 'true'
							transparency = LiteralExpr '0L'
						}
					}
				)
				border = @(
					[ordered]@{
						properties = [ordered]@{
							show = LiteralExpr 'true'
							color = SolidColorExpr '#D9E2EC'
						}
					}
				)
			}
			drillFilterOtherVisuals = $true
		}
	}
}

function New-ChartVisual {
	param(
		[Parameter(Mandatory = $true)][string]$Name,
		[Parameter(Mandatory = $true)][hashtable]$Position,
		[Parameter(Mandatory = $true)][string]$VisualType,
		[Parameter(Mandatory = $true)][string]$CategoryEntity,
		[Parameter(Mandatory = $true)][string]$CategoryProperty,
		[Parameter(Mandatory = $true)][string]$MeasureEntity,
		[Parameter(Mandatory = $true)][string]$MeasureProperty,
		[Parameter(Mandatory = $true)][string]$Title,
		[Parameter(Mandatory = $true)][string]$Color,
		[switch]$SortDescending,
		[string]$MeasureFormat
	)

	$categoryProjection = New-ColumnProjection -Entity $CategoryEntity -Property $CategoryProperty -Active
	$measureProjection = New-MeasureProjection -Entity $MeasureEntity -Property $MeasureProperty -Format $MeasureFormat

	$query = [ordered]@{
		queryState = [ordered]@{
			Category = [ordered]@{
				projections = @($categoryProjection)
			}
			Y = [ordered]@{
				projections = @($measureProjection)
			}
		}
	}

	if ($SortDescending.IsPresent) {
		$query.sortDefinition = [ordered]@{
			sort = @(
				[ordered]@{
					field = [ordered]@{
						Measure = [ordered]@{
							Expression = [ordered]@{
								SourceRef = [ordered]@{
									Entity = $MeasureEntity
								}
							}
							Property = $MeasureProperty
						}
					}
					direction = 'Descending'
				}
			)
			isDefaultSort = $true
		}
	}

	$objects = [ordered]@{
		labels = @(
			[ordered]@{
				properties = [ordered]@{
					show = LiteralExpr 'true'
				}
			}
		)
		legend = @(
			[ordered]@{
				properties = [ordered]@{
					show = LiteralExpr 'false'
				}
			}
		)
		dataPoint = @(
			[ordered]@{
				properties = [ordered]@{
					fill = [ordered]@{
						solid = [ordered]@{
							color = LiteralExpr (Quote-Text $Color)
						}
					}
				}
			}
		)
	}

	if ($VisualType -eq 'lineChart') {
		$objects.lineStyles = @(
			[ordered]@{
				properties = [ordered]@{
					showMarker = LiteralExpr 'true'
					strokeWidth = LiteralExpr '2D'
				}
			}
		)
	}

	$containerObjects = New-VisualContainerStyle
	$containerObjects.title = @(
		(New-VisualContainerTitle -Title $Title)
	)

	return [ordered]@{
		'$schema' = 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/visualContainer/2.2.0/schema.json'
		name = $Name
		position = $Position
		visual = [ordered]@{
			visualType = $VisualType
			query = $query
			objects = $objects
			visualContainerObjects = $containerObjects
			drillFilterOtherVisuals = $true
		}
	}
}

function New-ComboChartVisual {
	param(
		[Parameter(Mandatory = $true)][string]$Name,
		[Parameter(Mandatory = $true)][hashtable]$Position,
		[Parameter(Mandatory = $true)][string]$CategoryEntity,
		[Parameter(Mandatory = $true)][string]$CategoryProperty,
		[Parameter(Mandatory = $true)][string]$MeasureEntity,
		[Parameter(Mandatory = $true)][string]$ColumnMeasure,
		[Parameter(Mandatory = $true)][string]$LineMeasure,
		[Parameter(Mandatory = $true)][string]$Title,
		[Parameter(Mandatory = $true)][string]$ColumnColor,
		[Parameter(Mandatory = $true)][string]$LineColor,
		[string]$LineFormat
	)

	$categoryProjection = New-ColumnProjection -Entity $CategoryEntity -Property $CategoryProperty -Active
	$yProjection = New-MeasureProjection -Entity $MeasureEntity -Property $ColumnMeasure
	$y2Projection = New-MeasureProjection -Entity $MeasureEntity -Property $LineMeasure -Format $LineFormat

	$lineQueryRef = "$MeasureEntity.$LineMeasure"
	$columnQueryRef = "$MeasureEntity.$ColumnMeasure"

	$objects = [ordered]@{
		labels = @(
			[ordered]@{
				properties = [ordered]@{
					show = LiteralExpr 'true'
				}
			}
		)
		legend = @(
			[ordered]@{
				properties = [ordered]@{
					show = LiteralExpr 'false'
				}
			}
		)
		dataPoint = @(
			[ordered]@{
				properties = [ordered]@{
					fill = [ordered]@{
						solid = [ordered]@{
							color = LiteralExpr (Quote-Text $ColumnColor)
						}
					}
				}
				selector = [ordered]@{
					metadata = $columnQueryRef
				}
			},
			[ordered]@{
				properties = [ordered]@{
					fill = [ordered]@{
						solid = [ordered]@{
							color = LiteralExpr (Quote-Text $LineColor)
						}
					}
				}
				selector = [ordered]@{
					metadata = $lineQueryRef
				}
			}
		)
	}

	$containerObjects = New-VisualContainerStyle
	$containerObjects.title = @(
		(New-VisualContainerTitle -Title $Title)
	)

	return [ordered]@{
		'$schema' = 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/visualContainer/2.2.0/schema.json'
		name = $Name
		position = $Position
		visual = [ordered]@{
			visualType = 'lineClusteredColumnComboChart'
			query = [ordered]@{
				queryState = [ordered]@{
					Category = [ordered]@{
						projections = @($categoryProjection)
					}
					Y = [ordered]@{
						projections = @($yProjection)
					}
					Y2 = [ordered]@{
						projections = @($y2Projection)
					}
				}
			}
			objects = $objects
			visualContainerObjects = $containerObjects
			drillFilterOtherVisuals = $true
		}
	}
}

function New-PageDefinition {
	param(
		[Parameter(Mandatory = $true)][string]$PageId,
		[Parameter(Mandatory = $true)][string]$DisplayName
	)

	return [ordered]@{
		'$schema' = 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/page/2.1.0/schema.json'
		name = $PageId
		displayName = $DisplayName
		displayOption = 'FitToPage'
		height = 720
		width = 1280
		objects = [ordered]@{
			background = @(
				[ordered]@{
					properties = [ordered]@{
						color = [ordered]@{
							solid = [ordered]@{
								color = LiteralExpr (Quote-Text '#F3F5F9')
							}
						}
						transparency = LiteralExpr '0D'
					}
				}
			)
		}
	}
}

function Set-PlatformFile {
	param(
		[Parameter(Mandatory = $true)][string]$Path,
		[Parameter(Mandatory = $true)][string]$Type,
		[Parameter(Mandatory = $true)][string]$DisplayName
	)

	$platform = [ordered]@{
		'$schema' = 'https://developer.microsoft.com/json-schemas/fabric/gitIntegration/platformProperties/2.0.0/schema.json'
		metadata = [ordered]@{
			type = $Type
			displayName = $DisplayName
		}
		config = [ordered]@{
			version = '2.0'
			logicalId = [guid]::NewGuid().ToString()
		}
	}
	Write-Json -Path $Path -Object $platform
}

function Set-PbipFile {
	param(
		[Parameter(Mandatory = $true)][string]$Path,
		[Parameter(Mandatory = $true)][string]$ReportFolderName
	)

	$pbip = [ordered]@{
		'$schema' = 'https://developer.microsoft.com/json-schemas/fabric/pbip/pbipProperties/1.0.0/schema.json'
		version = '1.0'
		artifacts = @(
			[ordered]@{
				report = [ordered]@{
					path = $ReportFolderName
				}
			}
		)
		settings = [ordered]@{
			enableAutoRecovery = $true
		}
	}
	Write-Json -Path $Path -Object $pbip
}

function Set-PbirDefinition {
	param(
		[Parameter(Mandatory = $true)][string]$Path,
		[Parameter(Mandatory = $true)][string]$SemanticFolderName
	)

	$pbir = [ordered]@{
		'$schema' = 'https://developer.microsoft.com/json-schemas/fabric/item/report/definitionProperties/2.0.0/schema.json'
		version = '4.0'
		datasetReference = [ordered]@{
			byPath = [ordered]@{
				path = "../$SemanticFolderName"
			}
		}
	}
	Write-Json -Path $Path -Object $pbir
}

function Set-SemanticModelFiles {
	param(
		[Parameter(Mandatory = $true)][string]$SemanticFolderPath,
		[Parameter(Mandatory = $true)][string]$CubeName,
		[Parameter(Mandatory = $true)][string]$DisplayName
	)

	$pbism = [ordered]@{
		'$schema' = 'https://developer.microsoft.com/json-schemas/fabric/item/semanticModel/definitionProperties/1.0.0/schema.json'
		version = '4.2'
		settings = [ordered]@{}
	}
	Write-Json -Path (Join-Path $SemanticFolderPath 'definition.pbism') -Object $pbism

	$modelReference = [ordered]@{
		'$schema' = 'https://developer.microsoft.com/json-schemas/fabric/item/semanticModel/modelReference/2.0.0/schema.json'
		connectionString = "Data Source=localhost;Initial Catalog=SSAS_DW_ESPORTS;Cube=$CubeName"
		isMultiDimentional = $true
		connectionType = 'analysisServicesDatabaseLive'
	}
	Write-Json -Path (Join-Path $SemanticFolderPath 'modelReference.json') -Object $modelReference

	Set-PlatformFile -Path (Join-Path $SemanticFolderPath '.platform') -Type 'SemanticModel' -DisplayName $DisplayName
}

function Initialize-DashboardStructure {
	param(
		[Parameter(Mandatory = $true)][string]$DashboardName
	)

	$reportFolder = Join-Path $PowerBiRoot "$DashboardName.Report"
	$semanticFolder = Join-Path $PowerBiRoot "$DashboardName.SemanticModel"
	$pbipFile = Join-Path $PowerBiRoot "$DashboardName.pbip"

	$requiresTemplateCopy = ($DashboardName -ne $TemplateName)
	if ($requiresTemplateCopy -or $ForceRebuild.IsPresent) {
		if ($requiresTemplateCopy) {
			if (Test-Path $reportFolder) {
				Remove-Item -Path $reportFolder -Recurse -Force
			}
			if (Test-Path $semanticFolder) {
				Remove-Item -Path $semanticFolder -Recurse -Force
			}
			Copy-Item -Path $TemplateReportPath -Destination $reportFolder -Recurse -Force
			Copy-Item -Path $TemplateSemanticPath -Destination $semanticFolder -Recurse -Force
		}
	}

	Ensure-Directory -Path $reportFolder
	Ensure-Directory -Path $semanticFolder

	return [ordered]@{
		ReportFolder = $reportFolder
		SemanticFolder = $semanticFolder
		PbipFile = $pbipFile
	}
}

function Build-Dashboard {
	param(
		[Parameter(Mandatory = $true)][hashtable]$Config
	)

	$name = $Config.Name
	$paths = Initialize-DashboardStructure -DashboardName $name

	$reportFolderName = "$name.Report"
	$semanticFolderName = "$name.SemanticModel"

	Set-PbipFile -Path $paths.PbipFile -ReportFolderName $reportFolderName
	Set-PbirDefinition -Path (Join-Path $paths.ReportFolder 'definition.pbir') -SemanticFolderName $semanticFolderName

	Set-PlatformFile -Path (Join-Path $paths.ReportFolder '.platform') -Type 'Report' -DisplayName $name
	Set-SemanticModelFiles -SemanticFolderPath $paths.SemanticFolder -CubeName $Config.Cube -DisplayName $name

	$definitionPath = Join-Path $paths.ReportFolder 'definition'
	if (Test-Path (Join-Path $definitionPath 'pages')) {
		Remove-Item -Path (Join-Path $definitionPath 'pages') -Recurse -Force
	}
	Ensure-Directory -Path (Join-Path $definitionPath 'pages')

	$pageFolder = Join-Path (Join-Path $definitionPath 'pages') $Config.PageId
	$visualsFolder = Join-Path $pageFolder 'visuals'
	Ensure-Directory -Path $visualsFolder

	$pageDefinition = New-PageDefinition -PageId $Config.PageId -DisplayName $Config.PageDisplayName
	Write-Json -Path (Join-Path $pageFolder 'page.json') -Object $pageDefinition

	$pagesJson = [ordered]@{
		'$schema' = 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/pagesMetadata/1.0.0/schema.json'
		pageOrder = @($Config.PageId)
		activePageName = $Config.PageId
	}
	Write-Json -Path (Join-Path (Join-Path $definitionPath 'pages') 'pages.json') -Object $pagesJson

	$titleVisual = New-TextboxVisual `
		-Name 'v_title_main' `
		-Position (New-Position -X 20 -Y 10 -Z 0 -Height 60 -Width 860 -TabOrder 0) `
		-Text $Config.PageTitle

	$slicerVisual = New-SlicerVisual `
		-Name 'v_slicer_anio' `
		-Position (New-Position -X 20 -Y 80 -Z 1 -Height 80 -Width 260 -TabOrder 1) `
		-Entity $Config.SlicerEntity `
		-Property $Config.SlicerProperty `
		-HeaderText 'Filtro de Anio'

	$chart1 = New-ChartVisual `
		-Name 'v_chart_1' `
		-Position (New-Position -X 20 -Y 180 -Z 2 -Height 250 -Width 400 -TabOrder 2) `
		-VisualType $Config.Visual1.VisualType `
		-CategoryEntity $Config.Visual1.CategoryEntity `
		-CategoryProperty $Config.Visual1.CategoryProperty `
		-MeasureEntity $Config.MeasureEntity `
		-MeasureProperty $Config.Visual1.MeasureProperty `
		-Title $Config.Visual1.Title `
		-Color $Config.Visual1.Color `
		-SortDescending:([bool]$Config.Visual1.SortDescending) `
		-MeasureFormat $Config.Visual1.MeasureFormat

	$chart2 = New-ChartVisual `
		-Name 'v_chart_2' `
		-Position (New-Position -X 440 -Y 180 -Z 3 -Height 250 -Width 400 -TabOrder 3) `
		-VisualType $Config.Visual2.VisualType `
		-CategoryEntity $Config.Visual2.CategoryEntity `
		-CategoryProperty $Config.Visual2.CategoryProperty `
		-MeasureEntity $Config.MeasureEntity `
		-MeasureProperty $Config.Visual2.MeasureProperty `
		-Title $Config.Visual2.Title `
		-Color $Config.Visual2.Color `
		-SortDescending:([bool]$Config.Visual2.SortDescending) `
		-MeasureFormat $Config.Visual2.MeasureFormat

	$chart3 = if ($Config.Visual3.VisualType -eq 'lineClusteredColumnComboChart') {
		New-ComboChartVisual `
			-Name 'v_chart_3' `
			-Position (New-Position -X 860 -Y 180 -Z 4 -Height 250 -Width 400 -TabOrder 4) `
			-CategoryEntity $Config.Visual3.CategoryEntity `
			-CategoryProperty $Config.Visual3.CategoryProperty `
			-MeasureEntity $Config.MeasureEntity `
			-ColumnMeasure $Config.Visual3.ColumnMeasureProperty `
			-LineMeasure $Config.Visual3.LineMeasureProperty `
			-Title $Config.Visual3.Title `
			-ColumnColor $Config.Visual3.ColumnColor `
			-LineColor $Config.Visual3.LineColor `
			-LineFormat $Config.Visual3.LineMeasureFormat
	}
	else {
		New-ChartVisual `
			-Name 'v_chart_3' `
			-Position (New-Position -X 860 -Y 180 -Z 4 -Height 250 -Width 400 -TabOrder 4) `
			-VisualType $Config.Visual3.VisualType `
			-CategoryEntity $Config.Visual3.CategoryEntity `
			-CategoryProperty $Config.Visual3.CategoryProperty `
			-MeasureEntity $Config.MeasureEntity `
			-MeasureProperty $Config.Visual3.MeasureProperty `
			-Title $Config.Visual3.Title `
			-Color $Config.Visual3.Color `
			-SortDescending:([bool]$Config.Visual3.SortDescending) `
			-MeasureFormat $Config.Visual3.MeasureFormat
	}

	$visualMap = [ordered]@{
		v_title_main = $titleVisual
		v_slicer_anio = $slicerVisual
		v_chart_1 = $chart1
		v_chart_2 = $chart2
		v_chart_3 = $chart3
	}

	foreach ($visualName in $visualMap.Keys) {
		$folder = Join-Path $visualsFolder $visualName
		Ensure-Directory -Path $folder
		Write-Json -Path (Join-Path $folder 'visual.json') -Object $visualMap[$visualName]
	}

	Write-Host "Dashboard generado: $name" -ForegroundColor Green
}

$Dashboards = @(
	[ordered]@{
		Name = 'Dashboard_DM1_Ingresos'
		Cube = 'Cubo_Ingresos'
		MeasureEntity = 'Fact Ingresos'
		SlicerEntity = 'DIM_Tiempo'
		SlicerProperty = 'Anio'
		PageId = 'pag_dm1_ingresos'
		PageDisplayName = 'PAG_DM1_Ingresos'
		PageTitle = 'Dashboard DM1 - Ingresos y Monetizacion'
		Visual1 = [ordered]@{
			VisualType = 'clusteredColumnChart'
			CategoryEntity = 'DIM_Region_Ingresos'
			CategoryProperty = 'Nombre Region'
			MeasureProperty = 'Monto Real'
			Title = 'Ingresos reales por region'
			Color = '#1F4E79'
			SortDescending = $true
			MeasureFormat = $null
		}
		Visual2 = [ordered]@{
			VisualType = 'lineChart'
			CategoryEntity = 'DIM_Tiempo'
			CategoryProperty = 'Mes Nombre'
			MeasureProperty = 'Meta Ingresos'
			Title = 'Meta de ingresos por mes'
			Color = '#E67E22'
			SortDescending = $false
			MeasureFormat = $null
		}
		Visual3 = [ordered]@{
			VisualType = 'lineClusteredColumnComboChart'
			CategoryEntity = 'DIM_Tiempo'
			CategoryProperty = 'Mes Nombre'
			ColumnMeasureProperty = 'Monto Real'
			LineMeasureProperty = 'Meta Ingresos'
			LineMeasureFormat = $null
			Title = 'Real vs Meta de ingresos'
			ColumnColor = '#1F4E79'
			LineColor = '#E67E22'
		}
	},
	[ordered]@{
		Name = 'Dashboard_DM2_Comportamiento'
		Cube = 'Cubo_Comportamiento'
		MeasureEntity = 'Fact Actividad Usuario'
		SlicerEntity = 'DIM_Tiempo'
		SlicerProperty = 'Anio'
		PageId = 'pag_dm2_comportamiento'
		PageDisplayName = 'PAG_DM2_Comportamiento'
		PageTitle = 'Dashboard DM2 - Comportamiento de Usuario'
		Visual1 = [ordered]@{
			VisualType = 'clusteredColumnChart'
			CategoryEntity = 'DIM_Tipo_Evento'
			CategoryProperty = 'Nombre Evento'
			MeasureProperty = 'Cantidad Eventos'
			Title = 'Eventos por tipo'
			Color = '#2A9D8F'
			SortDescending = $true
			MeasureFormat = $null
		}
		Visual2 = [ordered]@{
			VisualType = 'barChart'
			CategoryEntity = 'DIM_Usuario'
			CategoryProperty = 'Nickname'
			MeasureProperty = 'Xp Acumulado'
			Title = 'XP acumulado por usuario'
			Color = '#1F4E79'
			SortDescending = $true
			MeasureFormat = $null
		}
		Visual3 = [ordered]@{
			VisualType = 'clusteredColumnChart'
			CategoryEntity = 'DIM_Pais'
			CategoryProperty = 'Nombre Pais'
			MeasureProperty = 'Tiempo Sesion Seg'
			Title = 'Tiempo de sesion por pais'
			Color = '#4F81BD'
			SortDescending = $false
			MeasureFormat = $null
		}
	},
	[ordered]@{
		Name = 'Dashboard_DM3_Torneos'
		Cube = 'Cubo_Torneos'
		MeasureEntity = 'Fact Torneos'
		SlicerEntity = 'DIM_Tiempo'
		SlicerProperty = 'Anio'
		PageId = 'pag_dm3_torneos'
		PageDisplayName = 'PAG_DM3_Torneos'
		PageTitle = 'Dashboard DM3 - Calidad de Torneos'
		Visual1 = [ordered]@{
			VisualType = 'clusteredColumnChart'
			CategoryEntity = 'DIM_Juego'
			CategoryProperty = 'Nombre Juego'
			MeasureProperty = 'Total Inscritos'
			Title = 'Inscritos por juego'
			Color = '#1F4E79'
			SortDescending = $true
			MeasureFormat = $null
		}
		Visual2 = [ordered]@{
			VisualType = 'barChart'
			CategoryEntity = 'DIM_Tipo_Torneo'
			CategoryProperty = 'Nombre Tipo'
			MeasureProperty = 'Calificacion Promedio'
			Title = 'Calificacion promedio por tipo de torneo'
			Color = '#2A9D8F'
			SortDescending = $false
			MeasureFormat = '0.00'
		}
		Visual3 = [ordered]@{
			VisualType = 'clusteredColumnChart'
			CategoryEntity = 'DIM_Plataforma'
			CategoryProperty = 'Nombre Plataforma'
			MeasureProperty = 'Pct Recomendacion'
			Title = 'Recomendacion por plataforma'
			Color = '#E67E22'
			SortDescending = $false
			MeasureFormat = '0.00'
		}
	},
	[ordered]@{
		Name = 'Dashboard_DM4_Auditoria'
		Cube = 'Cubo_Auditoria'
		MeasureEntity = 'Fact Auditoria'
		SlicerEntity = 'DIM_Tiempo'
		SlicerProperty = 'Anio'
		PageId = 'pag_dm4_auditoria'
		PageDisplayName = 'PAG_DM4_Auditoria'
		PageTitle = 'Dashboard DM4 - Seguridad y Auditoria'
		Visual1 = [ordered]@{
			VisualType = 'clusteredColumnChart'
			CategoryEntity = 'DIM_Operacion'
			CategoryProperty = 'Nombre Operacion'
			MeasureProperty = 'Total Eventos'
			Title = 'Eventos auditados por operacion'
			Color = '#1F4E79'
			SortDescending = $true
			MeasureFormat = $null
		}
		Visual2 = [ordered]@{
			VisualType = 'barChart'
			CategoryEntity = 'DIM_Pais_Registro'
			CategoryProperty = 'Nombre Pais'
			MeasureProperty = 'Registros Restringidos'
			Title = 'Registros restringidos por pais'
			Color = '#C0392B'
			SortDescending = $true
			MeasureFormat = $null
		}
		Visual3 = [ordered]@{
			VisualType = 'lineClusteredColumnComboChart'
			CategoryEntity = 'DIM_Operacion'
			CategoryProperty = 'Nombre Operacion'
			ColumnMeasureProperty = 'Total Eventos'
			LineMeasureProperty = 'Registros Restringidos'
			LineMeasureFormat = $null
			Title = 'Eventos vs registros restringidos por operacion'
			ColumnColor = '#4F81BD'
			LineColor = '#2A9D8F'
		}
	}
)

foreach ($dashboard in $Dashboards) {
	Build-Dashboard -Config $dashboard
}

Write-Host ''
Write-Host 'Listo. Se actualizaron/generaron los 4 dashboards PBIP en DataWarehouse/PowerBI.' -ForegroundColor Cyan
Write-Host 'Abre cada archivo .pbip en Power BI Desktop para revisar campos y ajustar detalles finales.' -ForegroundColor Cyan

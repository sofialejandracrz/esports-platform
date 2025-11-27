'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCatalogosTorneo } from '@/hooks/use-catalogos-torneo';
import { useAuth } from '@/contexts/auth-context';
import { CreateStepsIndicator } from '@/components/torneos/create-steps-indicator';
import { Stage1BasicInfo } from '@/components/torneos/create-stages/stage-1-basic-info';
import { Stage2Details } from '@/components/torneos/create-stages/stage-2-details';
import { Stage3Prizes } from '@/components/torneos/create-stages/stage-3-prizes';
import { Stage4Host } from '@/components/torneos/create-stages/stage-4-host';
import { Stage5Graphics } from '@/components/torneos/create-stages/stage-5-graphics';
import { 
  IconArrowLeft, 
  IconArrowRight, 
  IconDeviceFloppy, 
  IconAlertCircle, 
  IconCircleCheck, 
  IconLoader2,
  IconLock,
  IconShieldOff,
} from '@tabler/icons-react';
import { obtenerDetalleTorneo, actualizarTorneo, CrearTorneoData } from '@/lib/api/torneos';
import { TournamentFormData, StageErrors } from '@/hooks/use-tournament-form';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/home/app-sidebar';
import { SiteHeader } from '@/components/home/site-header';
import { SiteFooter } from '@/components/home/site-footer';

// Convertir los datos del torneo del backend al formato del formulario
function torneoToFormData(torneo: any): TournamentFormData {
  return {
    // Stage 1: Basic Info
    title: torneo.titulo || '',
    description: torneo.descripcion || '',
    registrationStart: torneo.fechas?.inicio_registro ? new Date(torneo.fechas.inicio_registro).toISOString().slice(0, 16) : '',
    registrationEnd: torneo.fechas?.fin_registro ? new Date(torneo.fechas.fin_registro).toISOString().slice(0, 16) : '',
    tournamentStart: torneo.fechas?.inicio_torneo ? new Date(torneo.fechas.inicio_torneo).toISOString().slice(0, 16) : '',

    // Stage 2: Tournament Details
    gameId: torneo.juego?.id || '',
    platform: torneo.plataforma?.id || '',
    gameMode: torneo.modo_juego?.id || '',
    region: torneo.region?.id || '',
    tournamentType: torneo.tipo_torneo?.id || '',
    bestOf: torneo.configuracion?.al_mejor_de || 1,
    format: torneo.configuracion?.formato || '1v1',
    isClosed: torneo.configuracion?.cerrado || false,
    rulesType: torneo.configuracion?.reglas ? 'custom' : 'basic',
    customRules: torneo.configuracion?.reglas || '',
    allowPC: torneo.configuracion?.jugadores_pc_permitidos ?? true,
    requireStream: torneo.configuracion?.requiere_transmision || false,
    requireWebcam: torneo.configuracion?.requiere_camara || false,
    inputType: torneo.tipo_entrada?.id || '',
    maxParticipants: torneo.configuracion?.capacidad || 16,

    // Stage 3: Prizes
    entryFee: torneo.premios?.cuota || 0,
    totalPrizePool: torneo.premios?.fondo_total || 0,
    hostCommissionPercentage: torneo.premios?.comision_porcentaje || 10,
    firstPlacePercentage: torneo.premios?.ganador1_porcentaje || 60,
    secondPlacePercentage: torneo.premios?.ganador2_porcentaje || 40,

    // Stage 4: Host Details
    hostContact: torneo.anfitrion?.contacto || '',
    twitchUrl: torneo.redes_sociales?.find((r: any) => r.plataforma === 'twitch')?.url || '',
    discordUrl: torneo.redes_sociales?.find((r: any) => r.plataforma === 'discord')?.url || '',
    youtubeUrl: torneo.redes_sociales?.find((r: any) => r.plataforma === 'youtube')?.url || '',
    facebookUrl: torneo.redes_sociales?.find((r: any) => r.plataforma === 'facebook')?.url || '',
    xUrl: torneo.redes_sociales?.find((r: any) => r.plataforma === 'x')?.url || '',
    discordServer: torneo.anfitrion?.discord_servidor || '',

    // Stage 5: Graphics
    bannerImage: null,
    thumbnailImage: null,

    // Stage 6: Finalize (no se usa en edición)
    isReady: true,
  };
}

// Convertir los datos del formulario al formato de la API
function formDataToPayload(formData: TournamentFormData): Partial<CrearTorneoData> {
  const redesSociales: Array<{ plataforma: string; url: string }> = [];
  
  if (formData.twitchUrl) redesSociales.push({ plataforma: 'twitch', url: formData.twitchUrl });
  if (formData.discordUrl) redesSociales.push({ plataforma: 'discord', url: formData.discordUrl });
  if (formData.youtubeUrl) redesSociales.push({ plataforma: 'youtube', url: formData.youtubeUrl });
  if (formData.facebookUrl) redesSociales.push({ plataforma: 'facebook', url: formData.facebookUrl });
  if (formData.xUrl) redesSociales.push({ plataforma: 'x', url: formData.xUrl });

  return {
    titulo: formData.title,
    descripcion: formData.description || undefined,
    fecha_inicio_registro: formData.registrationStart || undefined,
    fecha_fin_registro: formData.registrationEnd || undefined,
    fecha_inicio_torneo: formData.tournamentStart || undefined,
    juego_id: formData.gameId || undefined,
    plataforma_id: formData.platform || undefined,
    modo_juego_id: formData.gameMode || undefined,
    region_id: formData.region || undefined,
    tipo_torneo_id: formData.tournamentType || undefined,
    al_mejor_de: formData.bestOf,
    formato: formData.format || undefined,
    cerrado: formData.isClosed,
    reglas: formData.rulesType === 'custom' ? formData.customRules : undefined,
    jugadores_pc_permitidos: formData.allowPC,
    requiere_transmision: formData.requireStream,
    requiere_camara: formData.requireWebcam,
    tipo_entrada_id: formData.inputType || undefined,
    capacidad: formData.maxParticipants,
    cuota: formData.entryFee,
    comision_porcentaje: formData.hostCommissionPercentage,
    ganador1_porcentaje: formData.firstPlacePercentage,
    ganador2_porcentaje: formData.secondPlacePercentage,
    contacto_anfitrion: formData.hostContact || undefined,
    discord_servidor: formData.discordServer || undefined,
    // redes_sociales se manejan por separado con upsertRedSocial
  };
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  fieldErrors: StageErrors;
}

export default function EditarTorneoPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, usuario } = useAuth();
  const torneoId = params.id as string;

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [torneoOriginal, setTorneoOriginal] = useState<any>(null);
  const [formData, setFormData] = useState<TournamentFormData | null>(null);
  const [currentStage, setCurrentStage] = useState(1);
  const [submitState, setSubmitState] = useState({
    loading: false,
    error: null as string | null,
    success: false,
  });

  const {
    catalogos,
    loading: catalogosLoading,
    error: catalogosError,
  } = useCatalogosTorneo();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cargar datos del torneo
  const cargarTorneo = useCallback(async () => {
    if (!torneoId || !mounted) return;

    setLoading(true);
    setError(null);

    try {
      const response = await obtenerDetalleTorneo(torneoId);
      
      if (response.success && response.torneo) {
        setTorneoOriginal(response.torneo);
        setFormData(torneoToFormData(response.torneo));
      } else {
        setError(response.error || 'Torneo no encontrado');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar el torneo');
    } finally {
      setLoading(false);
    }
  }, [torneoId, mounted]);

  useEffect(() => {
    if (mounted && !authLoading) {
      if (!isAuthenticated) {
        router.push(`/auth/login?redirect=/torneos/${torneoId}/editar`);
      } else {
        cargarTorneo();
      }
    }
  }, [mounted, authLoading, isAuthenticated, cargarTorneo, router, torneoId]);

  // Verificar que el usuario sea el anfitrión
  const esAnfitrion = torneoOriginal && usuario && torneoOriginal.anfitrion?.id === usuario.id;
  const puedeEditar = esAnfitrion && torneoOriginal?.estado?.valor === 'proximamente';

  const updateField = useCallback(<K extends keyof TournamentFormData>(
    field: K,
    value: TournamentFormData[K]
  ) => {
    setFormData((prev) => prev ? { ...prev, [field]: value } : null);
  }, []);

  const goToStage = useCallback((stage: number) => {
    if (stage >= 1 && stage <= 5) setCurrentStage(stage);
  }, []);

  const nextStage = useCallback(() => {
    if (currentStage < 5) setCurrentStage((prev) => prev + 1);
  }, [currentStage]);

  const prevStage = useCallback(() => {
    if (currentStage > 1) setCurrentStage((prev) => prev - 1);
  }, [currentStage]);

  const validateStage = useCallback((stage: number): ValidationResult => {
    const errors: string[] = [];
    const fieldErrors: StageErrors = {};

    if (!formData) return { valid: false, errors: ['Datos no cargados'], fieldErrors };

    switch (stage) {
      case 1:
        if (!formData.title.trim()) {
          errors.push('El título es obligatorio');
          fieldErrors.title = 'El título es obligatorio';
        }
        break;
      case 2:
        if (!formData.gameId) {
          errors.push('Debes seleccionar un juego');
          fieldErrors.gameId = 'Selecciona un juego';
        }
        break;
      case 3:
        if (formData.firstPlacePercentage + formData.secondPlacePercentage !== 100) {
          errors.push('Los porcentajes deben sumar 100%');
          fieldErrors.firstPlacePercentage = 'Debe sumar 100%';
        }
        break;
    }

    return { valid: errors.length === 0, errors, fieldErrors };
  }, [formData]);

  const handleSubmit = async () => {
    if (!formData || !torneoId) return;

    setSubmitState({ loading: true, error: null, success: false });

    try {
      const payload = formDataToPayload(formData);
      await actualizarTorneo(torneoId, payload);

      setSubmitState({ loading: false, error: null, success: true });

      setTimeout(() => {
        router.push(`/torneos/${torneoId}`);
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setSubmitState({ loading: false, error: errorMessage, success: false });
    }
  };

  const currentValidation = formData ? validateStage(currentStage) : { valid: false, errors: [], fieldErrors: {} };

  // Loading de autenticación
  if (!mounted || authLoading || loading) {
    return (
      <SidebarProvider
        style={{
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties}
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 items-center justify-center">
            <IconLoader2 className="size-8 animate-spin text-primary" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // No autenticado
  if (!isAuthenticated) {
    return (
      <SidebarProvider
        style={{
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties}
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6 text-center">
                <IconLock className="mx-auto size-12 text-orange-500 mb-4" />
                <h2 className="text-xl font-bold mb-2">Acceso Restringido</h2>
                <p className="text-muted-foreground mb-4">
                  Debes iniciar sesión para editar torneos
                </p>
                <Button onClick={() => router.push(`/auth/login?redirect=/torneos/${torneoId}/editar`)}>
                  Iniciar Sesión
                </Button>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // Error al cargar
  if (error) {
    return (
      <SidebarProvider
        style={{
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties}
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 items-center justify-center p-4">
            <Card className="w-full max-w-md border-destructive/50 bg-destructive/10">
              <CardContent className="pt-6 text-center">
                <IconAlertCircle className="mx-auto size-12 text-destructive mb-4" />
                <h2 className="text-xl font-bold mb-2">Error</h2>
                <p className="text-muted-foreground mb-4">{error}</p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => router.back()}>
                    Volver
                  </Button>
                  <Button onClick={cargarTorneo}>
                    Reintentar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // No es el anfitrión
  if (!esAnfitrion) {
    return (
      <SidebarProvider
        style={{
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties}
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 items-center justify-center p-4">
            <Card className="w-full max-w-md border-destructive/50 bg-destructive/10">
              <CardContent className="pt-6 text-center">
                <IconShieldOff className="mx-auto size-12 text-destructive mb-4" />
                <h2 className="text-xl font-bold mb-2">Sin Permisos</h2>
                <p className="text-muted-foreground mb-4">
                  Solo el anfitrión puede editar este torneo
                </p>
                <Button variant="outline" onClick={() => router.push(`/torneos/${torneoId}`)}>
                  Ver Torneo
                </Button>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // No puede editar (torneo no está en proximamente)
  if (!puedeEditar) {
    return (
      <SidebarProvider
        style={{
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties}
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 items-center justify-center p-4">
            <Card className="w-full max-w-md border-orange-500/50 bg-orange-500/10">
              <CardContent className="pt-6 text-center">
                <IconLock className="mx-auto size-12 text-orange-500 mb-4" />
                <h2 className="text-xl font-bold mb-2">Edición no Disponible</h2>
                <p className="text-muted-foreground mb-4">
                  Solo se pueden editar torneos que aún no han iniciado
                </p>
                <Button variant="outline" onClick={() => router.push(`/torneos/${torneoId}`)}>
                  Ver Torneo
                </Button>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider
      style={{
        '--sidebar-width': 'calc(var(--spacing) * 72)',
        '--header-height': 'calc(var(--spacing) * 12)',
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <main className="flex-1">
            <div className="container mx-auto max-w-6xl space-y-6 p-4 pb-24 md:p-6 md:pb-8">
              {/* Header */}
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                  <IconArrowLeft className="size-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold md:text-3xl">Editar Torneo</h1>
                  <p className="text-sm text-muted-foreground md:text-base">
                    {torneoOriginal?.titulo}
                  </p>
                </div>
              </div>

              {/* Mensaje de éxito */}
              {submitState.success && (
                <Card className="border-green-500/50 bg-green-500/10">
                  <CardContent className="flex items-start gap-3 pt-6">
                    <IconCircleCheck className="size-5 shrink-0 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-500">¡Torneo actualizado!</p>
                      <p className="text-sm text-muted-foreground">
                        Redirigiendo al torneo...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Mensaje de error */}
              {submitState.error && (
                <Card className="border-destructive/50 bg-destructive/10">
                  <CardContent className="flex items-start gap-3 pt-6">
                    <IconAlertCircle className="size-5 shrink-0 text-destructive mt-0.5" />
                    <div>
                      <p className="font-medium text-destructive">Error al actualizar</p>
                      <p className="text-sm text-muted-foreground">{submitState.error}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Steps Indicator - Solo 5 pasos en edición */}
              <Card>
                <CardContent className="pt-6">
                  <CreateStepsIndicator
                    currentStep={currentStage}
                    totalSteps={5}
                    onStepClick={goToStage}
                  />
                </CardContent>
              </Card>

              {/* Contenido Principal */}
              {formData && (
                <div className="space-y-6">
                  {currentStage === 1 && (
                    <Stage1BasicInfo 
                      data={formData} 
                      onUpdate={updateField}
                      errors={currentValidation.fieldErrors}
                    />
                  )}
                  {currentStage === 2 && (
                    <Stage2Details
                      data={formData}
                      onUpdate={updateField}
                      catalogos={catalogos}
                      catalogosLoading={catalogosLoading}
                      catalogosError={catalogosError}
                      errors={currentValidation.fieldErrors}
                    />
                  )}
                  {currentStage === 3 && (
                    <Stage3Prizes 
                      data={formData} 
                      onUpdate={updateField}
                      errors={currentValidation.fieldErrors}
                    />
                  )}
                  {currentStage === 4 && (
                    <Stage4Host data={formData} onUpdate={updateField} />
                  )}
                  {currentStage === 5 && (
                    <Stage5Graphics data={formData} onUpdate={updateField} />
                  )}

                  {/* Errores de validación */}
                  {!currentValidation.valid && currentValidation.errors.length > 0 && (
                    <Card className="border-orange-500/50 bg-orange-500/10">
                      <CardContent className="pt-6">
                        <p className="text-sm font-medium text-orange-500 mb-2">Campos pendientes:</p>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {currentValidation.errors.map((error, idx) => (
                            <li key={idx}>• {error}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Botones de Navegación */}
              <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background p-4 md:static md:border-0 md:bg-transparent md:p-0">
                <div className="container mx-auto flex max-w-6xl gap-3">
                  <Button
                    onClick={prevStage}
                    disabled={currentStage === 1 || submitState.loading}
                    variant="outline"
                    className="flex-1 gap-2 md:flex-none"
                  >
                    <IconArrowLeft className="size-4" />
                    <span className="hidden sm:inline">Anterior</span>
                  </Button>

                  <div className="flex-1 md:flex-none md:ml-auto flex gap-2">
                    {currentStage < 5 ? (
                      <Button
                        onClick={nextStage}
                        disabled={!currentValidation.valid}
                        className="flex-1 gap-2"
                      >
                        <span className="hidden sm:inline">Siguiente</span>
                        <span className="sm:hidden">Continuar</span>
                        <IconArrowRight className="size-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        disabled={submitState.loading}
                        className="flex-1 gap-2"
                        variant="default"
                      >
                        {submitState.loading ? (
                          <>
                            <IconLoader2 className="size-4 animate-spin" />
                            <span className="hidden sm:inline">Guardando...</span>
                          </>
                        ) : (
                          <>
                            <IconDeviceFloppy className="size-4" />
                            <span className="hidden sm:inline">Guardar Cambios</span>
                            <span className="sm:hidden">Guardar</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
          <SiteFooter />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

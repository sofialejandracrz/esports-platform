'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  IconTrophy,
  IconUsers,
  IconCalendar,
  IconCoin,
  IconLoader2,
  IconAlertCircle,
  IconArrowLeft,
  IconMapPin,
  IconDeviceGamepad2,
  IconCrown,
  IconBrandDiscord,
  IconBrandTwitch,
  IconBrandYoutube,
  IconBrandX,
  IconBrandFacebook,
  IconWorld,
  IconShare,
  IconHeart,
  IconPlayerPlay,
  IconSettings,
  IconLock,
  IconLockOpen,
  IconCamera,
  IconScreenShare,
  IconDeviceDesktop,
  IconMail,
  IconCheck,
  IconX,
  IconUsersGroup,
} from '@tabler/icons-react';
import { 
  obtenerDetalleTorneo, 
  inscribirseTorneo, 
  verificarInscripcion,
  cancelarInscripcion,
} from '@/lib/api/torneos';
import { useAuth } from '@/contexts/auth-context';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/home/app-sidebar';
import { SiteHeader } from '@/components/home/site-header';
import { SiteFooter } from '@/components/home/site-footer';
import { toast } from 'sonner';

// Interfaces basadas en el SQL torneo_obtener_detalle
interface TorneoDetalle {
  id: string;
  titulo: string;
  descripcion?: string;
  fechas: {
    inicio_registro?: string;
    fin_registro?: string;
    inicio_torneo?: string;
  };
  juego?: { id: string; nombre: string };
  plataforma?: { id: string; valor: string };
  modo_juego?: { id: string; nombre: string };
  region?: { id: string; valor: string };
  tipo_torneo?: { id: string; valor: string; tipo_trofeo?: string };
  tipo_entrada?: { id: string; valor: string };
  configuracion: {
    al_mejor_de: number;
    formato: string;
    cerrado: boolean;
    reglas?: string;
    capacidad?: number;
    jugadores_pc_permitidos: boolean;
    requiere_transmision: boolean;
    requiere_camara: boolean;
  };
  estado?: { id: string; valor: string };
  premios?: {
    cuota: number;
    fondo_total: number;
    fondo_despues_comision: number;
    comision_porcentaje: number;
    comision_total: number;
    ganador1_porcentaje: number;
    ganador2_porcentaje: number;
    premio_1er_lugar: number;
    premio_2do_lugar: number;
  };
  anfitrion: {
    id: string;
    nickname: string;
    foto_perfil?: string;
    avatar_url?: string;
    contacto?: string;
    discord_servidor?: string;
  };
  redes_sociales: Array<{ id: string; plataforma: string; url: string }>;
  graficos: {
    banner_url?: string;
    miniatura_url?: string;
  };
  estadisticas: {
    inscritos: number;
    capacidad_restante?: number;
  };
  creado_en: string;
  actualizado_en: string;
}

// Mapear estados a badges con colores
function getEstadoBadge(estado?: string) {
  switch (estado?.toLowerCase()) {
    case 'proximamente':
      return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 text-sm px-3 py-1">Próximamente</Badge>;
    case 'en_curso':
      return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 text-sm px-3 py-1">En Curso</Badge>;
    case 'terminado':
      return <Badge className="bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 text-sm px-3 py-1">Terminado</Badge>;
    case 'cancelado':
      return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 text-sm px-3 py-1">Cancelado</Badge>;
    default:
      return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 text-sm px-3 py-1">Abierto</Badge>;
  }
}

function formatDate(dateString?: string): string {
  if (!dateString) return 'Por definir';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getRedSocialIcon(plataforma: string) {
  switch (plataforma.toLowerCase()) {
    case 'discord':
      return <IconBrandDiscord className="size-5" />;
    case 'twitch':
      return <IconBrandTwitch className="size-5" />;
    case 'youtube':
      return <IconBrandYoutube className="size-5" />;
    case 'x':
    case 'twitter':
      return <IconBrandX className="size-5" />;
    case 'facebook':
      return <IconBrandFacebook className="size-5" />;
    default:
      return <IconWorld className="size-5" />;
  }
}

function getTipoTorneoLabel(valor?: string): string {
  switch (valor) {
    case 'eliminacion_simple':
      return 'Eliminación Simple';
    case 'eliminacion_doble':
      return 'Eliminación Doble';
    case 'todos_contra_todos':
      return 'Todos contra Todos';
    case 'grupos':
      return 'Fase de Grupos';
    case 'suizo':
      return 'Sistema Suizo';
    default:
      return valor || 'Sin definir';
  }
}

export default function TorneoDetallePage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, usuario } = useAuth();
  const [torneo, setTorneo] = useState<TorneoDetalle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado de inscripción
  const [inscripcionStatus, setInscripcionStatus] = useState<{
    inscrito: boolean;
    inscripcionId?: string;
    estado?: string;
  }>({ inscrito: false });
  const [isCheckingInscripcion, setIsCheckingInscripcion] = useState(false);
  const [isInscribiendo, setIsInscribiendo] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showEquipoDialog, setShowEquipoDialog] = useState(false);

  const torneoId = params.id as string;

  const cargarTorneo = useCallback(async () => {
    if (!torneoId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await obtenerDetalleTorneo(torneoId);
      
      if (response.success && response.torneo) {
        setTorneo(response.torneo);
      } else {
        setError(response.error || 'Torneo no encontrado');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  }, [torneoId]);

  // Verificar inscripción del usuario
  const verificarEstadoInscripcion = useCallback(async () => {
    if (!torneoId || !isAuthenticated) return;
    
    setIsCheckingInscripcion(true);
    try {
      const response = await verificarInscripcion(torneoId);
      setInscripcionStatus({
        inscrito: response.inscrito,
        inscripcionId: response.inscripcion?.id,
        estado: response.inscripcion?.estado?.valor,
      });
    } catch (err) {
      console.error('Error verificando inscripción:', err);
    } finally {
      setIsCheckingInscripcion(false);
    }
  }, [torneoId, isAuthenticated]);

  useEffect(() => {
    cargarTorneo();
  }, [cargarTorneo]);

  useEffect(() => {
    if (torneo && isAuthenticated) {
      verificarEstadoInscripcion();
    }
  }, [torneo, isAuthenticated, verificarEstadoInscripcion]);

  const esAnfitrion = isAuthenticated && usuario?.id === torneo?.anfitrion?.id;
  const formato = torneo?.configuracion?.formato || '1v1';
  const requiereEquipo = formato !== '1v1';
  const puedeInscribirse = 
    torneo?.estado?.valor === 'proximamente' && 
    !torneo?.configuracion?.cerrado &&
    !inscripcionStatus.inscrito &&
    !esAnfitrion &&
    (torneo?.estadisticas?.capacidad_restante === null || (torneo?.estadisticas?.capacidad_restante ?? 0) > 0);

  // Manejar inscripción
  const handleInscribirse = async () => {
    if (!torneoId || !isAuthenticated) return;

    // Si requiere equipo, mostrar diálogo (módulo de equipos pendiente)
    if (requiereEquipo) {
      setShowEquipoDialog(true);
      return;
    }

    // Inscripción individual (1v1)
    setIsInscribiendo(true);
    try {
      const response = await inscribirseTorneo(torneoId);
      toast.success('¡Te has inscrito al torneo exitosamente!');
      setInscripcionStatus({
        inscrito: true,
        inscripcionId: response.id,
        estado: response.estado?.valor || 'pendiente',
      });
      // Recargar info del torneo para actualizar estadísticas
      cargarTorneo();
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al inscribirse al torneo';
      toast.error(errorMessage);
    } finally {
      setIsInscribiendo(false);
    }
  };

  // Manejar cancelación
  const handleCancelarInscripcion = async () => {
    if (!torneoId) return;

    setIsInscribiendo(true);
    try {
      await cancelarInscripcion(torneoId);
      toast.success('Inscripción cancelada exitosamente');
      setInscripcionStatus({ inscrito: false });
      setShowCancelDialog(false);
      cargarTorneo();
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al cancelar la inscripción';
      toast.error(errorMessage);
    } finally {
      setIsInscribiendo(false);
    }
  };

  // Obtener texto y color del estado de inscripción
  const getInscripcionBadge = () => {
    switch (inscripcionStatus.estado) {
      case 'pendiente':
        return <Badge className="bg-yellow-500/10 text-yellow-500">Inscripción Pendiente</Badge>;
      case 'aceptado':
        return <Badge className="bg-green-500/10 text-green-500">Inscripción Aceptada</Badge>;
      case 'rechazado':
        return <Badge className="bg-red-500/10 text-red-500">Inscripción Rechazada</Badge>;
      default:
        return <Badge className="bg-blue-500/10 text-blue-500">Inscrito</Badge>;
    }
  };

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
            <div className="container mx-auto px-4 py-8">
              {/* Botón volver */}
              <Button
                variant="ghost"
                className="mb-6 gap-2"
                onClick={() => router.back()}
              >
                <IconArrowLeft className="size-4" />
                Volver
              </Button>

              {/* Estado de carga */}
              {isLoading && (
                <div className="flex min-h-[400px] items-center justify-center">
                  <IconLoader2 className="size-8 animate-spin text-primary" />
                </div>
              )}

              {/* Error */}
              {error && !isLoading && (
                <Card className="border-destructive/50 bg-destructive/10">
                  <CardContent className="flex flex-col items-center gap-4 py-12">
                    <IconAlertCircle className="size-12 text-destructive" />
                    <p className="text-destructive">{error}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => router.back()}>
                        Volver
                      </Button>
                      <Button onClick={cargarTorneo}>
                        Reintentar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contenido del torneo */}
              {!isLoading && !error && torneo && (
                <div className="space-y-6">
                  {/* Banner */}
                  {torneo.graficos.banner_url && (
                    <div className="relative h-48 md:h-64 lg:h-80 w-full overflow-hidden rounded-xl">
                      <img
                        src={torneo.graficos.banner_url}
                        alt={torneo.titulo}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />
                    </div>
                  )}

                  {/* Header del torneo */}
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {getEstadoBadge(torneo.estado?.valor)}
                        {torneo.configuracion.cerrado && (
                          <Badge variant="outline" className="gap-1">
                            <IconLock className="size-3" />
                            Privado
                          </Badge>
                        )}
                      </div>
                      <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">{torneo.titulo}</h1>
                      <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                        {torneo.juego && (
                          <span className="flex items-center gap-1">
                            <IconDeviceGamepad2 className="size-4" />
                            {torneo.juego.nombre}
                          </span>
                        )}
                        {torneo.region && (
                          <span className="flex items-center gap-1">
                            <IconMapPin className="size-4" />
                            {torneo.region.valor}
                          </span>
                        )}
                        {torneo.plataforma && (
                          <span className="flex items-center gap-1">
                            <IconDeviceDesktop className="size-4" />
                            {torneo.plataforma.valor}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-wrap gap-2">
                      {esAnfitrion && torneo.estado?.valor === 'proximamente' && (
                        <Button asChild variant="outline" className="gap-2">
                          <Link href={`/torneos/${torneo.id}/editar`}>
                            <IconSettings className="size-4" />
                            Editar
                          </Link>
                        </Button>
                      )}
                      
                      {/* Mostrar estado de inscripción si ya está inscrito */}
                      {inscripcionStatus.inscrito && (
                        <div className="flex items-center gap-2">
                          {getInscripcionBadge()}
                          {torneo.estado?.valor === 'proximamente' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => setShowCancelDialog(true)}
                            >
                              <IconX className="size-4 mr-1" />
                              Cancelar
                            </Button>
                          )}
                        </div>
                      )}

                      {/* Botón de inscripción */}
                      {puedeInscribirse && isAuthenticated && !inscripcionStatus.inscrito && (
                        <Button 
                          className="gap-2"
                          onClick={handleInscribirse}
                          disabled={isInscribiendo || isCheckingInscripcion}
                        >
                          {isInscribiendo ? (
                            <IconLoader2 className="size-4 animate-spin" />
                          ) : requiereEquipo ? (
                            <IconUsersGroup className="size-4" />
                          ) : (
                            <IconPlayerPlay className="size-4" />
                          )}
                          {requiereEquipo ? 'Inscribir Equipo' : 'Inscribirse'}
                        </Button>
                      )}
                      <Button variant="outline" size="icon">
                        <IconShare className="size-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <IconHeart className="size-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Grid de contenido */}
                  <div className="grid gap-6 lg:grid-cols-3">
                    {/* Columna principal */}
                    <div className="space-y-6 lg:col-span-2">
                      {/* Descripción */}
                      {torneo.descripcion && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Descripción</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="whitespace-pre-wrap text-muted-foreground">
                              {torneo.descripcion}
                            </p>
                          </CardContent>
                        </Card>
                      )}

                      {/* Reglas */}
                      {torneo.configuracion.reglas && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Reglas</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="whitespace-pre-wrap text-muted-foreground">
                              {torneo.configuracion.reglas}
                            </p>
                          </CardContent>
                        </Card>
                      )}

                      {/* Configuración del torneo */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Configuración</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Tipo de Torneo</p>
                            <p className="font-medium">{getTipoTorneoLabel(torneo.tipo_torneo?.valor)}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Formato</p>
                            <p className="font-medium">{torneo.configuracion.formato || '1v1'}</p>
                          </div>
                          {torneo.modo_juego && (
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Modo de Juego</p>
                              <p className="font-medium">{torneo.modo_juego.nombre}</p>
                            </div>
                          )}
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Al mejor de</p>
                            <p className="font-medium">{torneo.configuracion.al_mejor_de} partidas</p>
                          </div>
                          {torneo.tipo_entrada && (
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Tipo de Entrada</p>
                              <p className="font-medium capitalize">{torneo.tipo_entrada.valor}</p>
                            </div>
                          )}

                          {/* Requisitos especiales */}
                          <div className="col-span-full">
                            <Separator className="my-2" />
                            <div className="flex flex-wrap gap-3 pt-2">
                              {torneo.configuracion.jugadores_pc_permitidos && (
                                <Badge variant="outline" className="gap-1">
                                  <IconDeviceDesktop className="size-3" />
                                  PC Permitido
                                </Badge>
                              )}
                              {torneo.configuracion.requiere_transmision && (
                                <Badge variant="outline" className="gap-1 border-yellow-500/50 text-yellow-500">
                                  <IconScreenShare className="size-3" />
                                  Requiere Stream
                                </Badge>
                              )}
                              {torneo.configuracion.requiere_camara && (
                                <Badge variant="outline" className="gap-1 border-yellow-500/50 text-yellow-500">
                                  <IconCamera className="size-3" />
                                  Requiere Cámara
                                </Badge>
                              )}
                              {torneo.configuracion.cerrado ? (
                                <Badge variant="outline" className="gap-1 border-red-500/50 text-red-500">
                                  <IconLock className="size-3" />
                                  Torneo Privado
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="gap-1 border-green-500/50 text-green-500">
                                  <IconLockOpen className="size-3" />
                                  Torneo Abierto
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Premios */}
                      {torneo.premios && (torneo.premios.cuota > 0 || torneo.premios.fondo_total > 0) && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <IconTrophy className="size-5 text-yellow-500" />
                              Premios
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {torneo.premios.cuota > 0 && (
                              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                                <span className="text-muted-foreground">Costo de inscripción</span>
                                <span className="text-xl font-bold">${torneo.premios.cuota}</span>
                              </div>
                            )}
                            
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="rounded-lg bg-yellow-500/10 p-4 text-center">
                                <IconTrophy className="mx-auto size-8 text-yellow-500" />
                                <p className="mt-2 text-sm text-muted-foreground">1er Lugar</p>
                                <p className="text-2xl font-bold text-yellow-500">
                                  ${torneo.premios.premio_1er_lugar || 0}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  ({torneo.premios.ganador1_porcentaje}% del fondo)
                                </p>
                              </div>
                              <div className="rounded-lg bg-gray-500/10 p-4 text-center">
                                <IconTrophy className="mx-auto size-8 text-gray-400" />
                                <p className="mt-2 text-sm text-muted-foreground">2do Lugar</p>
                                <p className="text-2xl font-bold text-gray-400">
                                  ${torneo.premios.premio_2do_lugar || 0}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  ({torneo.premios.ganador2_porcentaje}% del fondo)
                                </p>
                              </div>
                            </div>

                            {torneo.premios.fondo_total > 0 && (
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Fondo Total Actual</p>
                                <p className="text-3xl font-bold text-chart-1">
                                  ${torneo.premios.fondo_total}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                      {/* Info rápida */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Información</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Participantes */}
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-primary/10 p-2">
                              <IconUsers className="size-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Participantes</p>
                              <p className="font-medium">
                                {torneo.estadisticas.inscritos}
                                {torneo.configuracion.capacidad && ` / ${torneo.configuracion.capacidad}`}
                              </p>
                            </div>
                          </div>

                          {/* Barra de progreso */}
                          {torneo.configuracion.capacidad && (
                            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full bg-linear-to-r from-chart-1 to-chart-2 transition-all duration-500"
                                style={{
                                  width: `${Math.min((torneo.estadisticas.inscritos / torneo.configuracion.capacidad) * 100, 100)}%`,
                                }}
                              />
                            </div>
                          )}

                          <Separator />

                          {/* Fechas */}
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="rounded-lg bg-blue-500/10 p-2">
                                <IconCalendar className="size-5 text-blue-500" />
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Inscripciones</p>
                                <p className="text-sm font-medium">
                                  {formatDate(torneo.fechas.inicio_registro)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  hasta {formatDate(torneo.fechas.fin_registro)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="rounded-lg bg-green-500/10 p-2">
                                <IconPlayerPlay className="size-5 text-green-500" />
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Inicio del Torneo</p>
                                <p className="text-sm font-medium">
                                  {formatDate(torneo.fechas.inicio_torneo)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Anfitrión */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <IconCrown className="size-5 text-yellow-500" />
                            Anfitrión
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="size-12 overflow-hidden rounded-full bg-muted">
                              {torneo.anfitrion.foto_perfil || torneo.anfitrion.avatar_url ? (
                                <img
                                  src={torneo.anfitrion.foto_perfil || torneo.anfitrion.avatar_url}
                                  alt={torneo.anfitrion.nickname}
                                  className="size-full object-cover"
                                />
                              ) : (
                                <div className="flex size-full items-center justify-center text-lg font-bold">
                                  {torneo.anfitrion.nickname?.[0]?.toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{torneo.anfitrion.nickname}</p>
                              <p className="text-sm text-muted-foreground">Organizador</p>
                            </div>
                          </div>

                          {/* Contacto */}
                          {(torneo.anfitrion.contacto || torneo.anfitrion.discord_servidor) && (
                            <>
                              <Separator />
                              <div className="space-y-2">
                                {torneo.anfitrion.contacto && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <IconMail className="size-4 text-muted-foreground" />
                                    <span>{torneo.anfitrion.contacto}</span>
                                  </div>
                                )}
                                {torneo.anfitrion.discord_servidor && (
                                  <a
                                    href={torneo.anfitrion.discord_servidor}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-blue-500 hover:underline"
                                  >
                                    <IconBrandDiscord className="size-4" />
                                    <span>Servidor de Discord</span>
                                  </a>
                                )}
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>

                      {/* Redes Sociales */}
                      {torneo.redes_sociales.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Redes del Torneo</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {torneo.redes_sociales.map((red) => (
                                <a
                                  key={red.id}
                                  href={red.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm transition-colors hover:bg-muted/80"
                                >
                                  {getRedSocialIcon(red.plataforma)}
                                  <span className="capitalize">{red.plataforma}</span>
                                </a>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* CTA inscripción */}
                      {puedeInscribirse && !inscripcionStatus.inscrito && (
                        <Card className="border-primary/50 bg-primary/5">
                          <CardContent className="pt-6 text-center">
                            <IconTrophy className="mx-auto size-12 text-primary" />
                            <h3 className="mt-2 text-lg font-bold">¡Únete al torneo!</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {torneo.estadisticas.capacidad_restante !== null
                                ? `Quedan ${torneo.estadisticas.capacidad_restante} lugares`
                                : 'Inscripciones abiertas'}
                            </p>
                            {requiereEquipo && (
                              <p className="mt-2 text-xs text-yellow-500">
                                <IconUsersGroup className="inline size-3 mr-1" />
                                Este torneo es {formato}, necesitas un equipo
                              </p>
                            )}
                            {isAuthenticated ? (
                              <Button 
                                className="mt-4 w-full gap-2"
                                onClick={handleInscribirse}
                                disabled={isInscribiendo || isCheckingInscripcion}
                              >
                                {isInscribiendo ? (
                                  <IconLoader2 className="size-4 animate-spin" />
                                ) : requiereEquipo ? (
                                  <IconUsersGroup className="size-4" />
                                ) : (
                                  <IconPlayerPlay className="size-4" />
                                )}
                                {requiereEquipo ? 'Inscribir Equipo' : 'Inscribirse Ahora'}
                              </Button>
                            ) : (
                              <Button asChild className="mt-4 w-full gap-2">
                                <Link href={`/auth/login?redirect=/torneos/${torneo.id}`}>
                                  Inicia sesión para inscribirte
                                </Link>
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      )}

                      {/* Estado de inscripción en sidebar */}
                      {inscripcionStatus.inscrito && (
                        <Card className="border-green-500/50 bg-green-500/5">
                          <CardContent className="pt-6 text-center">
                            <IconCheck className="mx-auto size-12 text-green-500" />
                            <h3 className="mt-2 text-lg font-bold text-green-500">¡Estás inscrito!</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Estado: {inscripcionStatus.estado || 'pendiente'}
                            </p>
                            {torneo.estado?.valor === 'proximamente' && (
                              <Button
                                variant="outline"
                                className="mt-4 w-full text-destructive hover:bg-destructive/10"
                                onClick={() => setShowCancelDialog(true)}
                                disabled={isInscribiendo}
                              >
                                <IconX className="size-4 mr-2" />
                                Cancelar Inscripción
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>

                  {/* Dialog de confirmación para cancelar */}
                  <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cancelar Inscripción</DialogTitle>
                        <DialogDescription>
                          ¿Estás seguro de que deseas cancelar tu inscripción en este torneo?
                          Esta acción no se puede deshacer.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowCancelDialog(false)}
                          disabled={isInscribiendo}
                        >
                          No, mantener
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleCancelarInscripcion}
                          disabled={isInscribiendo}
                        >
                          {isInscribiendo ? (
                            <IconLoader2 className="size-4 animate-spin mr-2" />
                          ) : null}
                          Sí, cancelar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Dialog para torneos que requieren equipo */}
                  <Dialog open={showEquipoDialog} onOpenChange={setShowEquipoDialog}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <IconUsersGroup className="size-5" />
                          Se requiere un equipo
                        </DialogTitle>
                        <DialogDescription>
                          Este torneo tiene formato {formato}, por lo que necesitas inscribirte con un equipo.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="rounded-lg bg-yellow-500/10 p-4 text-center">
                          <p className="text-yellow-500 font-medium">
                            El módulo de equipos está en desarrollo
                          </p>
                          <p className="text-sm text-muted-foreground mt-2">
                            Pronto podrás crear y gestionar equipos para participar en torneos de este formato.
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={() => setShowEquipoDialog(false)}>
                          Entendido
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </main>
          <SiteFooter />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

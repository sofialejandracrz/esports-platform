"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  IconEdit,
  IconUserPlus,
  IconTrophy,
  IconStar,
  IconDeviceGamepad,
  IconUsers,
  IconCoins,
  IconMapPin,
  IconBrandTwitter,
  IconBrandDiscord,
  IconBrandTwitch,
  IconBrandYoutube,
  IconUserCheck,
  IconClock,
  IconLoader2,
  IconArrowLeft,
  IconX,
  IconHourglass,
  IconCheck,
  IconMailForward,
  IconBell,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/home/app-sidebar';
import { SiteHeader } from '@/components/home/site-header';
import { SiteFooter } from '@/components/home/site-footer';
import { usePerfil } from "@/hooks/use-perfil";
import { useAuth } from "@/contexts/auth-context";
import {
  enviarSolicitudAmistad,
  cancelarSolicitudAmistad,
  aceptarSolicitudAmistad,
  rechazarSolicitudAmistad,
  eliminarAmigo,
  obtenerSolicitudesRecibidas,
  SolicitudAmistad,
} from "@/lib/api/perfil";

// Función para calcular el nivel basado en XP
function calcularNivel(xp: number): { nivel: number; xpActual: number; xpSiguienteNivel: number } {
  // Cada nivel requiere 1000 XP más que el anterior
  // Nivel 1: 0-1000, Nivel 2: 1000-3000, Nivel 3: 3000-6000, etc.
  let nivel = 1;
  let xpAcumulado = 0;
  let xpRequerido = 1000;

  while (xp >= xpAcumulado + xpRequerido) {
    xpAcumulado += xpRequerido;
    nivel++;
    xpRequerido = nivel * 1000;
  }

  return {
    nivel,
    xpActual: xp - xpAcumulado,
    xpSiguienteNivel: xpRequerido,
  };
}

// Función para obtener el icono de red social
function getRedSocialIcon(plataforma: string) {
  const iconProps = { className: "size-4" };
  switch (plataforma.toLowerCase()) {
    case "twitter":
    case "x":
      return <IconBrandTwitter {...iconProps} />;
    case "discord":
      return <IconBrandDiscord {...iconProps} />;
    case "twitch":
      return <IconBrandTwitch {...iconProps} />;
    case "youtube":
      return <IconBrandYoutube {...iconProps} />;
    default:
      return null;
  }
}

// Función para obtener el color de rareza del trofeo
function getRarityColor(tipo: string) {
  switch (tipo?.toLowerCase()) {
    case "oro":
    case "gold":
    case "legendary":
      return "bg-gradient-to-r from-yellow-400 to-orange-500";
    case "plata":
    case "silver":
    case "epic":
      return "bg-gradient-to-r from-purple-500 to-pink-500";
    case "bronce":
    case "bronze":
    case "rare":
      return "bg-gradient-to-r from-blue-500 to-cyan-500";
    default:
      return "bg-gradient-to-r from-gray-400 to-gray-500";
  }
}

// Función para obtener el emoji del trofeo según posición
function getTrofeoEmoji(posicion: number | null) {
  switch (posicion) {
    case 1:
      return "🥇";
    case 2:
      return "🥈";
    case 3:
      return "🥉";
    default:
      return "🏆";
  }
}

export default function PerfilUsuarioPage() {
  const params = useParams();
  const router = useRouter();
  const nickname = params.nickname as string;
  const { usuario, isAuthenticated } = useAuth();
  
  // Estados para manejar acciones de amistad
  const [enviandoSolicitud, setEnviandoSolicitud] = useState(false);
  const [estadoAmistadLocal, setEstadoAmistadLocal] = useState<{
    estado: string | null;
    solicitud_id: string | null;
    puede_agregar: boolean;
  } | null>(null);
  
  // Estado para solicitudes de amistad pendientes (solo en perfil propio)
  const [solicitudesPendientes, setSolicitudesPendientes] = useState<SolicitudAmistad[]>([]);
  const [cargandoSolicitudes, setCargandoSolicitudes] = useState(false);
  
  // Usar el hook personalizado para cargar el perfil
  const { perfil, loading, error, recargar } = usePerfil(nickname, {
    autoLoad: true,
    requireAuth: isAuthenticated,
  });

  // Sincronizar estado local con el perfil cuando carga
  const estadoAmistad = estadoAmistadLocal ?? perfil?.estado_amistad;

  // Verificar si es el perfil propio
  const isOwnProfile = isAuthenticated && usuario?.nickname === nickname;

  // Cargar solicitudes pendientes cuando es el perfil propio
  useEffect(() => {
    async function cargarSolicitudes() {
      if (!isOwnProfile || !isAuthenticated) return;
      
      setCargandoSolicitudes(true);
      try {
        const solicitudes = await obtenerSolicitudesRecibidas();
        setSolicitudesPendientes(solicitudes);
      } catch (err) {
        console.error('Error al cargar solicitudes:', err);
      } finally {
        setCargandoSolicitudes(false);
      }
    }
    
    cargarSolicitudes();
  }, [isOwnProfile, isAuthenticated]);

  // Función para enviar solicitud de amistad
  const handleEnviarSolicitud = async () => {
    if (!perfil?.usuario.id || enviandoSolicitud) return;
    
    setEnviandoSolicitud(true);
    try {
      const resultado = await enviarSolicitudAmistad(perfil.usuario.id);
      // Actualizar estado local - pendiente_enviada porque YO la envié
      setEstadoAmistadLocal({
        estado: 'pendiente_enviada',
        solicitud_id: resultado.id,
        puede_agregar: false,
      });
    } catch (err) {
      console.error('Error al enviar solicitud:', err);
      alert(err instanceof Error ? err.message : 'Error al enviar solicitud de amistad');
    } finally {
      setEnviandoSolicitud(false);
    }
  };

  // Función para cancelar solicitud de amistad
  const handleCancelarSolicitud = async () => {
    if (!estadoAmistad?.solicitud_id || enviandoSolicitud) return;
    
    setEnviandoSolicitud(true);
    try {
      await cancelarSolicitudAmistad(estadoAmistad.solicitud_id);
      // Actualizar estado local
      setEstadoAmistadLocal({
        estado: null,
        solicitud_id: null,
        puede_agregar: true,
      });
    } catch (err) {
      console.error('Error al cancelar solicitud:', err);
      alert(err instanceof Error ? err.message : 'Error al cancelar solicitud');
    } finally {
      setEnviandoSolicitud(false);
    }
  };

  // Función para aceptar solicitud de amistad recibida
  const handleAceptarSolicitud = async () => {
    if (!estadoAmistad?.solicitud_id || enviandoSolicitud) return;
    
    setEnviandoSolicitud(true);
    try {
      await aceptarSolicitudAmistad(estadoAmistad.solicitud_id);
      // Actualizar estado local - ahora son amigos
      setEstadoAmistadLocal({
        estado: 'aceptado',
        solicitud_id: estadoAmistad.solicitud_id,
        puede_agregar: false,
      });
    } catch (err) {
      console.error('Error al aceptar solicitud:', err);
      alert(err instanceof Error ? err.message : 'Error al aceptar solicitud');
    } finally {
      setEnviandoSolicitud(false);
    }
  };

  // Función para rechazar solicitud de amistad recibida
  const handleRechazarSolicitud = async () => {
    if (!estadoAmistad?.solicitud_id || enviandoSolicitud) return;
    
    setEnviandoSolicitud(true);
    try {
      await rechazarSolicitudAmistad(estadoAmistad.solicitud_id);
      // Actualizar estado local - solicitud rechazada, puede volver a agregar
      setEstadoAmistadLocal({
        estado: null,
        solicitud_id: null,
        puede_agregar: true,
      });
    } catch (err) {
      console.error('Error al rechazar solicitud:', err);
      alert(err instanceof Error ? err.message : 'Error al rechazar solicitud');
    } finally {
      setEnviandoSolicitud(false);
    }
  };

  // Función para eliminar amigo
  const handleEliminarAmigo = async () => {
    if (!estadoAmistad?.solicitud_id || enviandoSolicitud) return;
    
    if (!confirm('¿Estás seguro de que quieres eliminar a este amigo?')) return;
    
    setEnviandoSolicitud(true);
    try {
      await eliminarAmigo(estadoAmistad.solicitud_id);
      // Actualizar estado local
      setEstadoAmistadLocal({
        estado: null,
        solicitud_id: null,
        puede_agregar: true,
      });
    } catch (err) {
      console.error('Error al eliminar amigo:', err);
      alert(err instanceof Error ? err.message : 'Error al eliminar amigo');
    } finally {
      setEnviandoSolicitud(false);
    }
  };

  // Función para aceptar solicitud desde la lista de pendientes (perfil propio)
  const handleAceptarSolicitudPendiente = async (solicitudId: string) => {
    try {
      await aceptarSolicitudAmistad(solicitudId);
      // Remover de la lista de pendientes
      setSolicitudesPendientes(prev => prev.filter(s => s.id !== solicitudId));
    } catch (err) {
      console.error('Error al aceptar solicitud:', err);
      alert(err instanceof Error ? err.message : 'Error al aceptar solicitud');
    }
  };

  // Función para rechazar solicitud desde la lista de pendientes (perfil propio)
  const handleRechazarSolicitudPendiente = async (solicitudId: string) => {
    try {
      await rechazarSolicitudAmistad(solicitudId);
      // Remover de la lista de pendientes
      setSolicitudesPendientes(prev => prev.filter(s => s.id !== solicitudId));
    } catch (err) {
      console.error('Error al rechazar solicitud:', err);
      alert(err instanceof Error ? err.message : 'Error al rechazar solicitud');
    }
  };

  // Estado de carga
  if (loading) {
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
              <div className="flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <IconLoader2 className="size-12 animate-spin text-primary" />
                  <p className="text-muted-foreground">Cargando perfil...</p>
                </div>
              </div>
            </main>
            <SiteFooter />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // Estado de error
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
          <div className="flex flex-1 flex-col">
            <main className="flex-1">
              <div className="flex flex-1 items-center justify-center">
                <Card className="max-w-md">
                  <CardContent className="flex flex-col items-center gap-4 pt-6">
                    <IconUsers className="size-12 text-muted-foreground" />
                    <p className="text-center text-muted-foreground">{error}</p>
                    <Button asChild variant="outline">
                      <Link href="/dashboard">Volver al inicio</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </main>
            <SiteFooter />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // Si no hay perfil
  if (!perfil) {
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
              <div className="flex flex-1 items-center justify-center">
                <Card className="max-w-md">
                  <CardContent className="flex flex-col items-center gap-4 pt-6">
                    <IconUsers className="size-12 text-muted-foreground" />
                    <p className="text-center text-muted-foreground">
                      Usuario no encontrado
                    </p>
                    <Button asChild variant="outline">
                      <Link href="/dashboard">Volver al inicio</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </main>
            <SiteFooter />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // Calcular nivel y XP
  const { nivel, xpActual, xpSiguienteNivel } = calcularNivel(perfil.usuario.xp);
  const xpPercentage = (xpActual / xpSiguienteNivel) * 100;

  // Obtener avatar URL
  const avatarUrl =
    perfil.usuario.avatar_url ||
    perfil.usuario.foto_perfil ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${perfil.usuario.nickname}`;

  // Formatear última conexión
  const formatearUltimaConexion = (fecha: string | null) => {
    if (!fecha) return "Desconocido";
    const date = new Date(fecha);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 5) return "En línea";
    if (diffMins < 60) return `Hace ${diffMins} minutos`;
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString();
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
            <div className="@container/main flex flex-1 flex-col gap-4">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                {/* Barra superior con navegación y tema */}
                <div className="flex items-center justify-between px-4 lg:px-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="flex items-center gap-2"
                  >
                    <IconArrowLeft className="size-4" />
                    Volver
                  </Button>
                  <ThemeToggle />
                </div>

          {/* Header del perfil */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
                  {/* Avatar y nombre */}
                  <div className="flex flex-col items-center gap-4 md:items-start">
                    <div className="relative">
                      <Avatar className="size-24 border-4 border-primary/20 md:size-32">
                        <AvatarImage src={avatarUrl} alt={perfil.usuario.nickname} />
                        <AvatarFallback className="text-2xl">
                          {perfil.usuario.nickname.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {/* Indicador de estado */}
                      <div
                        className={`absolute bottom-1 right-1 size-4 rounded-full border-2 border-card ${
                          perfil.usuario.estado === "activo" ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                    </div>
                    <div className="flex flex-col items-center gap-1 md:items-start">
                      <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold md:text-3xl">
                          {perfil.datos_personales.nombre_completo || perfil.usuario.nickname}
                        </h1>
                        <Badge variant="outline">{perfil.usuario.rol}</Badge>
                      </div>
                      <p className="text-muted-foreground">@{perfil.usuario.nickname}</p>
                      {/* Ubicación */}
                      {(perfil.datos_personales.ciudad || perfil.datos_personales.pais) && (
                        <p className="flex items-center gap-1 text-sm text-muted-foreground">
                          <IconMapPin className="size-3" />
                          {[perfil.datos_personales.ciudad, perfil.datos_personales.pais]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      )}
                      {/* Última conexión */}
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <IconClock className="size-3" />
                        {formatearUltimaConexion(perfil.usuario.ultima_conexion)}
                      </p>
                    </div>
                  </div>

                  {/* Stats principales */}
                  <div className="flex flex-1 flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div className="flex flex-col items-center gap-1 rounded-lg border bg-card/50 p-3">
                        <IconStar className="size-5 text-primary" />
                        <span className="text-xl font-bold">Nivel {nivel}</span>
                        <span className="text-xs text-muted-foreground">Experiencia</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 rounded-lg border bg-card/50 p-3">
                        <IconCoins className="size-5 text-yellow-500" />
                        <span className="text-xl font-bold">${Number(perfil.usuario.saldo).toFixed(2)}</span>
                        <span className="text-xs text-muted-foreground">Saldo</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 rounded-lg border bg-card/50 p-3">
                        <IconTrophy className="size-5 text-orange-500" />
                        <span className="text-xl font-bold">{perfil.estadisticas_globales.total_trofeos}</span>
                        <span className="text-xs text-muted-foreground">Trofeos</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 rounded-lg border bg-card/50 p-3">
                        <IconUsers className="size-5 text-blue-500" />
                        <span className="text-xl font-bold">{perfil.estadisticas_globales.total_amigos}</span>
                        <span className="text-xs text-muted-foreground">Amigos</span>
                      </div>
                    </div>

                    {/* Estadísticas adicionales */}
                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                      <div>
                        <span className="font-semibold">{perfil.estadisticas_globales.total_seguidores}</span>
                        <span className="text-muted-foreground"> seguidores</span>
                      </div>
                      <div>
                        <span className="font-semibold">{perfil.estadisticas_globales.total_siguiendo}</span>
                        <span className="text-muted-foreground"> siguiendo</span>
                      </div>
                      <div>
                        <span className="font-semibold">{perfil.estadisticas_globales.total_victorias_torneos}</span>
                        <span className="text-muted-foreground"> victorias</span>
                      </div>
                    </div>

                    {/* Barra de XP */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Experiencia (Nivel {nivel})</span>
                        <span className="font-medium">{xpActual} / {xpSiguienteNivel} XP</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full bg-linear-to-r from-primary to-blue-500 transition-all"
                          style={{ width: `${xpPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-wrap gap-2">
                      {isOwnProfile ? (
                        <Button asChild className="flex-1 md:flex-none">
                          <Link href="/usuario/configuracion/personal">
                            <IconEdit className="size-4" />
                            Editar perfil
                          </Link>
                        </Button>
                      ) : isAuthenticated ? (
                        <>
                          {/* Botón para agregar amigo - mostrar si puede agregar o si no hay estado */}
                          {(estadoAmistad?.puede_agregar || !estadoAmistad?.estado) && (
                            <Button 
                              className="flex-1 md:flex-none"
                              onClick={handleEnviarSolicitud}
                              disabled={enviandoSolicitud}
                            >
                              {enviandoSolicitud ? (
                                <IconLoader2 className="size-4 animate-spin" />
                              ) : (
                                <IconUserPlus className="size-4" />
                              )}
                              Agregar amigo
                            </Button>
                          )}
                          
                          {/* Estado: Ya son amigos */}
                          {estadoAmistad?.estado === "aceptado" && (
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="flex items-center gap-1 px-3 py-2">
                                <IconUserCheck className="size-4 text-green-500" />
                                Amigos
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleEliminarAmigo}
                                disabled={enviandoSolicitud}
                                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                              >
                                {enviandoSolicitud ? (
                                  <IconLoader2 className="size-4 animate-spin" />
                                ) : (
                                  <IconX className="size-4" />
                                )}
                                Eliminar
                              </Button>
                            </div>
                          )}
                          
                          {/* Estado: TÚ enviaste la solicitud (esperando respuesta) */}
                          {estadoAmistad?.estado === "pendiente_enviada" && (
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="flex items-center gap-1 px-3 py-2">
                                <IconHourglass className="size-4 text-yellow-500" />
                                Solicitud enviada
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancelarSolicitud}
                                disabled={enviandoSolicitud}
                              >
                                {enviandoSolicitud ? (
                                  <IconLoader2 className="size-4 animate-spin" />
                                ) : (
                                  <IconX className="size-4" />
                                )}
                                Cancelar
                              </Button>
                            </div>
                          )}
                          
                          {/* Estado: TÚ recibiste la solicitud (puedes aceptar/rechazar) */}
                          {estadoAmistad?.estado === "pendiente_recibida" && (
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="flex items-center gap-1 px-3 py-2 border-blue-500">
                                <IconMailForward className="size-4 text-blue-500" />
                                Te envió solicitud
                              </Badge>
                              <Button
                                size="sm"
                                onClick={handleAceptarSolicitud}
                                disabled={enviandoSolicitud}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                {enviandoSolicitud ? (
                                  <IconLoader2 className="size-4 animate-spin" />
                                ) : (
                                  <IconCheck className="size-4" />
                                )}
                                Aceptar
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRechazarSolicitud}
                                disabled={enviandoSolicitud}
                                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                              >
                                {enviandoSolicitud ? (
                                  <IconLoader2 className="size-4 animate-spin" />
                                ) : (
                                  <IconX className="size-4" />
                                )}
                                Rechazar
                              </Button>
                            </div>
                          )}
                        </>
                      ) : (
                        <Button asChild variant="outline" className="flex-1 md:flex-none">
                          <Link href="/auth/login">
                            <IconUserPlus className="size-4" />
                            Inicia sesión para agregar amigo
                          </Link>
                        </Button>
                      )}
                    </div>

                    {/* Biografía */}
                    {perfil.usuario.biografia && (
                      <p className="text-sm text-muted-foreground">{perfil.usuario.biografia}</p>
                    )}

                    {/* Redes sociales */}
                    {perfil.redes_sociales.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {perfil.redes_sociales.map((red) => (
                          <Button
                            key={red.id}
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a href={red.enlace} target="_blank" rel="noopener noreferrer">
                              {getRedSocialIcon(red.plataforma)}
                              {red.plataforma}
                            </a>
                          </Button>
                        ))}
                      </div>
                    )}

                    {/* Ganancias totales (solo en perfil propio) */}
                    {isOwnProfile && (
                      <div className="rounded-lg border bg-green-500/10 p-3">
                        <p className="text-sm text-muted-foreground">Ganancias totales en torneos</p>
                        <p className="text-2xl font-bold text-green-500">
                          ${perfil.estadisticas_globales.dinero_total_ganado.toFixed(2)}
                        </p>
                      </div>
                    )}

                    {/* Solicitudes de amistad pendientes (solo en perfil propio) */}
                    {isOwnProfile && solicitudesPendientes.length > 0 && (
                      <div className="rounded-lg border p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <IconBell className="size-5 text-blue-500" />
                          <h3 className="font-semibold">Solicitudes de amistad pendientes</h3>
                          <Badge variant="secondary">{solicitudesPendientes.length}</Badge>
                        </div>
                        <div className="flex flex-col gap-3">
                          {solicitudesPendientes.map((solicitud) => (
                            <div key={solicitud.id} className="flex items-center justify-between gap-3 rounded-lg border bg-card/50 p-3">
                              <Link href={`/usuario/perfil/${solicitud.usuario1.nickname}`} className="flex items-center gap-3">
                                <Avatar className="size-10">
                                  <AvatarImage 
                                    src={solicitud.usuario1.avatar?.url || solicitud.usuario1.fotoPerfil || `https://api.dicebear.com/7.x/avataaars/svg?seed=${solicitud.usuario1.nickname}`} 
                                    alt={solicitud.usuario1.nickname} 
                                  />
                                  <AvatarFallback>
                                    {solicitud.usuario1.nickname.slice(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium hover:underline">{solicitud.usuario1.nickname}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(solicitud.creadoEn).toLocaleDateString()}
                                  </p>
                                </div>
                              </Link>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleAceptarSolicitudPendiente(solicitud.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <IconCheck className="size-4" />
                                  Aceptar
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRechazarSolicitudPendiente(solicitud.id)}
                                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                >
                                  <IconX className="size-4" />
                                  Rechazar
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs con información detallada */}
          <div className="px-4 lg:px-6">
            <Tabs defaultValue="stats" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-4">
                <TabsTrigger value="stats">
                  <IconDeviceGamepad className="size-4" />
                  Estadísticas
                </TabsTrigger>
                <TabsTrigger value="trophies">
                  <IconTrophy className="size-4" />
                  Trofeos
                </TabsTrigger>
                <TabsTrigger value="achievements">
                  <IconStar className="size-4" />
                  Logros
                </TabsTrigger>
                <TabsTrigger value="friends">
                  <IconUsers className="size-4" />
                  Amigos
                </TabsTrigger>
              </TabsList>

              {/* Estadísticas por juego */}
              <TabsContent value="stats" className="mt-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                  {perfil.estadisticas_juegos.map((stat) => (
                    <Card key={stat.juego_id}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{stat.juego_nombre}</span>
                          {stat.nivel_rango && (
                            <Badge variant="outline">{stat.nivel_rango}</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {stat.victorias + stat.derrotas + stat.empates} partidas jugadas
                          {stat.horas_jugadas > 0 && ` • ${stat.horas_jugadas}h jugadas`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col">
                            <span className="text-2xl font-bold text-green-500">{stat.victorias}</span>
                            <span className="text-xs text-muted-foreground">Victorias</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-2xl font-bold text-red-500">{stat.derrotas}</span>
                            <span className="text-xs text-muted-foreground">Derrotas</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-2xl font-bold text-yellow-500">{stat.empates}</span>
                            <span className="text-xs text-muted-foreground">Empates</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-2xl font-bold text-blue-500">{stat.porcentaje_victorias}%</span>
                            <span className="text-xs text-muted-foreground">% Victoria</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {perfil.estadisticas_juegos.length === 0 && (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <IconDeviceGamepad className="size-12 text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">No hay estadísticas disponibles</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Vitrina de trofeos */}
              <TabsContent value="trophies" className="mt-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {perfil.trofeos.map((trofeo) => (
                    <Card key={trofeo.id} className="overflow-hidden">
                      <div className={`h-2 ${getRarityColor(trofeo.tipo)}`} />
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          <div className="text-4xl">{getTrofeoEmoji(trofeo.posicion)}</div>
                          <div className="flex-1">
                            <CardTitle className="text-base">
                              {trofeo.torneo_titulo || trofeo.tipo}
                            </CardTitle>
                            <CardDescription className="mt-1 text-xs">
                              {trofeo.torneo_juego && `${trofeo.torneo_juego} • `}
                              {trofeo.posicion && `Posición #${trofeo.posicion}`}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="capitalize">
                            {trofeo.tipo}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(trofeo.ganado_en).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {perfil.trofeos.length === 0 && (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <IconTrophy className="size-12 text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">No hay trofeos aún</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Logros */}
              <TabsContent value="achievements" className="mt-4">
                <div className="grid gap-4">
                  {perfil.logros.map((logro) => (
                    <Card key={logro.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base">{logro.nombre}</CardTitle>
                            <CardDescription className="mt-1">
                              {logro.descripcion}
                            </CardDescription>
                          </div>
                          <Badge variant="default">
                            <IconStar className="size-3" />
                            Desbloqueado
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          Obtenido el {new Date(logro.fecha_obtenido).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {perfil.logros.length === 0 && (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <IconStar className="size-12 text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">No hay logros disponibles</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Lista de amigos */}
              <TabsContent value="friends" className="mt-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {perfil.amigos.map((amigo) => (
                    <Link key={amigo.id} href={`/usuario/perfil/${amigo.nickname}`}>
                      <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                        <CardContent className="flex items-center gap-3 pt-6">
                          <div className="relative">
                            <Avatar className="size-12">
                              <AvatarImage
                                src={
                                  amigo.avatar_url ||
                                  amigo.foto_perfil ||
                                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${amigo.nickname}`
                                }
                                alt={amigo.nickname}
                              />
                              <AvatarFallback>
                                {amigo.nickname.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-card ${
                                amigo.estado === "activo" ? "bg-green-500" : "bg-gray-400"
                              }`}
                            />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="truncate font-medium">{amigo.nickname}</p>
                            <p className="text-xs text-muted-foreground">
                              XP: {amigo.xp}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
                {perfil.amigos.length === 0 && (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <IconUsers className="size-12 text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">No hay amigos aún</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
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

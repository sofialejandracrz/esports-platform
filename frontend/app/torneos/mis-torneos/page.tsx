'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  IconTrophy,
  IconUsers,
  IconCalendar,
  IconCoin,
  IconPlus,
  IconLoader2,
  IconAlertCircle,
  IconRefresh,
  IconDotsVertical,
  IconEye,
  IconEdit,
  IconPlayerPlay,
  IconPlayerStop,
  IconTrash,
  IconCrown,
  IconDeviceGamepad2,
  IconLock,
} from '@tabler/icons-react';
import { misTorneos, cambiarEstadoTorneo, TorneoListItem } from '@/lib/api/torneos';
import { useAuth } from '@/contexts/auth-context';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/home/app-sidebar';
import { SiteHeader } from '@/components/home/site-header';
import { SiteFooter } from '@/components/home/site-footer';

// Mapear estados a badges con colores
function getEstadoBadge(estado: string) {
  switch (estado?.toLowerCase()) {
    case 'proximamente':
      return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">Próximamente</Badge>;
    case 'en_curso':
      return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">En Curso</Badge>;
    case 'terminado':
      return <Badge className="bg-gray-500/10 text-gray-500 hover:bg-gray-500/20">Terminado</Badge>;
    case 'cancelado':
      return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">Cancelado</Badge>;
    default:
      return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Abierto</Badge>;
  }
}

function formatDate(dateString: string): string {
  if (!dateString) return 'Por definir';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MisTorneosPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [torneos, setTorneos] = useState<TorneoListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // Filtro por estado
  const [estadoFiltro, setEstadoFiltro] = useState<string>('');
  
  // Paginación
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const limit = 12;

  // Estado para acciones
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    torneoId: string;
    action: string;
    title: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/torneos/mis-torneos');
    }
  }, [mounted, authLoading, isAuthenticated, router]);

  const cargarMisTorneos = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await misTorneos({
        estado: estadoFiltro || undefined,
        limit,
        offset,
      });
      
      if (response.success) {
        setTorneos(response.torneos || []);
        setTotal(response.total || 0);
      } else {
        setError('Error al cargar tus torneos');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, estadoFiltro, offset]);

  useEffect(() => {
    if (isAuthenticated) {
      cargarMisTorneos();
    }
  }, [cargarMisTorneos, isAuthenticated]);

  const handleCambiarEstado = async (torneoId: string, nuevoEstado: string) => {
    setActionLoading(torneoId);
    try {
      await cambiarEstadoTorneo(torneoId, nuevoEstado);
      await cargarMisTorneos();
    } catch (err) {
      console.error('Error al cambiar estado:', err);
    } finally {
      setActionLoading(null);
      setConfirmDialog(null);
    }
  };

  const openConfirmDialog = (torneoId: string, action: string, title: string, description: string) => {
    setConfirmDialog({ open: true, torneoId, action, title, description });
  };

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  // Estadísticas rápidas
  const stats = {
    total: torneos.length,
    activos: torneos.filter(t => t.estado === 'en_curso').length,
    proximos: torneos.filter(t => t.estado === 'proximamente').length,
    terminados: torneos.filter(t => t.estado === 'terminado').length,
  };

  // Loading de autenticación
  if (!mounted || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <IconLoader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  // No autenticado
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <IconLock className="mx-auto size-12 text-orange-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Acceso Restringido</h2>
            <p className="text-muted-foreground mb-4">
              Debes iniciar sesión para ver tus torneos
            </p>
            <Button onClick={() => router.push('/auth/login?redirect=/torneos/mis-torneos')}>
              Iniciar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
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
            <div className="container mx-auto px-4 py-8">
              {/* Header */}
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="flex items-center gap-2 text-2xl font-bold md:text-3xl">
                    <IconCrown className="size-8 text-yellow-500" />
                    Mis Torneos
                  </h1>
                  <p className="text-muted-foreground">
                    Administra los torneos que has creado
                  </p>
                </div>
                <Button asChild className="gap-2">
                  <Link href="/torneos/crear">
                    <IconPlus className="size-4" />
                    Crear Torneo
                  </Link>
                </Button>
              </div>

              {/* Estadísticas rápidas */}
              <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardContent className="flex items-center gap-4 pt-6">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <IconTrophy className="size-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.total}</p>
                      <p className="text-sm text-muted-foreground">Total Torneos</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center gap-4 pt-6">
                    <div className="rounded-lg bg-yellow-500/10 p-3">
                      <IconPlayerPlay className="size-6 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.activos}</p>
                      <p className="text-sm text-muted-foreground">En Curso</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center gap-4 pt-6">
                    <div className="rounded-lg bg-blue-500/10 p-3">
                      <IconCalendar className="size-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.proximos}</p>
                      <p className="text-sm text-muted-foreground">Próximos</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center gap-4 pt-6">
                    <div className="rounded-lg bg-green-500/10 p-3">
                      <IconTrophy className="size-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.terminados}</p>
                      <p className="text-sm text-muted-foreground">Completados</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filtros */}
              <Card className="mb-6">
                <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <Select value={estadoFiltro} onValueChange={(v) => { setEstadoFiltro(v); setOffset(0); }}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Todos los estados" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="proximamente">Próximamente</SelectItem>
                        <SelectItem value="en_curso">En Curso</SelectItem>
                        <SelectItem value="terminado">Terminado</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                    {estadoFiltro && (
                      <Button variant="ghost" size="sm" onClick={() => setEstadoFiltro('')}>
                        Limpiar
                      </Button>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={cargarMisTorneos} className="gap-2">
                    <IconRefresh className="size-4" />
                    Actualizar
                  </Button>
                </CardContent>
              </Card>

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
                    <Button variant="outline" onClick={cargarMisTorneos}>
                      Reintentar
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Sin torneos */}
              {!isLoading && !error && torneos.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center gap-4 py-12">
                    <IconTrophy className="size-12 text-muted-foreground" />
                    <div className="text-center">
                      <p className="font-medium">No tienes torneos creados</p>
                      <p className="text-sm text-muted-foreground">
                        Crea tu primer torneo y comienza a organizar competencias
                      </p>
                    </div>
                    <Button asChild>
                      <Link href="/torneos/crear">
                        <IconPlus className="mr-2 size-4" />
                        Crear mi primer torneo
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Grid de torneos */}
              {!isLoading && !error && torneos.length > 0 && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {torneos.map((torneo) => (
                      <Card
                        key={torneo.id}
                        className="group relative transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                      >
                        {/* Menú de acciones */}
                        <div className="absolute right-2 top-2 z-10">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 bg-background/80 backdrop-blur-sm"
                                disabled={actionLoading === torneo.id}
                              >
                                {actionLoading === torneo.id ? (
                                  <IconLoader2 className="size-4 animate-spin" />
                                ) : (
                                  <IconDotsVertical className="size-4" />
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/torneos/${torneo.id}`}>
                                  <IconEye className="mr-2 size-4" />
                                  Ver Torneo
                                </Link>
                              </DropdownMenuItem>
                              {torneo.estado === 'proximamente' && (
                                <>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/torneos/${torneo.id}/editar`}>
                                      <IconEdit className="mr-2 size-4" />
                                      Editar
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      openConfirmDialog(
                                        torneo.id,
                                        'en_curso',
                                        'Iniciar Torneo',
                                        '¿Estás seguro de iniciar este torneo? Los participantes serán notificados.'
                                      )
                                    }
                                  >
                                    <IconPlayerPlay className="mr-2 size-4" />
                                    Iniciar Torneo
                                  </DropdownMenuItem>
                                </>
                              )}
                              {torneo.estado === 'en_curso' && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    openConfirmDialog(
                                      torneo.id,
                                      'terminado',
                                      'Finalizar Torneo',
                                      '¿Estás seguro de finalizar este torneo?'
                                    )
                                  }
                                >
                                  <IconPlayerStop className="mr-2 size-4" />
                                  Finalizar Torneo
                                </DropdownMenuItem>
                              )}
                              {(torneo.estado === 'proximamente' || torneo.estado === 'en_curso') && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() =>
                                      openConfirmDialog(
                                        torneo.id,
                                        'cancelado',
                                        'Cancelar Torneo',
                                        '¿Estás seguro de cancelar este torneo? Esta acción no se puede deshacer.'
                                      )
                                    }
                                  >
                                    <IconTrash className="mr-2 size-4" />
                                    Cancelar Torneo
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Imagen/Banner */}
                        {torneo.miniatura_url ? (
                          <div className="relative h-32 overflow-hidden rounded-t-lg">
                            <img
                              src={torneo.miniatura_url}
                              alt={torneo.titulo}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
                            <div className="absolute bottom-2 left-2">
                              {getEstadoBadge(torneo.estado)}
                            </div>
                          </div>
                        ) : (
                          <CardHeader className="pb-3">
                            {getEstadoBadge(torneo.estado)}
                          </CardHeader>
                        )}

                        <CardHeader className={torneo.miniatura_url ? 'pt-3 pb-3' : 'pt-0 pb-3'}>
                          <CardTitle className="line-clamp-1 text-lg pr-8">{torneo.titulo}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <IconDeviceGamepad2 className="size-4" />
                            <span className="line-clamp-1">{torneo.juego || 'Sin especificar'}</span>
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <IconCalendar className="size-4 shrink-0" />
                            <span className="truncate">{formatDate(torneo.fecha_inicio)}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <IconUsers className="size-4 shrink-0" />
                            <span>
                              {torneo.inscripciones || 0}/{torneo.max_participantes || '∞'} inscritos
                            </span>
                          </div>

                          {torneo.fondo_premios > 0 && (
                            <div className="flex items-center gap-2 text-sm font-medium text-chart-1">
                              <IconCoin className="size-4 shrink-0" />
                              <span>${torneo.fondo_premios} en premios</span>
                            </div>
                          )}

                          {/* Barra de progreso */}
                          {torneo.max_participantes && (
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full bg-linear-to-r from-chart-1 to-chart-2 transition-all duration-500"
                                style={{
                                  width: `${Math.min(((torneo.inscripciones || 0) / torneo.max_participantes) * 100, 100)}%`,
                                }}
                              />
                            </div>
                          )}

                          <div className="flex gap-2 pt-2">
                            <Button className="flex-1 gap-2" size="sm" variant="outline" asChild>
                              <Link href={`/torneos/${torneo.id}`}>
                                <IconEye className="size-4" />
                                Ver
                              </Link>
                            </Button>
                            {torneo.estado === 'proximamente' && (
                              <Button className="flex-1 gap-2" size="sm" asChild>
                                <Link href={`/torneos/${torneo.id}/editar`}>
                                  <IconEdit className="size-4" />
                                  Editar
                                </Link>
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Paginación */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setOffset(Math.max(0, offset - limit))}
                      >
                        Anterior
                      </Button>
                      <span className="px-4 text-sm text-muted-foreground">
                        Página {currentPage} de {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage >= totalPages}
                        onClick={() => setOffset(offset + limit)}
                      >
                        Siguiente
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
          <SiteFooter />
        </div>
      </SidebarInset>

      {/* Drawer de confirmación */}
      <Drawer open={confirmDialog?.open} onOpenChange={(open: boolean) => !open && setConfirmDialog(null)}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{confirmDialog?.title}</DrawerTitle>
            <DrawerDescription>{confirmDialog?.description}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="flex-row gap-2 pt-4">
            <DrawerClose asChild>
              <Button variant="outline" className="flex-1">Cancelar</Button>
            </DrawerClose>
            <Button
              className="flex-1"
              onClick={() => confirmDialog && handleCambiarEstado(confirmDialog.torneoId, confirmDialog.action)}
            >
              Confirmar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </SidebarProvider>
  );
}

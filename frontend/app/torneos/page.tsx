'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  IconTrophy,
  IconUsers,
  IconCalendar,
  IconCoin,
  IconSearch,
  IconPlus,
  IconLoader2,
  IconAlertCircle,
  IconFilter,
  IconRefresh,
  IconMapPin,
  IconDeviceGamepad2,
} from '@tabler/icons-react';
import { listarTorneos, obtenerCatalogos, TorneoListItem, TorneoCatalogos } from '@/lib/api/torneos';
import { useAuth } from '@/contexts/auth-context';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/home/app-sidebar';
import { SiteHeader } from '@/components/home/site-header';
import { SiteFooter } from '@/components/home/site-footer';
import Particles from '@/components/Particles';

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

export default function TorneosPage() {
  const { isAuthenticated } = useAuth();
  const [torneos, setTorneos] = useState<TorneoListItem[]>([]);
  const [catalogos, setCatalogos] = useState<TorneoCatalogos | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState<string>('');
  const [juegoFiltro, setJuegoFiltro] = useState<string>('');
  const [regionFiltro, setRegionFiltro] = useState<string>('');
  
  // Paginación
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const limit = 12;

  const cargarTorneos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await listarTorneos({
        estado: estadoFiltro || undefined,
        juego_id: juegoFiltro || undefined,
        region_id: regionFiltro || undefined,
        busqueda: busqueda || undefined,
        limit,
        offset,
      });
      
      if (response.success) {
        setTorneos(response.torneos || []);
        setTotal(response.total || 0);
      } else {
        setError('Error al cargar los torneos');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  }, [estadoFiltro, juegoFiltro, regionFiltro, busqueda, offset]);

  const cargarCatalogos = useCallback(async () => {
    try {
      const data = await obtenerCatalogos();
      setCatalogos(data);
    } catch (err) {
      console.error('Error al cargar catálogos:', err);
    }
  }, []);

  useEffect(() => {
    cargarCatalogos();
  }, [cargarCatalogos]);

  useEffect(() => {
    cargarTorneos();
  }, [cargarTorneos]);

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(0);
      cargarTorneos();
    }, 300);
    return () => clearTimeout(timer);
  }, [busqueda]);

  const limpiarFiltros = () => {
    setBusqueda('');
    setEstadoFiltro('');
    setJuegoFiltro('');
    setRegionFiltro('');
    setOffset(0);
  };

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  return (
    <SidebarProvider
      style={{
        '--sidebar-width': 'calc(var(--spacing) * 72)',
        '--header-height': 'calc(var(--spacing) * 12)',
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="relative">
        <Particles
          particleColors={["#8B5CF6", "#A855F7", "#06B6D4", "#EC4899"]}
          particleCount={700}
          particleSpread={12}
          speed={0.08}
          particleBaseSize={120}
          moveParticlesOnHover={false}
          particleHoverFactor={0.5}
          alphaParticles={true}
          sizeRandomness={0.8}
          className="pointer-events-none"
        />
        <SiteHeader />
        <div className="relative z-10 flex flex-1 flex-col">
          <main className="flex-1">
            <div className="container mx-auto px-4 py-8">
              {/* Header */}
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold md:text-3xl">Torneos</h1>
                  <p className="text-muted-foreground">
                    Encuentra y participa en los mejores torneos de eSports
                  </p>
                </div>
                {isAuthenticated && (
                  <Button asChild className="gap-2">
                    <Link href="/torneos/crear">
                      <IconPlus className="size-4" />
                      Crear Torneo
                    </Link>
                  </Button>
                )}
              </div>

              {/* Filtros */}
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4">
                    {/* Búsqueda */}
                    <div className="relative">
                      <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Buscar torneos por nombre..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="pl-9"
                      />
                    </div>

                    {/* Filtros en grid */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {/* Estado */}
                      <Select value={estadoFiltro} onValueChange={(v) => { setEstadoFiltro(v); setOffset(0); }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="proximamente">Próximamente</SelectItem>
                          <SelectItem value="en_curso">En Curso</SelectItem>
                          <SelectItem value="terminado">Terminado</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Juego */}
                      <Select value={juegoFiltro} onValueChange={(v) => { setJuegoFiltro(v); setOffset(0); }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Juego" />
                        </SelectTrigger>
                        <SelectContent>
                          {catalogos?.juegos?.map((juego) => (
                            <SelectItem key={juego.id} value={juego.id}>
                              {juego.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Región */}
                      <Select value={regionFiltro} onValueChange={(v) => { setRegionFiltro(v); setOffset(0); }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Región" />
                        </SelectTrigger>
                        <SelectContent>
                          {catalogos?.regiones?.map((region) => (
                            <SelectItem key={region.id} value={region.id}>
                              {region.valor}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Botón limpiar */}
                      <Button variant="outline" onClick={limpiarFiltros} className="gap-2">
                        <IconRefresh className="size-4" />
                        Limpiar filtros
                      </Button>
                    </div>
                  </div>
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
                    <Button variant="outline" onClick={cargarTorneos}>
                      Reintentar
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Sin resultados */}
              {!isLoading && !error && torneos.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center gap-4 py-12">
                    <IconTrophy className="size-12 text-muted-foreground" />
                    <div className="text-center">
                      <p className="font-medium">No se encontraron torneos</p>
                      <p className="text-sm text-muted-foreground">
                        Intenta con otros filtros o crea el primer torneo
                      </p>
                    </div>
                    {isAuthenticated && (
                      <Button asChild>
                        <Link href="/torneos/crear">Crear Torneo</Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Grid de torneos */}
              {!isLoading && !error && torneos.length > 0 && (
                <>
                  <div className="mb-4 text-sm text-muted-foreground">
                    Mostrando {torneos.length} de {total} torneos
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {torneos.map((torneo) => {
                      const inscritos = torneo.inscripciones ?? 0;
                      const maxParticipantes = torneo.max_participantes;
                      const tieneMaximo = maxParticipantes && maxParticipantes > 0;
                      const porcentajeOcupacion = tieneMaximo 
                        ? Math.min((inscritos / maxParticipantes) * 100, 100) 
                        : 0;
                      const estaLleno = tieneMaximo && inscritos >= maxParticipantes;
                      
                      return (
                        <Card
                          key={torneo.id}
                          className="group relative overflow-hidden border-border/50 bg-linear-to-b from-card to-card/80 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10"
                        >
                          {/* Imagen/Banner */}
                          <div className="relative h-40 overflow-hidden">
                            {torneo.miniatura_url ? (
                              <img
                                src={torneo.miniatura_url}
                                alt={torneo.titulo}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/20 via-primary/10 to-transparent">
                                <IconTrophy className="size-16 text-primary/40" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-linear-to-t from-card via-card/50 to-transparent" />
                            
                            {/* Badge de estado - esquina superior derecha */}
                            <div className="absolute right-2 top-2">
                              {getEstadoBadge(torneo.estado)}
                            </div>
                            
                            {/* Premio destacado si existe */}
                            {torneo.fondo_premios > 0 && (
                              <div className="absolute left-2 top-2">
                                <Badge className="gap-1 bg-yellow-500/90 text-yellow-950 hover:bg-yellow-500">
                                  <IconCoin className="size-3" />
                                  ${torneo.fondo_premios.toLocaleString()}
                                </Badge>
                              </div>
                            )}
                            
                            {/* Juego - sobre la imagen */}
                            <div className="absolute bottom-2 left-2 right-2">
                              <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                                <IconDeviceGamepad2 className="size-4 text-primary" />
                                <span className="line-clamp-1">{torneo.juego || 'Sin especificar'}</span>
                              </div>
                            </div>
                          </div>

                          <CardHeader className="space-y-1 pb-2 pt-3">
                            <CardTitle className="line-clamp-2 text-base font-bold leading-tight group-hover:text-primary transition-colors">
                              {torneo.titulo}
                            </CardTitle>
                          </CardHeader>

                          <CardContent className="space-y-3 pb-4">
                            {/* Info en grid compacto */}
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <IconCalendar className="size-3.5 text-blue-400" />
                                <span className="truncate">{formatDate(torneo.fecha_inicio).split(',')[0]}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <IconMapPin className="size-3.5 text-green-400" />
                                <span className="truncate">{torneo.region || 'Global'}</span>
                              </div>
                            </div>

                            {/* Participantes con barra de progreso mejorada */}
                            <div className="space-y-2 rounded-lg bg-muted/50 p-2.5">
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-1.5">
                                  <IconUsers className="size-4 text-primary" />
                                  <span className="font-medium">Participantes</span>
                                </div>
                                <span className={`font-bold ${estaLleno ? 'text-red-400' : 'text-foreground'}`}>
                                  {inscritos}{tieneMaximo ? `/${maxParticipantes}` : ''}
                                </span>
                              </div>
                              
                              {tieneMaximo ? (
                                <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                                  <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                      estaLleno 
                                        ? 'bg-red-500' 
                                        : porcentajeOcupacion > 75 
                                          ? 'bg-linear-to-r from-yellow-500 to-orange-500'
                                          : 'bg-linear-to-r from-primary to-violet-500'
                                    }`}
                                    style={{ width: `${porcentajeOcupacion}%` }}
                                  />
                                </div>
                              ) : (
                                <p className="text-xs text-muted-foreground">Sin límite de participantes</p>
                              )}
                              
                              {tieneMaximo && (
                                <p className="text-xs text-muted-foreground">
                                  {estaLleno 
                                    ? '¡Cupos agotados!' 
                                    : `${maxParticipantes - inscritos} lugares disponibles`
                                  }
                                </p>
                              )}
                            </div>

                            {/* Botón de acción */}
                            <Button 
                              className="w-full gap-2 font-semibold transition-all group-hover:bg-primary group-hover:text-primary-foreground" 
                              variant="outline"
                              size="sm" 
                              asChild
                            >
                              <Link href={`/torneos/${torneo.id}`}>
                                <IconTrophy className="size-4" />
                                Ver Detalles
                              </Link>
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
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
    </SidebarProvider>
  );
}

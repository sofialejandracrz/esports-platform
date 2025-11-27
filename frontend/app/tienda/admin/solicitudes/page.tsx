"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  IconArrowLeft,
  IconHeadset,
  IconCheck,
  IconX,
  IconClock,
  IconEye,
  IconRefresh,
  IconChevronLeft,
  IconChevronRight,
  IconAlertCircle,
  IconUser,
  IconCalendar,
} from "@tabler/icons-react";
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/home/app-sidebar';
import { SiteHeader } from '@/components/home/site-header';
import { SiteFooter } from '@/components/home/site-footer';
import { useTiendaAdmin } from "@/hooks/use-tienda-admin";
import { toNumber } from "@/lib/utils";
import type { SolicitudSoporte } from "@/types/tienda";

// Estilos por estado
const estadoStyles: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; color: string }> = {
  pendiente: { variant: "secondary", color: "text-yellow-500" },
  en_revision: { variant: "outline", color: "text-blue-500" },
  aprobado: { variant: "default", color: "text-green-500" },
  rechazado: { variant: "destructive", color: "text-red-500" },
};

export default function SolicitudesSoportePage() {
  const router = useRouter();
  const {
    fetchSolicitudes,
    solicitudes,
    getSolicitudDetalle,
    solicitudActual,
    aprobarSolicitud,
    rechazarSolicitud,
    isLoading,
    error,
    clearSolicitudActual,
  } = useTiendaAdmin();
  
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [notas, setNotas] = useState("");
  const [accionPendiente, setAccionPendiente] = useState<"aprobar" | "rechazar" | null>(null);
  const limit = 10;

  useEffect(() => {
    const estado = filtroEstado === "todos" ? undefined : filtroEstado;
    fetchSolicitudes(estado, limit, page * limit);
  }, [fetchSolicitudes, filtroEstado, page]);

  const handleVerDetalle = async (solicitudId: string) => {
    await getSolicitudDetalle(solicitudId);
    setModalOpen(true);
  };

  const handleCerrarModal = () => {
    setModalOpen(false);
    setNotas("");
    setAccionPendiente(null);
    clearSolicitudActual();
  };

  const handleConfirmarAccion = async () => {
    if (!solicitudActual || !accionPendiente) return;

    const result = accionPendiente === "aprobar"
      ? await aprobarSolicitud(solicitudActual.id, notas || undefined)
      : await rechazarSolicitud(solicitudActual.id, notas || undefined);

    if (result?.success) {
      handleCerrarModal();
      // Recargar lista
      const estado = filtroEstado === "todos" ? undefined : filtroEstado;
      fetchSolicitudes(estado, limit, page * limit);
    }
  };

  const handleRefresh = () => {
    const estado = filtroEstado === "todos" ? undefined : filtroEstado;
    fetchSolicitudes(estado, limit, page * limit);
  };

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
              <div className="container mx-auto max-w-6xl px-4 py-8">
                <Card className="border-destructive">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <IconX className="size-12 text-destructive" />
                    <h2 className="mt-4 text-xl font-semibold">Error al cargar las solicitudes</h2>
                    <p className="mt-2 text-muted-foreground">{error}</p>
                    <Button onClick={handleRefresh} className="mt-4">
                      Reintentar
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
            <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard")}
          >
            <IconArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Solicitudes de Soporte</h1>
            <p className="text-muted-foreground">
              Gestiona las solicitudes de servicios especiales
            </p>
          </div>
        </div>
        
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <IconRefresh className="mr-2 size-4" />
          Actualizar
        </Button>
      </div>

      {/* Estadísticas */}
      {solicitudes && (
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-yellow-500/20">
                <IconClock className="size-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pendientes</p>
                <p className="text-xl font-bold">
                  {solicitudes.solicitudes.filter(s => s.estado === 'pendiente').length}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/20">
                <IconEye className="size-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">En Revisión</p>
                <p className="text-xl font-bold">
                  {solicitudes.solicitudes.filter(s => s.estado === 'en_revision').length}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/20">
                <IconCheck className="size-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Aprobadas</p>
                <p className="text-xl font-bold">
                  {solicitudes.solicitudes.filter(s => s.estado === 'aprobado').length}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-red-500/20">
                <IconX className="size-5 text-red-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Rechazadas</p>
                <p className="text-xl font-bold">
                  {solicitudes.solicitudes.filter(s => s.estado === 'rechazado').length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="flex items-center gap-4 p-4">
          <span className="text-sm font-medium">Filtrar por estado:</span>
          <Select value={filtroEstado} onValueChange={setFiltroEstado}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="en_revision">En Revisión</SelectItem>
              <SelectItem value="aprobado">Aprobado</SelectItem>
              <SelectItem value="rechazado">Rechazado</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Tabla de solicitudes */}
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes</CardTitle>
          <CardDescription>
            Total: {solicitudes?.total || 0} solicitudes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !solicitudes?.solicitudes.length ? (
            <div className="flex flex-col items-center justify-center py-12">
              <IconHeadset className="size-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">
                No hay solicitudes {filtroEstado !== "todos" ? `con estado "${filtroEstado}"` : ""}
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Datos</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {solicitudes.solicitudes.map((solicitud) => (
                    <SolicitudRow
                      key={solicitud.id}
                      solicitud={solicitud}
                      onVerDetalle={handleVerDetalle}
                    />
                  ))}
                </TableBody>
              </Table>

              {/* Paginación */}
              {solicitudes.total > limit && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {page * limit + 1} -{" "}
                    {Math.min((page + 1) * limit, solicitudes.total)} de{" "}
                    {solicitudes.total}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(0, p - 1))}
                      disabled={page === 0}
                    >
                      <IconChevronLeft className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => p + 1)}
                      disabled={(page + 1) * limit >= solicitudes.total}
                    >
                      <IconChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal de detalle */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalle de Solicitud</DialogTitle>
            <DialogDescription>
              Revisa los detalles y resuelve la solicitud
            </DialogDescription>
          </DialogHeader>

          {solicitudActual && (
            <div className="space-y-4">
              {/* Info del usuario */}
              <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                <IconUser className="size-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{solicitudActual.usuario.nickname}</p>
                  <p className="text-sm text-muted-foreground">
                    ID: {solicitudActual.usuario.id}
                  </p>
                </div>
              </div>

              {/* Detalles del servicio */}
              <div className="grid gap-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo:</span>
                  <span className="font-medium capitalize">{solicitudActual.tipo.replace('_', ' ')}</span>
                </div>
                {solicitudActual.nickname_solicitado && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nickname solicitado:</span>
                    <span className="font-mono font-medium">{solicitudActual.nickname_solicitado}</span>
                  </div>
                )}
                {solicitudActual.orden && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monto:</span>
                    <span className="font-medium">${toNumber(solicitudActual.orden.monto).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estado:</span>
                  <Badge variant={estadoStyles[solicitudActual.estado]?.variant || "secondary"}>
                    {solicitudActual.estado}
                  </Badge>
                </div>
              </div>

              {/* Fecha */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconCalendar className="size-4" />
                <span>
                  {new Date(solicitudActual.creado_en).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Solo mostrar acciones si está pendiente o en revisión */}
              {(solicitudActual.estado === "pendiente" || solicitudActual.estado === "en_revision") && (
                <>
                  {/* Notas del admin */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Notas (opcional)
                    </label>
                    <Textarea
                      value={notas}
                      onChange={(e) => setNotas(e.target.value)}
                      placeholder="Añade notas sobre la resolución..."
                      rows={3}
                    />
                  </div>

                  {/* Botones de acción */}
                  {!accionPendiente ? (
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 border-red-500 text-red-500 hover:bg-red-500/10"
                        onClick={() => setAccionPendiente("rechazar")}
                      >
                        <IconX className="mr-2 size-4" />
                        Rechazar
                      </Button>
                      <Button
                        className="flex-1 bg-green-500 hover:bg-green-600"
                        onClick={() => setAccionPendiente("aprobar")}
                      >
                        <IconCheck className="mr-2 size-4" />
                        Aprobar
                      </Button>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
                      <div className="flex items-center gap-2 text-yellow-500">
                        <IconAlertCircle className="size-5" />
                        <span className="font-medium">
                          ¿Confirmar {accionPendiente === "aprobar" ? "aprobación" : "rechazo"}?
                        </span>
                      </div>
                      <div className="mt-3 flex gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAccionPendiente(null)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          size="sm"
                          className={accionPendiente === "aprobar" 
                            ? "bg-green-500 hover:bg-green-600" 
                            : "bg-red-500 hover:bg-red-600"}
                          onClick={handleConfirmarAccion}
                          disabled={isLoading}
                        >
                          {isLoading ? "Procesando..." : "Confirmar"}
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Mostrar notas previas si ya fue resuelta */}
              {solicitudActual.notas_admin && (
                <div className="rounded-lg bg-muted p-3">
                  <p className="mb-1 text-sm font-medium">Notas del admin:</p>
                  <p className="text-sm text-muted-foreground">{solicitudActual.notas_admin}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCerrarModal}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
            </div>
          </main>
          <SiteFooter />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

// Componente de fila de solicitud
function SolicitudRow({ 
  solicitud, 
  onVerDetalle 
}: { 
  solicitud: SolicitudSoporte;
  onVerDetalle: (id: string) => void;
}) {
  const estadoStyle = estadoStyles[solicitud.estado] || estadoStyles.pendiente;
  
  const fecha = new Date(solicitud.creado_en);
  const fechaFormateada = fecha.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
  });

  // Extraer nickname solicitado
  const nickname = solicitud.nickname_solicitado || "-";

  return (
    <TableRow>
      <TableCell>
        <div>
          <p className="font-medium">{solicitud.usuario.nickname}</p>
          <p className="text-xs text-muted-foreground">ID: {solicitud.usuario.id.slice(0, 8)}</p>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm capitalize">{solicitud.tipo.replace('_', ' ')}</span>
      </TableCell>
      <TableCell>
        <span className="font-mono text-sm">{nickname}</span>
      </TableCell>
      <TableCell>
        <span className="font-medium">
          {solicitud.orden ? `$${toNumber(solicitud.orden.monto).toFixed(2)}` : '-'}
        </span>
      </TableCell>
      <TableCell>
        <Badge variant={estadoStyle.variant} className="capitalize">
          {solicitud.estado.replace('_', ' ')}
        </Badge>
      </TableCell>
      <TableCell>
        <span className="text-sm text-muted-foreground">{fechaFormateada}</span>
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onVerDetalle(solicitud.id)}
        >
          <IconEye className="mr-1 size-4" />
          Ver
        </Button>
      </TableCell>
    </TableRow>
  );
}

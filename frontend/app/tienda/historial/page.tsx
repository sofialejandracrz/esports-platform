"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
  IconArrowLeft,
  IconReceipt,
  IconCoins,
  IconCrown,
  IconUserEdit,
  IconCheck,
  IconX,
  IconClock,
  IconRefresh,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/home/app-sidebar';
import { SiteHeader } from '@/components/home/site-header';
import { SiteFooter } from '@/components/home/site-footer';
import { useTienda } from "@/hooks/use-tienda";
import { toNumber, formatPrice } from "@/lib/utils";
import type { OrdenCompra } from "@/types/tienda";

// Mapeo de iconos por tipo de item
const tipoIcons: Record<string, any> = {
  creditos: IconCoins,
  membresia: IconCrown,
  servicio: IconUserEdit,
};

// Colores por estado
const estadoStyles: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: any }> = {
  completado: { variant: "default", icon: IconCheck },
  pendiente: { variant: "secondary", icon: IconClock },
  cancelado: { variant: "destructive", icon: IconX },
  fallido: { variant: "destructive", icon: IconX },
  en_proceso: { variant: "secondary", icon: IconClock },
};

export default function HistorialPage() {
  const router = useRouter();
  const { fetchHistorial, historial, isLoading, error } = useTienda();
  
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [page, setPage] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchHistorial(limit, page * limit);
  }, [fetchHistorial, page]);

  // Filtrar por tipo
  const comprasFiltradas = historial?.compras.filter(compra => {
    if (filtroTipo === "todos") return true;
    return compra.item.tipo === filtroTipo;
  }) || [];

  const handleRefresh = () => {
    fetchHistorial(limit, page * limit);
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
                    <h2 className="mt-4 text-xl font-semibold">Error al cargar el historial</h2>
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
            onClick={() => router.push("/tienda")}
          >
            <IconArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Historial de Compras</h1>
            <p className="text-muted-foreground">
              Revisa todas tus transacciones anteriores
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <IconRefresh className="mr-2 size-4" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Resumen */}
      {historial && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex size-12 items-center justify-center rounded-lg bg-blue-500/20">
                <IconReceipt className="size-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Compras</p>
                <p className="text-2xl font-bold">{historial.total}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex size-12 items-center justify-center rounded-lg bg-green-500/20">
                <IconCoins className="size-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Compras Completadas</p>
                <p className="text-2xl font-bold">
                  {historial.compras.filter(c => c.estado === 'completado').length}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex size-12 items-center justify-center rounded-lg bg-purple-500/20">
                <IconCrown className="size-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Gastado</p>
                <p className="text-2xl font-bold">
                  ${historial.compras
                    .filter(c => c.estado === 'completado')
                    .reduce((sum, c) => sum + toNumber(c.monto), 0)
                    .toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="flex items-center gap-4 p-4">
          <span className="text-sm font-medium">Filtrar por:</span>
          <Select value={filtroTipo} onValueChange={setFiltroTipo}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de compra" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="creditos">Créditos</SelectItem>
              <SelectItem value="membresia">Membresías</SelectItem>
              <SelectItem value="servicio">Servicios</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Tabla de historial */}
      <Card>
        <CardHeader>
          <CardTitle>Transacciones</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : comprasFiltradas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <IconReceipt className="size-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">
                {filtroTipo === "todos" 
                  ? "No tienes compras registradas"
                  : `No tienes compras de tipo "${filtroTipo}"`}
              </p>
              <Button
                variant="outline"
                onClick={() => router.push("/tienda")}
                className="mt-4"
              >
                Ir a la tienda
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comprasFiltradas.map((compra) => (
                    <CompraRow key={compra.id} compra={compra} />
                  ))}
                </TableBody>
              </Table>

              {/* Paginación */}
              {historial && historial.total > limit && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {page * limit + 1} -{" "}
                    {Math.min((page + 1) * limit, historial.total)} de{" "}
                    {historial.total}
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
                      disabled={(page + 1) * limit >= historial.total}
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
            </div>
          </main>
          <SiteFooter />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

// Componente de fila de compra
function CompraRow({ compra }: { compra: OrdenCompra }) {
  const Icon = tipoIcons[compra.item.tipo] || IconReceipt;
  const estadoStyle = estadoStyles[compra.estado] || estadoStyles.pendiente;
  const StatusIcon = estadoStyle.icon;
  
  const fecha = new Date(compra.creado_en);
  const fechaFormateada = fecha.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Determinar método de pago
  const metodoPago = compra.paypal_order_id ? 'PayPal' : 'Saldo';

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
            <Icon className="size-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">{compra.item.nombre}</p>
            <p className="text-xs text-muted-foreground">#{compra.id.slice(0, 8)}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {compra.item.tipo}
        </Badge>
      </TableCell>
      <TableCell>
        <span className="text-sm">{metodoPago}</span>
      </TableCell>
      <TableCell>
        <span className="font-medium">${toNumber(compra.monto).toFixed(2)}</span>
      </TableCell>
      <TableCell>
        <Badge variant={estadoStyle.variant} className="gap-1">
          <StatusIcon className="size-3" />
          <span className="capitalize">{compra.estado.replace('_', ' ')}</span>
        </Badge>
      </TableCell>
      <TableCell>
        <span className="text-sm text-muted-foreground">{fechaFormateada}</span>
      </TableCell>
    </TableRow>
  );
}

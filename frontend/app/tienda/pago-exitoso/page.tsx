"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { IconCheck, IconLoader2, IconAlertTriangle } from "@tabler/icons-react";
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/home/app-sidebar';
import { SiteHeader } from '@/components/home/site-header';
import { SiteFooter } from '@/components/home/site-footer';
import { useTienda } from "@/hooks/use-tienda";

function PagoExitosoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { completarCompraPayPal, getOrdenPendiente } = useTienda();
  
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState("Procesando tu pago...");
  const [resultado, setResultado] = useState<any>(null);

  useEffect(() => {
    const procesarPago = async () => {
      // Obtener datos de la orden pendiente
      const ordenPendiente = getOrdenPendiente();
      
      if (!ordenPendiente) {
        setStatus('error');
        setMessage("No se encontró una orden pendiente. Por favor, intenta de nuevo.");
        return;
      }

      try {
        // Capturar el pago en PayPal y completar la compra
        const result = await completarCompraPayPal(
          ordenPendiente.ordenId,
          ordenPendiente.paypalOrderId
        );

        if (result?.success) {
          setStatus('success');
          setMessage("¡Pago completado exitosamente!");
          setResultado(result.resultado);
        } else {
          setStatus('error');
          setMessage(result?.error || "Hubo un problema al procesar tu pago.");
        }
      } catch (error) {
        setStatus('error');
        setMessage("Error al procesar el pago. Contacta a soporte si el problema persiste.");
      }
    };

    procesarPago();
  }, [completarCompraPayPal, getOrdenPendiente]);

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
            <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-background to-muted/20 p-4">
              <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {status === 'processing' && (
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-blue-500/20">
              <IconLoader2 className="size-8 animate-spin text-blue-500" />
            </div>
          )}
          {status === 'success' && (
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-500/20">
              <IconCheck className="size-8 text-green-500" />
            </div>
          )}
          {status === 'error' && (
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-500/20">
              <IconAlertTriangle className="size-8 text-red-500" />
            </div>
          )}
          
          <h1 className="mt-4 text-2xl font-bold">
            {status === 'processing' && 'Procesando Pago'}
            {status === 'success' && '¡Compra Exitosa!'}
            {status === 'error' && 'Error en el Pago'}
          </h1>
        </CardHeader>

        <CardContent className="text-center">
          <p className="text-muted-foreground">{message}</p>
          
          {/* Mostrar resultado de la compra */}
          {status === 'success' && resultado && (
            <div className="mt-4 space-y-2 rounded-lg bg-muted/50 p-4 text-left">
              {resultado.tipo === 'creditos' && (
                <p className="text-sm">
                  <span className="font-medium">Créditos agregados:</span>{" "}
                  +{resultado.creditos_agregados}
                </p>
              )}
              {resultado.tipo === 'membresia' && (
                <>
                  <p className="text-sm">
                    <span className="font-medium">Membresía:</span>{" "}
                    {resultado.membresia}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Válida hasta:</span>{" "}
                    {new Date(resultado.fecha_fin).toLocaleDateString()}
                  </p>
                </>
              )}
              {resultado.tipo === 'servicio' && (
                <>
                  {resultado.servicio === 'cambio_nickname' && (
                    <p className="text-sm">
                      Tu nuevo nickname es: <span className="font-bold">{resultado.nickname_nuevo}</span>
                    </p>
                  )}
                  {resultado.servicio === 'reclamar_nickname' && (
                    <p className="text-sm">
                      Solicitud enviada para: <span className="font-bold">{resultado.nickname_solicitado}</span>
                      <br />
                      <span className="text-xs text-muted-foreground">
                        Te contactaremos pronto.
                      </span>
                    </p>
                  )}
                  {resultado.servicio === 'reset_record' && (
                    <p className="text-sm">Tu récord de juego ha sido reiniciado.</p>
                  )}
                  {resultado.servicio === 'reset_stats' && (
                    <p className="text-sm">Tus estadísticas han sido reiniciadas.</p>
                  )}
                </>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center gap-2">
          <Button variant="outline" onClick={() => router.push('/tienda')}>
            Volver a la Tienda
          </Button>
          {status === 'success' && (
            <Button onClick={() => router.push('/dashboard')}>
              Ir al Dashboard
            </Button>
          )}
        </CardFooter>
      </Card>
            </div>
          </main>
          <SiteFooter />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function PagoExitosoPage() {
  return (
    <Suspense fallback={
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
              <div className="flex min-h-screen items-center justify-center">
                <Card className="w-full max-w-md">
                  <CardHeader className="text-center">
                    <Skeleton className="mx-auto size-16 rounded-full" />
                    <Skeleton className="mx-auto mt-4 h-8 w-48" />
                  </CardHeader>
                  <CardContent className="text-center">
                    <Skeleton className="mx-auto h-4 w-64" />
                  </CardContent>
                </Card>
              </div>
            </main>
            <SiteFooter />
          </div>
        </SidebarInset>
      </SidebarProvider>
    }>
      <PagoExitosoContent />
    </Suspense>
  );
}

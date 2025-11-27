"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconX } from "@tabler/icons-react";
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/home/app-sidebar';
import { SiteHeader } from '@/components/home/site-header';
import { SiteFooter } from '@/components/home/site-footer';
import { useTienda } from "@/hooks/use-tienda";

export default function PagoCanceladoPage() {
  const router = useRouter();
  const { getOrdenPendiente, cancelarOrden } = useTienda();

  useEffect(() => {
    // Cancelar la orden pendiente si existe
    const cancelarOrdenPendiente = async () => {
      const ordenPendiente = getOrdenPendiente();
      if (ordenPendiente) {
        try {
          await cancelarOrden(ordenPendiente.ordenId);
        } catch (error) {
          console.error("Error al cancelar orden:", error);
        }
      }
    };

    cancelarOrdenPendiente();
  }, [getOrdenPendiente, cancelarOrden]);

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
                  <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-orange-500/20">
                    <IconX className="size-8 text-orange-500" />
                  </div>
                  
                  <h1 className="mt-4 text-2xl font-bold">Pago Cancelado</h1>
                </CardHeader>

                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    Has cancelado el proceso de pago. No se ha realizado ningún cargo a tu cuenta.
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Puedes volver a intentarlo cuando quieras.
                  </p>
                </CardContent>

                <CardFooter className="flex justify-center gap-2">
                  <Button variant="outline" onClick={() => router.push('/')}>
                    Ir al Inicio
                  </Button>
                  <Button onClick={() => router.push('/tienda')}>
                    Volver a la Tienda
                  </Button>
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

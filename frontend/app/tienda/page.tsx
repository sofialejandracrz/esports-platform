"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useTienda } from "@/hooks/use-tienda";
import { CreditosSection } from "@/components/tienda/creditos-section";
import { MembresiasSection } from "@/components/tienda/membresias-section";
import { ServiciosSection } from "@/components/tienda/servicios-section";
import { UserBalanceCard } from "@/components/tienda/user-balance-card";
import { PurchaseModal } from "@/components/tienda/purchase-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/home/app-sidebar';
import { SiteHeader } from '@/components/home/site-header';
import { SiteFooter } from '@/components/home/site-footer';
import { 
  IconCoins, 
  IconCrown, 
  IconSettings,
  IconShoppingCart,
  IconReceipt
} from "@tabler/icons-react";
import Link from "next/link";
import type { ItemCreditos, ItemMembresia, ItemServicio } from "@/types/tienda";

type SelectedItem = 
  | { type: 'creditos'; item: ItemCreditos }
  | { type: 'membresia'; item: ItemMembresia }
  | { type: 'servicio'; item: ItemServicio };

export default function TiendaPage() {
  const { isAuthenticated, usuario, isLoading: isAuthLoading } = useAuth();
  const { catalogo, isLoading, error, fetchCatalogo } = useTienda();
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [catalogoLoaded, setCatalogoLoaded] = useState(false);

  useEffect(() => {
    // Esperar a que termine la carga de autenticación antes de cargar el catálogo
    if (!isAuthLoading && !catalogoLoaded) {
      fetchCatalogo(isAuthenticated);
      setCatalogoLoaded(true);
    }
  }, [fetchCatalogo, isAuthenticated, isAuthLoading, catalogoLoaded]);

  // Recargar catálogo cuando cambie el estado de autenticación (después de la carga inicial)
  useEffect(() => {
    if (catalogoLoaded && !isAuthLoading) {
      fetchCatalogo(isAuthenticated);
    }
  }, [isAuthenticated]);

  const handleSelectItem = (item: SelectedItem) => {
    if (!isAuthenticated) {
      // Redirigir al login si no está autenticado
      window.location.href = "/auth/login?redirect=/tienda";
      return;
    }
    setSelectedItem(item);
    setIsPurchaseModalOpen(true);
  };

  const handlePurchaseComplete = () => {
    setIsPurchaseModalOpen(false);
    setSelectedItem(null);
    // Recargar catálogo para actualizar saldo/créditos
    fetchCatalogo(isAuthenticated);
  };

  // Mostrar skeleton mientras se carga la autenticación o el catálogo
  if (isAuthLoading || isLoading) {
    return <TiendaSkeleton />;
  }

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
              <div className="container mx-auto px-4 py-8">
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
                  <p className="text-destructive">{error}</p>
                  <button 
                    onClick={() => fetchCatalogo(isAuthenticated)}
                    className="mt-4 text-sm underline"
                  >
                    Reintentar
                  </button>
                </div>
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
            <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
              {/* Header */}
              <div className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="container mx-auto px-4 py-8">
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-linear-to-br from-purple-500 to-blue-500">
                          <IconShoppingCart className="size-6 text-white" />
                        </div>
                        <div>
                          <h1 className="text-3xl font-bold">Tienda</h1>
                          <p className="text-muted-foreground">
                            Compra créditos, membresías y servicios
                          </p>
                        </div>
                      </div>
                      
                      {/* Link al historial */}
                      {isAuthenticated && (
                        <Link 
                          href="/tienda/historial"
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <IconReceipt className="size-4" />
                          Ver historial de compras
                        </Link>
                      )}
                    </div>
                    
                    {/* Balance del usuario (solo si está autenticado) */}
                    {isAuthenticated && catalogo?.usuario && (
                      <UserBalanceCard 
                        saldo={catalogo.usuario.saldo}
                        creditos={catalogo.usuario.creditos}
                        membresia={catalogo.usuario.membresia_actual}
                        tieneMembresia={catalogo.usuario.tiene_membresia}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Contenido principal */}
              <div className="container mx-auto px-4 py-8">
                <Tabs defaultValue="creditos" className="space-y-8">
                  <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
                    <TabsTrigger value="creditos" className="gap-2">
                      <IconCoins className="size-4" />
                      <span className="hidden sm:inline">Créditos</span>
                    </TabsTrigger>
                    <TabsTrigger value="membresias" className="gap-2">
                      <IconCrown className="size-4" />
                      <span className="hidden sm:inline">Membresías</span>
                    </TabsTrigger>
                    <TabsTrigger value="servicios" className="gap-2">
                      <IconSettings className="size-4" />
                      <span className="hidden sm:inline">Servicios</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="creditos" className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold">Paquetes de Créditos</h2>
                      <p className="text-muted-foreground">
                        Usa créditos para inscribirte en torneos y comprar items especiales
                      </p>
                    </div>
                    <CreditosSection 
                      items={catalogo?.categorias?.creditos || []}
                      onSelect={(item) => handleSelectItem({ type: 'creditos', item })}
                    />
                  </TabsContent>

                  <TabsContent value="membresias" className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold">Membresías Premium</h2>
                      <p className="text-muted-foreground">
                        Desbloquea beneficios exclusivos y ahorra en comisiones
                      </p>
                    </div>
                    <MembresiasSection 
                      items={catalogo?.categorias?.membresias || []}
                      infoGratuita={catalogo?.info_membresia_gratuita}
                      membresiaActual={catalogo?.usuario?.membresia_actual}
                      onSelect={(item) => handleSelectItem({ type: 'membresia', item })}
                    />
                  </TabsContent>

                  <TabsContent value="servicios" className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold">Servicios</h2>
                      <p className="text-muted-foreground">
                        Personaliza tu cuenta y gestiona tu perfil
                      </p>
                    </div>
                    <ServiciosSection 
                      items={catalogo?.categorias?.servicios || []}
                      onSelect={(item) => handleSelectItem({ type: 'servicio', item })}
                    />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Modal de compra */}
              <PurchaseModal
                isOpen={isPurchaseModalOpen}
                onClose={() => {
                  setIsPurchaseModalOpen(false);
                  setSelectedItem(null);
                }}
                selectedItem={selectedItem}
                userSaldo={catalogo?.usuario?.saldo ?? 0}
                onPurchaseComplete={handlePurchaseComplete}
              />
            </div>
          </main>
          <SiteFooter />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function TiendaSkeleton() {
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
            <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
              <div className="border-b bg-background/95">
                <div className="container mx-auto px-4 py-8">
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-12 rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                    </div>
                    <Skeleton className="h-24 w-64 rounded-lg" />
                  </div>
                </div>
              </div>
              <div className="container mx-auto px-4 py-8">
                <Skeleton className="mb-8 h-10 w-96" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-48 rounded-lg" />
                  ))}
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

"use client"

import * as React from "react"
import {
  IconDeviceGamepad2,
  IconHelp,
  IconHome,
  IconSearch,
  IconSettings,
  IconShoppingCart,
  IconTrophy,
  IconUsers,
  IconUsersGroup,
  IconCoin,
} from "@tabler/icons-react"

import { NavMain } from "@/components/home/nav-main"
import { NavSecondary } from "@/components/home/nav-secondary"
import { NavUser } from "@/components/home/nav-user"
import { NavQuickLinks } from "@/components/home/nav-quick-links"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useUsuarioActual } from "@/hooks/use-usuario-actual"

const data = {
  // Navegación principal
  navMain: [
    {
      title: "Inicio",
      url: "/",
      icon: IconHome,
    },
    {
      title: "Torneos",
      url: "/torneos",
      icon: IconTrophy,
    },
    {
      title: "Equipos",
      url: "/equipos",
      icon: IconUsersGroup,
    },
    {
      title: "Tienda",
      url: "/tienda",
      icon: IconShoppingCart,
    },
  ],
  // Enlaces rápidos para usuarios
  quickLinks: [
    {
      name: "Mis Torneos",
      url: "/torneos/mis-torneos",
      icon: IconTrophy,
    },
    {
      name: "Mi Equipo",
      url: "/usuario/equipo",
      icon: IconUsers,
    },
    {
      name: "Mis Créditos",
      url: "/tienda/recargar",
      icon: IconCoin,
    },
    {
      name: "Juegos",
      url: "/juegos",
      icon: IconDeviceGamepad2,
    },
  ],
  // Navegación secundaria
  navSecondary: [
    {
      title: "Configuración",
      url: "/usuario/configuracion/personal",
      icon: IconSettings,
    },
    {
      title: "Ayuda",
      url: "/ayuda",
      icon: IconHelp,
    },
    {
      title: "Buscar",
      url: "/buscar",
      icon: IconSearch,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isAuthenticated } = useAuth();
  const { usuario, isLoading } = useUsuarioActual();

  // Preparar datos del usuario para el NavUser
  const userForNav = usuario ? {
    name: usuario.nickname,
    email: usuario.persona.correo,
    avatar: usuario.avatar?.url ?? null,
    saldo: usuario.saldo,
    creditos: usuario.creditos,
  } : null;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/">
                <IconTrophy className="size-5! text-chart-1" />
                <span className="text-base font-semibold">eSports Platform</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {isAuthenticated && <NavQuickLinks items={data.quickLinks} />}
        {isAuthenticated && <NavSecondary items={data.navSecondary} className="mt-auto" />}
      </SidebarContent>
      <SidebarFooter>
        {isLoading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Cargando...
          </div>
        ) : isAuthenticated && userForNav ? (
          <NavUser user={userForNav} />
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">
            <p>¿No tienes cuenta?</p>
            <Link href="/auth/registro" className="text-primary hover:underline">
              Regístrate gratis
            </Link>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}

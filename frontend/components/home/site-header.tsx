"use client";

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { IconSearch, IconBell, IconLogin } from "@tabler/icons-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export function SiteHeader() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        
        {/* Search Bar */}
        <div className="relative hidden max-w-md flex-1 md:flex">
          <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar torneos, equipos, jugadores..."
            className="pl-9"
          />
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          {/* Search icon for mobile */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <IconSearch className="size-5" />
            <span className="sr-only">Buscar</span>
          </Button>
          
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {isLoading ? (
            <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
          ) : isAuthenticated ? (
            <>
              {/* Notifications */}
              <Button variant="ghost" size="icon" asChild>
                <Link href="/notificaciones">
                  <IconBell className="size-5" />
                  <span className="sr-only">Notificaciones</span>
                </Link>
              </Button>
            </>
          ) : (
            <>
              {/* Auth buttons for non-authenticated users */}
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                <Link href="/auth/login">
                  <IconLogin className="mr-2 size-4" />
                  Iniciar Sesión
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/registro">
                  Registrarse
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

import { AppSidebar } from '@/components/usuario/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

export default function DashboardRootLayout({children}: {children: React.ReactNode}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>  
  )
}

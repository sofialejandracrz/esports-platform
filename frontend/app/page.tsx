import { HeroSection } from "@/components/home/hero-section";
import { ActionCards } from "@/components/home/action-cards";
import { UpcomingTournaments } from "@/components/home/upcoming-tournaments";
import { GamesCarousel } from "@/components/home/games-carousel";
import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader } from "@/components/home/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/home/app-sidebar";
import Particles from "@/components/Particles";

export default function Home() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="relative">
        {/* Partículas de fondo */}
        <Particles
          particleColors={["#8B5CF6", "#A855F7", "#06B6D4", "#EC4899"]}
          particleCount={700}
          particleSpread={12}
          speed={0.08}
          particleBaseSize={200}
          moveParticlesOnHover={false}
          particleHoverFactor={0.5}
          alphaParticles={true}
          sizeRandomness={0.8}
          className="pointer-events-none"
        />
        <SiteHeader />
        <div className="relative z-10 flex flex-1 flex-col">
          {/* Main Content */}
          <main>
            {/* Hero Section */}
            <HeroSection />
            
            {/* Action Cards */}
            <ActionCards />
            
            {/* Upcoming Tournaments */}
            <UpcomingTournaments />
            
            {/* Games Carousel */}
            <GamesCarousel />
          </main>
          
          {/* Footer */}
          <SiteFooter />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

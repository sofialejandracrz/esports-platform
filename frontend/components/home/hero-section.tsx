"use client";

import { Button } from "@/components/ui/button";
import { IconTrophy, IconUsers, IconDeviceGamepad2 } from "@tabler/icons-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-12 md:py-20">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-primary/5 via-transparent to-chart-1/5" />
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <IconDeviceGamepad2 className="size-4" />
            <span>Plataforma de eSports #1</span>
          </div>
          
          {/* Title */}
          <h1 className="mb-6 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Compite, Gana y
            <span className="bg-linear-to-r from-chart-1 via-chart-2 to-chart-4 bg-clip-text text-transparent">
              {" "}Domina
            </span>
          </h1>
          
          {/* Description */}
          <p className="mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Únete a la comunidad de gamers más competitiva. Participa en torneos, 
            crea tu equipo y demuestra que eres el mejor en tus juegos favoritos.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/torneos">
                <IconTrophy className="size-5" />
                Ver Torneos
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <Link href="/api/auth/registro">
                <IconUsers className="size-5" />
                Registrarse Gratis
              </Link>
            </Button>
          </div>
          
          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-8 md:gap-16">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary md:text-4xl">10K+</p>
              <p className="text-sm text-muted-foreground">Jugadores Activos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary md:text-4xl">500+</p>
              <p className="text-sm text-muted-foreground">Torneos Jugados</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary md:text-4xl">$50K</p>
              <p className="text-sm text-muted-foreground">En Premios</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

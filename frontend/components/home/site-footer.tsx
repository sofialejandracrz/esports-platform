"use client";

import Link from "next/link";
import { IconBrandTwitter, IconBrandDiscord, IconBrandYoutube, IconBrandTwitch, IconTrophy, IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";

const socialLinks = [
  { icon: IconBrandTwitter, href: "#", label: "Twitter" },
  { icon: IconBrandDiscord, href: "#", label: "Discord" },
  { icon: IconBrandYoutube, href: "#", label: "YouTube" },
  { icon: IconBrandTwitch, href: "#", label: "Twitch" },
];

const quickLinks = [
  { label: "Torneos", href: "/torneos" },
  { label: "Equipos", href: "/equipos" },
  { label: "Tienda", href: "/tienda" },
  { label: "Ranking", href: "/ranking" },
];

const supportLinks = [
  { label: "FAQ", href: "/faq" },
  { label: "Contacto", href: "/contacto" },
  { label: "Reglas", href: "/reglas" },
  { label: "Soporte", href: "/soporte" },
];

const legalLinks = [
  { label: "Términos de Servicio", href: "/terminos" },
  { label: "Política de Privacidad", href: "/privacidad" },
  { label: "Política de Cookies", href: "/cookies" },
];

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-lg bg-linear-to-br from-chart-1 to-chart-2">
                <IconTrophy className="size-6 text-white" />
              </div>
              <span className="text-xl font-bold">eSports Platform</span>
            </Link>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
              La plataforma líder en torneos de eSports. Compite, mejora y gana increíbles premios con jugadores de todo el mundo.
            </p>
            
            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
                  aria-label={social.label}
                >
                  <social.icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-4 font-semibold">Plataforma</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h4 className="mb-4 font-semibold">Soporte</h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="mb-4 font-semibold">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconMail className="size-4" />
                <a href="mailto:support@esports.com" className="transition-colors hover:text-foreground">
                  support@esports.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconPhone className="size-4" />
                <span>+504 3251-1540</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <IconMapPin className="mt-0.5 size-4" />
                <span>La Paz, Honduras</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} eSports Platform. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {legalLinks.map((link) => (
              <Link 
                key={link.label}
                href={link.href}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

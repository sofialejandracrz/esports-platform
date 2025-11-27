"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  IconCrown, 
  IconCheck, 
  IconTrophy,
  IconPalette,
  IconUsers,
  IconCoinOff 
} from "@tabler/icons-react";
import { toNumber } from "@/lib/utils";
import type { ItemMembresia, MembresiaActual } from "@/types/tienda";

interface MembresiasSectionProps {
  items: ItemMembresia[];
  infoGratuita?: {
    nombre: string;
    precio: number;
    beneficios: string | null;
  };
  membresiaActual?: MembresiaActual | null;
  onSelect: (item: ItemMembresia) => void;
}

export function MembresiasSection({ 
  items, 
  infoGratuita, 
  membresiaActual,
  onSelect 
}: MembresiasSectionProps) {
  // Beneficios de membresía premium
  const beneficiosPremium = [
    { icon: IconCoinOff, text: "Apuestas sin comisiones" },
    { icon: IconTrophy, text: "Torneos ELITE gratuitos" },
    { icon: IconPalette, text: "Avatares premium" },
    { icon: IconUsers, text: "Personalización de equipo" },
  ];

  // Parsear beneficios gratuitos
  const beneficiosGratuitos = infoGratuita?.beneficios?.split(', ') || [];

  return (
    <div className="space-y-8">
      {/* Info de membresía actual */}
      {membresiaActual && (
        <Card className="border-green-500/50 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-green-500/20">
              <IconCrown className="size-6 text-green-500" />
            </div>
            <div>
              <p className="font-semibold text-green-500">Membresía Activa</p>
              <p className="text-sm text-muted-foreground">
                {membresiaActual.tipo} · {membresiaActual.dias_restantes} días restantes
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid de membresías */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {/* Card de cuenta gratuita */}
        <Card className="border-muted bg-muted/30">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Gratuita</h3>
              <Badge variant="secondary">Actual</Badge>
            </div>
            <p className="text-2xl font-bold">$0</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {beneficiosGratuitos.slice(0, 4).map((beneficio, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <IconCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{beneficio}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Cards de membresías premium */}
        {items.map((item, idx) => (
          <MembresiaCard 
            key={item.id} 
            item={item} 
            beneficios={beneficiosPremium}
            isPopular={idx === 1} // 3 meses es popular
            isBestValue={idx === items.length - 1} // 12 meses es mejor valor
            onSelect={onSelect}
          />
        ))}
      </div>

      {/* Comparativa de beneficios */}
      <Card className="mt-8">
        <CardHeader>
          <h3 className="text-lg font-semibold">Beneficios Premium</h3>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {beneficiosPremium.map((beneficio, idx) => (
              <div key={idx} className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/20">
                  <beneficio.icon className="size-5 text-purple-500" />
                </div>
                <span className="text-sm font-medium">{beneficio.text}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface MembresiaCardProps {
  item: ItemMembresia;
  beneficios: { icon: any; text: string }[];
  isPopular?: boolean;
  isBestValue?: boolean;
  onSelect: (item: ItemMembresia) => void;
}

function MembresiaCard({ item, beneficios, isPopular, isBestValue, onSelect }: MembresiaCardProps) {
  const precio = toNumber(item.precio);
  const precioMensual = precio / (item.duracion_dias / 30);

  return (
    <Card 
      className={`relative overflow-hidden transition-all hover:shadow-lg ${
        isPopular 
          ? 'border-2 border-purple-500 bg-gradient-to-br from-purple-500/10 to-blue-500/10' 
          : isBestValue
            ? 'border-yellow-500/50 bg-gradient-to-br from-yellow-500/5 to-orange-500/5'
            : ''
      }`}
    >
      {/* Badge de popular/mejor valor */}
      {(isPopular || isBestValue) && (
        <div className="absolute -right-8 top-3 rotate-45">
          <div className={`px-10 py-1 text-xs font-semibold text-white ${
            isPopular ? 'bg-purple-500' : 'bg-yellow-500'
          }`}>
            {isPopular ? 'Popular' : 'Mejor valor'}
          </div>
        </div>
      )}

      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <IconCrown className={`size-5 ${isPopular ? 'text-purple-500' : 'text-yellow-500'}`} />
          <h3 className="font-semibold">{item.nombre}</h3>
        </div>
        <div className="mt-2">
          <span className="text-3xl font-bold">${precio.toFixed(2)}</span>
          {item.ahorro && (
            <Badge className="ml-2 bg-green-500/20 text-green-500">
              Ahorra {item.ahorro}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          ${precioMensual.toFixed(2)}/mes · {item.duracion_dias} días
        </p>
      </CardHeader>

      <CardContent className="space-y-2">
        {beneficios.map((beneficio, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <IconCheck className="size-4 text-green-500" />
            <span className="text-sm">{beneficio.text}</span>
          </div>
        ))}
      </CardContent>

      <CardFooter>
        <Button 
          className={`w-full ${
            isPopular 
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
              : ''
          }`}
          onClick={() => onSelect(item)}
        >
          {isPopular ? 'Elegir Popular' : 'Seleccionar'}
        </Button>
      </CardFooter>
    </Card>
  );
}

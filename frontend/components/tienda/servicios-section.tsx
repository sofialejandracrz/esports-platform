"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  IconUserEdit, 
  IconRefresh, 
  IconChartBar,
  IconUserSearch,
  IconAlertTriangle,
  IconHeadset 
} from "@tabler/icons-react";
import { toNumber } from "@/lib/utils";
import type { ItemServicio } from "@/types/tienda";

interface ServiciosSectionProps {
  items: ItemServicio[];
  onSelect: (item: ItemServicio) => void;
}

// Mapeo de iconos por tipo de servicio
const servicioIcons: Record<string, any> = {
  'cambio_nickname': IconUserEdit,
  'reset_record': IconRefresh,
  'reset_stats': IconChartBar,
  'reclamar_nickname': IconUserSearch,
};

// Colores por tipo de servicio
const servicioColors: Record<string, string> = {
  'cambio_nickname': 'from-blue-500 to-cyan-500',
  'reset_record': 'from-red-500 to-orange-500',
  'reset_stats': 'from-purple-500 to-pink-500',
  'reclamar_nickname': 'from-emerald-500 to-teal-500',
};

export function ServiciosSection({ items, onSelect }: ServiciosSectionProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <IconUserEdit className="mx-auto size-12 text-muted-foreground/50" />
        <p className="mt-4 text-muted-foreground">No hay servicios disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <ServicioCard key={item.id} item={item} onSelect={onSelect} />
      ))}
    </div>
  );
}

interface ServicioCardProps {
  item: ItemServicio;
  onSelect: (item: ItemServicio) => void;
}

function ServicioCard({ item, onSelect }: ServicioCardProps) {
  const precio = toNumber(item.precio);
  const Icon = servicioIcons[item.servicio_tipo] || IconUserEdit;
  const gradientColor = servicioColors[item.servicio_tipo] || 'from-gray-500 to-gray-600';

  return (
    <Card className="relative overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradientColor}`}>
              <Icon className="size-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">{item.nombre}</h3>
              <span className="text-xl font-bold">${precio.toFixed(2)}</span>
            </div>
          </div>
          
          {/* Badges */}
          <div className="flex flex-col gap-1">
            {item.requiere_soporte && (
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                <IconHeadset className="mr-1 size-3" />
                Soporte
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground">{item.descripcion}</p>
        
        {/* Advertencia si existe */}
        {item.advertencia && (
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-yellow-500/10 p-3">
            <IconAlertTriangle className="mt-0.5 size-4 shrink-0 text-yellow-500" />
            <span className="text-xs text-yellow-500">{item.advertencia}</span>
          </div>
        )}

        {/* Info adicional para reclamar nickname */}
        {item.servicio_tipo === 'reclamar_nickname' && (
          <div className="mt-3 rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">
              Se contactará con soporte para verificar la disponibilidad del nickname. 
              El proceso puede tomar hasta 24-48 horas.
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button 
          className={`w-full bg-gradient-to-r ${gradientColor} hover:opacity-90`}
          onClick={() => onSelect(item)}
        >
          {item.requiere_soporte ? 'Solicitar' : 'Comprar'}
        </Button>
      </CardFooter>
    </Card>
  );
}

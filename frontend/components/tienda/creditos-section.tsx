"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconCoins, IconStar, IconTrendingUp } from "@tabler/icons-react";
import { toNumber, formatPrice } from "@/lib/utils";
import type { ItemCreditos } from "@/types/tienda";

interface CreditosSectionProps {
  items: ItemCreditos[];
  onSelect: (item: ItemCreditos) => void;
}

export function CreditosSection({ items, onSelect }: CreditosSectionProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <IconCoins className="mx-auto size-12 text-muted-foreground/50" />
        <p className="mt-4 text-muted-foreground">No hay paquetes de créditos disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <CreditoCard key={item.id} item={item} onSelect={onSelect} />
      ))}
    </div>
  );
}

interface CreditoCardProps {
  item: ItemCreditos;
  onSelect: (item: ItemCreditos) => void;
}

function CreditoCard({ item, onSelect }: CreditoCardProps) {
  const precio = toNumber(item.precio);
  const precioPorCredito = precio / item.creditos_otorgados;

  return (
    <Card 
      className={`relative overflow-hidden transition-all hover:shadow-lg ${
        item.mejor_valor 
          ? 'border-2 border-yellow-500 bg-gradient-to-br from-yellow-500/5 to-orange-500/5' 
          : item.destacado 
            ? 'border-purple-500/50 bg-gradient-to-br from-purple-500/5 to-blue-500/5'
            : ''
      }`}
    >
      {/* Badges de destacado */}
      <div className="absolute right-2 top-2 flex flex-col gap-1">
        {item.mejor_valor && (
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <IconTrendingUp className="mr-1 size-3" />
            Mejor valor
          </Badge>
        )}
        {item.destacado && !item.mejor_valor && (
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
            <IconStar className="mr-1 size-3" />
            Popular
          </Badge>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className={`flex size-14 items-center justify-center rounded-xl ${
            item.mejor_valor 
              ? 'bg-gradient-to-br from-yellow-500 to-orange-500'
              : 'bg-gradient-to-br from-purple-500 to-blue-500'
          }`}>
            <IconCoins className="size-7 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{item.creditos_otorgados}</h3>
            <p className="text-sm text-muted-foreground">
              {item.creditos_otorgados === 1 ? 'Crédito' : 'Créditos'}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground">{item.descripcion}</p>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">
            ${precioPorCredito.toFixed(2)} por crédito
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold">${precio.toFixed(2)}</span>
          <span className="ml-1 text-sm text-muted-foreground">USD</span>
        </div>
        <Button 
          onClick={() => onSelect(item)}
          className={item.mejor_valor 
            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
            : ''
          }
        >
          Comprar
        </Button>
      </CardFooter>
    </Card>
  );
}

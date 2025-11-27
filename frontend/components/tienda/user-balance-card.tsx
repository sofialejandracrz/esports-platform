"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconCoins, IconWallet, IconCrown } from "@tabler/icons-react";
import { toNumber } from "@/lib/utils";
import type { MembresiaActual } from "@/types/tienda";

interface UserBalanceCardProps {
  saldo: number | string;
  creditos: number;
  membresia?: MembresiaActual | null;
  tieneMembresia: boolean;
}

export function UserBalanceCard({ 
  saldo, 
  creditos, 
  membresia, 
  tieneMembresia 
}: UserBalanceCardProps) {
  const saldoNum = toNumber(saldo);

  return (
    <Card className="border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
      <CardContent className="flex flex-wrap items-center gap-6 p-4">
        {/* Saldo */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/20">
            <IconWallet className="size-5 text-green-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Saldo</p>
            <p className="text-lg font-bold">${saldoNum.toFixed(2)}</p>
          </div>
        </div>

        {/* Separador */}
        <div className="h-10 w-px bg-border" />

        {/* Créditos */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-yellow-500/20">
            <IconCoins className="size-5 text-yellow-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Créditos</p>
            <p className="text-lg font-bold">{creditos}</p>
          </div>
        </div>

        {/* Separador */}
        <div className="h-10 w-px bg-border" />

        {/* Membresía */}
        <div className="flex items-center gap-3">
          <div className={`flex size-10 items-center justify-center rounded-lg ${
            tieneMembresia ? 'bg-purple-500/20' : 'bg-muted'
          }`}>
            <IconCrown className={`size-5 ${
              tieneMembresia ? 'text-purple-500' : 'text-muted-foreground'
            }`} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Membresía</p>
            {tieneMembresia && membresia ? (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                  {membresia.tipo}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {membresia.dias_restantes}d
                </span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Gratuita</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

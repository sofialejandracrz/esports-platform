'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { TournamentFormData, StageErrors } from '@/hooks/use-tournament-form';
import { useMemo } from 'react';
import { IconCoin, IconTrophy } from '@tabler/icons-react';

interface Stage3Props {
  data: TournamentFormData;
  onUpdate: (field: keyof TournamentFormData, value: string | number | boolean | null) => void;
  errors?: StageErrors;
}

export function Stage3Prizes({ data, onUpdate, errors = {} }: Stage3Props) {
  const calculations = useMemo(() => {
    const totalAfterFee = data.totalPrizePool * (1 - data.hostCommissionPercentage / 100);
    const hostCommissionTotal = data.totalPrizePool - totalAfterFee;
    const firstPlacePrize = totalAfterFee * (data.firstPlacePercentage / 100);
    const secondPlacePrize = totalAfterFee * (data.secondPlacePercentage / 100);
    const totalPercentage = data.firstPlacePercentage + data.secondPlacePercentage;

    return {
      totalAfterFee,
      hostCommissionTotal,
      firstPlacePrize,
      secondPlacePrize,
      totalPercentage,
      isValidPercentage: totalPercentage === 100,
    };
  }, [data.totalPrizePool, data.hostCommissionPercentage, data.firstPlacePercentage, data.secondPlacePercentage]);

  return (
    <div className="space-y-6">
      {/* Configuración de Premios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconCoin className="size-5" />
            Fondo de Premios
          </CardTitle>
          <CardDescription>
            Configura la cuota de inscripción y el fondo total de premios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Cuota de Inscripción */}
              <Field>
                <FieldLabel>Cuota de Inscripción (Créditos)</FieldLabel>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={data.entryFee}
                  onChange={(e) => onUpdate('entryFee', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Déjalo en 0 para acceso gratuito
                </p>
              </Field>

              {/* Fondo de Premios Total */}
              <Field>
                <FieldLabel required>Total del Fondo de Premios</FieldLabel>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={data.totalPrizePool}
                  onChange={(e) => onUpdate('totalPrizePool', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
                {errors.totalPrizePool && <FieldError>{errors.totalPrizePool}</FieldError>}
              </Field>

              {/* Comisión del Anfitrión */}
              <Field>
                <FieldLabel>Comisión del Anfitrión (%)</FieldLabel>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={data.hostCommissionPercentage}
                  onChange={(e) => onUpdate('hostCommissionPercentage', parseFloat(e.target.value) || 0)}
                />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Resumen de Cálculos */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fondo después de Comisión</p>
                <p className="text-2xl font-bold text-primary">
                  ${calculations.totalAfterFee.toFixed(2)}
                </p>
              </div>
              <IconTrophy className="size-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-500/30 bg-orange-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Comisión Total</p>
                <p className="text-2xl font-bold text-orange-500">
                  ${calculations.hostCommissionTotal.toFixed(2)}
                </p>
              </div>
              <IconCoin className="size-8 text-orange-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribución de Premios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconTrophy className="size-5" />
            Distribución de Premios
          </CardTitle>
          <CardDescription>
            Define cómo se distribuirán los premios entre los ganadores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel required>1.er Lugar (%)</FieldLabel>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={data.firstPlacePercentage}
                  onChange={(e) => onUpdate('firstPlacePercentage', parseFloat(e.target.value) || 0)}
                />
                <div className="mt-2 rounded-md bg-primary/10 px-3 py-2">
                  <span className="text-sm text-muted-foreground">Premio: </span>
                  <span className="font-semibold text-primary">
                    ${calculations.firstPlacePrize.toFixed(2)}
                  </span>
                </div>
                {errors.firstPlacePercentage && <FieldError>{errors.firstPlacePercentage}</FieldError>}
              </Field>

              <Field>
                <FieldLabel required>2.do Lugar (%)</FieldLabel>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={data.secondPlacePercentage}
                  onChange={(e) => onUpdate('secondPlacePercentage', parseFloat(e.target.value) || 0)}
                />
                <div className="mt-2 rounded-md bg-blue-500/10 px-3 py-2">
                  <span className="text-sm text-muted-foreground">Premio: </span>
                  <span className="font-semibold text-blue-500">
                    ${calculations.secondPlacePrize.toFixed(2)}
                  </span>
                </div>
                {errors.secondPlacePercentage && <FieldError>{errors.secondPlacePercentage}</FieldError>}
              </Field>
            </div>

            {!calculations.isValidPercentage && (
              <div className="rounded-md border border-orange-500/50 bg-orange-500/10 p-3 text-sm text-orange-500">
                ⚠️ Los porcentajes deben sumar 100% (actualmente: {calculations.totalPercentage}%)
              </div>
            )}
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}

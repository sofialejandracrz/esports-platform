'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { TournamentFormData, StageErrors } from '@/hooks/use-tournament-form';

interface Stage1Props {
  data: TournamentFormData;
  onUpdate: (field: keyof TournamentFormData, value: string | number | boolean | null) => void;
  errors?: StageErrors;
}

export function Stage1BasicInfo({ data, onUpdate, errors = {} }: Stage1Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información Básica</CardTitle>
        <CardDescription>
          Completa los detalles generales de tu torneo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          {/* Título */}
          <Field>
            <FieldLabel required>Título del Torneo</FieldLabel>
            <Input
              id="title"
              placeholder="Ej: Campeonato Global de LoL 2024"
              value={data.title}
              onChange={(e) => onUpdate('title', e.target.value)}
            />
            {errors.title && <FieldError>{errors.title}</FieldError>}
          </Field>

          {/* Descripción */}
          <Field>
            <FieldLabel>Descripción</FieldLabel>
            <Textarea
              id="description"
              placeholder="Describe tu torneo, incluye detalles importantes..."
              value={data.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onUpdate('description', e.target.value)}
              rows={4}
            />
          </Field>

          {/* Fechas */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field>
              <FieldLabel required>Inicio de Registro</FieldLabel>
              <Input
                id="registrationStart"
                type="datetime-local"
                value={data.registrationStart}
                onChange={(e) => onUpdate('registrationStart', e.target.value)}
              />
              {errors.registrationStart && <FieldError>{errors.registrationStart}</FieldError>}
            </Field>

            <Field>
              <FieldLabel required>Fin de Registro</FieldLabel>
              <Input
                id="registrationEnd"
                type="datetime-local"
                value={data.registrationEnd}
                onChange={(e) => onUpdate('registrationEnd', e.target.value)}
              />
              {errors.registrationEnd && <FieldError>{errors.registrationEnd}</FieldError>}
            </Field>

            <Field className="sm:col-span-2 lg:col-span-1">
              <FieldLabel required>Inicio del Torneo</FieldLabel>
              <Input
                id="tournamentStart"
                type="datetime-local"
                value={data.tournamentStart}
                onChange={(e) => onUpdate('tournamentStart', e.target.value)}
              />
              {errors.tournamentStart && <FieldError>{errors.tournamentStart}</FieldError>}
            </Field>
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}

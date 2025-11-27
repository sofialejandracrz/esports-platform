'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { TournamentFormData, StageErrors } from '@/hooks/use-tournament-form';
import { TorneoCatalogos } from '@/lib/api/torneos';
import { IconLoader2 } from '@tabler/icons-react';

// Constantes para opciones que no vienen del backend
const BEST_OF_OPTIONS = [1, 3, 5, 7];
const FORMATS = ['Solo', 'Dúos', 'Tríos', 'Escuadrones', 'Equipos'];

interface Stage2Props {
  data: TournamentFormData;
  onUpdate: (field: keyof TournamentFormData, value: string | number | boolean | null) => void;
  catalogos: TorneoCatalogos | null;
  catalogosLoading: boolean;
  catalogosError: string | null;
  errors?: StageErrors;
}

export function Stage2Details({ 
  data, 
  onUpdate, 
  catalogos, 
  catalogosLoading, 
  catalogosError,
  errors = {},
}: Stage2Props) {
  // Encontrar el juego seleccionado para obtener sus plataformas y modos
  const selectedGame = catalogos?.juegos.find((g) => g.id === data.gameId);

  if (catalogosLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <IconLoader2 className="size-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Cargando catálogos...</span>
        </CardContent>
      </Card>
    );
  }

  if (catalogosError) {
    return (
      <Card className="border-destructive bg-destructive/10">
        <CardContent className="py-8 text-center">
          <p className="text-destructive">{catalogosError}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Por favor, recarga la página o intenta más tarde.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Configuración del Juego */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración del Juego</CardTitle>
          <CardDescription>
            Selecciona el juego y sus parámetros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Juego */}
              <Field>
                <FieldLabel required>Juego</FieldLabel>
                <Select 
                  value={data.gameId} 
                  onValueChange={(v) => {
                    onUpdate('gameId', v);
                    onUpdate('platform', '');
                    onUpdate('gameMode', '');
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un juego" />
                  </SelectTrigger>
                  <SelectContent>
                    {catalogos?.juegos.map((game) => (
                      <SelectItem key={game.id} value={game.id}>
                        {game.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.gameId && <FieldError>{errors.gameId}</FieldError>}
              </Field>

              {/* Plataforma */}
              <Field>
                <FieldLabel required>Plataforma</FieldLabel>
                <Select 
                  value={data.platform} 
                  onValueChange={(v) => onUpdate('platform', v)} 
                  disabled={!selectedGame}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedGame?.plataformas?.map((plat) => (
                      <SelectItem key={plat.id} value={plat.id}>
                        {plat.valor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.platform && <FieldError>{errors.platform}</FieldError>}
              </Field>

              {/* Modo de Juego */}
              <Field>
                <FieldLabel required>Modo de Juego</FieldLabel>
                <Select 
                  value={data.gameMode} 
                  onValueChange={(v) => onUpdate('gameMode', v)} 
                  disabled={!selectedGame}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona modo" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedGame?.modos_juego?.map((modo) => (
                      <SelectItem key={modo.id} value={modo.id}>
                        {modo.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.gameMode && <FieldError>{errors.gameMode}</FieldError>}
              </Field>

              {/* Región */}
              <Field>
                <FieldLabel required>Región</FieldLabel>
                <Select value={data.region} onValueChange={(v) => onUpdate('region', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona región" />
                  </SelectTrigger>
                  <SelectContent>
                    {catalogos?.regiones.map((region) => (
                      <SelectItem key={region.id} value={region.id}>
                        {region.valor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.region && <FieldError>{errors.region}</FieldError>}
              </Field>

              {/* Tipo de Torneo */}
              <Field>
                <FieldLabel required>Tipo de Torneo</FieldLabel>
                <Select value={data.tournamentType} onValueChange={(v) => onUpdate('tournamentType', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {catalogos?.tipos_torneo.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.id}>
                        {tipo.valor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.tournamentType && <FieldError>{errors.tournamentType}</FieldError>}
              </Field>

              {/* Tipo de Entrada */}
              <Field>
                <FieldLabel required>Tipo de Entrada</FieldLabel>
                <Select value={data.inputType} onValueChange={(v) => onUpdate('inputType', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {catalogos?.tipos_entrada.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.id}>
                        {tipo.valor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.inputType && <FieldError>{errors.inputType}</FieldError>}
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Parámetros del Torneo */}
      <Card>
        <CardHeader>
          <CardTitle>Parámetros del Torneo</CardTitle>
          <CardDescription>
            Configura el formato y capacidad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Al Mejor de */}
              <Field>
                <FieldLabel required>Al Mejor de</FieldLabel>
                <Select 
                  value={data.bestOf.toString()} 
                  onValueChange={(v) => onUpdate('bestOf', parseInt(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    {(catalogos?.al_mejor_de || BEST_OF_OPTIONS).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'partida' : 'partidas'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {/* Formato */}
              <Field>
                <FieldLabel>Formato</FieldLabel>
                <Select value={data.format} onValueChange={(v) => onUpdate('format', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona formato" />
                  </SelectTrigger>
                  <SelectContent>
                    {(catalogos?.formatos || FORMATS).map((format) => (
                      <SelectItem key={format} value={format}>
                        {format}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {/* Capacidad */}
              <Field>
                <FieldLabel required>Máx. Participantes</FieldLabel>
                <Input
                  type="number"
                  min="2"
                  max="256"
                  value={data.maxParticipants}
                  onChange={(e) => onUpdate('maxParticipants', parseInt(e.target.value) || 2)}
                />
                {errors.maxParticipants && <FieldError>{errors.maxParticipants}</FieldError>}
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Opciones Adicionales */}
      <Card>
        <CardHeader>
          <CardTitle>Opciones Adicionales</CardTitle>
          <CardDescription>
            Configura requisitos especiales del torneo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="isClosed"
                checked={data.isClosed}
                onCheckedChange={(checked) => onUpdate('isClosed', !!checked)}
              />
              <Label htmlFor="isClosed" className="cursor-pointer text-sm">
                Torneo Cerrado (solo por invitación)
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="allowPC"
                checked={data.allowPC}
                onCheckedChange={(checked) => onUpdate('allowPC', !!checked)}
              />
              <Label htmlFor="allowPC" className="cursor-pointer text-sm">
                Jugadores de PC permitidos
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="requireStream"
                checked={data.requireStream}
                onCheckedChange={(checked) => onUpdate('requireStream', !!checked)}
              />
              <Label htmlFor="requireStream" className="cursor-pointer text-sm">
                Se requiere transmisión
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="requireWebcam"
                checked={data.requireWebcam}
                onCheckedChange={(checked) => onUpdate('requireWebcam', !!checked)}
              />
              <Label htmlFor="requireWebcam" className="cursor-pointer text-sm">
                Se requiere cámara web
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reglas */}
      <Card>
        <CardHeader>
          <CardTitle>Reglas del Torneo</CardTitle>
          <CardDescription>
            Define las reglas que aplicarán a este torneo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <div className="flex gap-6 mb-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="rules-basic"
                    checked={data.rulesType === 'basic'}
                    onChange={() => onUpdate('rulesType', 'basic')}
                    className="size-4"
                  />
                  <Label htmlFor="rules-basic" className="cursor-pointer">
                    Básicas del juego
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="rules-custom"
                    checked={data.rulesType === 'custom'}
                    onChange={() => onUpdate('rulesType', 'custom')}
                    className="size-4"
                  />
                  <Label htmlFor="rules-custom" className="cursor-pointer">
                    Personalizadas
                  </Label>
                </div>
              </div>
            </Field>
            {data.rulesType === 'custom' && (
              <Field>
                <FieldLabel>Reglas Personalizadas</FieldLabel>
                <Textarea
                  placeholder="Escribe tus reglas personalizadas..."
                  value={data.customRules}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onUpdate('customRules', e.target.value)}
                  rows={4}
                />
              </Field>
            )}
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}

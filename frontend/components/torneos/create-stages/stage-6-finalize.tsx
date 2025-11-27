'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { TournamentFormData, StageErrors } from '@/hooks/use-tournament-form';
import { TorneoCatalogos } from '@/lib/api/torneos';
import { IconAlertCircle, IconCheck, IconCircle, IconInfoCircle, IconTrophy } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface Stage6Props {
  data: TournamentFormData;
  onUpdate: (field: keyof TournamentFormData, value: string | number | boolean | null) => void;
  catalogos: TorneoCatalogos | null;
  errors?: StageErrors;
}

export function Stage6Finalize({ data, onUpdate, catalogos, errors = {} }: Stage6Props) {
  // Obtener nombres de los catálogos seleccionados
  const selectedGame = catalogos?.juegos.find((g) => g.id === data.gameId);
  const selectedRegion = catalogos?.regiones.find((r) => r.id === data.region);
  const selectedTipoTorneo = catalogos?.tipos_torneo.find((t) => t.id === data.tournamentType);

  const isComplete =
    data.title &&
    data.registrationStart &&
    data.registrationEnd &&
    data.tournamentStart &&
    data.gameId &&
    data.platform &&
    data.gameMode &&
    data.region &&
    data.tournamentType &&
    data.inputType;

  return (
    <div className="space-y-6">
      {!isComplete && (
        <Card className="border-orange-500/50 bg-orange-500/10">
          <CardContent className="flex items-start gap-3 pt-6">
            <IconAlertCircle className="size-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-orange-500">Información Incompleta</p>
              <p className="text-sm text-muted-foreground">
                Completa todos los campos requeridos antes de publicar
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Resumen Básico */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Información Básica</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Título:</dt>
                <dd className="font-medium">{data.title || 'No especificado'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Juego:</dt>
                <dd className="font-medium">{selectedGame?.nombre || 'No seleccionado'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Región:</dt>
                <dd className="font-medium">{selectedRegion?.valor || 'No especificada'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Tipo:</dt>
                <dd className="font-medium">{selectedTipoTorneo?.valor || 'No especificado'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Formato:</dt>
                <dd className="font-medium">{data.format || 'No especificado'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Resumen Premios */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <IconTrophy className="size-4" />
              Premios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Cuota de Inscripción:</dt>
                <dd className="font-medium">${data.entryFee.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Fondo Total:</dt>
                <dd className="font-bold text-primary">${data.totalPrizePool.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Comisión Anfitrión:</dt>
                <dd className="font-medium text-orange-500">{data.hostCommissionPercentage}%</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Máx. Participantes:</dt>
                <dd className="font-medium">{data.maxParticipants}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Resumen Configuración */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Configuración</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <ConfigItem checked={data.isClosed} label={`Torneo ${data.isClosed ? 'Cerrado' : 'Abierto'}`} />
              <ConfigItem checked={data.requireStream} label={`Transmisión ${data.requireStream ? 'Requerida' : 'Opcional'}`} />
              <ConfigItem checked={data.requireWebcam} label={`Cámara ${data.requireWebcam ? 'Requerida' : 'Opcional'}`} />
              <ConfigItem checked={data.allowPC} label={`Jugadores PC ${data.allowPC ? 'Permitidos' : 'No permitidos'}`} />
            </div>
          </CardContent>
        </Card>

        {/* Resumen Contacto */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Contacto</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground text-xs mb-1">Cómo Contactarte:</dt>
                <dd className="font-medium">{data.hostContact || 'No especificado'}</dd>
              </div>
              {data.discordServer && (
                <div>
                  <dt className="text-muted-foreground text-xs mb-1">Servidor Discord:</dt>
                  <dd className="font-medium truncate">{data.discordServer}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Confirmación */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="isReady"
              checked={data.isReady}
              onCheckedChange={(checked) => onUpdate('isReady', !!checked)}
            />
            <div className="space-y-1">
              <Label htmlFor="isReady" className="cursor-pointer font-medium">
                Confirmo que la información es correcta
              </Label>
              <p className="text-sm text-muted-foreground">
                Al marcar esta casilla, confirmas que has revisado toda la información del torneo
                y que está lista para ser publicada.
              </p>
            </div>
          </div>
          {errors.isReady && (
            <p className="text-sm text-destructive mt-2">{errors.isReady}</p>
          )}
        </CardContent>
      </Card>

      {/* Información Importante */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <IconInfoCircle className="size-4" />
            Información Importante
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span>El estado del torneo será &quot;Borrador&quot; al publicar</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span>Podrás cambiar el estado a &quot;Próximamente&quot; cuando estés listo</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span>Los participantes podrán registrarse dentro del período establecido</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span>Recibirás ganancias del fondo de premios después de comisiones</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function ConfigItem({ checked, label }: { checked: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {checked ? (
        <IconCheck className="size-4 text-green-500" />
      ) : (
        <IconCircle className="size-4 text-muted-foreground" />
      )}
      <span className={cn(checked && 'text-green-500')}>{label}</span>
    </div>
  );
}

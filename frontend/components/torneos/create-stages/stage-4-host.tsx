'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { TournamentFormData } from '@/hooks/use-tournament-form';
import { IconBrandDiscord, IconBrandFacebook, IconBrandTwitch, IconBrandX, IconBrandYoutube, IconMail } from '@tabler/icons-react';

interface Stage4Props {
  data: TournamentFormData;
  onUpdate: (field: keyof TournamentFormData, value: string | number | boolean | null) => void;
}

export function Stage4Host({ data, onUpdate }: Stage4Props) {
  return (
    <div className="space-y-6">
      {/* Información de Contacto */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconMail className="size-5" />
            Contacto del Anfitrión
          </CardTitle>
          <CardDescription>
            Información de contacto para los participantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>Correo o Contacto</FieldLabel>
              <Input
                id="hostContact"
                placeholder="Ej: email@example.com, Discord: Usuario#1234"
                value={data.hostContact}
                onChange={(e) => onUpdate('hostContact', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Cómo pueden contactarte los participantes
              </p>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Redes Sociales */}
      <Card>
        <CardHeader>
          <CardTitle>Redes Sociales</CardTitle>
          <CardDescription>
            Enlaces opcionales a tus perfiles de redes sociales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Twitch */}
              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <IconBrandTwitch className="size-4 text-purple-500" />
                  Twitch
                </FieldLabel>
                <Input
                  placeholder="https://twitch.tv/usuario"
                  value={data.twitchUrl || ''}
                  onChange={(e) => onUpdate('twitchUrl', e.target.value)}
                />
              </Field>

              {/* Discord */}
              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <IconBrandDiscord className="size-4 text-indigo-500" />
                  Discord
                </FieldLabel>
                <Input
                  placeholder="https://discord.gg/invite"
                  value={data.discordUrl || ''}
                  onChange={(e) => onUpdate('discordUrl', e.target.value)}
                />
              </Field>

              {/* YouTube */}
              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <IconBrandYoutube className="size-4 text-red-500" />
                  YouTube
                </FieldLabel>
                <Input
                  placeholder="https://youtube.com/usuario"
                  value={data.youtubeUrl || ''}
                  onChange={(e) => onUpdate('youtubeUrl', e.target.value)}
                />
              </Field>

              {/* Facebook */}
              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <IconBrandFacebook className="size-4 text-blue-500" />
                  Facebook
                </FieldLabel>
                <Input
                  placeholder="https://facebook.com/usuario"
                  value={data.facebookUrl || ''}
                  onChange={(e) => onUpdate('facebookUrl', e.target.value)}
                />
              </Field>

              {/* X/Twitter */}
              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <IconBrandX className="size-4" />
                  X (Twitter)
                </FieldLabel>
                <Input
                  placeholder="https://x.com/usuario"
                  value={data.xUrl || ''}
                  onChange={(e) => onUpdate('xUrl', e.target.value)}
                />
              </Field>

              {/* Discord Server */}
              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <IconBrandDiscord className="size-4 text-indigo-500" />
                  Servidor de Discord
                </FieldLabel>
                <Input
                  placeholder="https://discord.gg/servidor"
                  value={data.discordServer || ''}
                  onChange={(e) => onUpdate('discordServer', e.target.value)}
                />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}

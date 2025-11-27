'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { TournamentFormData } from '@/hooks/use-tournament-form';
import { IconPhoto, IconUpload } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface Stage5Props {
  data: TournamentFormData;
  onUpdate: (field: keyof TournamentFormData, value: string | number | boolean | File | null) => void;
}

export function Stage5Graphics({ data, onUpdate }: Stage5Props) {
  const handleFileChange = (field: 'bannerImage' | 'thumbnailImage', file: File | undefined) => {
    onUpdate(field, file || null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconPhoto className="size-5" />
          Gráficos Personalizados
        </CardTitle>
        <CardDescription>
          Añade imágenes representativas de tu torneo (opcional)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Banner */}
            <Field>
              <FieldLabel>Banner Personalizado</FieldLabel>
              <div 
                className={cn(
                  "group relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors cursor-pointer",
                  "border-border hover:border-primary hover:bg-primary/5",
                  data.bannerImage && "border-primary bg-primary/5"
                )}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange('bannerImage', e.target.files?.[0])}
                  className="absolute inset-0 cursor-pointer opacity-0"
                  id="banner-input"
                />
                <IconUpload className="size-10 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                <p className="font-medium">Haz clic para cargar</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG hasta 5MB</p>
                {data.bannerImage && (
                  <p className="text-xs text-primary mt-2 font-medium">✓ {data.bannerImage.name}</p>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Recomendado: 1200x400px</p>
            </Field>

            {/* Miniatura */}
            <Field>
              <FieldLabel>Miniatura</FieldLabel>
              <div 
                className={cn(
                  "group relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors cursor-pointer",
                  "border-border hover:border-blue-500 hover:bg-blue-500/5",
                  data.thumbnailImage && "border-blue-500 bg-blue-500/5"
                )}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange('thumbnailImage', e.target.files?.[0])}
                  className="absolute inset-0 cursor-pointer opacity-0"
                  id="thumbnail-input"
                />
                <IconUpload className="size-10 text-muted-foreground group-hover:text-blue-500 transition-colors mb-2" />
                <p className="font-medium">Haz clic para cargar</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG hasta 5MB</p>
                {data.thumbnailImage && (
                  <p className="text-xs text-blue-500 mt-2 font-medium">✓ {data.thumbnailImage.name}</p>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Recomendado: 300x300px</p>
            </Field>
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}

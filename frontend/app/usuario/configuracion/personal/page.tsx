"use client";

import { useState, useEffect } from "react";
import { IconUser, IconMapPin, IconDeviceFloppy, IconX, IconLoader2, IconCheck, IconAlertCircle } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SiteHeader } from "@/components/usuario/site-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useConfigPersonal } from "@/hooks/use-configuracion";

// Lista de zonas horarias comunes
const timezones = [
  { value: "America/New_York", label: "EST - Nueva York (UTC-5)" },
  { value: "America/Chicago", label: "CST - Chicago (UTC-6)" },
  { value: "America/Denver", label: "MST - Denver (UTC-7)" },
  { value: "America/Los_Angeles", label: "PST - Los Ángeles (UTC-8)" },
  { value: "America/Mexico_City", label: "CST - Ciudad de México (UTC-6)" },
  { value: "America/Bogota", label: "COT - Bogotá (UTC-5)" },
  { value: "America/Lima", label: "PET - Lima (UTC-5)" },
  { value: "America/Argentina/Buenos_Aires", label: "ART - Buenos Aires (UTC-3)" },
  { value: "America/Sao_Paulo", label: "BRT - São Paulo (UTC-3)" },
  { value: "Europe/London", label: "GMT - Londres (UTC+0)" },
  { value: "Europe/Paris", label: "CET - París (UTC+1)" },
  { value: "Europe/Madrid", label: "CET - Madrid (UTC+1)" },
  { value: "Asia/Tokyo", label: "JST - Tokio (UTC+9)" },
  { value: "Asia/Shanghai", label: "CST - Shanghái (UTC+8)" },
  { value: "Australia/Sydney", label: "AEDT - Sídney (UTC+11)" },
];

export default function PersonalConfigPage() {
  const { data, loading, saving, error, cargar, guardar } = useConfigPersonal();
  
  // Estado local del formulario
  const [formData, setFormData] = useState({
    biografia: "",
    genero_id: "",
    timezone: "",
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Cargar datos al montar
  useEffect(() => {
    cargar();
  }, [cargar]);

  // Sincronizar datos cargados con el formulario
  useEffect(() => {
    if (data) {
      setFormData({
        biografia: data.biografia || "",
        genero_id: data.genero?.id || "",
        timezone: data.timezone || "",
      });
      setHasChanges(false);
    }
  }, [data]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSuccessMessage(null);
    const success = await guardar({
      biografia: formData.biografia || undefined,
      genero_id: formData.genero_id || undefined,
      timezone: formData.timezone || undefined,
    });

    if (success) {
      setSuccessMessage("Tu configuración personal ha sido actualizada.");
      setHasChanges(false);
    }
  };

  const handleCancel = () => {
    if (data) {
      setFormData({
        biografia: data.biografia || "",
        genero_id: data.genero?.id || "",
        timezone: data.timezone || "",
      });
    }
    setHasChanges(false);
  };

  // Estado de carga inicial
  if (loading && !data) {
    return (
      <>
        <SiteHeader />
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <IconLoader2 className="size-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Cargando configuración...</p>
          </div>
        </div>
      </>
    );
  }

  // Avatar URL
  const avatarUrl = data?.avatar?.url || data?.foto_perfil || `https://api.dicebear.com/7.x/bottts/svg?seed=${data?.nickname || 'default'}`;

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* Header de la página */}
            <div className="px-4 lg:px-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                  Información Personal
                </h1>
                <p className="text-muted-foreground text-sm md:text-base">
                  Administra tu información personal y preferencias de perfil
                </p>
              </div>
            </div>

            {/* Mensaje de éxito */}
            {successMessage && (
              <div className="px-4 lg:px-6">
                <Card className="border-green-500/50 bg-green-500/5">
                  <CardContent className="flex items-center gap-3 py-4">
                    <IconCheck className="size-5 text-green-500" />
                    <p className="text-sm text-green-500">{successMessage}</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Mensaje de error */}
            {error && (
              <div className="px-4 lg:px-6">
                <Card className="border-destructive/50 bg-destructive/5">
                  <CardContent className="flex items-center gap-3 py-4">
                    <IconAlertCircle className="size-5 text-destructive" />
                    <p className="text-sm text-destructive">{error}</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Avatar y nickname */}
            <div className="px-4 lg:px-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconUser className="size-5" />
                    Perfil de Usuario
                  </CardTitle>
                  <CardDescription>
                    Tu avatar y nombre de usuario público
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
                    {/* Avatar */}
                    <div className="flex flex-col items-center gap-4">
                      <Avatar className="size-24 border-4 border-primary/20 md:size-32">
                        <AvatarImage src={avatarUrl} alt={data?.nickname || ''} />
                        <AvatarFallback className="text-2xl">
                          {data?.nickname?.slice(0, 2).toUpperCase() || 'US'}
                        </AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm" disabled>
                        Cambiar avatar
                      </Button>
                    </div>

                    {/* Nickname (no editable) */}
                    <div className="flex flex-1 flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="nickname" className="flex items-center gap-2">
                          Nickname
                          <Badge variant="outline" className="text-xs">
                            No modificable
                          </Badge>
                        </Label>
                        <Input
                          id="nickname"
                          value={data?.nickname || ''}
                          disabled
                          className="font-medium"
                        />
                        <p className="text-xs text-muted-foreground">
                          Tu nickname es único y no se puede cambiar. Para cambiar tu
                          nickname, adquiere el servicio en la tienda.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sobre ti */}
            <div className="px-4 lg:px-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sobre ti</CardTitle>
                  <CardDescription>
                    Comparte algo sobre ti con la comunidad
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="bio">Biografía</Label>
                    <textarea
                      id="bio"
                      value={formData.biografia}
                      onChange={(e) => handleInputChange("biografia", e.target.value)}
                      placeholder="Cuéntanos sobre ti, tus logros, tu estilo de juego..."
                      className="border-input dark:bg-input/30 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-[120px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                      maxLength={300}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.biografia.length} / 300 caracteres
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Información personal */}
            <div className="px-4 lg:px-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconMapPin className="size-5" />
                    Información Personal
                  </CardTitle>
                  <CardDescription>
                    Detalles personales y preferencias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Género */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="gender">Género</Label>
                      <Select
                        value={formData.genero_id}
                        onValueChange={(value) => handleInputChange("genero_id", value)}
                      >
                        <SelectTrigger id="gender" className="w-full">
                          <SelectValue placeholder="Selecciona tu género" />
                        </SelectTrigger>
                        <SelectContent>
                          {data?.generos_disponibles?.map((genero) => (
                            <SelectItem key={genero.id} value={genero.id}>
                              {genero.valor}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Zona horaria */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="timezone">Zona horaria</Label>
                      <Select
                        value={formData.timezone}
                        onValueChange={(value) => handleInputChange("timezone", value)}
                      >
                        <SelectTrigger id="timezone" className="w-full">
                          <SelectValue placeholder="Selecciona tu zona horaria" />
                        </SelectTrigger>
                        <SelectContent>
                          {timezones.map((tz) => (
                            <SelectItem key={tz.value} value={tz.value}>
                              {tz.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Esto ayuda a mostrar los horarios de torneos en tu hora local
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Botones de acción */}
            {hasChanges && (
              <div className="sticky bottom-4 px-4 lg:px-6">
                <Card className="border-primary/50 bg-card/95 backdrop-blur-sm">
                  <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-medium">
                      Tienes cambios sin guardar
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={saving}
                        className="flex-1 sm:flex-none"
                      >
                        <IconX className="size-4" />
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 sm:flex-none"
                      >
                        {saving ? (
                          <IconLoader2 className="size-4 animate-spin" />
                        ) : (
                          <IconDeviceFloppy className="size-4" />
                        )}
                        {saving ? "Guardando..." : "Guardar cambios"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import { IconUser, IconCalendar, IconMapPin, IconDeviceFloppy, IconX } from "@tabler/icons-react";

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

interface PersonalData {
  nickname: string;
  fullName: string;
  avatar: string;
  bio: string;
  gender: string;
  dateOfBirth: string;
  timezone: string;
  country: string;
  city: string;
}

// Datos mock del usuario actual
const mockUserData: PersonalData = {
  nickname: "jugador1",
  fullName: "Carlos Méndez",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jugador1",
  bio: "Jugador profesional de ajedrez y estrategia. Competidor en torneos internacionales.",
  gender: "male",
  dateOfBirth: "1995-06-15",
  timezone: "America/Mexico_City",
  country: "México",
  city: "Ciudad de México",
};

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
  const [formData, setFormData] = useState<PersonalData>(mockUserData);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Simular obtención de datos del usuario desde API
    // En producción, esto vendría de un endpoint con el JWT
    setFormData(mockUserData);
  }, []);

  const handleInputChange = (field: keyof PersonalData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simular llamada a API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    console.log("Datos guardados:", formData);
    setIsSaving(false);
    setHasChanges(false);
    
    // En producción: hacer PUT/PATCH a la API con JWT
    // const response = await fetch('/api/usuario/personal', {
    //   method: 'PATCH',
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(formData)
    // });
  };

  const handleCancel = () => {
    setFormData(mockUserData);
    setHasChanges(false);
  };

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
                        <AvatarImage src={formData.avatar} alt={formData.nickname} />
                        <AvatarFallback className="text-2xl">
                          {formData.nickname.slice(0, 2).toUpperCase()}
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
                          value={formData.nickname}
                          disabled
                          className="font-medium"
                        />
                        <p className="text-xs text-muted-foreground">
                          Tu nickname es único y no se puede cambiar. Para cambiar tu
                          nickname, adquiere el servicio en la tienda.
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="fullName">Nombre completo</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          placeholder="Tu nombre completo"
                        />
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
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Cuéntanos sobre ti, tus logros, tu estilo de juego..."
                      className="border-input dark:bg-input/30 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-[120px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.bio.length} / 500 caracteres
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
                    <IconCalendar className="size-5" />
                    Información Personal
                  </CardTitle>
                  <CardDescription>
                    Detalles personales y demográficos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Género */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="gender">Género</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => handleInputChange("gender", value)}
                      >
                        <SelectTrigger id="gender" className="w-full">
                          <SelectValue placeholder="Selecciona tu género" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Masculino</SelectItem>
                          <SelectItem value="female">Femenino</SelectItem>
                          <SelectItem value="other">Otro</SelectItem>
                          <SelectItem value="prefer-not-to-say">
                            Prefiero no decirlo
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Fecha de nacimiento */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="dateOfBirth">Fecha de nacimiento</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) =>
                          handleInputChange("dateOfBirth", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ubicación y zona horaria */}
            <div className="px-4 lg:px-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconMapPin className="size-5" />
                    Ubicación y Zona Horaria
                  </CardTitle>
                  <CardDescription>
                    Configura tu ubicación para una mejor experiencia en torneos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* País */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="country">País</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => handleInputChange("country", e.target.value)}
                        placeholder="Tu país"
                      />
                    </div>

                    {/* Ciudad */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="city">Ciudad</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        placeholder="Tu ciudad"
                      />
                    </div>

                    {/* Zona horaria */}
                    <div className="flex flex-col gap-2 md:col-span-2">
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
                        disabled={isSaving}
                        className="flex-1 sm:flex-none"
                      >
                        <IconX className="size-4" />
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 sm:flex-none"
                      >
                        <IconDeviceFloppy className="size-4" />
                        {isSaving ? "Guardando..." : "Guardar cambios"}
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

"use client";

import { useState, useEffect } from "react";
import {
  IconDeviceFloppy,
  IconX,
  IconSword,
  IconToggleLeft,
  IconToggleRight,
  IconInfoCircle,
  IconTrophy,
  IconClock,
  IconCoins,
  IconLoader2,
  IconAlertCircle,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SiteHeader } from "@/components/usuario/site-header";
import { Badge } from "@/components/ui/badge";
import { useConfiguracion } from "@/hooks/use-configuracion";
import { actualizarPreferencias } from "@/lib/api/configuracion";

interface PreferencesData {
  desafiosHabilitados: boolean;
}

export default function PreferenciasPage() {
  const { configuracion, isLoading, error, refreshSection } = useConfiguracion();
  const [preferences, setPreferences] = useState<PreferencesData>({
    desafiosHabilitados: true,
  });
  const [originalPreferences, setOriginalPreferences] = useState<PreferencesData>({
    desafiosHabilitados: true,
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Cargar datos iniciales desde la configuración
  useEffect(() => {
    if (configuracion?.preferencias) {
      const prefs: PreferencesData = {
        desafiosHabilitados: configuracion.preferencias.desafios_habilitados ?? true,
      };
      setPreferences(prefs);
      setOriginalPreferences(prefs);
    }
  }, [configuracion?.preferencias]);

  const handleToggleDesafios = () => {
    setPreferences((prev) => ({
      ...prev,
      desafiosHabilitados: !prev.desafiosHabilitados,
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      await actualizarPreferencias({
        desafios_habilitados: preferences.desafiosHabilitados,
      });

      await refreshSection("preferencias");
      setOriginalPreferences(preferences);
      setHasChanges(false);
    } catch (err) {
      console.error("Error al guardar:", err);
      setSaveError("Error al guardar los cambios");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setPreferences(originalPreferences);
    setHasChanges(false);
    setSaveError(null);
  };

  // Estado de carga
  if (isLoading) {
    return (
      <>
        <SiteHeader />
        <div className="flex flex-1 flex-col items-center justify-center min-h-[400px]">
          <IconLoader2 className="size-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Cargando configuración...</p>
        </div>
      </>
    );
  }

  // Estado de error
  if (error) {
    return (
      <>
        <SiteHeader />
        <div className="flex flex-1 flex-col items-center justify-center min-h-[400px]">
          <IconAlertCircle className="size-8 text-destructive" />
          <p className="mt-4 text-destructive">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      </>
    );
  }

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
                  Preferencias
                </h1>
                <p className="text-muted-foreground text-sm md:text-base">
                  Configura tus preferencias de participación en la plataforma
                </p>
              </div>
            </div>

            {/* Error de guardado */}
            {saveError && (
              <div className="px-4 lg:px-6">
                <Card className="border-destructive/50 bg-destructive/5">
                  <CardContent className="flex items-center gap-3 py-4">
                    <IconAlertCircle className="size-5 text-destructive" />
                    <p className="text-sm text-destructive">{saveError}</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Configuración de desafíos */}
            <div className="px-4 lg:px-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconSword className="size-5" />
                    Desafíos
                  </CardTitle>
                  <CardDescription>
                    Controla si otros jugadores pueden enviarte desafíos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-6">
                    {/* Toggle principal */}
                    <div className="flex items-start justify-between gap-4 rounded-lg border bg-card/50 p-4">
                      <div className="flex flex-1 flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor="desafios-toggle"
                            className="text-base font-semibold"
                          >
                            Habilitar desafíos
                          </Label>
                          <Badge
                            variant={
                              preferences.desafiosHabilitados
                                ? "default"
                                : "secondary"
                            }
                          >
                            {preferences.desafiosHabilitados
                              ? "Habilitado"
                              : "Deshabilitado"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {preferences.desafiosHabilitados
                            ? "Otros jugadores pueden enviarte desafíos de juego. Recibirás notificaciones cuando alguien te desafíe."
                            : "Los desafíos están deshabilitados. No recibirás solicitudes de desafío de otros jugadores."}
                        </p>
                      </div>
                      <Button
                        id="desafios-toggle"
                        variant="ghost"
                        size="icon"
                        onClick={handleToggleDesafios}
                        disabled={isSaving}
                        className="mt-1 size-12 shrink-0"
                      >
                        {preferences.desafiosHabilitados ? (
                          <IconToggleRight className="size-8 text-primary" />
                        ) : (
                          <IconToggleLeft className="size-8 text-muted-foreground" />
                        )}
                      </Button>
                    </div>

                    {/* Información adicional sobre desafíos */}
                    {preferences.desafiosHabilitados && (
                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="flex flex-col gap-2 rounded-lg border bg-muted/30 p-4">
                          <div className="flex items-center gap-2">
                            <div className="rounded-full bg-primary/10 p-2">
                              <IconCoins className="size-4 text-primary" />
                            </div>
                            <p className="text-sm font-medium">
                              Desafíos de apuestas
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Acepta desafíos donde se apuestan créditos o saldo
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 rounded-lg border bg-muted/30 p-4">
                          <div className="flex items-center gap-2">
                            <div className="rounded-full bg-blue-500/10 p-2">
                              <IconTrophy className="size-4 text-blue-500" />
                            </div>
                            <p className="text-sm font-medium">Desafíos de XP</p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Participa en partidas amistosas para ganar experiencia
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 rounded-lg border bg-muted/30 p-4">
                          <div className="flex items-center gap-2">
                            <div className="rounded-full bg-green-500/10 p-2">
                              <IconClock className="size-4 text-green-500" />
                            </div>
                            <p className="text-sm font-medium">Tiempo de respuesta</p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Tienes 24 horas para aceptar o rechazar un desafío
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Información sobre desafíos */}
            <div className="px-4 lg:px-6">
              <Card className="border-blue-500/20 bg-blue-500/5">
                <CardContent className="flex gap-3 pt-6">
                  <div className="rounded-full bg-blue-500/10 p-2">
                    <IconInfoCircle className="size-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      ¿Qué son los desafíos?
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Los desafíos son partidas 1v1 entre jugadores donde puedes apostar
                      créditos, saldo o simplemente jugar por XP. Cuando los desafíos
                      están habilitados, otros jugadores pueden enviarte solicitudes de
                      desafío que puedes aceptar o rechazar. Si deshabilitas los
                      desafíos, no recibirás ninguna solicitud, pero aún podrás
                      participar en torneos.
                    </p>
                    <div className="mt-3 space-y-1">
                      <p className="text-sm font-medium text-blue-500">
                        Beneficios de los desafíos:
                      </p>
                      <ul className="ml-4 list-disc space-y-0.5 text-sm text-muted-foreground">
                        <li>Gana créditos y saldo adicional</li>
                        <li>Aumenta tu XP y sube de nivel</li>
                        <li>Mejora tus estadísticas personales</li>
                        <li>Practica contra oponentes reales</li>
                        <li>Desbloquea logros exclusivos</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Estadísticas de desafíos (solo si está habilitado) */}
            {preferences.desafiosHabilitados && (
              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Tus estadísticas de desafíos
                    </CardTitle>
                    <CardDescription>
                      Resumen de tu participación en desafíos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="flex flex-col gap-1 rounded-lg border bg-card/50 p-4">
                        <p className="text-2xl font-bold text-primary">0</p>
                        <p className="text-xs text-muted-foreground">
                          Desafíos ganados
                        </p>
                      </div>
                      <div className="flex flex-col gap-1 rounded-lg border bg-card/50 p-4">
                        <p className="text-2xl font-bold text-destructive">0</p>
                        <p className="text-xs text-muted-foreground">
                          Desafíos perdidos
                        </p>
                      </div>
                      <div className="flex flex-col gap-1 rounded-lg border bg-card/50 p-4">
                        <p className="text-2xl font-bold text-yellow-500">0</p>
                        <p className="text-xs text-muted-foreground">Pendientes</p>
                      </div>
                      <div className="flex flex-col gap-1 rounded-lg border bg-card/50 p-4">
                        <p className="text-2xl font-bold">0%</p>
                        <p className="text-xs text-muted-foreground">
                          Tasa de victoria
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Advertencia si está deshabilitado */}
            {!preferences.desafiosHabilitados && (
              <div className="px-4 lg:px-6">
                <Card className="border-yellow-500/20 bg-yellow-500/5">
                  <CardContent className="flex gap-3 pt-6">
                    <div className="rounded-full bg-yellow-500/10 p-2">
                      <IconInfoCircle className="size-5 text-yellow-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-yellow-500">
                        Desafíos deshabilitados
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Actualmente no estás recibiendo solicitudes de desafío. Puedes
                        habilitar los desafíos en cualquier momento para comenzar a
                        recibir invitaciones de otros jugadores. Los desafíos son una
                        excelente forma de ganar XP, créditos y mejorar tus
                        habilidades.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

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
                        {isSaving ? (
                          <IconLoader2 className="size-4 animate-spin" />
                        ) : (
                          <IconDeviceFloppy className="size-4" />
                        )}
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

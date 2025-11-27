"use client";

import { useState, useEffect } from "react";
import {
  IconDeviceFloppy,
  IconX,
  IconPlus,
  IconTrash,
  IconDeviceGamepad2,
  IconInfoCircle,
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
import { Badge } from "@/components/ui/badge";
import { useConfiguracion } from "@/hooks/use-configuracion";
import { upsertCuentaJuego, eliminarCuentaJuego } from "@/lib/api/configuracion";

interface GameAccount {
  id: string;
  plataforma_id: string;
  plataforma: string; // nombre de la plataforma
  identificador: string;
  isNew?: boolean;
}

interface PlataformaDisponible {
  id: string;
  valor: string;
}

export default function GameConfigPage() {
  const { configuracion, isLoading, error, refreshSection } = useConfiguracion();
  const [gameAccounts, setGameAccounts] = useState<GameAccount[]>([]);
  const [originalAccounts, setOriginalAccounts] = useState<GameAccount[]>([]);
  const [plataformas, setPlataformas] = useState<PlataformaDisponible[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Cargar datos iniciales desde la configuración
  useEffect(() => {
    if (configuracion?.juegos) {
      // Cargar plataformas disponibles del catálogo
      if (configuracion.juegos.plataformas_disponibles) {
        setPlataformas(configuracion.juegos.plataformas_disponibles);
      }
      
      // Cargar cuentas existentes
      if (configuracion.juegos.cuentas_juego) {
        const accounts: GameAccount[] = configuracion.juegos.cuentas_juego.map((cuenta: any) => ({
          id: cuenta.id?.toString() || `existing-${Date.now()}-${Math.random()}`,
          plataforma_id: cuenta.plataforma_id || "",
          plataforma: cuenta.plataforma || "",
          identificador: cuenta.identificador || "",
          isNew: false,
        }));
        setGameAccounts(accounts);
        setOriginalAccounts(accounts);
      }
    }
  }, [configuracion?.juegos]);

  const handleAddAccount = () => {
    const newAccount: GameAccount = {
      id: `new-${Date.now()}`,
      plataforma_id: "",
      plataforma: "",
      identificador: "",
      isNew: true,
    };
    setGameAccounts([...gameAccounts, newAccount]);
    setHasChanges(true);
  };

  const handleRemoveAccount = async (id: string) => {
    const account = gameAccounts.find((a) => a.id === id);
    
    // Si es una cuenta existente (no nueva), eliminarla del backend
    if (account && !account.isNew && account.id && !account.id.startsWith("new-")) {
      try {
        setIsSaving(true);
        setSaveError(null);
        await eliminarCuentaJuego(account.id);
        await refreshSection("juegos");
      } catch (err) {
        setSaveError("Error al eliminar la cuenta de juego");
        console.error(err);
        setIsSaving(false);
        return;
      }
      setIsSaving(false);
    }
    
    setGameAccounts(gameAccounts.filter((a) => a.id !== id));
    setHasChanges(true);
  };

  const handleUpdatePlataforma = (id: string, plataformaId: string) => {
    const plataforma = plataformas.find(p => p.id === plataformaId);
    setGameAccounts(
      gameAccounts.map((account) =>
        account.id === id 
          ? { ...account, plataforma_id: plataformaId, plataforma: plataforma?.valor || "" } 
          : account
      )
    );
    setHasChanges(true);
  };

  const handleUpdateIdentificador = (id: string, value: string) => {
    setGameAccounts(
      gameAccounts.map((account) =>
        account.id === id ? { ...account, identificador: value } : account
      )
    );
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      // Solo guardar las cuentas nuevas y válidas
      const newAccounts = gameAccounts.filter(
        (account) => account.isNew && account.plataforma_id && account.identificador.trim()
      );

      // Crear cada nueva cuenta en el backend
      for (const account of newAccounts) {
        await upsertCuentaJuego({
          plataforma_id: account.plataforma_id,
          identificador: account.identificador,
        });
      }

      // Refrescar datos desde el backend
      await refreshSection("juegos");
      setHasChanges(false);
    } catch (err) {
      console.error("Error al guardar:", err);
      setSaveError("Error al guardar los cambios");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setGameAccounts(originalAccounts);
    setHasChanges(false);
    setSaveError(null);
  };

  // Obtener plataformas ya usadas para evitar duplicados
  const getUsedPlatformIds = () => {
    return gameAccounts.map((account) => account.plataforma_id).filter(Boolean);
  };

  // Obtener plataformas disponibles para un selector específico
  const getAvailablePlatforms = (currentPlataformaId: string) => {
    const usedIds = getUsedPlatformIds();
    return plataformas.filter(
      (p) => !usedIds.includes(p.id) || p.id === currentPlataformaId
    );
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
                  Cuentas de Juegos
                </h1>
                <p className="text-muted-foreground text-sm md:text-base">
                  Vincula tus cuentas de diferentes plataformas para participar en
                  torneos
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

            {/* Lista de cuentas de juego */}
            <div className="px-4 lg:px-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <IconDeviceGamepad2 className="size-5" />
                        Mis Cuentas de Juego
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Agrega los identificadores de tus cuentas en diferentes
                        plataformas
                      </CardDescription>
                    </div>
                    <Button
                      onClick={handleAddAccount}
                      size="sm"
                      className="w-full sm:w-auto"
                      disabled={gameAccounts.length >= plataformas.length}
                    >
                      <IconPlus className="size-4" />
                      Agregar cuenta
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    {gameAccounts.length === 0 ? (
                      <div className="flex flex-col items-center justify-center gap-4 py-12">
                        <div className="rounded-full bg-muted p-4">
                          <IconDeviceGamepad2 className="size-8 text-muted-foreground" />
                        </div>
                        <div className="text-center">
                          <p className="font-medium">No hay cuentas agregadas</p>
                          <p className="text-sm text-muted-foreground">
                            Vincula tus cuentas de juego para participar en torneos
                          </p>
                        </div>
                        <Button onClick={handleAddAccount} variant="outline">
                          <IconPlus className="size-4" />
                          Agregar primera cuenta
                        </Button>
                      </div>
                    ) : (
                      gameAccounts.map((account) => {
                        const availablePlatforms = getAvailablePlatforms(account.plataforma_id);

                        return (
                          <div
                            key={account.id}
                            className="flex flex-col gap-4 rounded-lg border bg-card/50 p-4 transition-colors hover:bg-card/80"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-3">
                                <div className="rounded-full bg-muted p-2 text-primary">
                                  <IconDeviceGamepad2 className="size-5" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">
                                    {account.plataforma || "Seleccionar plataforma"}
                                  </span>
                                  {account.identificador && (
                                    <span className="text-xs text-muted-foreground">
                                      {account.identificador}
                                    </span>
                                  )}
                                </div>
                                {account.isNew && (
                                  <Badge variant="secondary" className="text-xs">
                                    Nuevo
                                  </Badge>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveAccount(account.id)}
                                disabled={isSaving}
                                className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                              >
                                <IconTrash className="size-4" />
                              </Button>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              {/* Plataforma */}
                              <div className="flex flex-col gap-2">
                                <Label htmlFor={`platform-${account.id}`}>
                                  Plataforma
                                  <span className="ml-1 text-destructive">*</span>
                                </Label>
                                <Select
                                  value={account.plataforma_id}
                                  onValueChange={(value) =>
                                    handleUpdatePlataforma(account.id, value)
                                  }
                                  disabled={!account.isNew}
                                >
                                  <SelectTrigger
                                    id={`platform-${account.id}`}
                                    className={
                                      !account.plataforma_id
                                        ? "border-destructive/50"
                                        : ""
                                    }
                                  >
                                    <SelectValue placeholder="Selecciona una plataforma" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {availablePlatforms.map((platform) => (
                                      <SelectItem
                                        key={platform.id}
                                        value={platform.id}
                                      >
                                        <div className="flex items-center gap-2">
                                          <IconDeviceGamepad2 className="size-4" />
                                          <span>{platform.valor}</span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {!account.plataforma_id && (
                                  <p className="text-xs text-destructive">
                                    Selecciona una plataforma
                                  </p>
                                )}
                              </div>

                              {/* Identificador */}
                              <div className="flex flex-col gap-2">
                                <Label htmlFor={`identifier-${account.id}`}>
                                  Identificador
                                  <span className="ml-1 text-destructive">*</span>
                                </Label>
                                <Input
                                  id={`identifier-${account.id}`}
                                  value={account.identificador}
                                  onChange={(e) =>
                                    handleUpdateIdentificador(account.id, e.target.value)
                                  }
                                  placeholder="Ingresa tu ID de usuario"
                                  className={
                                    !account.identificador.trim()
                                      ? "border-destructive/50"
                                      : ""
                                  }
                                  disabled={!account.isNew}
                                />
                                {!account.identificador.trim() && (
                                  <p className="text-xs text-destructive">
                                    Ingresa tu identificador
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Información adicional */}
            <div className="px-4 lg:px-6">
              <Card className="border-blue-500/20 bg-blue-500/5">
                <CardContent className="flex gap-3 pt-6">
                  <div className="rounded-full bg-blue-500/10 p-2">
                    <IconInfoCircle className="size-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      ¿Por qué vincular mis cuentas de juego?
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Vincular tus cuentas de juego te permite participar en torneos
                      específicos de cada plataforma. Los organizadores podrán
                      verificar tu identidad y contactarte directamente a través de
                      estos IDs. Asegúrate de que los identificadores sean correctos
                      para evitar problemas al registrarte en torneos.
                    </p>
                    <div className="mt-3 space-y-1">
                      <p className="text-sm font-medium text-blue-500">
                        Consejos importantes:
                      </p>
                      <ul className="ml-4 list-disc space-y-0.5 text-sm text-muted-foreground">
                        <li>Verifica que tus IDs estén escritos correctamente</li>
                        <li>
                          Puedes vincular múltiples plataformas según tus preferencias
                        </li>
                        <li>
                          Los IDs se mostrarán a los organizadores de torneos
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Botones de acción */}
            {hasChanges && gameAccounts.some((a) => a.isNew) && (
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

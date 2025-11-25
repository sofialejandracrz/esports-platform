"use client";

import { useState, useEffect } from "react";
import {
  IconBrandTwitch,
  IconBrandDiscord,
  IconBrandYoutube,
  IconBrandFacebook,
  IconBrandX,
  IconBrandInstagram,
  IconBrandTiktok,
  IconShare,
  IconDeviceFloppy,
  IconX,
  IconTrash,
  IconPlus,
  IconExternalLink,
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

interface SocialLink {
  id: string;
  plataforma: string;
  enlace: string;
}

// Plataformas de redes sociales disponibles
const socialPlatforms = [
  {
    value: "twitch",
    label: "Twitch",
    icon: IconBrandTwitch,
    color: "text-purple-500",
    placeholder: "https://twitch.tv/tu-usuario",
  },
  {
    value: "discord",
    label: "Discord",
    icon: IconBrandDiscord,
    color: "text-indigo-500",
    placeholder: "https://discord.gg/tu-servidor",
  },
  {
    value: "youtube",
    label: "YouTube",
    icon: IconBrandYoutube,
    color: "text-red-500",
    placeholder: "https://youtube.com/@tu-canal",
  },
  {
    value: "facebook",
    label: "Facebook",
    icon: IconBrandFacebook,
    color: "text-blue-600",
    placeholder: "https://facebook.com/tu-pagina",
  },
  {
    value: "x",
    label: "X (Twitter)",
    icon: IconBrandX,
    color: "text-foreground",
    placeholder: "https://x.com/tu-usuario",
  },
  {
    value: "instagram",
    label: "Instagram",
    icon: IconBrandInstagram,
    color: "text-pink-500",
    placeholder: "https://instagram.com/tu-usuario",
  },
  {
    value: "tiktok",
    label: "TikTok",
    icon: IconBrandTiktok,
    color: "text-foreground",
    placeholder: "https://tiktok.com/@tu-usuario",
  },
];

// Datos mock del usuario actual
const mockSocialLinks: SocialLink[] = [
  {
    id: "1",
    plataforma: "twitch",
    enlace: "https://twitch.tv/jugador1",
  },
  {
    id: "2",
    plataforma: "discord",
    enlace: "https://discord.gg/gaming-community",
  },
  {
    id: "3",
    plataforma: "youtube",
    enlace: "https://youtube.com/@jugador1",
  },
];

export default function SocialConfigPage() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(mockSocialLinks);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Simular obtención de datos del usuario desde API
    // En producción, esto vendría de un endpoint con el JWT
    setSocialLinks(mockSocialLinks);
  }, []);

  const handleAddLink = () => {
    const newLink: SocialLink = {
      id: `new-${Date.now()}`,
      plataforma: "",
      enlace: "",
    };
    setSocialLinks([...socialLinks, newLink]);
    setHasChanges(true);
  };

  const handleRemoveLink = (id: string) => {
    setSocialLinks(socialLinks.filter((link) => link.id !== id));
    setHasChanges(true);
  };

  const handleUpdateLink = (id: string, field: "plataforma" | "enlace", value: string) => {
    setSocialLinks(
      socialLinks.map((link) =>
        link.id === id ? { ...link, [field]: value } : link
      )
    );
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);

    // Filtrar enlaces vacíos o incompletos
    const validLinks = socialLinks.filter(
      (link) => link.plataforma && link.enlace.trim()
    );

    // Simular llamada a API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Enlaces guardados:", validLinks);
    setSocialLinks(validLinks);
    setIsSaving(false);
    setHasChanges(false);

    // En producción: hacer PUT/PATCH a la API con JWT
    // const response = await fetch('/api/usuario/social', {
    //   method: 'PATCH',
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(validLinks)
    // });
  };

  const handleCancel = () => {
    setSocialLinks(mockSocialLinks);
    setHasChanges(false);
  };

  const getPlatformInfo = (platformValue: string) => {
    return socialPlatforms.find((p) => p.value === platformValue);
  };

  const getUsedPlatforms = () => {
    return socialLinks.map((link) => link.plataforma).filter(Boolean);
  };

  const validateUrl = (url: string): boolean => {
    if (!url) return true; // Permitir vacío durante edición
    try {
      new URL(url);
      return url.startsWith("http://") || url.startsWith("https://");
    } catch {
      return false;
    }
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
                  Redes Sociales
                </h1>
                <p className="text-muted-foreground text-sm md:text-base">
                  Conecta tus redes sociales para que otros jugadores puedan seguirte
                </p>
              </div>
            </div>

            {/* Lista de enlaces sociales */}
            <div className="px-4 lg:px-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <IconShare className="size-5" />
                        Enlaces de Redes Sociales
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Agrega tus perfiles sociales para que la comunidad pueda
                        conectarse contigo
                      </CardDescription>
                    </div>
                    <Button
                      onClick={handleAddLink}
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <IconPlus className="size-4" />
                      Agregar enlace
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    {socialLinks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center gap-4 py-12">
                        <div className="rounded-full bg-muted p-4">
                          <IconShare className="size-8 text-muted-foreground" />
                        </div>
                        <div className="text-center">
                          <p className="font-medium">No hay enlaces agregados</p>
                          <p className="text-sm text-muted-foreground">
                            Agrega tus redes sociales para que otros te encuentren
                          </p>
                        </div>
                        <Button onClick={handleAddLink} variant="outline">
                          <IconPlus className="size-4" />
                          Agregar primer enlace
                        </Button>
                      </div>
                    ) : (
                      socialLinks.map((link, index) => {
                        const platformInfo = getPlatformInfo(link.plataforma);
                        const usedPlatforms = getUsedPlatforms();
                        const isUrlValid = validateUrl(link.enlace);
                        const PlatformIcon = platformInfo?.icon;

                        return (
                          <div
                            key={link.id}
                            className="flex flex-col gap-4 rounded-lg border bg-card/50 p-4 transition-colors hover:bg-card/80"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                {PlatformIcon && (
                                  <PlatformIcon
                                    className={`size-5 ${platformInfo.color}`}
                                  />
                                )}
                                <Badge variant="outline">#{index + 1}</Badge>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => handleRemoveLink(link.id)}
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                              >
                                <IconTrash className="size-4" />
                              </Button>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              {/* Seleccionar plataforma */}
                              <div className="flex flex-col gap-2">
                                <Label htmlFor={`platform-${link.id}`}>
                                  Plataforma
                                </Label>
                                <Select
                                  value={link.plataforma}
                                  onValueChange={(value) =>
                                    handleUpdateLink(link.id, "plataforma", value)
                                  }
                                >
                                  <SelectTrigger
                                    id={`platform-${link.id}`}
                                    className="w-full"
                                  >
                                    <SelectValue placeholder="Selecciona una plataforma" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {socialPlatforms.map((platform) => {
                                      const Icon = platform.icon;
                                      const isUsed =
                                        usedPlatforms.filter(
                                          (p) => p === platform.value
                                        ).length > 1 && link.plataforma === platform.value;

                                      return (
                                        <SelectItem
                                          key={platform.value}
                                          value={platform.value}
                                          disabled={
                                            usedPlatforms.includes(platform.value) &&
                                            link.plataforma !== platform.value
                                          }
                                        >
                                          <div className="flex items-center gap-2">
                                            <Icon
                                              className={`size-4 ${platform.color}`}
                                            />
                                            <span>{platform.label}</span>
                                            {isUsed && (
                                              <Badge
                                                variant="outline"
                                                className="ml-auto text-xs"
                                              >
                                                Ya usado
                                              </Badge>
                                            )}
                                          </div>
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Ingresar enlace */}
                              <div className="flex flex-col gap-2">
                                <Label htmlFor={`url-${link.id}`}>
                                  Enlace
                                  {!isUrlValid && link.enlace && (
                                    <span className="ml-2 text-xs text-destructive">
                                      URL inválida
                                    </span>
                                  )}
                                </Label>
                                <div className="relative">
                                  <Input
                                    id={`url-${link.id}`}
                                    type="url"
                                    value={link.enlace}
                                    onChange={(e) =>
                                      handleUpdateLink(
                                        link.id,
                                        "enlace",
                                        e.target.value
                                      )
                                    }
                                    placeholder={
                                      platformInfo?.placeholder ||
                                      "https://ejemplo.com/tu-perfil"
                                    }
                                    aria-invalid={!isUrlValid && !!link.enlace}
                                    className="pr-10"
                                  />
                                  {link.enlace && isUrlValid && (
                                    <a
                                      href={link.enlace}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="absolute right-3 top-1/2 -translate-y-1/2"
                                    >
                                      <IconExternalLink className="size-4 text-muted-foreground transition-colors hover:text-primary" />
                                    </a>
                                  )}
                                </div>
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
                    <IconShare className="size-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">¿Por qué conectar tus redes sociales?</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Tus enlaces de redes sociales aparecerán en tu perfil público,
                      permitiendo que otros jugadores te sigan, vean tus transmisiones en
                      vivo y se conecten con tu comunidad. Esto es especialmente útil si
                      organizas torneos o participas activamente en la plataforma.
                    </p>
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

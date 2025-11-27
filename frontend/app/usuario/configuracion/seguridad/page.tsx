"use client";

import { useState, useEffect } from "react";
import {
  IconDeviceFloppy,
  IconX,
  IconShieldLock,
  IconCreditCard,
  IconPhone,
  IconMapPin,
  IconWorld,
  IconCurrencyDollar,
  IconAlertTriangle,
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
import { useConfiguracion } from "@/hooks/use-configuracion";
import { actualizarSeguridad } from "@/lib/api/configuracion";

interface SecurityData {
  paypalEmail: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  currency: string;
}

// Lista de países
const countries = [
  { value: "México", label: "México" },
  { value: "Estados Unidos", label: "Estados Unidos" },
  { value: "Argentina", label: "Argentina" },
  { value: "Brasil", label: "Brasil" },
  { value: "Chile", label: "Chile" },
  { value: "Colombia", label: "Colombia" },
  { value: "Perú", label: "Perú" },
  { value: "España", label: "España" },
  { value: "Venezuela", label: "Venezuela" },
  { value: "Ecuador", label: "Ecuador" },
  { value: "Uruguay", label: "Uruguay" },
  { value: "Paraguay", label: "Paraguay" },
  { value: "Bolivia", label: "Bolivia" },
  { value: "Costa Rica", label: "Costa Rica" },
  { value: "Panamá", label: "Panamá" },
  { value: "Guatemala", label: "Guatemala" },
  { value: "Honduras", label: "Honduras" },
  { value: "El Salvador", label: "El Salvador" },
  { value: "Nicaragua", label: "Nicaragua" },
  { value: "República Dominicana", label: "República Dominicana" },
];

// Lista de divisas
const currencies = [
  { value: "USD", label: "USD - Dólar estadounidense", symbol: "$" },
  { value: "EUR", label: "EUR - Euro", symbol: "€" },
  { value: "MXN", label: "MXN - Peso mexicano", symbol: "$" },
  { value: "ARS", label: "ARS - Peso argentino", symbol: "$" },
  { value: "BRL", label: "BRL - Real brasileño", symbol: "R$" },
  { value: "CLP", label: "CLP - Peso chileno", symbol: "$" },
  { value: "COP", label: "COP - Peso colombiano", symbol: "$" },
  { value: "PEN", label: "PEN - Sol peruano", symbol: "S/" },
];

export default function SeguridadPage() {
  const { configuracion, isLoading, error, refreshSection } = useConfiguracion();
  const [securityData, setSecurityData] = useState<SecurityData>({
    paypalEmail: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "México",
    currency: "USD",
  });
  const [originalData, setOriginalData] = useState<SecurityData | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Cargar datos iniciales desde la configuración
  useEffect(() => {
    if (configuracion?.seguridad) {
      const data: SecurityData = {
        paypalEmail: configuracion.seguridad.correo_paypal || "",
        firstName: configuracion.seguridad.p_nombre || "",
        lastName: configuracion.seguridad.p_apellido || "",
        phone: configuracion.seguridad.telefono || "",
        address: configuracion.seguridad.direccion || "",
        city: configuracion.seguridad.ciudad || "",
        state: configuracion.seguridad.estado || "",
        zipCode: configuracion.seguridad.codigo_postal || "",
        country: configuracion.seguridad.pais || "México",
        currency: configuracion.seguridad.divisa || "USD",
      };
      setSecurityData(data);
      setOriginalData(data);
    }
  }, [configuracion?.seguridad]);

  const handleInputChange = (field: keyof SecurityData, value: string) => {
    setSecurityData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
    setSaveError(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      await actualizarSeguridad({
        correo_paypal: securityData.paypalEmail || undefined,
        p_nombre: securityData.firstName || undefined,
        s_nombre: undefined,
        p_apellido: securityData.lastName || undefined,
        s_apellido: undefined,
        telefono: securityData.phone || undefined,
        direccion: securityData.address || undefined,
        ciudad: securityData.city || undefined,
        estado: securityData.state || undefined,
        codigo_postal: securityData.zipCode || undefined,
        pais: securityData.country || undefined,
        divisa: securityData.currency || undefined,
      });

      await refreshSection("seguridad");
      setOriginalData(securityData);
      setHasChanges(false);
    } catch (err) {
      console.error("Error al guardar:", err);
      setSaveError("Error al guardar los cambios");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (originalData) {
      setSecurityData(originalData);
    }
    setHasChanges(false);
    setSaveError(null);
  };

  const isPaypalValid = (email: string): boolean => {
    if (!email) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPhoneValid = (phone: string): boolean => {
    if (!phone) return true;
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
  };

  const isZipCodeValid = (zipCode: string): boolean => {
    if (!zipCode) return true;
    return zipCode.length >= 4 && zipCode.length <= 10;
  };

  const paypalValid = isPaypalValid(securityData.paypalEmail);
  const phoneValid = isPhoneValid(securityData.phone);
  const zipCodeValid = isZipCodeValid(securityData.zipCode);

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
                  Seguridad y Pagos
                </h1>
                <p className="text-muted-foreground text-sm md:text-base">
                  Configura tu información de pago y datos personales para retiros
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

            {/* Información de PayPal */}
            <div className="px-4 lg:px-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconCreditCard className="size-5" />
                    Información de PayPal
                  </CardTitle>
                  <CardDescription>
                    Configura tu cuenta de PayPal para recibir retiros
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="paypal-email">
                        Dirección de correo de PayPal
                      </Label>
                      <Input
                        id="paypal-email"
                        type="email"
                        value={securityData.paypalEmail}
                        onChange={(e) =>
                          handleInputChange("paypalEmail", e.target.value)
                        }
                        placeholder="tu-email@paypal.com"
                        className={!paypalValid ? "border-destructive/50" : ""}
                      />
                      {!paypalValid && (
                        <p className="text-xs text-destructive">
                          Ingresa un correo electrónico válido
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Esta será la dirección a la que se enviarán los retiros de
                        saldo. Asegúrate de que sea correcta.
                      </p>
                    </div>

                    {securityData.paypalEmail && paypalValid && (
                      <div className="flex items-start gap-3 rounded-lg border bg-green-500/5 p-4">
                        <div className="rounded-full bg-green-500/10 p-2">
                          <IconShieldLock className="size-4 text-green-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-500">
                            PayPal configurado
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Tu cuenta de PayPal está lista para recibir pagos
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Información personal */}
            <div className="px-4 lg:px-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconShieldLock className="size-5" />
                    Información Personal
                  </CardTitle>
                  <CardDescription>
                    Datos necesarios para verificación de identidad
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Nombre de pila */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="first-name">
                        Nombre de pila
                        <span className="ml-1 text-destructive">*</span>
                      </Label>
                      <Input
                        id="first-name"
                        value={securityData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        placeholder="Tu primer nombre"
                      />
                    </div>

                    {/* Apellido */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="last-name">
                        Apellido
                        <span className="ml-1 text-destructive">*</span>
                      </Label>
                      <Input
                        id="last-name"
                        value={securityData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        placeholder="Tu apellido"
                      />
                    </div>

                    {/* Teléfono */}
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={securityData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="+52 123 456 7890"
                        className={!phoneValid ? "border-destructive/50" : ""}
                      />
                      {!phoneValid && securityData.phone && (
                        <p className="text-xs text-destructive">
                          Ingresa un número de teléfono válido (mínimo 10 dígitos)
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Incluye código de país. Ej: +52 (México), +1 (USA)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Dirección */}
            <div className="px-4 lg:px-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconMapPin className="size-5" />
                    Dirección
                  </CardTitle>
                  <CardDescription>
                    Tu dirección de residencia para verificación
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {/* Dirección completa */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        value={securityData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        placeholder="Calle, número, colonia"
                      />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Ciudad */}
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="city">Ciudad</Label>
                        <Input
                          id="city"
                          value={securityData.city}
                          onChange={(e) =>
                            handleInputChange("city", e.target.value)
                          }
                          placeholder="Tu ciudad"
                        />
                      </div>

                      {/* Estado/Provincia */}
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="state">Estado/Provincia</Label>
                        <Input
                          id="state"
                          value={securityData.state}
                          onChange={(e) =>
                            handleInputChange("state", e.target.value)
                          }
                          placeholder="Tu estado o provincia"
                        />
                      </div>

                      {/* Código postal */}
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="zip-code">Código Postal</Label>
                        <Input
                          id="zip-code"
                          value={securityData.zipCode}
                          onChange={(e) =>
                            handleInputChange("zipCode", e.target.value)
                          }
                          placeholder="12345"
                          className={!zipCodeValid ? "border-destructive/50" : ""}
                        />
                        {!zipCodeValid && securityData.zipCode && (
                          <p className="text-xs text-destructive">
                            Código postal inválido (4-10 caracteres)
                          </p>
                        )}
                      </div>

                      {/* País */}
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="country">País</Label>
                        <Select
                          value={securityData.country}
                          onValueChange={(value) =>
                            handleInputChange("country", value)
                          }
                        >
                          <SelectTrigger id="country">
                            <SelectValue placeholder="Selecciona tu país" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country.value} value={country.value}>
                                {country.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Divisa preferida */}
            <div className="px-4 lg:px-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconCurrencyDollar className="size-5" />
                    Divisa Preferida
                  </CardTitle>
                  <CardDescription>
                    Selecciona la divisa para mostrar saldos y premios
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="currency">Divisa</Label>
                      <Select
                        value={securityData.currency}
                        onValueChange={(value) =>
                          handleInputChange("currency", value)
                        }
                      >
                        <SelectTrigger id="currency">
                          <SelectValue placeholder="Selecciona una divisa" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.value} value={currency.value}>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-muted-foreground">
                                  {currency.symbol}
                                </span>
                                <span>{currency.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Esta divisa se usará para mostrar tu saldo, premios y
                        transacciones en la plataforma.
                      </p>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg border bg-blue-500/5 p-4">
                      <div className="rounded-full bg-blue-500/10 p-2">
                        <IconWorld className="size-4 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Divisa seleccionada:{" "}
                          {currencies.find((c) => c.value === securityData.currency)
                            ?.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Los retiros siempre se realizan en la divisa de tu cuenta
                          PayPal
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Información de seguridad */}
            <div className="px-4 lg:px-6">
              <Card className="border-yellow-500/20 bg-yellow-500/5">
                <CardContent className="flex gap-3 pt-6">
                  <div className="rounded-full bg-yellow-500/10 p-2">
                    <IconAlertTriangle className="size-5 text-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-yellow-500">
                      Información importante
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Toda la información que proporciones será utilizada
                      exclusivamente para procesar retiros y verificar tu identidad.
                      Asegúrate de que los datos sean correctos y coincidan con tu
                      cuenta de PayPal para evitar problemas al solicitar retiros.
                    </p>
                    <div className="mt-3 space-y-1">
                      <p className="text-sm font-medium text-yellow-500">
                        Requisitos para retiros:
                      </p>
                      <ul className="ml-4 list-disc space-y-0.5 text-sm text-muted-foreground">
                        <li>Cuenta de PayPal verificada y activa</li>
                        <li>Nombre completo coincidente con PayPal</li>
                        <li>Dirección verificada</li>
                        <li>Saldo mínimo de retiro alcanzado</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Advertencia de privacidad */}
            <div className="px-4 lg:px-6">
              <Card className="border-blue-500/20 bg-blue-500/5">
                <CardContent className="flex gap-3 pt-6">
                  <div className="rounded-full bg-blue-500/10 p-2">
                    <IconInfoCircle className="size-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Privacidad y seguridad</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Tu información está protegida con encriptación de nivel
                      bancario. Nunca compartiremos tus datos personales con terceros
                      sin tu consentimiento. Toda la información se almacena de forma
                      segura y cumple con los estándares internacionales de protección
                      de datos.
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
                        disabled={
                          isSaving || !paypalValid || !phoneValid || !zipCodeValid
                        }
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

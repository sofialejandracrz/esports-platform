"use client";

import { useState, useEffect } from "react";
import {
  IconCash,
  IconClock,
  IconAlertTriangle,
  IconInfoCircle,
  IconShieldLock,
  IconCurrencyDollar,
  IconHistory,
  IconCircleCheck,
  IconCircleX,
  IconLoader,
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
import { SiteHeader } from "@/components/usuario/site-header";
import { Badge } from "@/components/ui/badge";
import { useConfiguracion } from "@/hooks/use-configuracion";

interface WithdrawalHistory {
  id: string;
  amount: string;
  currency: string;
  status: "completed" | "pending" | "rejected";
  date: string;
  paypalEmail: string;
}

export default function RetiroPage() {
  const { configuracion, isLoading, error } = useConfiguracion();
  const [userBalance, setUserBalance] = useState({
    available: "0.00",
    pending: "0.00",
    total: "0.00",
    currency: "USD",
    minimumWithdrawal: "10.00",
  });
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalHistory[]>([]);

  // Cargar datos desde la configuración
  useEffect(() => {
    if (configuracion?.retiro) {
      setUserBalance({
        available: configuracion.retiro.saldo_disponible || "0.00",
        pending: "0.00", // No existe en el tipo, valor por defecto
        total: configuracion.retiro.saldo_disponible || "0.00", // Usamos saldo_disponible como total
        currency: "USD", // Valor por defecto
        minimumWithdrawal: "10.00", // Valor por defecto
      });

      // Si hay historial de retiros, convertirlo
      if (configuracion.retiro.historial_retiros && Array.isArray(configuracion.retiro.historial_retiros)) {
        const history: WithdrawalHistory[] = configuracion.retiro.historial_retiros.map((retiro: any) => ({
          id: retiro.id?.toString() || `${Date.now()}`,
          amount: retiro.monto?.toString() || "0.00",
          currency: retiro.divisa || "USD",
          status: retiro.estado || "pending",
          date: retiro.fecha || new Date().toISOString(),
          paypalEmail: retiro.paypal_email || configuracion.retiro.correo_paypal || "",
        }));
        setWithdrawalHistory(history);
      }
    }
  }, [configuracion?.retiro]);

  const canWithdraw = parseFloat(userBalance.available) >= parseFloat(userBalance.minimumWithdrawal);

  const getStatusBadge = (status: WithdrawalHistory["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
            <IconCircleCheck className="mr-1 size-3" />
            Completado
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
            <IconLoader className="mr-1 size-3" />
            Pendiente
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
            <IconCircleX className="mr-1 size-3" />
            Rechazado
          </Badge>
        );
    }
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
                  Retiro de Saldo
                </h1>
                <p className="text-muted-foreground text-sm md:text-base">
                  Solicita retiros de tu saldo ganado a tu cuenta PayPal
                </p>
              </div>
            </div>

            {/* Saldo disponible */}
            <div className="px-4 lg:px-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-primary/50">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-xs">
                      Saldo disponible
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">
                        ${userBalance.available}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {userBalance.currency}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Listo para retirar
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription className="text-xs">
                      Saldo pendiente
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-yellow-500">
                        ${userBalance.pending}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {userBalance.currency}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      En proceso de retiro
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription className="text-xs">
                      Saldo total
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">
                        ${userBalance.total}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {userBalance.currency}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Acumulado
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Aviso de integración futura */}
            <div className="px-4 lg:px-6">
              <Card className="border-blue-500/20 bg-blue-500/5">
                <CardContent className="flex gap-3 pt-6">
                  <div className="rounded-full bg-blue-500/10 p-2">
                    <IconClock className="size-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-blue-500">
                      Funcionalidad en desarrollo
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      El sistema de retiros está actualmente en desarrollo. Pronto
                      podrás solicitar retiros de tu saldo ganado directamente a tu
                      cuenta de PayPal. Mientras tanto, tu saldo se mantendrá seguro
                      en tu cuenta y podrás utilizarlo para participar en torneos y
                      desafíos.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Botón de retiro (deshabilitado) */}
            <div className="px-4 lg:px-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconCash className="size-5" />
                    Solicitar Retiro
                  </CardTitle>
                  <CardDescription>
                    Retira tu saldo ganado a tu cuenta PayPal verificada
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border bg-muted/30 py-12">
                      <div className="rounded-full bg-muted p-4">
                        <IconCurrencyDollar className="size-8 text-muted-foreground" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">
                          Retiros temporalmente no disponibles
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Esta función estará disponible próximamente
                        </p>
                      </div>
                      <Button disabled className="mt-2">
                        <IconCash className="size-4" />
                        Solicitar retiro
                      </Button>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="flex flex-col gap-2 rounded-lg border bg-card/50 p-4">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-primary/10 p-2">
                            <IconCurrencyDollar className="size-4 text-primary" />
                          </div>
                          <p className="text-sm font-medium">Mínimo de retiro</p>
                        </div>
                        <p className="text-2xl font-bold">
                          ${userBalance.minimumWithdrawal}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Cantidad mínima para solicitar retiro
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 rounded-lg border bg-card/50 p-4">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-blue-500/10 p-2">
                            <IconClock className="size-4 text-blue-500" />
                          </div>
                          <p className="text-sm font-medium">
                            Tiempo de procesamiento
                          </p>
                        </div>
                        <p className="text-2xl font-bold">3-5 días</p>
                        <p className="text-xs text-muted-foreground">
                          Tiempo estimado para recibir el pago
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Requisitos para retiro */}
            <div className="px-4 lg:px-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconShieldLock className="size-5" />
                    Requisitos para Retiros
                  </CardTitle>
                  <CardDescription>
                    Asegúrate de cumplir con todos los requisitos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 rounded-lg border bg-card/50 p-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <IconCircleCheck className="size-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Cuenta de PayPal configurada
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Debes tener una cuenta de PayPal verificada configurada en
                          Seguridad
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg border bg-card/50 p-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <IconCircleCheck className="size-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Saldo mínimo alcanzado
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Debes tener al menos ${userBalance.minimumWithdrawal}{" "}
                          {userBalance.currency} disponibles
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg border bg-card/50 p-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <IconCircleCheck className="size-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Información completa</p>
                        <p className="text-xs text-muted-foreground">
                          Todos tus datos personales deben estar actualizados
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg border bg-card/50 p-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <IconCircleCheck className="size-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Cuenta verificada</p>
                        <p className="text-xs text-muted-foreground">
                          Tu cuenta de usuario debe estar completamente verificada
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Historial de retiros */}
            <div className="px-4 lg:px-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconHistory className="size-5" />
                    Historial de Retiros
                  </CardTitle>
                  <CardDescription>
                    Registro de todas tus solicitudes de retiro
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {withdrawalHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-4 py-12">
                      <div className="rounded-full bg-muted p-4">
                        <IconHistory className="size-8 text-muted-foreground" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">No hay retiros registrados</p>
                        <p className="text-sm text-muted-foreground">
                          Tus retiros aparecerán aquí una vez que realices tu primera
                          solicitud
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {withdrawalHistory.map((withdrawal) => (
                        <div
                          key={withdrawal.id}
                          className="flex items-center justify-between rounded-lg border bg-card/50 p-4"
                        >
                          <div className="flex flex-1 flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">
                                ${withdrawal.amount} {withdrawal.currency}
                              </p>
                              {getStatusBadge(withdrawal.status)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {withdrawal.paypalEmail}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(withdrawal.date).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Información adicional */}
            <div className="px-4 lg:px-6">
              <Card className="border-yellow-500/20 bg-yellow-500/5">
                <CardContent className="flex gap-3 pt-6">
                  <div className="rounded-full bg-yellow-500/10 p-2">
                    <IconAlertTriangle className="size-5 text-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-yellow-500">
                      Información importante sobre retiros
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Los retiros solo se pueden realizar a cuentas de PayPal
                      verificadas. Asegúrate de que tu información de pago esté
                      correcta antes de solicitar un retiro. Los fondos se procesarán
                      en un plazo de 3 a 5 días hábiles. No se aplican comisiones por
                      parte de la plataforma, pero PayPal puede cobrar sus propias
                      tarifas de conversión.
                    </p>
                    <div className="mt-3 space-y-1">
                      <p className="text-sm font-medium text-yellow-500">
                        Políticas de retiro:
                      </p>
                      <ul className="ml-4 list-disc space-y-0.5 text-sm text-muted-foreground">
                        <li>Solo un retiro pendiente a la vez</li>
                        <li>Los retiros no se pueden cancelar una vez procesados</li>
                        <li>Verifica que tu PayPal esté activo y sin restricciones</li>
                        <li>
                          Contacta soporte si tu retiro tarda más de 5 días hábiles
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ayuda */}
            <div className="px-4 lg:px-6">
              <Card className="border-blue-500/20 bg-blue-500/5">
                <CardContent className="flex gap-3 pt-6">
                  <div className="rounded-full bg-blue-500/10 p-2">
                    <IconInfoCircle className="size-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">¿Necesitas ayuda?</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Si tienes problemas con retiros, asegúrate de haber completado
                      toda tu información en la sección de Seguridad. Para soporte
                      adicional, contacta a nuestro equipo de atención al cliente a
                      través del chat en vivo o por correo electrónico.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

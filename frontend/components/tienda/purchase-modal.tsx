"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  IconBrandPaypal, 
  IconWallet, 
  IconAlertTriangle,
  IconLoader2,
  IconCheck 
} from "@tabler/icons-react";
import { useTienda } from "@/hooks/use-tienda";
import { toNumber } from "@/lib/utils";
import type { ItemCreditos, ItemMembresia, ItemServicio } from "@/types/tienda";

type SelectedItem = 
  | { type: 'creditos'; item: ItemCreditos }
  | { type: 'membresia'; item: ItemMembresia }
  | { type: 'servicio'; item: ItemServicio };

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: SelectedItem | null;
  userSaldo: number | string;
  onPurchaseComplete: () => void;
}

type PaymentMethod = 'paypal' | 'saldo';

export function PurchaseModal({
  isOpen,
  onClose,
  selectedItem,
  userSaldo,
  onPurchaseComplete,
}: PurchaseModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paypal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nicknameInput, setNicknameInput] = useState("");
  const [nicknameVerified, setNicknameVerified] = useState<boolean | null>(null);
  const [nicknameMessage, setNicknameMessage] = useState("");
  
  const { iniciarCompraPayPal, comprarConSaldo, verificarNickname, error: apiError } = useTienda();

  // Resetear estado cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setPaymentMethod('paypal');
      setIsProcessing(false);
      setError(null);
      setNicknameInput("");
      setNicknameVerified(null);
      setNicknameMessage("");
    }
  }, [isOpen]);

  // Mostrar errores de la API
  useEffect(() => {
    if (apiError) {
      setError(apiError);
    }
  }, [apiError]);

  if (!selectedItem) return null;

  const item = selectedItem.item;
  const precio = toNumber(item.precio);
  const saldo = toNumber(userSaldo);
  const canPayWithSaldo = saldo >= precio;

  // Determinar si necesita input de nickname
  const needsNicknameInput = 
    selectedItem.type === 'servicio' && 
    (selectedItem.item.servicio_tipo === 'cambio_nickname' || 
     selectedItem.item.servicio_tipo === 'reclamar_nickname');

  const metadataKey = selectedItem.type === 'servicio' && 
    selectedItem.item.servicio_tipo === 'cambio_nickname' 
    ? 'nuevo_nickname' 
    : 'nickname_solicitado';

  // Verificar nickname cuando el usuario escribe
  const handleNicknameChange = async (value: string) => {
    setNicknameInput(value);
    setNicknameVerified(null);
    setNicknameMessage("");

    if (value.length >= 3) {
      const result = await verificarNickname(value);
      if (result) {
        setNicknameVerified(result.disponible);
        setNicknameMessage(result.mensaje);
      }
    }
  };

  // Procesar compra
  const handlePurchase = async () => {
    setError(null);
    setIsProcessing(true);

    try {
      // Validar nickname si es necesario
      if (needsNicknameInput) {
        if (!nicknameInput || nicknameInput.length < 3) {
          setError("Debes ingresar un nickname válido (mínimo 3 caracteres)");
          setIsProcessing(false);
          return;
        }
        if (!nicknameVerified) {
          setError("El nickname no está disponible");
          setIsProcessing(false);
          return;
        }
      }

      const metadata = needsNicknameInput ? { [metadataKey]: nicknameInput } : {};

      if (paymentMethod === 'saldo') {
        // Compra con saldo
        const result = await comprarConSaldo({
          itemId: item.id,
          metadata,
        });

        if (result?.success) {
          onPurchaseComplete();
        } else {
          setError(result?.error || result?.message || "Error al procesar la compra");
        }
      } else {
        // Compra con PayPal
        const result = await iniciarCompraPayPal({
          itemId: item.id,
          metadata,
        });

        console.log('Resultado PayPal:', result); // Debug

        if (result?.success && result.paypal?.approveUrl) {
          // Redirigir a PayPal
          window.location.href = result.paypal.approveUrl;
        } else {
          // Mostrar error más detallado
          const errorMsg = result?.error || result?.message || "Error al crear la orden de PayPal. Verifica que PayPal esté configurado correctamente.";
          setError(errorMsg);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar Compra</DialogTitle>
          <DialogDescription>
            Revisa los detalles de tu compra
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Detalle del item */}
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">{item.nombre}</h4>
                <p className="text-sm text-muted-foreground">{item.descripcion}</p>
              </div>
              <span className="text-xl font-bold">${precio.toFixed(2)}</span>
            </div>
            
            {/* Info adicional según tipo */}
            {selectedItem.type === 'creditos' && (
              <Badge variant="secondary" className="mt-2">
                +{selectedItem.item.creditos_otorgados} créditos
              </Badge>
            )}
            {selectedItem.type === 'membresia' && (
              <Badge variant="secondary" className="mt-2">
                {selectedItem.item.duracion_dias} días de Premium
              </Badge>
            )}
          </div>

          {/* Input de nickname si es necesario */}
          {needsNicknameInput && (
            <div className="space-y-2">
              <Label htmlFor="nickname">
                {selectedItem.item.servicio_tipo === 'cambio_nickname' 
                  ? 'Nuevo Nickname' 
                  : 'Nickname a Reclamar'}
              </Label>
              <Input
                id="nickname"
                value={nicknameInput}
                onChange={(e) => handleNicknameChange(e.target.value)}
                placeholder="Ingresa el nickname..."
                className={
                  nicknameVerified === true 
                    ? 'border-green-500' 
                    : nicknameVerified === false 
                      ? 'border-red-500' 
                      : ''
                }
              />
              {nicknameMessage && (
                <p className={`text-xs ${
                  nicknameVerified ? 'text-green-500' : 'text-red-500'
                }`}>
                  {nicknameVerified && <IconCheck className="mr-1 inline size-3" />}
                  {nicknameMessage}
                </p>
              )}
            </div>
          )}

          {/* Advertencia si existe */}
          {selectedItem.type === 'servicio' && selectedItem.item.advertencia && (
            <div className="flex items-start gap-2 rounded-lg bg-yellow-500/10 p-3">
              <IconAlertTriangle className="mt-0.5 size-4 shrink-0 text-yellow-500" />
              <span className="text-sm text-yellow-500">{selectedItem.item.advertencia}</span>
            </div>
          )}

          <Separator />

          {/* Método de pago */}
          <div className="space-y-3">
            <Label>Método de Pago</Label>
            
            {/* PayPal */}
            <button
              type="button"
              onClick={() => setPaymentMethod('paypal')}
              className={`flex w-full items-center gap-3 rounded-lg border p-3 transition-all ${
                paymentMethod === 'paypal' 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'hover:bg-muted/50'
              }`}
            >
              <div className={`flex size-10 items-center justify-center rounded-lg ${
                paymentMethod === 'paypal' ? 'bg-blue-500' : 'bg-muted'
              }`}>
                <IconBrandPaypal className={`size-5 ${
                  paymentMethod === 'paypal' ? 'text-white' : 'text-muted-foreground'
                }`} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">PayPal</p>
                <p className="text-xs text-muted-foreground">Pago seguro con PayPal</p>
              </div>
              <div className={`size-4 rounded-full border-2 ${
                paymentMethod === 'paypal' 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-muted-foreground'
              }`}>
                {paymentMethod === 'paypal' && (
                  <IconCheck className="size-3 text-white" />
                )}
              </div>
            </button>

            {/* Saldo */}
            <button
              type="button"
              onClick={() => canPayWithSaldo && setPaymentMethod('saldo')}
              disabled={!canPayWithSaldo}
              className={`flex w-full items-center gap-3 rounded-lg border p-3 transition-all ${
                paymentMethod === 'saldo' 
                  ? 'border-green-500 bg-green-500/10' 
                  : canPayWithSaldo 
                    ? 'hover:bg-muted/50' 
                    : 'cursor-not-allowed opacity-50'
              }`}
            >
              <div className={`flex size-10 items-center justify-center rounded-lg ${
                paymentMethod === 'saldo' ? 'bg-green-500' : 'bg-muted'
              }`}>
                <IconWallet className={`size-5 ${
                  paymentMethod === 'saldo' ? 'text-white' : 'text-muted-foreground'
                }`} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">Saldo de Cuenta</p>
                <p className="text-xs text-muted-foreground">
                  Disponible: ${saldo.toFixed(2)}
                  {!canPayWithSaldo && ' (Saldo insuficiente)'}
                </p>
              </div>
              <div className={`size-4 rounded-full border-2 ${
                paymentMethod === 'saldo' 
                  ? 'border-green-500 bg-green-500' 
                  : 'border-muted-foreground'
              }`}>
                {paymentMethod === 'saldo' && (
                  <IconCheck className="size-3 text-white" />
                )}
              </div>
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancelar
          </Button>
          <Button 
            onClick={handlePurchase} 
            disabled={isProcessing || (needsNicknameInput && !nicknameVerified)}
            className={paymentMethod === 'paypal' 
              ? 'bg-blue-500 hover:bg-blue-600' 
              : 'bg-green-500 hover:bg-green-600'
            }
          >
            {isProcessing ? (
              <>
                <IconLoader2 className="mr-2 size-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                {paymentMethod === 'paypal' ? 'Pagar con PayPal' : 'Pagar con Saldo'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

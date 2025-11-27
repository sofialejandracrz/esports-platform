import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convierte un precio (number | string) a número
 * PostgreSQL NUMERIC puede serializar como número o string en JSONB
 */
export function toNumber(value: number | string | null | undefined): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Formatea un precio para mostrar
 */
export function formatPrice(value: number | string | null | undefined): string {
  return toNumber(value).toFixed(2);
}

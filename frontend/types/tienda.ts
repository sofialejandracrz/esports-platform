// ===========================================
// Tipos TypeScript para la Tienda - Frontend
// Estos tipos coinciden con las respuestas de los procedimientos almacenados de PostgreSQL
// ===========================================

// Respuesta del catálogo de tienda (tienda_obtener_catalogo)
export interface CatalogoTienda {
  success: boolean;
  usuario?: {
    id: string;
    tiene_membresia: boolean;
    membresia_actual: MembresiaActual | null;
    saldo: number | string;  // PostgreSQL NUMERIC puede venir como number o string
    creditos: number;
  };
  categorias: {
    creditos: ItemCreditos[];
    membresias: ItemMembresia[];
    servicios: ItemServicio[];
  };
  info_membresia_gratuita: {
    nombre: string;
    precio: number;
    beneficios: string | null;
  };
}

export interface MembresiaActual {
  id: string;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
  dias_restantes: number;
}

export interface ItemCreditos {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number | string;  // PostgreSQL NUMERIC
  creditos_otorgados: number;
  destacado: boolean;
  mejor_valor: boolean;
}

export interface ItemMembresia {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number | string;  // PostgreSQL NUMERIC
  duracion_dias: number;
  membresia_tipo_id: string;
  ahorro: string | null;  // Puede ser null del procedimiento
}

export interface ItemServicio {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number | string;  // PostgreSQL NUMERIC
  servicio_tipo: 'cambio_nickname' | 'reset_record' | 'reset_stats' | 'reclamar_nickname';
  advertencia: string | null;  // Puede ser null del procedimiento
  requiere_soporte: boolean;
}

// Request para crear orden (tienda_crear_orden)
export interface CrearOrdenRequest {
  itemId: string;
  metadata?: {
    nuevo_nickname?: string;
    nickname_solicitado?: string;
    [key: string]: unknown;
  };
}

// Respuesta de crear orden (tienda_crear_orden)
export interface CrearOrdenResponse {
  success: boolean;
  error?: string;
  orden_id?: string;
  item?: {
    id: string;
    nombre: string;
    precio: number | string;  // PostgreSQL NUMERIC
    tipo: string;
  };
  message?: string;
}

// Respuesta de crear orden con PayPal
export interface CrearOrdenPayPalResponse extends CrearOrdenResponse {
  paypal?: {
    orderId: string;
    approveUrl: string;
  };
}

// Request para capturar pago PayPal
export interface CapturarPagoRequest {
  ordenId: string;
  paypalOrderId: string;
}

// Respuesta de captura de pago (tienda_confirmar_compra)
export interface CapturarPagoResponse {
  success: boolean;
  error?: string;
  orden_id?: string;
  resultado?: {
    tipo: string;
    [key: string]: unknown;
  };
  message?: string;
  paypal?: {
    captureId: string;
    status: string;
    amount: string;
    currency: string;
  };
}

// Request para comprar con saldo (tienda_comprar_con_saldo)
export interface ComprarConSaldoRequest {
  itemId: string;
  metadata?: {
    nuevo_nickname?: string;
    nickname_solicitado?: string;
    [key: string]: unknown;
  };
}

// Historial de compras (tienda_historial_compras)
export interface HistorialComprasResponse {
  success: boolean;
  total: number;
  compras: OrdenCompra[];
}

export interface OrdenCompra {
  id: string;
  item: {
    id: string;
    nombre: string;
    tipo: string;
  };
  monto: number | string;  // PostgreSQL NUMERIC
  estado: EstadoOrden;
  paypal_order_id?: string;
  metadata: Record<string, unknown>;
  creado_en: string;
  completado_en?: string;
}

// Alias para compatibilidad con componentes que esperan nombres diferentes
export interface CompraHistorial {
  orden_id: string;
  nombre_item: string;
  tipo_item: string;
  monto: number | string;
  estado: EstadoOrden;
  metodo_pago: 'paypal' | 'saldo';
  fecha_compra: string;
}

// Verificar nickname (tienda_verificar_nickname)
export interface VerificarNicknameResponse {
  disponible: boolean;
  tipo?: 'disponible' | 'reclamable' | 'inactivo' | 'en_uso';
  mensaje: string;
  requiere_soporte?: boolean;
  dias_inactivo?: number;
}

// Solicitudes de soporte
export interface SolicitudSoporte {
  id: string;
  tipo: 'reclamar_nickname' | 'otro';
  nickname_solicitado?: string;
  estado: 'pendiente' | 'en_revision' | 'aprobado' | 'rechazado';
  usuario: {
    id: string;
    nickname: string;
  };
  orden?: {
    id: string;
    monto: string;
  } | null;
  notas_admin?: string;
  creado_en: string;
  resuelto_en?: string;
}

export interface SolicitudesSoporteResponse {
  success: boolean;
  total: number;
  solicitudes: SolicitudSoporte[];
  estadisticas?: {
    pendientes: number;
    en_revision: number;
    aprobadas: number;
    rechazadas: number;
  };
}

// Request para resolver solicitud
export interface ResolverSolicitudRequest {
  solicitudId: string;
  aprobar: boolean;
  notas?: string;
}

// Estados de la orden
export type EstadoOrden = 'pendiente' | 'completado' | 'fallido' | 'reembolsado' | 'cancelado';

// Tipos de servicio
export type TipoServicio = 'cambio_nickname' | 'reset_record' | 'reset_stats' | 'reclamar_nickname';

// ===========================================
// Tipos compartidos para el módulo Tienda
// Estos tipos representan las respuestas de los procedimientos almacenados
// ===========================================

/**
 * Resultado base de procedimientos almacenados
 */
export interface ProcedureResult {
  success: boolean;
  error?: string;
  code?: string;
  message?: string;
  [key: string]: any;
}

/**
 * Respuesta del catálogo de tienda
 * Procedimiento: tienda_obtener_catalogo
 */
export interface CatalogoResponse extends ProcedureResult {
  usuario?: {
    id: string;
    tiene_membresia: boolean;
    membresia_actual: MembresiaActual | null;
    saldo: string;
    creditos: number;
  };
  categorias?: {
    creditos: ItemCreditos[];
    membresias: ItemMembresia[];
    servicios: ItemServicio[];
  };
  info_membresia_gratuita?: {
    nombre: string;
    precio: number;
    beneficios: string;
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
  precio: number | string;
  creditos_otorgados: number;
  destacado: boolean;
  mejor_valor: boolean;
}

export interface ItemMembresia {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number | string;
  duracion_dias: number;
  membresia_tipo_id: string;
  ahorro?: string | null;
}

export interface ItemServicio {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number | string;
  servicio_tipo: 'cambio_nickname' | 'reset_record' | 'reset_stats' | 'reclamar_nickname';
  advertencia?: string | null;
  requiere_soporte: boolean;
}

/**
 * Respuesta de crear orden
 * Procedimiento: tienda_crear_orden
 */
export interface OrdenResponse extends ProcedureResult {
  orden_id?: string;
  item?: {
    id: string;
    nombre: string;
    precio: number | string;
    tipo: string;
  };
}

/**
 * Respuesta del historial de compras
 * Procedimiento: tienda_historial_compras
 */
export interface HistorialResponse extends ProcedureResult {
  total?: number;
  compras?: OrdenCompra[];
}

export interface OrdenCompra {
  id: string;
  item: {
    id: string;
    nombre: string;
    tipo: string;
  };
  monto: number | string;
  estado: EstadoOrden;
  paypal_order_id?: string;
  metadata: Record<string, unknown>;
  creado_en: string;
  completado_en?: string;
}

export type EstadoOrden = 'pendiente' | 'completado' | 'fallido' | 'reembolsado' | 'cancelado';

/**
 * Respuesta de verificar nickname
 * Procedimiento: tienda_verificar_nickname
 */
export interface NicknameResponse {
  disponible: boolean;
  tipo?: 'disponible' | 'reclamable' | 'inactivo' | 'en_uso';
  mensaje: string;
  requiere_soporte?: boolean;
  dias_inactivo?: number;
}

/**
 * Respuesta de solicitudes de soporte
 * Procedimiento: tienda_obtener_solicitudes_soporte
 */
export interface SolicitudesResponse extends ProcedureResult {
  total?: number;
  solicitudes?: SolicitudSoporte[];
}

export interface SolicitudSoporte {
  id: string;
  tipo: 'reclamar_nickname' | string;
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

/**
 * Respuesta de confirmar compra
 * Procedimiento: tienda_confirmar_compra
 */
export interface ConfirmarCompraResponse extends ProcedureResult {
  orden_id?: string;
  resultado?: {
    tipo: string;
    [key: string]: unknown;
  };
}

/**
 * Respuesta de resolver solicitud
 * Procedimiento: tienda_resolver_solicitud_soporte
 */
export interface ResolverSolicitudResponse extends ProcedureResult {
  nickname_asignado?: string;
}

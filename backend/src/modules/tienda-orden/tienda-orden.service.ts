import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { TiendaOrden } from './entities/tienda-orden.entity';
import { TiendaItem } from '../tienda-item/entities/tienda-item.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { 
  CrearOrdenDto, 
  RegistrarPagoPaypalDto, 
  ConfirmarCompraDto,
  ComprarConSaldoDto,
  VerificarNicknameDto 
} from './dto';
import {
  ProcedureResult,
  CatalogoResponse,
  OrdenResponse,
  HistorialResponse,
  NicknameResponse,
  ConfirmarCompraResponse,
} from '../tienda/types';

@Injectable()
export class TiendaOrdenService {
  constructor(
    @InjectRepository(TiendaOrden)
    private readonly tiendaOrdenRepository: Repository<TiendaOrden>,
    @InjectRepository(TiendaItem)
    private readonly tiendaItemRepository: Repository<TiendaItem>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * 1. Obtener catálogo de tienda
   * Llama al procedimiento: tienda_obtener_catalogo
   */
  async obtenerCatalogo(usuarioId?: string): Promise<CatalogoResponse> {
    const result = await this.dataSource.query(
      `SELECT tienda_obtener_catalogo($1) as resultado`,
      [usuarioId || null]
    );
    
    return result[0]?.resultado as CatalogoResponse;
  }

  /**
   * 2. Crear orden de compra
   * Llama al procedimiento: tienda_crear_orden
   */
  async crearOrden(usuarioId: string, dto: CrearOrdenDto): Promise<OrdenResponse> {
    // Preparar metadata
    const metadata: any = dto.metadata || {};
    
    const result = await this.dataSource.query(
      `SELECT tienda_crear_orden($1, $2, $3) as resultado`,
      [usuarioId, dto.itemId, JSON.stringify(metadata)]
    );
    
    const response = result[0]?.resultado as OrdenResponse;
    
    if (!response.success) {
      throw new BadRequestException(response.error || 'Error al crear la orden');
    }
    
    return response;
  }

  /**
   * 3. Registrar pago PayPal
   * Llama al procedimiento: tienda_registrar_pago_paypal
   */
  async registrarPagoPaypal(dto: RegistrarPagoPaypalDto): Promise<ProcedureResult> {
    const result = await this.dataSource.query(
      `SELECT tienda_registrar_pago_paypal($1, $2, $3, $4, $5) as resultado`,
      [
        dto.ordenId,
        dto.paypalOrderId,
        dto.paypalCaptureId || null,
        dto.paypalPayerId || null,
        dto.paypalPayerEmail || null
      ]
    );
    
    const response = result[0]?.resultado as ProcedureResult;
    
    if (!response.success) {
      throw new BadRequestException(response.error || 'Error al registrar pago PayPal');
    }
    
    return response;
  }

  /**
   * 4. Confirmar compra (después de pago exitoso)
   * Llama al procedimiento: tienda_confirmar_compra
   */
  async confirmarCompra(dto: ConfirmarCompraDto): Promise<ProcedureResult> {
    const result = await this.dataSource.query(
      `SELECT tienda_confirmar_compra($1, $2) as resultado`,
      [dto.ordenId, dto.paypalCaptureId || null]
    );
    
    const response = result[0]?.resultado as ProcedureResult;
    
    if (!response.success) {
      throw new BadRequestException(response.error || 'Error al confirmar la compra');
    }
    
    return response;
  }

  /**
   * 5. Cancelar orden
   * Llama al procedimiento: tienda_cancelar_orden
   */
  async cancelarOrden(ordenId: string, usuarioId: string): Promise<ProcedureResult> {
    const result = await this.dataSource.query(
      `SELECT tienda_cancelar_orden($1, $2) as resultado`,
      [ordenId, usuarioId]
    );
    
    const response = result[0]?.resultado as ProcedureResult;
    
    if (!response.success) {
      throw new BadRequestException(response.error || 'Error al cancelar la orden');
    }
    
    return response;
  }

  /**
   * 6. Obtener historial de compras
   * Llama al procedimiento: tienda_historial_compras
   */
  async obtenerHistorial(
    usuarioId: string, 
    limit: number = 20, 
    offset: number = 0
  ): Promise<HistorialResponse> {
    const result = await this.dataSource.query(
      `SELECT tienda_historial_compras($1, $2, $3) as resultado`,
      [usuarioId, limit, offset]
    );
    
    return result[0]?.resultado as HistorialResponse;
  }

  /**
   * 7. Verificar disponibilidad de nickname
   * Llama al procedimiento: tienda_verificar_nickname
   */
  async verificarNickname(nickname: string): Promise<NicknameResponse> {
    const result = await this.dataSource.query(
      `SELECT tienda_verificar_nickname($1) as resultado`,
      [nickname]
    );
    
    return result[0]?.resultado as NicknameResponse;
  }

  /**
   * 10. Comprar con saldo (sin PayPal)
   * Llama al procedimiento: tienda_comprar_con_saldo
   */
  async comprarConSaldo(usuarioId: string, dto: ComprarConSaldoDto): Promise<ConfirmarCompraResponse> {
    const metadata: any = dto.metadata || {};
    
    const result = await this.dataSource.query(
      `SELECT tienda_comprar_con_saldo($1, $2, $3) as resultado`,
      [usuarioId, dto.itemId, JSON.stringify(metadata)]
    );
    
    const response = result[0]?.resultado as ConfirmarCompraResponse;
    
    if (!response.success) {
      throw new BadRequestException(response.error || 'Error al procesar la compra con saldo');
    }
    
    return response;
  }

  /**
   * Obtener una orden por ID
   */
  async obtenerOrdenPorId(ordenId: string, usuarioId: string): Promise<TiendaOrden> {
    const orden = await this.tiendaOrdenRepository.findOne({
      where: { id: ordenId },
      relations: ['usuario', 'item', 'item.tipo'],
    });

    if (!orden) {
      throw new NotFoundException('Orden no encontrada');
    }

    // Verificar que la orden pertenece al usuario
    if (orden.usuario.id !== usuarioId) {
      throw new ForbiddenException('No tienes acceso a esta orden');
    }

    return orden;
  }

  /**
   * Obtener todas las órdenes de un usuario (usando TypeORM directamente)
   */
  async obtenerOrdenesPorUsuario(usuarioId: string): Promise<TiendaOrden[]> {
    return this.tiendaOrdenRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: ['item', 'item.tipo'],
      order: { creadoEn: 'DESC' },
    });
  }
}

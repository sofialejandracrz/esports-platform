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
import { OracleFunctionHelper } from '../../common/helpers/oracle-function.helper';

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
   * PG: tienda_obtener_catalogo
   * Oracle: PKG_TIENDA.FN_OBTENER_CATALOGO
   */
  async obtenerCatalogo(usuarioId?: string): Promise<CatalogoResponse> {
    const result = await OracleFunctionHelper.callFunction(
      this.dataSource,
      'tienda_obtener_catalogo',
      'PKG_TIENDA.FN_OBTENER_CATALOGO',
      [usuarioId || null],
    );
    
    return result as CatalogoResponse;
  }

  /**
   * 2. Crear orden de compra
   * PG: tienda_crear_orden
   * Oracle: PKG_TIENDA.FN_CREAR_ORDEN
   */
  async crearOrden(usuarioId: string, dto: CrearOrdenDto): Promise<OrdenResponse> {
    const metadata: any = dto.metadata || {};
    
    const response = await OracleFunctionHelper.callFunction(
      this.dataSource,
      'tienda_crear_orden',
      'PKG_TIENDA.FN_CREAR_ORDEN',
      [usuarioId, dto.itemId, JSON.stringify(metadata)],
    ) as OrdenResponse;
    
    if (!response.success) {
      throw new BadRequestException(response.error || 'Error al crear la orden');
    }
    
    return response;
  }

  /**
   * 3. Registrar pago PayPal
   * PG: tienda_registrar_pago_paypal
   * Oracle: PKG_TIENDA.FN_REGISTRAR_PAGO_PAYPAL
   */
  async registrarPagoPaypal(dto: RegistrarPagoPaypalDto): Promise<ProcedureResult> {
    const response = await OracleFunctionHelper.callFunction(
      this.dataSource,
      'tienda_registrar_pago_paypal',
      'PKG_TIENDA.FN_REGISTRAR_PAGO_PAYPAL',
      [
        dto.ordenId,
        dto.paypalOrderId,
        dto.paypalCaptureId || null,
        dto.paypalPayerId || null,
        dto.paypalPayerEmail || null
      ],
    ) as ProcedureResult;
    
    if (!response.success) {
      throw new BadRequestException(response.error || 'Error al registrar pago PayPal');
    }
    
    return response;
  }

  /**
   * 4. Confirmar compra (después de pago exitoso)
   * PG: tienda_confirmar_compra
   * Oracle: PKG_TIENDA.FN_CONFIRMAR_COMPRA
   */
  async confirmarCompra(dto: ConfirmarCompraDto): Promise<ProcedureResult> {
    const response = await OracleFunctionHelper.callFunction(
      this.dataSource,
      'tienda_confirmar_compra',
      'PKG_TIENDA.FN_CONFIRMAR_COMPRA',
      [dto.ordenId, dto.paypalCaptureId || null],
    ) as ProcedureResult;
    
    if (!response.success) {
      throw new BadRequestException(response.error || 'Error al confirmar la compra');
    }
    
    return response;
  }

  /**
   * 5. Cancelar orden
   * PG: tienda_cancelar_orden
   * Oracle: PKG_TIENDA.FN_CANCELAR_ORDEN
   */
  async cancelarOrden(ordenId: string, usuarioId: string): Promise<ProcedureResult> {
    const response = await OracleFunctionHelper.callFunction(
      this.dataSource,
      'tienda_cancelar_orden',
      'PKG_TIENDA.FN_CANCELAR_ORDEN',
      [ordenId, usuarioId],
    ) as ProcedureResult;
    
    if (!response.success) {
      throw new BadRequestException(response.error || 'Error al cancelar la orden');
    }
    
    return response;
  }

  /**
   * 6. Obtener historial de compras
   * PG: tienda_historial_compras
   * Oracle: PKG_TIENDA.FN_HISTORIAL_COMPRAS
   */
  async obtenerHistorial(
    usuarioId: string, 
    limit: number = 20, 
    offset: number = 0
  ): Promise<HistorialResponse> {
    const result = await OracleFunctionHelper.callFunction(
      this.dataSource,
      'tienda_historial_compras',
      'PKG_TIENDA.FN_HISTORIAL_COMPRAS',
      [usuarioId, limit, offset],
    );
    
    return result as HistorialResponse;
  }

  /**
   * 7. Verificar disponibilidad de nickname
   * PG: tienda_verificar_nickname
   * Oracle: PKG_TIENDA.FN_VERIFICAR_NICKNAME
   */
  async verificarNickname(nickname: string): Promise<NicknameResponse> {
    const result = await OracleFunctionHelper.callFunction(
      this.dataSource,
      'tienda_verificar_nickname',
      'PKG_TIENDA.FN_VERIFICAR_NICKNAME',
      [nickname],
    );
    
    return result as NicknameResponse;
  }

  /**
   * 10. Comprar con saldo (sin PayPal)
   * PG: tienda_comprar_con_saldo
   * Oracle: PKG_TIENDA.FN_COMPRAR_CON_SALDO
   */
  async comprarConSaldo(usuarioId: string, dto: ComprarConSaldoDto): Promise<ConfirmarCompraResponse> {
    const metadata: any = dto.metadata || {};
    
    const response = await OracleFunctionHelper.callFunction(
      this.dataSource,
      'tienda_comprar_con_saldo',
      'PKG_TIENDA.FN_COMPRAR_CON_SALDO',
      [usuarioId, dto.itemId, JSON.stringify(metadata)],
    ) as ConfirmarCompraResponse;
    
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
      where: { id: +ordenId },
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
      where: { usuario: { id: +usuarioId } },
      relations: ['item', 'item.tipo'],
      order: { creadoEn: 'DESC' },
    });
  }
}

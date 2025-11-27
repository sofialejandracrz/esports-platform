import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Req,
  ParseUUIDPipe,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { Request } from 'express';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { TiendaOrdenService } from '../tienda-orden/tienda-orden.service';
import { TiendaSolicitudSoporteService } from '../tienda-solicitud-soporte/tienda-solicitud-soporte.service';
import { PaypalService, CreatePayPalOrderDto } from './services/paypal.service';
import { 
  CrearOrdenDto, 
  RegistrarPagoPaypalDto, 
  ConfirmarCompraDto,
  ComprarConSaldoDto,
  VerificarNicknameDto 
} from '../tienda-orden/dto';
import { ResolverSolicitudDto, ObtenerSolicitudesDto } from '../tienda-solicitud-soporte/dto';
import { ConfigService } from '@nestjs/config';
import {
  CatalogoResponse,
  OrdenResponse,
  NicknameResponse,
  ProcedureResult,
  HistorialResponse,
  SolicitudesResponse,
  ResolverSolicitudResponse,
  ConfirmarCompraResponse,
} from './types';

// Interfaz para el request con usuario autenticado
interface AuthenticatedRequest extends Request {
  user: {
    userId: string; // ID del usuario (viene del JWT strategy)
    nickname: string;
    rol: string;
  };
}

@Controller('tienda')
export class TiendaController {
  constructor(
    private readonly tiendaOrdenService: TiendaOrdenService,
    private readonly solicitudSoporteService: TiendaSolicitudSoporteService,
    private readonly paypalService: PaypalService,
    private readonly configService: ConfigService,
  ) {}

  // ============================================
  // ENDPOINTS PÚBLICOS
  // ============================================

  /**
   * Obtener catálogo de tienda (público)
   * GET /tienda/catalogo
   */
  @Public()
  @Get('catalogo')
  async obtenerCatalogo(): Promise<CatalogoResponse> {
    return this.tiendaOrdenService.obtenerCatalogo();
  }

  /**
   * Obtener catálogo con información del usuario autenticado
   * GET /tienda/catalogo/usuario
   */
  @Get('catalogo/usuario')
  async obtenerCatalogoUsuario(@Req() req: AuthenticatedRequest): Promise<CatalogoResponse> {
    return this.tiendaOrdenService.obtenerCatalogo(req.user.userId);
  }

  /**
   * Verificar disponibilidad de nickname
   * GET /tienda/verificar-nickname/:nickname
   */
  @Public()
  @Get('verificar-nickname/:nickname')
  async verificarNickname(@Param('nickname') nickname: string): Promise<NicknameResponse> {
    return this.tiendaOrdenService.verificarNickname(nickname);
  }

  // ============================================
  // ENDPOINTS DE ÓRDENES (requieren autenticación)
  // ============================================

  /**
   * Crear una nueva orden de compra
   * POST /tienda/orden
   */
  @Post('orden')
  async crearOrden(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CrearOrdenDto,
  ): Promise<OrdenResponse> {
    return this.tiendaOrdenService.crearOrden(req.user.userId, dto);
  }

  /**
   * Crear orden e iniciar pago con PayPal
   * POST /tienda/orden/paypal
   */
  @Post('orden/paypal')
  async crearOrdenConPaypal(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CrearOrdenDto,
  ) {
    // 1. Crear la orden en el sistema (llama a tienda_crear_orden)
    const ordenResponse = await this.tiendaOrdenService.crearOrden(req.user.userId, dto);
    
    if (!ordenResponse.success || !ordenResponse.orden_id || !ordenResponse.item) {
      return ordenResponse;
    }

    // 2. Crear la orden en PayPal
    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
    
    // Convertir precio a string con 2 decimales (PayPal requiere string)
    const precioString = typeof ordenResponse.item.precio === 'number' 
      ? ordenResponse.item.precio.toFixed(2) 
      : parseFloat(ordenResponse.item.precio).toFixed(2);
    
    const paypalOrder = await this.paypalService.createOrder({
      ordenId: ordenResponse.orden_id,
      monto: precioString,
      descripcion: `Compra: ${ordenResponse.item.nombre}`,
      returnUrl: `${frontendUrl}/tienda/pago-exitoso`,
      cancelUrl: `${frontendUrl}/tienda/pago-cancelado`,
    });

    // 3. Registrar el ID de PayPal en nuestra orden (llama a tienda_registrar_pago_paypal)
    await this.tiendaOrdenService.registrarPagoPaypal({
      ordenId: ordenResponse.orden_id,
      paypalOrderId: paypalOrder.paypalOrderId,
    });

    return {
      success: true,
      orden_id: ordenResponse.orden_id,
      item: ordenResponse.item,
      paypal: {
        orderId: paypalOrder.paypalOrderId,
        approveUrl: paypalOrder.approveUrl,
      },
    };
  }

  /**
   * Capturar pago de PayPal (después de que el usuario aprueba)
   * POST /tienda/orden/paypal/capture
   */
  @Post('orden/paypal/capture')
  async capturarPagoPaypal(
    @Body('ordenId', ParseUUIDPipe) ordenId: string,
    @Body('paypalOrderId') paypalOrderId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    // 1. Capturar el pago en PayPal
    const captureResult = await this.paypalService.captureOrder(paypalOrderId);

    // 2. Registrar los datos del pago
    await this.tiendaOrdenService.registrarPagoPaypal({
      ordenId,
      paypalOrderId: captureResult.paypalOrderId,
      paypalCaptureId: captureResult.paypalCaptureId,
      paypalPayerId: captureResult.paypalPayerId,
      paypalPayerEmail: captureResult.paypalPayerEmail,
    });

    // 3. Confirmar la compra (aplica beneficios)
    const confirmResult = await this.tiendaOrdenService.confirmarCompra({
      ordenId,
      paypalCaptureId: captureResult.paypalCaptureId,
    });

    return {
      success: true,
      ...confirmResult,
      paypal: {
        captureId: captureResult.paypalCaptureId,
        status: captureResult.status,
        amount: captureResult.amount,
        currency: captureResult.currency,
      },
    };
  }

  /**
   * Comprar con saldo del usuario (sin PayPal)
   * POST /tienda/orden/saldo
   */
  @Post('orden/saldo')
  async comprarConSaldo(
    @Req() req: AuthenticatedRequest,
    @Body() dto: ComprarConSaldoDto,
  ): Promise<ConfirmarCompraResponse> {
    return this.tiendaOrdenService.comprarConSaldo(req.user.userId, dto);
  }

  /**
   * Cancelar una orden pendiente
   * POST /tienda/orden/:id/cancelar
   */
  @Post('orden/:id/cancelar')
  async cancelarOrden(
    @Param('id', ParseUUIDPipe) ordenId: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<ProcedureResult> {
    return this.tiendaOrdenService.cancelarOrden(ordenId, req.user.userId);
  }

  /**
   * Obtener una orden específica
   * GET /tienda/orden/:id
   */
  @Get('orden/:id')
  async obtenerOrden(
    @Param('id', ParseUUIDPipe) ordenId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.tiendaOrdenService.obtenerOrdenPorId(ordenId, req.user.userId);
  }

  // ============================================
  // ENDPOINTS DE HISTORIAL
  // ============================================

  /**
   * Obtener historial de compras del usuario
   * GET /tienda/historial
   */
  @Get('historial')
  async obtenerHistorial(
    @Req() req: AuthenticatedRequest,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<HistorialResponse> {
    return this.tiendaOrdenService.obtenerHistorial(req.user.userId, limit, offset);
  }

  // ============================================
  // ENDPOINTS DE SOLICITUDES DE SOPORTE (usuario)
  // ============================================

  /**
   * Obtener mis solicitudes de soporte
   * GET /tienda/soporte/mis-solicitudes
   */
  @Get('soporte/mis-solicitudes')
  async obtenerMisSolicitudes(@Req() req: AuthenticatedRequest) {
    return this.solicitudSoporteService.obtenerMisSolicitudes(req.user.userId);
  }

  // ============================================
  // ENDPOINTS DE ADMIN
  // ============================================

  /**
   * Obtener todas las solicitudes de soporte (ADMIN)
   * GET /tienda/admin/soporte
   */
  @Roles('admin')
  @Get('admin/soporte')
  async obtenerSolicitudesSoporte(
    @Query('estado') estado?: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
  ): Promise<SolicitudesResponse> {
    return this.solicitudSoporteService.obtenerSolicitudes({ estado, limit, offset });
  }

  /**
   * Resolver una solicitud de soporte (ADMIN)
   * POST /tienda/admin/soporte/resolver
   */
  @Roles('admin')
  @Post('admin/soporte/resolver')
  async resolverSolicitud(
    @Body() dto: ResolverSolicitudDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<ResolverSolicitudResponse> {
    return this.solicitudSoporteService.resolverSolicitud(req.user.userId, dto);
  }

  /**
   * Obtener detalle de una solicitud (ADMIN)
   * GET /tienda/admin/soporte/:id
   */
  @Roles('admin')
  @Get('admin/soporte/:id')
  async obtenerSolicitudDetalle(@Param('id', ParseUUIDPipe) id: string) {
    return this.solicitudSoporteService.obtenerSolicitudPorId(id);
  }

  // ============================================
  // WEBHOOK DE PAYPAL
  // ============================================

  /**
   * Webhook de PayPal para eventos
   * POST /tienda/webhook/paypal
   */
  @Public()
  @Post('webhook/paypal')
  async handlePaypalWebhook(
    @Body() body: any,
    @Req() req: Request,
  ) {
    const webhookId = this.configService.get('PAYPAL_WEBHOOK_ID');
    
    if (!webhookId) {
      return { received: true, verified: false, message: 'Webhook ID not configured' };
    }

    // Verificar la firma del webhook
    const isValid = await this.paypalService.verifyWebhookSignature(
      webhookId,
      body,
      {
        'paypal-auth-algo': req.headers['paypal-auth-algo'] as string,
        'paypal-cert-url': req.headers['paypal-cert-url'] as string,
        'paypal-transmission-id': req.headers['paypal-transmission-id'] as string,
        'paypal-transmission-sig': req.headers['paypal-transmission-sig'] as string,
        'paypal-transmission-time': req.headers['paypal-transmission-time'] as string,
      }
    );

    if (!isValid) {
      return { received: true, verified: false };
    }

    // Procesar eventos de PayPal
    const eventType = body.event_type;
    
    switch (eventType) {
      case 'CHECKOUT.ORDER.APPROVED':
        // El usuario aprobó el pago, pero aún no se capturó
        console.log('PayPal: Orden aprobada', body.resource.id);
        break;
        
      case 'PAYMENT.CAPTURE.COMPLETED':
        // Pago capturado exitosamente
        console.log('PayPal: Pago capturado', body.resource.id);
        break;
        
      case 'PAYMENT.CAPTURE.DENIED':
        // Pago denegado
        console.log('PayPal: Pago denegado', body.resource.id);
        break;
        
      default:
        console.log('PayPal webhook event:', eventType);
    }

    return { received: true, verified: true };
  }
}

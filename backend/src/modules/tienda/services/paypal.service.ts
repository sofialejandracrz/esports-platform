import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

interface PayPalOrderResponse {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

interface PayPalCaptureResponse {
  id: string;
  status: string;
  purchase_units: Array<{
    payments: {
      captures: Array<{
        id: string;
        status: string;
        amount: {
          value: string;
          currency_code: string;
        };
      }>;
    };
  }>;
  payer: {
    payer_id: string;
    email_address: string;
    name: {
      given_name: string;
      surname: string;
    };
  };
}

export interface CreatePayPalOrderDto {
  ordenId: string;
  monto: string;
  divisa?: string;
  descripcion: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface PayPalOrderResult {
  paypalOrderId: string;
  approveUrl: string;
}

export interface PayPalCaptureResult {
  paypalOrderId: string;
  paypalCaptureId: string;
  paypalPayerId: string;
  paypalPayerEmail: string;
  status: string;
  amount: string;
  currency: string;
}

@Injectable()
export class PaypalService {
  private readonly logger = new Logger(PaypalService.name);
  private axiosInstance: AxiosInstance;
  private accessToken: string;
  private tokenExpiry: number = 0;

  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.clientId = this.configService.get<string>('PAYPAL_CLIENT_ID') || '';
    this.clientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET') || '';
    
    const sandbox = this.configService.get<string>('PAYPAL_SANDBOX', 'true') === 'true';
    this.baseUrl = sandbox 
      ? 'https://api-m.sandbox.paypal.com' 
      : 'https://api-m.paypal.com';

    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.logger.log(`PayPal inicializado en modo ${sandbox ? 'SANDBOX' : 'PRODUCCIÓN'}`);
  }

  /**
   * Verifica si PayPal está configurado correctamente
   */
  isConfigured(): boolean {
    return !!(this.clientId && this.clientSecret);
  }

  /**
   * Obtiene un token de acceso de PayPal
   */
  private async getAccessToken(): Promise<string> {
    // Si ya tenemos un token válido, usarlo
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    if (!this.isConfigured()) {
      throw new BadRequestException('PayPal no está configurado. Configura PAYPAL_CLIENT_ID y PAYPAL_CLIENT_SECRET');
    }

    try {
      const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      
      const response = await this.axiosInstance.post(
        '/v1/oauth2/token',
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.accessToken = response.data.access_token;
      // Token expira en segundos, convertir a ms y dejar margen de 60 segundos
      this.tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;

      return this.accessToken;
    } catch (error) {
      this.logger.error('Error al obtener token de PayPal:', error.response?.data || error.message);
      throw new BadRequestException('Error al autenticar con PayPal');
    }
  }

  /**
   * Crea una orden en PayPal
   */
  async createOrder(dto: CreatePayPalOrderDto): Promise<PayPalOrderResult> {
    const token = await this.getAccessToken();

    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: dto.ordenId,
          description: dto.descripcion,
          amount: {
            currency_code: dto.divisa || 'USD',
            value: dto.monto,
          },
        },
      ],
      application_context: {
        brand_name: 'eSports Platform',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: dto.returnUrl,
        cancel_url: dto.cancelUrl,
      },
    };

    try {
      const response = await this.axiosInstance.post<PayPalOrderResponse>(
        '/v2/checkout/orders',
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const approveLink = response.data.links.find(link => link.rel === 'approve');
      
      if (!approveLink) {
        throw new BadRequestException('No se encontró el enlace de aprobación de PayPal');
      }

      this.logger.log(`Orden PayPal creada: ${response.data.id}`);

      return {
        paypalOrderId: response.data.id,
        approveUrl: approveLink.href,
      };
    } catch (error) {
      this.logger.error('Error al crear orden en PayPal:', error.response?.data || error.message);
      throw new BadRequestException('Error al crear orden en PayPal');
    }
  }

  /**
   * Captura (confirma) una orden de PayPal
   */
  async captureOrder(paypalOrderId: string): Promise<PayPalCaptureResult> {
    const token = await this.getAccessToken();

    try {
      const response = await this.axiosInstance.post<PayPalCaptureResponse>(
        `/v2/checkout/orders/${paypalOrderId}/capture`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const capture = response.data.purchase_units[0]?.payments?.captures[0];
      
      if (!capture) {
        throw new BadRequestException('No se encontró información de captura');
      }

      this.logger.log(`Orden PayPal capturada: ${paypalOrderId}, Capture: ${capture.id}`);

      return {
        paypalOrderId: response.data.id,
        paypalCaptureId: capture.id,
        paypalPayerId: response.data.payer.payer_id,
        paypalPayerEmail: response.data.payer.email_address,
        status: capture.status,
        amount: capture.amount.value,
        currency: capture.amount.currency_code,
      };
    } catch (error) {
      this.logger.error('Error al capturar orden en PayPal:', error.response?.data || error.message);
      throw new BadRequestException('Error al capturar orden en PayPal');
    }
  }

  /**
   * Obtiene detalles de una orden de PayPal
   */
  async getOrderDetails(paypalOrderId: string): Promise<any> {
    const token = await this.getAccessToken();

    try {
      const response = await this.axiosInstance.get(
        `/v2/checkout/orders/${paypalOrderId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error al obtener detalles de orden PayPal:', error.response?.data || error.message);
      throw new BadRequestException('Error al obtener detalles de orden PayPal');
    }
  }

  /**
   * Verifica el webhook de PayPal (para eventos en tiempo real)
   */
  async verifyWebhookSignature(
    webhookId: string,
    eventBody: any,
    headers: {
      'paypal-auth-algo': string;
      'paypal-cert-url': string;
      'paypal-transmission-id': string;
      'paypal-transmission-sig': string;
      'paypal-transmission-time': string;
    }
  ): Promise<boolean> {
    const token = await this.getAccessToken();

    try {
      const response = await this.axiosInstance.post(
        '/v1/notifications/verify-webhook-signature',
        {
          auth_algo: headers['paypal-auth-algo'],
          cert_url: headers['paypal-cert-url'],
          transmission_id: headers['paypal-transmission-id'],
          transmission_sig: headers['paypal-transmission-sig'],
          transmission_time: headers['paypal-transmission-time'],
          webhook_id: webhookId,
          webhook_event: eventBody,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.verification_status === 'SUCCESS';
    } catch (error) {
      this.logger.error('Error al verificar webhook:', error.response?.data || error.message);
      return false;
    }
  }
}

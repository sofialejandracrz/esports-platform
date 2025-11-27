import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Entidades
import { TiendaOrden } from '../tienda-orden/entities/tienda-orden.entity';
import { TiendaSolicitudSoporte } from '../tienda-solicitud-soporte/entities/tienda-solicitud-soporte.entity';
import { TiendaItem } from '../tienda-item/entities/tienda-item.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

// Servicios
import { TiendaOrdenService } from '../tienda-orden/tienda-orden.service';
import { TiendaSolicitudSoporteService } from '../tienda-solicitud-soporte/tienda-solicitud-soporte.service';
import { PaypalService } from './services/paypal.service';

// Controlador
import { TiendaController } from './tienda.controller';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      TiendaOrden,
      TiendaSolicitudSoporte,
      TiendaItem,
      Usuario,
    ]),
  ],
  controllers: [TiendaController],
  providers: [
    TiendaOrdenService,
    TiendaSolicitudSoporteService,
    PaypalService,
  ],
  exports: [
    TiendaOrdenService,
    TiendaSolicitudSoporteService,
    PaypalService,
  ],
})
export class TiendaModule {}

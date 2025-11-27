import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiendaSolicitudSoporte } from './entities/tienda-solicitud-soporte.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TiendaSolicitudSoporte])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class TiendaSolicitudSoporteModule {}

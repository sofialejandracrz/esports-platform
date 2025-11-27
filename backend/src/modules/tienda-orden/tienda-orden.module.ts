import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiendaOrden } from './entities/tienda-orden.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TiendaOrden])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class TiendaOrdenModule {}

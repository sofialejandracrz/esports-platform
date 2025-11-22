import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogoOrigenTransaccionService } from './catalogo-origen-transaccion.service';
import { CatalogoOrigenTransaccionController } from './catalogo-origen-transaccion.controller';
import { CatalogoOrigenTransaccion } from './entities/catalogo-origen-transaccion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CatalogoOrigenTransaccion])],
  controllers: [CatalogoOrigenTransaccionController],
  providers: [CatalogoOrigenTransaccionService],
  exports: [CatalogoOrigenTransaccionService],
})
export class CatalogoOrigenTransaccionModule {}

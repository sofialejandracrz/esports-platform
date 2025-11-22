import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogoTransaccionTipoService } from './catalogo-transaccion-tipo.service';
import { CatalogoTransaccionTipoController } from './catalogo-transaccion-tipo.controller';
import { CatalogoTransaccionTipo } from './entities/catalogo-transaccion-tipo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CatalogoTransaccionTipo])],
  controllers: [CatalogoTransaccionTipoController],
  providers: [CatalogoTransaccionTipoService],
  exports: [CatalogoTransaccionTipoService],
})
export class CatalogoTransaccionTipoModule {}

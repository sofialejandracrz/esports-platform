import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransaccionService } from './transaccion.service';
import { TransaccionController } from './transaccion.controller';
import { Transaccion } from './entities/transaccion.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { CatalogoTransaccionTipo } from '../catalogo-transaccion-tipo/entities/catalogo-transaccion-tipo.entity';
import { CatalogoOrigenTransaccion } from '../catalogo-origen-transaccion/entities/catalogo-origen-transaccion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaccion, Usuario, CatalogoTransaccionTipo, CatalogoOrigenTransaccion])],
  controllers: [TransaccionController],
  providers: [TransaccionService],
  exports: [TransaccionService],
})
export class TransaccionModule {}

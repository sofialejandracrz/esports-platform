import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogoTipoEntradaService } from './catalogo-tipo-entrada.service';
import { CatalogoTipoEntradaController } from './catalogo-tipo-entrada.controller';
import { CatalogoTipoEntrada } from './entities/catalogo-tipo-entrada.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CatalogoTipoEntrada])],
  controllers: [CatalogoTipoEntradaController],
  providers: [CatalogoTipoEntradaService],
  exports: [CatalogoTipoEntradaService],
})
export class CatalogoTipoEntradaModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogoTipoTorneoService } from './catalogo-tipo-torneo.service';
import { CatalogoTipoTorneoController } from './catalogo-tipo-torneo.controller';
import { CatalogoTipoTorneo } from './entities/catalogo-tipo-torneo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CatalogoTipoTorneo])],
  controllers: [CatalogoTipoTorneoController],
  providers: [CatalogoTipoTorneoService],
  exports: [CatalogoTipoTorneoService],
})
export class CatalogoTipoTorneoModule {}

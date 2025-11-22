import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogoEstadoTorneoService } from './catalogo-estado-torneo.service';
import { CatalogoEstadoTorneoController } from './catalogo-estado-torneo.controller';
import { CatalogoEstadoTorneo } from './entities/catalogo-estado-torneo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CatalogoEstadoTorneo])],
  controllers: [CatalogoEstadoTorneoController],
  providers: [CatalogoEstadoTorneoService],
  exports: [CatalogoEstadoTorneoService],
})
export class CatalogoEstadoTorneoModule {}

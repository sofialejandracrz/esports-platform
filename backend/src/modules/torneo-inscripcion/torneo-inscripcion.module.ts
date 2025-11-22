import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TorneoInscripcionService } from './torneo-inscripcion.service';
import { TorneoInscripcionController } from './torneo-inscripcion.controller';
import { TorneoInscripcion } from './entities/torneo-inscripcion.entity';
import { Torneo } from '../torneo/entities/torneo.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { CatalogoEstadoInscripcion } from '../catalogo-estado-inscripcion/entities/catalogo-estado-inscripcion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    TorneoInscripcion,
    Torneo,
    Usuario,
    CatalogoEstadoInscripcion,
  ])],
  controllers: [TorneoInscripcionController],
  providers: [TorneoInscripcionService],
  exports: [TorneoInscripcionService],
})
export class TorneoInscripcionModule {}

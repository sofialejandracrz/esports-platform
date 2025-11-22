import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogoEstadoInscripcionService } from './catalogo-estado-inscripcion.service';
import { CatalogoEstadoInscripcionController } from './catalogo-estado-inscripcion.controller';
import { CatalogoEstadoInscripcion } from './entities/catalogo-estado-inscripcion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CatalogoEstadoInscripcion])],
  controllers: [CatalogoEstadoInscripcionController],
  providers: [CatalogoEstadoInscripcionService],
  exports: [CatalogoEstadoInscripcionService],
})
export class CatalogoEstadoInscripcionModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogoEstadoAmistadService } from './catalogo-estado-amistad.service';
import { CatalogoEstadoAmistadController } from './catalogo-estado-amistad.controller';
import { CatalogoEstadoAmistad } from './entities/catalogo-estado-amistad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CatalogoEstadoAmistad])],
  controllers: [CatalogoEstadoAmistadController],
  providers: [CatalogoEstadoAmistadService],
  exports: [CatalogoEstadoAmistadService],
})
export class CatalogoEstadoAmistadModule {}

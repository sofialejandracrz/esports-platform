import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogoGeneroService } from './catalogo-genero.service';
import { CatalogoGeneroController } from './catalogo-genero.controller';
import { CatalogoGenero } from './entities/catalogo-genero.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CatalogoGenero])],
  controllers: [CatalogoGeneroController],
  providers: [CatalogoGeneroService],
  exports: [CatalogoGeneroService],
})
export class CatalogoGeneroModule {}

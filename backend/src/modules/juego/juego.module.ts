import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JuegoService } from './juego.service';
import { JuegoController } from './juego.controller';
import { Juego } from './entities/juego.entity';
import { CatalogoPlataforma } from '../catalogo-plataforma/entities/catalogo-plataforma.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Juego, CatalogoPlataforma])],
  controllers: [JuegoController],
  providers: [JuegoService],
  exports: [JuegoService],
})
export class JuegoModule {}

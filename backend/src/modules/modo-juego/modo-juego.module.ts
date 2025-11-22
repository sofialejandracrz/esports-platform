import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModoJuegoService } from './modo-juego.service';
import { ModoJuegoController } from './modo-juego.controller';
import { ModoJuego } from './entities/modo-juego.entity';
import { Juego } from '../juego/entities/juego.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ModoJuego, Juego])],
  controllers: [ModoJuegoController],
  providers: [ModoJuegoService],
  exports: [ModoJuegoService],
})
export class ModoJuegoModule {}

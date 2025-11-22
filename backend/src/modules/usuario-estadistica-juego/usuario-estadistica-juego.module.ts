import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEstadisticaJuegoService } from './usuario-estadistica-juego.service';
import { UsuarioEstadisticaJuegoController } from './usuario-estadistica-juego.controller';
import { UsuarioEstadisticaJuego } from './entities/usuario-estadistica-juego.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Juego } from '../juego/entities/juego.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEstadisticaJuego, Usuario, Juego])],
  controllers: [UsuarioEstadisticaJuegoController],
  providers: [UsuarioEstadisticaJuegoService],
  exports: [UsuarioEstadisticaJuegoService],
})
export class UsuarioEstadisticaJuegoModule {}

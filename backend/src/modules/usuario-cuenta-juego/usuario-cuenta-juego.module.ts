import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioCuentaJuegoService } from './usuario-cuenta-juego.service';
import { UsuarioCuentaJuegoController } from './usuario-cuenta-juego.controller';
import { UsuarioCuentaJuego } from './entities/usuario-cuenta-juego.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { CatalogoPlataforma } from '../catalogo-plataforma/entities/catalogo-plataforma.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioCuentaJuego, Usuario, CatalogoPlataforma])],
  controllers: [UsuarioCuentaJuegoController],
  providers: [UsuarioCuentaJuegoService],
  exports: [UsuarioCuentaJuegoService],
})
export class UsuarioCuentaJuegoModule {}

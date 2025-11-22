import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioAmigosService } from './usuario-amigos.service';
import { UsuarioAmigosController } from './usuario-amigos.controller';
import { UsuarioAmigos } from './entities/usuario-amigo.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { CatalogoEstadoAmistad } from '../catalogo-estado-amistad/entities/catalogo-estado-amistad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioAmigos, Usuario, CatalogoEstadoAmistad])],
  controllers: [UsuarioAmigosController],
  providers: [UsuarioAmigosService],
  exports: [UsuarioAmigosService],
})
export class UsuarioAmigosModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioSeguidoresService } from './usuario-seguidores.service';
import { UsuarioSeguidoresController } from './usuario-seguidores.controller';
import { UsuarioSeguidores } from './entities/usuario-seguidore.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioSeguidores, Usuario])],
  controllers: [UsuarioSeguidoresController],
  providers: [UsuarioSeguidoresService],
  exports: [UsuarioSeguidoresService],
})
export class UsuarioSeguidoresModule {}

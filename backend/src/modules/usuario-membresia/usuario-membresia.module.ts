import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioMembresiaService } from './usuario-membresia.service';
import { UsuarioMembresiaController } from './usuario-membresia.controller';
import { UsuarioMembresia } from './entities/usuario-membresia.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { MembresiaTipo } from '../membresia-tipo/entities/membresia-tipo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioMembresia, Usuario, MembresiaTipo])],
  controllers: [UsuarioMembresiaController],
  providers: [UsuarioMembresiaService],
  exports: [UsuarioMembresiaService],
})
export class UsuarioMembresiaModule {}

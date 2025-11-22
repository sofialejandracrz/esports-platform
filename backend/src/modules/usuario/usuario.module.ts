import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { Usuario } from './entities/usuario.entity';
import { Persona } from '../persona/entities/persona.entity';
import { CatalogoRol } from '../catalogo-rol/entities/catalogo-rol.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Persona, CatalogoRol])],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService],
})
export class UsuarioModule {}

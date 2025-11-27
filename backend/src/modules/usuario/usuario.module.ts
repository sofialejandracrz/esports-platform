import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { PerfilUsuarioService } from './perfil-usuario.service';
import { PerfilUsuarioController } from './perfil-usuario.controller';
import { ConfiguracionUsuarioService } from './configuracion-usuario.service';
import { ConfiguracionUsuarioController } from './configuracion-usuario.controller';
import { Usuario } from './entities/usuario.entity';
import { Persona } from '../persona/entities/persona.entity';
import { CatalogoRol } from '../catalogo-rol/entities/catalogo-rol.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Persona, CatalogoRol])],
  controllers: [
    // IMPORTANTE: ConfiguracionUsuarioController debe ir ANTES que UsuarioController
    // para que las rutas /usuario/configuracion/* no sean capturadas por /usuario/:id
    ConfiguracionUsuarioController,
    PerfilUsuarioController,
    UsuarioController,
  ],
  providers: [
    UsuarioService,
    PerfilUsuarioService,
    ConfiguracionUsuarioService,
  ],
  exports: [
    UsuarioService,
    PerfilUsuarioService,
    ConfiguracionUsuarioService,
  ],
})
export class UsuarioModule {}

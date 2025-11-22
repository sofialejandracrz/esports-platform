import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioTrofeoService } from './usuario-trofeo.service';
import { UsuarioTrofeoController } from './usuario-trofeo.controller';
import { UsuarioTrofeo } from './entities/usuario-trofeo.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Torneo } from '../torneo/entities/torneo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioTrofeo, Usuario, Torneo])],
  controllers: [UsuarioTrofeoController],
  providers: [UsuarioTrofeoService],
  exports: [UsuarioTrofeoService],
})
export class UsuarioTrofeoModule {}

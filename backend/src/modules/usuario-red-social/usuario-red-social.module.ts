import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioRedSocialService } from './usuario-red-social.service';
import { UsuarioRedSocialController } from './usuario-red-social.controller';
import { UsuarioRedSocial } from './entities/usuario-red-social.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioRedSocial, Usuario])],
  controllers: [UsuarioRedSocialController],
  providers: [UsuarioRedSocialService],
  exports: [UsuarioRedSocialService],
})
export class UsuarioRedSocialModule {}

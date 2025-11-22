import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioLogroService } from './usuario-logro.service';
import { UsuarioLogroController } from './usuario-logro.controller';
import { UsuarioLogro } from './entities/usuario-logro.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Logro } from '../logro/entities/logro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioLogro, Usuario, Logro])],
  controllers: [UsuarioLogroController],
  providers: [UsuarioLogroService],
  exports: [UsuarioLogroService],
})
export class UsuarioLogroModule {}

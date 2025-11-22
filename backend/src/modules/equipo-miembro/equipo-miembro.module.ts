import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipoMiembroService } from './equipo-miembro.service';
import { EquipoMiembroController } from './equipo-miembro.controller';
import { EquipoMiembro } from './entities/equipo-miembro.entity';
import { Equipo } from '../equipo/entities/equipo.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EquipoMiembro, Equipo, Usuario])],
  controllers: [EquipoMiembroController],
  providers: [EquipoMiembroService],
  exports: [EquipoMiembroService],
})
export class EquipoMiembroModule {}

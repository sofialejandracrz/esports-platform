import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TorneoResultadoService } from './torneo-resultado.service';
import { TorneoResultadoController } from './torneo-resultado.controller';
import { TorneoResultado } from './entities/torneo-resultado.entity';
import { Torneo } from '../torneo/entities/torneo.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TorneoResultado, Torneo, Usuario])],
  controllers: [TorneoResultadoController],
  providers: [TorneoResultadoService],
  exports: [TorneoResultadoService],
})
export class TorneoResultadoModule {}

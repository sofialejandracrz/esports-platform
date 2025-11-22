import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TorneoPremioService } from './torneo-premio.service';
import { TorneoPremioController } from './torneo-premio.controller';
import { TorneoPremio } from './entities/torneo-premio.entity';
import { Torneo } from '../torneo/entities/torneo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TorneoPremio, Torneo])],
  controllers: [TorneoPremioController],
  providers: [TorneoPremioService],
  exports: [TorneoPremioService],
})
export class TorneoPremioModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TorneoRedService } from './torneo-red.service';
import { TorneoRedController } from './torneo-red.controller';
import { TorneoRed } from './entities/torneo-red.entity';
import { Torneo } from '../torneo/entities/torneo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TorneoRed, Torneo])],
  controllers: [TorneoRedController],
  providers: [TorneoRedService],
  exports: [TorneoRedService],
})
export class TorneoRedModule {}

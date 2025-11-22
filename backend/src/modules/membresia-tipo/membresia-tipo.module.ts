import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembresiaTipoService } from './membresia-tipo.service';
import { MembresiaTipoController } from './membresia-tipo.controller';
import { MembresiaTipo } from './entities/membresia-tipo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MembresiaTipo])],
  controllers: [MembresiaTipoController],
  providers: [MembresiaTipoService],
  exports: [MembresiaTipoService],
})
export class MembresiaTipoModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonaService } from './persona.service';
import { PersonaController } from './persona.controller';
import { Persona } from './entities/persona.entity';
import { CatalogoGenero } from '../catalogo-genero/entities/catalogo-genero.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Persona, CatalogoGenero])],
  controllers: [PersonaController],
  providers: [PersonaService],
  exports: [PersonaService],
})
export class PersonaModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TorneoService } from './torneo.service';
import { TorneoController } from './torneo.controller';
import { Torneo } from './entities/torneo.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Juego } from '../juego/entities/juego.entity';
import { CatalogoPlataforma } from '../catalogo-plataforma/entities/catalogo-plataforma.entity';
import { ModoJuego } from '../modo-juego/entities/modo-juego.entity';
import { CatalogoRegion } from '../catalogo-region/entities/catalogo-region.entity';
import { CatalogoTipoEntrada } from '../catalogo-tipo-entrada/entities/catalogo-tipo-entrada.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Torneo, Usuario, Juego, CatalogoPlataforma, ModoJuego, CatalogoRegion, CatalogoTipoEntrada])],
  controllers: [TorneoController],
  providers: [TorneoService],
  exports: [TorneoService],
})
export class TorneoModule {}

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTorneoDto } from './dto/create-torneo.dto';
import { UpdateTorneoDto } from './dto/update-torneo.dto';
import { Torneo } from './entities/torneo.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Juego } from '../juego/entities/juego.entity';
import { CatalogoPlataforma } from '../catalogo-plataforma/entities/catalogo-plataforma.entity';
import { ModoJuego } from '../modo-juego/entities/modo-juego.entity';
import { CatalogoRegion } from '../catalogo-region/entities/catalogo-region.entity';
import { CatalogoTipoEntrada } from '../catalogo-tipo-entrada/entities/catalogo-tipo-entrada.entity';

@Injectable()
export class TorneoService {
  constructor(
    @InjectRepository(Torneo)
    private readonly torneoRepository: Repository<Torneo>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Juego)
    private readonly juegoRepository: Repository<Juego>,
    @InjectRepository(CatalogoPlataforma)
    private readonly plataformaRepository: Repository<CatalogoPlataforma>,
    @InjectRepository(ModoJuego)
    private readonly modoJuegoRepository: Repository<ModoJuego>,
    @InjectRepository(CatalogoRegion)
    private readonly regionRepository: Repository<CatalogoRegion>,
    @InjectRepository(CatalogoTipoEntrada)
    private readonly tipoEntradaRepository: Repository<CatalogoTipoEntrada>,
  ) {}

  async create(createTorneoDto: CreateTorneoDto): Promise<Torneo> {
    const {
      anfitrionId,
      juegoId,
      plataformaId,
      modoJuegoId,
      regionId,
      tipoEntradaId,
      ...torneoData
    } = createTorneoDto;

    const anfitrion = await this.usuarioRepository.findOne({
      where: { id: anfitrionId },
    });
    if (!anfitrion) {
      throw new BadRequestException(`Usuario con ID ${anfitrionId} no encontrado`);
    }

    const juego = await this.juegoRepository.findOne({
      where: { id: juegoId },
    });
    if (!juego) {
      throw new BadRequestException(`Juego con ID ${juegoId} no encontrado`);
    }

    const plataforma = await this.plataformaRepository.findOne({
      where: { id: plataformaId },
    });
    if (!plataforma) {
      throw new BadRequestException(`Plataforma con ID ${plataformaId} no encontrada`);
    }

    const modoJuego = await this.modoJuegoRepository.findOne({
      where: { id: modoJuegoId },
    });
    if (!modoJuego) {
      throw new BadRequestException(`Modo de juego con ID ${modoJuegoId} no encontrado`);
    }

    const region = await this.regionRepository.findOne({
      where: { id: regionId },
    });
    if (!region) {
      throw new BadRequestException(`Región con ID ${regionId} no encontrada`);
    }

    const tipoEntrada = await this.tipoEntradaRepository.findOne({
      where: { id: tipoEntradaId },
    });
    if (!tipoEntrada) {
      throw new BadRequestException(`Tipo de entrada con ID ${tipoEntradaId} no encontrado`);
    }

    const torneo = this.torneoRepository.create({
      ...torneoData,
      anfitrion,
      juego,
      plataforma,
      modoJuego,
      region,
      tipoEntrada,
    });

    return await this.torneoRepository.save(torneo);
  }

  async findAll(): Promise<Torneo[]> {
    return await this.torneoRepository.find({
      relations: ['anfitrion', 'juego', 'plataforma', 'modoJuego', 'region', 'tipoEntrada'],
      order: { fechaInicioTorneo: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Torneo> {
    const torneo = await this.torneoRepository.findOne({
      where: { id },
      relations: ['anfitrion', 'juego', 'plataforma', 'modoJuego', 'region', 'tipoEntrada'],
    });

    if (!torneo) {
      throw new NotFoundException(`Torneo con ID ${id} no encontrado`);
    }

    return torneo;
  }

  async update(id: string, updateTorneoDto: UpdateTorneoDto): Promise<Torneo> {
    const torneo = await this.findOne(id);

    const {
      anfitrionId,
      juegoId,
      plataformaId,
      modoJuegoId,
      regionId,
      tipoEntradaId,
      ...torneoData
    } = updateTorneoDto;

    if (anfitrionId) {
      const anfitrion = await this.usuarioRepository.findOne({
        where: { id: anfitrionId },
      });
      if (!anfitrion) {
        throw new BadRequestException(`Usuario con ID ${anfitrionId} no encontrado`);
      }
      torneo.anfitrion = anfitrion;
    }

    if (juegoId) {
      const juego = await this.juegoRepository.findOne({
        where: { id: juegoId },
      });
      if (!juego) {
        throw new BadRequestException(`Juego con ID ${juegoId} no encontrado`);
      }
      torneo.juego = juego;
    }

    if (plataformaId) {
      const plataforma = await this.plataformaRepository.findOne({
        where: { id: plataformaId },
      });
      if (!plataforma) {
        throw new BadRequestException(`Plataforma con ID ${plataformaId} no encontrada`);
      }
      torneo.plataforma = plataforma;
    }

    if (modoJuegoId) {
      const modoJuego = await this.modoJuegoRepository.findOne({
        where: { id: modoJuegoId },
      });
      if (!modoJuego) {
        throw new BadRequestException(`Modo de juego con ID ${modoJuegoId} no encontrado`);
      }
      torneo.modoJuego = modoJuego;
    }

    if (regionId) {
      const region = await this.regionRepository.findOne({
        where: { id: regionId },
      });
      if (!region) {
        throw new BadRequestException(`Región con ID ${regionId} no encontrada`);
      }
      torneo.region = region;
    }

    if (tipoEntradaId) {
      const tipoEntrada = await this.tipoEntradaRepository.findOne({
        where: { id: tipoEntradaId },
      });
      if (!tipoEntrada) {
        throw new BadRequestException(`Tipo de entrada con ID ${tipoEntradaId} no encontrado`);
      }
      torneo.tipoEntrada = tipoEntrada;
    }

    Object.assign(torneo, torneoData);
    return await this.torneoRepository.save(torneo);
  }

  async remove(id: string): Promise<void> {
    const torneo = await this.findOne(id);
    await this.torneoRepository.remove(torneo);
  }
}

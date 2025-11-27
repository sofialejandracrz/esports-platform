import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCatalogoTipoTorneoDto } from './dto/create-catalogo-tipo-torneo.dto';
import { UpdateCatalogoTipoTorneoDto } from './dto/update-catalogo-tipo-torneo.dto';
import { CatalogoTipoTorneo } from './entities/catalogo-tipo-torneo.entity';

@Injectable()
export class CatalogoTipoTorneoService {
  constructor(
    @InjectRepository(CatalogoTipoTorneo)
    private readonly catalogoTipoTorneoRepository: Repository<CatalogoTipoTorneo>,
  ) {}

  async create(createCatalogoTipoTorneoDto: CreateCatalogoTipoTorneoDto): Promise<CatalogoTipoTorneo> {
    const existing = await this.catalogoTipoTorneoRepository.findOne({
      where: { valor: createCatalogoTipoTorneoDto.valor },
    });

    if (existing) {
      throw new ConflictException('Ya existe un tipo de torneo con ese valor');
    }

    const catalogoTipoTorneo = this.catalogoTipoTorneoRepository.create(createCatalogoTipoTorneoDto);
    return await this.catalogoTipoTorneoRepository.save(catalogoTipoTorneo);
  }

  async findAll(): Promise<CatalogoTipoTorneo[]> {
    return await this.catalogoTipoTorneoRepository.find({
      order: { creadoEn: 'ASC' },
    });
  }

  async findOne(id: string): Promise<CatalogoTipoTorneo> {
    const catalogoTipoTorneo = await this.catalogoTipoTorneoRepository.findOne({
      where: { id },
    });

    if (!catalogoTipoTorneo) {
      throw new NotFoundException(`Tipo de torneo con ID ${id} no encontrado`);
    }

    return catalogoTipoTorneo;
  }

  async findByValor(valor: string): Promise<CatalogoTipoTorneo> {
    const catalogoTipoTorneo = await this.catalogoTipoTorneoRepository.findOne({
      where: { valor },
    });

    if (!catalogoTipoTorneo) {
      throw new NotFoundException(`Tipo de torneo con valor ${valor} no encontrado`);
    }

    return catalogoTipoTorneo;
  }

  async update(id: string, updateCatalogoTipoTorneoDto: UpdateCatalogoTipoTorneoDto): Promise<CatalogoTipoTorneo> {
    const catalogoTipoTorneo = await this.findOne(id);

    if (updateCatalogoTipoTorneoDto.valor) {
      const existing = await this.catalogoTipoTorneoRepository.findOne({
        where: { valor: updateCatalogoTipoTorneoDto.valor },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Ya existe un tipo de torneo con ese valor');
      }
    }

    Object.assign(catalogoTipoTorneo, updateCatalogoTipoTorneoDto);
    return await this.catalogoTipoTorneoRepository.save(catalogoTipoTorneo);
  }

  async remove(id: string): Promise<void> {
    const catalogoTipoTorneo = await this.findOne(id);
    await this.catalogoTipoTorneoRepository.remove(catalogoTipoTorneo);
  }
}

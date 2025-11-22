import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCatalogoEstadoTorneoDto } from './dto/create-catalogo-estado-torneo.dto';
import { UpdateCatalogoEstadoTorneoDto } from './dto/update-catalogo-estado-torneo.dto';
import { CatalogoEstadoTorneo } from './entities/catalogo-estado-torneo.entity';

@Injectable()
export class CatalogoEstadoTorneoService {
  constructor(
    @InjectRepository(CatalogoEstadoTorneo)
    private readonly catalogoEstadoTorneoRepository: Repository<CatalogoEstadoTorneo>,
  ) {}

  async create(createCatalogoEstadoTorneoDto: CreateCatalogoEstadoTorneoDto): Promise<CatalogoEstadoTorneo> {
    const existing = await this.catalogoEstadoTorneoRepository.findOne({
      where: { valor: createCatalogoEstadoTorneoDto.valor },
    });

    if (existing) {
      throw new ConflictException('Ya existe un estado de torneo con ese valor');
    }

    const catalogoEstadoTorneo = this.catalogoEstadoTorneoRepository.create(createCatalogoEstadoTorneoDto);
    return await this.catalogoEstadoTorneoRepository.save(catalogoEstadoTorneo);
  }

  async findAll(): Promise<CatalogoEstadoTorneo[]> {
    return await this.catalogoEstadoTorneoRepository.find({
      order: { creadoEn: 'ASC' },
    });
  }

  async findOne(id: string): Promise<CatalogoEstadoTorneo> {
    const catalogoEstadoTorneo = await this.catalogoEstadoTorneoRepository.findOne({
      where: { id },
    });

    if (!catalogoEstadoTorneo) {
      throw new NotFoundException(`Estado de torneo con ID ${id} no encontrado`);
    }

    return catalogoEstadoTorneo;
  }

  async update(id: string, updateCatalogoEstadoTorneoDto: UpdateCatalogoEstadoTorneoDto): Promise<CatalogoEstadoTorneo> {
    const catalogoEstadoTorneo = await this.findOne(id);

    if (updateCatalogoEstadoTorneoDto.valor) {
      const existing = await this.catalogoEstadoTorneoRepository.findOne({
        where: { valor: updateCatalogoEstadoTorneoDto.valor },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Ya existe un estado de torneo con ese valor');
      }
    }

    Object.assign(catalogoEstadoTorneo, updateCatalogoEstadoTorneoDto);
    return await this.catalogoEstadoTorneoRepository.save(catalogoEstadoTorneo);
  }

  async remove(id: string): Promise<void> {
    const catalogoEstadoTorneo = await this.findOne(id);
    await this.catalogoEstadoTorneoRepository.remove(catalogoEstadoTorneo);
  }
}

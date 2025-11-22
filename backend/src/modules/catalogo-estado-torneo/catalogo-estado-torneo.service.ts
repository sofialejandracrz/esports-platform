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
    try {
      const catalogoEstadoTorneo = this.catalogoEstadoTorneoRepository.create(createCatalogoEstadoTorneoDto);
      return await this.catalogoEstadoTorneoRepository.save(catalogoEstadoTorneo);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El valor ya existe');
      }
      throw error;
    }
  }

  async findAll(): Promise<CatalogoEstadoTorneo[]> {
    return await this.catalogoEstadoTorneoRepository.find({
      order: { creadoEn: 'DESC' },
    });
  }

  async findOne(id: string): Promise<CatalogoEstadoTorneo> {
    const catalogoEstadoTorneo = await this.catalogoEstadoTorneoRepository.findOne({
      where: { id },
    });
    
    if (!catalogoEstadoTorneo) {
      throw new NotFoundException(`Catálogo de estado de torneo con ID ${id} no encontrado`);
    }
    
    return catalogoEstadoTorneo;
  }

  async update(id: string, updateCatalogoEstadoTorneoDto: UpdateCatalogoEstadoTorneoDto): Promise<CatalogoEstadoTorneo> {
    const catalogoEstadoTorneo = await this.findOne(id);
    
    try {
      Object.assign(catalogoEstadoTorneo, updateCatalogoEstadoTorneoDto);
      return await this.catalogoEstadoTorneoRepository.save(catalogoEstadoTorneo);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El valor ya existe');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const catalogoEstadoTorneo = await this.findOne(id);
    await this.catalogoEstadoTorneoRepository.remove(catalogoEstadoTorneo);
  }
}

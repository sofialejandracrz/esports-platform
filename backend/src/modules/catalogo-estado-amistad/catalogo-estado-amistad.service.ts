import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCatalogoEstadoAmistadDto } from './dto/create-catalogo-estado-amistad.dto';
import { UpdateCatalogoEstadoAmistadDto } from './dto/update-catalogo-estado-amistad.dto';
import { CatalogoEstadoAmistad } from './entities/catalogo-estado-amistad.entity';

@Injectable()
export class CatalogoEstadoAmistadService {
  constructor(
    @InjectRepository(CatalogoEstadoAmistad)
    private readonly catalogoEstadoAmistadRepository: Repository<CatalogoEstadoAmistad>,
  ) {}

  async create(createCatalogoEstadoAmistadDto: CreateCatalogoEstadoAmistadDto): Promise<CatalogoEstadoAmistad> {
    try {
      const catalogoEstadoAmistad = this.catalogoEstadoAmistadRepository.create(createCatalogoEstadoAmistadDto);
      return await this.catalogoEstadoAmistadRepository.save(catalogoEstadoAmistad);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El valor ya existe');
      }
      throw error;
    }
  }

  async findAll(): Promise<CatalogoEstadoAmistad[]> {
    return await this.catalogoEstadoAmistadRepository.find({
      order: { creadoEn: 'DESC' },
    });
  }

  async findOne(id: string): Promise<CatalogoEstadoAmistad> {
    const catalogoEstadoAmistad = await this.catalogoEstadoAmistadRepository.findOne({
      where: { id },
    });
    
    if (!catalogoEstadoAmistad) {
      throw new NotFoundException(`Catálogo de estado de amistad con ID ${id} no encontrado`);
    }
    
    return catalogoEstadoAmistad;
  }

  async update(id: string, updateCatalogoEstadoAmistadDto: UpdateCatalogoEstadoAmistadDto): Promise<CatalogoEstadoAmistad> {
    const catalogoEstadoAmistad = await this.findOne(id);
    
    try {
      Object.assign(catalogoEstadoAmistad, updateCatalogoEstadoAmistadDto);
      return await this.catalogoEstadoAmistadRepository.save(catalogoEstadoAmistad);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El valor ya existe');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const catalogoEstadoAmistad = await this.findOne(id);
    await this.catalogoEstadoAmistadRepository.remove(catalogoEstadoAmistad);
  }
}

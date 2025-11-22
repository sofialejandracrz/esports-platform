import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCatalogoEstadoInscripcionDto } from './dto/create-catalogo-estado-inscripcion.dto';
import { UpdateCatalogoEstadoInscripcionDto } from './dto/update-catalogo-estado-inscripcion.dto';
import { CatalogoEstadoInscripcion } from './entities/catalogo-estado-inscripcion.entity';

@Injectable()
export class CatalogoEstadoInscripcionService {
  constructor(
    @InjectRepository(CatalogoEstadoInscripcion)
    private readonly catalogoEstadoInscripcionRepository: Repository<CatalogoEstadoInscripcion>,
  ) {}

  async create(createCatalogoEstadoInscripcionDto: CreateCatalogoEstadoInscripcionDto): Promise<CatalogoEstadoInscripcion> {
    try {
      const catalogoEstadoInscripcion = this.catalogoEstadoInscripcionRepository.create(createCatalogoEstadoInscripcionDto);
      return await this.catalogoEstadoInscripcionRepository.save(catalogoEstadoInscripcion);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El valor ya existe');
      }
      throw error;
    }
  }

  async findAll(): Promise<CatalogoEstadoInscripcion[]> {
    return await this.catalogoEstadoInscripcionRepository.find({
      order: { creadoEn: 'DESC' },
    });
  }

  async findOne(id: string): Promise<CatalogoEstadoInscripcion> {
    const catalogoEstadoInscripcion = await this.catalogoEstadoInscripcionRepository.findOne({
      where: { id },
    });
    
    if (!catalogoEstadoInscripcion) {
      throw new NotFoundException(`Catálogo de estado de inscripción con ID ${id} no encontrado`);
    }
    
    return catalogoEstadoInscripcion;
  }

  async update(id: string, updateCatalogoEstadoInscripcionDto: UpdateCatalogoEstadoInscripcionDto): Promise<CatalogoEstadoInscripcion> {
    const catalogoEstadoInscripcion = await this.findOne(id);
    
    try {
      Object.assign(catalogoEstadoInscripcion, updateCatalogoEstadoInscripcionDto);
      return await this.catalogoEstadoInscripcionRepository.save(catalogoEstadoInscripcion);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El valor ya existe');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const catalogoEstadoInscripcion = await this.findOne(id);
    await this.catalogoEstadoInscripcionRepository.remove(catalogoEstadoInscripcion);
  }
}

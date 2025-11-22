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
    // Verificar si ya existe un estado con el mismo valor
    const existing = await this.catalogoEstadoAmistadRepository.findOne({
      where: { valor: createCatalogoEstadoAmistadDto.valor },
    });

    if (existing) {
      throw new ConflictException('Ya existe un estado de amistad con ese valor');
    }

    const catalogoEstadoAmistad = this.catalogoEstadoAmistadRepository.create(createCatalogoEstadoAmistadDto);
    return await this.catalogoEstadoAmistadRepository.save(catalogoEstadoAmistad);
  }

  async findAll(): Promise<CatalogoEstadoAmistad[]> {
    return await this.catalogoEstadoAmistadRepository.find({
      order: { creadoEn: 'ASC' },
    });
  }

  async findOne(id: string): Promise<CatalogoEstadoAmistad> {
    const catalogoEstadoAmistad = await this.catalogoEstadoAmistadRepository.findOne({
      where: { id },
    });

    if (!catalogoEstadoAmistad) {
      throw new NotFoundException(`Estado de amistad con ID ${id} no encontrado`);
    }

    return catalogoEstadoAmistad;
  }

  async update(id: string, updateCatalogoEstadoAmistadDto: UpdateCatalogoEstadoAmistadDto): Promise<CatalogoEstadoAmistad> {
    const catalogoEstadoAmistad = await this.findOne(id);

    // Verificar si el nuevo valor ya existe en otro registro
    if (updateCatalogoEstadoAmistadDto.valor) {
      const existing = await this.catalogoEstadoAmistadRepository.findOne({
        where: { valor: updateCatalogoEstadoAmistadDto.valor },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Ya existe un estado de amistad con ese valor');
      }
    }

    Object.assign(catalogoEstadoAmistad, updateCatalogoEstadoAmistadDto);
    return await this.catalogoEstadoAmistadRepository.save(catalogoEstadoAmistad);
  }

  async remove(id: string): Promise<void> {
    const catalogoEstadoAmistad = await this.findOne(id);
    await this.catalogoEstadoAmistadRepository.remove(catalogoEstadoAmistad);
  }
}

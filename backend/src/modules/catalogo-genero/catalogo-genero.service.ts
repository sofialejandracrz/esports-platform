import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCatalogoGeneroDto } from './dto/create-catalogo-genero.dto';
import { UpdateCatalogoGeneroDto } from './dto/update-catalogo-genero.dto';
import { CatalogoGenero } from './entities/catalogo-genero.entity';

@Injectable()
export class CatalogoGeneroService {
  constructor(
    @InjectRepository(CatalogoGenero)
    private readonly catalogoGeneroRepository: Repository<CatalogoGenero>,
  ) {}

  async create(createCatalogoGeneroDto: CreateCatalogoGeneroDto): Promise<CatalogoGenero> {
    try {
      const catalogoGenero = this.catalogoGeneroRepository.create(createCatalogoGeneroDto);
      return await this.catalogoGeneroRepository.save(catalogoGenero);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El valor ya existe');
      }
      throw error;
    }
  }

  async findAll(): Promise<CatalogoGenero[]> {
    return await this.catalogoGeneroRepository.find({
      order: { valor: 'ASC' },
    });
  }

  async findOne(id: string): Promise<CatalogoGenero> {
    const catalogoGenero = await this.catalogoGeneroRepository.findOne({ where: { id } });

    if (!catalogoGenero) {
      throw new NotFoundException(`Catálogo género con id ${id} no encontrado`);
    }

    return catalogoGenero;
  }

  async update(id: string, updateCatalogoGeneroDto: UpdateCatalogoGeneroDto): Promise<CatalogoGenero> {
    const catalogoGenero = await this.findOne(id);

    try {
      Object.assign(catalogoGenero, updateCatalogoGeneroDto);
      return await this.catalogoGeneroRepository.save(catalogoGenero);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El valor ya existe');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const catalogoGenero = await this.findOne(id);
    await this.catalogoGeneroRepository.remove(catalogoGenero);
  }
}

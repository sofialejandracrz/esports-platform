import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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
    const existing = await this.catalogoGeneroRepository.findOne({
      where: { valor: createCatalogoGeneroDto.valor },
    });

    if (existing) {
      throw new ConflictException('Ya existe un género con ese valor');
    }

    const catalogoGenero = this.catalogoGeneroRepository.create(createCatalogoGeneroDto);
    return await this.catalogoGeneroRepository.save(catalogoGenero);
  }

  async findAll(): Promise<CatalogoGenero[]> {
    return await this.catalogoGeneroRepository.find({
      order: { creadoEn: 'ASC' },
    });
  }

  async findOne(id: string): Promise<CatalogoGenero> {
    const catalogoGenero = await this.catalogoGeneroRepository.findOne({
      where: { id },
    });

    if (!catalogoGenero) {
      throw new NotFoundException(`Género con ID ${id} no encontrado`);
    }

    return catalogoGenero;
  }

  async update(id: string, updateCatalogoGeneroDto: UpdateCatalogoGeneroDto): Promise<CatalogoGenero> {
    const catalogoGenero = await this.findOne(id);

    if (updateCatalogoGeneroDto.valor) {
      const existing = await this.catalogoGeneroRepository.findOne({
        where: { valor: updateCatalogoGeneroDto.valor },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Ya existe un género con ese valor');
      }
    }

    Object.assign(catalogoGenero, updateCatalogoGeneroDto);
    return await this.catalogoGeneroRepository.save(catalogoGenero);
  }

  async remove(id: string): Promise<void> {
    const catalogoGenero = await this.findOne(id);
    await this.catalogoGeneroRepository.remove(catalogoGenero);
  }
}

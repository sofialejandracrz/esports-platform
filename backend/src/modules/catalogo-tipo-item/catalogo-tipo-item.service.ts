import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCatalogoTipoItemDto } from './dto/create-catalogo-tipo-item.dto';
import { UpdateCatalogoTipoItemDto } from './dto/update-catalogo-tipo-item.dto';
import { CatalogoTipoItem } from './entities/catalogo-tipo-item.entity';

@Injectable()
export class CatalogoTipoItemService {
  constructor(
    @InjectRepository(CatalogoTipoItem)
    private readonly catalogoTipoItemRepository: Repository<CatalogoTipoItem>,
  ) {}

  async create(createCatalogoTipoItemDto: CreateCatalogoTipoItemDto): Promise<CatalogoTipoItem> {
    try {
      const catalogoTipoItem = this.catalogoTipoItemRepository.create(createCatalogoTipoItemDto);
      return await this.catalogoTipoItemRepository.save(catalogoTipoItem);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El valor ya existe');
      }
      throw error;
    }
  }

  async findAll(): Promise<CatalogoTipoItem[]> {
    return await this.catalogoTipoItemRepository.find({
      order: { creadoEn: 'DESC' },
    });
  }

  async findOne(id: string): Promise<CatalogoTipoItem> {
    const catalogoTipoItem = await this.catalogoTipoItemRepository.findOne({
      where: { id },
    });
    
    if (!catalogoTipoItem) {
      throw new NotFoundException(`Catálogo de tipo de item con ID ${id} no encontrado`);
    }
    
    return catalogoTipoItem;
  }

  async update(id: string, updateCatalogoTipoItemDto: UpdateCatalogoTipoItemDto): Promise<CatalogoTipoItem> {
    const catalogoTipoItem = await this.findOne(id);
    
    try {
      Object.assign(catalogoTipoItem, updateCatalogoTipoItemDto);
      return await this.catalogoTipoItemRepository.save(catalogoTipoItem);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El valor ya existe');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const catalogoTipoItem = await this.findOne(id);
    await this.catalogoTipoItemRepository.remove(catalogoTipoItem);
  }
}

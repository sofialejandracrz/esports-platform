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
    const existing = await this.catalogoTipoItemRepository.findOne({
      where: { valor: createCatalogoTipoItemDto.valor },
    });

    if (existing) {
      throw new ConflictException('Ya existe un tipo de item con ese valor');
    }

    const catalogoTipoItem = this.catalogoTipoItemRepository.create(createCatalogoTipoItemDto);
    return await this.catalogoTipoItemRepository.save(catalogoTipoItem);
  }

  async findAll(): Promise<CatalogoTipoItem[]> {
    return await this.catalogoTipoItemRepository.find({
      order: { creadoEn: 'ASC' },
    });
  }

  async findOne(id: string): Promise<CatalogoTipoItem> {
    const catalogoTipoItem = await this.catalogoTipoItemRepository.findOne({
      where: { id },
    });

    if (!catalogoTipoItem) {
      throw new NotFoundException(`Tipo de item con ID ${id} no encontrado`);
    }

    return catalogoTipoItem;
  }

  async update(id: string, updateCatalogoTipoItemDto: UpdateCatalogoTipoItemDto): Promise<CatalogoTipoItem> {
    const catalogoTipoItem = await this.findOne(id);

    if (updateCatalogoTipoItemDto.valor) {
      const existing = await this.catalogoTipoItemRepository.findOne({
        where: { valor: updateCatalogoTipoItemDto.valor },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Ya existe un tipo de item con ese valor');
      }
    }

    Object.assign(catalogoTipoItem, updateCatalogoTipoItemDto);
    return await this.catalogoTipoItemRepository.save(catalogoTipoItem);
  }

  async remove(id: string): Promise<void> {
    const catalogoTipoItem = await this.findOne(id);
    await this.catalogoTipoItemRepository.remove(catalogoTipoItem);
  }
}

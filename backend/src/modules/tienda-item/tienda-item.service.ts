import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTiendaItemDto } from './dto/create-tienda-item.dto';
import { UpdateTiendaItemDto } from './dto/update-tienda-item.dto';
import { TiendaItem } from './entities/tienda-item.entity';
import { CatalogoTipoItem } from '../catalogo-tipo-item/entities/catalogo-tipo-item.entity';

@Injectable()
export class TiendaItemService {
  constructor(
    @InjectRepository(TiendaItem)
    private readonly tiendaItemRepository: Repository<TiendaItem>,
    @InjectRepository(CatalogoTipoItem)
    private readonly tipoItemRepository: Repository<CatalogoTipoItem>,
  ) {}

  async create(createTiendaItemDto: CreateTiendaItemDto): Promise<TiendaItem> {
    const { tipoId, ...itemData } = createTiendaItemDto;

    const tipo = await this.tipoItemRepository.findOne({
      where: { id: tipoId },
    });

    if (!tipo) {
      throw new BadRequestException(`Tipo de item con ID ${tipoId} no encontrado`);
    }

    const tiendaItem = this.tiendaItemRepository.create({
      ...itemData,
      tipo,
    });

    return await this.tiendaItemRepository.save(tiendaItem);
  }

  async findAll(): Promise<TiendaItem[]> {
    return await this.tiendaItemRepository.find({
      relations: ['tipo'],
      order: { precio: 'ASC' },
    });
  }

  async findOne(id: string): Promise<TiendaItem> {
    const tiendaItem = await this.tiendaItemRepository.findOne({
      where: { id },
      relations: ['tipo'],
    });
    
    if (!tiendaItem) {
      throw new NotFoundException(`Item de tienda con ID ${id} no encontrado`);
    }
    
    return tiendaItem;
  }

  async update(id: string, updateTiendaItemDto: UpdateTiendaItemDto): Promise<TiendaItem> {
    const tiendaItem = await this.findOne(id);
    
    const { tipoId, ...itemData } = updateTiendaItemDto;

    if (tipoId) {
      const tipo = await this.tipoItemRepository.findOne({
        where: { id: tipoId },
      });

      if (!tipo) {
        throw new BadRequestException(`Tipo de item con ID ${tipoId} no encontrado`);
      }

      tiendaItem.tipo = tipo;
    }

    Object.assign(tiendaItem, itemData);
    return await this.tiendaItemRepository.save(tiendaItem);
  }

  async remove(id: string): Promise<void> {
    const tiendaItem = await this.findOne(id);
    await this.tiendaItemRepository.remove(tiendaItem);
  }
}

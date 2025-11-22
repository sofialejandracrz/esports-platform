import { Injectable, NotFoundException } from '@nestjs/common';
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
    private readonly catalogoTipoItemRepository: Repository<CatalogoTipoItem>,
  ) {}

  async create(createTiendaItemDto: CreateTiendaItemDto): Promise<TiendaItem> {
    const { tipoId, ...rest } = createTiendaItemDto;

    const tipo = await this.catalogoTipoItemRepository.findOne({ where: { id: tipoId } });
    if (!tipo) {
      throw new NotFoundException(`Tipo de item con ID ${tipoId} no encontrado`);
    }

    const tiendaItem = this.tiendaItemRepository.create({
      ...rest,
      tipo,
    });

    return await this.tiendaItemRepository.save(tiendaItem);
  }

  async findAll(): Promise<TiendaItem[]> {
    return await this.tiendaItemRepository.find({
      relations: ['tipo'],
      order: { nombre: 'ASC' },
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

    const { tipoId, ...rest } = updateTiendaItemDto;

    if (tipoId) {
      const tipo = await this.catalogoTipoItemRepository.findOne({ where: { id: tipoId } });
      if (!tipo) {
        throw new NotFoundException(`Tipo de item con ID ${tipoId} no encontrado`);
      }
      tiendaItem.tipo = tipo;
    }

    Object.assign(tiendaItem, rest);
    return await this.tiendaItemRepository.save(tiendaItem);
  }

  async remove(id: string): Promise<void> {
    const tiendaItem = await this.findOne(id);
    await this.tiendaItemRepository.remove(tiendaItem);
  }
}

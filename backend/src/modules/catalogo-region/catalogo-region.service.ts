import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCatalogoRegionDto } from './dto/create-catalogo-region.dto';
import { UpdateCatalogoRegionDto } from './dto/update-catalogo-region.dto';
import { CatalogoRegion } from './entities/catalogo-region.entity';

@Injectable()
export class CatalogoRegionService {
  constructor(
    @InjectRepository(CatalogoRegion)
    private readonly catalogoRegionRepository: Repository<CatalogoRegion>,
  ) {}

  async create(createCatalogoRegionDto: CreateCatalogoRegionDto): Promise<CatalogoRegion> {
    const existing = await this.catalogoRegionRepository.findOne({
      where: { valor: createCatalogoRegionDto.valor },
    });

    if (existing) {
      throw new ConflictException('Ya existe una región con ese valor');
    }

    const catalogoRegion = this.catalogoRegionRepository.create(createCatalogoRegionDto);
    return await this.catalogoRegionRepository.save(catalogoRegion);
  }

  async findAll(): Promise<CatalogoRegion[]> {
    return await this.catalogoRegionRepository.find({
      order: { creadoEn: 'ASC' },
    });
  }

  async findOne(id: string): Promise<CatalogoRegion> {
    const catalogoRegion = await this.catalogoRegionRepository.findOne({
      where: { id },
    });

    if (!catalogoRegion) {
      throw new NotFoundException(`Región con ID ${id} no encontrada`);
    }

    return catalogoRegion;
  }

  async update(id: string, updateCatalogoRegionDto: UpdateCatalogoRegionDto): Promise<CatalogoRegion> {
    const catalogoRegion = await this.findOne(id);

    if (updateCatalogoRegionDto.valor) {
      const existing = await this.catalogoRegionRepository.findOne({
        where: { valor: updateCatalogoRegionDto.valor },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Ya existe una región con ese valor');
      }
    }

    Object.assign(catalogoRegion, updateCatalogoRegionDto);
    return await this.catalogoRegionRepository.save(catalogoRegion);
  }

  async remove(id: string): Promise<void> {
    const catalogoRegion = await this.findOne(id);
    await this.catalogoRegionRepository.remove(catalogoRegion);
  }
}

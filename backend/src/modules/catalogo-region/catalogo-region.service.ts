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
    try {
      const catalogoRegion = this.catalogoRegionRepository.create(createCatalogoRegionDto);
      return await this.catalogoRegionRepository.save(catalogoRegion);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El valor ya existe');
      }
      throw error;
    }
  }

  async findAll(): Promise<CatalogoRegion[]> {
    return await this.catalogoRegionRepository.find({
      order: { creadoEn: 'DESC' },
    });
  }

  async findOne(id: string): Promise<CatalogoRegion> {
    const catalogoRegion = await this.catalogoRegionRepository.findOne({
      where: { id },
    });
    
    if (!catalogoRegion) {
      throw new NotFoundException(`Catálogo de región con ID ${id} no encontrado`);
    }
    
    return catalogoRegion;
  }

  async update(id: string, updateCatalogoRegionDto: UpdateCatalogoRegionDto): Promise<CatalogoRegion> {
    const catalogoRegion = await this.findOne(id);
    
    try {
      Object.assign(catalogoRegion, updateCatalogoRegionDto);
      return await this.catalogoRegionRepository.save(catalogoRegion);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El valor ya existe');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const catalogoRegion = await this.findOne(id);
    await this.catalogoRegionRepository.remove(catalogoRegion);
  }
}

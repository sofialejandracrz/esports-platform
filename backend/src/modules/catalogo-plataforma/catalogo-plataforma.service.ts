import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCatalogoPlataformaDto } from './dto/create-catalogo-plataforma.dto';
import { UpdateCatalogoPlataformaDto } from './dto/update-catalogo-plataforma.dto';
import { CatalogoPlataforma } from './entities/catalogo-plataforma.entity';

@Injectable()
export class CatalogoPlataformaService {
  constructor(
    @InjectRepository(CatalogoPlataforma)
    private readonly catalogoPlataformaRepository: Repository<CatalogoPlataforma>,
  ) {}

  async create(createCatalogoPlataformaDto: CreateCatalogoPlataformaDto): Promise<CatalogoPlataforma> {
    try {
      const catalogoPlataforma = this.catalogoPlataformaRepository.create(createCatalogoPlataformaDto);
      return await this.catalogoPlataformaRepository.save(catalogoPlataforma);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El valor ya existe');
      }
      throw error;
    }
  }

  async findAll(): Promise<CatalogoPlataforma[]> {
    return await this.catalogoPlataformaRepository.find({
      order: { creadoEn: 'DESC' },
    });
  }

  async findOne(id: string): Promise<CatalogoPlataforma> {
    const catalogoPlataforma = await this.catalogoPlataformaRepository.findOne({
      where: { id },
    });
    
    if (!catalogoPlataforma) {
      throw new NotFoundException(`Catálogo de plataforma con ID ${id} no encontrado`);
    }
    
    return catalogoPlataforma;
  }

  async update(id: string, updateCatalogoPlataformaDto: UpdateCatalogoPlataformaDto): Promise<CatalogoPlataforma> {
    const catalogoPlataforma = await this.findOne(id);
    
    try {
      Object.assign(catalogoPlataforma, updateCatalogoPlataformaDto);
      return await this.catalogoPlataformaRepository.save(catalogoPlataforma);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El valor ya existe');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const catalogoPlataforma = await this.findOne(id);
    await this.catalogoPlataformaRepository.remove(catalogoPlataforma);
  }
}

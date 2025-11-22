import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCatalogoTipoEntradaDto } from './dto/create-catalogo-tipo-entrada.dto';
import { UpdateCatalogoTipoEntradaDto } from './dto/update-catalogo-tipo-entrada.dto';
import { CatalogoTipoEntrada } from './entities/catalogo-tipo-entrada.entity';

@Injectable()
export class CatalogoTipoEntradaService {
  constructor(
    @InjectRepository(CatalogoTipoEntrada)
    private readonly catalogoTipoEntradaRepository: Repository<CatalogoTipoEntrada>,
  ) {}

  async create(createCatalogoTipoEntradaDto: CreateCatalogoTipoEntradaDto): Promise<CatalogoTipoEntrada> {
    try {
      const catalogoTipoEntrada = this.catalogoTipoEntradaRepository.create(createCatalogoTipoEntradaDto);
      return await this.catalogoTipoEntradaRepository.save(catalogoTipoEntrada);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El valor ya existe');
      }
      throw error;
    }
  }

  async findAll(): Promise<CatalogoTipoEntrada[]> {
    return await this.catalogoTipoEntradaRepository.find({
      order: { creadoEn: 'DESC' },
    });
  }

  async findOne(id: string): Promise<CatalogoTipoEntrada> {
    const catalogoTipoEntrada = await this.catalogoTipoEntradaRepository.findOne({
      where: { id },
    });
    
    if (!catalogoTipoEntrada) {
      throw new NotFoundException(`Catálogo de tipo de entrada con ID ${id} no encontrado`);
    }
    
    return catalogoTipoEntrada;
  }

  async update(id: string, updateCatalogoTipoEntradaDto: UpdateCatalogoTipoEntradaDto): Promise<CatalogoTipoEntrada> {
    const catalogoTipoEntrada = await this.findOne(id);
    
    try {
      Object.assign(catalogoTipoEntrada, updateCatalogoTipoEntradaDto);
      return await this.catalogoTipoEntradaRepository.save(catalogoTipoEntrada);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El valor ya existe');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const catalogoTipoEntrada = await this.findOne(id);
    await this.catalogoTipoEntradaRepository.remove(catalogoTipoEntrada);
  }
}

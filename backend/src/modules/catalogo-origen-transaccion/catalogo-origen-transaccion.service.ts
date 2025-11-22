import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCatalogoOrigenTransaccionDto } from './dto/create-catalogo-origen-transaccion.dto';
import { UpdateCatalogoOrigenTransaccionDto } from './dto/update-catalogo-origen-transaccion.dto';
import { CatalogoOrigenTransaccion } from './entities/catalogo-origen-transaccion.entity';

@Injectable()
export class CatalogoOrigenTransaccionService {
  constructor(
    @InjectRepository(CatalogoOrigenTransaccion)
    private readonly catalogoOrigenTransaccionRepository: Repository<CatalogoOrigenTransaccion>,
  ) {}

  async create(createCatalogoOrigenTransaccionDto: CreateCatalogoOrigenTransaccionDto): Promise<CatalogoOrigenTransaccion> {
    try {
      const catalogoOrigenTransaccion = this.catalogoOrigenTransaccionRepository.create(createCatalogoOrigenTransaccionDto);
      return await this.catalogoOrigenTransaccionRepository.save(catalogoOrigenTransaccion);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El valor ya existe');
      }
      throw error;
    }
  }

  async findAll(): Promise<CatalogoOrigenTransaccion[]> {
    return await this.catalogoOrigenTransaccionRepository.find({
      order: { creadoEn: 'DESC' },
    });
  }

  async findOne(id: string): Promise<CatalogoOrigenTransaccion> {
    const catalogoOrigenTransaccion = await this.catalogoOrigenTransaccionRepository.findOne({
      where: { id },
    });
    
    if (!catalogoOrigenTransaccion) {
      throw new NotFoundException(`Catálogo de origen de transacción con ID ${id} no encontrado`);
    }
    
    return catalogoOrigenTransaccion;
  }

  async update(id: string, updateCatalogoOrigenTransaccionDto: UpdateCatalogoOrigenTransaccionDto): Promise<CatalogoOrigenTransaccion> {
    const catalogoOrigenTransaccion = await this.findOne(id);
    
    try {
      Object.assign(catalogoOrigenTransaccion, updateCatalogoOrigenTransaccionDto);
      return await this.catalogoOrigenTransaccionRepository.save(catalogoOrigenTransaccion);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El valor ya existe');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const catalogoOrigenTransaccion = await this.findOne(id);
    await this.catalogoOrigenTransaccionRepository.remove(catalogoOrigenTransaccion);
  }
}

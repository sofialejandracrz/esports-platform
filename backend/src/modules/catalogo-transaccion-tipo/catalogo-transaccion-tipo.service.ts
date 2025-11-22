import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCatalogoTransaccionTipoDto } from './dto/create-catalogo-transaccion-tipo.dto';
import { UpdateCatalogoTransaccionTipoDto } from './dto/update-catalogo-transaccion-tipo.dto';
import { CatalogoTransaccionTipo } from './entities/catalogo-transaccion-tipo.entity';

@Injectable()
export class CatalogoTransaccionTipoService {
  constructor(
    @InjectRepository(CatalogoTransaccionTipo)
    private readonly catalogoTransaccionTipoRepository: Repository<CatalogoTransaccionTipo>,
  ) {}

  async create(createCatalogoTransaccionTipoDto: CreateCatalogoTransaccionTipoDto): Promise<CatalogoTransaccionTipo> {
    try {
      const catalogoTransaccionTipo = this.catalogoTransaccionTipoRepository.create(createCatalogoTransaccionTipoDto);
      return await this.catalogoTransaccionTipoRepository.save(catalogoTransaccionTipo);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El valor ya existe');
      }
      throw error;
    }
  }

  async findAll(): Promise<CatalogoTransaccionTipo[]> {
    return await this.catalogoTransaccionTipoRepository.find({
      order: { creadoEn: 'DESC' },
    });
  }

  async findOne(id: string): Promise<CatalogoTransaccionTipo> {
    const catalogoTransaccionTipo = await this.catalogoTransaccionTipoRepository.findOne({
      where: { id },
    });
    
    if (!catalogoTransaccionTipo) {
      throw new NotFoundException(`Catálogo de tipo de transacción con ID ${id} no encontrado`);
    }
    
    return catalogoTransaccionTipo;
  }

  async update(id: string, updateCatalogoTransaccionTipoDto: UpdateCatalogoTransaccionTipoDto): Promise<CatalogoTransaccionTipo> {
    const catalogoTransaccionTipo = await this.findOne(id);
    
    try {
      Object.assign(catalogoTransaccionTipo, updateCatalogoTransaccionTipoDto);
      return await this.catalogoTransaccionTipoRepository.save(catalogoTransaccionTipo);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El valor ya existe');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const catalogoTransaccionTipo = await this.findOne(id);
    await this.catalogoTransaccionTipoRepository.remove(catalogoTransaccionTipo);
  }
}

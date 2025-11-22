import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCatalogoRolDto } from './dto/create-catalogo-rol.dto';
import { UpdateCatalogoRolDto } from './dto/update-catalogo-rol.dto';
import { CatalogoRol } from './entities/catalogo-rol.entity';

@Injectable()
export class CatalogoRolService {
  constructor(
    @InjectRepository(CatalogoRol)
    private readonly catalogoRolRepository: Repository<CatalogoRol>,
  ) {}

  async create(createCatalogoRolDto: CreateCatalogoRolDto): Promise<CatalogoRol> {
    try {
      const catalogoRol = this.catalogoRolRepository.create(createCatalogoRolDto);
      return await this.catalogoRolRepository.save(catalogoRol);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El valor ya existe');
      }
      throw error;
    }
  }

  async findAll(): Promise<CatalogoRol[]> {
    return await this.catalogoRolRepository.find({
      order: { creadoEn: 'DESC' },
    });
  }

  async findOne(id: string): Promise<CatalogoRol> {
    const catalogoRol = await this.catalogoRolRepository.findOne({
      where: { id },
    });
    
    if (!catalogoRol) {
      throw new NotFoundException(`Catálogo de rol con ID ${id} no encontrado`);
    }
    
    return catalogoRol;
  }

  async update(id: string, updateCatalogoRolDto: UpdateCatalogoRolDto): Promise<CatalogoRol> {
    const catalogoRol = await this.findOne(id);
    
    try {
      Object.assign(catalogoRol, updateCatalogoRolDto);
      return await this.catalogoRolRepository.save(catalogoRol);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El valor ya existe');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const catalogoRol = await this.findOne(id);
    await this.catalogoRolRepository.remove(catalogoRol);
  }
}

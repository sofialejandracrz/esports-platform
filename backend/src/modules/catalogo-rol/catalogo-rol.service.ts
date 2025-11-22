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
    const existing = await this.catalogoRolRepository.findOne({
      where: { valor: createCatalogoRolDto.valor },
    });

    if (existing) {
      throw new ConflictException('Ya existe un rol con ese valor');
    }

    const catalogoRol = this.catalogoRolRepository.create(createCatalogoRolDto);
    return await this.catalogoRolRepository.save(catalogoRol);
  }

  async findAll(): Promise<CatalogoRol[]> {
    return await this.catalogoRolRepository.find({
      order: { creadoEn: 'ASC' },
    });
  }

  async findOne(id: string): Promise<CatalogoRol> {
    const catalogoRol = await this.catalogoRolRepository.findOne({
      where: { id },
    });

    if (!catalogoRol) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }

    return catalogoRol;
  }

  async update(id: string, updateCatalogoRolDto: UpdateCatalogoRolDto): Promise<CatalogoRol> {
    const catalogoRol = await this.findOne(id);

    if (updateCatalogoRolDto.valor) {
      const existing = await this.catalogoRolRepository.findOne({
        where: { valor: updateCatalogoRolDto.valor },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Ya existe un rol con ese valor');
      }
    }

    Object.assign(catalogoRol, updateCatalogoRolDto);
    return await this.catalogoRolRepository.save(catalogoRol);
  }

  async remove(id: string): Promise<void> {
    const catalogoRol = await this.findOne(id);
    await this.catalogoRolRepository.remove(catalogoRol);
  }
}

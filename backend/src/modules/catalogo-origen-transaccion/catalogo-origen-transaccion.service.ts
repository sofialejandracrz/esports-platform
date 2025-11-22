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
    const existing = await this.catalogoOrigenTransaccionRepository.findOne({
      where: { valor: createCatalogoOrigenTransaccionDto.valor },
    });

    if (existing) {
      throw new ConflictException('Ya existe un origen de transacción con ese valor');
    }

    const catalogoOrigenTransaccion = this.catalogoOrigenTransaccionRepository.create(createCatalogoOrigenTransaccionDto);
    return await this.catalogoOrigenTransaccionRepository.save(catalogoOrigenTransaccion);
  }

  async findAll(): Promise<CatalogoOrigenTransaccion[]> {
    return await this.catalogoOrigenTransaccionRepository.find({
      order: { creadoEn: 'ASC' },
    });
  }

  async findOne(id: string): Promise<CatalogoOrigenTransaccion> {
    const catalogoOrigenTransaccion = await this.catalogoOrigenTransaccionRepository.findOne({
      where: { id },
    });

    if (!catalogoOrigenTransaccion) {
      throw new NotFoundException(`Origen de transacción con ID ${id} no encontrado`);
    }

    return catalogoOrigenTransaccion;
  }

  async update(id: string, updateCatalogoOrigenTransaccionDto: UpdateCatalogoOrigenTransaccionDto): Promise<CatalogoOrigenTransaccion> {
    const catalogoOrigenTransaccion = await this.findOne(id);

    if (updateCatalogoOrigenTransaccionDto.valor) {
      const existing = await this.catalogoOrigenTransaccionRepository.findOne({
        where: { valor: updateCatalogoOrigenTransaccionDto.valor },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Ya existe un origen de transacción con ese valor');
      }
    }

    Object.assign(catalogoOrigenTransaccion, updateCatalogoOrigenTransaccionDto);
    return await this.catalogoOrigenTransaccionRepository.save(catalogoOrigenTransaccion);
  }

  async remove(id: string): Promise<void> {
    const catalogoOrigenTransaccion = await this.findOne(id);
    await this.catalogoOrigenTransaccionRepository.remove(catalogoOrigenTransaccion);
  }
}

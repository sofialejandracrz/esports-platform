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
    const existing = await this.catalogoTransaccionTipoRepository.findOne({
      where: { valor: createCatalogoTransaccionTipoDto.valor },
    });

    if (existing) {
      throw new ConflictException('Ya existe un tipo de transacción con ese valor');
    }

    const catalogoTransaccionTipo = this.catalogoTransaccionTipoRepository.create(createCatalogoTransaccionTipoDto);
    return await this.catalogoTransaccionTipoRepository.save(catalogoTransaccionTipo);
  }

  async findAll(): Promise<CatalogoTransaccionTipo[]> {
    return await this.catalogoTransaccionTipoRepository.find({
      order: { creadoEn: 'ASC' },
    });
  }

  async findOne(id: string): Promise<CatalogoTransaccionTipo> {
    const catalogoTransaccionTipo = await this.catalogoTransaccionTipoRepository.findOne({
      where: { id },
    });

    if (!catalogoTransaccionTipo) {
      throw new NotFoundException(`Tipo de transacción con ID ${id} no encontrado`);
    }

    return catalogoTransaccionTipo;
  }

  async update(id: string, updateCatalogoTransaccionTipoDto: UpdateCatalogoTransaccionTipoDto): Promise<CatalogoTransaccionTipo> {
    const catalogoTransaccionTipo = await this.findOne(id);

    if (updateCatalogoTransaccionTipoDto.valor) {
      const existing = await this.catalogoTransaccionTipoRepository.findOne({
        where: { valor: updateCatalogoTransaccionTipoDto.valor },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Ya existe un tipo de transacción con ese valor');
      }
    }

    Object.assign(catalogoTransaccionTipo, updateCatalogoTransaccionTipoDto);
    return await this.catalogoTransaccionTipoRepository.save(catalogoTransaccionTipo);
  }

  async remove(id: string): Promise<void> {
    const catalogoTransaccionTipo = await this.findOne(id);
    await this.catalogoTransaccionTipoRepository.remove(catalogoTransaccionTipo);
  }
}

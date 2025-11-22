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
    const existing = await this.catalogoTipoEntradaRepository.findOne({
      where: { valor: createCatalogoTipoEntradaDto.valor },
    });

    if (existing) {
      throw new ConflictException('Ya existe un tipo de entrada con ese valor');
    }

    const catalogoTipoEntrada = this.catalogoTipoEntradaRepository.create(createCatalogoTipoEntradaDto);
    return await this.catalogoTipoEntradaRepository.save(catalogoTipoEntrada);
  }

  async findAll(): Promise<CatalogoTipoEntrada[]> {
    return await this.catalogoTipoEntradaRepository.find({
      order: { creadoEn: 'ASC' },
    });
  }

  async findOne(id: string): Promise<CatalogoTipoEntrada> {
    const catalogoTipoEntrada = await this.catalogoTipoEntradaRepository.findOne({
      where: { id },
    });

    if (!catalogoTipoEntrada) {
      throw new NotFoundException(`Tipo de entrada con ID ${id} no encontrado`);
    }

    return catalogoTipoEntrada;
  }

  async update(id: string, updateCatalogoTipoEntradaDto: UpdateCatalogoTipoEntradaDto): Promise<CatalogoTipoEntrada> {
    const catalogoTipoEntrada = await this.findOne(id);

    if (updateCatalogoTipoEntradaDto.valor) {
      const existing = await this.catalogoTipoEntradaRepository.findOne({
        where: { valor: updateCatalogoTipoEntradaDto.valor },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Ya existe un tipo de entrada con ese valor');
      }
    }

    Object.assign(catalogoTipoEntrada, updateCatalogoTipoEntradaDto);
    return await this.catalogoTipoEntradaRepository.save(catalogoTipoEntrada);
  }

  async remove(id: string): Promise<void> {
    const catalogoTipoEntrada = await this.findOne(id);
    await this.catalogoTipoEntradaRepository.remove(catalogoTipoEntrada);
  }
}

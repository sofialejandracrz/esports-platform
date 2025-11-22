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
    const existing = await this.catalogoPlataformaRepository.findOne({
      where: { valor: createCatalogoPlataformaDto.valor },
    });

    if (existing) {
      throw new ConflictException('Ya existe una plataforma con ese valor');
    }

    const catalogoPlataforma = this.catalogoPlataformaRepository.create(createCatalogoPlataformaDto);
    return await this.catalogoPlataformaRepository.save(catalogoPlataforma);
  }

  async findAll(): Promise<CatalogoPlataforma[]> {
    return await this.catalogoPlataformaRepository.find({
      order: { creadoEn: 'ASC' },
    });
  }

  async findOne(id: string): Promise<CatalogoPlataforma> {
    const catalogoPlataforma = await this.catalogoPlataformaRepository.findOne({
      where: { id },
    });

    if (!catalogoPlataforma) {
      throw new NotFoundException(`Plataforma con ID ${id} no encontrada`);
    }

    return catalogoPlataforma;
  }

  async update(id: string, updateCatalogoPlataformaDto: UpdateCatalogoPlataformaDto): Promise<CatalogoPlataforma> {
    const catalogoPlataforma = await this.findOne(id);

    if (updateCatalogoPlataformaDto.valor) {
      const existing = await this.catalogoPlataformaRepository.findOne({
        where: { valor: updateCatalogoPlataformaDto.valor },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Ya existe una plataforma con ese valor');
      }
    }

    Object.assign(catalogoPlataforma, updateCatalogoPlataformaDto);
    return await this.catalogoPlataformaRepository.save(catalogoPlataforma);
  }

  async remove(id: string): Promise<void> {
    const catalogoPlataforma = await this.findOne(id);
    await this.catalogoPlataformaRepository.remove(catalogoPlataforma);
  }
}

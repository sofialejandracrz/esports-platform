import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMembresiaTipoDto } from './dto/create-membresia-tipo.dto';
import { UpdateMembresiaTipoDto } from './dto/update-membresia-tipo.dto';
import { MembresiaTipo } from './entities/membresia-tipo.entity';

@Injectable()
export class MembresiaTipoService {
  constructor(
    @InjectRepository(MembresiaTipo)
    private readonly membresiaTipoRepository: Repository<MembresiaTipo>,
  ) {}

  async create(createMembresiaTipoDto: CreateMembresiaTipoDto): Promise<MembresiaTipo> {
    const membresiaTipo = this.membresiaTipoRepository.create(createMembresiaTipoDto);
    return await this.membresiaTipoRepository.save(membresiaTipo);
  }

  async findAll(): Promise<MembresiaTipo[]> {
    return await this.membresiaTipoRepository.find({
      order: { duracionDias: 'ASC' },
    });
  }

  async findOne(id: string): Promise<MembresiaTipo> {
    const membresiaTipo = await this.membresiaTipoRepository.findOne({
      where: { id },
    });

    if (!membresiaTipo) {
      throw new NotFoundException(`Tipo de membresía con ID ${id} no encontrado`);
    }

    return membresiaTipo;
  }

  async update(id: string, updateMembresiaTipoDto: UpdateMembresiaTipoDto): Promise<MembresiaTipo> {
    const membresiaTipo = await this.findOne(id);

    Object.assign(membresiaTipo, updateMembresiaTipoDto);
    return await this.membresiaTipoRepository.save(membresiaTipo);
  }

  async remove(id: string): Promise<void> {
    const membresiaTipo = await this.findOne(id);
    await this.membresiaTipoRepository.remove(membresiaTipo);
  }
}

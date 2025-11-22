import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';
import { Equipo } from './entities/equipo.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class EquipoService {
  constructor(
    @InjectRepository(Equipo)
    private readonly equipoRepository: Repository<Equipo>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createEquipoDto: CreateEquipoDto): Promise<Equipo> {
    const existing = await this.equipoRepository.findOne({
      where: { nombre: createEquipoDto.nombre },
    });

    if (existing) {
      throw new ConflictException('Ya existe un equipo con ese nombre');
    }

    const usuario = await this.usuarioRepository.findOne({
      where: { id: createEquipoDto.creadoPorId },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${createEquipoDto.creadoPorId} no encontrado`);
    }

    const equipo = this.equipoRepository.create({
      nombre: createEquipoDto.nombre,
      descripcion: createEquipoDto.descripcion,
      avatarUrl: createEquipoDto.avatarUrl,
      creadoPor: usuario,
    });

    return await this.equipoRepository.save(equipo);
  }

  async findAll(): Promise<Equipo[]> {
    return await this.equipoRepository.find({
      relations: ['creadoPor', 'miembros'],
      order: { creadoEn: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Equipo> {
    const equipo = await this.equipoRepository.findOne({
      where: { id },
      relations: ['creadoPor', 'miembros'],
    });

    if (!equipo) {
      throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
    }

    return equipo;
  }

  async update(id: string, updateEquipoDto: UpdateEquipoDto): Promise<Equipo> {
    const equipo = await this.findOne(id);

    if (updateEquipoDto.nombre && updateEquipoDto.nombre !== equipo.nombre) {
      const existing = await this.equipoRepository.findOne({
        where: { nombre: updateEquipoDto.nombre },
      });

      if (existing) {
        throw new ConflictException('Ya existe un equipo con ese nombre');
      }
    }

    Object.assign(equipo, updateEquipoDto);
    return await this.equipoRepository.save(equipo);
  }

  async remove(id: string): Promise<void> {
    const equipo = await this.findOne(id);
    await this.equipoRepository.remove(equipo);
  }
}

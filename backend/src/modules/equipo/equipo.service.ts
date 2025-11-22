import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
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
    const { creadoPorId, ...equipoData } = createEquipoDto;

    const usuario = await this.usuarioRepository.findOne({
      where: { id: creadoPorId },
    });

    if (!usuario) {
      throw new BadRequestException(`Usuario con ID ${creadoPorId} no encontrado`);
    }

    try {
      const equipo = this.equipoRepository.create({
        ...equipoData,
        creadoPor: usuario,
      });
      return await this.equipoRepository.save(equipo);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El nombre del equipo ya existe');
      }
      throw error;
    }
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
    
    const { creadoPorId, ...equipoData } = updateEquipoDto;

    if (creadoPorId) {
      const usuario = await this.usuarioRepository.findOne({
        where: { id: creadoPorId },
      });

      if (!usuario) {
        throw new BadRequestException(`Usuario con ID ${creadoPorId} no encontrado`);
      }

      equipo.creadoPor = usuario;
    }
    
    try {
      Object.assign(equipo, equipoData);
      return await this.equipoRepository.save(equipo);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El nombre del equipo ya existe');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const equipo = await this.findOne(id);
    await this.equipoRepository.remove(equipo);
  }
}

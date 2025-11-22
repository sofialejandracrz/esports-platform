import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEquipoMiembroDto } from './dto/create-equipo-miembro.dto';
import { UpdateEquipoMiembroDto } from './dto/update-equipo-miembro.dto';
import { EquipoMiembro } from './entities/equipo-miembro.entity';
import { Equipo } from '../equipo/entities/equipo.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class EquipoMiembroService {
  constructor(
    @InjectRepository(EquipoMiembro)
    private readonly equipoMiembroRepository: Repository<EquipoMiembro>,
    @InjectRepository(Equipo)
    private readonly equipoRepository: Repository<Equipo>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createEquipoMiembroDto: CreateEquipoMiembroDto): Promise<EquipoMiembro> {
    const { equipoId, usuarioId, rol = 'miembro' } = createEquipoMiembroDto;

    const equipo = await this.equipoRepository.findOne({
      where: { id: equipoId },
    });

    if (!equipo) {
      throw new BadRequestException(`Equipo con ID ${equipoId} no encontrado`);
    }

    const usuario = await this.usuarioRepository.findOne({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new BadRequestException(`Usuario con ID ${usuarioId} no encontrado`);
    }

    const existingMember = await this.equipoMiembroRepository.findOne({
      where: { equipo: { id: equipoId }, usuario: { id: usuarioId } },
    });

    if (existingMember) {
      throw new ConflictException('El usuario ya es miembro de este equipo');
    }

    const equipoMiembro = this.equipoMiembroRepository.create({
      equipo,
      usuario,
      rol,
    });

    return await this.equipoMiembroRepository.save(equipoMiembro);
  }

  async findAll(): Promise<EquipoMiembro[]> {
    return await this.equipoMiembroRepository.find({
      relations: ['equipo', 'usuario'],
      order: { joinedAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<EquipoMiembro> {
    const equipoMiembro = await this.equipoMiembroRepository.findOne({
      where: { id },
      relations: ['equipo', 'usuario'],
    });
    
    if (!equipoMiembro) {
      throw new NotFoundException(`Miembro de equipo con ID ${id} no encontrado`);
    }
    
    return equipoMiembro;
  }

  async update(id: string, updateEquipoMiembroDto: UpdateEquipoMiembroDto): Promise<EquipoMiembro> {
    const equipoMiembro = await this.findOne(id);
    
    const { equipoId, usuarioId, rol } = updateEquipoMiembroDto;

    if (equipoId) {
      const equipo = await this.equipoRepository.findOne({
        where: { id: equipoId },
      });

      if (!equipo) {
        throw new BadRequestException(`Equipo con ID ${equipoId} no encontrado`);
      }

      equipoMiembro.equipo = equipo;
    }

    if (usuarioId) {
      const usuario = await this.usuarioRepository.findOne({
        where: { id: usuarioId },
      });

      if (!usuario) {
        throw new BadRequestException(`Usuario con ID ${usuarioId} no encontrado`);
      }

      equipoMiembro.usuario = usuario;
    }

    if (rol !== undefined) {
      equipoMiembro.rol = rol;
    }
    
    return await this.equipoMiembroRepository.save(equipoMiembro);
  }

  async remove(id: string): Promise<void> {
    const equipoMiembro = await this.findOne(id);
    await this.equipoMiembroRepository.remove(equipoMiembro);
  }
}

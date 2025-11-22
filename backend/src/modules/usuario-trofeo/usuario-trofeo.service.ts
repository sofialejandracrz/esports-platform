import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioTrofeoDto } from './dto/create-usuario-trofeo.dto';
import { UpdateUsuarioTrofeoDto } from './dto/update-usuario-trofeo.dto';
import { UsuarioTrofeo } from './entities/usuario-trofeo.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Torneo } from '../torneo/entities/torneo.entity';

@Injectable()
export class UsuarioTrofeoService {
  constructor(
    @InjectRepository(UsuarioTrofeo)
    private readonly usuarioTrofeoRepository: Repository<UsuarioTrofeo>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Torneo)
    private readonly torneoRepository: Repository<Torneo>,
  ) {}

  async create(createUsuarioTrofeoDto: CreateUsuarioTrofeoDto): Promise<UsuarioTrofeo> {
    const { usuarioId, torneoId, ...rest } = createUsuarioTrofeoDto;

    const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
    }

    let torneo = null;
    if (torneoId) {
      torneo = await this.torneoRepository.findOne({ where: { id: torneoId } });
      if (!torneo) {
        throw new NotFoundException(`Torneo con ID ${torneoId} no encontrado`);
      }
    }

    const usuarioTrofeo = this.usuarioTrofeoRepository.create({
      ...rest,
      usuario,
      torneo,
    });

    return await this.usuarioTrofeoRepository.save(usuarioTrofeo);
  }

  async findAll(): Promise<UsuarioTrofeo[]> {
    return await this.usuarioTrofeoRepository.find({
      relations: ['usuario', 'torneo'],
      order: { ganadoEn: 'DESC' },
    });
  }

  async findOne(id: string): Promise<UsuarioTrofeo> {
    const usuarioTrofeo = await this.usuarioTrofeoRepository.findOne({
      where: { id },
      relations: ['usuario', 'torneo'],
    });

    if (!usuarioTrofeo) {
      throw new NotFoundException(`Trofeo de usuario con ID ${id} no encontrado`);
    }

    return usuarioTrofeo;
  }

  async update(id: string, updateUsuarioTrofeoDto: UpdateUsuarioTrofeoDto): Promise<UsuarioTrofeo> {
    const usuarioTrofeo = await this.findOne(id);

    const { usuarioId, torneoId, ...rest } = updateUsuarioTrofeoDto;

    if (usuarioId) {
      const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
      if (!usuario) {
        throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
      }
      usuarioTrofeo.usuario = usuario;
    }

    if (torneoId !== undefined) {
      if (torneoId) {
        const torneo = await this.torneoRepository.findOne({ where: { id: torneoId } });
        if (!torneo) {
          throw new NotFoundException(`Torneo con ID ${torneoId} no encontrado`);
        }
        usuarioTrofeo.torneo = torneo;
      } else {
        usuarioTrofeo.torneo = null;
      }
    }

    Object.assign(usuarioTrofeo, rest);
    return await this.usuarioTrofeoRepository.save(usuarioTrofeo);
  }

  async remove(id: string): Promise<void> {
    const usuarioTrofeo = await this.findOne(id);
    await this.usuarioTrofeoRepository.remove(usuarioTrofeo);
  }
}

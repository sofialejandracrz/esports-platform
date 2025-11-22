import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    const { usuarioId, torneoId, tipoTrofeo, ganadoEn } = createUsuarioTrofeoDto;

    const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
    if (!usuario) {
      throw new BadRequestException('Usuario no encontrado');
    }

    let torneo = null;
    if (torneoId) {
      torneo = await this.torneoRepository.findOne({ where: { id: torneoId } });
      if (!torneo) {
        throw new BadRequestException('Torneo no encontrado');
      }
    }

    const usuarioTrofeo = this.usuarioTrofeoRepository.create({
      usuario,
      torneo,
      tipoTrofeo,
      ganadoEn: ganadoEn ? new Date(ganadoEn) : undefined,
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
      throw new NotFoundException(`Usuario trofeo con id ${id} no encontrado`);
    }

    return usuarioTrofeo;
  }

  async update(id: string, updateUsuarioTrofeoDto: UpdateUsuarioTrofeoDto): Promise<UsuarioTrofeo> {
    const usuarioTrofeo = await this.findOne(id);

    const { usuarioId, torneoId, tipoTrofeo, ganadoEn } = updateUsuarioTrofeoDto;

    if (usuarioId) {
      const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
      if (!usuario) {
        throw new BadRequestException('Usuario no encontrado');
      }
      usuarioTrofeo.usuario = usuario;
    }

    if (torneoId !== undefined) {
      if (torneoId === null) {
        usuarioTrofeo.torneo = null;
      } else {
        const torneo = await this.torneoRepository.findOne({ where: { id: torneoId } });
        if (!torneo) {
          throw new BadRequestException('Torneo no encontrado');
        }
        usuarioTrofeo.torneo = torneo;
      }
    }

    if (tipoTrofeo !== undefined) {
      usuarioTrofeo.tipoTrofeo = tipoTrofeo;
    }

    if (ganadoEn !== undefined) {
      usuarioTrofeo.ganadoEn = new Date(ganadoEn);
    }

    return await this.usuarioTrofeoRepository.save(usuarioTrofeo);
  }

  async remove(id: string): Promise<void> {
    const usuarioTrofeo = await this.findOne(id);
    await this.usuarioTrofeoRepository.remove(usuarioTrofeo);
  }
}

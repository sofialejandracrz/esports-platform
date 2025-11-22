import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioMembresiaDto } from './dto/create-usuario-membresia.dto';
import { UpdateUsuarioMembresiaDto } from './dto/update-usuario-membresia.dto';
import { UsuarioMembresia } from './entities/usuario-membresia.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { MembresiaTipo } from '../membresia-tipo/entities/membresia-tipo.entity';

@Injectable()
export class UsuarioMembresiaService {
  constructor(
    @InjectRepository(UsuarioMembresia)
    private readonly usuarioMembresiaRepository: Repository<UsuarioMembresia>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(MembresiaTipo)
    private readonly membresiaTipoRepository: Repository<MembresiaTipo>,
  ) {}

  async create(createUsuarioMembresiaDto: CreateUsuarioMembresiaDto): Promise<UsuarioMembresia> {
    const { usuarioId, membresiaTipoId, ...membresiaData } = createUsuarioMembresiaDto;

    const usuario = await this.usuarioRepository.findOne({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new BadRequestException(`Usuario con ID ${usuarioId} no encontrado`);
    }

    const membresiaTipo = await this.membresiaTipoRepository.findOne({
      where: { id: membresiaTipoId },
    });

    if (!membresiaTipo) {
      throw new BadRequestException(`Tipo de membresía con ID ${membresiaTipoId} no encontrado`);
    }

    const usuarioMembresia = this.usuarioMembresiaRepository.create({
      ...membresiaData,
      usuario,
      membresiaTipo,
    });

    return await this.usuarioMembresiaRepository.save(usuarioMembresia);
  }

  async findAll(): Promise<UsuarioMembresia[]> {
    return await this.usuarioMembresiaRepository.find({
      relations: ['usuario', 'membresiaTipo'],
      order: { fechaInicio: 'DESC' },
    });
  }

  async findOne(id: string): Promise<UsuarioMembresia> {
    const usuarioMembresia = await this.usuarioMembresiaRepository.findOne({
      where: { id },
      relations: ['usuario', 'membresiaTipo'],
    });

    if (!usuarioMembresia) {
      throw new NotFoundException(`Membresía de usuario con ID ${id} no encontrada`);
    }

    return usuarioMembresia;
  }

  async update(id: string, updateUsuarioMembresiaDto: UpdateUsuarioMembresiaDto): Promise<UsuarioMembresia> {
    const usuarioMembresia = await this.findOne(id);

    const { usuarioId, membresiaTipoId, ...membresiaData } = updateUsuarioMembresiaDto;

    if (usuarioId) {
      const usuario = await this.usuarioRepository.findOne({
        where: { id: usuarioId },
      });

      if (!usuario) {
        throw new BadRequestException(`Usuario con ID ${usuarioId} no encontrado`);
      }

      usuarioMembresia.usuario = usuario;
    }

    if (membresiaTipoId) {
      const membresiaTipo = await this.membresiaTipoRepository.findOne({
        where: { id: membresiaTipoId },
      });

      if (!membresiaTipo) {
        throw new BadRequestException(`Tipo de membresía con ID ${membresiaTipoId} no encontrado`);
      }

      usuarioMembresia.membresiaTipo = membresiaTipo;
    }

    Object.assign(usuarioMembresia, membresiaData);
    return await this.usuarioMembresiaRepository.save(usuarioMembresia);
  }

  async remove(id: string): Promise<void> {
    const usuarioMembresia = await this.findOne(id);
    await this.usuarioMembresiaRepository.remove(usuarioMembresia);
  }
}

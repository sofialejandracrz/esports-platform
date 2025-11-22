import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioSeguidoreDto } from './dto/create-usuario-seguidore.dto';
import { UpdateUsuarioSeguidoreDto } from './dto/update-usuario-seguidore.dto';
import { UsuarioSeguidores } from './entities/usuario-seguidore.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class UsuarioSeguidoresService {
  constructor(
    @InjectRepository(UsuarioSeguidores)
    private readonly usuarioSeguidoresRepository: Repository<UsuarioSeguidores>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioSeguidoreDto: CreateUsuarioSeguidoreDto): Promise<UsuarioSeguidores> {
    const { seguidorId, seguidoId, ...seguidorData } = createUsuarioSeguidoreDto;

    if (seguidorId === seguidoId) {
      throw new BadRequestException('Un usuario no puede seguirse a sí mismo');
    }

    const seguidor = await this.usuarioRepository.findOne({
      where: { id: seguidorId },
    });

    if (!seguidor) {
      throw new BadRequestException(`Usuario seguidor con ID ${seguidorId} no encontrado`);
    }

    const seguido = await this.usuarioRepository.findOne({
      where: { id: seguidoId },
    });

    if (!seguido) {
      throw new BadRequestException(`Usuario seguido con ID ${seguidoId} no encontrado`);
    }

    const relacionExistente = await this.usuarioSeguidoresRepository.findOne({
      where: {
        seguidor: { id: seguidorId },
        seguido: { id: seguidoId },
      },
    });

    if (relacionExistente) {
      throw new ConflictException('El usuario ya sigue a este usuario');
    }

    const usuarioSeguidores = this.usuarioSeguidoresRepository.create({
      ...seguidorData,
      seguidor,
      seguido,
    });

    return await this.usuarioSeguidoresRepository.save(usuarioSeguidores);
  }

  async findAll(): Promise<UsuarioSeguidores[]> {
    return await this.usuarioSeguidoresRepository.find({
      relations: ['seguidor', 'seguido'],
      order: { creadoEn: 'DESC' },
    });
  }

  async findOne(id: string): Promise<UsuarioSeguidores> {
    const usuarioSeguidores = await this.usuarioSeguidoresRepository.findOne({
      where: { id },
      relations: ['seguidor', 'seguido'],
    });

    if (!usuarioSeguidores) {
      throw new NotFoundException(`Relación de seguidores con ID ${id} no encontrada`);
    }

    return usuarioSeguidores;
  }

  async update(id: string, updateUsuarioSeguidoreDto: UpdateUsuarioSeguidoreDto): Promise<UsuarioSeguidores> {
    const usuarioSeguidores = await this.findOne(id);

    const { seguidorId, seguidoId, ...seguidorData } = updateUsuarioSeguidoreDto;

    if (seguidorId && seguidoId && seguidorId === seguidoId) {
      throw new BadRequestException('Un usuario no puede seguirse a sí mismo');
    }

    if (seguidorId) {
      const seguidor = await this.usuarioRepository.findOne({
        where: { id: seguidorId },
      });

      if (!seguidor) {
        throw new BadRequestException(`Usuario seguidor con ID ${seguidorId} no encontrado`);
      }

      usuarioSeguidores.seguidor = seguidor;
    }

    if (seguidoId) {
      const seguido = await this.usuarioRepository.findOne({
        where: { id: seguidoId },
      });

      if (!seguido) {
        throw new BadRequestException(`Usuario seguido con ID ${seguidoId} no encontrado`);
      }

      usuarioSeguidores.seguido = seguido;
    }

    Object.assign(usuarioSeguidores, seguidorData);
    return await this.usuarioSeguidoresRepository.save(usuarioSeguidores);
  }

  async remove(id: string): Promise<void> {
    const usuarioSeguidores = await this.findOne(id);
    await this.usuarioSeguidoresRepository.remove(usuarioSeguidores);
  }
}

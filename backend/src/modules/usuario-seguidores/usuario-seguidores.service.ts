import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
    const { seguidorId, seguidoId, ...rest } = createUsuarioSeguidoreDto;

    if (seguidorId === seguidoId) {
      throw new ConflictException('Un usuario no puede seguirse a sí mismo');
    }

    const seguidor = await this.usuarioRepository.findOne({ where: { id: seguidorId } });
    if (!seguidor) {
      throw new NotFoundException(`Usuario seguidor con ID ${seguidorId} no encontrado`);
    }

    const seguido = await this.usuarioRepository.findOne({ where: { id: seguidoId } });
    if (!seguido) {
      throw new NotFoundException(`Usuario seguido con ID ${seguidoId} no encontrado`);
    }

    const existeRelacion = await this.usuarioSeguidoresRepository.findOne({
      where: {
        seguidor: { id: seguidorId },
        seguido: { id: seguidoId },
      },
    });

    if (existeRelacion) {
      throw new ConflictException('Esta relación de seguimiento ya existe');
    }

    const usuarioSeguidor = this.usuarioSeguidoresRepository.create({
      ...rest,
      seguidor,
      seguido,
    });

    return await this.usuarioSeguidoresRepository.save(usuarioSeguidor);
  }

  async findAll(): Promise<UsuarioSeguidores[]> {
    return await this.usuarioSeguidoresRepository.find({
      relations: ['seguidor', 'seguido'],
      order: { creadoEn: 'DESC' },
    });
  }

  async findOne(id: string): Promise<UsuarioSeguidores> {
    const usuarioSeguidor = await this.usuarioSeguidoresRepository.findOne({
      where: { id },
      relations: ['seguidor', 'seguido'],
    });

    if (!usuarioSeguidor) {
      throw new NotFoundException(`Relación de seguimiento con ID ${id} no encontrada`);
    }

    return usuarioSeguidor;
  }

  async update(id: string, updateUsuarioSeguidoreDto: UpdateUsuarioSeguidoreDto): Promise<UsuarioSeguidores> {
    const usuarioSeguidor = await this.findOne(id);

    const { seguidorId, seguidoId, ...rest } = updateUsuarioSeguidoreDto;

    if (seguidorId && seguidoId && seguidorId === seguidoId) {
      throw new ConflictException('Un usuario no puede seguirse a sí mismo');
    }

    if (seguidorId) {
      const seguidor = await this.usuarioRepository.findOne({ where: { id: seguidorId } });
      if (!seguidor) {
        throw new NotFoundException(`Usuario seguidor con ID ${seguidorId} no encontrado`);
      }
      usuarioSeguidor.seguidor = seguidor;
    }

    if (seguidoId) {
      const seguido = await this.usuarioRepository.findOne({ where: { id: seguidoId } });
      if (!seguido) {
        throw new NotFoundException(`Usuario seguido con ID ${seguidoId} no encontrado`);
      }
      usuarioSeguidor.seguido = seguido;
    }

    Object.assign(usuarioSeguidor, rest);
    return await this.usuarioSeguidoresRepository.save(usuarioSeguidor);
  }

  async remove(id: string): Promise<void> {
    const usuarioSeguidor = await this.findOne(id);
    await this.usuarioSeguidoresRepository.remove(usuarioSeguidor);
  }
}

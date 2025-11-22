import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioRedSocialDto } from './dto/create-usuario-red-social.dto';
import { UpdateUsuarioRedSocialDto } from './dto/update-usuario-red-social.dto';
import { UsuarioRedSocial } from './entities/usuario-red-social.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class UsuarioRedSocialService {
  constructor(
    @InjectRepository(UsuarioRedSocial)
    private readonly usuarioRedSocialRepository: Repository<UsuarioRedSocial>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioRedSocialDto: CreateUsuarioRedSocialDto): Promise<UsuarioRedSocial> {
    const { usuarioId, ...rest } = createUsuarioRedSocialDto;

    const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
    }

    const usuarioRedSocial = this.usuarioRedSocialRepository.create({
      ...rest,
      usuario,
    });

    return await this.usuarioRedSocialRepository.save(usuarioRedSocial);
  }

  async findAll(): Promise<UsuarioRedSocial[]> {
    return await this.usuarioRedSocialRepository.find({
      relations: ['usuario'],
    });
  }

  async findOne(id: string): Promise<UsuarioRedSocial> {
    const usuarioRedSocial = await this.usuarioRedSocialRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });

    if (!usuarioRedSocial) {
      throw new NotFoundException(`Red social de usuario con ID ${id} no encontrada`);
    }

    return usuarioRedSocial;
  }

  async update(id: string, updateUsuarioRedSocialDto: UpdateUsuarioRedSocialDto): Promise<UsuarioRedSocial> {
    const usuarioRedSocial = await this.findOne(id);

    const { usuarioId, ...rest } = updateUsuarioRedSocialDto;

    if (usuarioId) {
      const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
      if (!usuario) {
        throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
      }
      usuarioRedSocial.usuario = usuario;
    }

    Object.assign(usuarioRedSocial, rest);
    return await this.usuarioRedSocialRepository.save(usuarioRedSocial);
  }

  async remove(id: string): Promise<void> {
    const usuarioRedSocial = await this.findOne(id);
    await this.usuarioRedSocialRepository.remove(usuarioRedSocial);
  }
}

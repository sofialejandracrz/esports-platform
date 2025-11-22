import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { Persona } from '../persona/entities/persona.entity';
import { CatalogoRol } from '../catalogo-rol/entities/catalogo-rol.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
    @InjectRepository(CatalogoRol)
    private readonly catalogoRolRepository: Repository<CatalogoRol>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const { personaId, rolId, ...rest } = createUsuarioDto;

    const existeNickname = await this.usuarioRepository.findOne({
      where: { nickname: createUsuarioDto.nickname },
    });

    if (existeNickname) {
      throw new ConflictException(`El nickname ${createUsuarioDto.nickname} ya está en uso`);
    }

    const persona = await this.personaRepository.findOne({ where: { id: personaId } });
    if (!persona) {
      throw new NotFoundException(`Persona con ID ${personaId} no encontrada`);
    }

    const rol = await this.catalogoRolRepository.findOne({ where: { id: rolId } });
    if (!rol) {
      throw new NotFoundException(`Rol con ID ${rolId} no encontrado`);
    }

    const usuario = this.usuarioRepository.create({
      ...rest,
      persona,
      rol,
    });

    return await this.usuarioRepository.save(usuario);
  }

  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find({
      relations: ['persona', 'rol'],
      order: { creadoEn: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['persona', 'rol', 'redesSociales', 'cuentasJuego', 'membresias', 'trofeos'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuario;
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.findOne(id);

    const { personaId, rolId, nickname, ...rest } = updateUsuarioDto;

    if (nickname && nickname !== usuario.nickname) {
      const existeNickname = await this.usuarioRepository.findOne({
        where: { nickname },
      });

      if (existeNickname) {
        throw new ConflictException(`El nickname ${nickname} ya está en uso`);
      }
      usuario.nickname = nickname;
    }

    if (personaId) {
      const persona = await this.personaRepository.findOne({ where: { id: personaId } });
      if (!persona) {
        throw new NotFoundException(`Persona con ID ${personaId} no encontrada`);
      }
      usuario.persona = persona;
    }

    if (rolId) {
      const rol = await this.catalogoRolRepository.findOne({ where: { id: rolId } });
      if (!rol) {
        throw new NotFoundException(`Rol con ID ${rolId} no encontrado`);
      }
      usuario.rol = rol;
    }

    Object.assign(usuario, rest);
    return await this.usuarioRepository.save(usuario);
  }

  async remove(id: string): Promise<void> {
    const usuario = await this.findOne(id);
    await this.usuarioRepository.softRemove(usuario);
  }
}

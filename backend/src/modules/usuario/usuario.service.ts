import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
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
    private readonly rolRepository: Repository<CatalogoRol>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const { personaId, rolId, ...usuarioData } = createUsuarioDto;

    const persona = await this.personaRepository.findOne({
      where: { id: personaId },
    });

    if (!persona) {
      throw new BadRequestException(`Persona con ID ${personaId} no encontrada`);
    }

    const rol = await this.rolRepository.findOne({
      where: { id: rolId },
    });

    if (!rol) {
      throw new BadRequestException(`Rol con ID ${rolId} no encontrado`);
    }

    try {
      const usuario = this.usuarioRepository.create({
        ...usuarioData,
        persona,
        rol,
      });

      return await this.usuarioRepository.save(usuario);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El nickname ya está en uso');
      }
      throw error;
    }
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
      relations: ['persona', 'rol'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuario;
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.findOne(id);

    const { personaId, rolId, ...usuarioData } = updateUsuarioDto;

    if (personaId) {
      const persona = await this.personaRepository.findOne({
        where: { id: personaId },
      });

      if (!persona) {
        throw new BadRequestException(`Persona con ID ${personaId} no encontrada`);
      }

      usuario.persona = persona;
    }

    if (rolId) {
      const rol = await this.rolRepository.findOne({
        where: { id: rolId },
      });

      if (!rol) {
        throw new BadRequestException(`Rol con ID ${rolId} no encontrado`);
      }

      usuario.rol = rol;
    }

    try {
      Object.assign(usuario, usuarioData);
      return await this.usuarioRepository.save(usuario);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El nickname ya está en uso');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const usuario = await this.findOne(id);
    await this.usuarioRepository.softRemove(usuario);
  }
}

import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioAmigoDto } from './dto/create-usuario-amigo.dto';
import { UpdateUsuarioAmigoDto } from './dto/update-usuario-amigo.dto';
import { UsuarioAmigos } from './entities/usuario-amigo.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { CatalogoEstadoAmistad } from '../catalogo-estado-amistad/entities/catalogo-estado-amistad.entity';

@Injectable()
export class UsuarioAmigosService {
  constructor(
    @InjectRepository(UsuarioAmigos)
    private readonly usuarioAmigosRepository: Repository<UsuarioAmigos>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(CatalogoEstadoAmistad)
    private readonly estadoAmistadRepository: Repository<CatalogoEstadoAmistad>,
  ) {}

  async create(createUsuarioAmigoDto: CreateUsuarioAmigoDto): Promise<UsuarioAmigos> {
    const { usuario1Id, usuario2Id, estadoId } = createUsuarioAmigoDto;

    if (usuario1Id === usuario2Id) {
      throw new BadRequestException('Un usuario no puede ser amigo de sí mismo');
    }

    const usuario1 = await this.usuarioRepository.findOne({
      where: { id: usuario1Id },
    });

    if (!usuario1) {
      throw new BadRequestException(`Usuario con ID ${usuario1Id} no encontrado`);
    }

    const usuario2 = await this.usuarioRepository.findOne({
      where: { id: usuario2Id },
    });

    if (!usuario2) {
      throw new BadRequestException(`Usuario con ID ${usuario2Id} no encontrado`);
    }

    const estado = await this.estadoAmistadRepository.findOne({
      where: { id: estadoId },
    });

    if (!estado) {
      throw new BadRequestException(`Estado de amistad con ID ${estadoId} no encontrado`);
    }

    const amistadExistente = await this.usuarioAmigosRepository.findOne({
      where: [
        { usuario1: { id: usuario1Id }, usuario2: { id: usuario2Id } },
        { usuario1: { id: usuario2Id }, usuario2: { id: usuario1Id } },
      ],
    });

    if (amistadExistente) {
      throw new ConflictException('Ya existe una relación de amistad entre estos usuarios');
    }

    const usuarioAmigos = this.usuarioAmigosRepository.create({
      usuario1,
      usuario2,
      estado,
    });

    return await this.usuarioAmigosRepository.save(usuarioAmigos);
  }

  async findAll(): Promise<UsuarioAmigos[]> {
    return await this.usuarioAmigosRepository.find({
      relations: ['usuario1', 'usuario2', 'estado'],
      order: { creadoEn: 'DESC' },
    });
  }

  async findOne(id: string): Promise<UsuarioAmigos> {
    const usuarioAmigos = await this.usuarioAmigosRepository.findOne({
      where: { id },
      relations: ['usuario1', 'usuario2', 'estado'],
    });

    if (!usuarioAmigos) {
      throw new NotFoundException(`Relación de amistad con ID ${id} no encontrada`);
    }

    return usuarioAmigos;
  }

  async update(id: string, updateUsuarioAmigoDto: UpdateUsuarioAmigoDto): Promise<UsuarioAmigos> {
    const usuarioAmigos = await this.findOne(id);

    const { usuario1Id, usuario2Id, estadoId } = updateUsuarioAmigoDto;

    if (usuario1Id && usuario2Id && usuario1Id === usuario2Id) {
      throw new BadRequestException('Un usuario no puede ser amigo de sí mismo');
    }

    if (usuario1Id) {
      const usuario1 = await this.usuarioRepository.findOne({
        where: { id: usuario1Id },
      });

      if (!usuario1) {
        throw new BadRequestException(`Usuario con ID ${usuario1Id} no encontrado`);
      }

      usuarioAmigos.usuario1 = usuario1;
    }

    if (usuario2Id) {
      const usuario2 = await this.usuarioRepository.findOne({
        where: { id: usuario2Id },
      });

      if (!usuario2) {
        throw new BadRequestException(`Usuario con ID ${usuario2Id} no encontrado`);
      }

      usuarioAmigos.usuario2 = usuario2;
    }

    if (estadoId) {
      const estado = await this.estadoAmistadRepository.findOne({
        where: { id: estadoId },
      });

      if (!estado) {
        throw new BadRequestException(`Estado de amistad con ID ${estadoId} no encontrado`);
      }

      usuarioAmigos.estado = estado;
    }

    return await this.usuarioAmigosRepository.save(usuarioAmigos);
  }

  async remove(id: string): Promise<void> {
    const usuarioAmigos = await this.findOne(id);
    await this.usuarioAmigosRepository.remove(usuarioAmigos);
  }
}

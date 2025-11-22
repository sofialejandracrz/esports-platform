import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTorneoInscripcionDto } from './dto/create-torneo-inscripcion.dto';
import { UpdateTorneoInscripcionDto } from './dto/update-torneo-inscripcion.dto';
import { TorneoInscripcion } from './entities/torneo-inscripcion.entity';
import { Torneo } from '../torneo/entities/torneo.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { CatalogoEstadoInscripcion } from '../catalogo-estado-inscripcion/entities/catalogo-estado-inscripcion.entity';

@Injectable()
export class TorneoInscripcionService {
  constructor(
    @InjectRepository(TorneoInscripcion)
    private readonly torneoInscripcionRepository: Repository<TorneoInscripcion>,
    @InjectRepository(Torneo)
    private readonly torneoRepository: Repository<Torneo>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(CatalogoEstadoInscripcion)
    private readonly catalogoEstadoInscripcionRepository: Repository<CatalogoEstadoInscripcion>,
  ) {}

  async create(createTorneoInscripcionDto: CreateTorneoInscripcionDto): Promise<TorneoInscripcion> {
    const { torneoId, usuarioId, estadoId, ...rest } = createTorneoInscripcionDto;

    const torneo = await this.torneoRepository.findOne({ where: { id: torneoId } });
    if (!torneo) {
      throw new NotFoundException(`Torneo con ID ${torneoId} no encontrado`);
    }

    const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
    }

    const estado = await this.catalogoEstadoInscripcionRepository.findOne({ where: { id: estadoId } });
    if (!estado) {
      throw new NotFoundException(`Estado de inscripción con ID ${estadoId} no encontrado`);
    }

    const existeInscripcion = await this.torneoInscripcionRepository.findOne({
      where: {
        torneo: { id: torneoId },
        usuario: { id: usuarioId },
      },
    });

    if (existeInscripcion) {
      throw new ConflictException(`El usuario ya está inscrito en este torneo`);
    }

    const torneoInscripcion = this.torneoInscripcionRepository.create({
      ...rest,
      torneo,
      usuario,
      estado,
    });

    return await this.torneoInscripcionRepository.save(torneoInscripcion);
  }

  async findAll(): Promise<TorneoInscripcion[]> {
    return await this.torneoInscripcionRepository.find({
      relations: ['torneo', 'usuario', 'estado'],
      order: { fecha: 'DESC' },
    });
  }

  async findOne(id: string): Promise<TorneoInscripcion> {
    const torneoInscripcion = await this.torneoInscripcionRepository.findOne({
      where: { id },
      relations: ['torneo', 'usuario', 'estado'],
    });

    if (!torneoInscripcion) {
      throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
    }

    return torneoInscripcion;
  }

  async update(id: string, updateTorneoInscripcionDto: UpdateTorneoInscripcionDto): Promise<TorneoInscripcion> {
    const torneoInscripcion = await this.findOne(id);

    const { torneoId, usuarioId, estadoId, ...rest } = updateTorneoInscripcionDto;

    if (torneoId) {
      const torneo = await this.torneoRepository.findOne({ where: { id: torneoId } });
      if (!torneo) {
        throw new NotFoundException(`Torneo con ID ${torneoId} no encontrado`);
      }
      torneoInscripcion.torneo = torneo;
    }

    if (usuarioId) {
      const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
      if (!usuario) {
        throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
      }
      torneoInscripcion.usuario = usuario;
    }

    if (estadoId) {
      const estado = await this.catalogoEstadoInscripcionRepository.findOne({ where: { id: estadoId } });
      if (!estado) {
        throw new NotFoundException(`Estado de inscripción con ID ${estadoId} no encontrado`);
      }
      torneoInscripcion.estado = estado;
    }

    Object.assign(torneoInscripcion, rest);
    return await this.torneoInscripcionRepository.save(torneoInscripcion);
  }

  async remove(id: string): Promise<void> {
    const torneoInscripcion = await this.findOne(id);
    await this.torneoInscripcionRepository.remove(torneoInscripcion);
  }
}

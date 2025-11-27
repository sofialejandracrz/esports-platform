import { ConflictException, Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
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

  // ============================================================================
  // INSCRIBIR USUARIO (1v1)
  // ============================================================================

  async inscribirUsuario(torneoId: string, usuarioId: string): Promise<TorneoInscripcion> {
    const torneo = await this.torneoRepository.findOne({ 
      where: { id: torneoId },
      relations: ['estado'],
    });
    if (!torneo) {
      throw new NotFoundException(`Torneo con ID ${torneoId} no encontrado`);
    }

    // Verificar que el torneo esté en estado "proximamente"
    if (torneo.estado?.valor !== 'proximamente') {
      throw new BadRequestException(`Solo se puede inscribir a torneos próximamente. Estado actual: ${torneo.estado?.valor}`);
    }

    // Verificar formato 1v1 (formato es string directo en la entidad)
    const formatoValor = torneo.formato;
    if (formatoValor && formatoValor !== '1v1') {
      throw new BadRequestException(`Este torneo requiere un equipo (formato ${formatoValor}). Usa el endpoint de inscripción con equipo.`);
    }

    const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
    }

    // Verificar si ya está inscrito
    const existeInscripcion = await this.torneoInscripcionRepository.findOne({
      where: {
        torneo: { id: torneoId },
        usuario: { id: usuarioId },
      },
    });

    if (existeInscripcion) {
      throw new ConflictException(`Ya estás inscrito en este torneo`);
    }

    // Verificar cupos disponibles
    const inscripcionesActuales = await this.torneoInscripcionRepository.count({
      where: { torneo: { id: torneoId } },
    });

    if (torneo.capacidad && inscripcionesActuales >= torneo.capacidad) {
      throw new BadRequestException(`El torneo ha alcanzado el máximo de participantes (${torneo.capacidad})`);
    }

    // Obtener estado "pendiente"
    const estadoPendiente = await this.catalogoEstadoInscripcionRepository.findOne({
      where: { valor: 'pendiente' },
    });
    if (!estadoPendiente) {
      throw new NotFoundException(`Estado de inscripción 'pendiente' no encontrado en el catálogo`);
    }

    const torneoInscripcion = this.torneoInscripcionRepository.create({
      torneo,
      usuario,
      estado: estadoPendiente,
      fecha: new Date(),
    });

    return await this.torneoInscripcionRepository.save(torneoInscripcion);
  }

  // ============================================================================
  // INSCRIBIR USUARIO CON EQUIPO (2v2+)
  // ============================================================================

  async inscribirUsuarioConEquipo(
    torneoId: string, 
    usuarioId: string, 
    equipoId: string
  ): Promise<TorneoInscripcion> {
    const torneo = await this.torneoRepository.findOne({ 
      where: { id: torneoId },
      relations: ['estado'],
    });
    if (!torneo) {
      throw new NotFoundException(`Torneo con ID ${torneoId} no encontrado`);
    }

    // Verificar que el torneo esté en estado "proximamente"
    if (torneo.estado?.valor !== 'proximamente') {
      throw new BadRequestException(`Solo se puede inscribir a torneos próximamente. Estado actual: ${torneo.estado?.valor}`);
    }

    // Verificar formato no sea 1v1 (formato es string directo)
    const formatoValor = torneo.formato;
    if (formatoValor === '1v1') {
      throw new BadRequestException(`Este torneo es 1v1, no necesitas un equipo. Usa el endpoint de inscripción individual.`);
    }

    const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
    }

    // TODO: Verificar que el equipo existe y el usuario es miembro/capitán
    // Esto se implementará cuando se cree el módulo de equipos
    // Por ahora solo validamos que se proporcione un equipoId

    // Verificar si ya está inscrito
    const existeInscripcion = await this.torneoInscripcionRepository.findOne({
      where: {
        torneo: { id: torneoId },
        usuario: { id: usuarioId },
      },
    });

    if (existeInscripcion) {
      throw new ConflictException(`Ya estás inscrito en este torneo`);
    }

    // Verificar cupos disponibles
    const inscripcionesActuales = await this.torneoInscripcionRepository.count({
      where: { torneo: { id: torneoId } },
    });

    if (torneo.capacidad && inscripcionesActuales >= torneo.capacidad) {
      throw new BadRequestException(`El torneo ha alcanzado el máximo de equipos (${torneo.capacidad})`);
    }

    // Obtener estado "pendiente"
    const estadoPendiente = await this.catalogoEstadoInscripcionRepository.findOne({
      where: { valor: 'pendiente' },
    });
    if (!estadoPendiente) {
      throw new NotFoundException(`Estado de inscripción 'pendiente' no encontrado en el catálogo`);
    }

    const torneoInscripcion = this.torneoInscripcionRepository.create({
      torneo,
      usuario,
      estado: estadoPendiente,
      fecha: new Date(),
      // TODO: Agregar equipo cuando se implemente el módulo
      // equipo: equipo,
    });

    return await this.torneoInscripcionRepository.save(torneoInscripcion);
  }

  // ============================================================================
  // VERIFICAR INSCRIPCIÓN
  // ============================================================================

  async verificarInscripcion(torneoId: string, usuarioId: string): Promise<{ inscrito: boolean; inscripcion?: TorneoInscripcion }> {
    const inscripcion = await this.torneoInscripcionRepository.findOne({
      where: {
        torneo: { id: torneoId },
        usuario: { id: usuarioId },
      },
      relations: ['estado'],
    });

    return {
      inscrito: !!inscripcion,
      inscripcion: inscripcion || undefined,
    };
  }

  // ============================================================================
  // CANCELAR INSCRIPCIÓN
  // ============================================================================

  async cancelarInscripcion(torneoId: string, usuarioId: string): Promise<{ message: string }> {
    const inscripcion = await this.torneoInscripcionRepository.findOne({
      where: {
        torneo: { id: torneoId },
        usuario: { id: usuarioId },
      },
      relations: ['torneo', 'torneo.estado'],
    });

    if (!inscripcion) {
      throw new NotFoundException(`No estás inscrito en este torneo`);
    }

    // Verificar que el torneo aún esté en estado "proximamente"
    if (inscripcion.torneo?.estado?.valor !== 'proximamente') {
      throw new BadRequestException(`No puedes cancelar tu inscripción, el torneo ya está ${inscripcion.torneo?.estado?.valor}`);
    }

    await this.torneoInscripcionRepository.remove(inscripcion);

    return { message: 'Inscripción cancelada exitosamente' };
  }

  // ============================================================================
  // OBTENER INSCRITOS DE UN TORNEO
  // ============================================================================

  async obtenerInscritosTorneo(torneoId: string): Promise<TorneoInscripcion[]> {
    return await this.torneoInscripcionRepository.find({
      where: { torneo: { id: torneoId } },
      relations: ['usuario', 'estado'],
      order: { fecha: 'ASC' },
    });
  }

  // ============================================================================
  // CRUD BÁSICO
  // ============================================================================

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

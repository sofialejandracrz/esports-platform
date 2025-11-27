import { ConflictException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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
    private readonly catalogoEstadoAmistadRepository: Repository<CatalogoEstadoAmistad>,
  ) {}

  /**
   * Enviar solicitud de amistad
   * El usuario autenticado (solicitanteId) envía solicitud al destinatarioId
   */
  async enviarSolicitud(solicitanteId: string, destinatarioId: string): Promise<UsuarioAmigos> {
    // No puedes enviarte solicitud a ti mismo
    if (solicitanteId === destinatarioId) {
      throw new ConflictException('No puedes enviarte una solicitud de amistad a ti mismo');
    }

    // Verificar que ambos usuarios existen
    const solicitante = await this.usuarioRepository.findOne({ where: { id: solicitanteId } });
    if (!solicitante) {
      throw new NotFoundException('Usuario solicitante no encontrado');
    }

    const destinatario = await this.usuarioRepository.findOne({ where: { id: destinatarioId } });
    if (!destinatario) {
      throw new NotFoundException('Usuario destinatario no encontrado');
    }

    // Verificar si ya existe una relación
    const existeRelacion = await this.usuarioAmigosRepository.findOne({
      where: [
        { usuario1: { id: solicitanteId }, usuario2: { id: destinatarioId } },
        { usuario1: { id: destinatarioId }, usuario2: { id: solicitanteId } },
      ],
      relations: ['estado'],
    });

    if (existeRelacion) {
      if (existeRelacion.estado.valor === 'aceptado') {
        throw new ConflictException('Ya son amigos');
      }
      if (existeRelacion.estado.valor === 'pendiente') {
        throw new ConflictException('Ya existe una solicitud de amistad pendiente');
      }
      if (existeRelacion.estado.valor === 'bloqueado') {
        throw new ForbiddenException('No puedes enviar solicitud a este usuario');
      }
    }

    // Obtener el estado "pendiente"
    const estadoPendiente = await this.catalogoEstadoAmistadRepository.findOne({
      where: { valor: 'pendiente' },
    });

    if (!estadoPendiente) {
      throw new NotFoundException('Estado de amistad "pendiente" no configurado en el sistema');
    }

    // Crear la solicitud
    const solicitud = this.usuarioAmigosRepository.create({
      usuario1: solicitante,  // Quien envía la solicitud
      usuario2: destinatario, // Quien recibe la solicitud
      estado: estadoPendiente,
    });

    return await this.usuarioAmigosRepository.save(solicitud);
  }

  /**
   * Aceptar solicitud de amistad
   * Solo el destinatario (usuario2) puede aceptar
   */
  async aceptarSolicitud(solicitudId: string, usuarioId: string): Promise<UsuarioAmigos> {
    const solicitud = await this.usuarioAmigosRepository.findOne({
      where: { id: solicitudId },
      relations: ['usuario1', 'usuario2', 'estado'],
    });

    if (!solicitud) {
      throw new NotFoundException('Solicitud de amistad no encontrada');
    }

    // Solo el destinatario puede aceptar
    if (solicitud.usuario2.id !== usuarioId) {
      throw new ForbiddenException('No tienes permiso para aceptar esta solicitud');
    }

    if (solicitud.estado.valor !== 'pendiente') {
      throw new ConflictException('Esta solicitud ya fue procesada');
    }

    // Obtener el estado "aceptado"
    const estadoAceptado = await this.catalogoEstadoAmistadRepository.findOne({
      where: { valor: 'aceptado' },
    });

    if (!estadoAceptado) {
      throw new NotFoundException('Estado de amistad "aceptado" no configurado en el sistema');
    }

    solicitud.estado = estadoAceptado;
    return await this.usuarioAmigosRepository.save(solicitud);
  }

  /**
   * Rechazar solicitud de amistad
   * Solo el destinatario (usuario2) puede rechazar
   */
  async rechazarSolicitud(solicitudId: string, usuarioId: string): Promise<void> {
    const solicitud = await this.usuarioAmigosRepository.findOne({
      where: { id: solicitudId },
      relations: ['usuario1', 'usuario2', 'estado'],
    });

    if (!solicitud) {
      throw new NotFoundException('Solicitud de amistad no encontrada');
    }

    // Solo el destinatario puede rechazar
    if (solicitud.usuario2.id !== usuarioId) {
      throw new ForbiddenException('No tienes permiso para rechazar esta solicitud');
    }

    if (solicitud.estado.valor !== 'pendiente') {
      throw new ConflictException('Esta solicitud ya fue procesada');
    }

    // Eliminar la solicitud (o cambiar a estado rechazado)
    await this.usuarioAmigosRepository.remove(solicitud);
  }

  /**
   * Cancelar solicitud de amistad enviada
   * Solo el solicitante (usuario1) puede cancelar
   */
  async cancelarSolicitud(solicitudId: string, usuarioId: string): Promise<void> {
    const solicitud = await this.usuarioAmigosRepository.findOne({
      where: { id: solicitudId },
      relations: ['usuario1', 'usuario2', 'estado'],
    });

    if (!solicitud) {
      throw new NotFoundException('Solicitud de amistad no encontrada');
    }

    // Solo el solicitante puede cancelar
    if (solicitud.usuario1.id !== usuarioId) {
      throw new ForbiddenException('No tienes permiso para cancelar esta solicitud');
    }

    if (solicitud.estado.valor !== 'pendiente') {
      throw new ConflictException('Solo puedes cancelar solicitudes pendientes');
    }

    await this.usuarioAmigosRepository.remove(solicitud);
  }

  /**
   * Eliminar amigo (romper amistad)
   * Cualquiera de los dos puede eliminar la amistad
   */
  async eliminarAmigo(amistadId: string, usuarioId: string): Promise<void> {
    const amistad = await this.usuarioAmigosRepository.findOne({
      where: { id: amistadId },
      relations: ['usuario1', 'usuario2', 'estado'],
    });

    if (!amistad) {
      throw new NotFoundException('Relación de amistad no encontrada');
    }

    // Verificar que el usuario es parte de la amistad
    if (amistad.usuario1.id !== usuarioId && amistad.usuario2.id !== usuarioId) {
      throw new ForbiddenException('No tienes permiso para eliminar esta amistad');
    }

    if (amistad.estado.valor !== 'aceptado') {
      throw new ConflictException('Esta relación no es una amistad activa');
    }

    await this.usuarioAmigosRepository.remove(amistad);
  }

  /**
   * Obtener solicitudes pendientes recibidas por un usuario
   */
  async obtenerSolicitudesRecibidas(usuarioId: string): Promise<UsuarioAmigos[]> {
    return await this.usuarioAmigosRepository.find({
      where: {
        usuario2: { id: usuarioId },
        estado: { valor: 'pendiente' },
      },
      relations: ['usuario1', 'usuario1.avatar', 'estado'],
      order: { creadoEn: 'DESC' },
    });
  }

  /**
   * Obtener solicitudes pendientes enviadas por un usuario
   */
  async obtenerSolicitudesEnviadas(usuarioId: string): Promise<UsuarioAmigos[]> {
    return await this.usuarioAmigosRepository.find({
      where: {
        usuario1: { id: usuarioId },
        estado: { valor: 'pendiente' },
      },
      relations: ['usuario2', 'usuario2.avatar', 'estado'],
      order: { creadoEn: 'DESC' },
    });
  }

  async create(createUsuarioAmigoDto: CreateUsuarioAmigoDto): Promise<UsuarioAmigos> {
    const { usuario1Id, usuario2Id, estadoId } = createUsuarioAmigoDto;

    const usuario1 = await this.usuarioRepository.findOne({ where: { id: usuario1Id } });
    if (!usuario1) {
      throw new NotFoundException(`Usuario con ID ${usuario1Id} no encontrado`);
    }

    const usuario2 = await this.usuarioRepository.findOne({ where: { id: usuario2Id } });
    if (!usuario2) {
      throw new NotFoundException(`Usuario con ID ${usuario2Id} no encontrado`);
    }

    const estado = await this.catalogoEstadoAmistadRepository.findOne({ where: { id: estadoId } });
    if (!estado) {
      throw new NotFoundException(`Estado de amistad con ID ${estadoId} no encontrado`);
    }

    const existeRelacion = await this.usuarioAmigosRepository.findOne({
      where: [
        { usuario1: { id: usuario1Id }, usuario2: { id: usuario2Id } },
        { usuario1: { id: usuario2Id }, usuario2: { id: usuario1Id } },
      ],
    });

    if (existeRelacion) {
      throw new ConflictException('La relación de amistad ya existe entre estos usuarios');
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

    if (usuario1Id) {
      const usuario1 = await this.usuarioRepository.findOne({ where: { id: usuario1Id } });
      if (!usuario1) {
        throw new NotFoundException(`Usuario con ID ${usuario1Id} no encontrado`);
      }
      usuarioAmigos.usuario1 = usuario1;
    }

    if (usuario2Id) {
      const usuario2 = await this.usuarioRepository.findOne({ where: { id: usuario2Id } });
      if (!usuario2) {
        throw new NotFoundException(`Usuario con ID ${usuario2Id} no encontrado`);
      }
      usuarioAmigos.usuario2 = usuario2;
    }

    if (estadoId) {
      const estado = await this.catalogoEstadoAmistadRepository.findOne({ where: { id: estadoId } });
      if (!estado) {
        throw new NotFoundException(`Estado de amistad con ID ${estadoId} no encontrado`);
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

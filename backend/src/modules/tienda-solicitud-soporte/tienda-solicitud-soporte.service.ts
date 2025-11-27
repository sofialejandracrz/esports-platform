import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { TiendaSolicitudSoporte } from './entities/tienda-solicitud-soporte.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { ResolverSolicitudDto, ObtenerSolicitudesDto } from './dto';
import {
  ProcedureResult,
  SolicitudesResponse,
  ResolverSolicitudResponse,
} from '../tienda/types';

@Injectable()
export class TiendaSolicitudSoporteService {
  constructor(
    @InjectRepository(TiendaSolicitudSoporte)
    private readonly solicitudRepository: Repository<TiendaSolicitudSoporte>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * 8. Obtener solicitudes de soporte (ADMIN)
   * Llama al procedimiento: tienda_obtener_solicitudes_soporte
   */
  async obtenerSolicitudes(dto: ObtenerSolicitudesDto): Promise<SolicitudesResponse> {
    const result = await this.dataSource.query(
      `SELECT tienda_obtener_solicitudes_soporte($1, $2, $3) as resultado`,
      [dto.estado || null, dto.limit || 20, dto.offset || 0]
    );
    
    return result[0]?.resultado as SolicitudesResponse;
  }

  /**
   * 9. Resolver solicitud de soporte (ADMIN)
   * Llama al procedimiento: tienda_resolver_solicitud_soporte
   */
  async resolverSolicitud(adminId: string, dto: ResolverSolicitudDto): Promise<ResolverSolicitudResponse> {
    const result = await this.dataSource.query(
      `SELECT tienda_resolver_solicitud_soporte($1, $2, $3, $4) as resultado`,
      [dto.solicitudId, adminId, dto.aprobar, dto.notas || null]
    );
    
    const response = result[0]?.resultado as ResolverSolicitudResponse;
    
    if (!response.success) {
      if (response.error?.includes('administrador')) {
        throw new ForbiddenException(response.error);
      }
      throw new BadRequestException(response.error || 'Error al resolver la solicitud');
    }
    
    return response;
  }

  /**
   * Obtener solicitudes del usuario actual
   */
  async obtenerMisSolicitudes(usuarioId: string): Promise<TiendaSolicitudSoporte[]> {
    return this.solicitudRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: ['orden', 'resueltoPor'],
      order: { creadoEn: 'DESC' },
    });
  }

  /**
   * Obtener detalle de una solicitud
   */
  async obtenerSolicitudPorId(solicitudId: string): Promise<TiendaSolicitudSoporte> {
    return this.solicitudRepository.findOne({
      where: { id: solicitudId },
      relations: ['usuario', 'orden', 'resueltoPor'],
    });
  }
}

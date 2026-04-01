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
import { OracleFunctionHelper } from '../../common/helpers/oracle-function.helper';

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
   * PG: tienda_obtener_solicitudes_soporte
   * Oracle: PKG_TIENDA.FN_OBTENER_SOLICITUDES_SOPORTE
   */
  async obtenerSolicitudes(dto: ObtenerSolicitudesDto): Promise<SolicitudesResponse> {
    const result = await OracleFunctionHelper.callFunction(
      this.dataSource,
      'tienda_obtener_solicitudes_soporte',
      'PKG_TIENDA.FN_OBTENER_SOLICITUDES_SOPORTE',
      [dto.estado || null, dto.limit || 20, dto.offset || 0],
    );
    
    return result as SolicitudesResponse;
  }

  /**
   * 9. Resolver solicitud de soporte (ADMIN)
   * PG: tienda_resolver_solicitud_soporte
   * Oracle: PKG_TIENDA.FN_RESOLVER_SOLICITUD_SOPORTE
   */
  async resolverSolicitud(adminId: string, dto: ResolverSolicitudDto): Promise<ResolverSolicitudResponse> {
    const response = await OracleFunctionHelper.callFunction(
      this.dataSource,
      'tienda_resolver_solicitud_soporte',
      'PKG_TIENDA.FN_RESOLVER_SOLICITUD_SOPORTE',
      [dto.solicitudId, adminId, dto.aprobar, dto.notas || null],
    ) as ResolverSolicitudResponse;
    
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
      where: { usuario: { id: +usuarioId } },
      relations: ['orden', 'resueltoPor'],
      order: { creadoEn: 'DESC' },
    });
  }

  /**
   * Obtener detalle de una solicitud
   */
  async obtenerSolicitudPorId(solicitudId: string): Promise<TiendaSolicitudSoporte> {
    return this.solicitudRepository.findOne({
      where: { id: +solicitudId },
      relations: ['usuario', 'orden', 'resueltoPor'],
    });
  }
}

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  CrearTorneoFuncionDto,
  ActualizarTorneoFuncionDto,
  CambiarEstadoTorneoDto,
  UpsertRedSocialTorneoDto,
  ListarTorneosQueryDto,
  FinalizarTorneoDto,
  TorneoCrearResponse,
  TorneoActualizarResponse,
  TorneoCambiarEstadoResponse,
  TorneoRedSocialResponse,
  TorneoDetalleResponse,
  TorneoListarResponse,
  TorneoCatalogosResponse,
  TorneoFinalizarResponse,
} from './dto/torneo-funciones.dto';
import { OracleFunctionHelper } from '../../common/helpers/oracle-function.helper';

/**
 * ============================================================================
 * TorneoFuncionesService
 * 
 * Servicio que ejecuta las funciones almacenadas para manejar la gestión
 * completa de torneos. Compatible con PostgreSQL y Oracle.
 * 
 * PostgreSQL: funciones independientes (torneo_crear, torneo_actualizar, etc.)
 * Oracle: funciones empaquetadas en PKG_TORNEO (FN_CREAR, FN_ACTUALIZAR, etc.)
 * ============================================================================
 */
@Injectable()
export class TorneoFuncionesService {
  constructor(private readonly dataSource: DataSource) {}

  // ============================================================================
  // CREAR TORNEO
  // ============================================================================

  /**
   * Crea un nuevo torneo.
   * PG: torneo_crear
   * Oracle: PKG_TORNEO.FN_CREAR
   */
  async crearTorneo(
    anfitrionId: string,
    dto: CrearTorneoFuncionDto,
  ): Promise<TorneoCrearResponse> {
    try {
      const response = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'torneo_crear',
        'PKG_TORNEO.FN_CREAR',
        [
          anfitrionId,
          dto.titulo,
          dto.descripcion ?? null,
          dto.fecha_inicio_registro ?? null,
          dto.fecha_fin_registro ?? null,
          dto.fecha_inicio_torneo ?? null,
          dto.juego_id ?? null,
          dto.plataforma_id ?? null,
          dto.modo_juego_id ?? null,
          dto.region_id ?? null,
          dto.tipo_torneo_id ?? null,
          dto.al_mejor_de ?? 1,
          dto.formato ?? '1v1',
          dto.cerrado ?? false,
          dto.reglas ?? null,
          dto.jugadores_pc_permitidos ?? true,
          dto.requiere_transmision ?? false,
          dto.requiere_camara ?? false,
          dto.tipo_entrada_id ?? null,
          dto.capacidad ?? null,
          dto.cuota ?? 0,
          dto.comision_porcentaje ?? 0,
          dto.ganador1_porcentaje ?? 70,
          dto.ganador2_porcentaje ?? 30,
          dto.contacto_anfitrion ?? null,
          dto.discord_servidor ?? null,
          dto.redes_sociales ? JSON.stringify(dto.redes_sociales) : '[]',
          dto.banner_url ?? null,
          dto.miniatura_url ?? null,
        ],
      ) as TorneoCrearResponse;
      
      if (!response.success) {
        throw new BadRequestException(response.error || 'Error al crear el torneo');
      }

      return response;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // ============================================================================
  // ACTUALIZAR TORNEO
  // ============================================================================

  /**
   * Actualiza un torneo existente.
   * PG: torneo_actualizar
   * Oracle: PKG_TORNEO.FN_ACTUALIZAR
   */
  async actualizarTorneo(
    torneoId: string,
    anfitrionId: string,
    dto: ActualizarTorneoFuncionDto,
  ): Promise<TorneoActualizarResponse> {
    try {
      const response = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'torneo_actualizar',
        'PKG_TORNEO.FN_ACTUALIZAR',
        [
          torneoId,
          anfitrionId,
          dto.titulo ?? null,
          dto.descripcion ?? null,
          dto.fecha_inicio_registro ?? null,
          dto.fecha_fin_registro ?? null,
          dto.fecha_inicio_torneo ?? null,
          dto.juego_id ?? null,
          dto.plataforma_id ?? null,
          dto.modo_juego_id ?? null,
          dto.region_id ?? null,
          dto.tipo_torneo_id ?? null,
          dto.al_mejor_de ?? null,
          dto.formato ?? null,
          dto.cerrado ?? null,
          dto.reglas ?? null,
          dto.jugadores_pc_permitidos ?? null,
          dto.requiere_transmision ?? null,
          dto.requiere_camara ?? null,
          dto.tipo_entrada_id ?? null,
          dto.capacidad ?? null,
          dto.cuota ?? null,
          dto.comision_porcentaje ?? null,
          dto.ganador1_porcentaje ?? null,
          dto.ganador2_porcentaje ?? null,
          dto.contacto_anfitrion ?? null,
          dto.discord_servidor ?? null,
          dto.banner_url ?? null,
          dto.miniatura_url ?? null,
        ],
      ) as TorneoActualizarResponse;
      
      if (!response.success) {
        this.throwSpecificError(response.error);
      }

      return response;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // ============================================================================
  // CAMBIAR ESTADO
  // ============================================================================

  /**
   * Cambia el estado de un torneo.
   * PG: torneo_cambiar_estado
   * Oracle: PKG_TORNEO.FN_CAMBIAR_ESTADO
   */
  async cambiarEstado(
    torneoId: string,
    anfitrionId: string,
    dto: CambiarEstadoTorneoDto,
  ): Promise<TorneoCambiarEstadoResponse> {
    try {
      const response = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'torneo_cambiar_estado',
        'PKG_TORNEO.FN_CAMBIAR_ESTADO',
        [torneoId, anfitrionId, dto.nuevo_estado],
      ) as TorneoCambiarEstadoResponse;
      
      if (!response.success) {
        this.throwSpecificError(response.error);
      }

      return response;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // ============================================================================
  // REDES SOCIALES DEL TORNEO
  // ============================================================================

  /**
   * Crea o actualiza una red social del torneo.
   * PG: torneo_upsert_red_social
   * Oracle: PKG_TORNEO.FN_UPSERT_RED_SOCIAL
   */
  async upsertRedSocial(
    torneoId: string,
    anfitrionId: string,
    dto: UpsertRedSocialTorneoDto,
  ): Promise<TorneoRedSocialResponse> {
    try {
      const response = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'torneo_upsert_red_social',
        'PKG_TORNEO.FN_UPSERT_RED_SOCIAL',
        [torneoId, anfitrionId, dto.plataforma, dto.url, dto.red_id ?? null],
      ) as TorneoRedSocialResponse;
      
      if (!response.success) {
        this.throwSpecificError(response.error);
      }

      return response;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  /**
   * Elimina una red social del torneo.
   * PG: torneo_eliminar_red_social
   * Oracle: PKG_TORNEO.FN_ELIMINAR_RED_SOCIAL
   */
  async eliminarRedSocial(
    torneoId: string,
    anfitrionId: string,
    redId: string,
  ): Promise<TorneoRedSocialResponse> {
    try {
      const response = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'torneo_eliminar_red_social',
        'PKG_TORNEO.FN_ELIMINAR_RED_SOCIAL',
        [torneoId, anfitrionId, redId],
      ) as TorneoRedSocialResponse;
      
      if (!response.success) {
        this.throwSpecificError(response.error);
      }

      return response;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // ============================================================================
  // OBTENER DETALLE DEL TORNEO
  // ============================================================================

  /**
   * Obtiene toda la información detallada de un torneo.
   * PG: torneo_obtener_detalle
   * Oracle: PKG_TORNEO.FN_OBTENER_DETALLE
   */
  async obtenerDetalle(torneoId: string): Promise<TorneoDetalleResponse> {
    try {
      const response = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'torneo_obtener_detalle',
        'PKG_TORNEO.FN_OBTENER_DETALLE',
        [torneoId],
      ) as TorneoDetalleResponse;
      
      if (!response.success) {
        throw new NotFoundException(response.error || 'Torneo no encontrado');
      }

      return response;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // ============================================================================
  // LISTAR TORNEOS
  // ============================================================================

  /**
   * Lista torneos con filtros opcionales.
   * PG: torneo_listar
   * Oracle: PKG_TORNEO.FN_LISTAR
   */
  async listarTorneos(query: ListarTorneosQueryDto): Promise<TorneoListarResponse> {
    try {
      const response = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'torneo_listar',
        'PKG_TORNEO.FN_LISTAR',
        [
          query.estado ?? null,
          query.juego_id ?? null,
          query.region_id ?? null,
          query.anfitrion_id ?? null,
          query.busqueda ?? null,
          query.limit ?? 20,
          query.offset ?? 0,
        ],
      ) as TorneoListarResponse;
      
      if (!response.success) {
        throw new BadRequestException(response.error || 'Error al listar torneos');
      }

      return response;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // ============================================================================
  // OBTENER CATÁLOGOS PARA FORMULARIO
  // ============================================================================

  /**
   * Obtiene todos los catálogos necesarios para el formulario de creación.
   * PG: torneo_obtener_catalogos
   * Oracle: PKG_TORNEO.FN_OBTENER_CATALOGOS
   */
  async obtenerCatalogos(): Promise<TorneoCatalogosResponse> {
    try {
      const response = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'torneo_obtener_catalogos',
        'PKG_TORNEO.FN_OBTENER_CATALOGOS',
        [],
      ) as TorneoCatalogosResponse;
      
      if (!response.success) {
        throw new BadRequestException(response.error || 'Error al obtener catálogos');
      }

      return response;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // ============================================================================
  // FINALIZAR TORNEO
  // ============================================================================

  /**
   * Finaliza un torneo, registra resultados, asigna trofeos y distribuye premios.
   * PG: torneo_finalizar
   * Oracle: PKG_TORNEO.FN_FINALIZAR
   */
  async finalizarTorneo(
    torneoId: string,
    anfitrionId: string,
    dto: FinalizarTorneoDto,
  ): Promise<TorneoFinalizarResponse> {
    try {
      const response = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'torneo_finalizar',
        'PKG_TORNEO.FN_FINALIZAR',
        [torneoId, anfitrionId, JSON.stringify(dto.resultados)],
      ) as TorneoFinalizarResponse;
      
      if (!response.success) {
        this.throwSpecificError(response.error);
      }

      return response;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // ============================================================================
  // UTILIDADES
  // ============================================================================

  /**
   * Lanza errores específicos basados en el mensaje de error.
   * Compatible con mensajes de PostgreSQL y Oracle.
   */
  private throwSpecificError(errorMessage: string): never {
    if (errorMessage?.includes('no existe')) {
      throw new NotFoundException(errorMessage);
    }
    if (errorMessage?.includes('Solo el anfitrión') || errorMessage?.includes('ORA-20403')) {
      throw new ForbiddenException(errorMessage);
    }
    if (errorMessage?.includes('no puede')) {
      throw new BadRequestException(errorMessage);
    }
    throw new BadRequestException(errorMessage || 'Error en la operación');
  }

  /**
   * Maneja errores de la base de datos de forma consistente.
   * Compatible con errores de PostgreSQL y Oracle.
   */
  private handleDatabaseError(error: any): never {
    // Si ya es un error de NestJS, re-lanzarlo
    if (
      error instanceof NotFoundException ||
      error instanceof BadRequestException ||
      error instanceof ForbiddenException
    ) {
      throw error;
    }

    const errorMsg = error.message || '';

    // Errores de RAISE EXCEPTION (PG) o RAISE_APPLICATION_ERROR (Oracle)
    if (errorMsg.includes('no existe') || errorMsg.includes('ORA-20404')) {
      throw new NotFoundException(errorMsg);
    }
    if (errorMsg.includes('Solo el anfitrión') || errorMsg.includes('ORA-20403')) {
      throw new ForbiddenException(errorMsg);
    }
    if (errorMsg.includes('obligatorio') || errorMsg.includes('requerid')) {
      throw new BadRequestException(errorMsg);
    }
    if (errorMsg.includes('no puede') || errorMsg.includes('no válid')) {
      throw new BadRequestException(errorMsg);
    }

    // Error genérico
    console.error('Error en TorneoFuncionesService:', error);
    throw new BadRequestException('Error al procesar la solicitud');
  }
}

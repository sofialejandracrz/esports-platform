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

/**
 * ============================================================================
 * TorneoFuncionesService
 * 
 * Servicio que ejecuta las funciones almacenadas de PostgreSQL para manejar
 * la gestión completa de torneos.
 * 
 * Funciones consumidas:
 * - torneo_crear: Crea un nuevo torneo
 * - torneo_actualizar: Actualiza un torneo existente
 * - torneo_cambiar_estado: Cambia el estado del torneo
 * - torneo_upsert_red_social: Crea/actualiza red social del torneo
 * - torneo_eliminar_red_social: Elimina red social del torneo
 * - torneo_obtener_detalle: Obtiene toda la información de un torneo
 * - torneo_listar: Lista torneos con filtros
 * - torneo_obtener_catalogos: Obtiene catálogos para el formulario
 * - torneo_finalizar: Finaliza torneo y distribuye premios
 * ============================================================================
 */
@Injectable()
export class TorneoFuncionesService {
  constructor(private readonly dataSource: DataSource) {}

  // ============================================================================
  // CREAR TORNEO
  // ============================================================================

  /**
   * Crea un nuevo torneo usando la función almacenada torneo_crear.
   * 
   * @param anfitrionId - UUID del usuario que crea el torneo
   * @param dto - Datos del torneo a crear
   */
  async crearTorneo(
    anfitrionId: string,
    dto: CrearTorneoFuncionDto,
  ): Promise<TorneoCrearResponse> {
    try {
      const result = await this.dataSource.query(
        `SELECT torneo_crear(
          $1,   -- p_anfitrion_id
          $2,   -- p_titulo
          $3,   -- p_descripcion
          $4,   -- p_fecha_inicio_registro
          $5,   -- p_fecha_fin_registro
          $6,   -- p_fecha_inicio_torneo
          $7,   -- p_juego_id
          $8,   -- p_plataforma_id
          $9,   -- p_modo_juego_id
          $10,  -- p_region_id
          $11,  -- p_tipo_torneo_id
          $12,  -- p_al_mejor_de
          $13,  -- p_formato
          $14,  -- p_cerrado
          $15,  -- p_reglas
          $16,  -- p_jugadores_pc_permitidos
          $17,  -- p_requiere_transmision
          $18,  -- p_requiere_camara
          $19,  -- p_tipo_entrada_id
          $20,  -- p_capacidad
          $21,  -- p_cuota
          $22,  -- p_comision_porcentaje
          $23,  -- p_ganador1_porcentaje
          $24,  -- p_ganador2_porcentaje
          $25,  -- p_contacto_anfitrion
          $26,  -- p_discord_servidor
          $27,  -- p_redes_sociales
          $28,  -- p_banner_url
          $29   -- p_miniatura_url
        ) as resultado`,
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
      );

      const response = result[0].resultado as TorneoCrearResponse;
      
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
   * Solo el anfitrión puede modificar su torneo.
   * 
   * @param torneoId - UUID del torneo a actualizar
   * @param anfitrionId - UUID del usuario que hace la solicitud
   * @param dto - Datos a actualizar
   */
  async actualizarTorneo(
    torneoId: string,
    anfitrionId: string,
    dto: ActualizarTorneoFuncionDto,
  ): Promise<TorneoActualizarResponse> {
    try {
      const result = await this.dataSource.query(
        `SELECT torneo_actualizar(
          $1,   -- p_torneo_id
          $2,   -- p_anfitrion_id
          $3,   -- p_titulo
          $4,   -- p_descripcion
          $5,   -- p_fecha_inicio_registro
          $6,   -- p_fecha_fin_registro
          $7,   -- p_fecha_inicio_torneo
          $8,   -- p_juego_id
          $9,   -- p_plataforma_id
          $10,  -- p_modo_juego_id
          $11,  -- p_region_id
          $12,  -- p_tipo_torneo_id
          $13,  -- p_al_mejor_de
          $14,  -- p_formato
          $15,  -- p_cerrado
          $16,  -- p_reglas
          $17,  -- p_jugadores_pc_permitidos
          $18,  -- p_requiere_transmision
          $19,  -- p_requiere_camara
          $20,  -- p_tipo_entrada_id
          $21,  -- p_capacidad
          $22,  -- p_cuota
          $23,  -- p_comision_porcentaje
          $24,  -- p_ganador1_porcentaje
          $25,  -- p_ganador2_porcentaje
          $26,  -- p_contacto_anfitrion
          $27,  -- p_discord_servidor
          $28,  -- p_banner_url
          $29   -- p_miniatura_url
        ) as resultado`,
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
      );

      const response = result[0].resultado as TorneoActualizarResponse;
      
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
   * Estados: proximamente, en_curso, terminado, cancelado
   */
  async cambiarEstado(
    torneoId: string,
    anfitrionId: string,
    dto: CambiarEstadoTorneoDto,
  ): Promise<TorneoCambiarEstadoResponse> {
    try {
      const result = await this.dataSource.query(
        `SELECT torneo_cambiar_estado($1, $2, $3) as resultado`,
        [torneoId, anfitrionId, dto.nuevo_estado],
      );

      const response = result[0].resultado as TorneoCambiarEstadoResponse;
      
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
   */
  async upsertRedSocial(
    torneoId: string,
    anfitrionId: string,
    dto: UpsertRedSocialTorneoDto,
  ): Promise<TorneoRedSocialResponse> {
    try {
      const result = await this.dataSource.query(
        `SELECT torneo_upsert_red_social($1, $2, $3, $4, $5) as resultado`,
        [torneoId, anfitrionId, dto.plataforma, dto.url, dto.red_id ?? null],
      );

      const response = result[0].resultado as TorneoRedSocialResponse;
      
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
   */
  async eliminarRedSocial(
    torneoId: string,
    anfitrionId: string,
    redId: string,
  ): Promise<TorneoRedSocialResponse> {
    try {
      const result = await this.dataSource.query(
        `SELECT torneo_eliminar_red_social($1, $2, $3) as resultado`,
        [torneoId, anfitrionId, redId],
      );

      const response = result[0].resultado as TorneoRedSocialResponse;
      
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
   */
  async obtenerDetalle(torneoId: string): Promise<TorneoDetalleResponse> {
    try {
      const result = await this.dataSource.query(
        `SELECT torneo_obtener_detalle($1) as resultado`,
        [torneoId],
      );

      const response = result[0].resultado as TorneoDetalleResponse;
      
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
   */
  async listarTorneos(query: ListarTorneosQueryDto): Promise<TorneoListarResponse> {
    try {
      const result = await this.dataSource.query(
        `SELECT torneo_listar($1, $2, $3, $4, $5, $6, $7) as resultado`,
        [
          query.estado ?? null,
          query.juego_id ?? null,
          query.region_id ?? null,
          query.anfitrion_id ?? null,
          query.busqueda ?? null,
          query.limit ?? 20,
          query.offset ?? 0,
        ],
      );

      const response = result[0].resultado as TorneoListarResponse;
      
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
   * Incluye: juegos (con plataformas y modos), regiones, tipos de torneo,
   * tipos de entrada, opciones de "al mejor de", formatos, y redes sociales.
   */
  async obtenerCatalogos(): Promise<TorneoCatalogosResponse> {
    try {
      const result = await this.dataSource.query(
        `SELECT torneo_obtener_catalogos() as resultado`,
      );

      const response = result[0].resultado as TorneoCatalogosResponse;
      
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
   */
  async finalizarTorneo(
    torneoId: string,
    anfitrionId: string,
    dto: FinalizarTorneoDto,
  ): Promise<TorneoFinalizarResponse> {
    try {
      const result = await this.dataSource.query(
        `SELECT torneo_finalizar($1, $2, $3) as resultado`,
        [torneoId, anfitrionId, JSON.stringify(dto.resultados)],
      );

      const response = result[0].resultado as TorneoFinalizarResponse;
      
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
   * Lanza errores específicos basados en el mensaje de error
   */
  private throwSpecificError(errorMessage: string): never {
    if (errorMessage?.includes('no existe')) {
      throw new NotFoundException(errorMessage);
    }
    if (errorMessage?.includes('Solo el anfitrión')) {
      throw new ForbiddenException(errorMessage);
    }
    if (errorMessage?.includes('no puede')) {
      throw new BadRequestException(errorMessage);
    }
    throw new BadRequestException(errorMessage || 'Error en la operación');
  }

  /**
   * Maneja errores de la base de datos de forma consistente.
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

    // Errores de RAISE EXCEPTION en PostgreSQL
    if (error.message?.includes('no existe')) {
      throw new NotFoundException(error.message);
    }
    if (error.message?.includes('Solo el anfitrión')) {
      throw new ForbiddenException(error.message);
    }
    if (error.message?.includes('obligatorio') || error.message?.includes('requerid')) {
      throw new BadRequestException(error.message);
    }
    if (error.message?.includes('no puede') || error.message?.includes('no válid')) {
      throw new BadRequestException(error.message);
    }

    // Error genérico
    console.error('Error en TorneoFuncionesService:', error);
    throw new BadRequestException('Error al procesar la solicitud');
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import {
  PerfilCompletoDto,
  AmigoDto,
  TrofeoDto,
  LogroDto,
  EstadisticaJuegoDto,
  HistorialTorneoDto,
  RedSocialDto,
  CuentaJuegoDto,
  EquipoDto,
} from './dto/perfil-usuario.dto';

/**
 * ============================================================================
 * PerfilUsuarioService
 * 
 * Este servicio se encarga de ejecutar las funciones almacenadas (stored functions)
 * de PostgreSQL para obtener los datos del perfil de usuario.
 * 
 * ¿Por qué usar funciones almacenadas?
 * 1. Rendimiento: Una sola consulta obtiene todos los datos necesarios
 * 2. Lógica centralizada: La lógica de negocio está en la base de datos
 * 3. Seguridad: Menor exposición de la estructura de tablas
 * 4. Reducción de queries: Evita el problema N+1
 * ============================================================================
 */
@Injectable()
export class PerfilUsuarioService {
  constructor(
    /**
     * DataSource es la conexión principal a la base de datos.
     * Lo usamos para ejecutar queries raw (SQL directo) y llamar
     * a funciones almacenadas.
     */
    private readonly dataSource: DataSource,
    
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  /**
   * ============================================================================
   * MÉTODO PRINCIPAL: Obtener perfil completo
   * 
   * Llama a la función almacenada 'obtener_perfil_completo_json' que retorna
   * TODA la información del perfil en formato JSON.
   * 
   * @param nickname - El nickname del usuario a consultar
   * @param viewerId - UUID del usuario que está viendo el perfil (opcional)
   * @returns PerfilCompletoDto - Objeto con toda la información del perfil
   * ============================================================================
   */
  async obtenerPerfilCompleto(
    nickname: string,
    viewerId?: string,
  ): Promise<PerfilCompletoDto> {
    try {
      /**
       * Ejecutamos la función almacenada usando query() de DataSource.
       * 
       * SELECT obtener_perfil_completo_json($1, $2)
       * - $1 y $2 son parámetros posicionales (evitan SQL injection)
       * - La función retorna JSONB directamente desde PostgreSQL
       */
      const result = await this.dataSource.query(
        `SELECT obtener_perfil_completo_json($1, $2) as perfil`,
        [nickname, viewerId || null],
      );

      // El resultado viene en result[0].perfil (ya es un objeto JSON)
      if (!result || !result[0] || !result[0].perfil) {
        throw new NotFoundException(
          `Usuario con nickname "${nickname}" no encontrado`,
        );
      }

      return result[0].perfil as PerfilCompletoDto;
    } catch (error) {
      // Si el error viene de PostgreSQL (RAISE EXCEPTION en la función)
      if (error.message?.includes('no encontrado')) {
        throw new NotFoundException(
          `Usuario con nickname "${nickname}" no encontrado`,
        );
      }
      throw error;
    }
  }

  /**
   * ============================================================================
   * Obtener lista de amigos paginada
   * 
   * Llama a la función 'obtener_lista_amigos' para obtener amigos con paginación.
   * Útil cuando quieres cargar más amigos (scroll infinito, por ejemplo).
   * ============================================================================
   */
  async obtenerListaAmigos(
    nickname: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<AmigoDto[]> {
    const result = await this.dataSource.query(
      `SELECT * FROM obtener_lista_amigos($1, $2, $3)`,
      [nickname, limit, offset],
    );

    // Mapeamos los nombres de columnas de snake_case a la estructura del DTO
    return result.map((row: any) => ({
      id: row.amigo_id,
      nickname: row.amigo_nickname,
      foto_perfil: row.amigo_foto_perfil,
      avatar_url: row.amigo_avatar_url,
      estado: row.amigo_estado,
      ultima_conexion: row.amigo_ultima_conexion,
      xp: row.amigo_xp,
      fecha_amistad: row.fecha_amistad,
    }));
  }

  /**
   * ============================================================================
   * Obtener vitrina de trofeos paginada
   * ============================================================================
   */
  async obtenerVitrinaTrofeos(
    nickname: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<TrofeoDto[]> {
    const result = await this.dataSource.query(
      `SELECT * FROM obtener_vitrina_trofeos($1, $2, $3)`,
      [nickname, limit, offset],
    );

    return result.map((row: any) => ({
      id: row.trofeo_id,
      tipo: row.tipo_trofeo,
      ganado_en: row.ganado_en,
      torneo_id: row.torneo_id,
      torneo_titulo: row.torneo_titulo,
      torneo_juego: row.torneo_juego,
      posicion: row.posicion_final,
    }));
  }

  /**
   * ============================================================================
   * Obtener logros del usuario paginados
   * ============================================================================
   */
  async obtenerLogros(
    nickname: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<LogroDto[]> {
    const result = await this.dataSource.query(
      `SELECT * FROM obtener_logros_usuario($1, $2, $3)`,
      [nickname, limit, offset],
    );

    return result.map((row: any) => ({
      id: row.logro_id,
      nombre: row.logro_nombre,
      descripcion: row.logro_descripcion,
      fecha_obtenido: row.fecha_obtenido,
    }));
  }

  /**
   * ============================================================================
   * Obtener estadísticas por juego
   * ============================================================================
   */
  async obtenerEstadisticasJuegos(nickname: string): Promise<EstadisticaJuegoDto[]> {
    const result = await this.dataSource.query(
      `SELECT * FROM obtener_estadisticas_juegos($1)`,
      [nickname],
    );

    return result.map((row: any) => ({
      juego_id: row.juego_id,
      juego_nombre: row.juego_nombre,
      victorias: row.victorias,
      derrotas: row.derrotas,
      empates: row.empates,
      porcentaje_victorias: parseFloat(row.porcentaje_victorias),
      nivel_rango: row.nivel_rango,
      horas_jugadas: row.horas_jugadas,
    }));
  }

  /**
   * ============================================================================
   * Obtener historial de torneos paginado
   * ============================================================================
   */
  async obtenerHistorialTorneos(
    nickname: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<HistorialTorneoDto[]> {
    const result = await this.dataSource.query(
      `SELECT * FROM obtener_historial_torneos($1, $2, $3)`,
      [nickname, limit, offset],
    );

    return result.map((row: any) => ({
      torneo_id: row.torneo_id,
      titulo: row.torneo_titulo,
      juego: row.juego_nombre,
      fecha_inicio: row.fecha_inicio,
      fecha_inscripcion: row.fecha_inscripcion,
      estado_inscripcion: row.estado_inscripcion,
      posicion_final: row.posicion_final,
      premio_ganado: parseFloat(row.premio_ganado || '0'),
      trofeo: row.tipo_trofeo,
    }));
  }

  /**
   * ============================================================================
   * Obtener redes sociales del usuario
   * ============================================================================
   */
  async obtenerRedesSociales(nickname: string): Promise<RedSocialDto[]> {
    const result = await this.dataSource.query(
      `SELECT * FROM obtener_redes_sociales($1)`,
      [nickname],
    );

    return result.map((row: any) => ({
      id: row.red_id,
      plataforma: row.plataforma,
      enlace: row.enlace,
    }));
  }

  /**
   * ============================================================================
   * Obtener cuentas de juego del usuario
   * ============================================================================
   */
  async obtenerCuentasJuego(nickname: string): Promise<CuentaJuegoDto[]> {
    const result = await this.dataSource.query(
      `SELECT * FROM obtener_cuentas_juego($1)`,
      [nickname],
    );

    return result.map((row: any) => ({
      id: row.cuenta_id,
      plataforma: row.plataforma,
      identificador: row.identificador,
    }));
  }

  /**
   * ============================================================================
   * Obtener equipos del usuario
   * ============================================================================
   */
  async obtenerEquipos(nickname: string): Promise<EquipoDto[]> {
    const result = await this.dataSource.query(
      `SELECT * FROM obtener_equipos_usuario($1)`,
      [nickname],
    );

    return result.map((row: any) => ({
      id: row.equipo_id,
      nombre: row.equipo_nombre,
      descripcion: row.equipo_descripcion,
      avatar_url: row.equipo_avatar_url,
      rol: row.rol_en_equipo,
      fecha_ingreso: row.fecha_ingreso,
      total_miembros: parseInt(row.total_miembros),
    }));
  }

  /**
   * ============================================================================
   * Método auxiliar: Verificar si un usuario existe por nickname
   * ============================================================================
   */
  async existeUsuario(nickname: string): Promise<boolean> {
    const usuario = await this.usuarioRepository.findOne({
      where: { nickname },
    });
    return !!usuario;
  }

  /**
   * ============================================================================
   * Método auxiliar: Obtener ID de usuario por nickname
   * Útil para cuando necesitas el UUID del usuario logueado
   * ============================================================================
   */
  async obtenerIdPorNickname(nickname: string): Promise<string | null> {
    const usuario = await this.usuarioRepository.findOne({
      where: { nickname },
      select: ['id'],
    });
    return usuario?.id || null;
  }
}

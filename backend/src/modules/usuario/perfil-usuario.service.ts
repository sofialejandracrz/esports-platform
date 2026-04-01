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
import { OracleFunctionHelper } from '../../common/helpers/oracle-function.helper';

/**
 * ============================================================================
 * PerfilUsuarioService
 * 
 * Este servicio ejecuta las funciones almacenadas para obtener los datos del
 * perfil de usuario. Compatible con PostgreSQL y Oracle.
 * 
 * PostgreSQL: funciones independientes (obtener_perfil_completo_json, etc.)
 * Oracle: funciones empaquetadas en PKG_PERFIL (FN_PERFIL_COMPLETO_JSON, etc.)
 * ============================================================================
 */
@Injectable()
export class PerfilUsuarioService {
  constructor(
    private readonly dataSource: DataSource,
    
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  /**
   * ============================================================================
   * MÉTODO PRINCIPAL: Obtener perfil completo
   * PG: obtener_perfil_completo_json
   * Oracle: PKG_PERFIL.FN_PERFIL_COMPLETO_JSON
   * ============================================================================
   */
  async obtenerPerfilCompleto(
    nickname: string,
    viewerId?: string,
  ): Promise<PerfilCompletoDto> {
    try {
      const result = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'obtener_perfil_completo_json',
        'PKG_PERFIL.FN_PERFIL_COMPLETO_JSON',
        [nickname, viewerId || null],
      );

      if (!result) {
        throw new NotFoundException(
          `Usuario con nickname "${nickname}" no encontrado`,
        );
      }

      return result as PerfilCompletoDto;
    } catch (error) {
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
   * PG: obtener_lista_amigos (retorna SETOF)
   * Oracle: PKG_PERFIL.FN_LISTA_AMIGOS (retorna CLOB con JSON array)
   * ============================================================================
   */
  async obtenerListaAmigos(
    nickname: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<AmigoDto[]> {
    const dbType = this.dataSource.options.type;

    if (dbType === 'oracle') {
      // Oracle: la función retorna CLOB con un JSON array
      const result = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'obtener_lista_amigos',
        'PKG_PERFIL.FN_LISTA_AMIGOS',
        [nickname, limit, offset],
      );
      return Array.isArray(result) ? result : [];
    } else {
      // PostgreSQL: retorna filas individuales
      const result = await this.dataSource.query(
        `SELECT * FROM obtener_lista_amigos($1, $2, $3)`,
        [nickname, limit, offset],
      );

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
  }

  /**
   * ============================================================================
   * Obtener vitrina de trofeos paginada
   * PG: obtener_vitrina_trofeos
   * Oracle: PKG_PERFIL.FN_VITRINA_TROFEOS
   * ============================================================================
   */
  async obtenerVitrinaTrofeos(
    nickname: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<TrofeoDto[]> {
    const dbType = this.dataSource.options.type;

    if (dbType === 'oracle') {
      const result = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'obtener_vitrina_trofeos',
        'PKG_PERFIL.FN_VITRINA_TROFEOS',
        [nickname, limit, offset],
      );
      return Array.isArray(result) ? result : [];
    } else {
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
  }

  /**
   * ============================================================================
   * Obtener logros del usuario paginados
   * PG: obtener_logros_usuario
   * Oracle: PKG_PERFIL.FN_LOGROS_USUARIO
   * ============================================================================
   */
  async obtenerLogros(
    nickname: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<LogroDto[]> {
    const dbType = this.dataSource.options.type;

    if (dbType === 'oracle') {
      const result = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'obtener_logros_usuario',
        'PKG_PERFIL.FN_LOGROS_USUARIO',
        [nickname, limit, offset],
      );
      return Array.isArray(result) ? result : [];
    } else {
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
  }

  /**
   * ============================================================================
   * Obtener estadísticas por juego
   * PG: obtener_estadisticas_juegos
   * Oracle: PKG_PERFIL.FN_ESTADISTICAS_JUEGOS
   * ============================================================================
   */
  async obtenerEstadisticasJuegos(nickname: string): Promise<EstadisticaJuegoDto[]> {
    const dbType = this.dataSource.options.type;

    if (dbType === 'oracle') {
      const result = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'obtener_estadisticas_juegos',
        'PKG_PERFIL.FN_ESTADISTICAS_JUEGOS',
        [nickname],
      );
      return Array.isArray(result) ? result : [];
    } else {
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
  }

  /**
   * ============================================================================
   * Obtener historial de torneos paginado
   * PG: obtener_historial_torneos
   * Oracle: PKG_PERFIL.FN_HISTORIAL_TORNEOS
   * ============================================================================
   */
  async obtenerHistorialTorneos(
    nickname: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<HistorialTorneoDto[]> {
    const dbType = this.dataSource.options.type;

    if (dbType === 'oracle') {
      const result = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'obtener_historial_torneos',
        'PKG_PERFIL.FN_HISTORIAL_TORNEOS',
        [nickname, limit, offset],
      );
      return Array.isArray(result) ? result : [];
    } else {
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
  }

  /**
   * ============================================================================
   * Obtener redes sociales del usuario
   * PG: obtener_redes_sociales
   * Oracle: PKG_PERFIL.FN_REDES_SOCIALES
   * ============================================================================
   */
  async obtenerRedesSociales(nickname: string): Promise<RedSocialDto[]> {
    const dbType = this.dataSource.options.type;

    if (dbType === 'oracle') {
      const result = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'obtener_redes_sociales',
        'PKG_PERFIL.FN_REDES_SOCIALES',
        [nickname],
      );
      return Array.isArray(result) ? result : [];
    } else {
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
  }

  /**
   * ============================================================================
   * Obtener cuentas de juego del usuario
   * PG: obtener_cuentas_juego
   * Oracle: PKG_PERFIL.FN_CUENTAS_JUEGO
   * ============================================================================
   */
  async obtenerCuentasJuego(nickname: string): Promise<CuentaJuegoDto[]> {
    const dbType = this.dataSource.options.type;

    if (dbType === 'oracle') {
      const result = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'obtener_cuentas_juego',
        'PKG_PERFIL.FN_CUENTAS_JUEGO',
        [nickname],
      );
      return Array.isArray(result) ? result : [];
    } else {
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
  }

  /**
   * ============================================================================
   * Obtener equipos del usuario
   * PG: obtener_equipos_usuario
   * Oracle: PKG_PERFIL.FN_EQUIPOS_USUARIO
   * ============================================================================
   */
  async obtenerEquipos(nickname: string): Promise<EquipoDto[]> {
    const dbType = this.dataSource.options.type;

    if (dbType === 'oracle') {
      const result = await OracleFunctionHelper.callFunction(
        this.dataSource,
        'obtener_equipos_usuario',
        'PKG_PERFIL.FN_EQUIPOS_USUARIO',
        [nickname],
      );
      return Array.isArray(result) ? result : [];
    } else {
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

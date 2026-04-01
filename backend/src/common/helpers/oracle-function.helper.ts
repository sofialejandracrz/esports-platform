import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

/**
 * ============================================================================
 * OracleFunctionHelper
 * 
 * Utilidad para ejecutar funciones almacenadas de forma compatible
 * entre PostgreSQL y Oracle.
 * 
 * PostgreSQL usa: SELECT function_name($1, $2) as resultado
 * Oracle usa:     BEGIN :result := PKG.FN(:1, :2); END;
 * 
 * Esta clase abstrae la diferencia para que los servicios no necesiten
 * conocer el motor de base de datos.
 * ============================================================================
 */
export class OracleFunctionHelper {

  /**
   * Ejecuta una función almacenada y retorna el resultado como JSON.
   * Detecta automáticamente si es Oracle o PostgreSQL.
   * 
   * @param dataSource - DataSource de TypeORM
   * @param pgFunctionName - Nombre de la función en PostgreSQL (ej: 'tienda_obtener_catalogo')
   * @param oraclePackageFunction - Nombre completo en Oracle (ej: 'PKG_TIENDA.FN_OBTENER_CATALOGO')
   * @param params - Parámetros de la función
   * @returns El resultado JSON parseado
   */
  static async callFunction(
    dataSource: DataSource,
    pgFunctionName: string,
    oraclePackageFunction: string,
    params: any[] = [],
  ): Promise<any> {
    const dbType = dataSource.options.type;

    if (dbType === 'oracle') {
      return this.callOracleFunction(dataSource, oraclePackageFunction, params);
    } else {
      return this.callPostgresFunction(dataSource, pgFunctionName, params);
    }
  }

  /**
   * Ejecuta una función de Oracle que retorna CLOB (JSON string).
   * Usa un bloque PL/SQL anónimo con bind variables.
   */
  private static async callOracleFunction(
    dataSource: DataSource,
    oraclePackageFunction: string,
    params: any[],
  ): Promise<any> {
    // Construir los placeholders para bind variables de Oracle (:1, :2, etc.)
    const bindParams = params.map((_, i) => `:${i + 1}`).join(', ');
    const functionCall = params.length > 0
      ? `${oraclePackageFunction}(${bindParams})`
      : `${oraclePackageFunction}`;

    // Oracle: SELECT PKG.FN(:1, :2) AS RESULTADO FROM DUAL
    const sql = `SELECT ${functionCall} AS RESULTADO FROM DUAL`;

    const result = await dataSource.query(sql, params);

    if (!result || !result[0]) {
      return null;
    }

    const raw = result[0].RESULTADO ?? result[0].resultado;
    
    if (raw === null || raw === undefined) {
      return null;
    }

    // Oracle retorna CLOB como string, necesitamos parsear el JSON
    if (typeof raw === 'string') {
      try {
        return JSON.parse(raw);
      } catch {
        return raw;
      }
    }

    // Si ya es objeto (poco probable con Oracle, pero por seguridad)
    return raw;
  }

  /**
   * Ejecuta una función de PostgreSQL que retorna JSONB.
   * Usa la sintaxis SELECT function($1, $2).
   */
  private static async callPostgresFunction(
    dataSource: DataSource,
    pgFunctionName: string,
    params: any[],
  ): Promise<any> {
    const bindParams = params.map((_, i) => `$${i + 1}`).join(', ');
    const functionCall = params.length > 0
      ? `${pgFunctionName}(${bindParams})`
      : `${pgFunctionName}()`;

    const sql = `SELECT ${functionCall} as resultado`;

    const result = await dataSource.query(sql, params);

    if (!result || !result[0]) {
      return null;
    }

    return result[0].resultado;
  }

  /**
   * Ejecuta una función que retorna filas (tabla) en vez de un único valor.
   * En PostgreSQL: SELECT * FROM function($1, $2)
   * En Oracle: SELECT * FROM TABLE(PKG.FN(:1, :2))  -- para funciones pipelined
   * 
   * NOTA: Para funciones que retornan CLOB con array JSON,
   * se recomienda usar callFunction() y parsear el resultado.
   * Este método es para funciones que retornan SETOF/TABLE.
   */
  static async callTableFunction(
    dataSource: DataSource,
    pgFunctionName: string,
    oraclePackageFunction: string,
    params: any[] = [],
  ): Promise<any[]> {
    const dbType = dataSource.options.type;

    if (dbType === 'oracle') {
      // En Oracle, las funciones del perfil retornan CLOB con JSON
      // Usamos callFunction y parseamos el resultado que ya es un array
      const result = await this.callOracleFunction(dataSource, oraclePackageFunction, params);
      return Array.isArray(result) ? result : [];
    } else {
      // PostgreSQL: SELECT * FROM function($1, $2)
      const bindParams = params.map((_, i) => `$${i + 1}`).join(', ');
      const functionCall = params.length > 0
        ? `${pgFunctionName}(${bindParams})`
        : `${pgFunctionName}()`;

      return dataSource.query(`SELECT * FROM ${functionCall}`, params);
    }
  }
}

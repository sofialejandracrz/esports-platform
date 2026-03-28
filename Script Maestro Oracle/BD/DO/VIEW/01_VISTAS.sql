/*
============================================================================
  Script: 01_VISTAS.sql
  Descripcion: Creacion de vistas para reportes y consultas frecuentes
  Proyecto: Plataforma eSports - Base de datos OLTP
  Fecha: 16/Marzo/2026
============================================================================
*/

-- =========================================================================
-- VISTA 1: Perfil completo del usuario
-- Combina persona, usuario, rol y avatar
-- =========================================================================
CREATE OR REPLACE VIEW VW_PERFIL_USUARIO AS
SELECT 
    u.ID AS USUARIO_ID,
    u.NICKNAME,
    u.ESTADO AS ESTADO_CUENTA,
    u.XP,
    u.SALDO,
    u.CREDITOS,
    u.BIOGRAFIA,
    u.CREADO_EN AS FECHA_REGISTRO,
    u.ULTIMA_CONEXION,
    p.P_NOMBRE || ' ' || p.P_APELLIDO AS NOMBRE_COMPLETO,
    p.CORREO,
    p.FECHA_NACIMIENTO,
    p.TELEFONO,
    p.CIUDAD,
    p.PAIS,
    g.VALOR AS GENERO,
    r.VALOR AS ROL,
    a.NOMBRE AS AVATAR
FROM USUARIO u
LEFT JOIN PERSONA p ON u.PERSONA_ID = p.ID
LEFT JOIN CATALOGO_GENERO g ON p.GENERO_ID = g.ID
LEFT JOIN CATALOGO_ROL r ON u.ROL_ID = r.ID
LEFT JOIN CATALOGO_AVATAR a ON u.AVATAR_ID = a.ID
WHERE u.DELETED_AT IS NULL;

-- =========================================================================
-- VISTA 2: Dashboard de torneos con informacion completa
-- =========================================================================
CREATE OR REPLACE VIEW VW_TORNEOS_DASHBOARD AS
SELECT 
    t.ID AS TORNEO_ID,
    t.TITULO,
    t.DESCRIPCION,
    t.FECHA_INICIO_TORNEO,
    t.FECHA_INICIO_REGISTRO,
    t.FECHA_FIN_REGISTRO,
    t.AL_MEJOR_DE,
    t.CAPACIDAD,
    t.CERRADO,
    et.VALOR AS ESTADO_TORNEO,
    j.NOMBRE AS JUEGO,
    mj.NOMBRE AS MODO_JUEGO,
    cp.VALOR AS PLATAFORMA,
    cr.VALOR AS REGION,
    ctt.VALOR AS TIPO_TORNEO,
    cte.VALOR AS TIPO_ENTRADA,
    anf.NICKNAME AS ANFITRION,
    tp.FONDO_TOTAL AS PREMIO_TOTAL,
    tp.CUOTA,
    (SELECT COUNT(*) FROM TORNEO_INSCRIPCION ti WHERE ti.TORNEO_ID = t.ID) AS TOTAL_INSCRITOS
FROM TORNEO t
LEFT JOIN CATALOGO_ESTADO_TORNEO et ON t.ESTADO_ID = et.ID
LEFT JOIN JUEGO j ON t.JUEGO_ID = j.ID
LEFT JOIN MODO_JUEGO mj ON t.MODO_JUEGO_ID = mj.ID
LEFT JOIN CATALOGO_PLATAFORMA cp ON t.PLATAFORMA_ID = cp.ID
LEFT JOIN CATALOGO_REGION cr ON t.REGION_ID = cr.ID
LEFT JOIN CATALOGO_TIPO_TORNEO ctt ON t.TIPO_TORNEO_ID = ctt.ID
LEFT JOIN CATALOGO_TIPO_ENTRADA cte ON t.TIPO_ENTRADA_ID = cte.ID
LEFT JOIN USUARIO anf ON t.ANFITRION_ID = anf.ID
LEFT JOIN TORNEO_PREMIOS tp ON tp.TORNEO_ID = t.ID;

-- =========================================================================
-- VISTA 3: Estadisticas de la tienda (ventas por item)
-- =========================================================================
CREATE OR REPLACE VIEW VW_VENTAS_TIENDA AS
SELECT 
    ti.ID AS ITEM_ID,
    ti.NOMBRE AS NOMBRE_ITEM,
    ti.PRECIO,
    cti.VALOR AS TIPO_ITEM,
    COUNT(tord.ID) AS TOTAL_ORDENES,
    SUM(CASE WHEN tord.ESTADO = 'completado' THEN 1 ELSE 0 END) AS ORDENES_COMPLETADAS,
    SUM(CASE WHEN tord.ESTADO = 'pendiente' THEN 1 ELSE 0 END) AS ORDENES_PENDIENTES,
    NVL(SUM(CASE WHEN tord.ESTADO = 'completado' THEN tord.MONTO ELSE 0 END), 0) AS INGRESOS_TOTALES
FROM TIENDA_ITEM ti
LEFT JOIN CATALOGO_TIPO_ITEM cti ON ti.TIPO_ID = cti.ID
LEFT JOIN TIENDA_ORDEN tord ON tord.ITEM_ID = ti.ID
GROUP BY ti.ID, ti.NOMBRE, ti.PRECIO, cti.VALOR;

-- =========================================================================
-- VISTA 4: Ranking de jugadores (por XP y victorias)
-- =========================================================================
CREATE OR REPLACE VIEW VW_RANKING_JUGADORES AS
SELECT 
    u.ID AS USUARIO_ID,
    u.NICKNAME,
    u.XP,
    u.SALDO,
    r.VALOR AS ROL,
    NVL(SUM(ej.VICTORIAS), 0) AS TOTAL_VICTORIAS,
    NVL(SUM(ej.DERROTAS), 0) AS TOTAL_DERROTAS,
    NVL(SUM(ej.HORAS_JUGADAS), 0) AS TOTAL_HORAS,
    (SELECT COUNT(*) FROM USUARIO_TROFEOS ut WHERE ut.USUARIO_ID = u.ID) AS TOTAL_TROFEOS,
    (SELECT COUNT(*) FROM USUARIO_LOGROS ul WHERE ul.USUARIO_ID = u.ID) AS TOTAL_LOGROS,
    (SELECT COUNT(*) FROM USUARIO_SEGUIDORES us WHERE us.SEGUIDO_ID = u.ID) AS TOTAL_SEGUIDORES,
    RANK() OVER (ORDER BY u.XP DESC) AS RANKING_XP
FROM USUARIO u
LEFT JOIN CATALOGO_ROL r ON u.ROL_ID = r.ID
LEFT JOIN USUARIO_ESTADISTICAS_JUEGO ej ON ej.USUARIO_ID = u.ID
WHERE u.DELETED_AT IS NULL
GROUP BY u.ID, u.NICKNAME, u.XP, u.SALDO, r.VALOR;

-- =========================================================================
-- VISTA 5: Resumen de equipos con sus miembros
-- =========================================================================
CREATE OR REPLACE VIEW VW_EQUIPOS_RESUMEN AS
SELECT 
    e.ID AS EQUIPO_ID,
    e.NOMBRE AS NOMBRE_EQUIPO,
    e.DESCRIPCION,
    e.CREADO_EN,
    cap.NICKNAME AS CREADO_POR,
    (SELECT COUNT(*) FROM EQUIPO_MIEMBROS em WHERE em.EQUIPO_ID = e.ID) AS TOTAL_MIEMBROS,
    (SELECT LISTAGG(u2.NICKNAME, ', ') WITHIN GROUP (ORDER BY u2.NICKNAME) 
     FROM EQUIPO_MIEMBROS em2 
     JOIN USUARIO u2 ON em2.USUARIO_ID = u2.ID 
     WHERE em2.EQUIPO_ID = e.ID) AS MIEMBROS
FROM EQUIPO e
LEFT JOIN USUARIO cap ON e.CREADO_POR = cap.ID;

-- =========================================================================
-- VISTA 6: Reporte de transacciones por tipo y origen
-- =========================================================================
CREATE OR REPLACE VIEW VW_REPORTE_TRANSACCIONES AS
SELECT 
    t.ID AS TRANSACCION_ID,
    t.MONTO,
    t.DESCRIPCION,
    t.CREADO_EN,
    u.NICKNAME AS USUARIO,
    ctt.VALOR AS TIPO_TRANSACCION,
    cot.VALOR AS ORIGEN_TRANSACCION
FROM TRANSACCION t
LEFT JOIN USUARIO u ON t.USUARIO_ID = u.ID
LEFT JOIN CATALOGO_TRANSACCION_TIPO ctt ON t.TIPO_ID = ctt.ID
LEFT JOIN CATALOGO_ORIGEN_TRANSACCION cot ON t.ORIGEN_ID = cot.ID;


PROMPT >>> Vistas creadas exitosamente <<<

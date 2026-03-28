/*
============================================================================
  Script: PKG_TORNEO_BODY.sql
  Descripcion: Cuerpo del paquete PKG_TORNEO
               Implementación de funciones de torneos migradas de PostgreSQL
  Proyecto: Plataforma eSports - Migración a Oracle
  Fecha: Marzo/2026
============================================================================
*/

CREATE OR REPLACE PACKAGE BODY PKG_TORNEO AS

    /*
    =========================================================================
    FN1: CREAR TORNEO
    =========================================================================
    */
    FUNCTION FN_CREAR(
        p_anfitrion_id              IN VARCHAR2,
        p_titulo                    IN VARCHAR2,
        p_descripcion               IN CLOB DEFAULT NULL,
        p_fecha_inicio_registro     IN TIMESTAMP DEFAULT NULL,
        p_fecha_fin_registro        IN TIMESTAMP DEFAULT NULL,
        p_fecha_inicio_torneo       IN TIMESTAMP DEFAULT NULL,
        p_juego_id                  IN VARCHAR2 DEFAULT NULL,
        p_plataforma_id             IN VARCHAR2 DEFAULT NULL,
        p_modo_juego_id             IN VARCHAR2 DEFAULT NULL,
        p_region_id                 IN VARCHAR2 DEFAULT NULL,
        p_tipo_torneo_id            IN VARCHAR2 DEFAULT NULL,
        p_al_mejor_de               IN NUMBER DEFAULT 1,
        p_formato                   IN VARCHAR2 DEFAULT '1v1',
        p_cerrado                   IN NUMBER DEFAULT 0,
        p_reglas                    IN CLOB DEFAULT NULL,
        p_jugadores_pc_permitidos   IN NUMBER DEFAULT 1,
        p_requiere_transmision      IN NUMBER DEFAULT 0,
        p_requiere_camara           IN NUMBER DEFAULT 0,
        p_tipo_entrada_id           IN VARCHAR2 DEFAULT NULL,
        p_capacidad                 IN NUMBER DEFAULT NULL,
        p_cuota                     IN NUMBER DEFAULT 0,
        p_comision_porcentaje       IN NUMBER DEFAULT 0,
        p_ganador1_porcentaje       IN NUMBER DEFAULT 70,
        p_ganador2_porcentaje       IN NUMBER DEFAULT 30,
        p_contacto_anfitrion        IN VARCHAR2 DEFAULT NULL,
        p_discord_servidor          IN VARCHAR2 DEFAULT NULL,
        p_banner_url                IN VARCHAR2 DEFAULT NULL,
        p_miniatura_url             IN VARCHAR2 DEFAULT NULL
    ) RETURN CLOB
    IS
        v_torneo_id             NUMBER;
        v_estado_prox_id        NUMBER;
        v_tipo_torneo_id_final  NUMBER;
        v_tipo_torneo_valor     VARCHAR2(100);
        v_usuario_count         NUMBER;
    BEGIN
        -- Validar anfitrión existe
        SELECT COUNT(*) INTO v_usuario_count
        FROM USUARIO WHERE id = p_anfitrion_id AND deleted_at IS NULL;
        
        IF v_usuario_count = 0 THEN
            RETURN '{"success": false, "error": "El usuario anfitrion no existe o no esta activo"}';
        END IF;
        
        -- Validar título
        IF p_titulo IS NULL OR TRIM(p_titulo) = '' THEN
            RETURN '{"success": false, "error": "El titulo del torneo es obligatorio"}';
        END IF;
        
        -- Obtener tipo torneo default si no se proporciona
        IF p_tipo_torneo_id IS NULL THEN
            SELECT id, valor INTO v_tipo_torneo_id_final, v_tipo_torneo_valor
            FROM CATALOGO_TIPO_TORNEO WHERE valor = 'eliminacion_simple';
        ELSE
            v_tipo_torneo_id_final := TO_NUMBER(p_tipo_torneo_id);
            SELECT valor INTO v_tipo_torneo_valor
            FROM CATALOGO_TIPO_TORNEO WHERE id = v_tipo_torneo_id_final;
        END IF;
        
        -- Obtener estado "proximamente"
        SELECT id INTO v_estado_prox_id
        FROM CATALOGO_ESTADO_TORNEO WHERE valor = 'proximamente';
        
        IF v_estado_prox_id IS NULL THEN
            RETURN '{"success": false, "error": "No se encontro el estado proximamente"}';
        END IF;
        
        -- Validar porcentajes
        IF p_ganador1_porcentaje + p_ganador2_porcentaje > 100 THEN
            RETURN '{"success": false, "error": "La suma de porcentajes no puede exceder 100"}';
        END IF;
        
        -- Insertar torneo
        SELECT SEQ_TORNEO.NEXTVAL INTO v_torneo_id FROM DUAL;
        
        INSERT INTO TORNEO (
            id, titulo, descripcion, fecha_inicio_registro, fecha_fin_registro, fecha_inicio_torneo,
            juego_id, plataforma_id, modo_juego_id, region_id, tipo_torneo_id, tipo_torneo,
            al_mejor_de, formato, cerrado, reglas, jugadores_pc_permitidos,
            requiere_transmision, requiere_camara, tipo_entrada_id, capacidad,
            anfitrion_id, contacto_anfitrion, discord_servidor, banner_url, miniatura_url,
            estado_id, creado_en, actualizado_en
        ) VALUES (
            v_torneo_id, p_titulo, p_descripcion, p_fecha_inicio_registro, p_fecha_fin_registro, p_fecha_inicio_torneo,
            p_juego_id, p_plataforma_id, p_modo_juego_id, p_region_id, v_tipo_torneo_id_final, v_tipo_torneo_valor,
            p_al_mejor_de, p_formato, p_cerrado, p_reglas, p_jugadores_pc_permitidos,
            p_requiere_transmision, p_requiere_camara, p_tipo_entrada_id, p_capacidad,
            p_anfitrion_id, p_contacto_anfitrion, p_discord_servidor, p_banner_url, p_miniatura_url,
            v_estado_prox_id, SYSTIMESTAMP, SYSTIMESTAMP
        );
        
        -- Insertar premios
        INSERT INTO TORNEO_PREMIOS (
            id, torneo_id, cuota, fondo_total, fondo_despues_comision,
            comision_porcentaje, comision_total, ganador1_porcentaje, ganador2_porcentaje
        ) VALUES (
            SEQ_TORNEO_PREMIOS.NEXTVAL, v_torneo_id, p_cuota, 0, 0,
            p_comision_porcentaje, 0, p_ganador1_porcentaje, p_ganador2_porcentaje
        );
        
        COMMIT;
        
        RETURN JSON_OBJECT(
            'success' VALUE 'true',
            'torneo_id' VALUE v_torneo_id,
            'message' VALUE 'Torneo creado exitosamente',
            'estado' VALUE 'proximamente'
        );
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_CREAR;

    /*
    =========================================================================
    FN2: ACTUALIZAR TORNEO
    =========================================================================
    */
    FUNCTION FN_ACTUALIZAR(
        p_torneo_id                 IN VARCHAR2,
        p_anfitrion_id              IN VARCHAR2,
        p_titulo                    IN VARCHAR2 DEFAULT NULL,
        p_descripcion               IN CLOB DEFAULT NULL,
        p_fecha_inicio_registro     IN TIMESTAMP DEFAULT NULL,
        p_fecha_fin_registro        IN TIMESTAMP DEFAULT NULL,
        p_fecha_inicio_torneo       IN TIMESTAMP DEFAULT NULL,
        p_juego_id                  IN VARCHAR2 DEFAULT NULL,
        p_plataforma_id             IN VARCHAR2 DEFAULT NULL,
        p_modo_juego_id             IN VARCHAR2 DEFAULT NULL,
        p_region_id                 IN VARCHAR2 DEFAULT NULL,
        p_tipo_torneo_id            IN VARCHAR2 DEFAULT NULL,
        p_al_mejor_de               IN NUMBER DEFAULT NULL,
        p_formato                   IN VARCHAR2 DEFAULT NULL,
        p_cerrado                   IN NUMBER DEFAULT NULL,
        p_reglas                    IN CLOB DEFAULT NULL,
        p_jugadores_pc_permitidos   IN NUMBER DEFAULT NULL,
        p_requiere_transmision      IN NUMBER DEFAULT NULL,
        p_requiere_camara           IN NUMBER DEFAULT NULL,
        p_tipo_entrada_id           IN VARCHAR2 DEFAULT NULL,
        p_capacidad                 IN NUMBER DEFAULT NULL,
        p_cuota                     IN NUMBER DEFAULT NULL,
        p_comision_porcentaje       IN NUMBER DEFAULT NULL,
        p_ganador1_porcentaje       IN NUMBER DEFAULT NULL,
        p_ganador2_porcentaje       IN NUMBER DEFAULT NULL,
        p_contacto_anfitrion        IN VARCHAR2 DEFAULT NULL,
        p_discord_servidor          IN VARCHAR2 DEFAULT NULL,
        p_banner_url                IN VARCHAR2 DEFAULT NULL,
        p_miniatura_url             IN VARCHAR2 DEFAULT NULL
    ) RETURN CLOB
    IS
        v_anfitrion_actual  NUMBER;
        v_estado_actual     VARCHAR2(50);
    BEGIN
        -- Verificar torneo y obtener datos
        BEGIN
            SELECT t.anfitrion_id, cet.valor
            INTO v_anfitrion_actual, v_estado_actual
            FROM TORNEO t
            LEFT JOIN CATALOGO_ESTADO_TORNEO cet ON t.estado_id = cet.id
            WHERE t.id = p_torneo_id;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                RETURN '{"success": false, "error": "El torneo no existe"}';
        END;
        
        -- Verificar anfitrión
        IF v_anfitrion_actual != TO_NUMBER(p_anfitrion_id) THEN
            RETURN '{"success": false, "error": "Solo el anfitrion puede modificar el torneo"}';
        END IF;
        
        -- No modificar torneos terminados
        IF v_estado_actual IN ('terminado', 'cancelado') THEN
            RETURN '{"success": false, "error": "No se puede modificar un torneo terminado o cancelado"}';
        END IF;
        
        -- Actualizar torneo
        UPDATE TORNEO SET
            titulo = NVL(p_titulo, titulo),
            descripcion = NVL(p_descripcion, descripcion),
            fecha_inicio_registro = NVL(p_fecha_inicio_registro, fecha_inicio_registro),
            fecha_fin_registro = NVL(p_fecha_fin_registro, fecha_fin_registro),
            fecha_inicio_torneo = NVL(p_fecha_inicio_torneo, fecha_inicio_torneo),
            juego_id = NVL(p_juego_id, juego_id),
            plataforma_id = NVL(p_plataforma_id, plataforma_id),
            modo_juego_id = NVL(p_modo_juego_id, modo_juego_id),
            region_id = NVL(p_region_id, region_id),
            tipo_torneo_id = NVL(p_tipo_torneo_id, tipo_torneo_id),
            al_mejor_de = NVL(p_al_mejor_de, al_mejor_de),
            formato = NVL(p_formato, formato),
            cerrado = NVL(p_cerrado, cerrado),
            reglas = NVL(p_reglas, reglas),
            jugadores_pc_permitidos = NVL(p_jugadores_pc_permitidos, jugadores_pc_permitidos),
            requiere_transmision = NVL(p_requiere_transmision, requiere_transmision),
            requiere_camara = NVL(p_requiere_camara, requiere_camara),
            tipo_entrada_id = NVL(p_tipo_entrada_id, tipo_entrada_id),
            capacidad = NVL(p_capacidad, capacidad),
            contacto_anfitrion = NVL(p_contacto_anfitrion, contacto_anfitrion),
            discord_servidor = NVL(p_discord_servidor, discord_servidor),
            banner_url = NVL(p_banner_url, banner_url),
            miniatura_url = NVL(p_miniatura_url, miniatura_url),
            actualizado_en = SYSTIMESTAMP
        WHERE id = p_torneo_id;
        
        -- Actualizar premios si se proporcionan
        IF p_cuota IS NOT NULL OR p_comision_porcentaje IS NOT NULL 
           OR p_ganador1_porcentaje IS NOT NULL OR p_ganador2_porcentaje IS NOT NULL THEN
            UPDATE TORNEO_PREMIOS SET
                cuota = NVL(p_cuota, cuota),
                comision_porcentaje = NVL(p_comision_porcentaje, comision_porcentaje),
                ganador1_porcentaje = NVL(p_ganador1_porcentaje, ganador1_porcentaje),
                ganador2_porcentaje = NVL(p_ganador2_porcentaje, ganador2_porcentaje)
            WHERE torneo_id = p_torneo_id;
        END IF;
        
        COMMIT;
        
        RETURN '{"success": true, "torneo_id": "' || p_torneo_id || '", "message": "Torneo actualizado exitosamente"}';
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_ACTUALIZAR;

    /*
    =========================================================================
    FN3: CAMBIAR ESTADO DEL TORNEO
    =========================================================================
    */
    FUNCTION FN_CAMBIAR_ESTADO(
        p_torneo_id     IN VARCHAR2,
        p_anfitrion_id  IN VARCHAR2,
        p_nuevo_estado  IN VARCHAR2
    ) RETURN CLOB
    IS
        v_anfitrion_actual  NUMBER;
        v_estado_actual     VARCHAR2(50);
        v_nuevo_estado_id   NUMBER;
    BEGIN
        -- Verificar torneo
        BEGIN
            SELECT t.anfitrion_id, cet.valor
            INTO v_anfitrion_actual, v_estado_actual
            FROM TORNEO t
            LEFT JOIN CATALOGO_ESTADO_TORNEO cet ON t.estado_id = cet.id
            WHERE t.id = p_torneo_id;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                RETURN '{"success": false, "error": "El torneo no existe"}';
        END;
        
        -- Verificar anfitrión
        IF v_anfitrion_actual != TO_NUMBER(p_anfitrion_id) THEN
            RETURN '{"success": false, "error": "Solo el anfitrion puede cambiar el estado del torneo"}';
        END IF;
        
        -- Obtener nuevo estado
        BEGIN
            SELECT id INTO v_nuevo_estado_id
            FROM CATALOGO_ESTADO_TORNEO WHERE valor = p_nuevo_estado;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                RETURN '{"success": false, "error": "Estado no valido. Use: proximamente, en_curso, terminado, cancelado"}';
        END;
        
        -- Validar transiciones
        IF v_estado_actual = 'terminado' THEN
            RETURN '{"success": false, "error": "No se puede cambiar el estado de un torneo terminado"}';
        END IF;
        
        IF v_estado_actual = 'cancelado' AND p_nuevo_estado != 'cancelado' THEN
            RETURN '{"success": false, "error": "No se puede reactivar un torneo cancelado"}';
        END IF;
        
        -- Actualizar estado
        UPDATE TORNEO SET estado_id = v_nuevo_estado_id, actualizado_en = SYSTIMESTAMP
        WHERE id = p_torneo_id;
        
        COMMIT;
        
        RETURN JSON_OBJECT(
            'success' VALUE 'true',
            'torneo_id' VALUE p_torneo_id,
            'estado_anterior' VALUE v_estado_actual,
            'estado_nuevo' VALUE p_nuevo_estado,
            'message' VALUE 'Estado del torneo actualizado'
        );
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_CAMBIAR_ESTADO;

    /*
    =========================================================================
    FN4: OBTENER DETALLE DEL TORNEO
    =========================================================================
    */
    FUNCTION FN_OBTENER_DETALLE(
        p_torneo_id     IN VARCHAR2
    ) RETURN CLOB
    IS
        v_result CLOB;
    BEGIN
        SELECT JSON_OBJECT(
            'success' VALUE 'true',
            'torneo' VALUE JSON_OBJECT(
                'id' VALUE t.id,
                'titulo' VALUE t.titulo,
                'descripcion' VALUE t.descripcion,
                'fecha_inicio_registro' VALUE TO_CHAR(t.fecha_inicio_registro, 'YYYY-MM-DD"T"HH24:MI:SS'),
                'fecha_fin_registro' VALUE TO_CHAR(t.fecha_fin_registro, 'YYYY-MM-DD"T"HH24:MI:SS'),
                'fecha_inicio_torneo' VALUE TO_CHAR(t.fecha_inicio_torneo, 'YYYY-MM-DD"T"HH24:MI:SS'),
                'juego' VALUE j.nombre,
                'plataforma' VALUE cp.valor,
                'region' VALUE cr.valor,
                'estado' VALUE cet.valor,
                'tipo_torneo' VALUE ctt.valor,
                'formato' VALUE t.formato,
                'al_mejor_de' VALUE t.al_mejor_de,
                'capacidad' VALUE t.capacidad,
                'cerrado' VALUE CASE WHEN t.cerrado = 1 THEN 'true' ELSE 'false' END,
                'reglas' VALUE t.reglas,
                'jugadores_pc_permitidos' VALUE CASE WHEN t.jugadores_pc_permitidos = 1 THEN 'true' ELSE 'false' END,
                'requiere_transmision' VALUE CASE WHEN t.requiere_transmision = 1 THEN 'true' ELSE 'false' END,
                'requiere_camara' VALUE CASE WHEN t.requiere_camara = 1 THEN 'true' ELSE 'false' END,
                'banner_url' VALUE t.banner_url,
                'miniatura_url' VALUE t.miniatura_url,
                'contacto_anfitrion' VALUE t.contacto_anfitrion,
                'discord_servidor' VALUE t.discord_servidor,
                'anfitrion' VALUE JSON_OBJECT(
                    'id' VALUE u.id,
                    'nickname' VALUE u.nickname,
                    'avatar_url' VALUE ca.url
                ),
                'premios' VALUE JSON_OBJECT(
                    'cuota' VALUE tp.cuota,
                    'fondo_total' VALUE tp.fondo_total,
                    'fondo_despues_comision' VALUE tp.fondo_despues_comision,
                    'comision_porcentaje' VALUE tp.comision_porcentaje,
                    'ganador1_porcentaje' VALUE tp.ganador1_porcentaje,
                    'ganador2_porcentaje' VALUE tp.ganador2_porcentaje
                ),
                'inscritos' VALUE (
                    SELECT COUNT(*) FROM TORNEO_INSCRIPCION ti 
                    JOIN CATALOGO_ESTADO_INSCRIPCION cei ON ti.estado_id = cei.id 
                    WHERE ti.torneo_id = t.id AND cei.valor = 'confirmado'
                ),
                'creado_en' VALUE TO_CHAR(t.creado_en, 'YYYY-MM-DD"T"HH24:MI:SS')
            )
        )
        INTO v_result
        FROM TORNEO t
        LEFT JOIN JUEGO j ON t.juego_id = j.id
        LEFT JOIN CATALOGO_PLATAFORMA cp ON t.plataforma_id = cp.id
        LEFT JOIN CATALOGO_REGION cr ON t.region_id = cr.id
        LEFT JOIN CATALOGO_ESTADO_TORNEO cet ON t.estado_id = cet.id
        LEFT JOIN CATALOGO_TIPO_TORNEO ctt ON t.tipo_torneo_id = ctt.id
        LEFT JOIN TORNEO_PREMIOS tp ON tp.torneo_id = t.id
        LEFT JOIN USUARIO u ON t.anfitrion_id = u.id
        LEFT JOIN CATALOGO_AVATAR ca ON u.avatar_id = ca.id
        WHERE t.id = p_torneo_id;
        
        IF v_result IS NULL THEN
            RETURN '{"success": false, "error": "Torneo no encontrado"}';
        END IF;
        
        RETURN v_result;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN '{"success": false, "error": "Torneo no encontrado"}';
        WHEN OTHERS THEN
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_OBTENER_DETALLE;

    /*
    =========================================================================
    FN5: LISTAR TORNEOS CON FILTROS
    =========================================================================
    */
    FUNCTION FN_LISTAR(
        p_estado        IN VARCHAR2 DEFAULT NULL,
        p_juego_id      IN VARCHAR2 DEFAULT NULL,
        p_region_id     IN VARCHAR2 DEFAULT NULL,
        p_anfitrion_id  IN VARCHAR2 DEFAULT NULL,
        p_busqueda      IN VARCHAR2 DEFAULT NULL,
        p_limit         IN NUMBER DEFAULT 20,
        p_offset        IN NUMBER DEFAULT 0
    ) RETURN CLOB
    IS
        v_total     NUMBER;
        v_torneos   CLOB;
    BEGIN
        -- Contar total
        SELECT COUNT(*) INTO v_total
        FROM TORNEO t
        LEFT JOIN CATALOGO_ESTADO_TORNEO cet ON t.estado_id = cet.id
        WHERE (p_estado IS NULL OR cet.valor = p_estado)
          AND (p_juego_id IS NULL OR t.juego_id = p_juego_id)
          AND (p_region_id IS NULL OR t.region_id = p_region_id)
          AND (p_anfitrion_id IS NULL OR t.anfitrion_id = p_anfitrion_id)
          AND (p_busqueda IS NULL OR UPPER(t.titulo) LIKE '%' || UPPER(p_busqueda) || '%');
        
        -- Obtener torneos
        SELECT COALESCE(JSON_ARRAYAGG(
            JSON_OBJECT(
                'id' VALUE t.id,
                'titulo' VALUE t.titulo,
                'descripcion' VALUE SUBSTR(t.descripcion, 1, 200),
                'miniatura_url' VALUE t.miniatura_url,
                'juego' VALUE j.nombre,
                'plataforma' VALUE cp.valor,
                'region' VALUE cr.valor,
                'estado' VALUE cet.valor,
                'formato' VALUE t.formato,
                'capacidad' VALUE t.capacidad,
                'cuota' VALUE tp.cuota,
                'fondo_total' VALUE tp.fondo_total,
                'fecha_inicio_torneo' VALUE TO_CHAR(t.fecha_inicio_torneo, 'YYYY-MM-DD"T"HH24:MI:SS'),
                'fecha_fin_registro' VALUE TO_CHAR(t.fecha_fin_registro, 'YYYY-MM-DD"T"HH24:MI:SS'),
                'inscritos' VALUE (
                    SELECT COUNT(*) FROM TORNEO_INSCRIPCION ti 
                    JOIN CATALOGO_ESTADO_INSCRIPCION cei ON ti.estado_id = cei.id 
                    WHERE ti.torneo_id = t.id AND cei.valor = 'confirmado'
                ),
                'anfitrion' VALUE JSON_OBJECT(
                    'id' VALUE u.id,
                    'nickname' VALUE u.nickname,
                    'avatar_url' VALUE ca.url
                )
            ) ORDER BY t.fecha_inicio_torneo DESC NULLS LAST
        ), '[]')
        INTO v_torneos
        FROM TORNEO t
        LEFT JOIN JUEGO j ON t.juego_id = j.id
        LEFT JOIN CATALOGO_PLATAFORMA cp ON t.plataforma_id = cp.id
        LEFT JOIN CATALOGO_REGION cr ON t.region_id = cr.id
        LEFT JOIN CATALOGO_ESTADO_TORNEO cet ON t.estado_id = cet.id
        LEFT JOIN TORNEO_PREMIOS tp ON tp.torneo_id = t.id
        LEFT JOIN USUARIO u ON t.anfitrion_id = u.id
        LEFT JOIN CATALOGO_AVATAR ca ON u.avatar_id = ca.id
        WHERE (p_estado IS NULL OR cet.valor = p_estado)
          AND (p_juego_id IS NULL OR t.juego_id = p_juego_id)
          AND (p_region_id IS NULL OR t.region_id = p_region_id)
          AND (p_anfitrion_id IS NULL OR t.anfitrion_id = p_anfitrion_id)
          AND (p_busqueda IS NULL OR UPPER(t.titulo) LIKE '%' || UPPER(p_busqueda) || '%')
          AND ROWNUM <= p_limit;
        
        RETURN JSON_OBJECT(
            'success' VALUE 'true',
            'total' VALUE v_total,
            'limit' VALUE p_limit,
            'offset' VALUE p_offset,
            'torneos' VALUE v_torneos FORMAT JSON
        );
    EXCEPTION
        WHEN OTHERS THEN
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_LISTAR;

    /*
    =========================================================================
    FN6: OBTENER CATÁLOGOS PARA FORMULARIO
    =========================================================================
    */
    FUNCTION FN_OBTENER_CATALOGOS RETURN CLOB
    IS
        v_juegos    CLOB;
        v_regiones  CLOB;
        v_tipos     CLOB;
        v_entradas  CLOB;
    BEGIN
        -- Juegos
        SELECT COALESCE(JSON_ARRAYAGG(
            JSON_OBJECT(
                'id' VALUE j.id,
                'nombre' VALUE j.nombre
            ) ORDER BY j.nombre
        ), '[]')
        INTO v_juegos FROM JUEGO j;
        
        -- Regiones
        SELECT COALESCE(JSON_ARRAYAGG(
            JSON_OBJECT('id' VALUE id, 'valor' VALUE valor)
            ORDER BY valor
        ), '[]')
        INTO v_regiones FROM CATALOGO_REGION;
        
        -- Tipos de torneo
        SELECT COALESCE(JSON_ARRAYAGG(
            JSON_OBJECT(
                'id' VALUE id,
                'valor' VALUE valor,
                'descripcion' VALUE descripcion,
                'tipo_trofeo' VALUE tipo_trofeo
            ) ORDER BY valor
        ), '[]')
        INTO v_tipos FROM CATALOGO_TIPO_TORNEO;
        
        -- Tipos de entrada
        SELECT COALESCE(JSON_ARRAYAGG(
            JSON_OBJECT('id' VALUE id, 'valor' VALUE valor)
            ORDER BY valor
        ), '[]')
        INTO v_entradas FROM CATALOGO_TIPO_ENTRADA;
        
        RETURN JSON_OBJECT(
            'success' VALUE 'true',
            'catalogos' VALUE JSON_OBJECT(
                'juegos' VALUE v_juegos FORMAT JSON,
                'regiones' VALUE v_regiones FORMAT JSON,
                'tipos_torneo' VALUE v_tipos FORMAT JSON,
                'tipos_entrada' VALUE v_entradas FORMAT JSON,
                'al_mejor_de' VALUE JSON_ARRAY(1, 3, 5, 7),
                'formatos' VALUE JSON_ARRAY('1v1', '2v2', '3v3', '4v4', '5v5'),
                'redes_sociales' VALUE JSON_ARRAY('twitch', 'discord', 'youtube', 'facebook', 'x')
            )
        );
    EXCEPTION
        WHEN OTHERS THEN
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_OBTENER_CATALOGOS;

    /*
    =========================================================================
    FN7: UPSERT RED SOCIAL DEL TORNEO
    =========================================================================
    */
    FUNCTION FN_UPSERT_RED_SOCIAL(
        p_torneo_id     IN VARCHAR2,
        p_anfitrion_id  IN VARCHAR2,
        p_plataforma    IN VARCHAR2,
        p_url           IN VARCHAR2,
        p_red_id        IN VARCHAR2 DEFAULT NULL
    ) RETURN CLOB
    IS
        v_anfitrion_actual  NUMBER;
        v_red_id            NUMBER;
    BEGIN
        -- Verificar torneo y anfitrión
        BEGIN
            SELECT anfitrion_id INTO v_anfitrion_actual FROM TORNEO WHERE id = p_torneo_id;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                RETURN '{"success": false, "error": "El torneo no existe"}';
        END;
        
        IF v_anfitrion_actual != TO_NUMBER(p_anfitrion_id) THEN
            RETURN '{"success": false, "error": "Solo el anfitrion puede modificar las redes del torneo"}';
        END IF;
        
        -- Validar datos
        IF p_plataforma IS NULL OR TRIM(p_plataforma) = '' THEN
            RETURN '{"success": false, "error": "La plataforma es requerida"}';
        END IF;
        
        IF p_url IS NULL OR TRIM(p_url) = '' THEN
            RETURN '{"success": false, "error": "La URL es requerida"}';
        END IF;
        
        IF p_red_id IS NOT NULL THEN
            -- Actualizar existente
            UPDATE TORNEO_REDES SET plataforma = p_plataforma, url = p_url
            WHERE id = p_red_id AND torneo_id = p_torneo_id;
            v_red_id := TO_NUMBER(p_red_id);
        ELSE
            -- Verificar si existe
            BEGIN
                SELECT id INTO v_red_id FROM TORNEO_REDES
                WHERE torneo_id = p_torneo_id AND UPPER(plataforma) = UPPER(p_plataforma);
                
                -- Actualizar
                UPDATE TORNEO_REDES SET url = p_url WHERE id = v_red_id;
            EXCEPTION
                WHEN NO_DATA_FOUND THEN
                    -- Crear nueva
                    SELECT SEQ_TORNEO_REDES.NEXTVAL INTO v_red_id FROM DUAL;
                    INSERT INTO TORNEO_REDES (id, torneo_id, plataforma, url)
                    VALUES (v_red_id, p_torneo_id, p_plataforma, p_url);
            END;
        END IF;
        
        COMMIT;
        
        RETURN '{"success": true, "red_id": ' || v_red_id || ', "message": "Red social guardada correctamente"}';
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_UPSERT_RED_SOCIAL;

    /*
    =========================================================================
    FN8: ELIMINAR RED SOCIAL DEL TORNEO
    =========================================================================
    */
    FUNCTION FN_ELIMINAR_RED_SOCIAL(
        p_torneo_id     IN VARCHAR2,
        p_anfitrion_id  IN VARCHAR2,
        p_red_id        IN VARCHAR2
    ) RETURN CLOB
    IS
        v_anfitrion_actual  NUMBER;
        v_deleted           NUMBER;
    BEGIN
        -- Verificar anfitrión
        BEGIN
            SELECT anfitrion_id INTO v_anfitrion_actual FROM TORNEO WHERE id = p_torneo_id;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                RETURN '{"success": false, "error": "El torneo no existe"}';
        END;
        
        IF v_anfitrion_actual != TO_NUMBER(p_anfitrion_id) THEN
            RETURN '{"success": false, "error": "Solo el anfitrion puede eliminar redes del torneo"}';
        END IF;
        
        DELETE FROM TORNEO_REDES WHERE id = p_red_id AND torneo_id = p_torneo_id;
        v_deleted := SQL%ROWCOUNT;
        
        IF v_deleted = 0 THEN
            RETURN '{"success": false, "error": "Red social no encontrada"}';
        END IF;
        
        COMMIT;
        
        RETURN '{"success": true, "message": "Red social eliminada correctamente"}';
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_ELIMINAR_RED_SOCIAL;

    /*
    =========================================================================
    FN9: FINALIZAR TORNEO
    =========================================================================
    */
    FUNCTION FN_FINALIZAR(
        p_torneo_id     IN VARCHAR2,
        p_anfitrion_id  IN VARCHAR2,
        p_ganador_id    IN VARCHAR2,
        p_segundo_id    IN VARCHAR2 DEFAULT NULL
    ) RETURN CLOB
    IS
        v_anfitrion_actual      NUMBER;
        v_estado_actual         VARCHAR2(50);
        v_estado_terminado_id   NUMBER;
        v_fondo                 NUMBER(12,2);
        v_ganador1_pct          NUMBER(5,2);
        v_ganador2_pct          NUMBER(5,2);
        v_premio1               NUMBER(12,2);
        v_premio2               NUMBER(12,2);
        v_tipo_trofeo           VARCHAR2(100);
    BEGIN
        -- Verificar torneo
        BEGIN
            SELECT t.anfitrion_id, cet.valor, tp.fondo_despues_comision,
                   tp.ganador1_porcentaje, tp.ganador2_porcentaje, ctt.tipo_trofeo
            INTO v_anfitrion_actual, v_estado_actual, v_fondo,
                 v_ganador1_pct, v_ganador2_pct, v_tipo_trofeo
            FROM TORNEO t
            LEFT JOIN CATALOGO_ESTADO_TORNEO cet ON t.estado_id = cet.id
            LEFT JOIN TORNEO_PREMIOS tp ON tp.torneo_id = t.id
            LEFT JOIN CATALOGO_TIPO_TORNEO ctt ON t.tipo_torneo_id = ctt.id
            WHERE t.id = p_torneo_id;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                RETURN '{"success": false, "error": "El torneo no existe"}';
        END;
        
        IF v_anfitrion_actual != TO_NUMBER(p_anfitrion_id) THEN
            RETURN '{"success": false, "error": "Solo el anfitrion puede finalizar el torneo"}';
        END IF;
        
        IF v_estado_actual != 'en_curso' THEN
            RETURN '{"success": false, "error": "Solo se pueden finalizar torneos en curso"}';
        END IF;
        
        -- Obtener estado terminado
        SELECT id INTO v_estado_terminado_id FROM CATALOGO_ESTADO_TORNEO WHERE valor = 'terminado';
        
        -- Calcular premios
        v_premio1 := NVL(v_fondo, 0) * NVL(v_ganador1_pct, 70) / 100;
        v_premio2 := NVL(v_fondo, 0) * NVL(v_ganador2_pct, 30) / 100;
        
        -- Actualizar estado del torneo
        UPDATE TORNEO SET estado_id = v_estado_terminado_id, actualizado_en = SYSTIMESTAMP
        WHERE id = p_torneo_id;
        
        -- Registrar resultado ganador
        INSERT INTO TORNEO_RESULTADO (id, torneo_id, usuario_id, posicion, premio_ganado, creado_en)
        VALUES (SEQ_TORNEO_RESULTADO.NEXTVAL, p_torneo_id, p_ganador_id, 1, v_premio1, SYSTIMESTAMP);
        
        -- Agregar saldo al ganador
        UPDATE USUARIO SET saldo = saldo + v_premio1, actualizado_en = SYSTIMESTAMP
        WHERE id = p_ganador_id;
        
        -- Otorgar trofeo al ganador
        INSERT INTO USUARIO_TROFEOS (id, usuario_id, torneo_id, posicion, tipo_trofeo, fecha)
        VALUES (SEQ_USUARIO_TROFEOS.NEXTVAL, p_ganador_id, p_torneo_id, 1, v_tipo_trofeo, TRUNC(SYSDATE));
        
        -- Segundo lugar si existe
        IF p_segundo_id IS NOT NULL THEN
            INSERT INTO TORNEO_RESULTADO (id, torneo_id, usuario_id, posicion, premio_ganado, creado_en)
            VALUES (SEQ_TORNEO_RESULTADO.NEXTVAL, p_torneo_id, p_segundo_id, 2, v_premio2, SYSTIMESTAMP);
            
            UPDATE USUARIO SET saldo = saldo + v_premio2, actualizado_en = SYSTIMESTAMP
            WHERE id = p_segundo_id;
        END IF;
        
        COMMIT;
        
        RETURN JSON_OBJECT(
            'success' VALUE 'true',
            'torneo_id' VALUE p_torneo_id,
            'ganador_id' VALUE p_ganador_id,
            'premio_ganador' VALUE v_premio1,
            'segundo_id' VALUE p_segundo_id,
            'premio_segundo' VALUE v_premio2,
            'message' VALUE 'Torneo finalizado exitosamente'
        );
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RETURN '{"success": false, "error": "' || SQLERRM || '"}';
    END FN_FINALIZAR;

END PKG_TORNEO;
/

PROMPT >>> Cuerpo del paquete PKG_TORNEO creado exitosamente <<<

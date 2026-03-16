--
-- PostgreSQL database dump
--



-- Dumped from database version 16.11
-- Dumped by pg_dump version 16.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.torneo_inscripcion DROP CONSTRAINT IF EXISTS "FK_fad7c271dd058405b9793aa23d8";
ALTER TABLE IF EXISTS ONLY public.usuario_cuenta_juego DROP CONSTRAINT IF EXISTS "FK_e9da7e312052147df75e853936f";
ALTER TABLE IF EXISTS ONLY public.usuario_amigos DROP CONSTRAINT IF EXISTS "FK_df5b5bf93e9b118112f5c04e0a3";
ALTER TABLE IF EXISTS ONLY public.tienda_solicitud_soporte DROP CONSTRAINT IF EXISTS "FK_dede56f207dbcf03092d9c1ab27";
ALTER TABLE IF EXISTS ONLY public.equipo_miembros DROP CONSTRAINT IF EXISTS "FK_dca17b2fa03abfba97623231d75";
ALTER TABLE IF EXISTS ONLY public.usuario_trofeos DROP CONSTRAINT IF EXISTS "FK_da32b9d289396f3c9405ffacc5b";
ALTER TABLE IF EXISTS ONLY public.torneo DROP CONSTRAINT IF EXISTS "FK_d81456b1cf2289e3eae13842ea4";
ALTER TABLE IF EXISTS ONLY public.torneo_resultados DROP CONSTRAINT IF EXISTS "FK_d625931ee48b60b60a78c61b45c";
ALTER TABLE IF EXISTS ONLY public.torneo DROP CONSTRAINT IF EXISTS "FK_d16a6a34d8062c995a2c19ddfd1";
ALTER TABLE IF EXISTS ONLY public.tienda_item DROP CONSTRAINT IF EXISTS "FK_cdcbc46312f29bb40890573bb0e";
ALTER TABLE IF EXISTS ONLY public.usuario DROP CONSTRAINT IF EXISTS "FK_c9d223fa9cc0ea30abcd9d5ca7e";
ALTER TABLE IF EXISTS ONLY public.usuario_estadisticas_juego DROP CONSTRAINT IF EXISTS "FK_c0287ef03b4be4a2486f77cc4f3";
ALTER TABLE IF EXISTS ONLY public.modo_juego DROP CONSTRAINT IF EXISTS "FK_bb1017c86dc0d25b32f348cac25";
ALTER TABLE IF EXISTS ONLY public.torneo_redes DROP CONSTRAINT IF EXISTS "FK_b5aa1faa39c8ec8e28c95cf7d23";
ALTER TABLE IF EXISTS ONLY public.usuario_red_social DROP CONSTRAINT IF EXISTS "FK_b521744b0ca2dd335c7493521f3";
ALTER TABLE IF EXISTS ONLY public.persona DROP CONSTRAINT IF EXISTS "FK_b5035180a48a15df1e48dbc05b8";
ALTER TABLE IF EXISTS ONLY public.usuario_logros DROP CONSTRAINT IF EXISTS "FK_b307eb190fe44b4153e00153571";
ALTER TABLE IF EXISTS ONLY public.torneo DROP CONSTRAINT IF EXISTS "FK_b25787fe4d2d7769649f83eff35";
ALTER TABLE IF EXISTS ONLY public.usuario_membresias DROP CONSTRAINT IF EXISTS "FK_af1698db762c6fc117144c8778e";
ALTER TABLE IF EXISTS ONLY public.usuario_membresias DROP CONSTRAINT IF EXISTS "FK_aee9c3e735c76f8489ef38e6d7d";
ALTER TABLE IF EXISTS ONLY public.usuario_logros DROP CONSTRAINT IF EXISTS "FK_adba4bc181b1c98ef429c1eed2f";
ALTER TABLE IF EXISTS ONLY public.tienda_orden DROP CONSTRAINT IF EXISTS "FK_a5fb5eb3a794663d20e81991b9f";
ALTER TABLE IF EXISTS ONLY public.torneo_premios DROP CONSTRAINT IF EXISTS "FK_a3031bbf1c334efdde6a07e5a46";
ALTER TABLE IF EXISTS ONLY public.usuario DROP CONSTRAINT IF EXISTS "FK_a03a572de1d6d4f9f20c206796f";
ALTER TABLE IF EXISTS ONLY public.juego_plataformas DROP CONSTRAINT IF EXISTS "FK_9770e3bc9af3bd32e4821c840d0";
ALTER TABLE IF EXISTS ONLY public.tienda_orden DROP CONSTRAINT IF EXISTS "FK_97226c90cd4dfbb5e6d73565a1e";
ALTER TABLE IF EXISTS ONLY public.juego_plataformas DROP CONSTRAINT IF EXISTS "FK_8f060be27f0622cfa62caba0672";
ALTER TABLE IF EXISTS ONLY public.usuario_seguidores DROP CONSTRAINT IF EXISTS "FK_89ab1bbe5122dccab1be305f78f";
ALTER TABLE IF EXISTS ONLY public.usuario_amigos DROP CONSTRAINT IF EXISTS "FK_879e2e7d8e715539b09aa89c63a";
ALTER TABLE IF EXISTS ONLY public.torneo DROP CONSTRAINT IF EXISTS "FK_85ef19440de5cb255590372dc61";
ALTER TABLE IF EXISTS ONLY public.usuario_seguidores DROP CONSTRAINT IF EXISTS "FK_6cb1a22f19bc2724a2895147daf";
ALTER TABLE IF EXISTS ONLY public.usuario DROP CONSTRAINT IF EXISTS "FK_6c336b0a51b5c4d22614cb02533";
ALTER TABLE IF EXISTS ONLY public.transaccion DROP CONSTRAINT IF EXISTS "FK_667b3504e61f3ee7db59db850be";
ALTER TABLE IF EXISTS ONLY public.tienda_solicitud_soporte DROP CONSTRAINT IF EXISTS "FK_64c7f2fa2b09757569c8addb238";
ALTER TABLE IF EXISTS ONLY public.tienda_solicitud_soporte DROP CONSTRAINT IF EXISTS "FK_603117a8319c5fda8bf896aa8e7";
ALTER TABLE IF EXISTS ONLY public.torneo_resultados DROP CONSTRAINT IF EXISTS "FK_5b115131a8cc205459ec938c775";
ALTER TABLE IF EXISTS ONLY public.torneo DROP CONSTRAINT IF EXISTS "FK_5b0e27f8f4caffb5592b1a51975";
ALTER TABLE IF EXISTS ONLY public.equipo DROP CONSTRAINT IF EXISTS "FK_500fa2da87ee3fc2757ac18d59c";
ALTER TABLE IF EXISTS ONLY public.usuario_cuenta_juego DROP CONSTRAINT IF EXISTS "FK_4e28b58d239de4925f8aaa9a8db";
ALTER TABLE IF EXISTS ONLY public.equipo_miembros DROP CONSTRAINT IF EXISTS "FK_40ba6e6f5228ef58122609684e3";
ALTER TABLE IF EXISTS ONLY public.torneo_inscripcion DROP CONSTRAINT IF EXISTS "FK_3c9690d76a9c18b0b367e06ccad";
ALTER TABLE IF EXISTS ONLY public.torneo DROP CONSTRAINT IF EXISTS "FK_38355018b4b70bda7a12912412d";
ALTER TABLE IF EXISTS ONLY public.transaccion DROP CONSTRAINT IF EXISTS "FK_316f8e4f7517d218d6e7622cd7f";
ALTER TABLE IF EXISTS ONLY public.torneo DROP CONSTRAINT IF EXISTS "FK_29622e4539834ab1c746c2e9317";
ALTER TABLE IF EXISTS ONLY public.usuario_amigos DROP CONSTRAINT IF EXISTS "FK_1f8d3d974f7dafaef0767ba9703";
ALTER TABLE IF EXISTS ONLY public.usuario_estadisticas_juego DROP CONSTRAINT IF EXISTS "FK_132d72a04a8ca3a95550816c4ac";
ALTER TABLE IF EXISTS ONLY public.usuario_trofeos DROP CONSTRAINT IF EXISTS "FK_109db65088fd652d967df849a69";
ALTER TABLE IF EXISTS ONLY public.transaccion DROP CONSTRAINT IF EXISTS "FK_0d8e48f71025813937ecb04140a";
ALTER TABLE IF EXISTS ONLY public.torneo DROP CONSTRAINT IF EXISTS "FK_0bd28f57e0d759273713724a527";
ALTER TABLE IF EXISTS ONLY public.torneo_inscripcion DROP CONSTRAINT IF EXISTS "FK_053143ab39cbdffa4e22190f651";
DROP TRIGGER IF EXISTS trg_actualizar_fondo_premios ON public.torneo_inscripcion;
DROP INDEX IF EXISTS public."IDX_d4c5b31c932eebd6e592ead6f1";
DROP INDEX IF EXISTS public."IDX_9770e3bc9af3bd32e4821c840d";
DROP INDEX IF EXISTS public."IDX_8f060be27f0622cfa62caba067";
DROP INDEX IF EXISTS public."IDX_64c7f2fa2b09757569c8addb23";
DROP INDEX IF EXISTS public."IDX_6150bc0608b585b62f23c4dfd8";
DROP INDEX IF EXISTS public."IDX_5ffcbb53c52bd4f83e4caed517";
DROP INDEX IF EXISTS public."IDX_4413e686f29147c934abf16f89";
DROP INDEX IF EXISTS public."IDX_12308297f402afa602fb36d0c7";
DROP INDEX IF EXISTS public."IDX_111c045b6c533e2c1eefedac97";
ALTER TABLE IF EXISTS ONLY public.tienda_solicitud_soporte DROP CONSTRAINT IF EXISTS tienda_solicitud_soporte_pkey;
ALTER TABLE IF EXISTS ONLY public.tienda_orden DROP CONSTRAINT IF EXISTS tienda_orden_pkey;
ALTER TABLE IF EXISTS ONLY public.catalogo_tipo_torneo DROP CONSTRAINT IF EXISTS catalogo_tipo_torneo_valor_key;
ALTER TABLE IF EXISTS ONLY public.catalogo_tipo_torneo DROP CONSTRAINT IF EXISTS catalogo_tipo_torneo_pkey;
ALTER TABLE IF EXISTS ONLY public.catalogo_estado_torneo DROP CONSTRAINT IF EXISTS "UQ_f3baf6357ba20547f359fd5b7e9";
ALTER TABLE IF EXISTS ONLY public.catalogo_rol DROP CONSTRAINT IF EXISTS "UQ_cdb2efce115c76aa3555c6da120";
ALTER TABLE IF EXISTS ONLY public.catalogo_avatar DROP CONSTRAINT IF EXISTS "UQ_ba84635357d0e25fe07abde50ec";
ALTER TABLE IF EXISTS ONLY public.torneo_premios DROP CONSTRAINT IF EXISTS "UQ_a3031bbf1c334efdde6a07e5a46";
ALTER TABLE IF EXISTS ONLY public.catalogo_region DROP CONSTRAINT IF EXISTS "UQ_9834d49a2d2d45c6e7623bc0465";
ALTER TABLE IF EXISTS ONLY public.catalogo_estado_amistad DROP CONSTRAINT IF EXISTS "UQ_80da378eba9ccaa65db285b832a";
ALTER TABLE IF EXISTS ONLY public.catalogo_estado_inscripcion DROP CONSTRAINT IF EXISTS "UQ_7b4445eeb23bf944fdaf228b0a8";
ALTER TABLE IF EXISTS ONLY public.persona DROP CONSTRAINT IF EXISTS "UQ_6150bc0608b585b62f23c4dfd86";
ALTER TABLE IF EXISTS ONLY public.usuario DROP CONSTRAINT IF EXISTS "UQ_4413e686f29147c934abf16f890";
ALTER TABLE IF EXISTS ONLY public.catalogo_tipo_entrada DROP CONSTRAINT IF EXISTS "UQ_41f3f4b005a54f45479e0b616f9";
ALTER TABLE IF EXISTS ONLY public.equipo DROP CONSTRAINT IF EXISTS "UQ_40ad7bfc23ed6409460806f4d60";
ALTER TABLE IF EXISTS ONLY public.catalogo_tipo_item DROP CONSTRAINT IF EXISTS "UQ_3e00684b9a21a4d23134717c2bc";
ALTER TABLE IF EXISTS ONLY public.juego DROP CONSTRAINT IF EXISTS "UQ_3d91e82f1bf4655834de3cf96f2";
ALTER TABLE IF EXISTS ONLY public.catalogo_transaccion_tipo DROP CONSTRAINT IF EXISTS "UQ_3a1f069338c2920d6c8ea417065";
ALTER TABLE IF EXISTS ONLY public.catalogo_genero DROP CONSTRAINT IF EXISTS "UQ_3263de178999924ffdbd8f12875";
ALTER TABLE IF EXISTS ONLY public.catalogo_origen_transaccion DROP CONSTRAINT IF EXISTS "UQ_2b993c64a643967861394ebb134";
ALTER TABLE IF EXISTS ONLY public.catalogo_plataforma DROP CONSTRAINT IF EXISTS "UQ_06e22b9038db0d083e5c3419109";
ALTER TABLE IF EXISTS ONLY public.usuario DROP CONSTRAINT IF EXISTS "REL_c9d223fa9cc0ea30abcd9d5ca7";
ALTER TABLE IF EXISTS ONLY public.juego_plataformas DROP CONSTRAINT IF EXISTS "PK_f5d5426c5be00c05916ad403c76";
ALTER TABLE IF EXISTS ONLY public.catalogo_rol DROP CONSTRAINT IF EXISTS "PK_f2531d28876065bc434e061d8a6";
ALTER TABLE IF EXISTS ONLY public.catalogo_tipo_item DROP CONSTRAINT IF EXISTS "PK_ef95256a46bdcd84f679eca48a6";
ALTER TABLE IF EXISTS ONLY public.tienda_item DROP CONSTRAINT IF EXISTS "PK_e494e2b265b44a3afb5a89ff7a8";
ALTER TABLE IF EXISTS ONLY public.membresia_tipo DROP CONSTRAINT IF EXISTS "PK_e2fb5f1f8558c80e491644449c0";
ALTER TABLE IF EXISTS ONLY public.usuario_trofeos DROP CONSTRAINT IF EXISTS "PK_db511af9ff13b69c34a539b56ee";
ALTER TABLE IF EXISTS ONLY public.torneo_redes DROP CONSTRAINT IF EXISTS "PK_d651da5cd7d1618d500bd62d86c";
ALTER TABLE IF EXISTS ONLY public.juego DROP CONSTRAINT IF EXISTS "PK_d0ac2f7932d13ee8976f473fe6f";
ALTER TABLE IF EXISTS ONLY public.torneo_premios DROP CONSTRAINT IF EXISTS "PK_d002e010d3343aca3faa87ddfcd";
ALTER TABLE IF EXISTS ONLY public.usuario_membresias DROP CONSTRAINT IF EXISTS "PK_c92891bbedc7f60b25b6559c2e6";
ALTER TABLE IF EXISTS ONLY public.torneo_inscripcion DROP CONSTRAINT IF EXISTS "PK_c3a2f268a54c077e48af8433e39";
ALTER TABLE IF EXISTS ONLY public.catalogo_transaccion_tipo DROP CONSTRAINT IF EXISTS "PK_c1b918568cdf4d5a35d51871be7";
ALTER TABLE IF EXISTS ONLY public.catalogo_plataforma DROP CONSTRAINT IF EXISTS "PK_a8c5d7450dd32402c0be7890bc0";
ALTER TABLE IF EXISTS ONLY public.usuario DROP CONSTRAINT IF EXISTS "PK_a56c58e5cabaa04fb2c98d2d7e2";
ALTER TABLE IF EXISTS ONLY public.equipo DROP CONSTRAINT IF EXISTS "PK_a545d29b4870688c462189447da";
ALTER TABLE IF EXISTS ONLY public.catalogo_avatar DROP CONSTRAINT IF EXISTS "PK_9ef244ef990f41ff8dfa6eabecb";
ALTER TABLE IF EXISTS ONLY public.usuario_cuenta_juego DROP CONSTRAINT IF EXISTS "PK_9d7b7179f3b92cd0e334024c072";
ALTER TABLE IF EXISTS ONLY public.catalogo_estado_amistad DROP CONSTRAINT IF EXISTS "PK_858035025304d0882010fc945b5";
ALTER TABLE IF EXISTS ONLY public.usuario_seguidores DROP CONSTRAINT IF EXISTS "PK_78aa436f4b719f1f71d9edfed4e";
ALTER TABLE IF EXISTS ONLY public.equipo_miembros DROP CONSTRAINT IF EXISTS "PK_76e8796c6f175e922b2741a0636";
ALTER TABLE IF EXISTS ONLY public.catalogo_region DROP CONSTRAINT IF EXISTS "PK_6ad72ee02b8478faf856012d201";
ALTER TABLE IF EXISTS ONLY public.catalogo_estado_torneo DROP CONSTRAINT IF EXISTS "PK_5e3012abb7954f1c0c985956152";
ALTER TABLE IF EXISTS ONLY public.torneo DROP CONSTRAINT IF EXISTS "PK_594cbe0a907eb32cb0ddfd63fea";
ALTER TABLE IF EXISTS ONLY public.usuario_estadisticas_juego DROP CONSTRAINT IF EXISTS "PK_5937df1f3f1c3e1beb252920e85";
ALTER TABLE IF EXISTS ONLY public.catalogo_estado_inscripcion DROP CONSTRAINT IF EXISTS "PK_556040c140cd0590336b1b1bc08";
ALTER TABLE IF EXISTS ONLY public.usuario_amigos DROP CONSTRAINT IF EXISTS "PK_40eab05adfd98664f9b767c86ee";
ALTER TABLE IF EXISTS ONLY public.modo_juego DROP CONSTRAINT IF EXISTS "PK_3358b634202bc66a4b5e5e9f8ea";
ALTER TABLE IF EXISTS ONLY public.usuario_logros DROP CONSTRAINT IF EXISTS "PK_32415c99be0edb1a3d5183e66a8";
ALTER TABLE IF EXISTS ONLY public.logro DROP CONSTRAINT IF EXISTS "PK_2bc9042c13742f2ced9c8adb36e";
ALTER TABLE IF EXISTS ONLY public.catalogo_origen_transaccion DROP CONSTRAINT IF EXISTS "PK_260aa8e778292484b569da3cfbe";
ALTER TABLE IF EXISTS ONLY public.usuario_red_social DROP CONSTRAINT IF EXISTS "PK_24c7dd1d299ffefa1385ec93c7d";
ALTER TABLE IF EXISTS ONLY public.torneo_resultados DROP CONSTRAINT IF EXISTS "PK_202662e0792ac782738a8a09be8";
ALTER TABLE IF EXISTS ONLY public.transaccion DROP CONSTRAINT IF EXISTS "PK_1d7fb1e642fb44d52a2fce77fc6";
ALTER TABLE IF EXISTS ONLY public.catalogo_tipo_entrada DROP CONSTRAINT IF EXISTS "PK_1b857ed635f616c5ea5e7ca99f3";
ALTER TABLE IF EXISTS ONLY public.persona DROP CONSTRAINT IF EXISTS "PK_13aefc75f60510f2be4cd243d71";
ALTER TABLE IF EXISTS ONLY public.catalogo_genero DROP CONSTRAINT IF EXISTS "PK_05a96ae5bf9e1eff3dcd19d764c";
DROP TABLE IF EXISTS public.usuario_trofeos;
DROP TABLE IF EXISTS public.usuario_seguidores;
DROP TABLE IF EXISTS public.usuario_red_social;
DROP TABLE IF EXISTS public.usuario_membresias;
DROP TABLE IF EXISTS public.usuario_logros;
DROP TABLE IF EXISTS public.usuario_estadisticas_juego;
DROP TABLE IF EXISTS public.usuario_cuenta_juego;
DROP TABLE IF EXISTS public.usuario_amigos;
DROP TABLE IF EXISTS public.usuario;
DROP TABLE IF EXISTS public.transaccion;
DROP TABLE IF EXISTS public.torneo_resultados;
DROP TABLE IF EXISTS public.torneo_redes;
DROP TABLE IF EXISTS public.torneo_premios;
DROP TABLE IF EXISTS public.torneo_inscripcion;
DROP TABLE IF EXISTS public.torneo;
DROP TABLE IF EXISTS public.tienda_solicitud_soporte;
DROP TABLE IF EXISTS public.tienda_orden;
DROP TABLE IF EXISTS public.tienda_item;
DROP TABLE IF EXISTS public.persona;
DROP TABLE IF EXISTS public.modo_juego;
DROP TABLE IF EXISTS public.membresia_tipo;
DROP TABLE IF EXISTS public.logro;
DROP TABLE IF EXISTS public.juego_plataformas;
DROP TABLE IF EXISTS public.juego;
DROP TABLE IF EXISTS public.equipo_miembros;
DROP TABLE IF EXISTS public.equipo;
DROP TABLE IF EXISTS public.catalogo_transaccion_tipo;
DROP TABLE IF EXISTS public.catalogo_tipo_torneo;
DROP TABLE IF EXISTS public.catalogo_tipo_item;
DROP TABLE IF EXISTS public.catalogo_tipo_entrada;
DROP TABLE IF EXISTS public.catalogo_rol;
DROP TABLE IF EXISTS public.catalogo_region;
DROP TABLE IF EXISTS public.catalogo_plataforma;
DROP TABLE IF EXISTS public.catalogo_origen_transaccion;
DROP TABLE IF EXISTS public.catalogo_genero;
DROP TABLE IF EXISTS public.catalogo_estado_torneo;
DROP TABLE IF EXISTS public.catalogo_estado_inscripcion;
DROP TABLE IF EXISTS public.catalogo_estado_amistad;
DROP TABLE IF EXISTS public.catalogo_avatar;
DROP FUNCTION IF EXISTS public.trigger_actualizar_fondo_premios();
DROP FUNCTION IF EXISTS public.torneo_upsert_red_social(p_torneo_id uuid, p_anfitrion_id uuid, p_plataforma character varying, p_url character varying, p_red_id uuid);
DROP FUNCTION IF EXISTS public.torneo_obtener_detalle(p_torneo_id uuid);
DROP FUNCTION IF EXISTS public.torneo_obtener_catalogos();
DROP FUNCTION IF EXISTS public.torneo_listar(p_estado character varying, p_juego_id uuid, p_region_id uuid, p_anfitrion_id uuid, p_busqueda character varying, p_limit integer, p_offset integer);
DROP FUNCTION IF EXISTS public.torneo_finalizar(p_torneo_id uuid, p_anfitrion_id uuid, p_resultados jsonb);
DROP FUNCTION IF EXISTS public.torneo_eliminar_red_social(p_torneo_id uuid, p_anfitrion_id uuid, p_red_id uuid);
DROP FUNCTION IF EXISTS public.torneo_crear(p_anfitrion_id uuid, p_titulo character varying, p_descripcion text, p_fecha_inicio_registro timestamp without time zone, p_fecha_fin_registro timestamp without time zone, p_fecha_inicio_torneo timestamp without time zone, p_juego_id uuid, p_plataforma_id uuid, p_modo_juego_id uuid, p_region_id uuid, p_tipo_torneo_id uuid, p_al_mejor_de integer, p_formato character varying, p_cerrado boolean, p_reglas text, p_jugadores_pc_permitidos boolean, p_requiere_transmision boolean, p_requiere_camara boolean, p_tipo_entrada_id uuid, p_capacidad integer, p_cuota integer, p_comision_porcentaje numeric, p_ganador1_porcentaje numeric, p_ganador2_porcentaje numeric, p_contacto_anfitrion character varying, p_discord_servidor character varying, p_redes_sociales jsonb, p_banner_url character varying, p_miniatura_url character varying);
DROP FUNCTION IF EXISTS public.torneo_cambiar_estado(p_torneo_id uuid, p_anfitrion_id uuid, p_nuevo_estado character varying);
DROP FUNCTION IF EXISTS public.torneo_actualizar(p_torneo_id uuid, p_anfitrion_id uuid, p_titulo character varying, p_descripcion text, p_fecha_inicio_registro timestamp without time zone, p_fecha_fin_registro timestamp without time zone, p_fecha_inicio_torneo timestamp without time zone, p_juego_id uuid, p_plataforma_id uuid, p_modo_juego_id uuid, p_region_id uuid, p_tipo_torneo_id uuid, p_al_mejor_de integer, p_formato character varying, p_cerrado boolean, p_reglas text, p_jugadores_pc_permitidos boolean, p_requiere_transmision boolean, p_requiere_camara boolean, p_tipo_entrada_id uuid, p_capacidad integer, p_cuota integer, p_comision_porcentaje numeric, p_ganador1_porcentaje numeric, p_ganador2_porcentaje numeric, p_contacto_anfitrion character varying, p_discord_servidor character varying, p_banner_url character varying, p_miniatura_url character varying);
DROP FUNCTION IF EXISTS public.tienda_verificar_nickname(p_nickname character varying);
DROP FUNCTION IF EXISTS public.tienda_resolver_solicitud_soporte(p_solicitud_id uuid, p_admin_id uuid, p_aprobar boolean, p_notas character varying);
DROP FUNCTION IF EXISTS public.tienda_registrar_pago_paypal(p_orden_id uuid, p_paypal_order_id character varying, p_paypal_capture_id character varying, p_paypal_payer_id character varying, p_paypal_payer_email character varying);
DROP FUNCTION IF EXISTS public.tienda_obtener_solicitudes_soporte(p_estado character varying, p_limit integer, p_offset integer);
DROP FUNCTION IF EXISTS public.tienda_obtener_catalogo(p_usuario_id uuid);
DROP FUNCTION IF EXISTS public.tienda_historial_compras(p_usuario_id uuid, p_limit integer, p_offset integer);
DROP FUNCTION IF EXISTS public.tienda_crear_orden(p_usuario_id uuid, p_item_id uuid, p_metadata jsonb);
DROP FUNCTION IF EXISTS public.tienda_confirmar_compra(p_orden_id uuid, p_paypal_capture_id character varying);
DROP FUNCTION IF EXISTS public.tienda_comprar_con_saldo(p_usuario_id uuid, p_item_id uuid, p_metadata jsonb);
DROP FUNCTION IF EXISTS public.tienda_cancelar_orden(p_orden_id uuid, p_usuario_id uuid);
DROP FUNCTION IF EXISTS public.obtener_vitrina_trofeos(p_nickname character varying, p_limit integer, p_offset integer);
DROP FUNCTION IF EXISTS public.obtener_redes_sociales(p_nickname character varying);
DROP FUNCTION IF EXISTS public.obtener_perfil_usuario(p_nickname character varying, p_viewer_id uuid);
DROP FUNCTION IF EXISTS public.obtener_perfil_completo_json(p_nickname character varying, p_viewer_id uuid);
DROP FUNCTION IF EXISTS public.obtener_logros_usuario(p_nickname character varying, p_limit integer, p_offset integer);
DROP FUNCTION IF EXISTS public.obtener_lista_amigos(p_nickname character varying, p_limit integer, p_offset integer);
DROP FUNCTION IF EXISTS public.obtener_historial_torneos(p_nickname character varying, p_limit integer, p_offset integer);
DROP FUNCTION IF EXISTS public.obtener_estadisticas_juegos(p_nickname character varying);
DROP FUNCTION IF EXISTS public.obtener_equipos_usuario(p_nickname character varying);
DROP FUNCTION IF EXISTS public.obtener_cuentas_juego(p_nickname character varying);
DROP FUNCTION IF EXISTS public.config_upsert_social(p_usuario_id uuid, p_plataforma character varying, p_enlace character varying, p_red_id uuid);
DROP FUNCTION IF EXISTS public.config_upsert_cuenta_juego(p_usuario_id uuid, p_plataforma_id uuid, p_identificador character varying, p_cuenta_id uuid);
DROP FUNCTION IF EXISTS public.config_update_seguridad(p_usuario_id uuid, p_correo_paypal character varying, p_p_nombre character varying, p_s_nombre character varying, p_p_apellido character varying, p_s_apellido character varying, p_telefono character varying, p_direccion character varying, p_ciudad character varying, p_estado character varying, p_codigo_postal character varying, p_pais character varying, p_divisa character varying);
DROP FUNCTION IF EXISTS public.config_update_preferencias(p_usuario_id uuid, p_desafios_habilitados boolean);
DROP FUNCTION IF EXISTS public.config_update_personal(p_usuario_id uuid, p_biografia character varying, p_genero_id uuid, p_timezone character varying, p_avatar_id uuid);
DROP FUNCTION IF EXISTS public.config_update_password(p_usuario_id uuid, p_nuevo_password_hash character varying);
DROP FUNCTION IF EXISTS public.config_get_social(p_usuario_id uuid);
DROP FUNCTION IF EXISTS public.config_get_seguridad(p_usuario_id uuid);
DROP FUNCTION IF EXISTS public.config_get_retiro(p_usuario_id uuid);
DROP FUNCTION IF EXISTS public.config_get_preferencias(p_usuario_id uuid);
DROP FUNCTION IF EXISTS public.config_get_personal(p_usuario_id uuid);
DROP FUNCTION IF EXISTS public.config_get_juegos(p_usuario_id uuid);
DROP FUNCTION IF EXISTS public.config_get_cuenta(p_usuario_id uuid);
DROP FUNCTION IF EXISTS public.config_get_completa(p_usuario_id uuid);
DROP FUNCTION IF EXISTS public.config_delete_social(p_usuario_id uuid, p_red_id uuid);
DROP FUNCTION IF EXISTS public.config_delete_cuenta_juego(p_usuario_id uuid, p_cuenta_id uuid);
DROP TYPE IF EXISTS public.perfil_usuario_resultado;
DROP EXTENSION IF EXISTS "uuid-ossp";
--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: perfil_usuario_resultado; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.perfil_usuario_resultado AS (
	usuario_id uuid,
	nickname character varying,
	xp integer,
	saldo numeric(12,2),
	creditos integer,
	foto_perfil character varying,
	biografia character varying(300),
	estado character varying(50),
	ultima_conexion timestamp without time zone,
	desafios_habilitados boolean,
	creado_en timestamp without time zone,
	avatar_url character varying,
	avatar_nombre character varying,
	p_nombre character varying,
	s_nombre character varying,
	p_apellido character varying,
	s_apellido character varying,
	correo character varying,
	fecha_nacimiento date,
	pais character varying,
	ciudad character varying,
	rol character varying,
	total_amigos integer,
	total_seguidores integer,
	total_siguiendo integer,
	total_trofeos integer,
	total_logros integer,
	total_torneos_participados integer,
	total_victorias_torneos integer,
	total_derrotas_global integer,
	dinero_total_ganado numeric(12,2),
	estado_amistad character varying,
	solicitud_amistad_id uuid
);


--
-- Name: config_delete_cuenta_juego(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.config_delete_cuenta_juego(p_usuario_id uuid, p_cuenta_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    DELETE FROM usuario_cuenta_juego
    WHERE id = p_cuenta_id AND usuario_id = p_usuario_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cuenta de juego no encontrada';
    END IF;
    
    UPDATE usuario SET actualizado_en = NOW() WHERE id = p_usuario_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Cuenta de juego eliminada correctamente'
    );
END;
$$;


--
-- Name: FUNCTION config_delete_cuenta_juego(p_usuario_id uuid, p_cuenta_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.config_delete_cuenta_juego(p_usuario_id uuid, p_cuenta_id uuid) IS 'DELETE /usuario/configuracion/juegos/:id - Elimina cuenta de juego';


--
-- Name: config_delete_social(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.config_delete_social(p_usuario_id uuid, p_red_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    DELETE FROM usuario_red_social
    WHERE id = p_red_id AND usuario_id = p_usuario_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Red social no encontrada';
    END IF;
    
    UPDATE usuario SET actualizado_en = NOW() WHERE id = p_usuario_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Red social eliminada correctamente'
    );
END;
$$;


--
-- Name: FUNCTION config_delete_social(p_usuario_id uuid, p_red_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.config_delete_social(p_usuario_id uuid, p_red_id uuid) IS 'DELETE /usuario/configuracion/social/:id - Elimina una red social';


--
-- Name: config_get_completa(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.config_get_completa(p_usuario_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_resultado JSONB;
BEGIN
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM usuario WHERE id = p_usuario_id AND deleted_at IS NULL) THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
    
    SELECT jsonb_build_object(
        'personal', config_get_personal(p_usuario_id),
        'social', config_get_social(p_usuario_id),
        'juegos', config_get_juegos(p_usuario_id),
        'preferencias', config_get_preferencias(p_usuario_id),
        'cuenta', config_get_cuenta(p_usuario_id),
        'seguridad', config_get_seguridad(p_usuario_id),
        'retiro', config_get_retiro(p_usuario_id)
    )
    INTO v_resultado;
    
    RETURN v_resultado;
END;
$$;


--
-- Name: FUNCTION config_get_completa(p_usuario_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.config_get_completa(p_usuario_id uuid) IS 'GET /usuario/configuracion - Retorna TODA la configuraci??n del usuario en una llamada';


--
-- Name: config_get_cuenta(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.config_get_cuenta(p_usuario_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_resultado JSONB;
BEGIN
    SELECT jsonb_build_object(
        'correo', p.correo,
        'nickname', u.nickname,
        'creado_en', u.creado_en,
        'ultima_conexion', u.ultima_conexion,
        'estado', u.estado
    )
    INTO v_resultado
    FROM usuario u
    LEFT JOIN persona p ON u.persona_id = p.id
    WHERE u.id = p_usuario_id AND u.deleted_at IS NULL;
    
    IF v_resultado IS NULL THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
    
    RETURN v_resultado;
END;
$$;


--
-- Name: FUNCTION config_get_cuenta(p_usuario_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.config_get_cuenta(p_usuario_id uuid) IS 'GET /usuario/configuracion/cuenta - Retorna correo (readonly), info de cuenta';


--
-- Name: config_get_juegos(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.config_get_juegos(p_usuario_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_resultado JSONB;
BEGIN
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM usuario WHERE id = p_usuario_id AND deleted_at IS NULL) THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
    
    SELECT jsonb_build_object(
        'cuentas_juego', COALESCE((
            SELECT jsonb_agg(jsonb_build_object(
                'id', ucj.id,
                'plataforma_id', cp.id,
                'plataforma', cp.valor,
                'identificador', ucj.identificador
            ) ORDER BY cp.valor)
            FROM usuario_cuenta_juego ucj
            JOIN catalogo_plataforma cp ON ucj.plataforma_juego_id = cp.id
            WHERE ucj.usuario_id = p_usuario_id
        ), '[]'::jsonb),
        'plataformas_disponibles', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
                'id', cp.id,
                'valor', cp.valor
            ) ORDER BY cp.valor), '[]'::jsonb)
            FROM catalogo_plataforma cp
        )
    )
    INTO v_resultado;
    
    RETURN v_resultado;
END;
$$;


--
-- Name: FUNCTION config_get_juegos(p_usuario_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.config_get_juegos(p_usuario_id uuid) IS 'GET /usuario/configuracion/juegos - Retorna cuentas de plataformas de juegos';


--
-- Name: config_get_personal(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.config_get_personal(p_usuario_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_resultado JSONB;
BEGIN
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM usuario WHERE id = p_usuario_id AND deleted_at IS NULL) THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
    
    SELECT jsonb_build_object(
        'nickname', u.nickname,
        'biografia', u.biografia,
        'genero', jsonb_build_object(
            'id', cg.id,
            'valor', cg.valor
        ),
        'timezone', p.timezone,
        'foto_perfil', u.foto_perfil,
        'avatar', jsonb_build_object(
            'id', ca.id,
            'nombre', ca.nombre,
            'url', ca.url
        ),
        'generos_disponibles', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
                'id', g.id,
                'valor', g.valor
            ) ORDER BY g.valor), '[]'::jsonb)
            FROM catalogo_genero g
        )
    )
    INTO v_resultado
    FROM usuario u
    LEFT JOIN persona p ON u.persona_id = p.id
    LEFT JOIN catalogo_genero cg ON p.genero_id = cg.id
    LEFT JOIN catalogo_avatar ca ON u.avatar_id = ca.id
    WHERE u.id = p_usuario_id;
    
    RETURN v_resultado;
END;
$$;


--
-- Name: FUNCTION config_get_personal(p_usuario_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.config_get_personal(p_usuario_id uuid) IS 'GET /usuario/configuracion/personal - Retorna nickname (readonly), biografia, genero, timezone';


--
-- Name: config_get_preferencias(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.config_get_preferencias(p_usuario_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_resultado JSONB;
BEGIN
    SELECT jsonb_build_object(
        'desafios_habilitados', u.desafios_habilitados
    )
    INTO v_resultado
    FROM usuario u
    WHERE u.id = p_usuario_id AND u.deleted_at IS NULL;
    
    IF v_resultado IS NULL THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
    
    RETURN v_resultado;
END;
$$;


--
-- Name: FUNCTION config_get_preferencias(p_usuario_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.config_get_preferencias(p_usuario_id uuid) IS 'GET /usuario/configuracion/preferencias - Retorna preferencias (desafios_habilitados)';


--
-- Name: config_get_retiro(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.config_get_retiro(p_usuario_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_resultado JSONB;
BEGIN
    SELECT jsonb_build_object(
        'saldo_disponible', u.saldo,
        'creditos', u.creditos,
        'correo_paypal', p.correo_paypal,
        'paypal_configurado', (p.correo_paypal IS NOT NULL AND p.correo_paypal != ''),
        'historial_retiros', '[]'::jsonb,  -- Placeholder
        'mensaje', 'Funcionalidad de retiros en desarrollo. Pr??ximamente disponible.'
    )
    INTO v_resultado
    FROM usuario u
    LEFT JOIN persona p ON u.persona_id = p.id
    WHERE u.id = p_usuario_id AND u.deleted_at IS NULL;
    
    IF v_resultado IS NULL THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
    
    RETURN v_resultado;
END;
$$;


--
-- Name: FUNCTION config_get_retiro(p_usuario_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.config_get_retiro(p_usuario_id uuid) IS 'GET /usuario/configuracion/retiro - Placeholder para futura integraci??n de retiros';


--
-- Name: config_get_seguridad(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.config_get_seguridad(p_usuario_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_resultado JSONB;
BEGIN
    SELECT jsonb_build_object(
        'correo_paypal', p.correo_paypal,
        'p_nombre', p.p_nombre,
        's_nombre', p.s_nombre,
        'p_apellido', p.p_apellido,
        's_apellido', p.s_apellido,
        'telefono', p.telefono,
        'direccion', p.direccion,
        'ciudad', p.ciudad,
        'estado', p.estado,
        'codigo_postal', p.codigo_postal,
        'pais', p.pais,
        'divisa', p.divisa,
        'divisas_disponibles', jsonb_build_array(
            'USD', 'EUR', 'MXN', 'COP', 'ARS', 'CLP', 'PEN', 'BRL'
        )
    )
    INTO v_resultado
    FROM usuario u
    LEFT JOIN persona p ON u.persona_id = p.id
    WHERE u.id = p_usuario_id AND u.deleted_at IS NULL;
    
    IF v_resultado IS NULL THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
    
    RETURN v_resultado;
END;
$$;


--
-- Name: FUNCTION config_get_seguridad(p_usuario_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.config_get_seguridad(p_usuario_id uuid) IS 'GET /usuario/configuracion/seguridad - Retorna datos de pago: PayPal, direcci??n, etc.';


--
-- Name: config_get_social(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.config_get_social(p_usuario_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_resultado JSONB;
BEGIN
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM usuario WHERE id = p_usuario_id AND deleted_at IS NULL) THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
    
    SELECT jsonb_build_object(
        'redes_sociales', COALESCE((
            SELECT jsonb_agg(jsonb_build_object(
                'id', urs.id,
                'plataforma', urs.plataforma,
                'enlace', urs.enlace
            ) ORDER BY urs.plataforma)
            FROM usuario_red_social urs
            WHERE urs.usuario_id = p_usuario_id
        ), '[]'::jsonb),
        'plataformas_sugeridas', jsonb_build_array(
            'Twitter', 'Twitch', 'YouTube', 'Discord', 'Instagram', 'TikTok', 'Facebook'
        )
    )
    INTO v_resultado;
    
    RETURN v_resultado;
END;
$$;


--
-- Name: FUNCTION config_get_social(p_usuario_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.config_get_social(p_usuario_id uuid) IS 'GET /usuario/configuracion/social - Retorna lista de redes sociales del usuario';


--
-- Name: config_update_password(uuid, character varying); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.config_update_password(p_usuario_id uuid, p_nuevo_password_hash character varying) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Validar que se proporciona un password
    IF p_nuevo_password_hash IS NULL OR TRIM(p_nuevo_password_hash) = '' THEN
        RAISE EXCEPTION 'La contrase??a es requerida';
    END IF;
    
    UPDATE usuario
    SET password = p_nuevo_password_hash,
        actualizado_en = NOW()
    WHERE id = p_usuario_id AND deleted_at IS NULL;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
    
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Contrase??a actualizada correctamente'
    );
END;
$$;


--
-- Name: FUNCTION config_update_password(p_usuario_id uuid, p_nuevo_password_hash character varying); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.config_update_password(p_usuario_id uuid, p_nuevo_password_hash character varying) IS 'PUT /usuario/configuracion/cuenta/password - Cambia contrase??a (hash generado en backend)';


--
-- Name: config_update_personal(uuid, character varying, uuid, character varying, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.config_update_personal(p_usuario_id uuid, p_biografia character varying DEFAULT NULL::character varying, p_genero_id uuid DEFAULT NULL::uuid, p_timezone character varying DEFAULT NULL::character varying, p_avatar_id uuid DEFAULT NULL::uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_persona_id UUID;
    v_cambios INTEGER := 0;
BEGIN
    -- Verificar que el usuario existe
    SELECT persona_id INTO v_persona_id
    FROM usuario
    WHERE id = p_usuario_id AND deleted_at IS NULL;
    
    IF v_persona_id IS NULL THEN
        -- Puede que el usuario exista pero no tenga persona asociada
        IF NOT EXISTS (SELECT 1 FROM usuario WHERE id = p_usuario_id AND deleted_at IS NULL) THEN
            RAISE EXCEPTION 'Usuario no encontrado';
        END IF;
    END IF;
    
    -- Validar g??nero si se proporciona
    IF p_genero_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM catalogo_genero WHERE id = p_genero_id) THEN
            RAISE EXCEPTION 'G??nero no v??lido';
        END IF;
    END IF;
    
    -- Validar avatar si se proporciona
    IF p_avatar_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM catalogo_avatar WHERE id = p_avatar_id AND disponible = true) THEN
            RAISE EXCEPTION 'Avatar no disponible';
        END IF;
    END IF;
    
    -- Actualizar usuario (biografia y avatar)
    UPDATE usuario
    SET 
        biografia = COALESCE(p_biografia, biografia),
        avatar_id = COALESCE(p_avatar_id, avatar_id),
        actualizado_en = NOW()
    WHERE id = p_usuario_id;
    
    GET DIAGNOSTICS v_cambios = ROW_COUNT;
    
    -- Actualizar persona (genero y timezone)
    IF v_persona_id IS NOT NULL AND (p_genero_id IS NOT NULL OR p_timezone IS NOT NULL) THEN
        UPDATE persona
        SET 
            genero_id = COALESCE(p_genero_id, genero_id),
            timezone = COALESCE(p_timezone, timezone),
            actualizado_en = NOW()
        WHERE id = v_persona_id;
    END IF;
    
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Configuraci??n personal actualizada correctamente'
    );
END;
$$;


--
-- Name: FUNCTION config_update_personal(p_usuario_id uuid, p_biografia character varying, p_genero_id uuid, p_timezone character varying, p_avatar_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.config_update_personal(p_usuario_id uuid, p_biografia character varying, p_genero_id uuid, p_timezone character varying, p_avatar_id uuid) IS 'PUT /usuario/configuracion/personal - Actualiza biografia, genero_id, timezone, avatar_id';


--
-- Name: config_update_preferencias(uuid, boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.config_update_preferencias(p_usuario_id uuid, p_desafios_habilitados boolean) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    UPDATE usuario
    SET desafios_habilitados = p_desafios_habilitados,
        actualizado_en = NOW()
    WHERE id = p_usuario_id AND deleted_at IS NULL;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
    
    RETURN jsonb_build_object(
        'success', true,
        'desafios_habilitados', p_desafios_habilitados,
        'message', 'Preferencias actualizadas correctamente'
    );
END;
$$;


--
-- Name: FUNCTION config_update_preferencias(p_usuario_id uuid, p_desafios_habilitados boolean); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.config_update_preferencias(p_usuario_id uuid, p_desafios_habilitados boolean) IS 'PUT /usuario/configuracion/preferencias - Actualiza desafios_habilitados';


--
-- Name: config_update_seguridad(uuid, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.config_update_seguridad(p_usuario_id uuid, p_correo_paypal character varying DEFAULT NULL::character varying, p_p_nombre character varying DEFAULT NULL::character varying, p_s_nombre character varying DEFAULT NULL::character varying, p_p_apellido character varying DEFAULT NULL::character varying, p_s_apellido character varying DEFAULT NULL::character varying, p_telefono character varying DEFAULT NULL::character varying, p_direccion character varying DEFAULT NULL::character varying, p_ciudad character varying DEFAULT NULL::character varying, p_estado character varying DEFAULT NULL::character varying, p_codigo_postal character varying DEFAULT NULL::character varying, p_pais character varying DEFAULT NULL::character varying, p_divisa character varying DEFAULT NULL::character varying) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_persona_id UUID;
BEGIN
    -- Obtener persona_id
    SELECT persona_id INTO v_persona_id
    FROM usuario
    WHERE id = p_usuario_id AND deleted_at IS NULL;
    
    IF v_persona_id IS NULL THEN
        RAISE EXCEPTION 'Usuario no encontrado o sin datos personales asociados';
    END IF;
    
    -- Validar divisa si se proporciona
    IF p_divisa IS NOT NULL AND p_divisa NOT IN ('USD', 'EUR', 'MXN', 'COP', 'ARS', 'CLP', 'PEN', 'BRL') THEN
        RAISE EXCEPTION 'Divisa no v??lida';
    END IF;
    
    -- Actualizar persona
    UPDATE persona
    SET 
        correo_paypal = COALESCE(p_correo_paypal, correo_paypal),
        p_nombre = COALESCE(p_p_nombre, p_nombre),
        s_nombre = COALESCE(p_s_nombre, s_nombre),
        p_apellido = COALESCE(p_p_apellido, p_apellido),
        s_apellido = COALESCE(p_s_apellido, s_apellido),
        telefono = COALESCE(p_telefono, telefono),
        direccion = COALESCE(p_direccion, direccion),
        ciudad = COALESCE(p_ciudad, ciudad),
        estado = COALESCE(p_estado, estado),
        codigo_postal = COALESCE(p_codigo_postal, codigo_postal),
        pais = COALESCE(p_pais, pais),
        divisa = COALESCE(p_divisa, divisa),
        actualizado_en = NOW()
    WHERE id = v_persona_id;
    
    UPDATE usuario SET actualizado_en = NOW() WHERE id = p_usuario_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Informaci??n de seguridad actualizada correctamente'
    );
END;
$$;


--
-- Name: FUNCTION config_update_seguridad(p_usuario_id uuid, p_correo_paypal character varying, p_p_nombre character varying, p_s_nombre character varying, p_p_apellido character varying, p_s_apellido character varying, p_telefono character varying, p_direccion character varying, p_ciudad character varying, p_estado character varying, p_codigo_postal character varying, p_pais character varying, p_divisa character varying); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.config_update_seguridad(p_usuario_id uuid, p_correo_paypal character varying, p_p_nombre character varying, p_s_nombre character varying, p_p_apellido character varying, p_s_apellido character varying, p_telefono character varying, p_direccion character varying, p_ciudad character varying, p_estado character varying, p_codigo_postal character varying, p_pais character varying, p_divisa character varying) IS 'PUT /usuario/configuracion/seguridad - Actualiza datos de pago y direcci??n';


--
-- Name: config_upsert_cuenta_juego(uuid, uuid, character varying, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.config_upsert_cuenta_juego(p_usuario_id uuid, p_plataforma_id uuid, p_identificador character varying, p_cuenta_id uuid DEFAULT NULL::uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_cuenta_id UUID;
BEGIN
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM usuario WHERE id = p_usuario_id AND deleted_at IS NULL) THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
    
    -- Validar plataforma
    IF NOT EXISTS (SELECT 1 FROM catalogo_plataforma WHERE id = p_plataforma_id) THEN
        RAISE EXCEPTION 'Plataforma no v??lida';
    END IF;
    
    -- Validar identificador
    IF p_identificador IS NULL OR TRIM(p_identificador) = '' THEN
        RAISE EXCEPTION 'El identificador es requerido';
    END IF;
    
    IF p_cuenta_id IS NOT NULL THEN
        -- Actualizar existente
        UPDATE usuario_cuenta_juego
        SET plataforma_juego_id = p_plataforma_id,
            identificador = p_identificador
        WHERE id = p_cuenta_id AND usuario_id = p_usuario_id;
        
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Cuenta de juego no encontrada';
        END IF;
        
        v_cuenta_id := p_cuenta_id;
    ELSE
        -- Verificar si ya existe esta plataforma para el usuario
        SELECT id INTO v_cuenta_id
        FROM usuario_cuenta_juego
        WHERE usuario_id = p_usuario_id AND plataforma_juego_id = p_plataforma_id;
        
        IF v_cuenta_id IS NOT NULL THEN
            -- Actualizar existente
            UPDATE usuario_cuenta_juego
            SET identificador = p_identificador
            WHERE id = v_cuenta_id;
        ELSE
            -- Crear nueva
            INSERT INTO usuario_cuenta_juego (usuario_id, plataforma_juego_id, identificador)
            VALUES (p_usuario_id, p_plataforma_id, p_identificador)
            RETURNING id INTO v_cuenta_id;
        END IF;
    END IF;
    
    UPDATE usuario SET actualizado_en = NOW() WHERE id = p_usuario_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'cuenta_id', v_cuenta_id,
        'message', 'Cuenta de juego guardada correctamente'
    );
END;
$$;


--
-- Name: FUNCTION config_upsert_cuenta_juego(p_usuario_id uuid, p_plataforma_id uuid, p_identificador character varying, p_cuenta_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.config_upsert_cuenta_juego(p_usuario_id uuid, p_plataforma_id uuid, p_identificador character varying, p_cuenta_id uuid) IS 'POST/PUT /usuario/configuracion/juegos - Crea o actualiza cuenta de juego';


--
-- Name: config_upsert_social(uuid, character varying, character varying, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.config_upsert_social(p_usuario_id uuid, p_plataforma character varying, p_enlace character varying, p_red_id uuid DEFAULT NULL::uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_red_id UUID;
BEGIN
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM usuario WHERE id = p_usuario_id AND deleted_at IS NULL) THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
    
    -- Validar datos
    IF p_plataforma IS NULL OR TRIM(p_plataforma) = '' THEN
        RAISE EXCEPTION 'La plataforma es requerida';
    END IF;
    
    IF p_enlace IS NULL OR TRIM(p_enlace) = '' THEN
        RAISE EXCEPTION 'El enlace es requerido';
    END IF;
    
    IF p_red_id IS NOT NULL THEN
        -- Actualizar existente
        UPDATE usuario_red_social
        SET plataforma = p_plataforma,
            enlace = p_enlace
        WHERE id = p_red_id AND usuario_id = p_usuario_id;
        
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Red social no encontrada';
        END IF;
        
        v_red_id := p_red_id;
    ELSE
        -- Verificar si ya existe esta plataforma para el usuario
        IF EXISTS (
            SELECT 1 FROM usuario_red_social 
            WHERE usuario_id = p_usuario_id 
            AND LOWER(plataforma) = LOWER(p_plataforma)
        ) THEN
            -- Actualizar existente por plataforma
            UPDATE usuario_red_social
            SET enlace = p_enlace
            WHERE usuario_id = p_usuario_id AND LOWER(plataforma) = LOWER(p_plataforma)
            RETURNING id INTO v_red_id;
        ELSE
            -- Crear nueva
            INSERT INTO usuario_red_social (usuario_id, plataforma, enlace)
            VALUES (p_usuario_id, p_plataforma, p_enlace)
            RETURNING id INTO v_red_id;
        END IF;
    END IF;
    
    -- Actualizar timestamp del usuario
    UPDATE usuario SET actualizado_en = NOW() WHERE id = p_usuario_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'red_id', v_red_id,
        'message', 'Red social guardada correctamente'
    );
END;
$$;


--
-- Name: FUNCTION config_upsert_social(p_usuario_id uuid, p_plataforma character varying, p_enlace character varying, p_red_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.config_upsert_social(p_usuario_id uuid, p_plataforma character varying, p_enlace character varying, p_red_id uuid) IS 'POST/PUT /usuario/configuracion/social - Crea o actualiza una red social';


--
-- Name: obtener_cuentas_juego(character varying); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.obtener_cuentas_juego(p_nickname character varying) RETURNS TABLE(cuenta_id uuid, plataforma character varying, identificador character varying)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_usuario_id UUID;
BEGIN
    -- Obtener el ID del usuario por nickname
    SELECT id INTO v_usuario_id
    FROM usuario
    WHERE nickname = p_nickname AND deleted_at IS NULL;
    
    IF v_usuario_id IS NULL THEN
        RAISE EXCEPTION 'Usuario con nickname % no encontrado', p_nickname;
    END IF;
    
    RETURN QUERY
    SELECT 
        ucj.id,
        cp.valor,
        ucj.identificador
    FROM usuario_cuenta_juego ucj
    JOIN catalogo_plataforma cp ON ucj.plataforma_juego_id = cp.id
    WHERE ucj.usuario_id = v_usuario_id
    ORDER BY cp.valor;
END;
$$;


--
-- Name: FUNCTION obtener_cuentas_juego(p_nickname character varying); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.obtener_cuentas_juego(p_nickname character varying) IS 'Obtiene las cuentas de plataformas de juego vinculadas al usuario.';


--
-- Name: obtener_equipos_usuario(character varying); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.obtener_equipos_usuario(p_nickname character varying) RETURNS TABLE(equipo_id uuid, equipo_nombre character varying, equipo_descripcion text, equipo_avatar_url character varying, rol_en_equipo character varying, fecha_ingreso timestamp without time zone, total_miembros bigint)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_usuario_id UUID;
BEGIN
    -- Obtener el ID del usuario por nickname
    SELECT id INTO v_usuario_id
    FROM usuario
    WHERE nickname = p_nickname AND deleted_at IS NULL;
    
    IF v_usuario_id IS NULL THEN
        RAISE EXCEPTION 'Usuario con nickname % no encontrado', p_nickname;
    END IF;
    
    RETURN QUERY
    SELECT 
        e.id,
        e.nombre,
        e.descripcion,
        e.avatar_url,
        em.rol,
        em.joined_at,
        (SELECT COUNT(*) FROM equipo_miembros em2 WHERE em2.equipo_id = e.id)
    FROM equipo_miembros em
    JOIN equipo e ON em.equipo_id = e.id
    WHERE em.usuario_id = v_usuario_id
    ORDER BY em.joined_at DESC;
END;
$$;


--
-- Name: FUNCTION obtener_equipos_usuario(p_nickname character varying); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.obtener_equipos_usuario(p_nickname character varying) IS 'Obtiene los equipos a los que pertenece el usuario con su rol.';


--
-- Name: obtener_estadisticas_juegos(character varying); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.obtener_estadisticas_juegos(p_nickname character varying) RETURNS TABLE(juego_id uuid, juego_nombre character varying, victorias integer, derrotas integer, empates integer, porcentaje_victorias numeric, nivel_rango character varying, horas_jugadas integer, actualizado_en timestamp without time zone)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_usuario_id UUID;
BEGIN
    -- Obtener el ID del usuario por nickname
    SELECT id INTO v_usuario_id
    FROM usuario
    WHERE nickname = p_nickname AND deleted_at IS NULL;
    
    IF v_usuario_id IS NULL THEN
        RAISE EXCEPTION 'Usuario con nickname % no encontrado', p_nickname;
    END IF;
    
    RETURN QUERY
    SELECT 
        j.id,
        j.nombre::VARCHAR,
        uej.victorias,
        uej.derrotas,
        uej.empates,
        CASE 
            WHEN (uej.victorias + uej.derrotas + uej.empates) > 0 
            THEN ROUND((uej.victorias::NUMERIC / (uej.victorias + uej.derrotas + uej.empates)) * 100, 2)
            ELSE 0.00
        END,
        uej.nivel_rango,
        uej.horas_jugadas,
        uej.actualizado_en
    FROM usuario_estadisticas_juego uej
    JOIN juego j ON uej.juego_id = j.id
    WHERE uej.usuario_id = v_usuario_id
    ORDER BY uej.victorias DESC;
END;
$$;


--
-- Name: FUNCTION obtener_estadisticas_juegos(p_nickname character varying); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.obtener_estadisticas_juegos(p_nickname character varying) IS 'Obtiene las estad??sticas de rendimiento del usuario por cada juego.';


--
-- Name: obtener_historial_torneos(character varying, integer, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.obtener_historial_torneos(p_nickname character varying, p_limit integer DEFAULT 20, p_offset integer DEFAULT 0) RETURNS TABLE(torneo_id uuid, torneo_titulo character varying, juego_nombre character varying, fecha_inicio timestamp without time zone, fecha_inscripcion timestamp without time zone, estado_inscripcion character varying, posicion_final integer, premio_ganado numeric, tipo_trofeo character varying)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_usuario_id UUID;
BEGIN
    -- Obtener el ID del usuario por nickname
    SELECT id INTO v_usuario_id
    FROM usuario
    WHERE nickname = p_nickname AND deleted_at IS NULL;
    
    IF v_usuario_id IS NULL THEN
        RAISE EXCEPTION 'Usuario con nickname % no encontrado', p_nickname;
    END IF;
    
    RETURN QUERY
    SELECT 
        t.id,
        t.titulo::VARCHAR,
        j.nombre::VARCHAR,
        t.fecha_inicio_torneo,
        ti.fecha,
        cei.valor::VARCHAR,
        tr.posicion,
        -- Calcular premio ganado basado en posici??n
        CASE 
            WHEN tr.posicion = 1 THEN 
                COALESCE(tp.fondo_despues_comision * tp.ganador1_porcentaje / 100, 0)
            WHEN tr.posicion = 2 THEN 
                COALESCE(tp.fondo_despues_comision * tp.ganador2_porcentaje / 100, 0)
            ELSE 0.00
        END,
        ut.tipo_trofeo
    FROM torneo_inscripcion ti
    JOIN torneo t ON ti.torneo_id = t.id
    JOIN catalogo_estado_inscripcion cei ON ti.estado_id = cei.id
    LEFT JOIN juego j ON t.juego_id = j.id
    LEFT JOIN torneo_resultados tr ON tr.torneo_id = t.id AND tr.usuario_id = v_usuario_id
    LEFT JOIN torneo_premios tp ON tp.torneo_id = t.id
    LEFT JOIN usuario_trofeos ut ON ut.torneo_id = t.id AND ut.usuario_id = v_usuario_id
    WHERE ti.usuario_id = v_usuario_id
    ORDER BY ti.fecha DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;


--
-- Name: FUNCTION obtener_historial_torneos(p_nickname character varying, p_limit integer, p_offset integer); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.obtener_historial_torneos(p_nickname character varying, p_limit integer, p_offset integer) IS 'Obtiene el historial de participaci??n en torneos con resultados y premios.';


--
-- Name: obtener_lista_amigos(character varying, integer, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.obtener_lista_amigos(p_nickname character varying, p_limit integer DEFAULT 20, p_offset integer DEFAULT 0) RETURNS TABLE(amigo_id uuid, amigo_nickname character varying, amigo_foto_perfil character varying, amigo_avatar_url character varying, amigo_estado character varying, amigo_ultima_conexion timestamp without time zone, amigo_xp integer, fecha_amistad timestamp without time zone)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_usuario_id UUID;
BEGIN
    -- Obtener el ID del usuario por nickname
    SELECT id INTO v_usuario_id
    FROM usuario
    WHERE nickname = p_nickname AND deleted_at IS NULL;
    
    IF v_usuario_id IS NULL THEN
        RAISE EXCEPTION 'Usuario con nickname % no encontrado', p_nickname;
    END IF;
    
    RETURN QUERY
    SELECT 
        u.id,
        u.nickname,
        u.foto_perfil,
        ca.url,
        u.estado,
        u.ultima_conexion,
        u.xp,
        ua.creado_en
    FROM usuario_amigos ua
    JOIN catalogo_estado_amistad cea ON ua.estado_id = cea.id
    JOIN usuario u ON (
        CASE 
            WHEN ua.usuario1_id = v_usuario_id THEN ua.usuario2_id
            ELSE ua.usuario1_id
        END = u.id
    )
    LEFT JOIN catalogo_avatar ca ON u.avatar_id = ca.id
    WHERE (ua.usuario1_id = v_usuario_id OR ua.usuario2_id = v_usuario_id)
      AND cea.valor = 'aceptado'
      AND u.deleted_at IS NULL
    ORDER BY ua.creado_en DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;


--
-- Name: FUNCTION obtener_lista_amigos(p_nickname character varying, p_limit integer, p_offset integer); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.obtener_lista_amigos(p_nickname character varying, p_limit integer, p_offset integer) IS 'Obtiene la lista paginada de amigos de un usuario (estado aceptado).';


--
-- Name: obtener_logros_usuario(character varying, integer, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.obtener_logros_usuario(p_nickname character varying, p_limit integer DEFAULT 50, p_offset integer DEFAULT 0) RETURNS TABLE(logro_id uuid, logro_nombre character varying, logro_descripcion text, fecha_obtenido timestamp without time zone)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_usuario_id UUID;
BEGIN
    -- Obtener el ID del usuario por nickname
    SELECT id INTO v_usuario_id
    FROM usuario
    WHERE nickname = p_nickname AND deleted_at IS NULL;
    
    IF v_usuario_id IS NULL THEN
        RAISE EXCEPTION 'Usuario con nickname % no encontrado', p_nickname;
    END IF;
    
    RETURN QUERY
    SELECT 
        l.id,
        l.nombre,
        l.descripcion,
        ul.fecha
    FROM usuario_logros ul
    JOIN logro l ON ul.logro_id = l.id
    WHERE ul.usuario_id = v_usuario_id
    ORDER BY ul.fecha DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;


--
-- Name: FUNCTION obtener_logros_usuario(p_nickname character varying, p_limit integer, p_offset integer); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.obtener_logros_usuario(p_nickname character varying, p_limit integer, p_offset integer) IS 'Obtiene los logros desbloqueados por el usuario con fecha de obtenci??n.';


--
-- Name: obtener_perfil_completo_json(character varying, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.obtener_perfil_completo_json(p_nickname character varying, p_viewer_id uuid DEFAULT NULL::uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_perfil perfil_usuario_resultado;
    v_resultado JSONB;
BEGIN
    -- Obtener datos b??sicos del perfil
    v_perfil := obtener_perfil_usuario(p_nickname, p_viewer_id);
    
    -- Construir el JSON completo
    v_resultado := jsonb_build_object(
        'usuario', jsonb_build_object(
            'id', v_perfil.usuario_id,
            'nickname', v_perfil.nickname,
            'xp', v_perfil.xp,
            'saldo', v_perfil.saldo,
            'creditos', v_perfil.creditos,
            'foto_perfil', v_perfil.foto_perfil,
            'biografia', v_perfil.biografia,
            'estado', v_perfil.estado,
            'ultima_conexion', v_perfil.ultima_conexion,
            'desafios_habilitados', v_perfil.desafios_habilitados,
            'creado_en', v_perfil.creado_en,
            'avatar_url', v_perfil.avatar_url,
            'avatar_nombre', v_perfil.avatar_nombre,
            'rol', v_perfil.rol
        ),
        'datos_personales', CASE 
            WHEN v_perfil.p_nombre IS NOT NULL THEN jsonb_build_object(
                'nombre_completo', TRIM(CONCAT(
                    v_perfil.p_nombre, ' ',
                    COALESCE(v_perfil.s_nombre || ' ', ''),
                    v_perfil.p_apellido, ' ',
                    COALESCE(v_perfil.s_apellido, '')
                )),
                'correo', v_perfil.correo,
                'fecha_nacimiento', v_perfil.fecha_nacimiento,
                'pais', v_perfil.pais,
                'ciudad', v_perfil.ciudad
            )
            ELSE jsonb_build_object(
                'pais', v_perfil.pais,
                'ciudad', v_perfil.ciudad
            )
        END,
        'estadisticas_globales', jsonb_build_object(
            'total_amigos', v_perfil.total_amigos,
            'total_seguidores', v_perfil.total_seguidores,
            'total_siguiendo', v_perfil.total_siguiendo,
            'total_trofeos', v_perfil.total_trofeos,
            'total_logros', v_perfil.total_logros,
            'total_torneos_participados', v_perfil.total_torneos_participados,
            'total_victorias_torneos', v_perfil.total_victorias_torneos,
            'total_derrotas_global', v_perfil.total_derrotas_global,
            'dinero_total_ganado', v_perfil.dinero_total_ganado
        ),
        'estado_amistad', jsonb_build_object(
            'estado', v_perfil.estado_amistad,
            'solicitud_id', v_perfil.solicitud_amistad_id,
            'puede_agregar', (v_perfil.estado_amistad IS NULL AND p_viewer_id IS NOT NULL AND p_viewer_id != v_perfil.usuario_id)
        ),
        'amigos', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
                'id', amigo_id,
                'nickname', amigo_nickname,
                'foto_perfil', amigo_foto_perfil,
                'avatar_url', amigo_avatar_url,
                'estado', amigo_estado,
                'ultima_conexion', amigo_ultima_conexion,
                'xp', amigo_xp,
                'fecha_amistad', fecha_amistad
            )), '[]'::jsonb)
            FROM obtener_lista_amigos(p_nickname, 10, 0)
        ),
        'trofeos', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
                'id', trofeo_id,
                'tipo', tipo_trofeo,
                'ganado_en', ganado_en,
                'torneo_id', torneo_id,
                'torneo_titulo', torneo_titulo,
                'torneo_juego', torneo_juego,
                'posicion', posicion_final
            )), '[]'::jsonb)
            FROM obtener_vitrina_trofeos(p_nickname, 20, 0)
        ),
        'logros', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
                'id', logro_id,
                'nombre', logro_nombre,
                'descripcion', logro_descripcion,
                'fecha_obtenido', fecha_obtenido
            )), '[]'::jsonb)
            FROM obtener_logros_usuario(p_nickname, 20, 0)
        ),
        'estadisticas_juegos', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
                'juego_id', juego_id,
                'juego_nombre', juego_nombre,
                'victorias', victorias,
                'derrotas', derrotas,
                'empates', empates,
                'porcentaje_victorias', porcentaje_victorias,
                'nivel_rango', nivel_rango,
                'horas_jugadas', horas_jugadas
            )), '[]'::jsonb)
            FROM obtener_estadisticas_juegos(p_nickname)
        ),
        'historial_torneos', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
                'torneo_id', torneo_id,
                'titulo', torneo_titulo,
                'juego', juego_nombre,
                'fecha_inicio', fecha_inicio,
                'fecha_inscripcion', fecha_inscripcion,
                'estado_inscripcion', estado_inscripcion,
                'posicion_final', posicion_final,
                'premio_ganado', premio_ganado,
                'trofeo', tipo_trofeo
            )), '[]'::jsonb)
            FROM obtener_historial_torneos(p_nickname, 10, 0)
        ),
        'redes_sociales', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
                'id', red_id,
                'plataforma', plataforma,
                'enlace', enlace
            )), '[]'::jsonb)
            FROM obtener_redes_sociales(p_nickname)
        ),
        'cuentas_juego', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
                'id', cuenta_id,
                'plataforma', plataforma,
                'identificador', identificador
            )), '[]'::jsonb)
            FROM obtener_cuentas_juego(p_nickname)
        ),
        'equipos', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
                'id', equipo_id,
                'nombre', equipo_nombre,
                'descripcion', equipo_descripcion,
                'avatar_url', equipo_avatar_url,
                'rol', rol_en_equipo,
                'fecha_ingreso', fecha_ingreso,
                'total_miembros', total_miembros
            )), '[]'::jsonb)
            FROM obtener_equipos_usuario(p_nickname)
        )
    );
    
    RETURN v_resultado;
END;
$$;


--
-- Name: FUNCTION obtener_perfil_completo_json(p_nickname character varying, p_viewer_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.obtener_perfil_completo_json(p_nickname character varying, p_viewer_id uuid) IS 'Funci??n principal que retorna TODO el perfil del usuario en formato JSON.
Ideal para consumir desde la API del backend.
Par??metros:
  - p_nickname: nickname del usuario a consultar
  - p_viewer_id: UUID del usuario que visualiza (NULL si no est?? logueado)
  
Retorna toda la informaci??n necesaria para la p??gina usuario/perfil/{nickname}';


--
-- Name: obtener_perfil_usuario(character varying, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.obtener_perfil_usuario(p_nickname character varying, p_viewer_id uuid DEFAULT NULL::uuid) RETURNS public.perfil_usuario_resultado
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_result perfil_usuario_resultado;
    v_usuario_id UUID;
    v_es_propio_perfil BOOLEAN;
BEGIN
    -- Obtener el ID del usuario por nickname
    SELECT id INTO v_usuario_id
    FROM usuario
    WHERE nickname = p_nickname AND deleted_at IS NULL;
    
    -- Verificar si el usuario existe
    IF v_usuario_id IS NULL THEN
        RAISE EXCEPTION 'Usuario con nickname % no encontrado', p_nickname;
    END IF;
    
    -- Verificar si es el propio perfil
    v_es_propio_perfil := (p_viewer_id IS NOT NULL AND p_viewer_id = v_usuario_id);
    
    -- Obtener informaci??n b??sica del usuario
    SELECT 
        u.id,
        u.nickname,
        u.xp,
        u.saldo,
        u.creditos,
        u.foto_perfil,
        u.biografia,
        u.estado,
        u.ultima_conexion,
        u.desafios_habilitados,
        u.creado_en,
        ca.url,
        ca.nombre,
        -- Datos personales (solo si es propio perfil)
        CASE WHEN v_es_propio_perfil THEN p.p_nombre ELSE NULL END,
        CASE WHEN v_es_propio_perfil THEN p.s_nombre ELSE NULL END,
        CASE WHEN v_es_propio_perfil THEN p.p_apellido ELSE NULL END,
        CASE WHEN v_es_propio_perfil THEN p.s_apellido ELSE NULL END,
        CASE WHEN v_es_propio_perfil THEN p.correo ELSE NULL END,
        CASE WHEN v_es_propio_perfil THEN p.fecha_nacimiento ELSE NULL END,
        p.pais,
        p.ciudad,
        cr.valor
    INTO 
        v_result.usuario_id,
        v_result.nickname,
        v_result.xp,
        v_result.saldo,
        v_result.creditos,
        v_result.foto_perfil,
        v_result.biografia,
        v_result.estado,
        v_result.ultima_conexion,
        v_result.desafios_habilitados,
        v_result.creado_en,
        v_result.avatar_url,
        v_result.avatar_nombre,
        v_result.p_nombre,
        v_result.s_nombre,
        v_result.p_apellido,
        v_result.s_apellido,
        v_result.correo,
        v_result.fecha_nacimiento,
        v_result.pais,
        v_result.ciudad,
        v_result.rol
    FROM usuario u
    LEFT JOIN persona p ON u.persona_id = p.id
    LEFT JOIN catalogo_avatar ca ON u.avatar_id = ca.id
    LEFT JOIN catalogo_rol cr ON u.rol_id = cr.id
    WHERE u.id = v_usuario_id;
    
    -- Contar amigos (relaciones aceptadas)
    SELECT COUNT(*) INTO v_result.total_amigos
    FROM usuario_amigos ua
    JOIN catalogo_estado_amistad cea ON ua.estado_id = cea.id
    WHERE (ua.usuario1_id = v_usuario_id OR ua.usuario2_id = v_usuario_id)
      AND cea.valor = 'aceptado';
    
    -- Contar seguidores
    SELECT COUNT(*) INTO v_result.total_seguidores
    FROM usuario_seguidores
    WHERE seguido_id = v_usuario_id;
    
    -- Contar siguiendo
    SELECT COUNT(*) INTO v_result.total_siguiendo
    FROM usuario_seguidores
    WHERE seguidor_id = v_usuario_id;
    
    -- Contar trofeos
    SELECT COUNT(*) INTO v_result.total_trofeos
    FROM usuario_trofeos
    WHERE usuario_id = v_usuario_id;
    
    -- Contar logros
    SELECT COUNT(*) INTO v_result.total_logros
    FROM usuario_logros
    WHERE usuario_id = v_usuario_id;
    
    -- Contar torneos participados (con inscripci??n aceptada)
    SELECT COUNT(*) INTO v_result.total_torneos_participados
    FROM torneo_inscripcion ti
    JOIN catalogo_estado_inscripcion cei ON ti.estado_id = cei.id
    WHERE ti.usuario_id = v_usuario_id
      AND cei.valor IN ('confirmado', 'completado');
    
    -- Contar victorias en torneos (posici??n 1)
    SELECT COUNT(*) INTO v_result.total_victorias_torneos
    FROM torneo_resultados
    WHERE usuario_id = v_usuario_id AND posicion = 1;
    
    -- Calcular derrotas globales de estad??sticas de juegos
    SELECT COALESCE(SUM(derrotas), 0) INTO v_result.total_derrotas_global
    FROM usuario_estadisticas_juego
    WHERE usuario_id = v_usuario_id;
    
    -- Calcular dinero total ganado (transacciones de tipo 'ingreso' por premios de torneos)
    SELECT COALESCE(SUM(t.monto), 0) INTO v_result.dinero_total_ganado
    FROM transaccion t
    JOIN catalogo_transaccion_tipo ctt ON t.tipo_id = ctt.id
    JOIN catalogo_origen_transaccion cot ON t.origen_id = cot.id
    WHERE t.usuario_id = v_usuario_id
      AND ctt.valor = 'ingreso'
      AND cot.valor IN ('premio_torneo', 'torneo');
    
    -- Verificar estado de amistad con el viewer (si no es el propio perfil)
    IF p_viewer_id IS NOT NULL AND NOT v_es_propio_perfil THEN
        SELECT 
            -- Si el viewer envi?? la solicitud (usuario1), estado es 'pendiente_enviada'
            -- Si el viewer recibi?? la solicitud (usuario2), estado es 'pendiente_recibida'
            -- Si ya son amigos, estado es 'aceptado'
            CASE 
                WHEN cea.valor = 'pendiente' AND ua.usuario1_id = p_viewer_id THEN 'pendiente_enviada'
                WHEN cea.valor = 'pendiente' AND ua.usuario2_id = p_viewer_id THEN 'pendiente_recibida'
                ELSE cea.valor
            END,
            ua.id
        INTO 
            v_result.estado_amistad,
            v_result.solicitud_amistad_id
        FROM usuario_amigos ua
        JOIN catalogo_estado_amistad cea ON ua.estado_id = cea.id
        WHERE (ua.usuario1_id = p_viewer_id AND ua.usuario2_id = v_usuario_id)
           OR (ua.usuario1_id = v_usuario_id AND ua.usuario2_id = p_viewer_id);
    ELSE
        v_result.estado_amistad := NULL;
        v_result.solicitud_amistad_id := NULL;
    END IF;
    
    RETURN v_result;
END;
$$;


--
-- Name: FUNCTION obtener_perfil_usuario(p_nickname character varying, p_viewer_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.obtener_perfil_usuario(p_nickname character varying, p_viewer_id uuid) IS 'Obtiene la informaci??n b??sica del perfil de un usuario dado su nickname. 
Si se proporciona p_viewer_id, verifica el estado de amistad y muestra datos personales si es el propio perfil.';


--
-- Name: obtener_redes_sociales(character varying); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.obtener_redes_sociales(p_nickname character varying) RETURNS TABLE(red_id uuid, plataforma character varying, enlace character varying)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_usuario_id UUID;
BEGIN
    -- Obtener el ID del usuario por nickname
    SELECT id INTO v_usuario_id
    FROM usuario
    WHERE nickname = p_nickname AND deleted_at IS NULL;
    
    IF v_usuario_id IS NULL THEN
        RAISE EXCEPTION 'Usuario con nickname % no encontrado', p_nickname;
    END IF;
    
    RETURN QUERY
    SELECT 
        urs.id,
        urs.plataforma,
        urs.enlace
    FROM usuario_red_social urs
    WHERE urs.usuario_id = v_usuario_id
    ORDER BY urs.plataforma;
END;
$$;


--
-- Name: FUNCTION obtener_redes_sociales(p_nickname character varying); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.obtener_redes_sociales(p_nickname character varying) IS 'Obtiene los enlaces a redes sociales del usuario.';


--
-- Name: obtener_vitrina_trofeos(character varying, integer, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.obtener_vitrina_trofeos(p_nickname character varying, p_limit integer DEFAULT 50, p_offset integer DEFAULT 0) RETURNS TABLE(trofeo_id uuid, tipo_trofeo character varying, ganado_en timestamp without time zone, torneo_id uuid, torneo_titulo character varying, torneo_juego character varying, posicion_final integer)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_usuario_id UUID;
BEGIN
    -- Obtener el ID del usuario por nickname
    SELECT id INTO v_usuario_id
    FROM usuario
    WHERE nickname = p_nickname AND deleted_at IS NULL;
    
    IF v_usuario_id IS NULL THEN
        RAISE EXCEPTION 'Usuario con nickname % no encontrado', p_nickname;
    END IF;
    
    RETURN QUERY
    SELECT 
        ut.id,
        ut.tipo_trofeo,
        ut.ganado_en,
        t.id,
        t.titulo,
        j.nombre,
        tr.posicion
    FROM usuario_trofeos ut
    LEFT JOIN torneo t ON ut.torneo_id = t.id
    LEFT JOIN juego j ON t.juego_id = j.id
    LEFT JOIN torneo_resultados tr ON tr.torneo_id = t.id AND tr.usuario_id = v_usuario_id
    WHERE ut.usuario_id = v_usuario_id
    ORDER BY ut.ganado_en DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;


--
-- Name: FUNCTION obtener_vitrina_trofeos(p_nickname character varying, p_limit integer, p_offset integer); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.obtener_vitrina_trofeos(p_nickname character varying, p_limit integer, p_offset integer) IS 'Obtiene los trofeos ganados por el usuario con informaci??n del torneo asociado.';


--
-- Name: tienda_cancelar_orden(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.tienda_cancelar_orden(p_orden_id uuid, p_usuario_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_orden RECORD;
BEGIN
    SELECT * INTO v_orden FROM tienda_orden WHERE id = p_orden_id;
    
    IF v_orden IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Orden no encontrada');
    END IF;
    
    IF v_orden.usuario_id != p_usuario_id THEN
        RETURN jsonb_build_object('success', false, 'error', 'No tienes permiso para cancelar esta orden');
    END IF;
    
    IF v_orden.estado != 'pendiente' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Solo se pueden cancelar ├│rdenes pendientes');
    END IF;
    
    UPDATE tienda_orden
    SET estado = 'cancelado', actualizado_en = NOW()
    WHERE id = p_orden_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Orden cancelada'
    );
END;
$$;


--
-- Name: FUNCTION tienda_cancelar_orden(p_orden_id uuid, p_usuario_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.tienda_cancelar_orden(p_orden_id uuid, p_usuario_id uuid) IS 'Cancela una orden pendiente';


--
-- Name: tienda_comprar_con_saldo(uuid, uuid, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.tienda_comprar_con_saldo(p_usuario_id uuid, p_item_id uuid, p_metadata jsonb DEFAULT '{}'::jsonb) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_saldo_actual NUMERIC(12,2);
    v_item RECORD;
    v_orden_result JSONB;
    v_orden_id UUID;
BEGIN
    -- Verificar saldo del usuario
    SELECT saldo INTO v_saldo_actual
    FROM usuario
    WHERE id = p_usuario_id AND deleted_at IS NULL;
    
    IF v_saldo_actual IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Usuario no encontrado');
    END IF;
    
    -- Obtener precio del item
    SELECT precio INTO v_item FROM tienda_item WHERE id = p_item_id;
    
    IF v_item IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Item no encontrado');
    END IF;
    
    -- Verificar saldo suficiente
    IF v_saldo_actual < v_item.precio THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Saldo insuficiente',
            'saldo_actual', v_saldo_actual,
            'precio', v_item.precio
        );
    END IF;
    
    -- Crear orden
    v_orden_result := tienda_crear_orden(p_usuario_id, p_item_id, p_metadata);
    
    IF NOT (v_orden_result->>'success')::BOOLEAN THEN
        RETURN v_orden_result;
    END IF;
    
    v_orden_id := (v_orden_result->>'orden_id')::UUID;
    
    -- Descontar saldo
    UPDATE usuario 
    SET saldo = saldo - v_item.precio, actualizado_en = NOW()
    WHERE id = p_usuario_id;
    
    -- Registrar pago interno (sin PayPal)
    UPDATE tienda_orden
    SET 
        paypal_order_id = 'SALDO_INTERNO',
        metadata = metadata || '{"metodo_pago": "saldo"}'::JSONB
    WHERE id = v_orden_id;
    
    -- Confirmar compra
    RETURN tienda_confirmar_compra(v_orden_id);
END;
$$;


--
-- Name: FUNCTION tienda_comprar_con_saldo(p_usuario_id uuid, p_item_id uuid, p_metadata jsonb); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.tienda_comprar_con_saldo(p_usuario_id uuid, p_item_id uuid, p_metadata jsonb) IS 'Permite comprar un item usando el saldo del usuario en lugar de PayPal';


--
-- Name: tienda_confirmar_compra(uuid, character varying); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.tienda_confirmar_compra(p_orden_id uuid, p_paypal_capture_id character varying DEFAULT NULL::character varying) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_orden RECORD;
    v_item RECORD;
    v_tipo_item VARCHAR;
    v_servicio_tipo VARCHAR;
    v_usuario_id UUID;
    v_resultado JSONB;
    v_tipo_transaccion_id UUID;
    v_origen_transaccion_id UUID;
    v_membresia_tipo_id UUID;
    v_fecha_inicio DATE;
    v_fecha_fin DATE;
    v_nuevo_nickname VARCHAR;
    v_nickname_anterior VARCHAR;
BEGIN
    -- Obtener la orden con el item
    SELECT 
        o.*,
        ti.nombre as item_nombre,
        ti.creditos_otorgados,
        ti.metadata as item_metadata,
        cti.valor as tipo_valor
    INTO v_orden
    FROM tienda_orden o
    JOIN tienda_item ti ON o.item_id = ti.id
    JOIN catalogo_tipo_item cti ON ti.tipo_id = cti.id
    WHERE o.id = p_orden_id;
    
    IF v_orden IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Orden no encontrada');
    END IF;
    
    IF v_orden.estado = 'completado' THEN
        RETURN jsonb_build_object('success', false, 'error', 'La orden ya fue completada');
    END IF;
    
    IF v_orden.estado != 'pendiente' THEN
        RETURN jsonb_build_object('success', false, 'error', 'La orden no puede ser completada');
    END IF;
    
    v_usuario_id := v_orden.usuario_id;
    v_tipo_item := v_orden.tipo_valor;
    v_servicio_tipo := v_orden.metadata->>'servicio_tipo';
    
    -- Obtener IDs de cat├ílogos para transacciones
    SELECT id INTO v_tipo_transaccion_id FROM catalogo_transaccion_tipo WHERE valor = 'saldo';
    SELECT id INTO v_origen_transaccion_id FROM catalogo_origen_transaccion WHERE valor = 'compra';
    
    -- Actualizar capture_id si se proporciona
    IF p_paypal_capture_id IS NOT NULL THEN
        UPDATE tienda_orden SET paypal_capture_id = p_paypal_capture_id WHERE id = p_orden_id;
    END IF;
    
    -- =========================================
    -- PROCESAR SEG├ÜN TIPO DE ITEM
    -- =========================================
    
    -- CR├ëDITOS
    IF v_tipo_item = 'creditos' THEN
        -- Agregar cr├®ditos al usuario
        UPDATE usuario 
        SET creditos = creditos + v_orden.creditos_otorgados,
            actualizado_en = NOW()
        WHERE id = v_usuario_id;
        
        -- Registrar transacci├│n
        INSERT INTO transaccion (usuario_id, monto, descripcion, tipo_id, origen_id)
        SELECT 
            v_usuario_id,
            v_orden.monto,
            'Compra de ' || v_orden.creditos_otorgados || ' cr├®ditos',
            (SELECT id FROM catalogo_transaccion_tipo WHERE valor = 'creditos'),
            v_origen_transaccion_id;
        
        v_resultado := jsonb_build_object(
            'tipo', 'creditos',
            'creditos_agregados', v_orden.creditos_otorgados
        );
    
    -- MEMBRES├ìA
    ELSIF v_tipo_item = 'membresia' THEN
        v_membresia_tipo_id := (v_orden.item_metadata->>'membresiaTipoId')::UUID;
        
        -- Calcular fechas
        -- Si ya tiene membres├¡a activa, extender desde la fecha de fin actual
        SELECT fecha_fin INTO v_fecha_inicio
        FROM usuario_membresias
        WHERE usuario_id = v_usuario_id AND activa = TRUE AND fecha_fin >= CURRENT_DATE
        ORDER BY fecha_fin DESC
        LIMIT 1;
        
        IF v_fecha_inicio IS NULL THEN
            v_fecha_inicio := CURRENT_DATE;
        ELSE
            -- Desactivar membres├¡a anterior
            UPDATE usuario_membresias 
            SET activa = FALSE 
            WHERE usuario_id = v_usuario_id AND activa = TRUE;
            
            v_fecha_inicio := v_fecha_inicio + 1; -- Empezar al d├¡a siguiente
        END IF;
        
        v_fecha_fin := v_fecha_inicio + (v_orden.item_metadata->>'duracionDias')::INTEGER;
        
        -- Crear nueva membres├¡a
        INSERT INTO usuario_membresias (usuario_id, membresia_tipo_id, fecha_inicio, fecha_fin, activa)
        VALUES (v_usuario_id, v_membresia_tipo_id, v_fecha_inicio, v_fecha_fin, TRUE);
        
        -- Registrar transacci├│n
        INSERT INTO transaccion (usuario_id, monto, descripcion, tipo_id, origen_id)
        VALUES (
            v_usuario_id,
            v_orden.monto,
            'Compra de membres├¡a: ' || v_orden.item_nombre,
            v_tipo_transaccion_id,
            v_origen_transaccion_id
        );
        
        v_resultado := jsonb_build_object(
            'tipo', 'membresia',
            'membresia', v_orden.item_nombre,
            'fecha_inicio', v_fecha_inicio,
            'fecha_fin', v_fecha_fin
        );
    
    -- SERVICIOS
    ELSIF v_tipo_item = 'servicio' THEN
        
        -- CAMBIO DE NICKNAME
        IF v_servicio_tipo = 'cambio_nickname' THEN
            v_nuevo_nickname := v_orden.metadata->>'nuevo_nickname';
            
            -- Verificar nuevamente disponibilidad
            IF EXISTS (SELECT 1 FROM usuario WHERE nickname = v_nuevo_nickname AND deleted_at IS NULL) THEN
                -- Marcar orden como fallida
                UPDATE tienda_orden SET estado = 'fallido', actualizado_en = NOW() WHERE id = p_orden_id;
                RETURN jsonb_build_object('success', false, 'error', 'El nickname ya no est├í disponible');
            END IF;
            
            -- Guardar nickname anterior
            SELECT nickname INTO v_nickname_anterior FROM usuario WHERE id = v_usuario_id;
            
            -- Cambiar nickname
            UPDATE usuario 
            SET nickname = v_nuevo_nickname, actualizado_en = NOW()
            WHERE id = v_usuario_id;
            
            -- Actualizar metadata de la orden
            UPDATE tienda_orden 
            SET metadata = metadata || jsonb_build_object('nickname_anterior', v_nickname_anterior)
            WHERE id = p_orden_id;
            
            v_resultado := jsonb_build_object(
                'tipo', 'servicio',
                'servicio', 'cambio_nickname',
                'nickname_anterior', v_nickname_anterior,
                'nickname_nuevo', v_nuevo_nickname
            );
        
        -- REINICIAR R├ëCORD DE JUEGO
        ELSIF v_servicio_tipo = 'reset_record' THEN
            -- Reiniciar estad├¡sticas de todos los juegos
            UPDATE usuario_estadisticas_juego
            SET 
                victorias = 0,
                derrotas = 0,
                empates = 0,
                horas_jugadas = 0,
                actualizado_en = NOW()
            WHERE usuario_id = v_usuario_id;
            
            v_resultado := jsonb_build_object(
                'tipo', 'servicio',
                'servicio', 'reset_record',
                'mensaje', 'R├®cord de juego reiniciado'
            );
        
        -- REINICIAR ESTAD├ìSTICAS
        ELSIF v_servicio_tipo = 'reset_stats' THEN
            -- Reiniciar solo victorias/derrotas/empates
            UPDATE usuario_estadisticas_juego
            SET 
                victorias = 0,
                derrotas = 0,
                empates = 0,
                actualizado_en = NOW()
            WHERE usuario_id = v_usuario_id;
            
            v_resultado := jsonb_build_object(
                'tipo', 'servicio',
                'servicio', 'reset_stats',
                'mensaje', 'Estad├¡sticas reiniciadas'
            );
        
        -- RECLAMAR NICKNAME (requiere soporte)
        ELSIF v_servicio_tipo = 'reclamar_nickname' THEN
            -- Crear solicitud de soporte
            INSERT INTO tienda_solicitud_soporte (
                orden_id,
                usuario_id,
                tipo,
                nickname_solicitado,
                estado
            ) VALUES (
                p_orden_id,
                v_usuario_id,
                'reclamar_nickname',
                v_orden.metadata->>'nickname_solicitado',
                'pendiente'
            );
            
            v_resultado := jsonb_build_object(
                'tipo', 'servicio',
                'servicio', 'reclamar_nickname',
                'nickname_solicitado', v_orden.metadata->>'nickname_solicitado',
                'mensaje', 'Solicitud enviada a soporte. Te contactaremos pronto.'
            );
        
        ELSE
            v_resultado := jsonb_build_object('tipo', 'servicio', 'servicio', v_servicio_tipo);
        END IF;
        
        -- Registrar transacci├│n para servicios
        INSERT INTO transaccion (usuario_id, monto, descripcion, tipo_id, origen_id)
        VALUES (
            v_usuario_id,
            v_orden.monto,
            'Compra de servicio: ' || v_orden.item_nombre,
            v_tipo_transaccion_id,
            v_origen_transaccion_id
        );
    END IF;
    
    -- =========================================
    -- MARCAR ORDEN COMO COMPLETADA
    -- =========================================
    UPDATE tienda_orden
    SET 
        estado = 'completado',
        completado_en = NOW(),
        actualizado_en = NOW()
    WHERE id = p_orden_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'orden_id', p_orden_id,
        'resultado', v_resultado,
        'message', 'Compra completada exitosamente'
    );

EXCEPTION
    WHEN OTHERS THEN
        -- Marcar orden como fallida
        UPDATE tienda_orden 
        SET estado = 'fallido', actualizado_en = NOW() 
        WHERE id = p_orden_id;
        
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'code', SQLSTATE
        );
END;
$$;


--
-- Name: FUNCTION tienda_confirmar_compra(p_orden_id uuid, p_paypal_capture_id character varying); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.tienda_confirmar_compra(p_orden_id uuid, p_paypal_capture_id character varying) IS 'Confirma una compra despu├®s de que PayPal confirma el pago. Aplica los beneficios seg├║n el tipo de item.';


--
-- Name: tienda_crear_orden(uuid, uuid, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.tienda_crear_orden(p_usuario_id uuid, p_item_id uuid, p_metadata jsonb DEFAULT '{}'::jsonb) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_item RECORD;
    v_orden_id UUID;
    v_tipo_item VARCHAR;
    v_servicio_tipo VARCHAR;
BEGIN
    -- Verificar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM usuario WHERE id = p_usuario_id AND deleted_at IS NULL) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Usuario no encontrado');
    END IF;
    
    -- Obtener informaci├│n del item
    SELECT 
        ti.*,
        cti.valor as tipo_valor
    INTO v_item
    FROM tienda_item ti
    JOIN catalogo_tipo_item cti ON ti.tipo_id = cti.id
    WHERE ti.id = p_item_id;
    
    IF v_item IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Item no encontrado');
    END IF;
    
    v_tipo_item := v_item.tipo_valor;
    v_servicio_tipo := v_item.metadata->>'servicioTipo';
    
    -- Validaciones espec├¡ficas por tipo de servicio
    IF v_servicio_tipo = 'cambio_nickname' THEN
        -- Verificar que se proporcion├│ el nuevo nickname
        IF p_metadata->>'nuevo_nickname' IS NULL OR TRIM(p_metadata->>'nuevo_nickname') = '' THEN
            RETURN jsonb_build_object('success', false, 'error', 'Debe proporcionar el nuevo nickname');
        END IF;
        
        -- Verificar que el nickname no est├® en uso
        IF EXISTS (
            SELECT 1 FROM usuario 
            WHERE nickname = p_metadata->>'nuevo_nickname' 
            AND deleted_at IS NULL
        ) THEN
            RETURN jsonb_build_object('success', false, 'error', 'El nickname ya est├í en uso');
        END IF;
    END IF;
    
    IF v_servicio_tipo = 'reclamar_nickname' THEN
        -- Verificar que se proporcion├│ el nickname a reclamar
        IF p_metadata->>'nickname_solicitado' IS NULL OR TRIM(p_metadata->>'nickname_solicitado') = '' THEN
            RETURN jsonb_build_object('success', false, 'error', 'Debe proporcionar el nickname a reclamar');
        END IF;
    END IF;
    
    -- Verificar si es membres├¡a y el usuario ya tiene una activa
    IF v_tipo_item = 'membresia' THEN
        IF EXISTS (
            SELECT 1 FROM usuario_membresias 
            WHERE usuario_id = p_usuario_id 
            AND activa = TRUE 
            AND fecha_fin >= CURRENT_DATE
        ) THEN
            -- Actualizar metadata para indicar que es extensi├│n
            p_metadata := p_metadata || '{"es_extension": true}'::JSONB;
        END IF;
    END IF;
    
    -- Crear la orden
    INSERT INTO tienda_orden (
        usuario_id,
        item_id,
        monto,
        estado,
        metadata
    ) VALUES (
        p_usuario_id,
        p_item_id,
        v_item.precio,
        'pendiente',
        p_metadata || jsonb_build_object(
            'item_nombre', v_item.nombre,
            'item_tipo', v_tipo_item,
            'servicio_tipo', v_servicio_tipo
        )
    )
    RETURNING id INTO v_orden_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'orden_id', v_orden_id,
        'item', jsonb_build_object(
            'id', v_item.id,
            'nombre', v_item.nombre,
            'precio', v_item.precio,
            'tipo', v_tipo_item
        ),
        'message', 'Orden creada, proceder con pago PayPal'
    );

EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'code', SQLSTATE
        );
END;
$$;


--
-- Name: FUNCTION tienda_crear_orden(p_usuario_id uuid, p_item_id uuid, p_metadata jsonb); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.tienda_crear_orden(p_usuario_id uuid, p_item_id uuid, p_metadata jsonb) IS 'Crea una orden de compra pendiente. El frontend debe llamar a PayPal despu├®s.';


--
-- Name: tienda_historial_compras(uuid, integer, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.tienda_historial_compras(p_usuario_id uuid, p_limit integer DEFAULT 20, p_offset integer DEFAULT 0) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_total INTEGER;
    v_compras JSONB;
BEGIN
    -- Contar total
    SELECT COUNT(*) INTO v_total
    FROM tienda_orden
    WHERE usuario_id = p_usuario_id;
    
    -- Obtener compras
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', o.id,
        'item', jsonb_build_object(
            'id', ti.id,
            'nombre', ti.nombre,
            'tipo', cti.valor
        ),
        'monto', o.monto,
        'estado', o.estado,
        'paypal_order_id', o.paypal_order_id,
        'metadata', o.metadata,
        'creado_en', o.creado_en,
        'completado_en', o.completado_en
    ) ORDER BY o.creado_en DESC), '[]'::JSONB)
    INTO v_compras
    FROM tienda_orden o
    JOIN tienda_item ti ON o.item_id = ti.id
    JOIN catalogo_tipo_item cti ON ti.tipo_id = cti.id
    WHERE o.usuario_id = p_usuario_id
    LIMIT p_limit OFFSET p_offset;
    
    RETURN jsonb_build_object(
        'success', true,
        'total', v_total,
        'compras', v_compras
    );
END;
$$;


--
-- Name: FUNCTION tienda_historial_compras(p_usuario_id uuid, p_limit integer, p_offset integer); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.tienda_historial_compras(p_usuario_id uuid, p_limit integer, p_offset integer) IS 'Obtiene el historial de compras del usuario';


--
-- Name: tienda_obtener_catalogo(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.tienda_obtener_catalogo(p_usuario_id uuid DEFAULT NULL::uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_tiene_membresia BOOLEAN := FALSE;
    v_membresia_actual JSONB := NULL;
BEGIN
    -- Verificar si el usuario tiene membres├¡a activa
    IF p_usuario_id IS NOT NULL THEN
        SELECT 
            TRUE,
            jsonb_build_object(
                'id', um.id,
                'tipo', mt.nombre,
                'fecha_inicio', um.fecha_inicio,
                'fecha_fin', um.fecha_fin,
                'dias_restantes', GREATEST(0, um.fecha_fin - CURRENT_DATE)
            )
        INTO v_tiene_membresia, v_membresia_actual
        FROM usuario_membresias um
        JOIN membresia_tipo mt ON um.membresia_tipo_id = mt.id
        WHERE um.usuario_id = p_usuario_id 
          AND um.activa = TRUE 
          AND um.fecha_fin >= CURRENT_DATE
        ORDER BY um.fecha_fin DESC
        LIMIT 1;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'usuario', CASE WHEN p_usuario_id IS NOT NULL THEN jsonb_build_object(
            'id', p_usuario_id,
            'tiene_membresia', COALESCE(v_tiene_membresia, FALSE),
            'membresia_actual', v_membresia_actual,
            'saldo', (SELECT saldo FROM usuario WHERE id = p_usuario_id),
            'creditos', (SELECT creditos FROM usuario WHERE id = p_usuario_id)
        ) ELSE NULL END,
        'categorias', jsonb_build_object(
            'creditos', (
                SELECT COALESCE(jsonb_agg(jsonb_build_object(
                    'id', ti.id,
                    'nombre', ti.nombre,
                    'descripcion', ti.descripcion,
                    'precio', ti.precio,
                    'creditos_otorgados', ti.creditos_otorgados,
                    'destacado', COALESCE((ti.metadata->>'destacado')::BOOLEAN, FALSE),
                    'mejor_valor', COALESCE((ti.metadata->>'mejorValor')::BOOLEAN, FALSE)
                ) ORDER BY ti.precio), '[]'::JSONB)
                FROM tienda_item ti
                JOIN catalogo_tipo_item cti ON ti.tipo_id = cti.id
                WHERE cti.valor = 'creditos'
            ),
            'membresias', (
                SELECT COALESCE(jsonb_agg(jsonb_build_object(
                    'id', ti.id,
                    'nombre', ti.nombre,
                    'descripcion', ti.descripcion,
                    'precio', ti.precio,
                    'duracion_dias', (ti.metadata->>'duracionDias')::INTEGER,
                    'membresia_tipo_id', ti.metadata->>'membresiaTipoId',
                    'ahorro', CASE 
                        WHEN ti.nombre LIKE '%3 Meses%' THEN '28%'
                        WHEN ti.nombre LIKE '%6 Meses%' THEN '30%'
                        WHEN ti.nombre LIKE '%12 Meses%' THEN '30%'
                        ELSE NULL
                    END
                ) ORDER BY ti.precio), '[]'::JSONB)
                FROM tienda_item ti
                JOIN catalogo_tipo_item cti ON ti.tipo_id = cti.id
                WHERE cti.valor = 'membresia'
            ),
            'servicios', (
                SELECT COALESCE(jsonb_agg(jsonb_build_object(
                    'id', ti.id,
                    'nombre', ti.nombre,
                    'descripcion', ti.descripcion,
                    'precio', ti.precio,
                    'servicio_tipo', ti.metadata->>'servicioTipo',
                    'advertencia', ti.metadata->>'advertencia',
                    'requiere_soporte', COALESCE((ti.metadata->>'requiereSoporte')::BOOLEAN, FALSE)
                ) ORDER BY ti.precio), '[]'::JSONB)
                FROM tienda_item ti
                JOIN catalogo_tipo_item cti ON ti.tipo_id = cti.id
                WHERE cti.valor = 'servicio'
            )
        ),
        'info_membresia_gratuita', jsonb_build_object(
            'nombre', 'Cuenta Gratuita',
            'precio', 0,
            'beneficios', (
                SELECT beneficios FROM membresia_tipo WHERE nombre = 'Gratuita'
            )
        )
    );
END;
$$;


--
-- Name: FUNCTION tienda_obtener_catalogo(p_usuario_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.tienda_obtener_catalogo(p_usuario_id uuid) IS 'Obtiene el cat├ílogo completo de la tienda organizado por categor├¡as';


--
-- Name: tienda_obtener_solicitudes_soporte(character varying, integer, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.tienda_obtener_solicitudes_soporte(p_estado character varying DEFAULT NULL::character varying, p_limit integer DEFAULT 20, p_offset integer DEFAULT 0) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_total INTEGER;
    v_solicitudes JSONB;
BEGIN
    SELECT COUNT(*) INTO v_total
    FROM tienda_solicitud_soporte
    WHERE (p_estado IS NULL OR estado = p_estado);
    
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', s.id,
        'tipo', s.tipo,
        'nickname_solicitado', s.nickname_solicitado,
        'estado', s.estado,
        'usuario', jsonb_build_object(
            'id', u.id,
            'nickname', u.nickname
        ),
        'orden', CASE WHEN s.orden_id IS NOT NULL THEN jsonb_build_object(
            'id', o.id,
            'monto', o.monto
        ) ELSE NULL END,
        'notas_admin', s.notas_admin,
        'creado_en', s.creado_en,
        'resuelto_en', s.resuelto_en
    ) ORDER BY s.creado_en DESC), '[]'::JSONB)
    INTO v_solicitudes
    FROM tienda_solicitud_soporte s
    JOIN usuario u ON s.usuario_id = u.id
    LEFT JOIN tienda_orden o ON s.orden_id = o.id
    WHERE (p_estado IS NULL OR s.estado = p_estado)
    LIMIT p_limit OFFSET p_offset;
    
    RETURN jsonb_build_object(
        'success', true,
        'total', v_total,
        'solicitudes', v_solicitudes
    );
END;
$$;


--
-- Name: FUNCTION tienda_obtener_solicitudes_soporte(p_estado character varying, p_limit integer, p_offset integer); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.tienda_obtener_solicitudes_soporte(p_estado character varying, p_limit integer, p_offset integer) IS 'Obtiene solicitudes de soporte (para panel de admin)';


--
-- Name: tienda_registrar_pago_paypal(uuid, character varying, character varying, character varying, character varying); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.tienda_registrar_pago_paypal(p_orden_id uuid, p_paypal_order_id character varying, p_paypal_capture_id character varying DEFAULT NULL::character varying, p_paypal_payer_id character varying DEFAULT NULL::character varying, p_paypal_payer_email character varying DEFAULT NULL::character varying) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_orden RECORD;
BEGIN
    -- Obtener la orden
    SELECT * INTO v_orden
    FROM tienda_orden
    WHERE id = p_orden_id;
    
    IF v_orden IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Orden no encontrada');
    END IF;
    
    IF v_orden.estado != 'pendiente' THEN
        RETURN jsonb_build_object('success', false, 'error', 'La orden ya fue procesada');
    END IF;
    
    -- Actualizar con datos de PayPal
    UPDATE tienda_orden
    SET 
        paypal_order_id = p_paypal_order_id,
        paypal_capture_id = p_paypal_capture_id,
        paypal_payer_id = p_paypal_payer_id,
        paypal_payer_email = p_paypal_payer_email,
        actualizado_en = NOW()
    WHERE id = p_orden_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'orden_id', p_orden_id,
        'message', 'Datos de PayPal registrados'
    );

EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'code', SQLSTATE
        );
END;
$$;


--
-- Name: FUNCTION tienda_registrar_pago_paypal(p_orden_id uuid, p_paypal_order_id character varying, p_paypal_capture_id character varying, p_paypal_payer_id character varying, p_paypal_payer_email character varying); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.tienda_registrar_pago_paypal(p_orden_id uuid, p_paypal_order_id character varying, p_paypal_capture_id character varying, p_paypal_payer_id character varying, p_paypal_payer_email character varying) IS 'Registra los datos del pago de PayPal antes de confirmar';


--
-- Name: tienda_resolver_solicitud_soporte(uuid, uuid, boolean, character varying); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.tienda_resolver_solicitud_soporte(p_solicitud_id uuid, p_admin_id uuid, p_aprobar boolean, p_notas character varying DEFAULT NULL::character varying) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_solicitud RECORD;
    v_nickname_anterior VARCHAR;
BEGIN
    -- Verificar que quien resuelve es admin
    IF NOT EXISTS (
        SELECT 1 FROM usuario u
        JOIN catalogo_rol cr ON u.rol_id = cr.id
        WHERE u.id = p_admin_id AND cr.valor = 'admin'
    ) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Solo administradores pueden resolver solicitudes');
    END IF;
    
    -- Obtener solicitud
    SELECT * INTO v_solicitud
    FROM tienda_solicitud_soporte
    WHERE id = p_solicitud_id;
    
    IF v_solicitud IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Solicitud no encontrada');
    END IF;
    
    IF v_solicitud.estado != 'pendiente' AND v_solicitud.estado != 'en_revision' THEN
        RETURN jsonb_build_object('success', false, 'error', 'La solicitud ya fue resuelta');
    END IF;
    
    IF p_aprobar THEN
        -- Si es reclamar nickname, hacer el cambio
        IF v_solicitud.tipo = 'reclamar_nickname' THEN
            -- Liberar el nickname del usuario inactivo
            UPDATE usuario 
            SET nickname = nickname || '_old_' || EXTRACT(EPOCH FROM NOW())::TEXT
            WHERE nickname = v_solicitud.nickname_solicitado 
            AND id != v_solicitud.usuario_id;
            
            -- Guardar nickname anterior del solicitante
            SELECT nickname INTO v_nickname_anterior 
            FROM usuario WHERE id = v_solicitud.usuario_id;
            
            -- Asignar nuevo nickname al solicitante
            UPDATE usuario 
            SET nickname = v_solicitud.nickname_solicitado, actualizado_en = NOW()
            WHERE id = v_solicitud.usuario_id;
        END IF;
        
        UPDATE tienda_solicitud_soporte
        SET 
            estado = 'aprobado',
            notas_admin = p_notas,
            resuelto_en = NOW(),
            resuelto_por = p_admin_id,
            actualizado_en = NOW()
        WHERE id = p_solicitud_id;
        
        RETURN jsonb_build_object(
            'success', true,
            'message', 'Solicitud aprobada',
            'nickname_asignado', v_solicitud.nickname_solicitado
        );
    ELSE
        UPDATE tienda_solicitud_soporte
        SET 
            estado = 'rechazado',
            notas_admin = p_notas,
            resuelto_en = NOW(),
            resuelto_por = p_admin_id,
            actualizado_en = NOW()
        WHERE id = p_solicitud_id;
        
        RETURN jsonb_build_object(
            'success', true,
            'message', 'Solicitud rechazada'
        );
    END IF;
END;
$$;


--
-- Name: FUNCTION tienda_resolver_solicitud_soporte(p_solicitud_id uuid, p_admin_id uuid, p_aprobar boolean, p_notas character varying); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.tienda_resolver_solicitud_soporte(p_solicitud_id uuid, p_admin_id uuid, p_aprobar boolean, p_notas character varying) IS 'Permite a un admin aprobar o rechazar solicitudes de soporte';


--
-- Name: tienda_verificar_nickname(character varying); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.tienda_verificar_nickname(p_nickname character varying) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_usuario_existente RECORD;
    v_dias_inactivo INTEGER;
BEGIN
    -- Validar formato del nickname
    IF LENGTH(p_nickname) < 3 OR LENGTH(p_nickname) > 20 THEN
        RETURN jsonb_build_object(
            'disponible', false,
            'mensaje', 'El nickname debe tener entre 3 y 20 caracteres'
        );
    END IF;
    
    -- Buscar si existe
    SELECT 
        id,
        nickname,
        ultima_conexion,
        deleted_at,
        EXTRACT(DAY FROM NOW() - ultima_conexion)::INTEGER as dias_sin_conexion
    INTO v_usuario_existente
    FROM usuario
    WHERE nickname = p_nickname;
    
    -- Si no existe, est├í disponible para cambio de nickname normal
    IF v_usuario_existente IS NULL THEN
        RETURN jsonb_build_object(
            'disponible', true,
            'tipo', 'disponible',
            'mensaje', 'El nickname est├í disponible'
        );
    END IF;
    
    -- Si fue eliminado (soft delete), disponible para reclamar
    IF v_usuario_existente.deleted_at IS NOT NULL THEN
        RETURN jsonb_build_object(
            'disponible', true,
            'tipo', 'reclamable',
            'mensaje', 'El nickname puede ser reclamado',
            'requiere_soporte', true
        );
    END IF;
    
    -- Verificar inactividad (m├ís de 180 d├¡as = 6 meses)
    v_dias_inactivo := v_usuario_existente.dias_sin_conexion;
    
    IF v_dias_inactivo >= 180 THEN
        RETURN jsonb_build_object(
            'disponible', true,
            'tipo', 'inactivo',
            'mensaje', 'El usuario est├í inactivo. Puedes solicitar reclamar este nickname.',
            'dias_inactivo', v_dias_inactivo,
            'requiere_soporte', true
        );
    END IF;
    
    -- El nickname est├í en uso activo
    RETURN jsonb_build_object(
        'disponible', false,
        'tipo', 'en_uso',
        'mensaje', 'El nickname est├í en uso por un usuario activo'
    );
END;
$$;


--
-- Name: FUNCTION tienda_verificar_nickname(p_nickname character varying); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.tienda_verificar_nickname(p_nickname character varying) IS 'Verifica la disponibilidad de un nickname para cambio o reclamo';


--
-- Name: torneo_actualizar(uuid, uuid, character varying, text, timestamp without time zone, timestamp without time zone, timestamp without time zone, uuid, uuid, uuid, uuid, uuid, integer, character varying, boolean, text, boolean, boolean, boolean, uuid, integer, integer, numeric, numeric, numeric, character varying, character varying, character varying, character varying); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.torneo_actualizar(p_torneo_id uuid, p_anfitrion_id uuid, p_titulo character varying DEFAULT NULL::character varying, p_descripcion text DEFAULT NULL::text, p_fecha_inicio_registro timestamp without time zone DEFAULT NULL::timestamp without time zone, p_fecha_fin_registro timestamp without time zone DEFAULT NULL::timestamp without time zone, p_fecha_inicio_torneo timestamp without time zone DEFAULT NULL::timestamp without time zone, p_juego_id uuid DEFAULT NULL::uuid, p_plataforma_id uuid DEFAULT NULL::uuid, p_modo_juego_id uuid DEFAULT NULL::uuid, p_region_id uuid DEFAULT NULL::uuid, p_tipo_torneo_id uuid DEFAULT NULL::uuid, p_al_mejor_de integer DEFAULT NULL::integer, p_formato character varying DEFAULT NULL::character varying, p_cerrado boolean DEFAULT NULL::boolean, p_reglas text DEFAULT NULL::text, p_jugadores_pc_permitidos boolean DEFAULT NULL::boolean, p_requiere_transmision boolean DEFAULT NULL::boolean, p_requiere_camara boolean DEFAULT NULL::boolean, p_tipo_entrada_id uuid DEFAULT NULL::uuid, p_capacidad integer DEFAULT NULL::integer, p_cuota integer DEFAULT NULL::integer, p_comision_porcentaje numeric DEFAULT NULL::numeric, p_ganador1_porcentaje numeric DEFAULT NULL::numeric, p_ganador2_porcentaje numeric DEFAULT NULL::numeric, p_contacto_anfitrion character varying DEFAULT NULL::character varying, p_discord_servidor character varying DEFAULT NULL::character varying, p_banner_url character varying DEFAULT NULL::character varying, p_miniatura_url character varying DEFAULT NULL::character varying) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_estado_actual VARCHAR;
    v_anfitrion_actual UUID;
BEGIN
    -- Verificar que el torneo existe y obtener datos actuales
    SELECT 
        cet.valor,
        t.anfitrion_id
    INTO v_estado_actual, v_anfitrion_actual
    FROM torneo t
    LEFT JOIN catalogo_estado_torneo cet ON t.estado_id = cet.id
    WHERE t.id = p_torneo_id;
    
    IF v_anfitrion_actual IS NULL THEN
        RAISE EXCEPTION 'El torneo no existe';
    END IF;
    
    -- Verificar que quien actualiza es el anfitri├│n
    IF v_anfitrion_actual != p_anfitrion_id THEN
        RAISE EXCEPTION 'Solo el anfitri├│n puede modificar el torneo';
    END IF;
    
    -- No permitir modificar torneos terminados o cancelados
    IF v_estado_actual IN ('terminado', 'cancelado') THEN
        RAISE EXCEPTION 'No se puede modificar un torneo que ya termin├│ o fue cancelado';
    END IF;
    
    -- Actualizar torneo
    UPDATE torneo
    SET
        titulo = COALESCE(p_titulo, titulo),
        descripcion = COALESCE(p_descripcion, descripcion),
        fecha_inicio_registro = COALESCE(p_fecha_inicio_registro, fecha_inicio_registro),
        fecha_fin_registro = COALESCE(p_fecha_fin_registro, fecha_fin_registro),
        fecha_inicio_torneo = COALESCE(p_fecha_inicio_torneo, fecha_inicio_torneo),
        juego_id = COALESCE(p_juego_id, juego_id),
        plataforma_id = COALESCE(p_plataforma_id, plataforma_id),
        modo_juego_id = COALESCE(p_modo_juego_id, modo_juego_id),
        region_id = COALESCE(p_region_id, region_id),
        tipo_torneo_id = COALESCE(p_tipo_torneo_id, tipo_torneo_id),
        al_mejor_de = COALESCE(p_al_mejor_de, al_mejor_de),
        formato = COALESCE(p_formato, formato),
        cerrado = COALESCE(p_cerrado, cerrado),
        reglas = COALESCE(p_reglas, reglas),
        jugadores_pc_permitidos = COALESCE(p_jugadores_pc_permitidos, jugadores_pc_permitidos),
        requiere_transmision = COALESCE(p_requiere_transmision, requiere_transmision),
        requiere_camara = COALESCE(p_requiere_camara, requiere_camara),
        tipo_entrada_id = COALESCE(p_tipo_entrada_id, tipo_entrada_id),
        capacidad = COALESCE(p_capacidad, capacidad),
        contacto_anfitrion = COALESCE(p_contacto_anfitrion, contacto_anfitrion),
        discord_servidor = COALESCE(p_discord_servidor, discord_servidor),
        banner_url = COALESCE(p_banner_url, banner_url),
        miniatura_url = COALESCE(p_miniatura_url, miniatura_url),
        actualizado_en = NOW()
    WHERE id = p_torneo_id;
    
    -- Actualizar premios si se proporcionan
    IF p_cuota IS NOT NULL OR p_comision_porcentaje IS NOT NULL 
       OR p_ganador1_porcentaje IS NOT NULL OR p_ganador2_porcentaje IS NOT NULL THEN
        UPDATE torneo_premios
        SET
            cuota = COALESCE(p_cuota, cuota),
            comision_porcentaje = COALESCE(p_comision_porcentaje, comision_porcentaje),
            ganador1_porcentaje = COALESCE(p_ganador1_porcentaje, ganador1_porcentaje),
            ganador2_porcentaje = COALESCE(p_ganador2_porcentaje, ganador2_porcentaje)
        WHERE torneo_id = p_torneo_id;
    END IF;
    
    RETURN jsonb_build_object(
        'success', true,
        'torneo_id', p_torneo_id,
        'message', 'Torneo actualizado exitosamente'
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'code', SQLSTATE
        );
END;
$$;


--
-- Name: FUNCTION torneo_actualizar(p_torneo_id uuid, p_anfitrion_id uuid, p_titulo character varying, p_descripcion text, p_fecha_inicio_registro timestamp without time zone, p_fecha_fin_registro timestamp without time zone, p_fecha_inicio_torneo timestamp without time zone, p_juego_id uuid, p_plataforma_id uuid, p_modo_juego_id uuid, p_region_id uuid, p_tipo_torneo_id uuid, p_al_mejor_de integer, p_formato character varying, p_cerrado boolean, p_reglas text, p_jugadores_pc_permitidos boolean, p_requiere_transmision boolean, p_requiere_camara boolean, p_tipo_entrada_id uuid, p_capacidad integer, p_cuota integer, p_comision_porcentaje numeric, p_ganador1_porcentaje numeric, p_ganador2_porcentaje numeric, p_contacto_anfitrion character varying, p_discord_servidor character varying, p_banner_url character varying, p_miniatura_url character varying); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.torneo_actualizar(p_torneo_id uuid, p_anfitrion_id uuid, p_titulo character varying, p_descripcion text, p_fecha_inicio_registro timestamp without time zone, p_fecha_fin_registro timestamp without time zone, p_fecha_inicio_torneo timestamp without time zone, p_juego_id uuid, p_plataforma_id uuid, p_modo_juego_id uuid, p_region_id uuid, p_tipo_torneo_id uuid, p_al_mejor_de integer, p_formato character varying, p_cerrado boolean, p_reglas text, p_jugadores_pc_permitidos boolean, p_requiere_transmision boolean, p_requiere_camara boolean, p_tipo_entrada_id uuid, p_capacidad integer, p_cuota integer, p_comision_porcentaje numeric, p_ganador1_porcentaje numeric, p_ganador2_porcentaje numeric, p_contacto_anfitrion character varying, p_discord_servidor character varying, p_banner_url character varying, p_miniatura_url character varying) IS 'Actualiza un torneo existente. Solo el anfitri├│n puede modificar. No se permiten cambios en torneos terminados o cancelados.';


--
-- Name: torneo_cambiar_estado(uuid, uuid, character varying); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.torneo_cambiar_estado(p_torneo_id uuid, p_anfitrion_id uuid, p_nuevo_estado character varying) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_estado_id UUID;
    v_anfitrion_actual UUID;
    v_estado_actual VARCHAR;
BEGIN
    -- Verificar que el torneo existe
    SELECT 
        t.anfitrion_id,
        cet.valor
    INTO v_anfitrion_actual, v_estado_actual
    FROM torneo t
    LEFT JOIN catalogo_estado_torneo cet ON t.estado_id = cet.id
    WHERE t.id = p_torneo_id;
    
    IF v_anfitrion_actual IS NULL THEN
        RAISE EXCEPTION 'El torneo no existe';
    END IF;
    
    -- Verificar que quien cambia el estado es el anfitri├│n
    IF v_anfitrion_actual != p_anfitrion_id THEN
        RAISE EXCEPTION 'Solo el anfitri├│n puede cambiar el estado del torneo';
    END IF;
    
    -- Obtener el ID del nuevo estado
    SELECT id INTO v_estado_id
    FROM catalogo_estado_torneo
    WHERE valor = p_nuevo_estado;
    
    IF v_estado_id IS NULL THEN
        RAISE EXCEPTION 'Estado no v├ílido. Use: proximamente, en_curso, terminado, cancelado';
    END IF;
    
    -- Validar transiciones de estado permitidas
    IF v_estado_actual = 'terminado' THEN
        RAISE EXCEPTION 'No se puede cambiar el estado de un torneo terminado';
    END IF;
    
    IF v_estado_actual = 'cancelado' AND p_nuevo_estado != 'cancelado' THEN
        RAISE EXCEPTION 'No se puede reactivar un torneo cancelado';
    END IF;
    
    -- Actualizar estado
    UPDATE torneo
    SET 
        estado_id = v_estado_id,
        actualizado_en = NOW()
    WHERE id = p_torneo_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'torneo_id', p_torneo_id,
        'estado_anterior', v_estado_actual,
        'estado_nuevo', p_nuevo_estado,
        'message', 'Estado del torneo actualizado'
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'code', SQLSTATE
        );
END;
$$;


--
-- Name: FUNCTION torneo_cambiar_estado(p_torneo_id uuid, p_anfitrion_id uuid, p_nuevo_estado character varying); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.torneo_cambiar_estado(p_torneo_id uuid, p_anfitrion_id uuid, p_nuevo_estado character varying) IS 'Cambia el estado de un torneo. Estados v├ílidos: proximamente, en_curso, terminado, cancelado';


--
-- Name: torneo_crear(uuid, character varying, text, timestamp without time zone, timestamp without time zone, timestamp without time zone, uuid, uuid, uuid, uuid, uuid, integer, character varying, boolean, text, boolean, boolean, boolean, uuid, integer, integer, numeric, numeric, numeric, character varying, character varying, jsonb, character varying, character varying); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.torneo_crear(p_anfitrion_id uuid, p_titulo character varying, p_descripcion text DEFAULT NULL::text, p_fecha_inicio_registro timestamp without time zone DEFAULT NULL::timestamp without time zone, p_fecha_fin_registro timestamp without time zone DEFAULT NULL::timestamp without time zone, p_fecha_inicio_torneo timestamp without time zone DEFAULT NULL::timestamp without time zone, p_juego_id uuid DEFAULT NULL::uuid, p_plataforma_id uuid DEFAULT NULL::uuid, p_modo_juego_id uuid DEFAULT NULL::uuid, p_region_id uuid DEFAULT NULL::uuid, p_tipo_torneo_id uuid DEFAULT NULL::uuid, p_al_mejor_de integer DEFAULT 1, p_formato character varying DEFAULT '1v1'::character varying, p_cerrado boolean DEFAULT false, p_reglas text DEFAULT NULL::text, p_jugadores_pc_permitidos boolean DEFAULT true, p_requiere_transmision boolean DEFAULT false, p_requiere_camara boolean DEFAULT false, p_tipo_entrada_id uuid DEFAULT NULL::uuid, p_capacidad integer DEFAULT NULL::integer, p_cuota integer DEFAULT 0, p_comision_porcentaje numeric DEFAULT 0, p_ganador1_porcentaje numeric DEFAULT 70, p_ganador2_porcentaje numeric DEFAULT 30, p_contacto_anfitrion character varying DEFAULT NULL::character varying, p_discord_servidor character varying DEFAULT NULL::character varying, p_redes_sociales jsonb DEFAULT '[]'::jsonb, p_banner_url character varying DEFAULT NULL::character varying, p_miniatura_url character varying DEFAULT NULL::character varying) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_torneo_id UUID;
    v_estado_proximamente_id UUID;
    v_red JSONB;
    v_fondo_total NUMERIC(12,2) := 0;
    v_fondo_despues_comision NUMERIC(12,2) := 0;
    v_comision_total NUMERIC(12,2) := 0;
    v_tipo_torneo_default_id UUID;
BEGIN
    -- =====================================================
    -- VALIDACIONES
    -- =====================================================
    
    -- Validar que el anfitri├│n existe y est├í activo
    IF NOT EXISTS (
        SELECT 1 FROM usuario 
        WHERE id = p_anfitrion_id AND deleted_at IS NULL
    ) THEN
        RAISE EXCEPTION 'El usuario anfitri├│n no existe o no est├í activo';
    END IF;
    
    -- Validar t├¡tulo obligatorio
    IF p_titulo IS NULL OR TRIM(p_titulo) = '' THEN
        RAISE EXCEPTION 'El t├¡tulo del torneo es obligatorio';
    END IF;
    
    -- Validar juego si se proporciona
    IF p_juego_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM juego WHERE id = p_juego_id) THEN
            RAISE EXCEPTION 'El juego especificado no existe';
        END IF;
    END IF;
    
    -- Validar plataforma si se proporciona
    IF p_plataforma_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM catalogo_plataforma WHERE id = p_plataforma_id) THEN
            RAISE EXCEPTION 'La plataforma especificada no existe';
        END IF;
    END IF;
    
    -- Validar modo de juego si se proporciona (debe pertenecer al juego)
    IF p_modo_juego_id IS NOT NULL THEN
        IF p_juego_id IS NULL THEN
            RAISE EXCEPTION 'Debe especificar un juego para seleccionar un modo de juego';
        END IF;
        IF NOT EXISTS (
            SELECT 1 FROM modo_juego 
            WHERE id = p_modo_juego_id AND juego_id = p_juego_id
        ) THEN
            RAISE EXCEPTION 'El modo de juego no pertenece al juego especificado';
        END IF;
    END IF;
    
    -- Validar regi├│n si se proporciona
    IF p_region_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM catalogo_region WHERE id = p_region_id) THEN
            RAISE EXCEPTION 'La regi├│n especificada no existe';
        END IF;
    END IF;
    
    -- Validar tipo de entrada si se proporciona
    IF p_tipo_entrada_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM catalogo_tipo_entrada WHERE id = p_tipo_entrada_id) THEN
            RAISE EXCEPTION 'El tipo de entrada especificado no existe';
        END IF;
    END IF;
    
    -- Validar tipo de torneo o asignar default
    IF p_tipo_torneo_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM catalogo_tipo_torneo WHERE id = p_tipo_torneo_id) THEN
            RAISE EXCEPTION 'El tipo de torneo especificado no existe';
        END IF;
    ELSE
        -- Asignar eliminaci├│n simple por defecto
        SELECT id INTO v_tipo_torneo_default_id 
        FROM catalogo_tipo_torneo 
        WHERE valor = 'eliminacion_simple';
        p_tipo_torneo_id := v_tipo_torneo_default_id;
    END IF;
    
    -- Validar al_mejor_de (debe ser 1, 3, 5, o 7)
    IF p_al_mejor_de NOT IN (1, 3, 5, 7) THEN
        RAISE EXCEPTION 'El valor "al mejor de" debe ser 1, 3, 5 o 7';
    END IF;
    
    -- Validar porcentajes de premios
    IF p_ganador1_porcentaje + p_ganador2_porcentaje > 100 THEN
        RAISE EXCEPTION 'La suma de los porcentajes de premios no puede exceder 100%%';
    END IF;
    
    -- Validar fechas l├│gicas
    IF p_fecha_inicio_registro IS NOT NULL AND p_fecha_fin_registro IS NOT NULL THEN
        IF p_fecha_fin_registro <= p_fecha_inicio_registro THEN
            RAISE EXCEPTION 'La fecha de fin de registro debe ser posterior a la fecha de inicio de registro';
        END IF;
    END IF;
    
    IF p_fecha_fin_registro IS NOT NULL AND p_fecha_inicio_torneo IS NOT NULL THEN
        IF p_fecha_inicio_torneo < p_fecha_fin_registro THEN
            RAISE EXCEPTION 'La fecha de inicio del torneo debe ser igual o posterior a la fecha de fin de registro';
        END IF;
    END IF;
    
    -- =====================================================
    -- OBTENER ID DE ESTADO "PR├ôXIMAMENTE"
    -- =====================================================
    SELECT id INTO v_estado_proximamente_id 
    FROM catalogo_estado_torneo 
    WHERE valor = 'proximamente';
    
    IF v_estado_proximamente_id IS NULL THEN
        RAISE EXCEPTION 'No se encontr├│ el estado "proximamente" en el cat├ílogo';
    END IF;
    
    -- =====================================================
    -- INSERTAR TORNEO
    -- =====================================================
    INSERT INTO torneo (
        titulo,
        descripcion,
        fecha_inicio_registro,
        fecha_fin_registro,
        fecha_inicio_torneo,
        juego_id,
        plataforma_id,
        modo_juego_id,
        region_id,
        tipo_torneo_id,
        tipo_torneo, -- Campo legacy, mantener por compatibilidad
        al_mejor_de,
        formato,
        cerrado,
        reglas,
        jugadores_pc_permitidos,
        requiere_transmision,
        requiere_camara,
        tipo_entrada_id,
        capacidad,
        anfitrion_id,
        contacto_anfitrion,
        discord_servidor,
        banner_url,
        miniatura_url,
        estado_id,
        creado_en,
        actualizado_en
    ) VALUES (
        p_titulo,
        p_descripcion,
        p_fecha_inicio_registro,
        p_fecha_fin_registro,
        p_fecha_inicio_torneo,
        p_juego_id,
        p_plataforma_id,
        p_modo_juego_id,
        p_region_id,
        p_tipo_torneo_id,
        (SELECT valor FROM catalogo_tipo_torneo WHERE id = p_tipo_torneo_id),
        p_al_mejor_de,
        p_formato,
        p_cerrado,
        p_reglas,
        p_jugadores_pc_permitidos,
        p_requiere_transmision,
        p_requiere_camara,
        p_tipo_entrada_id,
        p_capacidad,
        p_anfitrion_id,
        p_contacto_anfitrion,
        p_discord_servidor,
        p_banner_url,
        p_miniatura_url,
        v_estado_proximamente_id,
        NOW(),
        NOW()
    )
    RETURNING id INTO v_torneo_id;
    
    -- =====================================================
    -- INSERTAR PREMIOS
    -- (El fondo se calcula cuando se registran jugadores)
    -- =====================================================
    INSERT INTO torneo_premios (
        torneo_id,
        cuota,
        fondo_total,
        fondo_despues_comision,
        comision_porcentaje,
        comision_total,
        ganador1_porcentaje,
        ganador2_porcentaje
    ) VALUES (
        v_torneo_id,
        p_cuota,
        0, -- Se actualizar├í conforme se inscriban jugadores
        0,
        p_comision_porcentaje,
        0,
        p_ganador1_porcentaje,
        p_ganador2_porcentaje
    );
    
    -- =====================================================
    -- INSERTAR REDES SOCIALES DEL TORNEO
    -- =====================================================
    IF p_redes_sociales IS NOT NULL AND jsonb_array_length(p_redes_sociales) > 0 THEN
        FOR v_red IN SELECT * FROM jsonb_array_elements(p_redes_sociales)
        LOOP
            INSERT INTO torneo_redes (torneo_id, plataforma, url)
            VALUES (
                v_torneo_id,
                v_red->>'plataforma',
                v_red->>'url'
            );
        END LOOP;
    END IF;
    
    -- =====================================================
    -- RETORNAR RESULTADO
    -- =====================================================
    RETURN jsonb_build_object(
        'success', true,
        'torneo_id', v_torneo_id,
        'message', 'Torneo creado exitosamente',
        'estado', 'proximamente',
        'datos', jsonb_build_object(
            'titulo', p_titulo,
            'anfitrion_id', p_anfitrion_id,
            'capacidad', p_capacidad,
            'cuota', p_cuota,
            'fecha_inicio_torneo', p_fecha_inicio_torneo
        )
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'code', SQLSTATE
        );
END;
$$;


--
-- Name: FUNCTION torneo_crear(p_anfitrion_id uuid, p_titulo character varying, p_descripcion text, p_fecha_inicio_registro timestamp without time zone, p_fecha_fin_registro timestamp without time zone, p_fecha_inicio_torneo timestamp without time zone, p_juego_id uuid, p_plataforma_id uuid, p_modo_juego_id uuid, p_region_id uuid, p_tipo_torneo_id uuid, p_al_mejor_de integer, p_formato character varying, p_cerrado boolean, p_reglas text, p_jugadores_pc_permitidos boolean, p_requiere_transmision boolean, p_requiere_camara boolean, p_tipo_entrada_id uuid, p_capacidad integer, p_cuota integer, p_comision_porcentaje numeric, p_ganador1_porcentaje numeric, p_ganador2_porcentaje numeric, p_contacto_anfitrion character varying, p_discord_servidor character varying, p_redes_sociales jsonb, p_banner_url character varying, p_miniatura_url character varying); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.torneo_crear(p_anfitrion_id uuid, p_titulo character varying, p_descripcion text, p_fecha_inicio_registro timestamp without time zone, p_fecha_fin_registro timestamp without time zone, p_fecha_inicio_torneo timestamp without time zone, p_juego_id uuid, p_plataforma_id uuid, p_modo_juego_id uuid, p_region_id uuid, p_tipo_torneo_id uuid, p_al_mejor_de integer, p_formato character varying, p_cerrado boolean, p_reglas text, p_jugadores_pc_permitidos boolean, p_requiere_transmision boolean, p_requiere_camara boolean, p_tipo_entrada_id uuid, p_capacidad integer, p_cuota integer, p_comision_porcentaje numeric, p_ganador1_porcentaje numeric, p_ganador2_porcentaje numeric, p_contacto_anfitrion character varying, p_discord_servidor character varying, p_redes_sociales jsonb, p_banner_url character varying, p_miniatura_url character varying) IS 'Crea un nuevo torneo con toda la informaci├│n de los 6 pasos del formulario.
El estado inicial siempre es "proximamente".

Par├ímetros agrupados por paso:
1. Informaci├│n b├ísica: t├¡tulo, descripci├│n, fechas
2. Detalles: juego, plataforma, modo, regi├│n, tipo, formato, reglas, opciones
3. Premios: cuota, comisiones, distribuci├│n
4. Anfitri├│n: contacto, discord, redes sociales
5. Gr├íficos: banner, miniatura

Retorna JSON con success, torneo_id y mensaje.';


--
-- Name: torneo_eliminar_red_social(uuid, uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.torneo_eliminar_red_social(p_torneo_id uuid, p_anfitrion_id uuid, p_red_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_anfitrion_actual UUID;
BEGIN
    -- Verificar que el torneo pertenece al anfitri├│n
    SELECT anfitrion_id INTO v_anfitrion_actual
    FROM torneo WHERE id = p_torneo_id;
    
    IF v_anfitrion_actual != p_anfitrion_id THEN
        RAISE EXCEPTION 'Solo el anfitri├│n puede eliminar redes del torneo';
    END IF;
    
    DELETE FROM torneo_redes
    WHERE id = p_red_id AND torneo_id = p_torneo_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Red social no encontrada';
    END IF;
    
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Red social eliminada correctamente'
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'code', SQLSTATE
        );
END;
$$;


--
-- Name: FUNCTION torneo_eliminar_red_social(p_torneo_id uuid, p_anfitrion_id uuid, p_red_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.torneo_eliminar_red_social(p_torneo_id uuid, p_anfitrion_id uuid, p_red_id uuid) IS 'Elimina una red social del torneo';


--
-- Name: torneo_finalizar(uuid, uuid, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.torneo_finalizar(p_torneo_id uuid, p_anfitrion_id uuid, p_resultados jsonb) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_anfitrion_actual UUID;
    v_estado_terminado_id UUID;
    v_tipo_trofeo VARCHAR;
    v_resultado JSONB;
    v_premio_1 NUMERIC(12,2);
    v_premio_2 NUMERIC(12,2);
    v_ganador1_id UUID;
    v_ganador2_id UUID;
BEGIN
    -- Verificar que el torneo existe y pertenece al anfitri├│n
    SELECT anfitrion_id INTO v_anfitrion_actual
    FROM torneo WHERE id = p_torneo_id;
    
    IF v_anfitrion_actual IS NULL THEN
        RAISE EXCEPTION 'El torneo no existe';
    END IF;
    
    IF v_anfitrion_actual != p_anfitrion_id THEN
        RAISE EXCEPTION 'Solo el anfitri├│n puede finalizar el torneo';
    END IF;
    
    -- Obtener estado terminado
    SELECT id INTO v_estado_terminado_id
    FROM catalogo_estado_torneo WHERE valor = 'terminado';
    
    -- Obtener tipo de trofeo del tipo de torneo
    SELECT ctt.tipo_trofeo INTO v_tipo_trofeo
    FROM torneo t
    JOIN catalogo_tipo_torneo ctt ON t.tipo_torneo_id = ctt.id
    WHERE t.id = p_torneo_id;
    
    IF v_tipo_trofeo IS NULL THEN
        v_tipo_trofeo := 'trofeo_general';
    END IF;
    
    -- Obtener premios calculados
    SELECT 
        ROUND(fondo_despues_comision * ganador1_porcentaje / 100, 2),
        ROUND(fondo_despues_comision * ganador2_porcentaje / 100, 2)
    INTO v_premio_1, v_premio_2
    FROM torneo_premios
    WHERE torneo_id = p_torneo_id;
    
    -- Insertar resultados
    FOR v_resultado IN SELECT * FROM jsonb_array_elements(p_resultados)
    LOOP
        -- Insertar resultado
        INSERT INTO torneo_resultados (torneo_id, usuario_id, posicion)
        VALUES (
            p_torneo_id,
            (v_resultado->>'usuario_id')::UUID,
            (v_resultado->>'posicion')::INTEGER
        )
        ON CONFLICT DO NOTHING;
        
        -- Asignar trofeo al ganador (posici├│n 1 y 2)
        IF (v_resultado->>'posicion')::INTEGER <= 2 THEN
            INSERT INTO usuario_trofeos (usuario_id, torneo_id, tipo_trofeo)
            VALUES (
                (v_resultado->>'usuario_id')::UUID,
                p_torneo_id,
                v_tipo_trofeo || '_' || (v_resultado->>'posicion')
            );
            
            -- Guardar IDs de ganadores para transferir premios
            IF (v_resultado->>'posicion')::INTEGER = 1 THEN
                v_ganador1_id := (v_resultado->>'usuario_id')::UUID;
            ELSIF (v_resultado->>'posicion')::INTEGER = 2 THEN
                v_ganador2_id := (v_resultado->>'usuario_id')::UUID;
            END IF;
        END IF;
    END LOOP;
    
    -- Actualizar saldo de ganadores (si hay premios)
    IF v_premio_1 > 0 AND v_ganador1_id IS NOT NULL THEN
        UPDATE usuario SET saldo = saldo + v_premio_1 WHERE id = v_ganador1_id;
        
        -- Registrar transacci├│n
        INSERT INTO transaccion (usuario_id, monto, descripcion, tipo_id, origen_id)
        SELECT 
            v_ganador1_id,
            v_premio_1,
            'Premio 1er lugar - Torneo',
            (SELECT id FROM catalogo_transaccion_tipo WHERE valor = 'ingreso'),
            (SELECT id FROM catalogo_origen_transaccion WHERE valor IN ('premio_torneo', 'torneo') LIMIT 1);
    END IF;
    
    IF v_premio_2 > 0 AND v_ganador2_id IS NOT NULL THEN
        UPDATE usuario SET saldo = saldo + v_premio_2 WHERE id = v_ganador2_id;
        
        -- Registrar transacci├│n
        INSERT INTO transaccion (usuario_id, monto, descripcion, tipo_id, origen_id)
        SELECT 
            v_ganador2_id,
            v_premio_2,
            'Premio 2do lugar - Torneo',
            (SELECT id FROM catalogo_transaccion_tipo WHERE valor = 'ingreso'),
            (SELECT id FROM catalogo_origen_transaccion WHERE valor IN ('premio_torneo', 'torneo') LIMIT 1);
    END IF;
    
    -- Actualizar estado del torneo
    UPDATE torneo
    SET estado_id = v_estado_terminado_id, actualizado_en = NOW()
    WHERE id = p_torneo_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'torneo_id', p_torneo_id,
        'message', 'Torneo finalizado exitosamente',
        'premios_distribuidos', jsonb_build_object(
            'primer_lugar', jsonb_build_object('usuario_id', v_ganador1_id, 'monto', v_premio_1),
            'segundo_lugar', jsonb_build_object('usuario_id', v_ganador2_id, 'monto', v_premio_2)
        )
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'code', SQLSTATE
        );
END;
$$;


--
-- Name: FUNCTION torneo_finalizar(p_torneo_id uuid, p_anfitrion_id uuid, p_resultados jsonb); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.torneo_finalizar(p_torneo_id uuid, p_anfitrion_id uuid, p_resultados jsonb) IS 'Finaliza un torneo, registra resultados, asigna trofeos y distribuye premios a los ganadores';


--
-- Name: torneo_listar(character varying, uuid, uuid, uuid, character varying, integer, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.torneo_listar(p_estado character varying DEFAULT NULL::character varying, p_juego_id uuid DEFAULT NULL::uuid, p_region_id uuid DEFAULT NULL::uuid, p_anfitrion_id uuid DEFAULT NULL::uuid, p_busqueda character varying DEFAULT NULL::character varying, p_limit integer DEFAULT 20, p_offset integer DEFAULT 0) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_total INTEGER;
    v_torneos JSONB;
BEGIN
    -- Contar total
    SELECT COUNT(*)
    INTO v_total
    FROM torneo t
    LEFT JOIN catalogo_estado_torneo cet ON t.estado_id = cet.id
    WHERE (p_estado IS NULL OR cet.valor = p_estado)
      AND (p_juego_id IS NULL OR t.juego_id = p_juego_id)
      AND (p_region_id IS NULL OR t.region_id = p_region_id)
      AND (p_anfitrion_id IS NULL OR t.anfitrion_id = p_anfitrion_id)
      AND (p_busqueda IS NULL OR t.titulo ILIKE '%' || p_busqueda || '%');
    
    -- Obtener torneos
    SELECT COALESCE(jsonb_agg(torneo_data ORDER BY t.fecha_inicio_torneo DESC NULLS LAST), '[]'::jsonb)
    INTO v_torneos
    FROM (
        SELECT jsonb_build_object(
            'id', t.id,
            'titulo', t.titulo,
            'descripcion', LEFT(t.descripcion, 200),
            'miniatura_url', t.miniatura_url,
            'juego', j.nombre,
            'plataforma', cp.valor,
            'region', cr.valor,
            'estado', cet.valor,
            'formato', t.formato,
            'capacidad', t.capacidad,
            'inscritos', (
                SELECT COUNT(*) 
                FROM torneo_inscripcion ti
                JOIN catalogo_estado_inscripcion cei ON ti.estado_id = cei.id
                WHERE ti.torneo_id = t.id AND cei.valor = 'confirmado'
            ),
            'cuota', tp.cuota,
            'fondo_total', tp.fondo_total,
            'fecha_inicio_torneo', t.fecha_inicio_torneo,
            'fecha_fin_registro', t.fecha_fin_registro,
            'anfitrion', jsonb_build_object(
                'id', u.id,
                'nickname', u.nickname,
                'avatar_url', ca.url
            )
        ) as torneo_data,
        t.fecha_inicio_torneo
        FROM torneo t
        LEFT JOIN juego j ON t.juego_id = j.id
        LEFT JOIN catalogo_plataforma cp ON t.plataforma_id = cp.id
        LEFT JOIN catalogo_region cr ON t.region_id = cr.id
        LEFT JOIN catalogo_estado_torneo cet ON t.estado_id = cet.id
        LEFT JOIN torneo_premios tp ON tp.torneo_id = t.id
        LEFT JOIN usuario u ON t.anfitrion_id = u.id
        LEFT JOIN catalogo_avatar ca ON u.avatar_id = ca.id
        WHERE (p_estado IS NULL OR cet.valor = p_estado)
          AND (p_juego_id IS NULL OR t.juego_id = p_juego_id)
          AND (p_region_id IS NULL OR t.region_id = p_region_id)
          AND (p_anfitrion_id IS NULL OR t.anfitrion_id = p_anfitrion_id)
          AND (p_busqueda IS NULL OR t.titulo ILIKE '%' || p_busqueda || '%')
        ORDER BY t.fecha_inicio_torneo DESC NULLS LAST
        LIMIT p_limit
        OFFSET p_offset
    ) t;
    
    RETURN jsonb_build_object(
        'success', true,
        'total', v_total,
        'limit', p_limit,
        'offset', p_offset,
        'torneos', v_torneos
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'code', SQLSTATE
        );
END;
$$;


--
-- Name: FUNCTION torneo_listar(p_estado character varying, p_juego_id uuid, p_region_id uuid, p_anfitrion_id uuid, p_busqueda character varying, p_limit integer, p_offset integer); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.torneo_listar(p_estado character varying, p_juego_id uuid, p_region_id uuid, p_anfitrion_id uuid, p_busqueda character varying, p_limit integer, p_offset integer) IS 'Lista torneos con filtros opcionales por estado, juego, regi├│n, anfitri├│n y b├║squeda por t├¡tulo';


--
-- Name: torneo_obtener_catalogos(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.torneo_obtener_catalogos() RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN jsonb_build_object(
        'success', true,
        'catalogos', jsonb_build_object(
            'juegos', (
                SELECT COALESCE(jsonb_agg(jsonb_build_object(
                    'id', j.id,
                    'nombre', j.nombre,
                    'plataformas', (
                        SELECT COALESCE(jsonb_agg(jsonb_build_object(
                            'id', cp.id,
                            'valor', cp.valor
                        )), '[]'::jsonb)
                        FROM juego_plataformas jp
                        JOIN catalogo_plataforma cp ON jp."catalogoPlataformaId" = cp.id
                        WHERE jp."juegoId" = j.id
                    ),
                    'modos_juego', (
                        SELECT COALESCE(jsonb_agg(jsonb_build_object(
                            'id', mj.id,
                            'nombre', mj.nombre
                        )), '[]'::jsonb)
                        FROM modo_juego mj
                        WHERE mj.juego_id = j.id
                    )
                ) ORDER BY j.nombre), '[]'::jsonb)
                FROM juego j
            ),
            'regiones', (
                SELECT COALESCE(jsonb_agg(jsonb_build_object(
                    'id', id,
                    'valor', valor
                ) ORDER BY valor), '[]'::jsonb)
                FROM catalogo_region
            ),
            'tipos_torneo', (
                SELECT COALESCE(jsonb_agg(jsonb_build_object(
                    'id', id,
                    'valor', valor,
                    'descripcion', descripcion,
                    'tipo_trofeo', tipo_trofeo
                ) ORDER BY valor), '[]'::jsonb)
                FROM catalogo_tipo_torneo
            ),
            'tipos_entrada', (
                SELECT COALESCE(jsonb_agg(jsonb_build_object(
                    'id', id,
                    'valor', valor
                ) ORDER BY valor), '[]'::jsonb)
                FROM catalogo_tipo_entrada
            ),
            'al_mejor_de', jsonb_build_array(1, 3, 5, 7),
            'formatos', jsonb_build_array('1v1', '2v2', '3v3', '4v4', '5v5'),
            'redes_sociales', jsonb_build_array('twitch', 'discord', 'youtube', 'facebook', 'x')
        )
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'code', SQLSTATE
        );
END;
$$;


--
-- Name: FUNCTION torneo_obtener_catalogos(); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.torneo_obtener_catalogos() IS 'Obtiene todos los cat├ílogos necesarios para el formulario de creaci├│n de torneos';


--
-- Name: torneo_obtener_detalle(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.torneo_obtener_detalle(p_torneo_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_resultado JSONB;
BEGIN
    SELECT jsonb_build_object(
        'id', t.id,
        'titulo', t.titulo,
        'descripcion', t.descripcion,
        
        -- Fechas
        'fechas', jsonb_build_object(
            'inicio_registro', t.fecha_inicio_registro,
            'fin_registro', t.fecha_fin_registro,
            'inicio_torneo', t.fecha_inicio_torneo
        ),
        
        -- Detalles
        'juego', CASE WHEN j.id IS NOT NULL THEN jsonb_build_object(
            'id', j.id,
            'nombre', j.nombre
        ) ELSE NULL END,
        'plataforma', CASE WHEN cp.id IS NOT NULL THEN jsonb_build_object(
            'id', cp.id,
            'valor', cp.valor
        ) ELSE NULL END,
        'modo_juego', CASE WHEN mj.id IS NOT NULL THEN jsonb_build_object(
            'id', mj.id,
            'nombre', mj.nombre
        ) ELSE NULL END,
        'region', CASE WHEN cr.id IS NOT NULL THEN jsonb_build_object(
            'id', cr.id,
            'valor', cr.valor
        ) ELSE NULL END,
        'tipo_torneo', CASE WHEN ctt.id IS NOT NULL THEN jsonb_build_object(
            'id', ctt.id,
            'valor', ctt.valor,
            'tipo_trofeo', ctt.tipo_trofeo
        ) ELSE NULL END,
        'tipo_entrada', CASE WHEN cte.id IS NOT NULL THEN jsonb_build_object(
            'id', cte.id,
            'valor', cte.valor
        ) ELSE NULL END,
        
        -- Configuraci├│n
        'configuracion', jsonb_build_object(
            'al_mejor_de', t.al_mejor_de,
            'formato', t.formato,
            'cerrado', t.cerrado,
            'reglas', t.reglas,
            'capacidad', t.capacidad,
            'jugadores_pc_permitidos', t.jugadores_pc_permitidos,
            'requiere_transmision', t.requiere_transmision,
            'requiere_camara', t.requiere_camara
        ),
        
        -- Estado
        'estado', CASE WHEN cet.id IS NOT NULL THEN jsonb_build_object(
            'id', cet.id,
            'valor', cet.valor
        ) ELSE NULL END,
        
        -- Premios
        'premios', (
            SELECT jsonb_build_object(
                'cuota', tp.cuota,
                'fondo_total', tp.fondo_total,
                'fondo_despues_comision', tp.fondo_despues_comision,
                'comision_porcentaje', tp.comision_porcentaje,
                'comision_total', tp.comision_total,
                'ganador1_porcentaje', tp.ganador1_porcentaje,
                'ganador2_porcentaje', tp.ganador2_porcentaje,
                'premio_1er_lugar', ROUND(tp.fondo_despues_comision * tp.ganador1_porcentaje / 100, 2),
                'premio_2do_lugar', ROUND(tp.fondo_despues_comision * tp.ganador2_porcentaje / 100, 2)
            )
            FROM torneo_premios tp
            WHERE tp.torneo_id = t.id
        ),
        
        -- Anfitri├│n
        'anfitrion', jsonb_build_object(
            'id', u.id,
            'nickname', u.nickname,
            'foto_perfil', u.foto_perfil,
            'avatar_url', ca.url,
            'contacto', t.contacto_anfitrion,
            'discord_servidor', t.discord_servidor
        ),
        
        -- Redes sociales del torneo
        'redes_sociales', (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
                'id', tr.id,
                'plataforma', tr.plataforma,
                'url', tr.url
            )), '[]'::jsonb)
            FROM torneo_redes tr
            WHERE tr.torneo_id = t.id
        ),
        
        -- Gr├íficos
        'graficos', jsonb_build_object(
            'banner_url', t.banner_url,
            'miniatura_url', t.miniatura_url
        ),
        
        -- Estad├¡sticas
        'estadisticas', jsonb_build_object(
            'inscritos', (
                SELECT COUNT(*) 
                FROM torneo_inscripcion ti
                JOIN catalogo_estado_inscripcion cei ON ti.estado_id = cei.id
                WHERE ti.torneo_id = t.id AND cei.valor = 'confirmado'
            ),
            'capacidad_restante', CASE 
                WHEN t.capacidad IS NOT NULL THEN 
                    t.capacidad - (
                        SELECT COUNT(*) 
                        FROM torneo_inscripcion ti
                        JOIN catalogo_estado_inscripcion cei ON ti.estado_id = cei.id
                        WHERE ti.torneo_id = t.id AND cei.valor = 'confirmado'
                    )
                ELSE NULL
            END
        ),
        
        -- Timestamps
        'creado_en', t.creado_en,
        'actualizado_en', t.actualizado_en
    )
    INTO v_resultado
    FROM torneo t
    LEFT JOIN juego j ON t.juego_id = j.id
    LEFT JOIN catalogo_plataforma cp ON t.plataforma_id = cp.id
    LEFT JOIN modo_juego mj ON t.modo_juego_id = mj.id
    LEFT JOIN catalogo_region cr ON t.region_id = cr.id
    LEFT JOIN catalogo_tipo_torneo ctt ON t.tipo_torneo_id = ctt.id
    LEFT JOIN catalogo_tipo_entrada cte ON t.tipo_entrada_id = cte.id
    LEFT JOIN catalogo_estado_torneo cet ON t.estado_id = cet.id
    LEFT JOIN usuario u ON t.anfitrion_id = u.id
    LEFT JOIN catalogo_avatar ca ON u.avatar_id = ca.id
    WHERE t.id = p_torneo_id;
    
    IF v_resultado IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Torneo no encontrado'
        );
    END IF;
    
    RETURN jsonb_build_object(
        'success', true,
        'torneo', v_resultado
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'code', SQLSTATE
        );
END;
$$;


--
-- Name: FUNCTION torneo_obtener_detalle(p_torneo_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.torneo_obtener_detalle(p_torneo_id uuid) IS 'Obtiene toda la informaci├│n detallada de un torneo para visualizaci├│n';


--
-- Name: torneo_upsert_red_social(uuid, uuid, character varying, character varying, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.torneo_upsert_red_social(p_torneo_id uuid, p_anfitrion_id uuid, p_plataforma character varying, p_url character varying, p_red_id uuid DEFAULT NULL::uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_anfitrion_actual UUID;
    v_red_id UUID;
BEGIN
    -- Verificar que el torneo existe y pertenece al anfitri├│n
    SELECT anfitrion_id INTO v_anfitrion_actual
    FROM torneo WHERE id = p_torneo_id;
    
    IF v_anfitrion_actual IS NULL THEN
        RAISE EXCEPTION 'El torneo no existe';
    END IF;
    
    IF v_anfitrion_actual != p_anfitrion_id THEN
        RAISE EXCEPTION 'Solo el anfitri├│n puede modificar las redes del torneo';
    END IF;
    
    -- Validar datos
    IF p_plataforma IS NULL OR TRIM(p_plataforma) = '' THEN
        RAISE EXCEPTION 'La plataforma es requerida';
    END IF;
    
    IF p_url IS NULL OR TRIM(p_url) = '' THEN
        RAISE EXCEPTION 'La URL es requerida';
    END IF;
    
    IF p_red_id IS NOT NULL THEN
        -- Actualizar existente
        UPDATE torneo_redes
        SET plataforma = p_plataforma, url = p_url
        WHERE id = p_red_id AND torneo_id = p_torneo_id;
        
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Red social no encontrada';
        END IF;
        
        v_red_id := p_red_id;
    ELSE
        -- Verificar si ya existe esta plataforma para el torneo
        SELECT id INTO v_red_id
        FROM torneo_redes
        WHERE torneo_id = p_torneo_id AND LOWER(plataforma) = LOWER(p_plataforma);
        
        IF v_red_id IS NOT NULL THEN
            -- Actualizar existente
            UPDATE torneo_redes
            SET url = p_url
            WHERE id = v_red_id;
        ELSE
            -- Crear nueva
            INSERT INTO torneo_redes (torneo_id, plataforma, url)
            VALUES (p_torneo_id, p_plataforma, p_url)
            RETURNING id INTO v_red_id;
        END IF;
    END IF;
    
    RETURN jsonb_build_object(
        'success', true,
        'red_id', v_red_id,
        'message', 'Red social guardada correctamente'
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'code', SQLSTATE
        );
END;
$$;


--
-- Name: FUNCTION torneo_upsert_red_social(p_torneo_id uuid, p_anfitrion_id uuid, p_plataforma character varying, p_url character varying, p_red_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.torneo_upsert_red_social(p_torneo_id uuid, p_anfitrion_id uuid, p_plataforma character varying, p_url character varying, p_red_id uuid) IS 'Crea o actualiza una red social del torneo (twitch, discord, youtube, facebook, x)';


--
-- Name: trigger_actualizar_fondo_premios(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.trigger_actualizar_fondo_premios() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_cuota INTEGER;
    v_comision_porcentaje NUMERIC(5,2);
    v_inscritos INTEGER;
    v_fondo_total NUMERIC(12,2);
    v_comision_total NUMERIC(12,2);
    v_fondo_despues_comision NUMERIC(12,2);
    v_estado_confirmado_id UUID;
BEGIN
    -- Obtener estado confirmado
    SELECT id INTO v_estado_confirmado_id
    FROM catalogo_estado_inscripcion
    WHERE valor = 'confirmado';
    
    -- Solo procesar si la inscripci├│n es confirmada
    IF NEW.estado_id = v_estado_confirmado_id THEN
        -- Obtener cuota y comisi├│n del torneo
        SELECT cuota, comision_porcentaje
        INTO v_cuota, v_comision_porcentaje
        FROM torneo_premios
        WHERE torneo_id = NEW.torneo_id;
        
        -- Contar inscritos confirmados
        SELECT COUNT(*)
        INTO v_inscritos
        FROM torneo_inscripcion ti
        WHERE ti.torneo_id = NEW.torneo_id 
          AND ti.estado_id = v_estado_confirmado_id;
        
        -- Calcular fondos
        v_fondo_total := v_cuota * v_inscritos;
        v_comision_total := v_fondo_total * v_comision_porcentaje / 100;
        v_fondo_despues_comision := v_fondo_total - v_comision_total;
        
        -- Actualizar torneo_premios
        UPDATE torneo_premios
        SET 
            fondo_total = v_fondo_total,
            comision_total = v_comision_total,
            fondo_despues_comision = v_fondo_despues_comision
        WHERE torneo_id = NEW.torneo_id;
    END IF;
    
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: catalogo_avatar; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalogo_avatar (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nombre character varying NOT NULL,
    url character varying NOT NULL,
    seed character varying NOT NULL,
    categoria character varying,
    disponible boolean DEFAULT true NOT NULL,
    premium boolean DEFAULT false NOT NULL,
    creado_en timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: catalogo_estado_amistad; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalogo_estado_amistad (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    valor character varying NOT NULL,
    creado_en timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: catalogo_estado_inscripcion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalogo_estado_inscripcion (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    valor character varying NOT NULL,
    creado_en timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: catalogo_estado_torneo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalogo_estado_torneo (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    valor character varying NOT NULL,
    creado_en timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: catalogo_genero; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalogo_genero (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    valor character varying NOT NULL,
    creado_en timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: catalogo_origen_transaccion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalogo_origen_transaccion (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    valor character varying NOT NULL,
    creado_en timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: catalogo_plataforma; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalogo_plataforma (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    valor character varying NOT NULL,
    creado_en timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: catalogo_region; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalogo_region (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    valor character varying NOT NULL,
    creado_en timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: catalogo_rol; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalogo_rol (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    valor character varying NOT NULL,
    creado_en timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: catalogo_tipo_entrada; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalogo_tipo_entrada (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    valor character varying NOT NULL,
    creado_en timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: catalogo_tipo_item; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalogo_tipo_item (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    valor character varying NOT NULL,
    creado_en timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: catalogo_tipo_torneo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalogo_tipo_torneo (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    valor character varying NOT NULL,
    descripcion text,
    tipo_trofeo character varying NOT NULL,
    creado_en timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: catalogo_transaccion_tipo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalogo_transaccion_tipo (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    valor character varying NOT NULL,
    creado_en timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: equipo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.equipo (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nombre character varying NOT NULL,
    descripcion text,
    avatar_url character varying,
    creado_en timestamp without time zone DEFAULT now() NOT NULL,
    creado_por uuid
);


--
-- Name: equipo_miembros; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.equipo_miembros (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    rol character varying DEFAULT 'miembro'::character varying NOT NULL,
    joined_at timestamp without time zone DEFAULT now() NOT NULL,
    equipo_id uuid,
    usuario_id uuid
);


--
-- Name: juego; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.juego (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nombre character varying NOT NULL,
    descripcion text,
    creado_en timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: juego_plataformas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.juego_plataformas (
    "juegoId" uuid NOT NULL,
    "catalogoPlataformaId" uuid NOT NULL
);


--
-- Name: logro; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.logro (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nombre character varying NOT NULL,
    descripcion text
);


--
-- Name: membresia_tipo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.membresia_tipo (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nombre character varying NOT NULL,
    precio numeric(12,2) NOT NULL,
    duracion_dias integer NOT NULL,
    beneficios text
);


--
-- Name: modo_juego; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.modo_juego (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nombre character varying NOT NULL,
    descripcion text,
    juego_id uuid
);


--
-- Name: persona; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.persona (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    p_nombre character varying NOT NULL,
    s_nombre character varying,
    p_apellido character varying NOT NULL,
    s_apellido character varying,
    correo character varying NOT NULL,
    fecha_nacimiento date,
    timezone character varying,
    correo_paypal character varying,
    telefono character varying,
    direccion character varying,
    ciudad character varying,
    estado character varying,
    codigo_postal character varying,
    pais character varying,
    divisa character varying DEFAULT 'USD'::character varying,
    creado_en timestamp without time zone DEFAULT now() NOT NULL,
    actualizado_en timestamp without time zone DEFAULT now() NOT NULL,
    genero_id uuid
);


--
-- Name: tienda_item; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tienda_item (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nombre character varying NOT NULL,
    descripcion text,
    precio numeric(12,2) NOT NULL,
    creditos_otorgados integer,
    metadata jsonb,
    tipo_id uuid NOT NULL
);


--
-- Name: tienda_orden; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tienda_orden (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    usuario_id uuid NOT NULL,
    item_id uuid NOT NULL,
    paypal_order_id character varying,
    paypal_capture_id character varying,
    paypal_payer_id character varying,
    paypal_payer_email character varying,
    monto numeric(12,2) NOT NULL,
    divisa character varying(3) DEFAULT 'USD'::character varying NOT NULL,
    estado character varying(50) DEFAULT 'pendiente'::character varying NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    creado_en timestamp without time zone DEFAULT now() NOT NULL,
    completado_en timestamp without time zone,
    actualizado_en timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: tienda_solicitud_soporte; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tienda_solicitud_soporte (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    orden_id uuid,
    usuario_id uuid NOT NULL,
    tipo character varying(50) NOT NULL,
    nickname_solicitado character varying,
    estado character varying(50) DEFAULT 'pendiente'::character varying NOT NULL,
    notas_admin text,
    creado_en timestamp without time zone DEFAULT now() NOT NULL,
    actualizado_en timestamp without time zone DEFAULT now() NOT NULL,
    resuelto_en timestamp without time zone,
    resuelto_por uuid
);


--
-- Name: torneo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.torneo (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    titulo character varying NOT NULL,
    descripcion text,
    fecha_inicio_registro timestamp without time zone,
    fecha_fin_registro timestamp without time zone,
    fecha_inicio_torneo timestamp without time zone,
    tipo_torneo character varying,
    al_mejor_de integer DEFAULT 1 NOT NULL,
    formato character varying,
    cerrado boolean DEFAULT false NOT NULL,
    reglas text,
    jugadores_pc_permitidos boolean DEFAULT true NOT NULL,
    requiere_transmision boolean DEFAULT false NOT NULL,
    requiere_camara boolean DEFAULT false NOT NULL,
    capacidad integer,
    anfitrion_id uuid NOT NULL,
    juego_id uuid,
    plataforma_id uuid,
    modo_juego_id uuid,
    region_id uuid NOT NULL,
    tipo_entrada_id uuid NOT NULL,
    estado_id uuid,
    tipo_torneo_id uuid,
    banner_url character varying,
    miniatura_url character varying,
    contacto_anfitrion character varying,
    discord_servidor character varying,
    creado_en timestamp without time zone DEFAULT now() NOT NULL,
    actualizado_en timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: torneo_inscripcion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.torneo_inscripcion (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL,
    torneo_id uuid,
    usuario_id uuid NOT NULL,
    estado_id uuid NOT NULL
);


--
-- Name: torneo_premios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.torneo_premios (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    cuota integer,
    fondo_total numeric(12,2) DEFAULT '0'::numeric NOT NULL,
    fondo_despues_comision numeric(12,2) DEFAULT '0'::numeric NOT NULL,
    comision_porcentaje numeric(5,2) DEFAULT '0'::numeric NOT NULL,
    ganador1_porcentaje numeric(5,2) DEFAULT '0'::numeric NOT NULL,
    ganador2_porcentaje numeric(5,2) DEFAULT '0'::numeric NOT NULL,
    torneo_id uuid,
    comision_total numeric(12,2) DEFAULT 0 NOT NULL
);


--
-- Name: torneo_redes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.torneo_redes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    plataforma character varying NOT NULL,
    url character varying NOT NULL,
    torneo_id uuid
);


--
-- Name: torneo_resultados; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.torneo_resultados (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    posicion integer NOT NULL,
    torneo_id uuid,
    usuario_id uuid
);


--
-- Name: transaccion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.transaccion (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    monto numeric(12,2) NOT NULL,
    descripcion character varying,
    creado_en timestamp without time zone DEFAULT now() NOT NULL,
    usuario_id uuid,
    tipo_id uuid NOT NULL,
    origen_id uuid NOT NULL
);


--
-- Name: usuario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuario (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nickname character varying NOT NULL,
    password character varying NOT NULL,
    estado character varying(50) DEFAULT 'activo'::character varying NOT NULL,
    ultima_conexion timestamp without time zone,
    xp integer DEFAULT 0 NOT NULL,
    saldo numeric(12,2) DEFAULT '0'::numeric NOT NULL,
    creditos integer DEFAULT 0 NOT NULL,
    foto_perfil character varying,
    biografia character varying(300),
    desafios_habilitados boolean DEFAULT true NOT NULL,
    creado_en timestamp without time zone DEFAULT now() NOT NULL,
    actualizado_en timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    persona_id uuid,
    rol_id uuid NOT NULL,
    avatar_id uuid
);


--
-- Name: usuario_amigos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuario_amigos (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    creado_en timestamp without time zone DEFAULT now() NOT NULL,
    usuario1_id uuid,
    usuario2_id uuid,
    estado_id uuid NOT NULL
);


--
-- Name: usuario_cuenta_juego; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuario_cuenta_juego (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    identificador character varying NOT NULL,
    usuario_id uuid,
    plataforma_juego_id uuid NOT NULL
);


--
-- Name: usuario_estadisticas_juego; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuario_estadisticas_juego (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    victorias integer DEFAULT 0 NOT NULL,
    derrotas integer DEFAULT 0 NOT NULL,
    empates integer DEFAULT 0 NOT NULL,
    nivel_rango character varying,
    horas_jugadas integer DEFAULT 0 NOT NULL,
    actualizado_en timestamp without time zone DEFAULT now() NOT NULL,
    usuario_id uuid,
    juego_id uuid
);


--
-- Name: usuario_logros; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuario_logros (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL,
    usuario_id uuid,
    logro_id uuid
);


--
-- Name: usuario_membresias; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuario_membresias (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    fecha_inicio date NOT NULL,
    fecha_fin date NOT NULL,
    activa boolean DEFAULT true NOT NULL,
    usuario_id uuid,
    membresia_tipo_id uuid
);


--
-- Name: usuario_red_social; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuario_red_social (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    plataforma character varying NOT NULL,
    enlace character varying NOT NULL,
    usuario_id uuid
);


--
-- Name: usuario_seguidores; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuario_seguidores (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    creado_en timestamp without time zone DEFAULT now() NOT NULL,
    seguidor_id uuid,
    seguido_id uuid
);


--
-- Name: usuario_trofeos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuario_trofeos (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tipo_trofeo character varying NOT NULL,
    ganado_en timestamp without time zone DEFAULT now() NOT NULL,
    usuario_id uuid,
    torneo_id uuid
);


--
-- Data for Name: catalogo_avatar; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.catalogo_avatar VALUES ('1af031b3-dbb1-44ca-ab36-62025ab3277c', 'bottts-felix', 'https://api.dicebear.com/9.x/bottts/svg?seed=Felix', 'Felix', 'bottts', true, false, '2025-11-25 23:57:48.033069');
INSERT INTO public.catalogo_avatar VALUES ('b3ecedd0-6c48-4b27-a4d3-3d580a046279', 'bottts-aneka', 'https://api.dicebear.com/9.x/bottts/svg?seed=Aneka', 'Aneka', 'bottts', true, false, '2025-11-25 23:57:48.047243');
INSERT INTO public.catalogo_avatar VALUES ('2b220f6e-ef7c-40d4-b68c-9bc4fadf3f2d', 'bottts-buster', 'https://api.dicebear.com/9.x/bottts/svg?seed=Buster', 'Buster', 'bottts', true, false, '2025-11-25 23:57:48.068789');
INSERT INTO public.catalogo_avatar VALUES ('690ae217-0867-4313-babf-db12fc967087', 'bottts-midnight', 'https://api.dicebear.com/9.x/bottts/svg?seed=Midnight', 'Midnight', 'bottts', true, false, '2025-11-25 23:57:48.093295');
INSERT INTO public.catalogo_avatar VALUES ('682a6fdf-e19c-4845-811b-92dd8b0bc992', 'bottts-precious', 'https://api.dicebear.com/9.x/bottts/svg?seed=Precious', 'Precious', 'bottts', true, false, '2025-11-25 23:57:48.108962');
INSERT INTO public.catalogo_avatar VALUES ('632a8942-fd36-45e5-8a72-a8ac9a84bc04', 'bottts-shadow', 'https://api.dicebear.com/9.x/bottts/svg?seed=Shadow', 'Shadow', 'bottts', true, false, '2025-11-25 23:57:48.12156');
INSERT INTO public.catalogo_avatar VALUES ('f8b0f49a-6d81-42c3-8723-1023e80ca5c3', 'bottts-lucky', 'https://api.dicebear.com/9.x/bottts/svg?seed=Lucky', 'Lucky', 'bottts', true, false, '2025-11-25 23:57:48.151979');
INSERT INTO public.catalogo_avatar VALUES ('44d3a80a-06c5-4ec1-bcac-28ebad0f9b78', 'bottts-misty', 'https://api.dicebear.com/9.x/bottts/svg?seed=Misty', 'Misty', 'bottts', true, false, '2025-11-25 23:57:48.169591');
INSERT INTO public.catalogo_avatar VALUES ('edfb66de-653b-40b7-9e35-e06532cbc9f0', 'bottts-buddy', 'https://api.dicebear.com/9.x/bottts/svg?seed=Buddy', 'Buddy', 'bottts', true, false, '2025-11-25 23:57:48.181829');
INSERT INTO public.catalogo_avatar VALUES ('c3eb1e2c-762a-4ad4-b402-cd6f4c4c81e5', 'bottts-charlie', 'https://api.dicebear.com/9.x/bottts/svg?seed=Charlie', 'Charlie', 'bottts', true, false, '2025-11-25 23:57:48.192185');
INSERT INTO public.catalogo_avatar VALUES ('536f862f-6613-45ff-ab24-15b705e24f64', 'bottts-max', 'https://api.dicebear.com/9.x/bottts/svg?seed=Max', 'Max', 'bottts', true, false, '2025-11-25 23:57:48.201232');
INSERT INTO public.catalogo_avatar VALUES ('56b8eb36-7504-422a-9253-320aa707e317', 'bottts-luna', 'https://api.dicebear.com/9.x/bottts/svg?seed=Luna', 'Luna', 'bottts', true, false, '2025-11-25 23:57:48.213021');
INSERT INTO public.catalogo_avatar VALUES ('bfdebe0f-9d9d-472e-9f1d-21fd24611258', 'bottts-rocky', 'https://api.dicebear.com/9.x/bottts/svg?seed=Rocky', 'Rocky', 'bottts', true, false, '2025-11-25 23:57:48.224151');
INSERT INTO public.catalogo_avatar VALUES ('e570b480-c6ae-493f-9dee-53ea62b89a38', 'bottts-daisy', 'https://api.dicebear.com/9.x/bottts/svg?seed=Daisy', 'Daisy', 'bottts', true, false, '2025-11-25 23:57:48.233842');
INSERT INTO public.catalogo_avatar VALUES ('cddb9ec1-3718-421c-9027-42d48f6de05b', 'bottts-bailey', 'https://api.dicebear.com/9.x/bottts/svg?seed=Bailey', 'Bailey', 'bottts', true, false, '2025-11-25 23:57:48.244984');
INSERT INTO public.catalogo_avatar VALUES ('d148015b-0983-42d8-9e96-8a9f52b78071', 'bottts-coco', 'https://api.dicebear.com/9.x/bottts/svg?seed=Coco', 'Coco', 'bottts', true, false, '2025-11-25 23:57:48.255083');
INSERT INTO public.catalogo_avatar VALUES ('9c5e2d19-fbcd-46b3-98ef-b59ec2a39868', 'bottts-milo', 'https://api.dicebear.com/9.x/bottts/svg?seed=Milo', 'Milo', 'bottts', true, false, '2025-11-25 23:57:48.265412');
INSERT INTO public.catalogo_avatar VALUES ('052ca5f7-fade-469e-a346-48e2047b780c', 'bottts-bella', 'https://api.dicebear.com/9.x/bottts/svg?seed=Bella', 'Bella', 'bottts', true, false, '2025-11-25 23:57:48.27676');
INSERT INTO public.catalogo_avatar VALUES ('808fd4ec-9c60-4ba7-88e8-5f67ec1197e8', 'bottts-oliver', 'https://api.dicebear.com/9.x/bottts/svg?seed=Oliver', 'Oliver', 'bottts', true, false, '2025-11-25 23:57:48.284539');
INSERT INTO public.catalogo_avatar VALUES ('a96b8bcb-fff5-4a52-b823-397204620699', 'bottts-zoe', 'https://api.dicebear.com/9.x/bottts/svg?seed=Zoe', 'Zoe', 'bottts', true, false, '2025-11-25 23:57:48.295003');
INSERT INTO public.catalogo_avatar VALUES ('181315e9-9c8c-43c8-a6dc-419a303f282d', 'bottts-leo', 'https://api.dicebear.com/9.x/bottts/svg?seed=Leo', 'Leo', 'bottts', true, false, '2025-11-25 23:57:48.303739');
INSERT INTO public.catalogo_avatar VALUES ('648d55ab-de2b-4b37-b0eb-5a3783635967', 'bottts-lily', 'https://api.dicebear.com/9.x/bottts/svg?seed=Lily', 'Lily', 'bottts', true, false, '2025-11-25 23:57:48.314337');
INSERT INTO public.catalogo_avatar VALUES ('02e98c50-e0dc-4ad6-b2bc-fdd8f2395089', 'bottts-cooper', 'https://api.dicebear.com/9.x/bottts/svg?seed=Cooper', 'Cooper', 'bottts', true, false, '2025-11-25 23:57:48.324312');
INSERT INTO public.catalogo_avatar VALUES ('79c18386-fdaa-4f22-b6cb-43230dd9d8ab', 'bottts-lucy', 'https://api.dicebear.com/9.x/bottts/svg?seed=Lucy', 'Lucy', 'bottts', true, false, '2025-11-25 23:57:48.333305');
INSERT INTO public.catalogo_avatar VALUES ('a61ffbe3-e6b7-49d2-a655-d3d9b559e54c', 'bottts-bear', 'https://api.dicebear.com/9.x/bottts/svg?seed=Bear', 'Bear', 'bottts', true, false, '2025-11-25 23:57:48.346374');
INSERT INTO public.catalogo_avatar VALUES ('13b037ad-0198-4913-9809-e93e86f8ef4d', 'bottts-molly', 'https://api.dicebear.com/9.x/bottts/svg?seed=Molly', 'Molly', 'bottts', true, false, '2025-11-25 23:57:48.359919');
INSERT INTO public.catalogo_avatar VALUES ('ad944fba-7793-4ea7-b658-2a24c1c2c394', 'bottts-duke', 'https://api.dicebear.com/9.x/bottts/svg?seed=Duke', 'Duke', 'bottts', true, false, '2025-11-25 23:57:48.37381');
INSERT INTO public.catalogo_avatar VALUES ('c871484c-00bf-4849-8f5b-719f1eee999c', 'bottts-sophie', 'https://api.dicebear.com/9.x/bottts/svg?seed=Sophie', 'Sophie', 'bottts', true, false, '2025-11-25 23:57:48.390556');
INSERT INTO public.catalogo_avatar VALUES ('382ec476-6950-456f-8a60-742cd69edede', 'bottts-zeus', 'https://api.dicebear.com/9.x/bottts/svg?seed=Zeus', 'Zeus', 'bottts', true, false, '2025-11-25 23:57:48.405402');
INSERT INTO public.catalogo_avatar VALUES ('33716538-0cc4-4dc4-b144-acab9513037e', 'bottts-sadie', 'https://api.dicebear.com/9.x/bottts/svg?seed=Sadie', 'Sadie', 'bottts', true, false, '2025-11-25 23:57:48.423091');
INSERT INTO public.catalogo_avatar VALUES ('ce8ac9bd-ec83-4e3c-a41b-9333c44b9833', 'bottts-jack', 'https://api.dicebear.com/9.x/bottts/svg?seed=Jack', 'Jack', 'bottts', true, false, '2025-11-25 23:57:48.439109');
INSERT INTO public.catalogo_avatar VALUES ('1fdf8db0-b362-4fd3-8c5f-e7082bba33a9', 'bottts-maggie', 'https://api.dicebear.com/9.x/bottts/svg?seed=Maggie', 'Maggie', 'bottts', true, false, '2025-11-25 23:57:48.461778');
INSERT INTO public.catalogo_avatar VALUES ('72314fca-5bb0-4e48-805d-c74b501bab13', 'bottts-toby', 'https://api.dicebear.com/9.x/bottts/svg?seed=Toby', 'Toby', 'bottts', true, false, '2025-11-25 23:57:48.482486');
INSERT INTO public.catalogo_avatar VALUES ('53dbbbc9-c1c1-4860-9500-d76adb8c0056', 'bottts-stella', 'https://api.dicebear.com/9.x/bottts/svg?seed=Stella', 'Stella', 'bottts', true, false, '2025-11-25 23:57:48.500409');
INSERT INTO public.catalogo_avatar VALUES ('5faaf569-72ee-4811-b960-728a4120ed38', 'bottts-teddy', 'https://api.dicebear.com/9.x/bottts/svg?seed=Teddy', 'Teddy', 'bottts', true, false, '2025-11-25 23:57:48.516668');
INSERT INTO public.catalogo_avatar VALUES ('426fede0-9b57-4841-bf62-e7920ed58cfb', 'bottts-penny', 'https://api.dicebear.com/9.x/bottts/svg?seed=Penny', 'Penny', 'bottts', true, false, '2025-11-25 23:57:48.535639');
INSERT INTO public.catalogo_avatar VALUES ('545bd0ff-bae1-487e-a03e-3c81c788e1ed', 'bottts-winston', 'https://api.dicebear.com/9.x/bottts/svg?seed=Winston', 'Winston', 'bottts', true, false, '2025-11-25 23:57:48.551109');
INSERT INTO public.catalogo_avatar VALUES ('c3803e8b-5c78-4915-ae81-655e4510ba10', 'bottts-chloe', 'https://api.dicebear.com/9.x/bottts/svg?seed=Chloe', 'Chloe', 'bottts', true, false, '2025-11-25 23:57:48.566765');
INSERT INTO public.catalogo_avatar VALUES ('dbc208a8-bc5b-4722-87ae-b3f75f870a8a', 'bottts-tucker', 'https://api.dicebear.com/9.x/bottts/svg?seed=Tucker', 'Tucker', 'bottts', true, false, '2025-11-25 23:57:48.579124');
INSERT INTO public.catalogo_avatar VALUES ('4997d32b-6665-4146-9a2f-30d2b690fd1c', 'bottts-lola', 'https://api.dicebear.com/9.x/bottts/svg?seed=Lola', 'Lola', 'bottts', true, false, '2025-11-25 23:57:48.595443');
INSERT INTO public.catalogo_avatar VALUES ('98ac4f5a-383d-4cd0-a810-66ed74d11c31', 'bottts-jake', 'https://api.dicebear.com/9.x/bottts/svg?seed=Jake', 'Jake', 'bottts', true, false, '2025-11-25 23:57:48.609439');
INSERT INTO public.catalogo_avatar VALUES ('60ba0d37-ddcb-4dab-9bc3-add727f0bc13', 'bottts-nala', 'https://api.dicebear.com/9.x/bottts/svg?seed=Nala', 'Nala', 'bottts', true, false, '2025-11-25 23:57:48.624364');
INSERT INTO public.catalogo_avatar VALUES ('a8692e03-bdce-4824-8d1b-b5630da95db7', 'bottts-bentley', 'https://api.dicebear.com/9.x/bottts/svg?seed=Bentley', 'Bentley', 'bottts', true, false, '2025-11-25 23:57:48.635138');
INSERT INTO public.catalogo_avatar VALUES ('01ab3568-7eb5-43df-aa4d-e2eb8d527b81', 'bottts-gracie', 'https://api.dicebear.com/9.x/bottts/svg?seed=Gracie', 'Gracie', 'bottts', true, false, '2025-11-25 23:57:48.64787');
INSERT INTO public.catalogo_avatar VALUES ('cc850cb0-5dc2-434e-b116-4421a1b49cfa', 'bottts-oscar', 'https://api.dicebear.com/9.x/bottts/svg?seed=Oscar', 'Oscar', 'bottts', true, false, '2025-11-25 23:57:48.659114');
INSERT INTO public.catalogo_avatar VALUES ('d4416715-8641-4b3a-a187-ec0fcf6836f4', 'bottts-ruby', 'https://api.dicebear.com/9.x/bottts/svg?seed=Ruby', 'Ruby', 'bottts', true, false, '2025-11-25 23:57:48.669024');
INSERT INTO public.catalogo_avatar VALUES ('95f67adc-b8e0-4e78-8812-b44f59b5162e', 'bottts-gizmo', 'https://api.dicebear.com/9.x/bottts/svg?seed=Gizmo', 'Gizmo', 'bottts', true, false, '2025-11-25 23:57:48.680812');
INSERT INTO public.catalogo_avatar VALUES ('d75d02d0-7652-4945-9ffc-9860d24cd621', 'bottts-rosie', 'https://api.dicebear.com/9.x/bottts/svg?seed=Rosie', 'Rosie', 'bottts', true, false, '2025-11-25 23:57:48.692574');
INSERT INTO public.catalogo_avatar VALUES ('1250a44d-21e9-43c9-b254-80dd2e02249b', 'bottts-thor', 'https://api.dicebear.com/9.x/bottts/svg?seed=Thor', 'Thor', 'bottts', true, false, '2025-11-25 23:57:48.701904');
INSERT INTO public.catalogo_avatar VALUES ('319490d2-b9e0-4549-b9a0-378988127fa1', 'bottts-ellie', 'https://api.dicebear.com/9.x/bottts/svg?seed=Ellie', 'Ellie', 'bottts', true, false, '2025-11-25 23:57:48.715279');
INSERT INTO public.catalogo_avatar VALUES ('8b633952-bb5f-4e03-bf39-df0b0e52b9e9', 'bottts-bandit', 'https://api.dicebear.com/9.x/bottts/svg?seed=Bandit', 'Bandit', 'bottts', true, true, '2025-11-25 23:57:48.726931');
INSERT INTO public.catalogo_avatar VALUES ('81ce6136-f17b-4c67-a6f5-11fc593aea27', 'bottts-zoey', 'https://api.dicebear.com/9.x/bottts/svg?seed=Zoey', 'Zoey', 'bottts', true, true, '2025-11-25 23:57:48.738358');
INSERT INTO public.catalogo_avatar VALUES ('581c3d06-f19c-47fa-ba3e-7bbde7cd4bb1', 'bottts-finn', 'https://api.dicebear.com/9.x/bottts/svg?seed=Finn', 'Finn', 'bottts', true, true, '2025-11-25 23:57:48.749098');
INSERT INTO public.catalogo_avatar VALUES ('4037fb9f-0c28-49f6-9ad1-9f3873538fb6', 'bottts-ginger', 'https://api.dicebear.com/9.x/bottts/svg?seed=Ginger', 'Ginger', 'bottts', true, true, '2025-11-25 23:57:48.764213');
INSERT INTO public.catalogo_avatar VALUES ('21a20ab4-b183-4324-88ac-6a65fa391dcb', 'bottts-harley', 'https://api.dicebear.com/9.x/bottts/svg?seed=Harley', 'Harley', 'bottts', true, true, '2025-11-25 23:57:48.776781');
INSERT INTO public.catalogo_avatar VALUES ('e618841b-ba06-4460-aa44-c0112667a119', 'bottts-princess', 'https://api.dicebear.com/9.x/bottts/svg?seed=Princess', 'Princess', 'bottts', true, true, '2025-11-25 23:57:48.786256');
INSERT INTO public.catalogo_avatar VALUES ('1eb1f55c-2070-4f4d-905e-49a17ca1afde', 'bottts-murphy', 'https://api.dicebear.com/9.x/bottts/svg?seed=Murphy', 'Murphy', 'bottts', true, true, '2025-11-25 23:57:48.797713');
INSERT INTO public.catalogo_avatar VALUES ('adfdd31d-cd18-4488-93aa-85a6422885f1', 'bottts-piper', 'https://api.dicebear.com/9.x/bottts/svg?seed=Piper', 'Piper', 'bottts', true, true, '2025-11-25 23:57:48.808104');
INSERT INTO public.catalogo_avatar VALUES ('45be6938-839b-46ca-a709-08be51549ed6', 'bottts-riley', 'https://api.dicebear.com/9.x/bottts/svg?seed=Riley', 'Riley', 'bottts', true, true, '2025-11-25 23:57:48.817914');
INSERT INTO public.catalogo_avatar VALUES ('2700f444-4b3b-4a42-83af-d18536b488c9', 'bottts-willow', 'https://api.dicebear.com/9.x/bottts/svg?seed=Willow', 'Willow', 'bottts', true, true, '2025-11-25 23:57:48.831178');
INSERT INTO public.catalogo_avatar VALUES ('e195e903-6271-4db0-bacd-f93dded52fa5', 'bottts-hank', 'https://api.dicebear.com/9.x/bottts/svg?seed=Hank', 'Hank', 'bottts', true, true, '2025-11-25 23:57:48.84309');
INSERT INTO public.catalogo_avatar VALUES ('0ed94443-6888-42d9-a3c7-9e25c4128e0f', 'bottts-emma', 'https://api.dicebear.com/9.x/bottts/svg?seed=Emma', 'Emma', 'bottts', true, true, '2025-11-25 23:57:48.858644');
INSERT INTO public.catalogo_avatar VALUES ('f419036c-066d-4cfa-a0f5-7d6135314c39', 'bottts-louie', 'https://api.dicebear.com/9.x/bottts/svg?seed=Louie', 'Louie', 'bottts', true, true, '2025-11-25 23:57:48.869203');
INSERT INTO public.catalogo_avatar VALUES ('ca17eca3-10ac-4867-87ab-35f93ab65e8d', 'bottts-abby', 'https://api.dicebear.com/9.x/bottts/svg?seed=Abby', 'Abby', 'bottts', true, true, '2025-11-25 23:57:48.883749');
INSERT INTO public.catalogo_avatar VALUES ('35ce0e8f-6e45-4def-a0fc-aceb4facd45f', 'bottts-bruno', 'https://api.dicebear.com/9.x/bottts/svg?seed=Bruno', 'Bruno', 'bottts', true, true, '2025-11-25 23:57:48.897245');
INSERT INTO public.catalogo_avatar VALUES ('58bbaed1-5139-430e-b169-b5bf68cf45a4', 'bottts-angel', 'https://api.dicebear.com/9.x/bottts/svg?seed=Angel', 'Angel', 'bottts', true, true, '2025-11-25 23:57:48.91016');
INSERT INTO public.catalogo_avatar VALUES ('d23bea4b-6637-41a3-a7cf-ce48bffe666d', 'bottts-diesel', 'https://api.dicebear.com/9.x/bottts/svg?seed=Diesel', 'Diesel', 'bottts', true, true, '2025-11-25 23:57:48.92761');
INSERT INTO public.catalogo_avatar VALUES ('50d70f0f-a4be-4729-b70e-7f7da25c2899', 'bottts-annie', 'https://api.dicebear.com/9.x/bottts/svg?seed=Annie', 'Annie', 'bottts', true, true, '2025-11-25 23:57:48.939484');
INSERT INTO public.catalogo_avatar VALUES ('7fb96d6f-d6d4-4a37-bfa2-8791ff07bf96', 'bottts-ace', 'https://api.dicebear.com/9.x/bottts/svg?seed=Ace', 'Ace', 'bottts', true, true, '2025-11-25 23:57:48.952294');
INSERT INTO public.catalogo_avatar VALUES ('08a9206b-30af-420b-9404-19984778a422', 'bottts-roxy', 'https://api.dicebear.com/9.x/bottts/svg?seed=Roxy', 'Roxy', 'bottts', true, true, '2025-11-25 23:57:48.973639');


--
-- Data for Name: catalogo_estado_amistad; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.catalogo_estado_amistad VALUES ('c5001009-61d3-499c-8728-09c09f47244a', 'pendiente', '2025-11-25 23:57:47.479303');
INSERT INTO public.catalogo_estado_amistad VALUES ('9c37e2bd-32c2-41a0-94a9-7aa6b8300891', 'aceptado', '2025-11-25 23:57:47.495316');
INSERT INTO public.catalogo_estado_amistad VALUES ('d2c33827-f05f-40a6-9695-288b905035a8', 'rechazado', '2025-11-25 23:57:47.510303');
INSERT INTO public.catalogo_estado_amistad VALUES ('0a2182db-0900-436f-9336-84a98728a230', 'bloqueado', '2025-11-25 23:57:47.525854');


--
-- Data for Name: catalogo_estado_inscripcion; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.catalogo_estado_inscripcion VALUES ('0a796d9f-a4a5-48e6-b233-bc631e4ead71', 'pendiente', '2025-11-25 23:57:47.542134');
INSERT INTO public.catalogo_estado_inscripcion VALUES ('b760cb2a-149b-4ef2-9cce-0fe4faad5675', 'confirmada', '2025-11-25 23:57:47.554022');
INSERT INTO public.catalogo_estado_inscripcion VALUES ('dc3144b7-c9d6-4753-912a-e3067c6af97f', 'cancelada', '2025-11-25 23:57:47.567828');
INSERT INTO public.catalogo_estado_inscripcion VALUES ('de4c2dcb-3d06-441c-b123-8852f675f8fb', 'rechazada', '2025-11-25 23:57:47.58186');


--
-- Data for Name: catalogo_estado_torneo; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.catalogo_estado_torneo VALUES ('07b9dbaa-7841-456b-b3a9-aefbaf987e46', 'borrador', '2025-11-25 23:57:47.600471');
INSERT INTO public.catalogo_estado_torneo VALUES ('0aece543-ac95-4ff2-8a49-55d7f01114bd', 'abierto', '2025-11-25 23:57:47.615665');
INSERT INTO public.catalogo_estado_torneo VALUES ('01bc1895-aa86-4a64-9a62-545c26934d13', 'en curso', '2025-11-25 23:57:47.627104');
INSERT INTO public.catalogo_estado_torneo VALUES ('ef9df058-e80d-47e2-adfc-617409cceb75', 'finalizado', '2025-11-25 23:57:47.64102');
INSERT INTO public.catalogo_estado_torneo VALUES ('e0fe15bc-d9a5-4252-8753-37fc6b96bf21', 'cancelado', '2025-11-25 23:57:47.654687');
INSERT INTO public.catalogo_estado_torneo VALUES ('fc0009f0-3389-4e84-87b6-d321dd1ea0ab', 'proximamente', '2025-11-27 01:28:20.800594');
INSERT INTO public.catalogo_estado_torneo VALUES ('d3a0c8f1-4ca9-4c12-8488-ece5bccb887f', 'en_curso', '2025-11-27 01:28:20.800594');
INSERT INTO public.catalogo_estado_torneo VALUES ('4f0b5dc5-0a20-4c52-ab3d-9797c2a541c0', 'terminado', '2025-11-27 01:28:20.800594');


--
-- Data for Name: catalogo_genero; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.catalogo_genero VALUES ('3279d807-35df-4a11-aaa2-85d6e235f612', 'Masculino', '2025-11-25 23:57:47.418177');
INSERT INTO public.catalogo_genero VALUES ('c66e4817-b70b-460d-8163-56f562ddb62d', 'Femenino', '2025-11-25 23:57:47.431399');
INSERT INTO public.catalogo_genero VALUES ('f4a0f973-84a5-4681-82ea-f322388c7e13', 'Otro', '2025-11-25 23:57:47.441737');
INSERT INTO public.catalogo_genero VALUES ('ac16e775-a0c6-4fea-a7d4-9f6ea69cf653', 'Prefiero no decir', '2025-11-25 23:57:47.461516');


--
-- Data for Name: catalogo_origen_transaccion; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.catalogo_origen_transaccion VALUES ('d725e5df-c148-4c90-9c96-1770141c2828', 'compra', '2025-11-25 23:57:47.66836');
INSERT INTO public.catalogo_origen_transaccion VALUES ('3deed878-17ba-4a47-8596-cf328c23f9c2', 'premio', '2025-11-25 23:57:47.68121');
INSERT INTO public.catalogo_origen_transaccion VALUES ('5c1a1922-c433-46dc-8130-708efe4e3dca', 'reembolso', '2025-11-25 23:57:47.692173');
INSERT INTO public.catalogo_origen_transaccion VALUES ('51c0c4e1-162c-4504-9eec-d22e11a08528', 'regalo', '2025-11-25 23:57:47.700316');
INSERT INTO public.catalogo_origen_transaccion VALUES ('77712f9c-1de3-4cb7-a582-6fa69097f84b', 'logro', '2025-11-25 23:57:47.710384');
INSERT INTO public.catalogo_origen_transaccion VALUES ('e922302d-0ef2-4ad5-8dca-366179997cad', 'torneo', '2025-11-25 23:57:47.718953');
INSERT INTO public.catalogo_origen_transaccion VALUES ('e29008a7-b37c-4c31-a857-ada357f91189', 'inscripcion', '2025-11-27 07:18:59.094378');


--
-- Data for Name: catalogo_plataforma; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.catalogo_plataforma VALUES ('5117d560-ce1c-4cda-bfcc-8f06ef7bf383', 'PC', '2025-11-25 23:57:47.73147');
INSERT INTO public.catalogo_plataforma VALUES ('d2bf5a42-507f-44d6-8341-0917a4e378db', 'PlayStation 5', '2025-11-25 23:57:47.740711');
INSERT INTO public.catalogo_plataforma VALUES ('3f5d6022-ae5c-4b6d-9653-3561df2fe1d7', 'PlayStation 4', '2025-11-25 23:57:47.75045');
INSERT INTO public.catalogo_plataforma VALUES ('25443b72-fb2d-4a7d-ab53-560210b9c0d9', 'Xbox Series X/S', '2025-11-25 23:57:47.760594');
INSERT INTO public.catalogo_plataforma VALUES ('b573c143-c30e-4e65-b7e0-82046e915927', 'Xbox One', '2025-11-25 23:57:47.770018');
INSERT INTO public.catalogo_plataforma VALUES ('311cf287-44b8-4f19-b175-8efcec8eae1b', 'Nintendo Switch', '2025-11-25 23:57:47.780132');
INSERT INTO public.catalogo_plataforma VALUES ('67853df9-0910-4de9-802c-19bbd897fba7', 'Mobile', '2025-11-25 23:57:47.790571');
INSERT INTO public.catalogo_plataforma VALUES ('5e729706-a351-4fdd-92e0-5387b5d7eaca', 'Steam', '2025-11-25 23:57:47.799427');
INSERT INTO public.catalogo_plataforma VALUES ('674abe75-28c6-4a44-b4eb-1af3252e7550', 'Epic Games', '2025-11-25 23:57:47.809556');
INSERT INTO public.catalogo_plataforma VALUES ('abb308a9-ea6a-4bd8-b328-497a7d9a0b6a', 'Battle.net', '2025-11-25 23:57:47.817862');
INSERT INTO public.catalogo_plataforma VALUES ('6b6e6ce5-dae9-4794-b547-ba0e75a213d0', 'Origin', '2025-11-27 07:18:59.189039');
INSERT INTO public.catalogo_plataforma VALUES ('c35e6754-144e-41bb-8e67-724e1273329f', 'Ubisoft Connect', '2025-11-27 07:18:59.202815');
INSERT INTO public.catalogo_plataforma VALUES ('170c196c-f611-46e7-a3ed-3d6ea98385d7', 'GOG', '2025-11-27 07:18:59.213396');
INSERT INTO public.catalogo_plataforma VALUES ('f43b3954-b1b3-4bca-97a9-dec016645be2', 'Crossplay', '2025-11-27 07:18:59.227701');


--
-- Data for Name: catalogo_region; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.catalogo_region VALUES ('89e2c110-d462-40fb-b6ce-14c968b95d5a', 'Norte Am├®rica', '2025-11-25 23:57:47.82925');
INSERT INTO public.catalogo_region VALUES ('5ff3751f-585f-441b-aa19-7dc47e1211cf', 'Sur Am├®rica', '2025-11-25 23:57:47.838732');
INSERT INTO public.catalogo_region VALUES ('f4e86ebd-5792-41b4-bd60-872b7c8cca59', 'Europa', '2025-11-25 23:57:47.849165');
INSERT INTO public.catalogo_region VALUES ('590f54fc-ab17-4aad-a4c6-6e77e7a93df4', 'Asia', '2025-11-25 23:57:47.859613');
INSERT INTO public.catalogo_region VALUES ('80f8bcde-068f-47ea-ae52-505371d48eae', 'Ocean├¡a', '2025-11-25 23:57:47.867787');
INSERT INTO public.catalogo_region VALUES ('411fd6d0-2445-4a9d-a005-591bd877fc4e', '├üfrica', '2025-11-25 23:57:47.87849');
INSERT INTO public.catalogo_region VALUES ('587331a1-2717-4616-b2fb-5d4f8e80e5ab', 'LATAM', '2025-11-25 23:57:47.886753');
INSERT INTO public.catalogo_region VALUES ('fd1e6742-4d8b-4022-917a-d585e21ecbf7', 'Brasil', '2025-11-25 23:57:47.897708');
INSERT INTO public.catalogo_region VALUES ('996b1e7a-56e5-4a4a-9327-bb9a81764341', 'Global', '2025-11-25 23:57:47.908059');
INSERT INTO public.catalogo_region VALUES ('ed5f4927-c7e8-4303-98c5-4d4de4263734', 'M├®xico', '2025-11-27 07:18:59.264724');
INSERT INTO public.catalogo_region VALUES ('1029a68e-7394-4032-8648-d99e81cfee53', 'Espa├▒a', '2025-11-27 07:18:59.27605');
INSERT INTO public.catalogo_region VALUES ('29b63054-4e6d-4212-9e1f-59b16d4d1747', 'Argentina', '2025-11-27 07:18:59.286925');
INSERT INTO public.catalogo_region VALUES ('b1b74676-6ae3-4939-ac90-8e7fe1c8959b', 'Chile', '2025-11-27 07:18:59.297423');
INSERT INTO public.catalogo_region VALUES ('146a4415-921f-4d0e-9d0c-69b1b732d9f8', 'Colombia', '2025-11-27 07:18:59.308259');
INSERT INTO public.catalogo_region VALUES ('f34d5dfa-1e69-4745-82e6-3ec2088a6b4a', 'Per├║', '2025-11-27 07:18:59.317221');


--
-- Data for Name: catalogo_rol; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.catalogo_rol VALUES ('b1ca46a1-91f4-442b-9557-36be96b52eb9', 'admin', '2025-11-25 23:57:47.356682');
INSERT INTO public.catalogo_rol VALUES ('19de14e5-c5a1-4def-a42f-0298ab7f4818', 'usuario', '2025-11-25 23:57:47.393395');
INSERT INTO public.catalogo_rol VALUES ('15459e70-e133-4991-ab25-95c332a053dc', 'moderador', '2025-11-25 23:57:47.407373');


--
-- Data for Name: catalogo_tipo_entrada; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.catalogo_tipo_entrada VALUES ('f1b75e2b-c06d-4779-8f23-ea8f390cad74', 'mando', '2025-11-25 23:57:47.917376');
INSERT INTO public.catalogo_tipo_entrada VALUES ('772ae38d-5631-4af4-84c6-42d65223cd01', 'teclado', '2025-11-25 23:57:47.929901');
INSERT INTO public.catalogo_tipo_entrada VALUES ('508b726b-62cf-4142-970e-7f1988dd07c1', 'todos', '2025-11-25 23:57:47.942261');
INSERT INTO public.catalogo_tipo_entrada VALUES ('5a2b8bd2-c5b0-4365-8590-8cc9f2c71d5f', 'touch', '2025-11-27 07:18:59.337189');


--
-- Data for Name: catalogo_tipo_item; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.catalogo_tipo_item VALUES ('128e858d-dea5-4eee-a6f6-dbcc0fdc3d58', 'creditos', '2025-11-25 23:57:47.961822');
INSERT INTO public.catalogo_tipo_item VALUES ('7d760119-aa95-4faa-b0c2-ae0b94efefe5', 'membresia', '2025-11-25 23:57:47.977487');
INSERT INTO public.catalogo_tipo_item VALUES ('9dd97afe-ac48-40e3-91ef-c13e076f9094', 'servicio', '2025-11-25 23:57:47.991142');
INSERT INTO public.catalogo_tipo_item VALUES ('af76328d-ceb5-478c-9c69-605bd0553497', 'avatar', '2025-11-27 07:18:59.358541');
INSERT INTO public.catalogo_tipo_item VALUES ('662b7443-ad16-40e5-812f-e273acf6b5c3', 'banner', '2025-11-27 07:18:59.370023');


--
-- Data for Name: catalogo_tipo_torneo; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.catalogo_tipo_torneo VALUES ('93cec056-d268-4436-bd24-ea2237ad16c5', 'eliminacion_simple', 'Eliminaci├│n simple - Un jugador pierde y queda eliminado', 'trofeo_eliminacion', '2025-11-27 01:28:20.565202');
INSERT INTO public.catalogo_tipo_torneo VALUES ('0684864b-a8e5-4fd0-b279-266cd7a9da00', 'eliminacion_doble', 'Eliminaci├│n doble - Un jugador debe perder dos veces para ser eliminado', 'trofeo_eliminacion_doble', '2025-11-27 01:28:20.565202');
INSERT INTO public.catalogo_tipo_torneo VALUES ('d53a1632-dcbe-417e-8a97-2f498ef877d2', 'todos_contra_todos', 'Round Robin - Todos juegan contra todos', 'trofeo_round_robin', '2025-11-27 01:28:20.565202');
INSERT INTO public.catalogo_tipo_torneo VALUES ('faa2af34-062c-4016-8df2-bae0203d9711', 'grupos', 'Fase de grupos con eliminatorias', 'trofeo_grupos', '2025-11-27 01:28:20.565202');
INSERT INTO public.catalogo_tipo_torneo VALUES ('2518dad7-ef09-4fb1-8763-d808a477a1bd', 'suizo', 'Sistema suizo - Emparejamientos seg├║n rendimiento', 'trofeo_suizo', '2025-11-27 01:28:20.565202');


--
-- Data for Name: catalogo_transaccion_tipo; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.catalogo_transaccion_tipo VALUES ('b1771f58-66a7-462f-b002-99eacdfeb177', 'saldo', '2025-11-25 23:57:48.004155');
INSERT INTO public.catalogo_transaccion_tipo VALUES ('b33e9711-1965-4e91-bf68-63fee09c47d3', 'creditos', '2025-11-25 23:57:48.018372');
INSERT INTO public.catalogo_transaccion_tipo VALUES ('4ce7715c-33f6-4fc7-a2b8-cfd56cf6d1e5', 'premio', '2025-11-27 07:18:59.386998');
INSERT INTO public.catalogo_transaccion_tipo VALUES ('49111eaa-8beb-40f8-a672-3b8250315337', 'inscripcion', '2025-11-27 07:18:59.396994');


--
-- Data for Name: equipo; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: equipo_miembros; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: juego; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.juego VALUES ('4f78eb6b-01e8-4719-8218-c96475600430', 'Call of Duty: Warzone', 'Battle Royale gratuito de la franquicia Call of Duty', '2025-11-27 07:18:59.712058');
INSERT INTO public.juego VALUES ('af633f01-4a27-4c51-8a74-0a708f232906', 'Fortnite', 'Battle Royale con construcci├│n de Epic Games', '2025-11-27 07:18:59.797513');
INSERT INTO public.juego VALUES ('373704d0-3059-4d13-b45d-cba7a095d368', 'League of Legends', 'MOBA competitivo de Riot Games', '2025-11-27 07:18:59.876374');
INSERT INTO public.juego VALUES ('daa1652a-80c6-4fa6-9a47-4e646e6f1a05', 'Valorant', 'Shooter t├íctico 5v5 de Riot Games', '2025-11-27 07:18:59.938396');
INSERT INTO public.juego VALUES ('489aa276-9625-4a30-9791-b29dc246ef84', 'Apex Legends', 'Battle Royale de escuadrones de EA', '2025-11-27 07:19:00.084441');
INSERT INTO public.juego VALUES ('5632290c-f9f5-4962-b949-2be1daeefd92', 'Counter-Strike 2', 'Shooter t├íctico competitivo de Valve', '2025-11-27 07:19:00.174621');
INSERT INTO public.juego VALUES ('7c20dba4-503e-46f9-b71c-2887f341789d', 'Rocket League', 'F├║tbol con autos de Psyonix', '2025-11-27 07:19:00.260337');
INSERT INTO public.juego VALUES ('eadd29c6-4eba-49ba-8868-7c9fdbbd9b91', 'FIFA 24', 'Simulador de f├║tbol de EA Sports', '2025-11-27 07:19:00.335965');
INSERT INTO public.juego VALUES ('2692fb73-3ef7-4e69-8c4e-5a51f415430b', 'Super Smash Bros. Ultimate', 'Juego de peleas crossover de Nintendo', '2025-11-27 07:19:00.410621');
INSERT INTO public.juego VALUES ('60fa86ee-1e2d-428e-936f-df5e11d5cca2', 'Street Fighter 6', 'Juego de peleas de Capcom', '2025-11-27 07:19:00.470232');
INSERT INTO public.juego VALUES ('8cc58694-de42-43ee-86d6-a94256e952c2', 'Tekken 8', 'Juego de peleas 3D de Bandai Namco', '2025-11-27 07:19:00.561878');
INSERT INTO public.juego VALUES ('74b41840-46ca-4254-a8fb-8d1fa04617c6', 'Dota 2', 'MOBA competitivo de Valve', '2025-11-27 07:19:00.629403');
INSERT INTO public.juego VALUES ('8aa1af20-3bf0-4819-9a18-e99b30687dfc', 'Overwatch 2', 'Hero shooter de Blizzard', '2025-11-27 07:19:00.67549');
INSERT INTO public.juego VALUES ('873672c1-a46f-4d8c-81a8-b7b8771fb488', 'PUBG: Battlegrounds', 'Battle Royale original de KRAFTON', '2025-11-27 07:19:00.734073');
INSERT INTO public.juego VALUES ('75ed7459-7672-4e77-a108-fe8cbaac89fc', 'Rainbow Six Siege', 'Shooter t├íctico de Ubisoft', '2025-11-27 07:19:00.781083');


--
-- Data for Name: juego_plataformas; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.juego_plataformas VALUES ('4f78eb6b-01e8-4719-8218-c96475600430', '5117d560-ce1c-4cda-bfcc-8f06ef7bf383');
INSERT INTO public.juego_plataformas VALUES ('4f78eb6b-01e8-4719-8218-c96475600430', 'd2bf5a42-507f-44d6-8341-0917a4e378db');
INSERT INTO public.juego_plataformas VALUES ('4f78eb6b-01e8-4719-8218-c96475600430', '3f5d6022-ae5c-4b6d-9653-3561df2fe1d7');
INSERT INTO public.juego_plataformas VALUES ('4f78eb6b-01e8-4719-8218-c96475600430', '25443b72-fb2d-4a7d-ab53-560210b9c0d9');
INSERT INTO public.juego_plataformas VALUES ('4f78eb6b-01e8-4719-8218-c96475600430', 'b573c143-c30e-4e65-b7e0-82046e915927');
INSERT INTO public.juego_plataformas VALUES ('af633f01-4a27-4c51-8a74-0a708f232906', '5117d560-ce1c-4cda-bfcc-8f06ef7bf383');
INSERT INTO public.juego_plataformas VALUES ('af633f01-4a27-4c51-8a74-0a708f232906', 'd2bf5a42-507f-44d6-8341-0917a4e378db');
INSERT INTO public.juego_plataformas VALUES ('af633f01-4a27-4c51-8a74-0a708f232906', '3f5d6022-ae5c-4b6d-9653-3561df2fe1d7');
INSERT INTO public.juego_plataformas VALUES ('af633f01-4a27-4c51-8a74-0a708f232906', '25443b72-fb2d-4a7d-ab53-560210b9c0d9');
INSERT INTO public.juego_plataformas VALUES ('af633f01-4a27-4c51-8a74-0a708f232906', 'b573c143-c30e-4e65-b7e0-82046e915927');
INSERT INTO public.juego_plataformas VALUES ('af633f01-4a27-4c51-8a74-0a708f232906', '311cf287-44b8-4f19-b175-8efcec8eae1b');
INSERT INTO public.juego_plataformas VALUES ('af633f01-4a27-4c51-8a74-0a708f232906', '67853df9-0910-4de9-802c-19bbd897fba7');
INSERT INTO public.juego_plataformas VALUES ('373704d0-3059-4d13-b45d-cba7a095d368', '5117d560-ce1c-4cda-bfcc-8f06ef7bf383');
INSERT INTO public.juego_plataformas VALUES ('daa1652a-80c6-4fa6-9a47-4e646e6f1a05', '5117d560-ce1c-4cda-bfcc-8f06ef7bf383');
INSERT INTO public.juego_plataformas VALUES ('489aa276-9625-4a30-9791-b29dc246ef84', '5117d560-ce1c-4cda-bfcc-8f06ef7bf383');
INSERT INTO public.juego_plataformas VALUES ('489aa276-9625-4a30-9791-b29dc246ef84', 'd2bf5a42-507f-44d6-8341-0917a4e378db');
INSERT INTO public.juego_plataformas VALUES ('489aa276-9625-4a30-9791-b29dc246ef84', '3f5d6022-ae5c-4b6d-9653-3561df2fe1d7');
INSERT INTO public.juego_plataformas VALUES ('489aa276-9625-4a30-9791-b29dc246ef84', '25443b72-fb2d-4a7d-ab53-560210b9c0d9');
INSERT INTO public.juego_plataformas VALUES ('489aa276-9625-4a30-9791-b29dc246ef84', 'b573c143-c30e-4e65-b7e0-82046e915927');
INSERT INTO public.juego_plataformas VALUES ('489aa276-9625-4a30-9791-b29dc246ef84', '311cf287-44b8-4f19-b175-8efcec8eae1b');
INSERT INTO public.juego_plataformas VALUES ('5632290c-f9f5-4962-b949-2be1daeefd92', '5117d560-ce1c-4cda-bfcc-8f06ef7bf383');
INSERT INTO public.juego_plataformas VALUES ('5632290c-f9f5-4962-b949-2be1daeefd92', '5e729706-a351-4fdd-92e0-5387b5d7eaca');
INSERT INTO public.juego_plataformas VALUES ('7c20dba4-503e-46f9-b71c-2887f341789d', '5117d560-ce1c-4cda-bfcc-8f06ef7bf383');
INSERT INTO public.juego_plataformas VALUES ('7c20dba4-503e-46f9-b71c-2887f341789d', 'd2bf5a42-507f-44d6-8341-0917a4e378db');
INSERT INTO public.juego_plataformas VALUES ('7c20dba4-503e-46f9-b71c-2887f341789d', '3f5d6022-ae5c-4b6d-9653-3561df2fe1d7');
INSERT INTO public.juego_plataformas VALUES ('7c20dba4-503e-46f9-b71c-2887f341789d', '25443b72-fb2d-4a7d-ab53-560210b9c0d9');
INSERT INTO public.juego_plataformas VALUES ('7c20dba4-503e-46f9-b71c-2887f341789d', 'b573c143-c30e-4e65-b7e0-82046e915927');
INSERT INTO public.juego_plataformas VALUES ('7c20dba4-503e-46f9-b71c-2887f341789d', '311cf287-44b8-4f19-b175-8efcec8eae1b');
INSERT INTO public.juego_plataformas VALUES ('7c20dba4-503e-46f9-b71c-2887f341789d', '674abe75-28c6-4a44-b4eb-1af3252e7550');
INSERT INTO public.juego_plataformas VALUES ('eadd29c6-4eba-49ba-8868-7c9fdbbd9b91', '5117d560-ce1c-4cda-bfcc-8f06ef7bf383');
INSERT INTO public.juego_plataformas VALUES ('eadd29c6-4eba-49ba-8868-7c9fdbbd9b91', 'd2bf5a42-507f-44d6-8341-0917a4e378db');
INSERT INTO public.juego_plataformas VALUES ('eadd29c6-4eba-49ba-8868-7c9fdbbd9b91', '3f5d6022-ae5c-4b6d-9653-3561df2fe1d7');
INSERT INTO public.juego_plataformas VALUES ('eadd29c6-4eba-49ba-8868-7c9fdbbd9b91', '25443b72-fb2d-4a7d-ab53-560210b9c0d9');
INSERT INTO public.juego_plataformas VALUES ('eadd29c6-4eba-49ba-8868-7c9fdbbd9b91', 'b573c143-c30e-4e65-b7e0-82046e915927');
INSERT INTO public.juego_plataformas VALUES ('2692fb73-3ef7-4e69-8c4e-5a51f415430b', '311cf287-44b8-4f19-b175-8efcec8eae1b');
INSERT INTO public.juego_plataformas VALUES ('60fa86ee-1e2d-428e-936f-df5e11d5cca2', '5117d560-ce1c-4cda-bfcc-8f06ef7bf383');
INSERT INTO public.juego_plataformas VALUES ('60fa86ee-1e2d-428e-936f-df5e11d5cca2', 'd2bf5a42-507f-44d6-8341-0917a4e378db');
INSERT INTO public.juego_plataformas VALUES ('60fa86ee-1e2d-428e-936f-df5e11d5cca2', '3f5d6022-ae5c-4b6d-9653-3561df2fe1d7');
INSERT INTO public.juego_plataformas VALUES ('60fa86ee-1e2d-428e-936f-df5e11d5cca2', '25443b72-fb2d-4a7d-ab53-560210b9c0d9');
INSERT INTO public.juego_plataformas VALUES ('60fa86ee-1e2d-428e-936f-df5e11d5cca2', 'b573c143-c30e-4e65-b7e0-82046e915927');
INSERT INTO public.juego_plataformas VALUES ('60fa86ee-1e2d-428e-936f-df5e11d5cca2', '5e729706-a351-4fdd-92e0-5387b5d7eaca');
INSERT INTO public.juego_plataformas VALUES ('8cc58694-de42-43ee-86d6-a94256e952c2', '5117d560-ce1c-4cda-bfcc-8f06ef7bf383');
INSERT INTO public.juego_plataformas VALUES ('8cc58694-de42-43ee-86d6-a94256e952c2', 'd2bf5a42-507f-44d6-8341-0917a4e378db');
INSERT INTO public.juego_plataformas VALUES ('8cc58694-de42-43ee-86d6-a94256e952c2', '3f5d6022-ae5c-4b6d-9653-3561df2fe1d7');
INSERT INTO public.juego_plataformas VALUES ('8cc58694-de42-43ee-86d6-a94256e952c2', '25443b72-fb2d-4a7d-ab53-560210b9c0d9');
INSERT INTO public.juego_plataformas VALUES ('8cc58694-de42-43ee-86d6-a94256e952c2', 'b573c143-c30e-4e65-b7e0-82046e915927');
INSERT INTO public.juego_plataformas VALUES ('8cc58694-de42-43ee-86d6-a94256e952c2', '5e729706-a351-4fdd-92e0-5387b5d7eaca');
INSERT INTO public.juego_plataformas VALUES ('74b41840-46ca-4254-a8fb-8d1fa04617c6', '5117d560-ce1c-4cda-bfcc-8f06ef7bf383');
INSERT INTO public.juego_plataformas VALUES ('74b41840-46ca-4254-a8fb-8d1fa04617c6', '5e729706-a351-4fdd-92e0-5387b5d7eaca');
INSERT INTO public.juego_plataformas VALUES ('8aa1af20-3bf0-4819-9a18-e99b30687dfc', '5117d560-ce1c-4cda-bfcc-8f06ef7bf383');
INSERT INTO public.juego_plataformas VALUES ('8aa1af20-3bf0-4819-9a18-e99b30687dfc', 'd2bf5a42-507f-44d6-8341-0917a4e378db');
INSERT INTO public.juego_plataformas VALUES ('8aa1af20-3bf0-4819-9a18-e99b30687dfc', '3f5d6022-ae5c-4b6d-9653-3561df2fe1d7');
INSERT INTO public.juego_plataformas VALUES ('8aa1af20-3bf0-4819-9a18-e99b30687dfc', '25443b72-fb2d-4a7d-ab53-560210b9c0d9');
INSERT INTO public.juego_plataformas VALUES ('8aa1af20-3bf0-4819-9a18-e99b30687dfc', 'b573c143-c30e-4e65-b7e0-82046e915927');
INSERT INTO public.juego_plataformas VALUES ('8aa1af20-3bf0-4819-9a18-e99b30687dfc', '311cf287-44b8-4f19-b175-8efcec8eae1b');
INSERT INTO public.juego_plataformas VALUES ('8aa1af20-3bf0-4819-9a18-e99b30687dfc', 'abb308a9-ea6a-4bd8-b328-497a7d9a0b6a');
INSERT INTO public.juego_plataformas VALUES ('873672c1-a46f-4d8c-81a8-b7b8771fb488', '5117d560-ce1c-4cda-bfcc-8f06ef7bf383');
INSERT INTO public.juego_plataformas VALUES ('873672c1-a46f-4d8c-81a8-b7b8771fb488', 'd2bf5a42-507f-44d6-8341-0917a4e378db');
INSERT INTO public.juego_plataformas VALUES ('873672c1-a46f-4d8c-81a8-b7b8771fb488', '3f5d6022-ae5c-4b6d-9653-3561df2fe1d7');
INSERT INTO public.juego_plataformas VALUES ('873672c1-a46f-4d8c-81a8-b7b8771fb488', '25443b72-fb2d-4a7d-ab53-560210b9c0d9');
INSERT INTO public.juego_plataformas VALUES ('873672c1-a46f-4d8c-81a8-b7b8771fb488', 'b573c143-c30e-4e65-b7e0-82046e915927');
INSERT INTO public.juego_plataformas VALUES ('873672c1-a46f-4d8c-81a8-b7b8771fb488', '67853df9-0910-4de9-802c-19bbd897fba7');
INSERT INTO public.juego_plataformas VALUES ('873672c1-a46f-4d8c-81a8-b7b8771fb488', '5e729706-a351-4fdd-92e0-5387b5d7eaca');
INSERT INTO public.juego_plataformas VALUES ('75ed7459-7672-4e77-a108-fe8cbaac89fc', '5117d560-ce1c-4cda-bfcc-8f06ef7bf383');
INSERT INTO public.juego_plataformas VALUES ('75ed7459-7672-4e77-a108-fe8cbaac89fc', 'd2bf5a42-507f-44d6-8341-0917a4e378db');
INSERT INTO public.juego_plataformas VALUES ('75ed7459-7672-4e77-a108-fe8cbaac89fc', '3f5d6022-ae5c-4b6d-9653-3561df2fe1d7');
INSERT INTO public.juego_plataformas VALUES ('75ed7459-7672-4e77-a108-fe8cbaac89fc', '25443b72-fb2d-4a7d-ab53-560210b9c0d9');
INSERT INTO public.juego_plataformas VALUES ('75ed7459-7672-4e77-a108-fe8cbaac89fc', 'b573c143-c30e-4e65-b7e0-82046e915927');
INSERT INTO public.juego_plataformas VALUES ('75ed7459-7672-4e77-a108-fe8cbaac89fc', 'c35e6754-144e-41bb-8e67-724e1273329f');


--
-- Data for Name: logro; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: membresia_tipo; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.membresia_tipo VALUES ('4d4d92d7-5804-48f1-8bf4-4847b0256124', 'Gratuita', 0.00, 0, 'Acceso a competiciones gratuitas, Desaf├¡a a otros jugadores a apostar partidos, Desaf├¡a a otros jugadores a partidas de XP, Benef├¡ciese de premios con pago instant├íneo');
INSERT INTO public.membresia_tipo VALUES ('e826bf5a-b735-436d-85bc-885d4efa1555', 'Premium 1 Mes', 5.99, 30, 'Todo lo de la membres├¡a gratuita + Apuestas sin comisiones, Entrada gratuita a los torneos ELITE, Avatares premium, Personalizaci├│n de la p├ígina del equipo, Personalizaci├│n de la p├ígina de perfil');
INSERT INTO public.membresia_tipo VALUES ('c5e639f2-5089-4e0b-8c68-8a1c04706c54', 'Premium 3 Meses', 12.99, 90, 'Todo lo de Premium + Ahorra un 28%');
INSERT INTO public.membresia_tipo VALUES ('9b30c23d-0f85-403f-b8a8-c5bb1820c9b3', 'Premium 6 Meses', 24.99, 180, 'Todo lo de Premium + Ahorra un 30%');
INSERT INTO public.membresia_tipo VALUES ('7690c66d-010f-41cf-81bc-2d50518ecf55', 'Premium 12 Meses', 49.99, 365, 'Todo lo de Premium + Ahorra un 30%');


--
-- Data for Name: modo_juego; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.modo_juego VALUES ('b25370bf-2f87-4be6-ad93-73e43721dd61', 'Battle Royale Solo', '├Ültimo jugador en pie', '4f78eb6b-01e8-4719-8218-c96475600430');
INSERT INTO public.modo_juego VALUES ('e9e4a24f-e797-4cc5-a59f-e202c37e4b8a', 'Battle Royale D├║os', 'Equipos de 2 jugadores', '4f78eb6b-01e8-4719-8218-c96475600430');
INSERT INTO public.modo_juego VALUES ('5cbc8f67-ec9a-4c15-80fc-240526bd695d', 'Battle Royale Tr├¡os', 'Equipos de 3 jugadores', '4f78eb6b-01e8-4719-8218-c96475600430');
INSERT INTO public.modo_juego VALUES ('b597600a-3530-453b-b0cf-2ebb0949c368', 'Battle Royale Cuartetos', 'Equipos de 4 jugadores', '4f78eb6b-01e8-4719-8218-c96475600430');
INSERT INTO public.modo_juego VALUES ('2758f4cc-1c95-4965-9276-9b458cc15a59', 'Resurgimiento', 'Battle Royale con respawn', '4f78eb6b-01e8-4719-8218-c96475600430');
INSERT INTO public.modo_juego VALUES ('f183aa62-72e0-4f99-a9e7-a9bfbccd0c42', 'Solo', 'Battle Royale individual', 'af633f01-4a27-4c51-8a74-0a708f232906');
INSERT INTO public.modo_juego VALUES ('4ab38f84-533c-456c-ac86-e253cbe5ed9c', 'D├║os', 'Equipos de 2', 'af633f01-4a27-4c51-8a74-0a708f232906');
INSERT INTO public.modo_juego VALUES ('e66e5eeb-5b05-42bb-9816-c5273dab1983', 'Tr├¡os', 'Equipos de 3', 'af633f01-4a27-4c51-8a74-0a708f232906');
INSERT INTO public.modo_juego VALUES ('b3270ab5-a7d1-4a7a-9b75-06dd147f19c0', 'Escuadrones', 'Equipos de 4', 'af633f01-4a27-4c51-8a74-0a708f232906');
INSERT INTO public.modo_juego VALUES ('ab12897c-50bc-49e2-8345-55ba2a4ed279', 'Zero Build Solo', 'Sin construcci├│n individual', 'af633f01-4a27-4c51-8a74-0a708f232906');
INSERT INTO public.modo_juego VALUES ('3e6c736f-a686-467e-a324-ed71cd850777', 'Zero Build Escuadrones', 'Sin construcci├│n equipos', 'af633f01-4a27-4c51-8a74-0a708f232906');
INSERT INTO public.modo_juego VALUES ('8f926a24-cf94-47ff-8dd4-9ea73d103930', 'Grieta del Invocador 5v5', 'Modo competitivo est├índar', '373704d0-3059-4d13-b45d-cba7a095d368');
INSERT INTO public.modo_juego VALUES ('4e289824-4584-4cb9-aea4-1bbf5e9603d3', 'ARAM', 'All Random All Mid', '373704d0-3059-4d13-b45d-cba7a095d368');
INSERT INTO public.modo_juego VALUES ('b08bc292-cb8b-4516-9894-0ef5b7b16146', 'Clash', 'Torneos organizados', '373704d0-3059-4d13-b45d-cba7a095d368');
INSERT INTO public.modo_juego VALUES ('bd941fea-cc81-45b3-a2bd-8790115198b2', 'Competitivo', 'Modo rankeado 5v5', 'daa1652a-80c6-4fa6-9a47-4e646e6f1a05');
INSERT INTO public.modo_juego VALUES ('bc23a77d-02a4-4d13-9402-63c772f72460', 'Sin clasificar', 'Partidas casuales 5v5', 'daa1652a-80c6-4fa6-9a47-4e646e6f1a05');
INSERT INTO public.modo_juego VALUES ('3a8e76ab-ab8a-451f-9b99-db4fc1f2e38a', 'Spike Rush', 'Partidas r├ípidas', 'daa1652a-80c6-4fa6-9a47-4e646e6f1a05');
INSERT INTO public.modo_juego VALUES ('cee35ae4-697a-4a30-b589-9227e9bf6a26', 'Deathmatch', 'Todos contra todos', 'daa1652a-80c6-4fa6-9a47-4e646e6f1a05');
INSERT INTO public.modo_juego VALUES ('ec317a5e-74d8-4bec-85ee-b16659b11ff0', 'Battle Royale Tr├¡os', 'Escuadrones de 3', '489aa276-9625-4a30-9791-b29dc246ef84');
INSERT INTO public.modo_juego VALUES ('ed2aad07-354c-4fd6-af33-9c2825626e06', 'Battle Royale D├║os', 'Escuadrones de 2', '489aa276-9625-4a30-9791-b29dc246ef84');
INSERT INTO public.modo_juego VALUES ('e7cbca83-d162-49eb-b803-fdaee7a6a243', 'Arenas', 'Combate 3v3', '489aa276-9625-4a30-9791-b29dc246ef84');
INSERT INTO public.modo_juego VALUES ('4672aea7-e4a5-45fd-9edb-b33c9b3a4480', 'Control', 'Modo de control de puntos', '489aa276-9625-4a30-9791-b29dc246ef84');
INSERT INTO public.modo_juego VALUES ('bfa5d6ad-5e08-450f-8170-7a3aae15672d', 'Competitivo', 'Partidas rankeadas 5v5', '5632290c-f9f5-4962-b949-2be1daeefd92');
INSERT INTO public.modo_juego VALUES ('98860662-ce5b-448b-9dff-e8dfb50bd4d8', 'Premier', 'Modo competitivo premium', '5632290c-f9f5-4962-b949-2be1daeefd92');
INSERT INTO public.modo_juego VALUES ('110685b4-b192-4145-8211-62441055db06', 'Wingman', 'Partidas 2v2', '5632290c-f9f5-4962-b949-2be1daeefd92');
INSERT INTO public.modo_juego VALUES ('37b62ce3-eff6-4509-8732-47307c961d46', 'Casual', 'Partidas sin rango', '5632290c-f9f5-4962-b949-2be1daeefd92');
INSERT INTO public.modo_juego VALUES ('2accfb9a-b689-4f59-b25b-1ed703ea3c16', '1v1', 'Duelo individual', '7c20dba4-503e-46f9-b71c-2887f341789d');
INSERT INTO public.modo_juego VALUES ('d8cf5e72-e92b-441b-8a08-836f76fd8923', '2v2', 'D├║os', '7c20dba4-503e-46f9-b71c-2887f341789d');
INSERT INTO public.modo_juego VALUES ('ae426f05-efac-4bff-af58-97aefd3cbd71', '3v3', 'Est├índar', '7c20dba4-503e-46f9-b71c-2887f341789d');
INSERT INTO public.modo_juego VALUES ('d19eb690-c575-477a-a5aa-9b927a0cf392', 'Hoops', 'Basquetbol', '7c20dba4-503e-46f9-b71c-2887f341789d');
INSERT INTO public.modo_juego VALUES ('d81446e2-c78a-43bb-ae3d-02a978ac70e9', 'Rumble', 'Con power-ups', '7c20dba4-503e-46f9-b71c-2887f341789d');
INSERT INTO public.modo_juego VALUES ('2582a2e1-fe24-4920-9c14-eac5538edfec', 'Ultimate Team', 'Construye tu equipo', 'eadd29c6-4eba-49ba-8868-7c9fdbbd9b91');
INSERT INTO public.modo_juego VALUES ('34607c1b-c558-407e-ac96-3cd13cbd82f3', '1v1 Online', 'Partida individual', 'eadd29c6-4eba-49ba-8868-7c9fdbbd9b91');
INSERT INTO public.modo_juego VALUES ('3955aa64-23eb-4f0c-8e63-2e2df2cff655', 'Pro Clubs', 'Equipos de jugadores', 'eadd29c6-4eba-49ba-8868-7c9fdbbd9b91');
INSERT INTO public.modo_juego VALUES ('e22e4e7a-19ae-4dcc-8579-502e1bbc4fa1', 'Co-op Seasons', 'Cooperativo en l├¡nea', 'eadd29c6-4eba-49ba-8868-7c9fdbbd9b91');
INSERT INTO public.modo_juego VALUES ('7df45dfa-a843-4199-98e9-2d42740f6034', '1v1', 'Duelo individual', '2692fb73-3ef7-4e69-8c4e-5a51f415430b');
INSERT INTO public.modo_juego VALUES ('89d988de-b284-40d9-9a08-c82e056027fe', '2v2', 'Equipos', '2692fb73-3ef7-4e69-8c4e-5a51f415430b');
INSERT INTO public.modo_juego VALUES ('d06106a5-6e32-48ba-b3b0-1d1788b5ba29', 'Free For All', 'Todos contra todos', '2692fb73-3ef7-4e69-8c4e-5a51f415430b');
INSERT INTO public.modo_juego VALUES ('6bf09d7d-96e2-461a-b22e-df123e2d5962', 'Ranked Match', 'Partidas rankeadas 1v1', '60fa86ee-1e2d-428e-936f-df5e11d5cca2');
INSERT INTO public.modo_juego VALUES ('99b33c7c-dd95-4251-b3e7-406452558ff9', 'Casual Match', 'Partidas casuales', '60fa86ee-1e2d-428e-936f-df5e11d5cca2');
INSERT INTO public.modo_juego VALUES ('d93cc9be-4c35-4e7f-98a3-d8db60663fe2', 'Battle Hub', 'Lobby social', '60fa86ee-1e2d-428e-936f-df5e11d5cca2');
INSERT INTO public.modo_juego VALUES ('5249a024-7458-44b1-8abd-9f7cdc818cc4', 'Ranked Match', 'Partidas rankeadas 1v1', '8cc58694-de42-43ee-86d6-a94256e952c2');
INSERT INTO public.modo_juego VALUES ('8714fb25-867f-43cb-9c34-d3c38e901bc5', 'Quick Match', 'Partidas r├ípidas', '8cc58694-de42-43ee-86d6-a94256e952c2');
INSERT INTO public.modo_juego VALUES ('7130d23d-f5f1-45ad-bc1d-6933ab534dd6', 'Lobby Match', 'Salas personalizadas', '8cc58694-de42-43ee-86d6-a94256e952c2');
INSERT INTO public.modo_juego VALUES ('eb951d72-609d-47ec-9fce-17fe77d7ba32', 'All Pick', 'Modo est├índar 5v5', '74b41840-46ca-4254-a8fb-8d1fa04617c6');
INSERT INTO public.modo_juego VALUES ('c76bbd1c-2a6e-4311-a551-622262560a71', 'Captain Mode', 'Modo competitivo con draft', '74b41840-46ca-4254-a8fb-8d1fa04617c6');
INSERT INTO public.modo_juego VALUES ('b4725853-3fe0-4b03-a59a-20b92521f13f', 'Turbo', 'Partidas r├ípidas', '74b41840-46ca-4254-a8fb-8d1fa04617c6');
INSERT INTO public.modo_juego VALUES ('20a3d302-1b0a-4319-82b0-893c86234a13', 'Competitivo', 'Partidas rankeadas 5v5', '8aa1af20-3bf0-4819-9a18-e99b30687dfc');
INSERT INTO public.modo_juego VALUES ('ece773d6-be68-48ea-9584-244afde91a50', 'Quick Play', 'Partidas r├ípidas', '8aa1af20-3bf0-4819-9a18-e99b30687dfc');
INSERT INTO public.modo_juego VALUES ('3d17ced1-20d6-431c-8ffc-25a5167e8753', 'Arcade', 'Modos especiales', '8aa1af20-3bf0-4819-9a18-e99b30687dfc');
INSERT INTO public.modo_juego VALUES ('9676c328-74fd-4d8b-84cc-ecca198bd6b3', 'Solo', 'Battle Royale individual', '873672c1-a46f-4d8c-81a8-b7b8771fb488');
INSERT INTO public.modo_juego VALUES ('3687cb34-c9d1-44dc-bd1c-5f104068df48', 'D├║o', 'Equipos de 2', '873672c1-a46f-4d8c-81a8-b7b8771fb488');
INSERT INTO public.modo_juego VALUES ('8a63274c-6741-4d31-9d4f-d068f6cf0fdc', 'Escuadr├│n', 'Equipos de 4', '873672c1-a46f-4d8c-81a8-b7b8771fb488');
INSERT INTO public.modo_juego VALUES ('eebb1821-4815-4c5c-b398-90d0752f7f71', 'Ranked', 'Partidas rankeadas 5v5', '75ed7459-7672-4e77-a108-fe8cbaac89fc');
INSERT INTO public.modo_juego VALUES ('5942a6a6-7c8d-445f-986c-433b3fb92623', 'Unranked', 'Sin rango 5v5', '75ed7459-7672-4e77-a108-fe8cbaac89fc');
INSERT INTO public.modo_juego VALUES ('30ed9c10-cb0c-4231-a8b7-1da126b3dc05', 'Quick Match', 'Partidas r├ípidas', '75ed7459-7672-4e77-a108-fe8cbaac89fc');


--
-- Data for Name: persona; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.persona VALUES ('fbb05f5d-2985-4d82-afc4-37f08a0a7842', 'Administrador', NULL, 'Sistema', NULL, 'admin@esports.com', '1990-01-01', 'America/Mexico_City', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'USD', '2025-11-25 23:57:49.530371', '2025-11-25 23:57:49.530371', '3279d807-35df-4a11-aaa2-85d6e235f612');
INSERT INTO public.persona VALUES ('1a8e7175-683a-4e0a-ae28-0479fd89b66f', 'Ana', NULL, 'Garc├¡a', NULL, 'ana.garcia@email.com', '1998-10-22', 'America/Mexico_City', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'USD', '2025-11-26 16:46:32.922019', '2025-11-26 16:46:32.922019', 'c66e4817-b70b-460d-8163-56f562ddb62d');
INSERT INTO public.persona VALUES ('a91fd4b5-a814-4a78-822f-ee957037061c', 'Juan', NULL, 'Valenz', NULL, 'fwydchickn3@gmail.com', '2005-10-03', 'America/New_York', 'fwydchickn3@paypal.com', '+50432511540', 'Barrio San Juan', 'La Paz', 'La Paz', '07001', 'Honduras', 'USD', '2025-11-26 16:51:22.788631', '2025-11-27 22:06:01.16219', '3279d807-35df-4a11-aaa2-85d6e235f612');
INSERT INTO public.persona VALUES ('da47d49a-2a81-423c-a628-48fc50cceb7c', 'Pepito', NULL, 'Perez', NULL, 'cliente3@gmail.com', '2005-11-17', 'UTC', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'USD', '2025-11-27 23:34:28.698498', '2025-11-27 23:35:54.27542', NULL);


--
-- Data for Name: tienda_item; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.tienda_item VALUES ('955860d2-8c8a-469a-8bfa-fae286886da4', '1 Cr├®dito', 'Paquete b├ísico de cr├®ditos', 1.00, 1, '{"destacado": false}', '128e858d-dea5-4eee-a6f6-dbcc0fdc3d58');
INSERT INTO public.tienda_item VALUES ('58a8052f-7642-4e97-b594-622e28886ccc', '3 Cr├®ditos', 'Paquete de 3 cr├®ditos', 2.25, 3, '{"destacado": false}', '128e858d-dea5-4eee-a6f6-dbcc0fdc3d58');
INSERT INTO public.tienda_item VALUES ('3b9bee41-bdb7-4386-ac1a-d25eebba3461', '5 Cr├®ditos', 'Paquete de 5 cr├®ditos', 3.75, 5, '{"destacado": false}', '128e858d-dea5-4eee-a6f6-dbcc0fdc3d58');
INSERT INTO public.tienda_item VALUES ('85d6692e-6038-469f-b8bd-857a5ebc471d', '7 Cr├®ditos', 'Paquete de 7 cr├®ditos', 5.00, 7, '{"destacado": true}', '128e858d-dea5-4eee-a6f6-dbcc0fdc3d58');
INSERT INTO public.tienda_item VALUES ('679f43b2-b5b9-4a1c-a5fc-d58cac788ae6', '10 Cr├®ditos', 'Paquete de 10 cr├®ditos', 7.50, 10, '{"destacado": false}', '128e858d-dea5-4eee-a6f6-dbcc0fdc3d58');
INSERT INTO public.tienda_item VALUES ('862e4d82-ab7b-457b-a816-8d1ed6171d34', '15 Cr├®ditos', 'Paquete de 15 cr├®ditos - Mejor valor', 10.00, 15, '{"destacado": true, "mejorValor": true}', '128e858d-dea5-4eee-a6f6-dbcc0fdc3d58');
INSERT INTO public.tienda_item VALUES ('4f7c27e7-784f-407b-b77a-7df4a96f0ae8', 'Cambio de Nickname', 'Cambia tu nombre de usuario ├║nico', 3.99, NULL, '{"servicioTipo": "cambio_nickname"}', '9dd97afe-ac48-40e3-91ef-c13e076f9094');
INSERT INTO public.tienda_item VALUES ('f1feea2d-2879-4e52-8b08-ea34d0d7657b', 'Reiniciar R├®cord de Juego', 'Reinicia tu historial completo de partidas', 5.99, NULL, '{"advertencia": "Acci├│n irreversible", "servicioTipo": "reset_record"}', '9dd97afe-ac48-40e3-91ef-c13e076f9094');
INSERT INTO public.tienda_item VALUES ('f7b51822-4c9f-4afb-9335-75ef1d83e8ef', 'Reiniciar Estad├¡sticas', 'Reinicia tus estad├¡sticas de juego', 3.99, NULL, '{"advertencia": "Acci├│n irreversible", "servicioTipo": "reset_stats"}', '9dd97afe-ac48-40e3-91ef-c13e076f9094');
INSERT INTO public.tienda_item VALUES ('44c1c2a8-a574-4694-911a-17257378b09b', 'Premium 1 Mes', 'Todo lo de la membres├¡a gratuita + Apuestas sin comisiones, Entrada gratuita a los torneos ELITE, Avatares premium, Personalizaci├│n de la p├ígina del equipo, Personalizaci├│n de la p├ígina de perfil', 5.99, NULL, '{"duracionDias": 30, "membresiaTipoId": "e826bf5a-b735-436d-85bc-885d4efa1555"}', '7d760119-aa95-4faa-b0c2-ae0b94efefe5');
INSERT INTO public.tienda_item VALUES ('171d9cd9-fccb-4ae7-ae17-e59bfbdd1a24', 'Premium 3 Meses', 'Todo lo de Premium + Ahorra un 28%', 12.99, NULL, '{"duracionDias": 90, "membresiaTipoId": "c5e639f2-5089-4e0b-8c68-8a1c04706c54"}', '7d760119-aa95-4faa-b0c2-ae0b94efefe5');
INSERT INTO public.tienda_item VALUES ('fa1e9a20-056b-40af-a74d-639ac0a94792', 'Premium 6 Meses', 'Todo lo de Premium + Ahorra un 30%', 24.99, NULL, '{"duracionDias": 180, "membresiaTipoId": "9b30c23d-0f85-403f-b8a8-c5bb1820c9b3"}', '7d760119-aa95-4faa-b0c2-ae0b94efefe5');
INSERT INTO public.tienda_item VALUES ('3d58c57b-9fbc-4f91-afe6-389d9927f83a', 'Premium 12 Meses', 'Todo lo de Premium + Ahorra un 30%', 49.99, NULL, '{"duracionDias": 365, "membresiaTipoId": "7690c66d-010f-41cf-81bc-2d50518ecf55"}', '7d760119-aa95-4faa-b0c2-ae0b94efefe5');
INSERT INTO public.tienda_item VALUES ('6665e8b2-c840-4ae5-b0d8-77e7847a7730', 'Reclamar Nombre de Usuario', 'Reclama un nombre de usuario inactivo. Se contacta con soporte en directo para verificar disponibilidad.', 9.99, NULL, '{"servicioTipo": "reclamar_nickname", "requiereSoporte": true}', '9dd97afe-ac48-40e3-91ef-c13e076f9094');


--
-- Data for Name: tienda_orden; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.tienda_orden VALUES ('0155026d-6671-4e18-aa75-c180825e2873', '69724368-b02f-49f2-9a57-fd7db2928406', '58a8052f-7642-4e97-b594-622e28886ccc', NULL, NULL, NULL, NULL, 2.25, 'USD', 'pendiente', '{"item_tipo": "creditos", "item_nombre": "3 Cr├®ditos", "servicio_tipo": null}', '2025-11-27 16:35:40.094318', NULL, '2025-11-27 16:35:40.094318');
INSERT INTO public.tienda_orden VALUES ('8f6cc3a7-6068-4931-b48c-f68ca4f47ed7', '69724368-b02f-49f2-9a57-fd7db2928406', '58a8052f-7642-4e97-b594-622e28886ccc', 'SALDO_INTERNO', NULL, NULL, NULL, 2.25, 'USD', 'completado', '{"item_tipo": "creditos", "item_nombre": "3 Cr├®ditos", "metodo_pago": "saldo", "servicio_tipo": null}', '2025-11-27 16:40:12.518627', '2025-11-27 16:40:12.518627', '2025-11-27 16:40:12.518627');
INSERT INTO public.tienda_orden VALUES ('eae523e3-b630-47f5-8c98-2febad7fadda', '69724368-b02f-49f2-9a57-fd7db2928406', '44c1c2a8-a574-4694-911a-17257378b09b', 'SALDO_INTERNO', NULL, NULL, NULL, 5.99, 'USD', 'completado', '{"item_tipo": "membresia", "item_nombre": "Premium 1 Mes", "metodo_pago": "saldo", "servicio_tipo": null}', '2025-11-27 16:40:32.590962', '2025-11-27 16:40:32.590962', '2025-11-27 16:40:32.590962');
INSERT INTO public.tienda_orden VALUES ('47224581-a73e-4d13-9681-d4c0b779e12d', '69724368-b02f-49f2-9a57-fd7db2928406', '4f7c27e7-784f-407b-b77a-7df4a96f0ae8', 'SALDO_INTERNO', NULL, NULL, NULL, 3.99, 'USD', 'completado', '{"item_tipo": "servicio", "item_nombre": "Cambio de Nickname", "metodo_pago": "saldo", "servicio_tipo": "cambio_nickname", "nuevo_nickname": "adminn", "nickname_anterior": "admin"}', '2025-11-27 16:40:59.048849', '2025-11-27 16:40:59.048849', '2025-11-27 16:40:59.048849');
INSERT INTO public.tienda_orden VALUES ('ebb622e3-74e7-4a06-af01-d431de8bab4c', '69724368-b02f-49f2-9a57-fd7db2928406', '3b9bee41-bdb7-4386-ac1a-d25eebba3461', 'SALDO_INTERNO', NULL, NULL, NULL, 3.75, 'USD', 'completado', '{"item_tipo": "creditos", "item_nombre": "5 Cr├®ditos", "metodo_pago": "saldo", "servicio_tipo": null}', '2025-11-27 16:42:39.171323', '2025-11-27 16:42:39.171323', '2025-11-27 16:42:39.171323');
INSERT INTO public.tienda_orden VALUES ('73746f85-5db1-4b2e-bc11-c240412784be', '69724368-b02f-49f2-9a57-fd7db2928406', '58a8052f-7642-4e97-b594-622e28886ccc', NULL, NULL, NULL, NULL, 2.25, 'USD', 'pendiente', '{"item_tipo": "creditos", "item_nombre": "3 Cr├®ditos", "servicio_tipo": null}', '2025-11-27 16:44:10.050678', NULL, '2025-11-27 16:44:10.050678');
INSERT INTO public.tienda_orden VALUES ('b0d3cef1-34dc-45d6-901f-f6978ad8b9d6', '69724368-b02f-49f2-9a57-fd7db2928406', '955860d2-8c8a-469a-8bfa-fae286886da4', NULL, NULL, NULL, NULL, 1.00, 'USD', 'pendiente', '{"item_tipo": "creditos", "item_nombre": "1 Cr├®dito", "servicio_tipo": null}', '2025-11-27 16:57:40.110745', NULL, '2025-11-27 16:57:40.110745');
INSERT INTO public.tienda_orden VALUES ('3b50b6ef-3cda-4877-9e16-227c0bfda0a2', '69724368-b02f-49f2-9a57-fd7db2928406', '955860d2-8c8a-469a-8bfa-fae286886da4', NULL, NULL, NULL, NULL, 1.00, 'USD', 'pendiente', '{"item_tipo": "creditos", "item_nombre": "1 Cr├®dito", "servicio_tipo": null}', '2025-11-27 16:57:50.428239', NULL, '2025-11-27 16:57:50.428239');
INSERT INTO public.tienda_orden VALUES ('1bf31a77-29c8-4712-a2bb-a599d43ad221', '69724368-b02f-49f2-9a57-fd7db2928406', '955860d2-8c8a-469a-8bfa-fae286886da4', NULL, NULL, NULL, NULL, 1.00, 'USD', 'pendiente', '{"item_tipo": "creditos", "item_nombre": "1 Cr├®dito", "servicio_tipo": null}', '2025-11-27 16:57:52.001182', NULL, '2025-11-27 16:57:52.001182');
INSERT INTO public.tienda_orden VALUES ('bf499a52-b29d-45d7-b116-0b28746067bd', '69724368-b02f-49f2-9a57-fd7db2928406', '58a8052f-7642-4e97-b594-622e28886ccc', NULL, NULL, NULL, NULL, 2.25, 'USD', 'pendiente', '{"item_tipo": "creditos", "item_nombre": "3 Cr├®ditos", "servicio_tipo": null}', '2025-11-27 16:57:54.858818', NULL, '2025-11-27 16:57:54.858818');
INSERT INTO public.tienda_orden VALUES ('127e3a80-0378-434b-8147-fb995c9653ea', '69724368-b02f-49f2-9a57-fd7db2928406', '955860d2-8c8a-469a-8bfa-fae286886da4', '7TB506650W128163W', NULL, NULL, NULL, 1.00, 'USD', 'pendiente', '{"item_tipo": "creditos", "item_nombre": "1 Cr├®dito", "servicio_tipo": null}', '2025-11-27 17:00:13.452346', NULL, '2025-11-27 17:00:14.681173');
INSERT INTO public.tienda_orden VALUES ('3de5c25e-1f1f-478f-82c6-3f4f726cf926', '69724368-b02f-49f2-9a57-fd7db2928406', '679f43b2-b5b9-4a1c-a5fc-d58cac788ae6', '80X74079US256133L', '37017933KN277924N', 'UFFRKL9NXJVLC', 'sb-skxio34023838@personal.example.com', 7.50, 'USD', 'completado', '{"item_tipo": "creditos", "item_nombre": "10 Cr├®ditos", "servicio_tipo": null}', '2025-11-27 17:06:02.002006', '2025-11-27 17:07:04.057141', '2025-11-27 17:07:04.057141');
INSERT INTO public.tienda_orden VALUES ('71e30a75-feeb-4621-866e-8a357eca976b', '4ec13596-0bbb-40e6-9246-c7e8183e493b', '3d58c57b-9fbc-4f91-afe6-389d9927f83a', 'SALDO_INTERNO', NULL, NULL, NULL, 49.99, 'USD', 'completado', '{"item_tipo": "membresia", "item_nombre": "Premium 12 Meses", "metodo_pago": "saldo", "servicio_tipo": null}', '2025-11-27 19:38:41.428138', '2025-11-27 19:38:41.428138', '2025-11-27 19:38:41.428138');
INSERT INTO public.tienda_orden VALUES ('d5363af5-753f-42dd-adc1-eec16a98615b', '69724368-b02f-49f2-9a57-fd7db2928406', '862e4d82-ab7b-457b-a816-8d1ed6171d34', '4V940318M0874235Y', '2K089184XU9198830', 'UFFRKL9NXJVLC', 'sb-skxio34023838@personal.example.com', 10.00, 'USD', 'completado', '{"item_tipo": "creditos", "item_nombre": "15 Cr├®ditos", "servicio_tipo": null}', '2025-11-27 17:08:27.558395', '2025-11-27 17:09:05.829254', '2025-11-27 17:09:05.829254');
INSERT INTO public.tienda_orden VALUES ('1d46b6a2-bc77-4c76-b92d-ee84e2915a34', '69724368-b02f-49f2-9a57-fd7db2928406', '4f7c27e7-784f-407b-b77a-7df4a96f0ae8', '44L486912B6577349', '3BC378919C419021E', 'UFFRKL9NXJVLC', 'sb-skxio34023838@personal.example.com', 3.99, 'USD', 'completado', '{"item_tipo": "servicio", "item_nombre": "Cambio de Nickname", "servicio_tipo": "cambio_nickname", "nuevo_nickname": "admin", "nickname_anterior": "adminn"}', '2025-11-27 17:12:41.465097', '2025-11-27 17:12:54.608773', '2025-11-27 17:12:54.608773');
INSERT INTO public.tienda_orden VALUES ('857f7fa1-c160-4854-a788-f64e87b8d51f', '69724368-b02f-49f2-9a57-fd7db2928406', '4f7c27e7-784f-407b-b77a-7df4a96f0ae8', 'SALDO_INTERNO', NULL, NULL, NULL, 3.99, 'USD', 'completado', '{"item_tipo": "servicio", "item_nombre": "Cambio de Nickname", "metodo_pago": "saldo", "servicio_tipo": "cambio_nickname", "nuevo_nickname": "fwydchicknnnn", "nickname_anterior": "admin"}', '2025-11-27 17:18:51.806584', '2025-11-27 17:18:51.806584', '2025-11-27 17:18:51.806584');
INSERT INTO public.tienda_orden VALUES ('00a6db78-49fb-4f2f-b0e1-ec8fe4d553ca', '69724368-b02f-49f2-9a57-fd7db2928406', '4f7c27e7-784f-407b-b77a-7df4a96f0ae8', 'SALDO_INTERNO', NULL, NULL, NULL, 3.99, 'USD', 'completado', '{"item_tipo": "servicio", "item_nombre": "Cambio de Nickname", "metodo_pago": "saldo", "servicio_tipo": "cambio_nickname", "nuevo_nickname": "admin", "nickname_anterior": "fwydchicknnnn"}', '2025-11-27 17:19:58.119425', '2025-11-27 17:19:58.119425', '2025-11-27 17:19:58.119425');
INSERT INTO public.tienda_orden VALUES ('a7afe931-647b-4d9e-9551-a97e5e670103', '4ec13596-0bbb-40e6-9246-c7e8183e493b', '862e4d82-ab7b-457b-a816-8d1ed6171d34', 'SALDO_INTERNO', NULL, NULL, NULL, 10.00, 'USD', 'completado', '{"item_tipo": "creditos", "item_nombre": "15 Cr├®ditos", "metodo_pago": "saldo", "servicio_tipo": null}', '2025-11-27 22:11:05.194826', '2025-11-27 22:11:05.194826', '2025-11-27 22:11:05.194826');
INSERT INTO public.tienda_orden VALUES ('39fa0e3f-2fc3-4d2e-8883-43471c0c13b6', '69724368-b02f-49f2-9a57-fd7db2928406', '679f43b2-b5b9-4a1c-a5fc-d58cac788ae6', '7WB42406JW185643N', NULL, NULL, NULL, 7.50, 'USD', 'pendiente', '{"item_tipo": "creditos", "item_nombre": "10 Cr├®ditos", "servicio_tipo": null}', '2025-11-28 21:55:47.950399', NULL, '2025-11-28 21:55:49.591905');
INSERT INTO public.tienda_orden VALUES ('2dd06251-b42d-474c-895a-3e530f5b1f46', '4ec13596-0bbb-40e6-9246-c7e8183e493b', '4f7c27e7-784f-407b-b77a-7df4a96f0ae8', '538827352M031281Y', '9XV1326148856780H', 'UFFRKL9NXJVLC', 'sb-skxio34023838@personal.example.com', 3.99, 'USD', 'completado', '{"item_tipo": "servicio", "item_nombre": "Cambio de Nickname", "servicio_tipo": "cambio_nickname", "nuevo_nickname": "fwyd", "nickname_anterior": "fwydchickn"}', '2025-11-27 22:16:01.969293', '2025-11-27 22:17:54.92828', '2025-11-27 22:17:54.92828');
INSERT INTO public.tienda_orden VALUES ('fd0ef3a8-13be-47c0-bd52-f458581bdafa', '69724368-b02f-49f2-9a57-fd7db2928406', '3b9bee41-bdb7-4386-ac1a-d25eebba3461', '3CD25835N5660304B', '73009819CE612494P', 'UFFRKL9NXJVLC', 'sb-skxio34023838@personal.example.com', 3.75, 'USD', 'completado', '{"item_tipo": "creditos", "item_nombre": "5 Cr├®ditos", "servicio_tipo": null}', '2025-11-28 22:05:24.14482', '2025-11-28 22:05:33.482911', '2025-11-28 22:05:33.482911');


--
-- Data for Name: tienda_solicitud_soporte; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: torneo; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.torneo VALUES ('e09386b8-6e11-4c4c-a215-e631b4b59199', 'Campeonato Counter', 'dewqfewfeffewfew wsefewf wfwfef', '2025-11-28 07:39:00', '2025-12-04 07:39:00', '2025-12-06 07:39:00', 'eliminacion_simple', 3, '5v5', false, NULL, true, false, false, 16, '4ec13596-0bbb-40e6-9246-c7e8183e493b', '5632290c-f9f5-4962-b949-2be1daeefd92', '5117d560-ce1c-4cda-bfcc-8f06ef7bf383', 'bfa5d6ad-5e08-450f-8170-7a3aae15672d', '996b1e7a-56e5-4a4a-9327-bb9a81764341', 'f1b75e2b-c06d-4779-8f23-ea8f390cad74', 'fc0009f0-3389-4e84-87b6-d321dd1ea0ab', '93cec056-d268-4436-bd24-ea2237ad16c5', NULL, NULL, 'fwydchickn3@gmail.com', NULL, '2025-11-27 07:41:24.472849', '2025-11-27 21:15:56.882548');


--
-- Data for Name: torneo_inscripcion; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: torneo_premios; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.torneo_premios VALUES ('816fa354-2f3d-4fa6-8bb8-6753d0f9bc7f', 5, 0.00, 0.00, 10.00, 60.00, 40.00, 'e09386b8-6e11-4c4c-a215-e631b4b59199', 0.00);


--
-- Data for Name: torneo_redes; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.torneo_redes VALUES ('104d6c43-af51-4d48-abda-991307711fea', 'x', 'https://x.com/pepito', 'e09386b8-6e11-4c4c-a215-e631b4b59199');


--
-- Data for Name: torneo_resultados; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: transaccion; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.transaccion VALUES ('8fd09420-dc52-4afd-9a12-8eb94800a5b2', 2.25, 'Compra de 3 cr├®ditos', '2025-11-27 16:40:12.518627', '69724368-b02f-49f2-9a57-fd7db2928406', 'b33e9711-1965-4e91-bf68-63fee09c47d3', 'd725e5df-c148-4c90-9c96-1770141c2828');
INSERT INTO public.transaccion VALUES ('08411fe0-5e6c-4486-b23d-8ef9041f91dd', 5.99, 'Compra de membres├¡a: Premium 1 Mes', '2025-11-27 16:40:32.590962', '69724368-b02f-49f2-9a57-fd7db2928406', 'b1771f58-66a7-462f-b002-99eacdfeb177', 'd725e5df-c148-4c90-9c96-1770141c2828');
INSERT INTO public.transaccion VALUES ('da7fa43c-617c-40c4-b425-d12db5a4f777', 3.99, 'Compra de servicio: Cambio de Nickname', '2025-11-27 16:40:59.048849', '69724368-b02f-49f2-9a57-fd7db2928406', 'b1771f58-66a7-462f-b002-99eacdfeb177', 'd725e5df-c148-4c90-9c96-1770141c2828');
INSERT INTO public.transaccion VALUES ('9b6b7dac-3a49-4586-b774-0c34b67e7c8b', 3.75, 'Compra de 5 cr├®ditos', '2025-11-27 16:42:39.171323', '69724368-b02f-49f2-9a57-fd7db2928406', 'b33e9711-1965-4e91-bf68-63fee09c47d3', 'd725e5df-c148-4c90-9c96-1770141c2828');
INSERT INTO public.transaccion VALUES ('8727d318-7d33-4aaf-8b13-2cb541e043a6', 7.50, 'Compra de 10 cr├®ditos', '2025-11-27 17:07:04.057141', '69724368-b02f-49f2-9a57-fd7db2928406', 'b33e9711-1965-4e91-bf68-63fee09c47d3', 'd725e5df-c148-4c90-9c96-1770141c2828');
INSERT INTO public.transaccion VALUES ('336da020-f1e6-4023-86bb-272e40c549ba', 10.00, 'Compra de 15 cr├®ditos', '2025-11-27 17:09:05.829254', '69724368-b02f-49f2-9a57-fd7db2928406', 'b33e9711-1965-4e91-bf68-63fee09c47d3', 'd725e5df-c148-4c90-9c96-1770141c2828');
INSERT INTO public.transaccion VALUES ('752cd055-caa9-4cfb-9841-c0c4986e9e06', 3.99, 'Compra de servicio: Cambio de Nickname', '2025-11-27 17:12:54.608773', '69724368-b02f-49f2-9a57-fd7db2928406', 'b1771f58-66a7-462f-b002-99eacdfeb177', 'd725e5df-c148-4c90-9c96-1770141c2828');
INSERT INTO public.transaccion VALUES ('839a8cf3-1529-449a-9069-d8051f663fb0', 3.99, 'Compra de servicio: Cambio de Nickname', '2025-11-27 17:18:51.806584', '69724368-b02f-49f2-9a57-fd7db2928406', 'b1771f58-66a7-462f-b002-99eacdfeb177', 'd725e5df-c148-4c90-9c96-1770141c2828');
INSERT INTO public.transaccion VALUES ('0fb46fe3-176a-4549-9f8f-2a6ddbaf7082', 3.99, 'Compra de servicio: Cambio de Nickname', '2025-11-27 17:19:58.119425', '69724368-b02f-49f2-9a57-fd7db2928406', 'b1771f58-66a7-462f-b002-99eacdfeb177', 'd725e5df-c148-4c90-9c96-1770141c2828');
INSERT INTO public.transaccion VALUES ('aa87cddd-7acb-4eea-ba45-672637a03d98', 49.99, 'Compra de membres├¡a: Premium 12 Meses', '2025-11-27 19:38:41.428138', '4ec13596-0bbb-40e6-9246-c7e8183e493b', 'b1771f58-66a7-462f-b002-99eacdfeb177', 'd725e5df-c148-4c90-9c96-1770141c2828');
INSERT INTO public.transaccion VALUES ('c317cb81-e9e3-4ad9-b1e2-3542e7246b80', 10.00, 'Compra de 15 cr├®ditos', '2025-11-27 22:11:05.194826', '4ec13596-0bbb-40e6-9246-c7e8183e493b', 'b33e9711-1965-4e91-bf68-63fee09c47d3', 'd725e5df-c148-4c90-9c96-1770141c2828');
INSERT INTO public.transaccion VALUES ('dc98031e-41f7-4056-849e-02a8b4536257', 3.99, 'Compra de servicio: Cambio de Nickname', '2025-11-27 22:17:54.92828', '4ec13596-0bbb-40e6-9246-c7e8183e493b', 'b1771f58-66a7-462f-b002-99eacdfeb177', 'd725e5df-c148-4c90-9c96-1770141c2828');
INSERT INTO public.transaccion VALUES ('949cb948-c143-4b2a-aae0-57e4f2baf2b6', 3.75, 'Compra de 5 cr├®ditos', '2025-11-28 22:05:33.482911', '69724368-b02f-49f2-9a57-fd7db2928406', 'b33e9711-1965-4e91-bf68-63fee09c47d3', 'd725e5df-c148-4c90-9c96-1770141c2828');


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.usuario VALUES ('55f3f034-78d5-4e8b-9017-ee25f0b0bc23', 'anita', '$2b$10$XldUmoYBbpLCeabjUCkMBuOay5.Huv2ftuUlXkhjjJ8l1FticFZ0S', 'activo', NULL, 0, 0.00, 0, NULL, NULL, true, '2025-11-26 16:46:32.922019', '2025-11-26 16:46:32.922019', NULL, '1a8e7175-683a-4e0a-ae28-0479fd89b66f', '19de14e5-c5a1-4def-a42f-0298ab7f4818', '01ab3568-7eb5-43df-aa4d-e2eb8d527b81');
INSERT INTO public.usuario VALUES ('ecda66b0-4d8b-4c7c-9c37-7db99f5fa7f2', 'pepito', '$2b$10$qtUZF3DtGVQEgr/UCugn4Oe3Y0UQRE57vzlgpD8HcQ5OG0YnGyR4G', 'activo', NULL, 0, 0.00, 0, NULL, NULL, true, '2025-11-27 23:34:28.698498', '2025-11-27 23:35:54.27542', NULL, 'da47d49a-2a81-423c-a628-48fc50cceb7c', '19de14e5-c5a1-4def-a42f-0298ab7f4818', '95f67adc-b8e0-4e78-8812-b44f59b5162e');
INSERT INTO public.usuario VALUES ('4ec13596-0bbb-40e6-9246-c7e8183e493b', 'fwyd', '$2b$10$NnOwgZMY23dJE8FHu6ESDOphT1RlJ1OUl5wsdw3tVwXpAkhd/6GH6', 'activo', '2025-11-28 12:25:47.019', 20000, 1990.00, 15, NULL, NULL, true, '2025-11-26 16:51:22.788631', '2025-11-28 18:25:47.06049', NULL, 'a91fd4b5-a814-4a78-822f-ee957037061c', '19de14e5-c5a1-4def-a42f-0298ab7f4818', '1fdf8db0-b362-4fd3-8c5f-e7082bba33a9');
INSERT INTO public.usuario VALUES ('69724368-b02f-49f2-9a57-fd7db2928406', 'admin', '$2b$10$97.hKZgkeIq/bmsX47ipie42f2FgxJ9ImrKN6HcxF5mMc/xYpapse', 'activo', '2025-11-28 21:55:05.843', 0, 176.04, 1038, NULL, NULL, true, '2025-11-25 23:57:49.626775', '2025-11-28 22:05:33.482911', NULL, 'fbb05f5d-2985-4d82-afc4-37f08a0a7842', 'b1ca46a1-91f4-442b-9557-36be96b52eb9', '01ab3568-7eb5-43df-aa4d-e2eb8d527b81');


--
-- Data for Name: usuario_amigos; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.usuario_amigos VALUES ('ee337e23-7eaa-4b43-b3b5-55df83f2d5ec', '2025-11-26 18:38:44.606235', '69724368-b02f-49f2-9a57-fd7db2928406', '4ec13596-0bbb-40e6-9246-c7e8183e493b', '9c37e2bd-32c2-41a0-94a9-7aa6b8300891');


--
-- Data for Name: usuario_cuenta_juego; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.usuario_cuenta_juego VALUES ('86531ee6-d931-4f6d-aa72-b89125ef4f82', 'pepito12', '4ec13596-0bbb-40e6-9246-c7e8183e493b', 'abb308a9-ea6a-4bd8-b328-497a7d9a0b6a');


--
-- Data for Name: usuario_estadisticas_juego; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: usuario_logros; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: usuario_membresias; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.usuario_membresias VALUES ('18ad4803-0782-4d0f-ae85-11e4a84e40ab', '2025-11-27', '2025-12-27', true, '69724368-b02f-49f2-9a57-fd7db2928406', 'e826bf5a-b735-436d-85bc-885d4efa1555');
INSERT INTO public.usuario_membresias VALUES ('ff5aa53e-ad53-4d6c-9793-ad5b41641e94', '2025-11-27', '2026-11-27', true, '4ec13596-0bbb-40e6-9246-c7e8183e493b', '7690c66d-010f-41cf-81bc-2d50518ecf55');


--
-- Data for Name: usuario_red_social; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.usuario_red_social VALUES ('8a5ff92a-e6c3-4176-82f0-ca8227bc06e0', 'x', 'https://x.com/pepito', '4ec13596-0bbb-40e6-9246-c7e8183e493b');
INSERT INTO public.usuario_red_social VALUES ('d37b5112-a9ac-4799-8c3d-cefac269b883', 'twitch', 'https://twitch.tv/pepito-rey', '4ec13596-0bbb-40e6-9246-c7e8183e493b');


--
-- Data for Name: usuario_seguidores; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: usuario_trofeos; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Name: catalogo_genero PK_05a96ae5bf9e1eff3dcd19d764c; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_genero
    ADD CONSTRAINT "PK_05a96ae5bf9e1eff3dcd19d764c" PRIMARY KEY (id);


--
-- Name: persona PK_13aefc75f60510f2be4cd243d71; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT "PK_13aefc75f60510f2be4cd243d71" PRIMARY KEY (id);


--
-- Name: catalogo_tipo_entrada PK_1b857ed635f616c5ea5e7ca99f3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_tipo_entrada
    ADD CONSTRAINT "PK_1b857ed635f616c5ea5e7ca99f3" PRIMARY KEY (id);


--
-- Name: transaccion PK_1d7fb1e642fb44d52a2fce77fc6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transaccion
    ADD CONSTRAINT "PK_1d7fb1e642fb44d52a2fce77fc6" PRIMARY KEY (id);


--
-- Name: torneo_resultados PK_202662e0792ac782738a8a09be8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.torneo_resultados
    ADD CONSTRAINT "PK_202662e0792ac782738a8a09be8" PRIMARY KEY (id);


--
-- Name: usuario_red_social PK_24c7dd1d299ffefa1385ec93c7d; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_red_social
    ADD CONSTRAINT "PK_24c7dd1d299ffefa1385ec93c7d" PRIMARY KEY (id);


--
-- Name: catalogo_origen_transaccion PK_260aa8e778292484b569da3cfbe; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_origen_transaccion
    ADD CONSTRAINT "PK_260aa8e778292484b569da3cfbe" PRIMARY KEY (id);


--
-- Name: logro PK_2bc9042c13742f2ced9c8adb36e; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.logro
    ADD CONSTRAINT "PK_2bc9042c13742f2ced9c8adb36e" PRIMARY KEY (id);


--
-- Name: usuario_logros PK_32415c99be0edb1a3d5183e66a8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_logros
    ADD CONSTRAINT "PK_32415c99be0edb1a3d5183e66a8" PRIMARY KEY (id);


--
-- Name: modo_juego PK_3358b634202bc66a4b5e5e9f8ea; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.modo_juego
    ADD CONSTRAINT "PK_3358b634202bc66a4b5e5e9f8ea" PRIMARY KEY (id);


--
-- Name: usuario_amigos PK_40eab05adfd98664f9b767c86ee; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_amigos
    ADD CONSTRAINT "PK_40eab05adfd98664f9b767c86ee" PRIMARY KEY (id);


--
-- Name: catalogo_estado_inscripcion PK_556040c140cd0590336b1b1bc08; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_estado_inscripcion
    ADD CONSTRAINT "PK_556040c140cd0590336b1b1bc08" PRIMARY KEY (id);


--
-- Name: usuario_estadisticas_juego PK_5937df1f3f1c3e1beb252920e85; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_estadisticas_juego
    ADD CONSTRAINT "PK_5937df1f3f1c3e1beb252920e85" PRIMARY KEY (id);


--
-- Name: torneo PK_594cbe0a907eb32cb0ddfd63fea; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.torneo
    ADD CONSTRAINT "PK_594cbe0a907eb32cb0ddfd63fea" PRIMARY KEY (id);


--
-- Name: catalogo_estado_torneo PK_5e3012abb7954f1c0c985956152; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_estado_torneo
    ADD CONSTRAINT "PK_5e3012abb7954f1c0c985956152" PRIMARY KEY (id);


--
-- Name: catalogo_region PK_6ad72ee02b8478faf856012d201; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_region
    ADD CONSTRAINT "PK_6ad72ee02b8478faf856012d201" PRIMARY KEY (id);


--
-- Name: equipo_miembros PK_76e8796c6f175e922b2741a0636; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.equipo_miembros
    ADD CONSTRAINT "PK_76e8796c6f175e922b2741a0636" PRIMARY KEY (id);


--
-- Name: usuario_seguidores PK_78aa436f4b719f1f71d9edfed4e; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_seguidores
    ADD CONSTRAINT "PK_78aa436f4b719f1f71d9edfed4e" PRIMARY KEY (id);


--
-- Name: catalogo_estado_amistad PK_858035025304d0882010fc945b5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_estado_amistad
    ADD CONSTRAINT "PK_858035025304d0882010fc945b5" PRIMARY KEY (id);


--
-- Name: usuario_cuenta_juego PK_9d7b7179f3b92cd0e334024c072; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_cuenta_juego
    ADD CONSTRAINT "PK_9d7b7179f3b92cd0e334024c072" PRIMARY KEY (id);


--
-- Name: catalogo_avatar PK_9ef244ef990f41ff8dfa6eabecb; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_avatar
    ADD CONSTRAINT "PK_9ef244ef990f41ff8dfa6eabecb" PRIMARY KEY (id);


--
-- Name: equipo PK_a545d29b4870688c462189447da; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.equipo
    ADD CONSTRAINT "PK_a545d29b4870688c462189447da" PRIMARY KEY (id);


--
-- Name: usuario PK_a56c58e5cabaa04fb2c98d2d7e2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT "PK_a56c58e5cabaa04fb2c98d2d7e2" PRIMARY KEY (id);


--
-- Name: catalogo_plataforma PK_a8c5d7450dd32402c0be7890bc0; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_plataforma
    ADD CONSTRAINT "PK_a8c5d7450dd32402c0be7890bc0" PRIMARY KEY (id);


--
-- Name: catalogo_transaccion_tipo PK_c1b918568cdf4d5a35d51871be7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_transaccion_tipo
    ADD CONSTRAINT "PK_c1b918568cdf4d5a35d51871be7" PRIMARY KEY (id);


--
-- Name: torneo_inscripcion PK_c3a2f268a54c077e48af8433e39; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.torneo_inscripcion
    ADD CONSTRAINT "PK_c3a2f268a54c077e48af8433e39" PRIMARY KEY (id);


--
-- Name: usuario_membresias PK_c92891bbedc7f60b25b6559c2e6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_membresias
    ADD CONSTRAINT "PK_c92891bbedc7f60b25b6559c2e6" PRIMARY KEY (id);


--
-- Name: torneo_premios PK_d002e010d3343aca3faa87ddfcd; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.torneo_premios
    ADD CONSTRAINT "PK_d002e010d3343aca3faa87ddfcd" PRIMARY KEY (id);


--
-- Name: juego PK_d0ac2f7932d13ee8976f473fe6f; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.juego
    ADD CONSTRAINT "PK_d0ac2f7932d13ee8976f473fe6f" PRIMARY KEY (id);


--
-- Name: torneo_redes PK_d651da5cd7d1618d500bd62d86c; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.torneo_redes
    ADD CONSTRAINT "PK_d651da5cd7d1618d500bd62d86c" PRIMARY KEY (id);


--
-- Name: usuario_trofeos PK_db511af9ff13b69c34a539b56ee; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_trofeos
    ADD CONSTRAINT "PK_db511af9ff13b69c34a539b56ee" PRIMARY KEY (id);


--
-- Name: membresia_tipo PK_e2fb5f1f8558c80e491644449c0; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.membresia_tipo
    ADD CONSTRAINT "PK_e2fb5f1f8558c80e491644449c0" PRIMARY KEY (id);


--
-- Name: tienda_item PK_e494e2b265b44a3afb5a89ff7a8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tienda_item
    ADD CONSTRAINT "PK_e494e2b265b44a3afb5a89ff7a8" PRIMARY KEY (id);


--
-- Name: catalogo_tipo_item PK_ef95256a46bdcd84f679eca48a6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_tipo_item
    ADD CONSTRAINT "PK_ef95256a46bdcd84f679eca48a6" PRIMARY KEY (id);


--
-- Name: catalogo_rol PK_f2531d28876065bc434e061d8a6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_rol
    ADD CONSTRAINT "PK_f2531d28876065bc434e061d8a6" PRIMARY KEY (id);


--
-- Name: juego_plataformas PK_f5d5426c5be00c05916ad403c76; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.juego_plataformas
    ADD CONSTRAINT "PK_f5d5426c5be00c05916ad403c76" PRIMARY KEY ("juegoId", "catalogoPlataformaId");


--
-- Name: usuario REL_c9d223fa9cc0ea30abcd9d5ca7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT "REL_c9d223fa9cc0ea30abcd9d5ca7" UNIQUE (persona_id);


--
-- Name: catalogo_plataforma UQ_06e22b9038db0d083e5c3419109; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_plataforma
    ADD CONSTRAINT "UQ_06e22b9038db0d083e5c3419109" UNIQUE (valor);


--
-- Name: catalogo_origen_transaccion UQ_2b993c64a643967861394ebb134; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_origen_transaccion
    ADD CONSTRAINT "UQ_2b993c64a643967861394ebb134" UNIQUE (valor);


--
-- Name: catalogo_genero UQ_3263de178999924ffdbd8f12875; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_genero
    ADD CONSTRAINT "UQ_3263de178999924ffdbd8f12875" UNIQUE (valor);


--
-- Name: catalogo_transaccion_tipo UQ_3a1f069338c2920d6c8ea417065; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_transaccion_tipo
    ADD CONSTRAINT "UQ_3a1f069338c2920d6c8ea417065" UNIQUE (valor);


--
-- Name: juego UQ_3d91e82f1bf4655834de3cf96f2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.juego
    ADD CONSTRAINT "UQ_3d91e82f1bf4655834de3cf96f2" UNIQUE (nombre);


--
-- Name: catalogo_tipo_item UQ_3e00684b9a21a4d23134717c2bc; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_tipo_item
    ADD CONSTRAINT "UQ_3e00684b9a21a4d23134717c2bc" UNIQUE (valor);


--
-- Name: equipo UQ_40ad7bfc23ed6409460806f4d60; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.equipo
    ADD CONSTRAINT "UQ_40ad7bfc23ed6409460806f4d60" UNIQUE (nombre);


--
-- Name: catalogo_tipo_entrada UQ_41f3f4b005a54f45479e0b616f9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_tipo_entrada
    ADD CONSTRAINT "UQ_41f3f4b005a54f45479e0b616f9" UNIQUE (valor);


--
-- Name: usuario UQ_4413e686f29147c934abf16f890; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT "UQ_4413e686f29147c934abf16f890" UNIQUE (nickname);


--
-- Name: persona UQ_6150bc0608b585b62f23c4dfd86; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT "UQ_6150bc0608b585b62f23c4dfd86" UNIQUE (correo);


--
-- Name: catalogo_estado_inscripcion UQ_7b4445eeb23bf944fdaf228b0a8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_estado_inscripcion
    ADD CONSTRAINT "UQ_7b4445eeb23bf944fdaf228b0a8" UNIQUE (valor);


--
-- Name: catalogo_estado_amistad UQ_80da378eba9ccaa65db285b832a; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_estado_amistad
    ADD CONSTRAINT "UQ_80da378eba9ccaa65db285b832a" UNIQUE (valor);


--
-- Name: catalogo_region UQ_9834d49a2d2d45c6e7623bc0465; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_region
    ADD CONSTRAINT "UQ_9834d49a2d2d45c6e7623bc0465" UNIQUE (valor);


--
-- Name: torneo_premios UQ_a3031bbf1c334efdde6a07e5a46; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.torneo_premios
    ADD CONSTRAINT "UQ_a3031bbf1c334efdde6a07e5a46" UNIQUE (torneo_id);


--
-- Name: catalogo_avatar UQ_ba84635357d0e25fe07abde50ec; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_avatar
    ADD CONSTRAINT "UQ_ba84635357d0e25fe07abde50ec" UNIQUE (nombre);


--
-- Name: catalogo_rol UQ_cdb2efce115c76aa3555c6da120; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_rol
    ADD CONSTRAINT "UQ_cdb2efce115c76aa3555c6da120" UNIQUE (valor);


--
-- Name: catalogo_estado_torneo UQ_f3baf6357ba20547f359fd5b7e9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_estado_torneo
    ADD CONSTRAINT "UQ_f3baf6357ba20547f359fd5b7e9" UNIQUE (valor);


--
-- Name: catalogo_tipo_torneo catalogo_tipo_torneo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_tipo_torneo
    ADD CONSTRAINT catalogo_tipo_torneo_pkey PRIMARY KEY (id);


--
-- Name: catalogo_tipo_torneo catalogo_tipo_torneo_valor_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalogo_tipo_torneo
    ADD CONSTRAINT catalogo_tipo_torneo_valor_key UNIQUE (valor);


--
-- Name: tienda_orden tienda_orden_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tienda_orden
    ADD CONSTRAINT tienda_orden_pkey PRIMARY KEY (id);


--
-- Name: tienda_solicitud_soporte tienda_solicitud_soporte_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tienda_solicitud_soporte
    ADD CONSTRAINT tienda_solicitud_soporte_pkey PRIMARY KEY (id);


--
-- Name: IDX_111c045b6c533e2c1eefedac97; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_111c045b6c533e2c1eefedac97" ON public.tienda_orden USING btree (estado);


--
-- Name: IDX_12308297f402afa602fb36d0c7; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_12308297f402afa602fb36d0c7" ON public.tienda_orden USING btree (creado_en);


--
-- Name: IDX_4413e686f29147c934abf16f89; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_4413e686f29147c934abf16f89" ON public.usuario USING btree (nickname);


--
-- Name: IDX_5ffcbb53c52bd4f83e4caed517; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_5ffcbb53c52bd4f83e4caed517" ON public.tienda_orden USING btree (paypal_order_id);


--
-- Name: IDX_6150bc0608b585b62f23c4dfd8; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_6150bc0608b585b62f23c4dfd8" ON public.persona USING btree (correo);


--
-- Name: IDX_64c7f2fa2b09757569c8addb23; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_64c7f2fa2b09757569c8addb23" ON public.tienda_solicitud_soporte USING btree (usuario_id);


--
-- Name: IDX_8f060be27f0622cfa62caba067; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_8f060be27f0622cfa62caba067" ON public.juego_plataformas USING btree ("juegoId");


--
-- Name: IDX_9770e3bc9af3bd32e4821c840d; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_9770e3bc9af3bd32e4821c840d" ON public.juego_plataformas USING btree ("catalogoPlataformaId");


--
-- Name: IDX_d4c5b31c932eebd6e592ead6f1; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_d4c5b31c932eebd6e592ead6f1" ON public.tienda_solicitud_soporte USING btree (estado);


--
-- Name: torneo_inscripcion trg_actualizar_fondo_premios; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_fondo_premios AFTER INSERT OR UPDATE ON public.torneo_inscripcion FOR EACH ROW EXECUTE FUNCTION public.trigger_actualizar_fondo_premios();


--
-- Name: torneo_inscripcion FK_053143ab39cbdffa4e22190f651; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.torneo_inscripcion
    ADD CONSTRAINT "FK_053143ab39cbdffa4e22190f651" FOREIGN KEY (estado_id) REFERENCES public.catalogo_estado_inscripcion(id);


--
-- Name: torneo FK_0bd28f57e0d759273713724a527; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.torneo
    ADD CONSTRAINT "FK_0bd28f57e0d759273713724a527" FOREIGN KEY (region_id) REFERENCES public.catalogo_region(id);


--
-- Name: transaccion FK_0d8e48f71025813937ecb04140a; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transaccion
    ADD CONSTRAINT "FK_0d8e48f71025813937ecb04140a" FOREIGN KEY (origen_id) REFERENCES public.catalogo_origen_transaccion(id);


--
-- Name: usuario_trofeos FK_109db65088fd652d967df849a69; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_trofeos
    ADD CONSTRAINT "FK_109db65088fd652d967df849a69" FOREIGN KEY (usuario_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: usuario_estadisticas_juego FK_132d72a04a8ca3a95550816c4ac; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_estadisticas_juego
    ADD CONSTRAINT "FK_132d72a04a8ca3a95550816c4ac" FOREIGN KEY (usuario_id) REFERENCES public.usuario(id);


--
-- Name: usuario_amigos FK_1f8d3d974f7dafaef0767ba9703; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_amigos
    ADD CONSTRAINT "FK_1f8d3d974f7dafaef0767ba9703" FOREIGN KEY (usuario2_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: torneo FK_29622e4539834ab1c746c2e9317; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.torneo
    ADD CONSTRAINT "FK_29622e4539834ab1c746c2e9317" FOREIGN KEY (estado_id) REFERENCES public.catalogo_estado_torneo(id);


--
-- Name: transaccion FK_316f8e4f7517d218d6e7622cd7f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transaccion
    ADD CONSTRAINT "FK_316f8e4f7517d218d6e7622cd7f" FOREIGN KEY (usuario_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: torneo FK_38355018b4b70bda7a12912412d; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.torneo
    ADD CONSTRAINT "FK_38355018b4b70bda7a12912412d" FOREIGN KEY (tipo_entrada_id) REFERENCES public.catalogo_tipo_entrada(id);


--
-- Name: torneo_inscripcion FK_3c9690d76a9c18b0b367e06ccad; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.torneo_inscripcion
    ADD CONSTRAINT "FK_3c9690d76a9c18b0b367e06ccad" FOREIGN KEY (torneo_id) REFERENCES public.torneo(id) ON DELETE CASCADE;


--
-- Name: equipo_miembros FK_40ba6e6f5228ef58122609684e3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.equipo_miembros
    ADD CONSTRAINT "FK_40ba6e6f5228ef58122609684e3" FOREIGN KEY (usuario_id) REFERENCES public.usuario(id);


--
-- Name: usuario_cuenta_juego FK_4e28b58d239de4925f8aaa9a8db; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_cuenta_juego
    ADD CONSTRAINT "FK_4e28b58d239de4925f8aaa9a8db" FOREIGN KEY (usuario_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: equipo FK_500fa2da87ee3fc2757ac18d59c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.equipo
    ADD CONSTRAINT "FK_500fa2da87ee3fc2757ac18d59c" FOREIGN KEY (creado_por) REFERENCES public.usuario(id);


--
-- Name: torneo FK_5b0e27f8f4caffb5592b1a51975; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.torneo
    ADD CONSTRAINT "FK_5b0e27f8f4caffb5592b1a51975" FOREIGN KEY (tipo_torneo_id) REFERENCES public.catalogo_tipo_torneo(id);


--
-- Name: torneo_resultados FK_5b115131a8cc205459ec938c775; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.torneo_resultados
    ADD CONSTRAINT "FK_5b115131a8cc205459ec938c775" FOREIGN KEY (usuario_id) REFERENCES public.usuario(id);


--
-- Name: tienda_solicitud_soporte FK_603117a8319c5fda8bf896aa8e7; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tienda_solicitud_soporte
    ADD CONSTRAINT "FK_603117a8319c5fda8bf896aa8e7" FOREIGN KEY (orden_id) REFERENCES public.tienda_orden(id) ON DELETE SET NULL;


--
-- Name: tienda_solicitud_soporte FK_64c7f2fa2b09757569c8addb238; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tienda_solicitud_soporte
    ADD CONSTRAINT "FK_64c7f2fa2b09757569c8addb238" FOREIGN KEY (usuario_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: transaccion FK_667b3504e61f3ee7db59db850be; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transaccion
    ADD CONSTRAINT "FK_667b3504e61f3ee7db59db850be" FOREIGN KEY (tipo_id) REFERENCES public.catalogo_transaccion_tipo(id);


--
-- Name: usuario FK_6c336b0a51b5c4d22614cb02533; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT "FK_6c336b0a51b5c4d22614cb02533" FOREIGN KEY (rol_id) REFERENCES public.catalogo_rol(id);


--
-- Name: usuario_seguidores FK_6cb1a22f19bc2724a2895147daf; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_seguidores
    ADD CONSTRAINT "FK_6cb1a22f19bc2724a2895147daf" FOREIGN KEY (seguido_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: torneo FK_85ef19440de5cb255590372dc61; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.torneo
    ADD CONSTRAINT "FK_85ef19440de5cb255590372dc61" FOREIGN KEY (plataforma_id) REFERENCES public.catalogo_plataforma(id);


--
-- Name: usuario_amigos FK_879e2e7d8e715539b09aa89c63a; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_amigos
    ADD CONSTRAINT "FK_879e2e7d8e715539b09aa89c63a" FOREIGN KEY (estado_id) REFERENCES public.catalogo_estado_amistad(id);


--
-- Name: usuario_seguidores FK_89ab1bbe5122dccab1be305f78f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_seguidores
    ADD CONSTRAINT "FK_89ab1bbe5122dccab1be305f78f" FOREIGN KEY (seguidor_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: juego_plataformas FK_8f060be27f0622cfa62caba0672; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.juego_plataformas
    ADD CONSTRAINT "FK_8f060be27f0622cfa62caba0672" FOREIGN KEY ("juegoId") REFERENCES public.juego(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tienda_orden FK_97226c90cd4dfbb5e6d73565a1e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tienda_orden
    ADD CONSTRAINT "FK_97226c90cd4dfbb5e6d73565a1e" FOREIGN KEY (item_id) REFERENCES public.tienda_item(id);


--
-- Name: juego_plataformas FK_9770e3bc9af3bd32e4821c840d0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.juego_plataformas
    ADD CONSTRAINT "FK_9770e3bc9af3bd32e4821c840d0" FOREIGN KEY ("catalogoPlataformaId") REFERENCES public.catalogo_plataforma(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: usuario FK_a03a572de1d6d4f9f20c206796f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT "FK_a03a572de1d6d4f9f20c206796f" FOREIGN KEY (avatar_id) REFERENCES public.catalogo_avatar(id);


--
-- Name: torneo_premios FK_a3031bbf1c334efdde6a07e5a46; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.torneo_premios
    ADD CONSTRAINT "FK_a3031bbf1c334efdde6a07e5a46" FOREIGN KEY (torneo_id) REFERENCES public.torneo(id) ON DELETE CASCADE;


--
-- Name: tienda_orden FK_a5fb5eb3a794663d20e81991b9f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tienda_orden
    ADD CONSTRAINT "FK_a5fb5eb3a794663d20e81991b9f" FOREIGN KEY (usuario_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: usuario_logros FK_adba4bc181b1c98ef429c1eed2f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_logros
    ADD CONSTRAINT "FK_adba4bc181b1c98ef429c1eed2f" FOREIGN KEY (usuario_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: usuario_membresias FK_aee9c3e735c76f8489ef38e6d7d; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_membresias
    ADD CONSTRAINT "FK_aee9c3e735c76f8489ef38e6d7d" FOREIGN KEY (usuario_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: usuario_membresias FK_af1698db762c6fc117144c8778e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_membresias
    ADD CONSTRAINT "FK_af1698db762c6fc117144c8778e" FOREIGN KEY (membresia_tipo_id) REFERENCES public.membresia_tipo(id);


--
-- Name: torneo FK_b25787fe4d2d7769649f83eff35; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.torneo
    ADD CONSTRAINT "FK_b25787fe4d2d7769649f83eff35" FOREIGN KEY (juego_id) REFERENCES public.juego(id);


--
-- Name: usuario_logros FK_b307eb190fe44b4153e00153571; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_logros
    ADD CONSTRAINT "FK_b307eb190fe44b4153e00153571" FOREIGN KEY (logro_id) REFERENCES public.logro(id);


--
-- Name: persona FK_b5035180a48a15df1e48dbc05b8; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT "FK_b5035180a48a15df1e48dbc05b8" FOREIGN KEY (genero_id) REFERENCES public.catalogo_genero(id);


--
-- Name: usuario_red_social FK_b521744b0ca2dd335c7493521f3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_red_social
    ADD CONSTRAINT "FK_b521744b0ca2dd335c7493521f3" FOREIGN KEY (usuario_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: torneo_redes FK_b5aa1faa39c8ec8e28c95cf7d23; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.torneo_redes
    ADD CONSTRAINT "FK_b5aa1faa39c8ec8e28c95cf7d23" FOREIGN KEY (torneo_id) REFERENCES public.torneo(id) ON DELETE CASCADE;


--
-- Name: modo_juego FK_bb1017c86dc0d25b32f348cac25; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.modo_juego
    ADD CONSTRAINT "FK_bb1017c86dc0d25b32f348cac25" FOREIGN KEY (juego_id) REFERENCES public.juego(id) ON DELETE CASCADE;


--
-- Name: usuario_estadisticas_juego FK_c0287ef03b4be4a2486f77cc4f3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_estadisticas_juego
    ADD CONSTRAINT "FK_c0287ef03b4be4a2486f77cc4f3" FOREIGN KEY (juego_id) REFERENCES public.juego(id);


--
-- Name: usuario FK_c9d223fa9cc0ea30abcd9d5ca7e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT "FK_c9d223fa9cc0ea30abcd9d5ca7e" FOREIGN KEY (persona_id) REFERENCES public.persona(id);


--
-- Name: tienda_item FK_cdcbc46312f29bb40890573bb0e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tienda_item
    ADD CONSTRAINT "FK_cdcbc46312f29bb40890573bb0e" FOREIGN KEY (tipo_id) REFERENCES public.catalogo_tipo_item(id);


--
-- Name: torneo FK_d16a6a34d8062c995a2c19ddfd1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.torneo
    ADD CONSTRAINT "FK_d16a6a34d8062c995a2c19ddfd1" FOREIGN KEY (anfitrion_id) REFERENCES public.usuario(id);


--
-- Name: torneo_resultados FK_d625931ee48b60b60a78c61b45c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.torneo_resultados
    ADD CONSTRAINT "FK_d625931ee48b60b60a78c61b45c" FOREIGN KEY (torneo_id) REFERENCES public.torneo(id) ON DELETE CASCADE;


--
-- Name: torneo FK_d81456b1cf2289e3eae13842ea4; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.torneo
    ADD CONSTRAINT "FK_d81456b1cf2289e3eae13842ea4" FOREIGN KEY (modo_juego_id) REFERENCES public.modo_juego(id);


--
-- Name: usuario_trofeos FK_da32b9d289396f3c9405ffacc5b; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_trofeos
    ADD CONSTRAINT "FK_da32b9d289396f3c9405ffacc5b" FOREIGN KEY (torneo_id) REFERENCES public.torneo(id);


--
-- Name: equipo_miembros FK_dca17b2fa03abfba97623231d75; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.equipo_miembros
    ADD CONSTRAINT "FK_dca17b2fa03abfba97623231d75" FOREIGN KEY (equipo_id) REFERENCES public.equipo(id) ON DELETE CASCADE;


--
-- Name: tienda_solicitud_soporte FK_dede56f207dbcf03092d9c1ab27; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tienda_solicitud_soporte
    ADD CONSTRAINT "FK_dede56f207dbcf03092d9c1ab27" FOREIGN KEY (resuelto_por) REFERENCES public.usuario(id);


--
-- Name: usuario_amigos FK_df5b5bf93e9b118112f5c04e0a3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_amigos
    ADD CONSTRAINT "FK_df5b5bf93e9b118112f5c04e0a3" FOREIGN KEY (usuario1_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: usuario_cuenta_juego FK_e9da7e312052147df75e853936f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_cuenta_juego
    ADD CONSTRAINT "FK_e9da7e312052147df75e853936f" FOREIGN KEY (plataforma_juego_id) REFERENCES public.catalogo_plataforma(id);


--
-- Name: torneo_inscripcion FK_fad7c271dd058405b9793aa23d8; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.torneo_inscripcion
    ADD CONSTRAINT "FK_fad7c271dd058405b9793aa23d8" FOREIGN KEY (usuario_id) REFERENCES public.usuario(id);


--
-- PostgreSQL database dump complete
--




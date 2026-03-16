-- =====================================================
-- SCRIPT MAESTRO: Inicialización de Base de Datos Azure
-- Plataforma eSports
-- Ejecutar en Azure Database for PostgreSQL
-- =====================================================
-- IMPORTANTE: Ejecutar en orden, cada sección depende de la anterior
-- =====================================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PARTE 1: CREACIÓN DE TABLAS (DDL)
-- =====================================================

-- Tablas de catálogos (sin dependencias)
CREATE TABLE IF NOT EXISTS public.catalogo_avatar
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    nombre character varying COLLATE pg_catalog."default" NOT NULL,
    url character varying COLLATE pg_catalog."default" NOT NULL,
    seed character varying COLLATE pg_catalog."default" NOT NULL,
    categoria character varying COLLATE pg_catalog."default",
    disponible boolean NOT NULL DEFAULT true,
    premium boolean NOT NULL DEFAULT false,
    creado_en timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT "PK_9ef244ef990f41ff8dfa6eabecb" PRIMARY KEY (id),
    CONSTRAINT "UQ_ba84635357d0e25fe07abde50ec" UNIQUE (nombre)
);

CREATE TABLE IF NOT EXISTS public.catalogo_estado_amistad
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    valor character varying COLLATE pg_catalog."default" NOT NULL,
    creado_en timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT "PK_858035025304d0882010fc945b5" PRIMARY KEY (id),
    CONSTRAINT "UQ_80da378eba9ccaa65db285b832a" UNIQUE (valor)
);

CREATE TABLE IF NOT EXISTS public.catalogo_estado_inscripcion
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    valor character varying COLLATE pg_catalog."default" NOT NULL,
    creado_en timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT "PK_556040c140cd0590336b1b1bc08" PRIMARY KEY (id),
    CONSTRAINT "UQ_7b4445eeb23bf944fdaf228b0a8" UNIQUE (valor)
);

CREATE TABLE IF NOT EXISTS public.catalogo_estado_torneo
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    valor character varying COLLATE pg_catalog."default" NOT NULL,
    creado_en timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT "PK_5e3012abb7954f1c0c985956152" PRIMARY KEY (id),
    CONSTRAINT "UQ_f3baf6357ba20547f359fd5b7e9" UNIQUE (valor)
);

CREATE TABLE IF NOT EXISTS public.catalogo_genero
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    valor character varying COLLATE pg_catalog."default" NOT NULL,
    creado_en timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT "PK_05a96ae5bf9e1eff3dcd19d764c" PRIMARY KEY (id),
    CONSTRAINT "UQ_3263de178999924ffdbd8f12875" UNIQUE (valor)
);

CREATE TABLE IF NOT EXISTS public.catalogo_origen_transaccion
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    valor character varying COLLATE pg_catalog."default" NOT NULL,
    creado_en timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT "PK_260aa8e778292484b569da3cfbe" PRIMARY KEY (id),
    CONSTRAINT "UQ_2b993c64a643967861394ebb134" UNIQUE (valor)
);

CREATE TABLE IF NOT EXISTS public.catalogo_plataforma
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    valor character varying COLLATE pg_catalog."default" NOT NULL,
    creado_en timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT "PK_a8c5d7450dd32402c0be7890bc0" PRIMARY KEY (id),
    CONSTRAINT "UQ_06e22b9038db0d083e5c3419109" UNIQUE (valor)
);

CREATE TABLE IF NOT EXISTS public.catalogo_region
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    valor character varying COLLATE pg_catalog."default" NOT NULL,
    creado_en timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT "PK_6ad72ee02b8478faf856012d201" PRIMARY KEY (id),
    CONSTRAINT "UQ_9834d49a2d2d45c6e7623bc0465" UNIQUE (valor)
);

CREATE TABLE IF NOT EXISTS public.catalogo_rol
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    valor character varying COLLATE pg_catalog."default" NOT NULL,
    creado_en timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT "PK_f2531d28876065bc434e061d8a6" PRIMARY KEY (id),
    CONSTRAINT "UQ_cdb2efce115c76aa3555c6da120" UNIQUE (valor)
);

CREATE TABLE IF NOT EXISTS public.catalogo_tipo_entrada
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    valor character varying COLLATE pg_catalog."default" NOT NULL,
    creado_en timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT "PK_1b857ed635f616c5ea5e7ca99f3" PRIMARY KEY (id),
    CONSTRAINT "UQ_41f3f4b005a54f45479e0b616f9" UNIQUE (valor)
);

CREATE TABLE IF NOT EXISTS public.catalogo_tipo_item
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    valor character varying COLLATE pg_catalog."default" NOT NULL,
    creado_en timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT "PK_ef95256a46bdcd84f679eca48a6" PRIMARY KEY (id),
    CONSTRAINT "UQ_3e00684b9a21a4d23134717c2bc" UNIQUE (valor)
);

CREATE TABLE IF NOT EXISTS public.catalogo_tipo_torneo
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    valor character varying COLLATE pg_catalog."default" NOT NULL,
    descripcion text COLLATE pg_catalog."default",
    tipo_trofeo character varying COLLATE pg_catalog."default" NOT NULL,
    creado_en timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT catalogo_tipo_torneo_pkey PRIMARY KEY (id),
    CONSTRAINT catalogo_tipo_torneo_valor_key UNIQUE (valor)
);

CREATE TABLE IF NOT EXISTS public.catalogo_transaccion_tipo
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    valor character varying COLLATE pg_catalog."default" NOT NULL,
    creado_en timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT "PK_c1b918568cdf4d5a35d51871be7" PRIMARY KEY (id),
    CONSTRAINT "UQ_3a1f069338c2920d6c8ea417065" UNIQUE (valor)
);

-- Tabla persona
CREATE TABLE IF NOT EXISTS public.persona
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    p_nombre character varying COLLATE pg_catalog."default" NOT NULL,
    s_nombre character varying COLLATE pg_catalog."default",
    p_apellido character varying COLLATE pg_catalog."default" NOT NULL,
    s_apellido character varying COLLATE pg_catalog."default",
    correo character varying COLLATE pg_catalog."default" NOT NULL,
    fecha_nacimiento date,
    timezone character varying COLLATE pg_catalog."default",
    correo_paypal character varying COLLATE pg_catalog."default",
    telefono character varying COLLATE pg_catalog."default",
    direccion character varying COLLATE pg_catalog."default",
    ciudad character varying COLLATE pg_catalog."default",
    estado character varying COLLATE pg_catalog."default",
    codigo_postal character varying COLLATE pg_catalog."default",
    pais character varying COLLATE pg_catalog."default",
    divisa character varying COLLATE pg_catalog."default" DEFAULT 'USD'::character varying,
    creado_en timestamp without time zone NOT NULL DEFAULT now(),
    actualizado_en timestamp without time zone NOT NULL DEFAULT now(),
    genero_id uuid,
    CONSTRAINT "PK_13aefc75f60510f2be4cd243d71" PRIMARY KEY (id),
    CONSTRAINT "UQ_6150bc0608b585b62f23c4dfd86" UNIQUE (correo)
);

-- Tabla usuario
CREATE TABLE IF NOT EXISTS public.usuario
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    nickname character varying COLLATE pg_catalog."default" NOT NULL,
    password character varying COLLATE pg_catalog."default" NOT NULL,
    estado character varying(50) COLLATE pg_catalog."default" NOT NULL DEFAULT 'activo'::character varying,
    ultima_conexion timestamp without time zone,
    xp integer NOT NULL DEFAULT 0,
    saldo numeric(12, 2) NOT NULL DEFAULT '0'::numeric,
    creditos integer NOT NULL DEFAULT 0,
    foto_perfil character varying COLLATE pg_catalog."default",
    biografia character varying(300) COLLATE pg_catalog."default",
    desafios_habilitados boolean NOT NULL DEFAULT true,
    creado_en timestamp without time zone NOT NULL DEFAULT now(),
    actualizado_en timestamp without time zone NOT NULL DEFAULT now(),
    deleted_at timestamp without time zone,
    persona_id uuid,
    rol_id uuid NOT NULL,
    avatar_id uuid,
    CONSTRAINT "PK_a56c58e5cabaa04fb2c98d2d7e2" PRIMARY KEY (id),
    CONSTRAINT "REL_c9d223fa9cc0ea30abcd9d5ca7" UNIQUE (persona_id),
    CONSTRAINT "UQ_4413e686f29147c934abf16f890" UNIQUE (nickname)
);

-- Tablas de juego
CREATE TABLE IF NOT EXISTS public.juego
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    nombre character varying COLLATE pg_catalog."default" NOT NULL,
    descripcion text COLLATE pg_catalog."default",
    creado_en timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT "PK_d0ac2f7932d13ee8976f473fe6f" PRIMARY KEY (id),
    CONSTRAINT "UQ_3d91e82f1bf4655834de3cf96f2" UNIQUE (nombre)
);

CREATE TABLE IF NOT EXISTS public.juego_plataformas
(
    "juegoId" uuid NOT NULL,
    "catalogoPlataformaId" uuid NOT NULL,
    CONSTRAINT "PK_f5d5426c5be00c05916ad403c76" PRIMARY KEY ("juegoId", "catalogoPlataformaId")
);

CREATE TABLE IF NOT EXISTS public.modo_juego
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    nombre character varying COLLATE pg_catalog."default" NOT NULL,
    descripcion text COLLATE pg_catalog."default",
    juego_id uuid,
    CONSTRAINT "PK_3358b634202bc66a4b5e5e9f8ea" PRIMARY KEY (id)
);

-- Tablas de equipo
CREATE TABLE IF NOT EXISTS public.equipo
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    nombre character varying COLLATE pg_catalog."default" NOT NULL,
    descripcion text COLLATE pg_catalog."default",
    avatar_url character varying COLLATE pg_catalog."default",
    creado_en timestamp without time zone NOT NULL DEFAULT now(),
    creado_por uuid,
    CONSTRAINT "PK_a545d29b4870688c462189447da" PRIMARY KEY (id),
    CONSTRAINT "UQ_40ad7bfc23ed6409460806f4d60" UNIQUE (nombre)
);

CREATE TABLE IF NOT EXISTS public.equipo_miembros
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    rol character varying COLLATE pg_catalog."default" NOT NULL DEFAULT 'miembro'::character varying,
    joined_at timestamp without time zone NOT NULL DEFAULT now(),
    equipo_id uuid,
    usuario_id uuid,
    CONSTRAINT "PK_76e8796c6f175e922b2741a0636" PRIMARY KEY (id)
);

-- Tablas de logros y membresías
CREATE TABLE IF NOT EXISTS public.logro
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    nombre character varying COLLATE pg_catalog."default" NOT NULL,
    descripcion text COLLATE pg_catalog."default",
    CONSTRAINT "PK_2bc9042c13742f2ced9c8adb36e" PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.membresia_tipo
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    nombre character varying COLLATE pg_catalog."default" NOT NULL,
    precio numeric(12, 2) NOT NULL,
    duracion_dias integer NOT NULL,
    beneficios text COLLATE pg_catalog."default",
    CONSTRAINT "PK_e2fb5f1f8558c80e491644449c0" PRIMARY KEY (id)
);

-- Tablas de tienda
CREATE TABLE IF NOT EXISTS public.tienda_item
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    nombre character varying COLLATE pg_catalog."default" NOT NULL,
    descripcion text COLLATE pg_catalog."default",
    precio numeric(12, 2) NOT NULL,
    creditos_otorgados integer,
    metadata jsonb,
    tipo_id uuid NOT NULL,
    CONSTRAINT "PK_e494e2b265b44a3afb5a89ff7a8" PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.tienda_orden
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    usuario_id uuid NOT NULL,
    item_id uuid NOT NULL,
    paypal_order_id character varying COLLATE pg_catalog."default",
    paypal_capture_id character varying COLLATE pg_catalog."default",
    paypal_payer_id character varying COLLATE pg_catalog."default",
    paypal_payer_email character varying COLLATE pg_catalog."default",
    monto numeric(12, 2) NOT NULL,
    divisa character varying(3) COLLATE pg_catalog."default" NOT NULL DEFAULT 'USD'::character varying,
    estado character varying(50) COLLATE pg_catalog."default" NOT NULL DEFAULT 'pendiente'::character varying,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    creado_en timestamp without time zone NOT NULL DEFAULT now(),
    completado_en timestamp without time zone,
    actualizado_en timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT tienda_orden_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.tienda_solicitud_soporte
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    orden_id uuid,
    usuario_id uuid NOT NULL,
    tipo character varying(50) COLLATE pg_catalog."default" NOT NULL,
    nickname_solicitado character varying COLLATE pg_catalog."default",
    estado character varying(50) COLLATE pg_catalog."default" NOT NULL DEFAULT 'pendiente'::character varying,
    notas_admin text COLLATE pg_catalog."default",
    creado_en timestamp without time zone NOT NULL DEFAULT now(),
    actualizado_en timestamp without time zone NOT NULL DEFAULT now(),
    resuelto_en timestamp without time zone,
    resuelto_por uuid,
    CONSTRAINT tienda_solicitud_soporte_pkey PRIMARY KEY (id)
);

-- Tablas de torneo
CREATE TABLE IF NOT EXISTS public.torneo
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    titulo character varying COLLATE pg_catalog."default" NOT NULL,
    descripcion text COLLATE pg_catalog."default",
    fecha_inicio_registro timestamp without time zone,
    fecha_fin_registro timestamp without time zone,
    fecha_inicio_torneo timestamp without time zone,
    tipo_torneo character varying COLLATE pg_catalog."default",
    al_mejor_de integer NOT NULL DEFAULT 1,
    formato character varying COLLATE pg_catalog."default",
    cerrado boolean NOT NULL DEFAULT false,
    reglas text COLLATE pg_catalog."default",
    jugadores_pc_permitidos boolean NOT NULL DEFAULT true,
    requiere_transmision boolean NOT NULL DEFAULT false,
    requiere_camara boolean NOT NULL DEFAULT false,
    capacidad integer,
    anfitrion_id uuid NOT NULL,
    juego_id uuid,
    plataforma_id uuid,
    modo_juego_id uuid,
    region_id uuid NOT NULL,
    tipo_entrada_id uuid NOT NULL,
    estado_id uuid,
    tipo_torneo_id uuid,
    banner_url character varying COLLATE pg_catalog."default",
    miniatura_url character varying COLLATE pg_catalog."default",
    contacto_anfitrion character varying COLLATE pg_catalog."default",
    discord_servidor character varying COLLATE pg_catalog."default",
    creado_en timestamp without time zone NOT NULL DEFAULT now(),
    actualizado_en timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT "PK_594cbe0a907eb32cb0ddfd63fea" PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.torneo_inscripcion
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    fecha timestamp without time zone NOT NULL DEFAULT now(),
    torneo_id uuid,
    usuario_id uuid NOT NULL,
    estado_id uuid NOT NULL,
    CONSTRAINT "PK_c3a2f268a54c077e48af8433e39" PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.torneo_premios
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    cuota integer,
    fondo_total numeric(12, 2) NOT NULL DEFAULT '0'::numeric,
    fondo_despues_comision numeric(12, 2) NOT NULL DEFAULT '0'::numeric,
    comision_porcentaje numeric(5, 2) NOT NULL DEFAULT '0'::numeric,
    ganador1_porcentaje numeric(5, 2) NOT NULL DEFAULT '0'::numeric,
    ganador2_porcentaje numeric(5, 2) NOT NULL DEFAULT '0'::numeric,
    torneo_id uuid,
    comision_total numeric(12, 2) NOT NULL DEFAULT 0,
    CONSTRAINT "PK_d002e010d3343aca3faa87ddfcd" PRIMARY KEY (id),
    CONSTRAINT "UQ_a3031bbf1c334efdde6a07e5a46" UNIQUE (torneo_id)
);

CREATE TABLE IF NOT EXISTS public.torneo_redes
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    plataforma character varying COLLATE pg_catalog."default" NOT NULL,
    url character varying COLLATE pg_catalog."default" NOT NULL,
    torneo_id uuid,
    CONSTRAINT "PK_d651da5cd7d1618d500bd62d86c" PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.torneo_resultados
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    posicion integer NOT NULL,
    torneo_id uuid,
    usuario_id uuid,
    CONSTRAINT "PK_202662e0792ac782738a8a09be8" PRIMARY KEY (id)
);

-- Tablas de transacción
CREATE TABLE IF NOT EXISTS public.transaccion
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    monto numeric(12, 2) NOT NULL,
    descripcion character varying COLLATE pg_catalog."default",
    creado_en timestamp without time zone NOT NULL DEFAULT now(),
    usuario_id uuid,
    tipo_id uuid NOT NULL,
    origen_id uuid NOT NULL,
    CONSTRAINT "PK_1d7fb1e642fb44d52a2fce77fc6" PRIMARY KEY (id)
);

-- Tablas de usuario relacionadas
CREATE TABLE IF NOT EXISTS public.usuario_amigos
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    creado_en timestamp without time zone NOT NULL DEFAULT now(),
    usuario1_id uuid,
    usuario2_id uuid,
    estado_id uuid NOT NULL,
    CONSTRAINT "PK_40eab05adfd98664f9b767c86ee" PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.usuario_cuenta_juego
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    identificador character varying COLLATE pg_catalog."default" NOT NULL,
    usuario_id uuid,
    plataforma_juego_id uuid NOT NULL,
    CONSTRAINT "PK_9d7b7179f3b92cd0e334024c072" PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.usuario_estadisticas_juego
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    victorias integer NOT NULL DEFAULT 0,
    derrotas integer NOT NULL DEFAULT 0,
    empates integer NOT NULL DEFAULT 0,
    nivel_rango character varying COLLATE pg_catalog."default",
    horas_jugadas integer NOT NULL DEFAULT 0,
    actualizado_en timestamp without time zone NOT NULL DEFAULT now(),
    usuario_id uuid,
    juego_id uuid,
    CONSTRAINT "PK_5937df1f3f1c3e1beb252920e85" PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.usuario_logros
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    fecha timestamp without time zone NOT NULL DEFAULT now(),
    usuario_id uuid,
    logro_id uuid,
    CONSTRAINT "PK_32415c99be0edb1a3d5183e66a8" PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.usuario_membresias
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    fecha_inicio date NOT NULL,
    fecha_fin date NOT NULL,
    activa boolean NOT NULL DEFAULT true,
    usuario_id uuid,
    membresia_tipo_id uuid,
    CONSTRAINT "PK_c92891bbedc7f60b25b6559c2e6" PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.usuario_red_social
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    plataforma character varying COLLATE pg_catalog."default" NOT NULL,
    enlace character varying COLLATE pg_catalog."default" NOT NULL,
    usuario_id uuid,
    CONSTRAINT "PK_24c7dd1d299ffefa1385ec93c7d" PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.usuario_seguidores
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    creado_en timestamp without time zone NOT NULL DEFAULT now(),
    seguidor_id uuid,
    seguido_id uuid,
    CONSTRAINT "PK_78aa436f4b719f1f71d9edfed4e" PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.usuario_trofeos
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    tipo_trofeo character varying COLLATE pg_catalog."default" NOT NULL,
    ganado_en timestamp without time zone NOT NULL DEFAULT now(),
    usuario_id uuid,
    torneo_id uuid,
    CONSTRAINT "PK_db511af9ff13b69c34a539b56ee" PRIMARY KEY (id)
);

-- =====================================================
-- PARTE 2: FOREIGN KEYS (CONSTRAINTS)
-- =====================================================

-- Foreign Keys para persona
ALTER TABLE IF EXISTS public.persona DROP CONSTRAINT IF EXISTS "FK_b5035180a48a15df1e48dbc05b8";
ALTER TABLE IF EXISTS public.persona
    ADD CONSTRAINT "FK_b5035180a48a15df1e48dbc05b8" FOREIGN KEY (genero_id)
    REFERENCES public.catalogo_genero (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

-- Foreign Keys para usuario
ALTER TABLE IF EXISTS public.usuario DROP CONSTRAINT IF EXISTS "FK_6c336b0a51b5c4d22614cb02533";
ALTER TABLE IF EXISTS public.usuario DROP CONSTRAINT IF EXISTS "FK_a03a572de1d6d4f9f20c206796f";
ALTER TABLE IF EXISTS public.usuario DROP CONSTRAINT IF EXISTS "FK_c9d223fa9cc0ea30abcd9d5ca7e";

ALTER TABLE IF EXISTS public.usuario
    ADD CONSTRAINT "FK_6c336b0a51b5c4d22614cb02533" FOREIGN KEY (rol_id)
    REFERENCES public.catalogo_rol (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.usuario
    ADD CONSTRAINT "FK_a03a572de1d6d4f9f20c206796f" FOREIGN KEY (avatar_id)
    REFERENCES public.catalogo_avatar (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.usuario
    ADD CONSTRAINT "FK_c9d223fa9cc0ea30abcd9d5ca7e" FOREIGN KEY (persona_id)
    REFERENCES public.persona (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

-- Foreign Keys para juego_plataformas
ALTER TABLE IF EXISTS public.juego_plataformas DROP CONSTRAINT IF EXISTS "FK_8f060be27f0622cfa62caba0672";
ALTER TABLE IF EXISTS public.juego_plataformas DROP CONSTRAINT IF EXISTS "FK_9770e3bc9af3bd32e4821c840d0";

ALTER TABLE IF EXISTS public.juego_plataformas
    ADD CONSTRAINT "FK_8f060be27f0622cfa62caba0672" FOREIGN KEY ("juegoId")
    REFERENCES public.juego (id) MATCH SIMPLE
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.juego_plataformas
    ADD CONSTRAINT "FK_9770e3bc9af3bd32e4821c840d0" FOREIGN KEY ("catalogoPlataformaId")
    REFERENCES public.catalogo_plataforma (id) MATCH SIMPLE
    ON UPDATE CASCADE ON DELETE CASCADE;

-- Foreign Keys para modo_juego
ALTER TABLE IF EXISTS public.modo_juego DROP CONSTRAINT IF EXISTS "FK_bb1017c86dc0d25b32f348cac25";
ALTER TABLE IF EXISTS public.modo_juego
    ADD CONSTRAINT "FK_bb1017c86dc0d25b32f348cac25" FOREIGN KEY (juego_id)
    REFERENCES public.juego (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE CASCADE;

-- Foreign Keys para equipo
ALTER TABLE IF EXISTS public.equipo DROP CONSTRAINT IF EXISTS "FK_500fa2da87ee3fc2757ac18d59c";
ALTER TABLE IF EXISTS public.equipo
    ADD CONSTRAINT "FK_500fa2da87ee3fc2757ac18d59c" FOREIGN KEY (creado_por)
    REFERENCES public.usuario (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

-- Foreign Keys para equipo_miembros
ALTER TABLE IF EXISTS public.equipo_miembros DROP CONSTRAINT IF EXISTS "FK_40ba6e6f5228ef58122609684e3";
ALTER TABLE IF EXISTS public.equipo_miembros DROP CONSTRAINT IF EXISTS "FK_dca17b2fa03abfba97623231d75";

ALTER TABLE IF EXISTS public.equipo_miembros
    ADD CONSTRAINT "FK_40ba6e6f5228ef58122609684e3" FOREIGN KEY (usuario_id)
    REFERENCES public.usuario (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.equipo_miembros
    ADD CONSTRAINT "FK_dca17b2fa03abfba97623231d75" FOREIGN KEY (equipo_id)
    REFERENCES public.equipo (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE CASCADE;

-- Foreign Keys para tienda_item
ALTER TABLE IF EXISTS public.tienda_item DROP CONSTRAINT IF EXISTS "FK_cdcbc46312f29bb40890573bb0e";
ALTER TABLE IF EXISTS public.tienda_item
    ADD CONSTRAINT "FK_cdcbc46312f29bb40890573bb0e" FOREIGN KEY (tipo_id)
    REFERENCES public.catalogo_tipo_item (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

-- Foreign Keys para tienda_orden
ALTER TABLE IF EXISTS public.tienda_orden DROP CONSTRAINT IF EXISTS "FK_97226c90cd4dfbb5e6d73565a1e";
ALTER TABLE IF EXISTS public.tienda_orden DROP CONSTRAINT IF EXISTS "FK_a5fb5eb3a794663d20e81991b9f";

ALTER TABLE IF EXISTS public.tienda_orden
    ADD CONSTRAINT "FK_97226c90cd4dfbb5e6d73565a1e" FOREIGN KEY (item_id)
    REFERENCES public.tienda_item (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.tienda_orden
    ADD CONSTRAINT "FK_a5fb5eb3a794663d20e81991b9f" FOREIGN KEY (usuario_id)
    REFERENCES public.usuario (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE CASCADE;

-- Foreign Keys para tienda_solicitud_soporte
ALTER TABLE IF EXISTS public.tienda_solicitud_soporte DROP CONSTRAINT IF EXISTS "FK_603117a8319c5fda8bf896aa8e7";
ALTER TABLE IF EXISTS public.tienda_solicitud_soporte DROP CONSTRAINT IF EXISTS "FK_64c7f2fa2b09757569c8addb238";
ALTER TABLE IF EXISTS public.tienda_solicitud_soporte DROP CONSTRAINT IF EXISTS "FK_dede56f207dbcf03092d9c1ab27";

ALTER TABLE IF EXISTS public.tienda_solicitud_soporte
    ADD CONSTRAINT "FK_603117a8319c5fda8bf896aa8e7" FOREIGN KEY (orden_id)
    REFERENCES public.tienda_orden (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE SET NULL;

ALTER TABLE IF EXISTS public.tienda_solicitud_soporte
    ADD CONSTRAINT "FK_64c7f2fa2b09757569c8addb238" FOREIGN KEY (usuario_id)
    REFERENCES public.usuario (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.tienda_solicitud_soporte
    ADD CONSTRAINT "FK_dede56f207dbcf03092d9c1ab27" FOREIGN KEY (resuelto_por)
    REFERENCES public.usuario (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

-- Foreign Keys para torneo
ALTER TABLE IF EXISTS public.torneo DROP CONSTRAINT IF EXISTS "FK_0bd28f57e0d759273713724a527";
ALTER TABLE IF EXISTS public.torneo DROP CONSTRAINT IF EXISTS "FK_29622e4539834ab1c746c2e9317";
ALTER TABLE IF EXISTS public.torneo DROP CONSTRAINT IF EXISTS "FK_38355018b4b70bda7a12912412d";
ALTER TABLE IF EXISTS public.torneo DROP CONSTRAINT IF EXISTS "FK_5b0e27f8f4caffb5592b1a51975";
ALTER TABLE IF EXISTS public.torneo DROP CONSTRAINT IF EXISTS "FK_85ef19440de5cb255590372dc61";
ALTER TABLE IF EXISTS public.torneo DROP CONSTRAINT IF EXISTS "FK_b25787fe4d2d7769649f83eff35";
ALTER TABLE IF EXISTS public.torneo DROP CONSTRAINT IF EXISTS "FK_d16a6a34d8062c995a2c19ddfd1";
ALTER TABLE IF EXISTS public.torneo DROP CONSTRAINT IF EXISTS "FK_d81456b1cf2289e3eae13842ea4";

ALTER TABLE IF EXISTS public.torneo
    ADD CONSTRAINT "FK_0bd28f57e0d759273713724a527" FOREIGN KEY (region_id)
    REFERENCES public.catalogo_region (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.torneo
    ADD CONSTRAINT "FK_29622e4539834ab1c746c2e9317" FOREIGN KEY (estado_id)
    REFERENCES public.catalogo_estado_torneo (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.torneo
    ADD CONSTRAINT "FK_38355018b4b70bda7a12912412d" FOREIGN KEY (tipo_entrada_id)
    REFERENCES public.catalogo_tipo_entrada (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.torneo
    ADD CONSTRAINT "FK_5b0e27f8f4caffb5592b1a51975" FOREIGN KEY (tipo_torneo_id)
    REFERENCES public.catalogo_tipo_torneo (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.torneo
    ADD CONSTRAINT "FK_85ef19440de5cb255590372dc61" FOREIGN KEY (plataforma_id)
    REFERENCES public.catalogo_plataforma (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.torneo
    ADD CONSTRAINT "FK_b25787fe4d2d7769649f83eff35" FOREIGN KEY (juego_id)
    REFERENCES public.juego (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.torneo
    ADD CONSTRAINT "FK_d16a6a34d8062c995a2c19ddfd1" FOREIGN KEY (anfitrion_id)
    REFERENCES public.usuario (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.torneo
    ADD CONSTRAINT "FK_d81456b1cf2289e3eae13842ea4" FOREIGN KEY (modo_juego_id)
    REFERENCES public.modo_juego (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

-- Foreign Keys para torneo_inscripcion
ALTER TABLE IF EXISTS public.torneo_inscripcion DROP CONSTRAINT IF EXISTS "FK_053143ab39cbdffa4e22190f651";
ALTER TABLE IF EXISTS public.torneo_inscripcion DROP CONSTRAINT IF EXISTS "FK_3c9690d76a9c18b0b367e06ccad";
ALTER TABLE IF EXISTS public.torneo_inscripcion DROP CONSTRAINT IF EXISTS "FK_fad7c271dd058405b9793aa23d8";

ALTER TABLE IF EXISTS public.torneo_inscripcion
    ADD CONSTRAINT "FK_053143ab39cbdffa4e22190f651" FOREIGN KEY (estado_id)
    REFERENCES public.catalogo_estado_inscripcion (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.torneo_inscripcion
    ADD CONSTRAINT "FK_3c9690d76a9c18b0b367e06ccad" FOREIGN KEY (torneo_id)
    REFERENCES public.torneo (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.torneo_inscripcion
    ADD CONSTRAINT "FK_fad7c271dd058405b9793aa23d8" FOREIGN KEY (usuario_id)
    REFERENCES public.usuario (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

-- Foreign Keys para torneo_premios
ALTER TABLE IF EXISTS public.torneo_premios DROP CONSTRAINT IF EXISTS "FK_a3031bbf1c334efdde6a07e5a46";
ALTER TABLE IF EXISTS public.torneo_premios
    ADD CONSTRAINT "FK_a3031bbf1c334efdde6a07e5a46" FOREIGN KEY (torneo_id)
    REFERENCES public.torneo (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE CASCADE;

-- Foreign Keys para torneo_redes
ALTER TABLE IF EXISTS public.torneo_redes DROP CONSTRAINT IF EXISTS "FK_b5aa1faa39c8ec8e28c95cf7d23";
ALTER TABLE IF EXISTS public.torneo_redes
    ADD CONSTRAINT "FK_b5aa1faa39c8ec8e28c95cf7d23" FOREIGN KEY (torneo_id)
    REFERENCES public.torneo (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE CASCADE;

-- Foreign Keys para torneo_resultados
ALTER TABLE IF EXISTS public.torneo_resultados DROP CONSTRAINT IF EXISTS "FK_5b115131a8cc205459ec938c775";
ALTER TABLE IF EXISTS public.torneo_resultados DROP CONSTRAINT IF EXISTS "FK_d625931ee48b60b60a78c61b45c";

ALTER TABLE IF EXISTS public.torneo_resultados
    ADD CONSTRAINT "FK_5b115131a8cc205459ec938c775" FOREIGN KEY (usuario_id)
    REFERENCES public.usuario (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.torneo_resultados
    ADD CONSTRAINT "FK_d625931ee48b60b60a78c61b45c" FOREIGN KEY (torneo_id)
    REFERENCES public.torneo (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE CASCADE;

-- Foreign Keys para transaccion
ALTER TABLE IF EXISTS public.transaccion DROP CONSTRAINT IF EXISTS "FK_0d8e48f71025813937ecb04140a";
ALTER TABLE IF EXISTS public.transaccion DROP CONSTRAINT IF EXISTS "FK_316f8e4f7517d218d6e7622cd7f";
ALTER TABLE IF EXISTS public.transaccion DROP CONSTRAINT IF EXISTS "FK_667b3504e61f3ee7db59db850be";

ALTER TABLE IF EXISTS public.transaccion
    ADD CONSTRAINT "FK_0d8e48f71025813937ecb04140a" FOREIGN KEY (origen_id)
    REFERENCES public.catalogo_origen_transaccion (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.transaccion
    ADD CONSTRAINT "FK_316f8e4f7517d218d6e7622cd7f" FOREIGN KEY (usuario_id)
    REFERENCES public.usuario (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.transaccion
    ADD CONSTRAINT "FK_667b3504e61f3ee7db59db850be" FOREIGN KEY (tipo_id)
    REFERENCES public.catalogo_transaccion_tipo (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

-- Foreign Keys para usuario_amigos
ALTER TABLE IF EXISTS public.usuario_amigos DROP CONSTRAINT IF EXISTS "FK_1f8d3d974f7dafaef0767ba9703";
ALTER TABLE IF EXISTS public.usuario_amigos DROP CONSTRAINT IF EXISTS "FK_879e2e7d8e715539b09aa89c63a";
ALTER TABLE IF EXISTS public.usuario_amigos DROP CONSTRAINT IF EXISTS "FK_df5b5bf93e9b118112f5c04e0a3";

ALTER TABLE IF EXISTS public.usuario_amigos
    ADD CONSTRAINT "FK_1f8d3d974f7dafaef0767ba9703" FOREIGN KEY (usuario2_id)
    REFERENCES public.usuario (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.usuario_amigos
    ADD CONSTRAINT "FK_879e2e7d8e715539b09aa89c63a" FOREIGN KEY (estado_id)
    REFERENCES public.catalogo_estado_amistad (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.usuario_amigos
    ADD CONSTRAINT "FK_df5b5bf93e9b118112f5c04e0a3" FOREIGN KEY (usuario1_id)
    REFERENCES public.usuario (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE CASCADE;

-- Foreign Keys para usuario_cuenta_juego
ALTER TABLE IF EXISTS public.usuario_cuenta_juego DROP CONSTRAINT IF EXISTS "FK_4e28b58d239de4925f8aaa9a8db";
ALTER TABLE IF EXISTS public.usuario_cuenta_juego DROP CONSTRAINT IF EXISTS "FK_e9da7e312052147df75e853936f";

ALTER TABLE IF EXISTS public.usuario_cuenta_juego
    ADD CONSTRAINT "FK_4e28b58d239de4925f8aaa9a8db" FOREIGN KEY (usuario_id)
    REFERENCES public.usuario (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.usuario_cuenta_juego
    ADD CONSTRAINT "FK_e9da7e312052147df75e853936f" FOREIGN KEY (plataforma_juego_id)
    REFERENCES public.catalogo_plataforma (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

-- Foreign Keys para usuario_estadisticas_juego
ALTER TABLE IF EXISTS public.usuario_estadisticas_juego DROP CONSTRAINT IF EXISTS "FK_132d72a04a8ca3a95550816c4ac";
ALTER TABLE IF EXISTS public.usuario_estadisticas_juego DROP CONSTRAINT IF EXISTS "FK_c0287ef03b4be4a2486f77cc4f3";

ALTER TABLE IF EXISTS public.usuario_estadisticas_juego
    ADD CONSTRAINT "FK_132d72a04a8ca3a95550816c4ac" FOREIGN KEY (usuario_id)
    REFERENCES public.usuario (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.usuario_estadisticas_juego
    ADD CONSTRAINT "FK_c0287ef03b4be4a2486f77cc4f3" FOREIGN KEY (juego_id)
    REFERENCES public.juego (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

-- Foreign Keys para usuario_logros
ALTER TABLE IF EXISTS public.usuario_logros DROP CONSTRAINT IF EXISTS "FK_adba4bc181b1c98ef429c1eed2f";
ALTER TABLE IF EXISTS public.usuario_logros DROP CONSTRAINT IF EXISTS "FK_b307eb190fe44b4153e00153571";

ALTER TABLE IF EXISTS public.usuario_logros
    ADD CONSTRAINT "FK_adba4bc181b1c98ef429c1eed2f" FOREIGN KEY (usuario_id)
    REFERENCES public.usuario (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.usuario_logros
    ADD CONSTRAINT "FK_b307eb190fe44b4153e00153571" FOREIGN KEY (logro_id)
    REFERENCES public.logro (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

-- Foreign Keys para usuario_membresias
ALTER TABLE IF EXISTS public.usuario_membresias DROP CONSTRAINT IF EXISTS "FK_aee9c3e735c76f8489ef38e6d7d";
ALTER TABLE IF EXISTS public.usuario_membresias DROP CONSTRAINT IF EXISTS "FK_af1698db762c6fc117144c8778e";

ALTER TABLE IF EXISTS public.usuario_membresias
    ADD CONSTRAINT "FK_aee9c3e735c76f8489ef38e6d7d" FOREIGN KEY (usuario_id)
    REFERENCES public.usuario (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.usuario_membresias
    ADD CONSTRAINT "FK_af1698db762c6fc117144c8778e" FOREIGN KEY (membresia_tipo_id)
    REFERENCES public.membresia_tipo (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

-- Foreign Keys para usuario_red_social
ALTER TABLE IF EXISTS public.usuario_red_social DROP CONSTRAINT IF EXISTS "FK_b521744b0ca2dd335c7493521f3";
ALTER TABLE IF EXISTS public.usuario_red_social
    ADD CONSTRAINT "FK_b521744b0ca2dd335c7493521f3" FOREIGN KEY (usuario_id)
    REFERENCES public.usuario (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE CASCADE;

-- Foreign Keys para usuario_seguidores
ALTER TABLE IF EXISTS public.usuario_seguidores DROP CONSTRAINT IF EXISTS "FK_6cb1a22f19bc2724a2895147daf";
ALTER TABLE IF EXISTS public.usuario_seguidores DROP CONSTRAINT IF EXISTS "FK_89ab1bbe5122dccab1be305f78f";

ALTER TABLE IF EXISTS public.usuario_seguidores
    ADD CONSTRAINT "FK_6cb1a22f19bc2724a2895147daf" FOREIGN KEY (seguido_id)
    REFERENCES public.usuario (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.usuario_seguidores
    ADD CONSTRAINT "FK_89ab1bbe5122dccab1be305f78f" FOREIGN KEY (seguidor_id)
    REFERENCES public.usuario (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE CASCADE;

-- Foreign Keys para usuario_trofeos
ALTER TABLE IF EXISTS public.usuario_trofeos DROP CONSTRAINT IF EXISTS "FK_109db65088fd652d967df849a69";
ALTER TABLE IF EXISTS public.usuario_trofeos DROP CONSTRAINT IF EXISTS "FK_da32b9d289396f3c9405ffacc5b";

ALTER TABLE IF EXISTS public.usuario_trofeos
    ADD CONSTRAINT "FK_109db65088fd652d967df849a69" FOREIGN KEY (usuario_id)
    REFERENCES public.usuario (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.usuario_trofeos
    ADD CONSTRAINT "FK_da32b9d289396f3c9405ffacc5b" FOREIGN KEY (torneo_id)
    REFERENCES public.torneo (id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION;

-- =====================================================
-- PARTE 3: DATOS INICIALES (SEEDS)
-- =====================================================

-- Roles
INSERT INTO catalogo_rol (valor) VALUES
    ('admin'),
    ('usuario'),
    ('moderador'),
    ('organizador')
ON CONFLICT (valor) DO NOTHING;

-- Géneros
INSERT INTO catalogo_genero (valor) VALUES
    ('Masculino'),
    ('Femenino'),
    ('Otro'),
    ('Prefiero no decir')
ON CONFLICT (valor) DO NOTHING;

-- Estados de amistad
INSERT INTO catalogo_estado_amistad (valor) VALUES
    ('pendiente'),
    ('aceptado'),
    ('rechazado'),
    ('bloqueado')
ON CONFLICT (valor) DO NOTHING;

-- Estados de inscripción
INSERT INTO catalogo_estado_inscripcion (valor) VALUES
    ('pendiente'),
    ('confirmado'),
    ('cancelado'),
    ('eliminado')
ON CONFLICT (valor) DO NOTHING;

-- Estados de torneo
INSERT INTO catalogo_estado_torneo (valor) VALUES
    ('draft'),
    ('proximamente'),
    ('registro_abierto'),
    ('en_curso'),
    ('terminado'),
    ('cancelado')
ON CONFLICT (valor) DO NOTHING;

-- Orígenes de transacción
INSERT INTO catalogo_origen_transaccion (valor) VALUES
    ('compra'),
    ('premio'),
    ('reembolso'),
    ('deposito'),
    ('retiro'),
    ('inscripcion'),
    ('bonificacion')
ON CONFLICT (valor) DO NOTHING;

-- Plataformas
INSERT INTO catalogo_plataforma (valor) VALUES
    ('PC'),
    ('PlayStation 5'),
    ('PlayStation 4'),
    ('Xbox Series X/S'),
    ('Xbox One'),
    ('Nintendo Switch'),
    ('Mobile'),
    ('Steam'),
    ('Epic Games'),
    ('Battle.net'),
    ('Origin'),
    ('Ubisoft Connect'),
    ('GOG'),
    ('Crossplay')
ON CONFLICT (valor) DO NOTHING;

-- Regiones
INSERT INTO catalogo_region (valor) VALUES
    ('Norteamérica'),
    ('Latinoamérica'),
    ('Europa'),
    ('Asia'),
    ('Oceanía'),
    ('Global'),
    ('México'),
    ('España'),
    ('Argentina'),
    ('Chile'),
    ('Colombia'),
    ('Perú')
ON CONFLICT (valor) DO NOTHING;

-- Tipos de entrada
INSERT INTO catalogo_tipo_entrada (valor) VALUES
    ('gratis'),
    ('pago'),
    ('invitacion'),
    ('touch')
ON CONFLICT (valor) DO NOTHING;

-- Tipos de item
INSERT INTO catalogo_tipo_item (valor) VALUES
    ('creditos'),
    ('membresia'),
    ('servicio'),
    ('avatar'),
    ('banner')
ON CONFLICT (valor) DO NOTHING;

-- Tipos de torneo
INSERT INTO catalogo_tipo_torneo (valor, descripcion, tipo_trofeo) VALUES
    ('eliminacion_simple', 'Eliminación simple - Un jugador pierde y queda eliminado', 'trofeo_eliminacion'),
    ('eliminacion_doble', 'Eliminación doble - Un jugador debe perder dos veces para ser eliminado', 'trofeo_eliminacion_doble'),
    ('todos_contra_todos', 'Round Robin - Todos juegan contra todos', 'trofeo_round_robin'),
    ('grupos', 'Fase de grupos con eliminatorias', 'trofeo_grupos'),
    ('suizo', 'Sistema suizo - Emparejamientos según rendimiento', 'trofeo_suizo')
ON CONFLICT (valor) DO NOTHING;

-- Tipos de transacción
INSERT INTO catalogo_transaccion_tipo (valor) VALUES
    ('deposito'),
    ('retiro'),
    ('compra'),
    ('premio'),
    ('reembolso'),
    ('saldo'),
    ('creditos'),
    ('inscripcion')
ON CONFLICT (valor) DO NOTHING;

-- Membresías
INSERT INTO membresia_tipo (nombre, precio, duracion_dias, beneficios) VALUES
    ('Gratuita', 0, 0, 'Acceso básico a la plataforma|Participación en torneos gratuitos|Perfil público básico'),
    ('Premium Mensual', 4.99, 30, 'Sin anuncios|Acceso anticipado a torneos|Estadísticas avanzadas|Badge exclusivo'),
    ('Premium Trimestral', 9.99, 90, 'Todo lo del mensual|Descuento del 28%|Soporte prioritario'),
    ('Premium Semestral', 19.99, 180, 'Todo lo del trimestral|Descuento del 30%|Personalización extra'),
    ('Premium Anual', 39.99, 365, 'Todo lo del semestral|Descuento del 30%|Contenido exclusivo')
ON CONFLICT DO NOTHING;

-- Items de tienda - Créditos
INSERT INTO tienda_item (nombre, descripcion, precio, creditos_otorgados, tipo_id, metadata)
SELECT 
    nombre, descripcion, precio, creditos_otorgados, tipo_id, metadata::jsonb
FROM (VALUES
    ('100 Créditos', 'Paquete básico de créditos', 0.99, 100, 
        (SELECT id FROM catalogo_tipo_item WHERE valor = 'creditos'), 
        '{"destacado": false}'),
    ('500 Créditos', 'Paquete popular de créditos', 4.49, 500, 
        (SELECT id FROM catalogo_tipo_item WHERE valor = 'creditos'), 
        '{"destacado": true, "mejorValor": false}'),
    ('1000 Créditos', 'Paquete premium de créditos', 7.99, 1000, 
        (SELECT id FROM catalogo_tipo_item WHERE valor = 'creditos'), 
        '{"destacado": false, "mejorValor": true}'),
    ('2500 Créditos', 'Paquete mega de créditos', 17.99, 2500, 
        (SELECT id FROM catalogo_tipo_item WHERE valor = 'creditos'), 
        '{"destacado": false}'),
    ('5000 Créditos', 'Paquete ultra de créditos', 29.99, 5000, 
        (SELECT id FROM catalogo_tipo_item WHERE valor = 'creditos'), 
        '{"destacado": false, "mejorValor": true}')
) AS t(nombre, descripcion, precio, creditos_otorgados, tipo_id, metadata)
WHERE NOT EXISTS (SELECT 1 FROM tienda_item ti WHERE ti.nombre = t.nombre);

-- Items de tienda - Membresías (dinámico basado en membresia_tipo)
INSERT INTO tienda_item (nombre, descripcion, precio, tipo_id, metadata)
SELECT 
    'Membresía ' || mt.nombre,
    mt.beneficios,
    mt.precio,
    (SELECT id FROM catalogo_tipo_item WHERE valor = 'membresia'),
    jsonb_build_object(
        'membresiaTipoId', mt.id::text,
        'duracionDias', mt.duracion_dias
    )
FROM membresia_tipo mt
WHERE mt.precio > 0
AND NOT EXISTS (
    SELECT 1 FROM tienda_item ti 
    WHERE ti.nombre = 'Membresía ' || mt.nombre
);

-- Items de tienda - Servicios
INSERT INTO tienda_item (nombre, descripcion, precio, tipo_id, metadata)
SELECT 
    nombre, descripcion, precio, tipo_id, metadata::jsonb
FROM (VALUES
    ('Cambio de Nickname', 'Cambia tu nombre de usuario una vez', 2.99,
        (SELECT id FROM catalogo_tipo_item WHERE valor = 'servicio'),
        '{"servicioTipo": "cambio_nickname", "requiereSoporte": false}'),
    ('Reiniciar Récord de Juego', 'Reinicia todas tus estadísticas de juego', 4.99,
        (SELECT id FROM catalogo_tipo_item WHERE valor = 'servicio'),
        '{"servicioTipo": "reset_record", "advertencia": "Esta acción no se puede deshacer", "requiereSoporte": false}'),
    ('Reiniciar Estadísticas', 'Reinicia solo victorias/derrotas/empates', 1.99,
        (SELECT id FROM catalogo_tipo_item WHERE valor = 'servicio'),
        '{"servicioTipo": "reset_stats", "advertencia": "Esta acción no se puede deshacer", "requiereSoporte": false}'),
    ('Reclamar Nickname Inactivo', 'Solicita un nickname de una cuenta inactiva (+6 meses)', 9.99,
        (SELECT id FROM catalogo_tipo_item WHERE valor = 'servicio'),
        '{"servicioTipo": "reclamar_nickname", "requiereSoporte": true, "advertencia": "Sujeto a revisión del equipo"}')
) AS t(nombre, descripcion, precio, tipo_id, metadata)
WHERE NOT EXISTS (SELECT 1 FROM tienda_item ti WHERE ti.nombre = t.nombre);

-- Juegos populares
INSERT INTO juego (nombre, descripcion) VALUES
    ('Call of Duty: Warzone', 'Battle Royale gratuito de la franquicia Call of Duty'),
    ('Fortnite', 'Battle Royale con construcción de Epic Games'),
    ('League of Legends', 'MOBA competitivo de Riot Games'),
    ('Valorant', 'Shooter táctico 5v5 de Riot Games'),
    ('Apex Legends', 'Battle Royale de escuadrones de EA'),
    ('Counter-Strike 2', 'Shooter táctico competitivo de Valve'),
    ('Rocket League', 'Fútbol con autos de Psyonix'),
    ('FIFA 24', 'Simulador de fútbol de EA Sports'),
    ('Super Smash Bros. Ultimate', 'Juego de peleas crossover de Nintendo'),
    ('Street Fighter 6', 'Juego de peleas de Capcom'),
    ('Tekken 8', 'Juego de peleas 3D de Bandai Namco'),
    ('Dota 2', 'MOBA competitivo de Valve'),
    ('Overwatch 2', 'Hero shooter de Blizzard'),
    ('PUBG: Battlegrounds', 'Battle Royale original de KRAFTON'),
    ('Rainbow Six Siege', 'Shooter táctico de Ubisoft')
ON CONFLICT (nombre) DO NOTHING;

-- Modos de juego (ejemplo para algunos juegos)
INSERT INTO modo_juego (juego_id, nombre, descripcion)
SELECT j.id, m.nombre, m.descripcion
FROM juego j
CROSS JOIN (VALUES
    ('Battle Royale Solo', 'Último jugador en pie'),
    ('Battle Royale Dúos', 'Equipos de 2 jugadores'),
    ('Battle Royale Tríos', 'Equipos de 3 jugadores'),
    ('Battle Royale Cuartetos', 'Equipos de 4 jugadores')
) AS m(nombre, descripcion)
WHERE j.nombre = 'Call of Duty: Warzone'
AND NOT EXISTS (
    SELECT 1 FROM modo_juego mj WHERE mj.juego_id = j.id AND mj.nombre = m.nombre
);

INSERT INTO modo_juego (juego_id, nombre, descripcion)
SELECT j.id, m.nombre, m.descripcion
FROM juego j
CROSS JOIN (VALUES
    ('Solo', 'Battle Royale individual'),
    ('Dúos', 'Equipos de 2'),
    ('Tríos', 'Equipos de 3'),
    ('Escuadrones', 'Equipos de 4')
) AS m(nombre, descripcion)
WHERE j.nombre = 'Fortnite'
AND NOT EXISTS (
    SELECT 1 FROM modo_juego mj WHERE mj.juego_id = j.id AND mj.nombre = m.nombre
);

INSERT INTO modo_juego (juego_id, nombre, descripcion)
SELECT j.id, m.nombre, m.descripcion
FROM juego j
CROSS JOIN (VALUES
    ('Grieta del Invocador 5v5', 'Modo competitivo estándar'),
    ('ARAM', 'All Random All Mid')
) AS m(nombre, descripcion)
WHERE j.nombre = 'League of Legends'
AND NOT EXISTS (
    SELECT 1 FROM modo_juego mj WHERE mj.juego_id = j.id AND mj.nombre = m.nombre
);

INSERT INTO modo_juego (juego_id, nombre, descripcion)
SELECT j.id, m.nombre, m.descripcion
FROM juego j
CROSS JOIN (VALUES
    ('Competitivo', 'Modo rankeado 5v5'),
    ('Sin clasificar', 'Partidas casuales 5v5')
) AS m(nombre, descripcion)
WHERE j.nombre = 'Valorant'
AND NOT EXISTS (
    SELECT 1 FROM modo_juego mj WHERE mj.juego_id = j.id AND mj.nombre = m.nombre
);

-- Relaciones Juego-Plataforma
INSERT INTO juego_plataformas ("juegoId", "catalogoPlataformaId")
SELECT j.id, p.id
FROM juego j, catalogo_plataforma p
WHERE j.nombre IN ('Call of Duty: Warzone', 'Fortnite', 'Apex Legends')
AND p.valor IN ('PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X/S', 'Xbox One')
AND NOT EXISTS (
    SELECT 1 FROM juego_plataformas jp 
    WHERE jp."juegoId" = j.id AND jp."catalogoPlataformaId" = p.id
);

INSERT INTO juego_plataformas ("juegoId", "catalogoPlataformaId")
SELECT j.id, p.id
FROM juego j, catalogo_plataforma p
WHERE j.nombre IN ('League of Legends', 'Valorant', 'Counter-Strike 2', 'Dota 2')
AND p.valor = 'PC'
AND NOT EXISTS (
    SELECT 1 FROM juego_plataformas jp 
    WHERE jp."juegoId" = j.id AND jp."catalogoPlataformaId" = p.id
);

-- =====================================================
-- FIN DE LA INICIALIZACIÓN DE DATOS
-- =====================================================

SELECT 'Base de datos inicializada correctamente' as resultado;

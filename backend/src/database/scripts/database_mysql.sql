-- Script convertido para MySQL Workbench
-- Basado en el esquema original de PostgreSQL

SET FOREIGN_KEY_CHECKS = 0;

-- =============================================
-- TABLAS DE CATÁLOGOS
-- =============================================

CREATE TABLE IF NOT EXISTS catalogo_avatar (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    nombre VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    seed VARCHAR(255) NOT NULL,
    categoria VARCHAR(255),
    disponible BOOLEAN NOT NULL DEFAULT TRUE,
    premium BOOLEAN NOT NULL DEFAULT FALSE,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY UQ_catalogo_avatar_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS catalogo_estado_amistad (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    valor VARCHAR(255) NOT NULL,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY UQ_catalogo_estado_amistad_valor (valor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS catalogo_estado_inscripcion (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    valor VARCHAR(255) NOT NULL,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY UQ_catalogo_estado_inscripcion_valor (valor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS catalogo_estado_torneo (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    valor VARCHAR(255) NOT NULL,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY UQ_catalogo_estado_torneo_valor (valor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS catalogo_genero (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    valor VARCHAR(255) NOT NULL,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY UQ_catalogo_genero_valor (valor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS catalogo_origen_transaccion (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    valor VARCHAR(255) NOT NULL,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY UQ_catalogo_origen_transaccion_valor (valor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS catalogo_plataforma (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    valor VARCHAR(255) NOT NULL,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY UQ_catalogo_plataforma_valor (valor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS catalogo_region (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    valor VARCHAR(255) NOT NULL,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY UQ_catalogo_region_valor (valor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS catalogo_rol (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    valor VARCHAR(255) NOT NULL,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY UQ_catalogo_rol_valor (valor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS catalogo_tipo_entrada (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    valor VARCHAR(255) NOT NULL,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY UQ_catalogo_tipo_entrada_valor (valor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS catalogo_tipo_item (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    valor VARCHAR(255) NOT NULL,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY UQ_catalogo_tipo_item_valor (valor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS catalogo_tipo_torneo (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    valor VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo_trofeo VARCHAR(255) NOT NULL,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY UQ_catalogo_tipo_torneo_valor (valor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS catalogo_transaccion_tipo (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    valor VARCHAR(255) NOT NULL,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY UQ_catalogo_transaccion_tipo_valor (valor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLAS PRINCIPALES
-- =============================================

CREATE TABLE IF NOT EXISTS persona (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    p_nombre VARCHAR(255) NOT NULL,
    s_nombre VARCHAR(255),
    p_apellido VARCHAR(255) NOT NULL,
    s_apellido VARCHAR(255),
    correo VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE,
    timezone VARCHAR(255),
    correo_paypal VARCHAR(255),
    telefono VARCHAR(255),
    direccion VARCHAR(255),
    ciudad VARCHAR(255),
    estado VARCHAR(255),
    codigo_postal VARCHAR(255),
    pais VARCHAR(255),
    divisa VARCHAR(255) DEFAULT 'USD',
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    genero_id CHAR(36),
    PRIMARY KEY (id),
    UNIQUE KEY UQ_persona_correo (correo),
    KEY FK_persona_genero (genero_id),
    CONSTRAINT FK_persona_genero FOREIGN KEY (genero_id) REFERENCES catalogo_genero (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS usuario (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    nickname VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'activo',
    ultima_conexion TIMESTAMP NULL,
    xp INT NOT NULL DEFAULT 0,
    saldo DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    creditos INT NOT NULL DEFAULT 0,
    foto_perfil VARCHAR(255),
    biografia VARCHAR(300),
    desafios_habilitados BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    persona_id CHAR(36),
    rol_id CHAR(36) NOT NULL,
    avatar_id CHAR(36),
    PRIMARY KEY (id),
    UNIQUE KEY UQ_usuario_nickname (nickname),
    UNIQUE KEY UQ_usuario_persona (persona_id),
    KEY FK_usuario_rol (rol_id),
    KEY FK_usuario_avatar (avatar_id),
    CONSTRAINT FK_usuario_persona FOREIGN KEY (persona_id) REFERENCES persona (id),
    CONSTRAINT FK_usuario_rol FOREIGN KEY (rol_id) REFERENCES catalogo_rol (id),
    CONSTRAINT FK_usuario_avatar FOREIGN KEY (avatar_id) REFERENCES catalogo_avatar (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS juego (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY UQ_juego_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS juego_plataformas (
    juego_id CHAR(36) NOT NULL,
    catalogo_plataforma_id CHAR(36) NOT NULL,
    PRIMARY KEY (juego_id, catalogo_plataforma_id),
    KEY FK_juego_plataformas_plataforma (catalogo_plataforma_id),
    CONSTRAINT FK_juego_plataformas_juego FOREIGN KEY (juego_id) REFERENCES juego (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_juego_plataformas_plataforma FOREIGN KEY (catalogo_plataforma_id) REFERENCES catalogo_plataforma (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS modo_juego (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    juego_id CHAR(36),
    PRIMARY KEY (id),
    KEY FK_modo_juego_juego (juego_id),
    CONSTRAINT FK_modo_juego_juego FOREIGN KEY (juego_id) REFERENCES juego (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS equipo (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    avatar_url VARCHAR(255),
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    creado_por CHAR(36),
    PRIMARY KEY (id),
    UNIQUE KEY UQ_equipo_nombre (nombre),
    KEY FK_equipo_creador (creado_por),
    CONSTRAINT FK_equipo_creador FOREIGN KEY (creado_por) REFERENCES usuario (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS equipo_miembros (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    rol VARCHAR(255) NOT NULL DEFAULT 'miembro',
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    equipo_id CHAR(36),
    usuario_id CHAR(36),
    PRIMARY KEY (id),
    KEY FK_equipo_miembros_equipo (equipo_id),
    KEY FK_equipo_miembros_usuario (usuario_id),
    CONSTRAINT FK_equipo_miembros_equipo FOREIGN KEY (equipo_id) REFERENCES equipo (id) ON DELETE CASCADE,
    CONSTRAINT FK_equipo_miembros_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS logro (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS membresia_tipo (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    nombre VARCHAR(255) NOT NULL,
    precio DECIMAL(12, 2) NOT NULL,
    duracion_dias INT NOT NULL,
    beneficios TEXT,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLAS DE TIENDA
-- =============================================

CREATE TABLE IF NOT EXISTS tienda_item (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(12, 2) NOT NULL,
    creditos_otorgados INT,
    metadata JSON,
    tipo_id CHAR(36) NOT NULL,
    PRIMARY KEY (id),
    KEY FK_tienda_item_tipo (tipo_id),
    CONSTRAINT FK_tienda_item_tipo FOREIGN KEY (tipo_id) REFERENCES catalogo_tipo_item (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tienda_orden (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    usuario_id CHAR(36) NOT NULL,
    item_id CHAR(36) NOT NULL,
    paypal_order_id VARCHAR(255),
    paypal_capture_id VARCHAR(255),
    paypal_payer_id VARCHAR(255),
    paypal_payer_email VARCHAR(255),
    monto DECIMAL(12, 2) NOT NULL,
    divisa VARCHAR(3) NOT NULL DEFAULT 'USD',
    estado VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    metadata JSON NOT NULL DEFAULT (JSON_OBJECT()),
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completado_en TIMESTAMP NULL,
    actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY FK_tienda_orden_usuario (usuario_id),
    KEY FK_tienda_orden_item (item_id),
    CONSTRAINT FK_tienda_orden_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE,
    CONSTRAINT FK_tienda_orden_item FOREIGN KEY (item_id) REFERENCES tienda_item (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tienda_solicitud_soporte (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    orden_id CHAR(36),
    usuario_id CHAR(36) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    nickname_solicitado VARCHAR(255),
    estado VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    notas_admin TEXT,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resuelto_en TIMESTAMP NULL,
    resuelto_por CHAR(36),
    PRIMARY KEY (id),
    KEY FK_tienda_solicitud_orden (orden_id),
    KEY FK_tienda_solicitud_usuario (usuario_id),
    KEY FK_tienda_solicitud_resuelto_por (resuelto_por),
    CONSTRAINT FK_tienda_solicitud_orden FOREIGN KEY (orden_id) REFERENCES tienda_orden (id) ON DELETE SET NULL,
    CONSTRAINT FK_tienda_solicitud_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE,
    CONSTRAINT FK_tienda_solicitud_resuelto_por FOREIGN KEY (resuelto_por) REFERENCES usuario (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLAS DE TORNEOS
-- =============================================

CREATE TABLE IF NOT EXISTS torneo (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_inicio_registro TIMESTAMP NULL,
    fecha_fin_registro TIMESTAMP NULL,
    fecha_inicio_torneo TIMESTAMP NULL,
    tipo_torneo VARCHAR(255),
    al_mejor_de INT NOT NULL DEFAULT 1,
    formato VARCHAR(255),
    cerrado BOOLEAN NOT NULL DEFAULT FALSE,
    reglas TEXT,
    jugadores_pc_permitidos BOOLEAN NOT NULL DEFAULT TRUE,
    requiere_transmision BOOLEAN NOT NULL DEFAULT FALSE,
    requiere_camara BOOLEAN NOT NULL DEFAULT FALSE,
    capacidad INT,
    anfitrion_id CHAR(36) NOT NULL,
    juego_id CHAR(36),
    plataforma_id CHAR(36),
    modo_juego_id CHAR(36),
    region_id CHAR(36) NOT NULL,
    tipo_entrada_id CHAR(36) NOT NULL,
    estado_id CHAR(36),
    tipo_torneo_id CHAR(36),
    banner_url VARCHAR(255),
    miniatura_url VARCHAR(255),
    contacto_anfitrion VARCHAR(255),
    discord_servidor VARCHAR(255),
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY FK_torneo_anfitrion (anfitrion_id),
    KEY FK_torneo_juego (juego_id),
    KEY FK_torneo_plataforma (plataforma_id),
    KEY FK_torneo_modo_juego (modo_juego_id),
    KEY FK_torneo_region (region_id),
    KEY FK_torneo_tipo_entrada (tipo_entrada_id),
    KEY FK_torneo_estado (estado_id),
    KEY FK_torneo_tipo_torneo (tipo_torneo_id),
    CONSTRAINT FK_torneo_anfitrion FOREIGN KEY (anfitrion_id) REFERENCES usuario (id),
    CONSTRAINT FK_torneo_juego FOREIGN KEY (juego_id) REFERENCES juego (id),
    CONSTRAINT FK_torneo_plataforma FOREIGN KEY (plataforma_id) REFERENCES catalogo_plataforma (id),
    CONSTRAINT FK_torneo_modo_juego FOREIGN KEY (modo_juego_id) REFERENCES modo_juego (id),
    CONSTRAINT FK_torneo_region FOREIGN KEY (region_id) REFERENCES catalogo_region (id),
    CONSTRAINT FK_torneo_tipo_entrada FOREIGN KEY (tipo_entrada_id) REFERENCES catalogo_tipo_entrada (id),
    CONSTRAINT FK_torneo_estado FOREIGN KEY (estado_id) REFERENCES catalogo_estado_torneo (id),
    CONSTRAINT FK_torneo_tipo_torneo FOREIGN KEY (tipo_torneo_id) REFERENCES catalogo_tipo_torneo (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS torneo_inscripcion (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    torneo_id CHAR(36),
    usuario_id CHAR(36) NOT NULL,
    estado_id CHAR(36) NOT NULL,
    PRIMARY KEY (id),
    KEY FK_torneo_inscripcion_torneo (torneo_id),
    KEY FK_torneo_inscripcion_usuario (usuario_id),
    KEY FK_torneo_inscripcion_estado (estado_id),
    CONSTRAINT FK_torneo_inscripcion_torneo FOREIGN KEY (torneo_id) REFERENCES torneo (id) ON DELETE CASCADE,
    CONSTRAINT FK_torneo_inscripcion_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id),
    CONSTRAINT FK_torneo_inscripcion_estado FOREIGN KEY (estado_id) REFERENCES catalogo_estado_inscripcion (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS torneo_premios (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    cuota INT,
    fondo_total DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    fondo_despues_comision DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    comision_porcentaje DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    ganador1_porcentaje DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    ganador2_porcentaje DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    comision_total DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    torneo_id CHAR(36),
    PRIMARY KEY (id),
    UNIQUE KEY UQ_torneo_premios_torneo (torneo_id),
    CONSTRAINT FK_torneo_premios_torneo FOREIGN KEY (torneo_id) REFERENCES torneo (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS torneo_redes (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    plataforma VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    torneo_id CHAR(36),
    PRIMARY KEY (id),
    KEY FK_torneo_redes_torneo (torneo_id),
    CONSTRAINT FK_torneo_redes_torneo FOREIGN KEY (torneo_id) REFERENCES torneo (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS torneo_resultados (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    posicion INT NOT NULL,
    torneo_id CHAR(36),
    usuario_id CHAR(36),
    PRIMARY KEY (id),
    KEY FK_torneo_resultados_torneo (torneo_id),
    KEY FK_torneo_resultados_usuario (usuario_id),
    CONSTRAINT FK_torneo_resultados_torneo FOREIGN KEY (torneo_id) REFERENCES torneo (id) ON DELETE CASCADE,
    CONSTRAINT FK_torneo_resultados_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLAS DE TRANSACCIONES
-- =============================================

CREATE TABLE IF NOT EXISTS transaccion (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    monto DECIMAL(12, 2) NOT NULL,
    descripcion VARCHAR(255),
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    usuario_id CHAR(36),
    tipo_id CHAR(36) NOT NULL,
    origen_id CHAR(36) NOT NULL,
    PRIMARY KEY (id),
    KEY FK_transaccion_usuario (usuario_id),
    KEY FK_transaccion_tipo (tipo_id),
    KEY FK_transaccion_origen (origen_id),
    CONSTRAINT FK_transaccion_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE,
    CONSTRAINT FK_transaccion_tipo FOREIGN KEY (tipo_id) REFERENCES catalogo_transaccion_tipo (id),
    CONSTRAINT FK_transaccion_origen FOREIGN KEY (origen_id) REFERENCES catalogo_origen_transaccion (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLAS DE USUARIO (RELACIONES)
-- =============================================

CREATE TABLE IF NOT EXISTS usuario_amigos (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    usuario1_id CHAR(36),
    usuario2_id CHAR(36),
    estado_id CHAR(36) NOT NULL,
    PRIMARY KEY (id),
    KEY FK_usuario_amigos_usuario1 (usuario1_id),
    KEY FK_usuario_amigos_usuario2 (usuario2_id),
    KEY FK_usuario_amigos_estado (estado_id),
    CONSTRAINT FK_usuario_amigos_usuario1 FOREIGN KEY (usuario1_id) REFERENCES usuario (id) ON DELETE CASCADE,
    CONSTRAINT FK_usuario_amigos_usuario2 FOREIGN KEY (usuario2_id) REFERENCES usuario (id) ON DELETE CASCADE,
    CONSTRAINT FK_usuario_amigos_estado FOREIGN KEY (estado_id) REFERENCES catalogo_estado_amistad (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS usuario_cuenta_juego (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    identificador VARCHAR(255) NOT NULL,
    usuario_id CHAR(36),
    plataforma_juego_id CHAR(36) NOT NULL,
    PRIMARY KEY (id),
    KEY FK_usuario_cuenta_juego_usuario (usuario_id),
    KEY FK_usuario_cuenta_juego_plataforma (plataforma_juego_id),
    CONSTRAINT FK_usuario_cuenta_juego_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE,
    CONSTRAINT FK_usuario_cuenta_juego_plataforma FOREIGN KEY (plataforma_juego_id) REFERENCES catalogo_plataforma (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS usuario_estadisticas_juego (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    victorias INT NOT NULL DEFAULT 0,
    derrotas INT NOT NULL DEFAULT 0,
    empates INT NOT NULL DEFAULT 0,
    nivel_rango VARCHAR(255),
    horas_jugadas INT NOT NULL DEFAULT 0,
    actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    usuario_id CHAR(36),
    juego_id CHAR(36),
    PRIMARY KEY (id),
    KEY FK_usuario_estadisticas_usuario (usuario_id),
    KEY FK_usuario_estadisticas_juego (juego_id),
    CONSTRAINT FK_usuario_estadisticas_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id),
    CONSTRAINT FK_usuario_estadisticas_juego FOREIGN KEY (juego_id) REFERENCES juego (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS usuario_logros (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    usuario_id CHAR(36),
    logro_id CHAR(36),
    PRIMARY KEY (id),
    KEY FK_usuario_logros_usuario (usuario_id),
    KEY FK_usuario_logros_logro (logro_id),
    CONSTRAINT FK_usuario_logros_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE,
    CONSTRAINT FK_usuario_logros_logro FOREIGN KEY (logro_id) REFERENCES logro (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS usuario_membresias (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    activa BOOLEAN NOT NULL DEFAULT TRUE,
    usuario_id CHAR(36),
    membresia_tipo_id CHAR(36),
    PRIMARY KEY (id),
    KEY FK_usuario_membresias_usuario (usuario_id),
    KEY FK_usuario_membresias_tipo (membresia_tipo_id),
    CONSTRAINT FK_usuario_membresias_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE,
    CONSTRAINT FK_usuario_membresias_tipo FOREIGN KEY (membresia_tipo_id) REFERENCES membresia_tipo (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS usuario_red_social (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    plataforma VARCHAR(255) NOT NULL,
    enlace VARCHAR(255) NOT NULL,
    usuario_id CHAR(36),
    PRIMARY KEY (id),
    KEY FK_usuario_red_social_usuario (usuario_id),
    CONSTRAINT FK_usuario_red_social_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS usuario_seguidores (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    seguidor_id CHAR(36),
    seguido_id CHAR(36),
    PRIMARY KEY (id),
    KEY FK_usuario_seguidores_seguidor (seguidor_id),
    KEY FK_usuario_seguidores_seguido (seguido_id),
    CONSTRAINT FK_usuario_seguidores_seguidor FOREIGN KEY (seguidor_id) REFERENCES usuario (id) ON DELETE CASCADE,
    CONSTRAINT FK_usuario_seguidores_seguido FOREIGN KEY (seguido_id) REFERENCES usuario (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS usuario_trofeos (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    tipo_trofeo VARCHAR(255) NOT NULL,
    ganado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    usuario_id CHAR(36),
    torneo_id CHAR(36),
    PRIMARY KEY (id),
    KEY FK_usuario_trofeos_usuario (usuario_id),
    KEY FK_usuario_trofeos_torneo (torneo_id),
    CONSTRAINT FK_usuario_trofeos_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE,
    CONSTRAINT FK_usuario_trofeos_torneo FOREIGN KEY (torneo_id) REFERENCES torneo (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

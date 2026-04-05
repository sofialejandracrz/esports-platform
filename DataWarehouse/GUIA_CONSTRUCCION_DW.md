# Guia Secuencial Exacta de Construccion del Data Warehouse - eSports Platform

> Esta guia reemplaza el flujo anterior por una ejecucion unica, lineal y verificable.
> Se basa en las estructuras reales de:
> - Oracle: Script Maestro Oracle/BD/DO/DDL/03_TABLAS.sql
> - Oracle auditoria: Script Maestro Oracle/BD/DO/TRIGGER/01_TRIGGERS.sql
> - RRHH SQL Server: backend/src/database/scripts/base-rrhh.sql
> - Excel: DataWarehouse/Excel/generar_excel_dw.js
> - MongoDB: DataWarehouse/MongoDB/init_esports_analytics.js
> - CSV Mongo exportados: DataWarehouse/MongoDB/exports/*.csv

## Indice

1. Fase 0 - Preparacion de fuentes
2. Fase 1 - Creacion de DW_ESPORTS y DIM_TIEMPO
3. Fase 2 - Creacion de tablas de staging normalizado y esquema estrella
4. Fase 3 - Configuracion del proyecto SSIS
5. Fase 4 - Carga de staging desde Oracle, RRHH, Excel y Mongo CSV
6. Fase 5 - Normalizacion de staging Mongo
7. Fase 6 - Carga de dimensiones
8. Fase 7 - Carga de hechos (DM1, DM2, DM3, DM4)
9. Fase 8 - Ejecucion secuencial de paquetes SSIS
10. Fase 9 - Cubos SSAS
11. Fase 10 - Dashboards Power BI y verificacion final

## Reglas de ejecucion

1. Ejecutar las fases en el orden exacto del indice.
2. No saltar fases.
3. No ejecutar cargas de hechos antes de completar staging y dimensiones.
4. Oracle en SSIS se configura con servidor: localhost:1521/xe
5. MongoDB se integra mediante CSV exportado con mongoexport.

---

## Fase 0 - Preparacion de fuentes

### 0.1 Levantar contenedores

Desde la raiz del repositorio:

```powershell
docker compose up -d
docker compose -f docker-compose.mongo.yml up -d
```

### 0.2 Generar archivo Excel oficial de fuentes

```powershell
node .\DataWarehouse\Excel\generar_excel_dw.js
```

Esto genera:

- DataWarehouse/Excel/DW_Fuentes_Excel.xlsx
  - Hoja Presupuestos_Ventas con columnas:
    - anio
    - mes
    - region
    - categoria_producto
    - meta_ingresos_usd
    - meta_transacciones
    - responsable_rrhh_id
  - Hoja Lista_Negra con columnas:
    - tipo
    - valor
    - motivo
    - fecha_agregado
    - activo

### 0.3 Exportar MongoDB a CSV

```powershell
powershell -ExecutionPolicy Bypass -File .\DataWarehouse\MongoDB\export_mongo_dw.ps1
```

Esto genera:

- DataWarehouse/MongoDB/exports/logs_actividad_dw.csv
- DataWarehouse/MongoDB/exports/feedback_torneos_dw.csv

---

## Fase 1 - Creacion de DW_ESPORTS y DIM_TIEMPO

Ejecutar en SQL Server:

```sql
USE master;
GO

IF DB_ID('DW_ESPORTS') IS NULL
BEGIN
    CREATE DATABASE DW_ESPORTS;
END
GO

USE DW_ESPORTS;
GO

CREATE TABLE dim_tiempo (
    id_tiempo    INT         NOT NULL PRIMARY KEY,
    fecha        DATETIME    NULL,
    anio         INT         NULL,
    trimestre    INT         NULL,
    mes_nombre   VARCHAR(30) NULL,
    mes_numero   INT         NULL,
    semestre     INT         NULL
);
GO

CREATE OR ALTER PROCEDURE dbo.InsertarFecha
    @CurrentDate DATETIME
AS
BEGIN
    INSERT INTO dim_tiempo (id_tiempo, fecha, anio, trimestre, mes_nombre, mes_numero, semestre)
    VALUES (
        (DATEPART(YEAR, @CurrentDate) * 10000)
        + (DATEPART(MONTH, @CurrentDate) * 100)
        + DATEPART(DAY, @CurrentDate),
        @CurrentDate,
        DATEPART(YEAR, @CurrentDate),
        DATEPART(QUARTER, @CurrentDate),
        DATENAME(MONTH, @CurrentDate),
        DATEPART(MONTH, @CurrentDate),
        CASE WHEN DATEPART(QUARTER, @CurrentDate) < 3 THEN 1 ELSE 2 END
    );
END
GO

CREATE OR ALTER PROCEDURE dbo.CargarDimTiempo
AS
BEGIN
    DECLARE @StartDate DATETIME = '20000130';
    DECLARE @EndDate DATETIME = CAST(CAST(YEAR(GETDATE()) + 5 AS CHAR(4)) + '1231' AS DATETIME);

    WHILE @StartDate <= @EndDate
    BEGIN
        EXEC dbo.InsertarFecha @StartDate;
        SET @StartDate = DATEADD(DAY, 1, @StartDate);
    END
END
GO

EXEC dbo.CargarDimTiempo;
GO
```

---

## Fase 2 - Creacion de tablas de staging normalizado y esquema estrella

Ejecutar en SQL Server sobre DW_ESPORTS.

### 2.1 Staging normalizado

```sql
USE DW_ESPORTS;
GO

CREATE TABLE stg_oracle_catalogo_region (
    id_region      INT          NOT NULL PRIMARY KEY,
    nombre_region  VARCHAR(200) NOT NULL
);

CREATE TABLE stg_oracle_catalogo_tipo_item (
    id_tipo_item   INT          NOT NULL PRIMARY KEY,
    nombre_tipo    VARCHAR(100) NOT NULL
);

CREATE TABLE stg_oracle_catalogo_origen_transaccion (
    id_origen      INT          NOT NULL PRIMARY KEY,
    nombre_origen  VARCHAR(100) NOT NULL
);

CREATE TABLE stg_oracle_catalogo_tipo_torneo (
    id_tipo_torneo INT          NOT NULL PRIMARY KEY,
    nombre_tipo    VARCHAR(100) NOT NULL,
    tipo_trofeo    VARCHAR(100) NOT NULL
);

CREATE TABLE stg_oracle_catalogo_plataforma (
    id_plataforma       INT          NOT NULL PRIMARY KEY,
    nombre_plataforma   VARCHAR(100) NOT NULL
);

CREATE TABLE stg_oracle_catalogo_rol (
    id_rol       INT          NOT NULL PRIMARY KEY,
    nombre_rol   VARCHAR(100) NOT NULL
);

CREATE TABLE stg_oracle_catalogo_estado_inscripcion (
    id_estado      INT          NOT NULL PRIMARY KEY,
    valor_estado   VARCHAR(100) NOT NULL
);

CREATE TABLE stg_oracle_usuario (
    usuario_id   INT          NOT NULL PRIMARY KEY,
    nickname     VARCHAR(100) NOT NULL,
    estado       VARCHAR(50)  NOT NULL,
    xp           INT          NOT NULL,
    creado_en    DATETIME2    NULL,
    persona_id   INT          NULL,
    rol_id       INT          NOT NULL
);

CREATE TABLE stg_oracle_persona (
    persona_id   INT          NOT NULL PRIMARY KEY,
    pais         VARCHAR(100) NULL,
    divisa       VARCHAR(10)  NULL,
    correo       VARCHAR(200) NULL
);

CREATE TABLE stg_oracle_transaccion (
    transaccion_id   INT            NOT NULL PRIMARY KEY,
    monto            DECIMAL(12,2)  NOT NULL,
    descripcion      VARCHAR(500)   NULL,
    creado_en        DATETIME2      NOT NULL,
    usuario_id       INT            NULL,
    tipo_id          INT            NOT NULL,
    origen_id        INT            NOT NULL
);

CREATE TABLE stg_oracle_tienda_item (
    item_id             INT            NOT NULL PRIMARY KEY,
    nombre_item         VARCHAR(200)   NOT NULL,
    precio              DECIMAL(12,2)  NOT NULL,
    creditos_otorgados  INT            NULL,
    tipo_id             INT            NOT NULL
);

CREATE TABLE stg_oracle_tienda_orden (
    orden_id        INT            NOT NULL PRIMARY KEY,
    monto           DECIMAL(12,2)  NOT NULL,
    estado          VARCHAR(50)    NOT NULL,
    creado_en       DATETIME2      NOT NULL,
    completado_en   DATETIME2      NULL,
    usuario_id      INT            NOT NULL,
    item_id         INT            NOT NULL,
    divisa          VARCHAR(3)     NOT NULL
);

CREATE TABLE stg_oracle_juego (
    juego_id       INT          NOT NULL PRIMARY KEY,
    nombre_juego   VARCHAR(200) NOT NULL
);

CREATE TABLE stg_oracle_modo_juego (
    modo_juego_id   INT          NOT NULL PRIMARY KEY,
    nombre_modo     VARCHAR(200) NOT NULL,
    juego_id        INT          NULL
);

CREATE TABLE stg_oracle_torneo (
    torneo_id            INT         NOT NULL PRIMARY KEY,
    fecha_inicio_torneo  DATETIME2   NULL,
    juego_id             INT         NULL,
    modo_juego_id        INT         NULL,
    tipo_torneo_id       INT         NULL,
    plataforma_id        INT         NULL,
    region_id            INT         NOT NULL,
    capacidad            INT         NULL
);

CREATE TABLE stg_oracle_torneo_inscripcion (
    inscripcion_id   INT        NOT NULL PRIMARY KEY,
    fecha            DATETIME2  NOT NULL,
    torneo_id        INT        NULL,
    usuario_id       INT        NOT NULL,
    estado_id        INT        NOT NULL
);

CREATE TABLE stg_oracle_torneo_premios (
    torneo_id       INT            NOT NULL PRIMARY KEY,
    fondo_total     DECIMAL(12,2)  NOT NULL,
    comision_total  DECIMAL(12,2)  NOT NULL
);

CREATE TABLE stg_oracle_usuario_amigos (
    amistad_id     INT        NOT NULL PRIMARY KEY,
    creado_en      DATETIME2  NOT NULL,
    usuario1_id    INT        NULL,
    usuario2_id    INT        NULL,
    estado_id      INT        NOT NULL
);

CREATE TABLE stg_oracle_usuario_seguidores (
    seguimiento_id  INT        NOT NULL PRIMARY KEY,
    creado_en       DATETIME2  NOT NULL,
    seguidor_id     INT        NULL,
    seguido_id      INT        NULL
);

CREATE TABLE stg_oracle_usuario_estadisticas_juego (
    usuario_id     INT NOT NULL,
    juego_id       INT NULL,
    victorias      INT NOT NULL,
    horas_jugadas  INT NOT NULL
);

CREATE TABLE stg_oracle_auditoria_log (
    auditoria_id     INT           NOT NULL PRIMARY KEY,
    tabla_auditada   VARCHAR(100)  NOT NULL,
    operacion        VARCHAR(20)   NOT NULL,
    registro_id      INT           NULL,
    usuario_bd       VARCHAR(100)  NULL,
    detalle          VARCHAR(4000) NULL,
    fecha            DATETIME2     NOT NULL
);

CREATE TABLE stg_oracle_tienda_solicitud_soporte (
    solicitud_id   INT          NOT NULL PRIMARY KEY,
    tipo           VARCHAR(50)  NOT NULL,
    estado         VARCHAR(50)  NOT NULL,
    creado_en      DATETIME2    NOT NULL,
    resuelto_en    DATETIME2    NULL,
    usuario_id     INT          NOT NULL,
    resuelto_por   INT          NULL
);

CREATE TABLE stg_rrhh_empleado_historial (
    id_empleado      INT           NOT NULL,
    nombre_completo  VARCHAR(150)  NULL,
    cargo            VARCHAR(45)   NULL,
    departamento     VARCHAR(45)   NULL,
    version          INT           NOT NULL,
    version_actual   INT           NOT NULL,
    PRIMARY KEY (id_empleado, version)
);

CREATE TABLE stg_excel_presupuestos_ventas (
    anio                 INT            NOT NULL,
    mes                  INT            NOT NULL,
    region               VARCHAR(200)   NOT NULL,
    categoria_producto   VARCHAR(100)   NOT NULL,
    meta_ingresos_usd    DECIMAL(12,2)  NOT NULL,
    meta_transacciones   INT            NOT NULL,
    responsable_rrhh_id  INT            NOT NULL
);

CREATE TABLE stg_excel_lista_negra (
    tipo            VARCHAR(20)   NOT NULL,
    valor           VARCHAR(200)  NOT NULL,
    motivo          VARCHAR(500)  NULL,
    fecha_agregado  DATE          NULL,
    activo          INT           NOT NULL
);

CREATE TABLE stg_mongo_logs_actividad_raw (
    oracle_usuario_id                VARCHAR(50)   NULL,
    tipo_evento                      VARCHAR(100)  NULL,
    ip                               VARCHAR(50)   NULL,
    user_agent                       VARCHAR(500)  NULL,
    pais_origen                      VARCHAR(100)  NULL,
    timestamp_raw                    VARCHAR(100)  NULL,
    detalle_metodo                   VARCHAR(50)   NULL,
    detalle_exitoso                  VARCHAR(10)   NULL,
    detalle_duracion_sesion_min      VARCHAR(20)   NULL,
    detalle_termino                  VARCHAR(200)  NULL,
    detalle_resultados_encontrados   VARCHAR(20)   NULL,
    detalle_perfil_visitado_id       VARCHAR(20)   NULL,
    detalle_tiempo_visualizacion_seg VARCHAR(20)   NULL,
    detalle_desde_seccion            VARCHAR(100)  NULL,
    detalle_torneo_id                VARCHAR(20)   NULL,
    detalle_accion                   VARCHAR(100)  NULL,
    detalle_item_id                  VARCHAR(20)   NULL,
    detalle_categoria                VARCHAR(100)  NULL,
    detalle_seccion                  VARCHAR(100)  NULL,
    detalle_campo_modificado         VARCHAR(100)  NULL,
    detalle_destinatario_id          VARCHAR(20)   NULL
);

CREATE TABLE stg_mongo_feedback_torneos_raw (
    oracle_torneo_id    VARCHAR(20)   NULL,
    oracle_usuario_id   VARCHAR(20)   NULL,
    calificacion        VARCHAR(20)   NULL,
    comentario          VARCHAR(500)  NULL,
    tags                VARCHAR(1000) NULL,
    recomendaria        VARCHAR(10)   NULL,
    timestamp_raw       VARCHAR(100)  NULL
);

CREATE TABLE stg_mongo_logs_actividad_evento (
    oracle_usuario_id                INT          NULL,
    tipo_evento                      VARCHAR(100) NULL,
    ip                               VARCHAR(50)  NULL,
    user_agent                       VARCHAR(500) NULL,
    pais_origen                      VARCHAR(100) NULL,
    timestamp_evento                 DATETIME2    NULL,
    detalle_metodo                   VARCHAR(50)  NULL,
    detalle_exitoso                  INT          NULL,
    detalle_duracion_sesion_min      INT          NULL,
    detalle_termino                  VARCHAR(200) NULL,
    detalle_resultados_encontrados   INT          NULL,
    detalle_perfil_visitado_id       INT          NULL,
    detalle_tiempo_visualizacion_seg INT          NULL,
    detalle_desde_seccion            VARCHAR(100) NULL,
    detalle_torneo_id                INT          NULL,
    detalle_accion                   VARCHAR(100) NULL,
    detalle_item_id                  INT          NULL,
    detalle_categoria                VARCHAR(100) NULL,
    detalle_seccion                  VARCHAR(100) NULL,
    detalle_campo_modificado         VARCHAR(100) NULL,
    detalle_destinatario_id          INT          NULL
);

CREATE TABLE stg_mongo_feedback_torneos_evento (
    oracle_torneo_id   INT           NULL,
    oracle_usuario_id  INT           NULL,
    calificacion       INT           NULL,
    comentario         VARCHAR(500)  NULL,
    tags               VARCHAR(1000) NULL,
    recomendaria       INT           NULL,
    timestamp_evento   DATETIME2     NULL
);
GO
```

### 2.2 Esquema estrella de los 4 datamarts

```sql
USE DW_ESPORTS;
GO

CREATE TABLE dim_region (
    id_region      INT          NOT NULL PRIMARY KEY,
    nombre_region  VARCHAR(200) NOT NULL
);

CREATE TABLE dim_tipo_item (
    id_tipo_item   INT          NOT NULL PRIMARY KEY,
    nombre_tipo    VARCHAR(100) NOT NULL
);

CREATE TABLE dim_origen_transaccion (
    id_origen      INT          NOT NULL PRIMARY KEY,
    nombre_origen  VARCHAR(100) NOT NULL
);

CREATE TABLE dim_usuario_comprador (
    id_usuario      INT           NOT NULL PRIMARY KEY,
    nickname        VARCHAR(100)  NULL,
    pais            VARCHAR(100)  NULL,
    divisa          VARCHAR(10)   NULL,
    fecha_registro  DATETIME2     NULL
);

CREATE TABLE dim_responsable_rrhh (
    id_empleado      INT           NOT NULL,
    nombre_completo  VARCHAR(150)  NULL,
    cargo            VARCHAR(45)   NULL,
    departamento     VARCHAR(45)   NULL,
    version          INT           NOT NULL,
    version_actual   INT           NOT NULL,
    PRIMARY KEY (id_empleado, version)
);

CREATE TABLE fact_ingresos (
    id_dim_tiempo        INT            NOT NULL,
    id_dim_region        INT            NOT NULL,
    id_dim_tipo_item     INT            NOT NULL,
    id_dim_origen        INT            NOT NULL,
    id_dim_usuario       INT            NOT NULL,
    id_dim_responsable   INT            NULL,
    version_responsable  INT            NULL,
    monto_real           DECIMAL(12,2)  NULL,
    meta_ingresos        DECIMAL(12,2)  NULL,
    creditos_otorgados   INT            NULL,
    cantidad             INT            NOT NULL DEFAULT 1,
    CONSTRAINT FK_fact_ingresos_tiempo FOREIGN KEY (id_dim_tiempo) REFERENCES dim_tiempo(id_tiempo),
    CONSTRAINT FK_fact_ingresos_region FOREIGN KEY (id_dim_region) REFERENCES dim_region(id_region),
    CONSTRAINT FK_fact_ingresos_tipo_item FOREIGN KEY (id_dim_tipo_item) REFERENCES dim_tipo_item(id_tipo_item),
    CONSTRAINT FK_fact_ingresos_origen FOREIGN KEY (id_dim_origen) REFERENCES dim_origen_transaccion(id_origen),
    CONSTRAINT FK_fact_ingresos_usuario FOREIGN KEY (id_dim_usuario) REFERENCES dim_usuario_comprador(id_usuario),
    CONSTRAINT FK_fact_ingresos_responsable FOREIGN KEY (id_dim_responsable, version_responsable)
        REFERENCES dim_responsable_rrhh(id_empleado, version)
);

CREATE TABLE dim_usuario (
    id_usuario       INT           NOT NULL PRIMARY KEY,
    nickname         VARCHAR(100)  NULL,
    xp               INT           NULL,
    estado           VARCHAR(50)   NULL,
    pais             VARCHAR(100)  NULL,
    fecha_registro   DATETIME2     NULL
);

CREATE TABLE dim_juego (
    id_juego        INT           NOT NULL PRIMARY KEY,
    nombre_juego    VARCHAR(200)  NOT NULL
);

CREATE TABLE dim_tipo_evento (
    id_tipo_evento  INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    nombre_evento   VARCHAR(100)      NOT NULL
);

CREATE TABLE dim_pais (
    id_pais       INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    nombre_pais   VARCHAR(100)      NOT NULL
);

CREATE TABLE fact_actividad_usuario (
    id_dim_tiempo      INT NOT NULL,
    id_dim_usuario     INT NOT NULL,
    id_dim_juego       INT NOT NULL,
    id_dim_tipo_evento INT NOT NULL,
    id_dim_pais        INT NOT NULL,
    total_amigos       INT NULL,
    total_seguidores   INT NULL,
    xp_acumulado       INT NULL,
    cantidad_eventos   INT NOT NULL DEFAULT 1,
    tiempo_sesion_seg  INT NULL,
    victorias          INT NULL,
    horas_jugadas      INT NULL,
    CONSTRAINT FK_fact_actividad_tiempo FOREIGN KEY (id_dim_tiempo) REFERENCES dim_tiempo(id_tiempo),
    CONSTRAINT FK_fact_actividad_usuario FOREIGN KEY (id_dim_usuario) REFERENCES dim_usuario(id_usuario),
    CONSTRAINT FK_fact_actividad_juego FOREIGN KEY (id_dim_juego) REFERENCES dim_juego(id_juego),
    CONSTRAINT FK_fact_actividad_evento FOREIGN KEY (id_dim_tipo_evento) REFERENCES dim_tipo_evento(id_tipo_evento),
    CONSTRAINT FK_fact_actividad_pais FOREIGN KEY (id_dim_pais) REFERENCES dim_pais(id_pais)
);

CREATE TABLE dim_modo_juego (
    id_modo_juego  INT          NOT NULL PRIMARY KEY,
    nombre_modo    VARCHAR(200) NOT NULL,
    nombre_juego   VARCHAR(200) NOT NULL
);

CREATE TABLE dim_tipo_torneo (
    id_tipo_torneo  INT          NOT NULL PRIMARY KEY,
    nombre_tipo     VARCHAR(100) NOT NULL,
    tipo_trofeo     VARCHAR(100) NOT NULL
);

CREATE TABLE dim_plataforma (
    id_plataforma      INT          NOT NULL PRIMARY KEY,
    nombre_plataforma  VARCHAR(100) NOT NULL
);

CREATE TABLE dim_region_torneo (
    id_region      INT          NOT NULL PRIMARY KEY,
    nombre_region  VARCHAR(200) NOT NULL
);

CREATE TABLE fact_torneos (
    id_dim_tiempo           INT            NOT NULL,
    id_dim_juego            INT            NOT NULL,
    id_dim_modo_juego       INT            NOT NULL,
    id_dim_tipo_torneo      INT            NOT NULL,
    id_dim_plataforma       INT            NOT NULL,
    id_dim_region           INT            NOT NULL,
    total_inscritos         INT            NULL,
    inscritos_confirmados   INT            NULL,
    capacidad               INT            NULL,
    fondo_premios           DECIMAL(12,2)  NULL,
    comision                DECIMAL(12,2)  NULL,
    calificacion_promedio   DECIMAL(5,2)   NULL,
    total_resenas           INT            NULL,
    pct_recomendacion       DECIMAL(5,2)   NULL,
    cantidad_torneos        INT            NOT NULL DEFAULT 1,
    CONSTRAINT FK_fact_torneos_tiempo FOREIGN KEY (id_dim_tiempo) REFERENCES dim_tiempo(id_tiempo),
    CONSTRAINT FK_fact_torneos_juego FOREIGN KEY (id_dim_juego) REFERENCES dim_juego(id_juego),
    CONSTRAINT FK_fact_torneos_modo FOREIGN KEY (id_dim_modo_juego) REFERENCES dim_modo_juego(id_modo_juego),
    CONSTRAINT FK_fact_torneos_tipo FOREIGN KEY (id_dim_tipo_torneo) REFERENCES dim_tipo_torneo(id_tipo_torneo),
    CONSTRAINT FK_fact_torneos_plataforma FOREIGN KEY (id_dim_plataforma) REFERENCES dim_plataforma(id_plataforma),
    CONSTRAINT FK_fact_torneos_region FOREIGN KEY (id_dim_region) REFERENCES dim_region_torneo(id_region)
);

CREATE TABLE dim_operacion (
    id_operacion      INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    nombre_operacion  VARCHAR(20)       NOT NULL
);

CREATE TABLE dim_tabla_auditada (
    id_tabla      INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    nombre_tabla  VARCHAR(100)      NOT NULL
);

CREATE TABLE dim_empleado_soporte (
    id_empleado      INT           NOT NULL,
    nombre_completo  VARCHAR(150)  NULL,
    cargo            VARCHAR(45)   NULL,
    departamento     VARCHAR(45)   NULL,
    version          INT           NOT NULL,
    version_actual   INT           NOT NULL,
    PRIMARY KEY (id_empleado, version)
);

CREATE TABLE dim_pais_registro (
    id_pais              INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    nombre_pais          VARCHAR(100)      NOT NULL,
    es_restringido       INT               NOT NULL DEFAULT 0,
    motivo_restriccion   VARCHAR(500)      NULL
);

CREATE TABLE dim_rol_usuario (
    id_rol      INT          NOT NULL PRIMARY KEY,
    nombre_rol  VARCHAR(100) NOT NULL
);

CREATE TABLE fact_auditoria (
    id_dim_tiempo           INT NOT NULL,
    id_dim_operacion        INT NOT NULL,
    id_dim_tabla            INT NOT NULL,
    id_dim_empleado_soporte INT NULL,
    version_empleado        INT NULL,
    id_dim_pais             INT NOT NULL,
    id_dim_rol              INT NULL,
    total_eventos           INT NOT NULL DEFAULT 1,
    tickets_soporte         INT NULL,
    tickets_resueltos       INT NULL,
    registros_restringidos  INT NULL,
    CONSTRAINT FK_fact_auditoria_tiempo FOREIGN KEY (id_dim_tiempo) REFERENCES dim_tiempo(id_tiempo),
    CONSTRAINT FK_fact_auditoria_operacion FOREIGN KEY (id_dim_operacion) REFERENCES dim_operacion(id_operacion),
    CONSTRAINT FK_fact_auditoria_tabla FOREIGN KEY (id_dim_tabla) REFERENCES dim_tabla_auditada(id_tabla),
    CONSTRAINT FK_fact_auditoria_pais FOREIGN KEY (id_dim_pais) REFERENCES dim_pais_registro(id_pais),
    CONSTRAINT FK_fact_auditoria_rol FOREIGN KEY (id_dim_rol) REFERENCES dim_rol_usuario(id_rol),
    CONSTRAINT FK_fact_auditoria_empleado FOREIGN KEY (id_dim_empleado_soporte, version_empleado)
        REFERENCES dim_empleado_soporte(id_empleado, version)
);
GO
```

---

## Fase 3 - Configuracion del proyecto SSIS

### 3.1 Crear proyecto

1. Abrir Visual Studio.
2. File -> New -> Project.
3. Seleccionar Integration Services Project.
4. Nombre: SSIS_DW_ESPORTS.
5. Crear el proyecto.

### 3.2 Crear Connection Managers

Crear exactamente estos Connection Managers:

1. CONN_ORACLE_ESPORTS
   - Tipo: OLE DB
   - Provider: Oracle Provider for OLE DB
   - Server/Data Source: localhost:1521/xe
   - User: ESPORTS_APP
   - Password: Esports2026

2. CONN_SQLSERVER_DW
   - Tipo: OLE DB
   - Server: localhost
   - Database: DW_ESPORTS
   - Windows Authentication

3. CONN_SQLSERVER_RRHH
   - Tipo: OLE DB
   - Server: localhost
   - Database: RRHH_Transaccional
   - Windows Authentication

4. CONN_EXCEL_FUENTES
   - Tipo: EXCEL
   - Archivo: DataWarehouse/Excel/DW_Fuentes_Excel.xlsx
   - First row has column names: marcado

5. CONN_FLAT_LOGS_ACTIVIDAD
   - Tipo: FLATFILE
   - Archivo: DataWarehouse/MongoDB/exports/logs_actividad_dw.csv
   - Delimited: Comma
   - First row has column names: marcado

6. CONN_FLAT_FEEDBACK_TORNEOS
   - Tipo: FLATFILE
   - Archivo: DataWarehouse/MongoDB/exports/feedback_torneos_dw.csv
   - Delimited: Comma
   - First row has column names: marcado

---

## Fase 4 - Carga de staging desde Oracle, RRHH, Excel y Mongo CSV

Objetivo de esta fase:

1. Dejar todas las tablas stg_* cargadas con datos frescos.
2. Ejecutar la carga en un unico paquete SSIS llamado ETL_00_Staging.dtsx.
3. Dejar listo el terreno para la Fase 5 (normalizacion de Mongo).

Resultado esperado al terminar:

1. ETL_00_Staging.dtsx con 5 tasks en Control Flow.
2. Cada task en verde al ejecutar.
3. Todas las tablas staging con filas.

### 4.0 Preparar Visual Studio para no perderse

1. Abrir Visual Studio y abrir la solucion donde esta el proyecto SSIS.
2. Ir a menu View -> Solution Explorer.
3. Ir a menu SSIS -> SSIS Toolbox.
4. Ir a menu View -> Properties Window.
5. Verificar que abajo este visible el panel Connection Managers.
6. En Solution Explorer, expandir SSIS Packages.

Si no existe ETL_00_Staging.dtsx:

1. Click derecho en SSIS Packages.
2. Click New SSIS Package.
3. Presionar F2 al nuevo paquete y renombrar a ETL_00_Staging.dtsx.
4. Doble click en ETL_00_Staging.dtsx para abrirlo.

### 4.1 Armar el Control Flow completo (boton por boton)

En la pestana Control Flow de ETL_00_Staging.dtsx:

1. En SSIS Toolbox, en la seccion Common, arrastrar Execute SQL Task al lienzo.
2. Presionar F2 y renombrar ese task a SQL_Truncar_Staging.
3. Arrastrar Data Flow Task al lienzo.
4. Renombrar a DFT_Cargar_Staging_Oracle.
5. Arrastrar otro Data Flow Task.
6. Renombrar a DFT_Cargar_Staging_RRHH.
7. Arrastrar otro Data Flow Task.
8. Renombrar a DFT_Cargar_Staging_Excel.
9. Arrastrar otro Data Flow Task.
10. Renombrar a DFT_Cargar_Staging_Mongo_Raw.

Conectar en secuencia (flechas verdes):

1. Click en SQL_Truncar_Staging.
2. Arrastrar la flecha verde hacia DFT_Cargar_Staging_Oracle.
3. Desde DFT_Cargar_Staging_Oracle arrastrar flecha verde a DFT_Cargar_Staging_RRHH.
4. Desde DFT_Cargar_Staging_RRHH arrastrar flecha verde a DFT_Cargar_Staging_Excel.
5. Desde DFT_Cargar_Staging_Excel arrastrar flecha verde a DFT_Cargar_Staging_Mongo_Raw.

### 4.2 Configurar Task 1: SQL_Truncar_Staging

1. Doble click en SQL_Truncar_Staging.
2. En el dialogo Execute SQL Task Editor:
   - En General -> Name: SQL_Truncar_Staging.
   - En General -> ConnectionType: OLE DB.
   - En General -> Connection: seleccionar CONN_SQLSERVER_DW.
   - En General -> SQLSourceType: Direct input.
3. En SQLStatement, pegar exactamente este script:

```sql
TRUNCATE TABLE stg_oracle_catalogo_region;
TRUNCATE TABLE stg_oracle_catalogo_tipo_item;
TRUNCATE TABLE stg_oracle_catalogo_origen_transaccion;
TRUNCATE TABLE stg_oracle_catalogo_tipo_torneo;
TRUNCATE TABLE stg_oracle_catalogo_plataforma;
TRUNCATE TABLE stg_oracle_catalogo_rol;
TRUNCATE TABLE stg_oracle_catalogo_estado_inscripcion;
TRUNCATE TABLE stg_oracle_usuario;
TRUNCATE TABLE stg_oracle_persona;
TRUNCATE TABLE stg_oracle_transaccion;
TRUNCATE TABLE stg_oracle_tienda_item;
TRUNCATE TABLE stg_oracle_tienda_orden;
TRUNCATE TABLE stg_oracle_juego;
TRUNCATE TABLE stg_oracle_modo_juego;
TRUNCATE TABLE stg_oracle_torneo;
TRUNCATE TABLE stg_oracle_torneo_inscripcion;
TRUNCATE TABLE stg_oracle_torneo_premios;
TRUNCATE TABLE stg_oracle_usuario_amigos;
TRUNCATE TABLE stg_oracle_usuario_seguidores;
TRUNCATE TABLE stg_oracle_usuario_estadisticas_juego;
TRUNCATE TABLE stg_oracle_auditoria_log;
TRUNCATE TABLE stg_oracle_tienda_solicitud_soporte;
TRUNCATE TABLE stg_rrhh_empleado_historial;
TRUNCATE TABLE stg_excel_presupuestos_ventas;
TRUNCATE TABLE stg_excel_lista_negra;
TRUNCATE TABLE stg_mongo_logs_actividad_raw;
TRUNCATE TABLE stg_mongo_feedback_torneos_raw;
TRUNCATE TABLE stg_mongo_logs_actividad_evento;
TRUNCATE TABLE stg_mongo_feedback_torneos_evento;
```

4. Click OK para guardar el task.

### 4.3 Configurar Task 2: DFT_Cargar_Staging_Oracle

#### 4.3.1 Entrar al Data Flow

1. En Control Flow, doble click en DFT_Cargar_Staging_Oracle.
2. Verificar que ahora estas en la pestana Data Flow.

#### 4.3.2 Crear la primera carga Oracle completa (modelo base)

Esta primera carga se hace completa para que luego la repitas con copiar/pegar.

1. En SSIS Toolbox (seccion Other Sources), arrastrar OLE DB Source al lienzo.
2. Presionar F2 y renombrar a SRC_ORA_CATALOGO_REGION.
3. Doble click en SRC_ORA_CATALOGO_REGION.
4. En OLE DB Source Editor:
   - OLE DB connection manager: CONN_ORACLE_ESPORTS.
   - Data access mode: SQL command.
   - SQL command text:

```sql
SELECT ID AS id_region, VALOR AS nombre_region
FROM CATALOGO_REGION;
```

5. Click Preview para verificar que trae filas.
6. Click OK.
7. En SSIS Toolbox (seccion Other Destinations), arrastrar OLE DB Destination.
8. Renombrar a DST_STG_ORACLE_CATALOGO_REGION.
9. Arrastrar la flecha azul desde SRC_ORA_CATALOGO_REGION hacia DST_STG_ORACLE_CATALOGO_REGION.
10. Doble click en DST_STG_ORACLE_CATALOGO_REGION.
11. En OLE DB Destination Editor:
    - OLE DB connection manager: CONN_SQLSERVER_DW.
    - Data access mode: Table or view - fast load.
    - Name of the table or view: stg_oracle_catalogo_region.
12. Ir a la pestana Mappings.
13. Verificar:
    - id_region -> id_region
    - nombre_region -> nombre_region
14. Click OK.

#### 4.3.3 Duplicar rapidamente para las demas cargas Oracle

1. Seleccionar SRC_ORA_CATALOGO_REGION y DST_STG_ORACLE_CATALOGO_REGION (mantener Ctrl y click en ambos).
2. Presionar Ctrl+C.
3. Presionar Ctrl+V para crear una copia del par source/destination con su flecha.
4. Renombrar los dos componentes copiados para la siguiente tabla.
5. Abrir el Source copiado y cambiar SQL.
6. Abrir el Destination copiado y cambiar Name of the table or view.
7. Ir a Mappings y validar columnas.
8. Repetir hasta completar toda la lista Oracle de abajo.

### 4.3.4 Lista exacta de cargas Oracle (SQL y destino)

1. Destino: stg_oracle_catalogo_region

```sql
SELECT ID AS id_region, VALOR AS nombre_region
FROM CATALOGO_REGION;
```

2. Destino: stg_oracle_catalogo_tipo_item

```sql
SELECT ID AS id_tipo_item, VALOR AS nombre_tipo
FROM CATALOGO_TIPO_ITEM;
```

3. Destino: stg_oracle_catalogo_origen_transaccion

```sql
SELECT ID AS id_origen, VALOR AS nombre_origen
FROM CATALOGO_ORIGEN_TRANSACCION;
```

4. Destino: stg_oracle_catalogo_tipo_torneo

```sql
SELECT ID AS id_tipo_torneo, VALOR AS nombre_tipo, TIPO_TROFEO AS tipo_trofeo
FROM CATALOGO_TIPO_TORNEO;
```

5. Destino: stg_oracle_catalogo_plataforma

```sql
SELECT ID AS id_plataforma, VALOR AS nombre_plataforma
FROM CATALOGO_PLATAFORMA;
```

6. Destino: stg_oracle_catalogo_rol

```sql
SELECT ID AS id_rol, VALOR AS nombre_rol
FROM CATALOGO_ROL;
```

7. Destino: stg_oracle_catalogo_estado_inscripcion

```sql
SELECT ID AS id_estado, VALOR AS valor_estado
FROM CATALOGO_ESTADO_INSCRIPCION;
```

8. Destino: stg_oracle_usuario

```sql
SELECT
    ID AS usuario_id,
    NICKNAME AS nickname,
    ESTADO AS estado,
    XP AS xp,
    CREADO_EN AS creado_en,
    PERSONA_ID AS persona_id,
    ROL_ID AS rol_id
FROM USUARIO;
```

9. Destino: stg_oracle_persona

```sql
SELECT
    ID AS persona_id,
    PAIS AS pais,
    DIVISA AS divisa,
    CORREO AS correo
FROM PERSONA;
```

10. Destino: stg_oracle_transaccion

```sql
SELECT
    ID AS transaccion_id,
    MONTO AS monto,
    DESCRIPCION AS descripcion,
    CREADO_EN AS creado_en,
    USUARIO_ID AS usuario_id,
    TIPO_ID AS tipo_id,
    ORIGEN_ID AS origen_id
FROM TRANSACCION;
```

11. Destino: stg_oracle_tienda_item

```sql
SELECT
    ID AS item_id,
    NOMBRE AS nombre_item,
    PRECIO AS precio,
    CREDITOS_OTORGADOS AS creditos_otorgados,
    TIPO_ID AS tipo_id
FROM TIENDA_ITEM;
```

12. Destino: stg_oracle_tienda_orden

```sql
SELECT
    ID AS orden_id,
    MONTO AS monto,
    ESTADO AS estado,
    CREADO_EN AS creado_en,
    COMPLETADO_EN AS completado_en,
    USUARIO_ID AS usuario_id,
    ITEM_ID AS item_id,
    DIVISA AS divisa
FROM TIENDA_ORDEN;
```

13. Destino: stg_oracle_juego

```sql
SELECT ID AS juego_id, NOMBRE AS nombre_juego
FROM JUEGO;
```

14. Destino: stg_oracle_modo_juego

```sql
SELECT ID AS modo_juego_id, NOMBRE AS nombre_modo, JUEGO_ID AS juego_id
FROM MODO_JUEGO;
```

15. Destino: stg_oracle_torneo

```sql
SELECT
    ID AS torneo_id,
    FECHA_INICIO_TORNEO AS fecha_inicio_torneo,
    JUEGO_ID AS juego_id,
    MODO_JUEGO_ID AS modo_juego_id,
    TIPO_TORNEO_ID AS tipo_torneo_id,
    PLATAFORMA_ID AS plataforma_id,
    REGION_ID AS region_id,
    CAPACIDAD AS capacidad
FROM TORNEO;
```

16. Destino: stg_oracle_torneo_inscripcion

```sql
SELECT
    ID AS inscripcion_id,
    FECHA AS fecha,
    TORNEO_ID AS torneo_id,
    USUARIO_ID AS usuario_id,
    ESTADO_ID AS estado_id
FROM TORNEO_INSCRIPCION;
```

17. Destino: stg_oracle_torneo_premios

```sql
SELECT
    TORNEO_ID AS torneo_id,
    FONDO_TOTAL AS fondo_total,
    COMISION_TOTAL AS comision_total
FROM TORNEO_PREMIOS;
```

18. Destino: stg_oracle_usuario_amigos

```sql
SELECT
    ID AS amistad_id,
    CREADO_EN AS creado_en,
    USUARIO1_ID AS usuario1_id,
    USUARIO2_ID AS usuario2_id,
    ESTADO_ID AS estado_id
FROM USUARIO_AMIGOS;
```

19. Destino: stg_oracle_usuario_seguidores

```sql
SELECT
    ID AS seguimiento_id,
    CREADO_EN AS creado_en,
    SEGUIDOR_ID AS seguidor_id,
    SEGUIDO_ID AS seguido_id
FROM USUARIO_SEGUIDORES;
```

20. Destino: stg_oracle_usuario_estadisticas_juego

```sql
SELECT
    USUARIO_ID AS usuario_id,
    JUEGO_ID AS juego_id,
    VICTORIAS AS victorias,
    HORAS_JUGADAS AS horas_jugadas
FROM USUARIO_ESTADISTICAS_JUEGO;
```

21. Destino: stg_oracle_auditoria_log

```sql
SELECT
    ID AS auditoria_id,
    TABLA AS tabla_auditada,
    OPERACION AS operacion,
    REGISTRO_ID AS registro_id,
    USUARIO_BD AS usuario_bd,
    DETALLE AS detalle,
    FECHA AS fecha
FROM AUDITORIA_LOG;
```

22. Destino: stg_oracle_tienda_solicitud_soporte

```sql
SELECT
    ID AS solicitud_id,
    TIPO AS tipo,
    ESTADO AS estado,
    CREADO_EN AS creado_en,
    RESUELTO_EN AS resuelto_en,
    USUARIO_ID AS usuario_id,
    RESUELTO_POR AS resuelto_por
FROM TIENDA_SOLICITUD_SOPORTE;
```

### 4.4 Configurar Task 3: DFT_Cargar_Staging_RRHH

1. Volver a Control Flow (arriba, pestana Control Flow).
2. Doble click en DFT_Cargar_Staging_RRHH.
3. Arrastrar OLE DB Source.
4. Renombrar a SRC_RRHH_EMPLEADO_HISTORIAL.
5. Doble click en SRC_RRHH_EMPLEADO_HISTORIAL:
   - OLE DB connection manager: CONN_SQLSERVER_RRHH.
   - Data access mode: SQL command.
   - SQL command text:

```sql
SELECT
    e.idEmpleado AS id_empleado,
    CONCAT(e.pnombre, ' ', ISNULL(e.snombre, ''), ' ', e.papellido) AS nombre_completo,
    c.nombre AS cargo,
    d.Nombre AS departamento,
    ROW_NUMBER() OVER (PARTITION BY e.idEmpleado ORDER BY ce.fechaNombramiento ASC) AS version,
    CASE
        WHEN ROW_NUMBER() OVER (PARTITION BY e.idEmpleado ORDER BY ce.fechaNombramiento DESC) = 1 THEN 1
        ELSE 0
    END AS version_actual
FROM Empleado e
INNER JOIN Cargo_empleado ce ON ce.idEmpleado = e.idEmpleado
INNER JOIN Cargo c ON c.idCargo = ce.idCargo
INNER JOIN Departamento d ON d.idDepartamento = e.idDepartamento;
```

6. Click Preview y luego OK.
7. Arrastrar OLE DB Destination.
8. Renombrar a DST_STG_RRHH_EMPLEADO_HISTORIAL.
9. Conectar flecha azul desde SRC_RRHH_EMPLEADO_HISTORIAL hacia DST_STG_RRHH_EMPLEADO_HISTORIAL.
10. Doble click en DST_STG_RRHH_EMPLEADO_HISTORIAL:
    - OLE DB connection manager: CONN_SQLSERVER_DW.
    - Data access mode: Table or view - fast load.
    - Name of the table or view: stg_rrhh_empleado_historial.
11. Ir a Mappings y validar todas las columnas.
12. Click OK.

### 4.5 Configurar Task 4: DFT_Cargar_Staging_Excel

1. Volver a Control Flow.
2. Doble click en DFT_Cargar_Staging_Excel.

#### 4.5.1 Carga hoja Presupuestos_Ventas

1. Arrastrar Excel Source.
2. Renombrar a SRC_XLS_PRESUPUESTOS_VENTAS.
3. Doble click en SRC_XLS_PRESUPUESTOS_VENTAS:
   - Excel connection manager: CONN_EXCEL_FUENTES.
   - Data access mode: Table or view.
   - Name of the Excel sheet: Presupuestos_Ventas$.
4. Click Preview.
5. Click OK.
6. Arrastrar OLE DB Destination.
7. Renombrar a DST_STG_XLS_PRESUPUESTOS_VENTAS.
8. Conectar flecha azul desde SRC_XLS_PRESUPUESTOS_VENTAS hacia DST_STG_XLS_PRESUPUESTOS_VENTAS.
9. Doble click en DST_STG_XLS_PRESUPUESTOS_VENTAS:
   - OLE DB connection manager: CONN_SQLSERVER_DW.
   - Data access mode: Table or view - fast load.
   - Name of the table or view: stg_excel_presupuestos_ventas.
10. Pestana Mappings, validar:
    - anio -> anio
    - mes -> mes
    - region -> region
    - categoria_producto -> categoria_producto
    - meta_ingresos_usd -> meta_ingresos_usd
    - meta_transacciones -> meta_transacciones
    - responsable_rrhh_id -> responsable_rrhh_id
11. Click OK.

#### 4.5.2 Carga hoja Lista_Negra

1. Arrastrar otro Excel Source.
2. Renombrar a SRC_XLS_LISTA_NEGRA.
3. Doble click en SRC_XLS_LISTA_NEGRA:
   - Excel connection manager: CONN_EXCEL_FUENTES.
   - Data access mode: Table or view.
   - Name of the Excel sheet: Lista_Negra$.
4. Click Preview.
5. Click OK.
6. Arrastrar OLE DB Destination.
7. Renombrar a DST_STG_XLS_LISTA_NEGRA.
8. Conectar flecha azul de SRC_XLS_LISTA_NEGRA a DST_STG_XLS_LISTA_NEGRA.
9. Doble click en DST_STG_XLS_LISTA_NEGRA:
   - OLE DB connection manager: CONN_SQLSERVER_DW.
   - Data access mode: Table or view - fast load.
   - Name of the table or view: stg_excel_lista_negra.
10. Pestana Mappings, validar:
    - tipo -> tipo
    - valor -> valor
    - motivo -> motivo
    - fecha_agregado -> fecha_agregado
    - activo -> activo
11. Click OK.

### 4.6 Configurar Task 5: DFT_Cargar_Staging_Mongo_Raw

1. Volver a Control Flow.
2. Doble click en DFT_Cargar_Staging_Mongo_Raw.

#### 4.6.1 Carga de logs_actividad_dw.csv

1. Arrastrar Flat File Source.
2. Renombrar a SRC_CSV_LOGS_ACTIVIDAD.
3. Doble click en SRC_CSV_LOGS_ACTIVIDAD:
   - Flat file connection manager: CONN_FLAT_LOGS_ACTIVIDAD.
4. Click Preview para ver columnas del CSV.
5. Click OK.
6. Arrastrar OLE DB Destination.
7. Renombrar a DST_STG_MONGO_LOGS_RAW.
8. Conectar flecha azul de SRC_CSV_LOGS_ACTIVIDAD a DST_STG_MONGO_LOGS_RAW.
9. Doble click en DST_STG_MONGO_LOGS_RAW:
   - OLE DB connection manager: CONN_SQLSERVER_DW.
   - Data access mode: Table or view - fast load.
   - Name of the table or view: stg_mongo_logs_actividad_raw.
10. Ir a Mappings y verificar exacto:
    - oracle_usuario_id -> oracle_usuario_id
    - tipo_evento -> tipo_evento
    - ip -> ip
    - user_agent -> user_agent
    - pais_origen -> pais_origen
    - timestamp -> timestamp_raw
    - detalle.metodo -> detalle_metodo
    - detalle.exitoso -> detalle_exitoso
    - detalle.duracion_sesion_min -> detalle_duracion_sesion_min
    - detalle.termino -> detalle_termino
    - detalle.resultados_encontrados -> detalle_resultados_encontrados
    - detalle.perfil_visitado_id -> detalle_perfil_visitado_id
    - detalle.tiempo_visualizacion_seg -> detalle_tiempo_visualizacion_seg
    - detalle.desde_seccion -> detalle_desde_seccion
    - detalle.torneo_id -> detalle_torneo_id
    - detalle.accion -> detalle_accion
    - detalle.item_id -> detalle_item_id
    - detalle.categoria -> detalle_categoria
    - detalle.seccion -> detalle_seccion
    - detalle.campo_modificado -> detalle_campo_modificado
    - detalle.destinatario_id -> detalle_destinatario_id
11. Click OK.

#### 4.6.2 Carga de feedback_torneos_dw.csv

1. Arrastrar Flat File Source.
2. Renombrar a SRC_CSV_FEEDBACK_TORNEOS.
3. Doble click en SRC_CSV_FEEDBACK_TORNEOS:
   - Flat file connection manager: CONN_FLAT_FEEDBACK_TORNEOS.
4. Click Preview.
5. Click OK.
6. Arrastrar OLE DB Destination.
7. Renombrar a DST_STG_MONGO_FEEDBACK_RAW.
8. Conectar flecha azul de SRC_CSV_FEEDBACK_TORNEOS a DST_STG_MONGO_FEEDBACK_RAW.
9. Doble click en DST_STG_MONGO_FEEDBACK_RAW:
   - OLE DB connection manager: CONN_SQLSERVER_DW.
   - Data access mode: Table or view - fast load.
   - Name of the table or view: stg_mongo_feedback_torneos_raw.
10. Ir a Mappings y validar:
    - oracle_torneo_id -> oracle_torneo_id
    - oracle_usuario_id -> oracle_usuario_id
    - calificacion -> calificacion
    - comentario -> comentario
    - tags -> tags
    - recomendaria -> recomendaria
    - timestamp -> timestamp_raw
11. Click OK.

### 4.7 Validacion final de la Fase 4 en Visual Studio

1. Volver a pestana Control Flow.
2. Confirmar que existen 5 tasks con estos nombres:
   - SQL_Truncar_Staging
   - DFT_Cargar_Staging_Oracle
   - DFT_Cargar_Staging_RRHH
   - DFT_Cargar_Staging_Excel
   - DFT_Cargar_Staging_Mongo_Raw
3. Confirmar que las flechas verdes conectan los 5 tasks en orden.
4. Presionar Ctrl+Shift+S para guardar todo.
5. Ejecutar el paquete con F5.
6. Esperar a que cada task cambie a color verde.
7. Si alguno queda rojo:
   - Click en pestana Progress.
   - Buscar primer mensaje Error.
   - Doble click en el componente indicado.
   - Corregir connection manager, SQL o mappings.
   - Ejecutar otra vez con F5.

### 4.8 Verificacion SQL inmediata despues de ejecutar

En SSMS sobre DW_ESPORTS:

```sql
SELECT COUNT(*) AS c FROM stg_oracle_catalogo_region;
SELECT COUNT(*) AS c FROM stg_oracle_catalogo_tipo_item;
SELECT COUNT(*) AS c FROM stg_oracle_catalogo_origen_transaccion;
SELECT COUNT(*) AS c FROM stg_oracle_usuario;
SELECT COUNT(*) AS c FROM stg_oracle_transaccion;
SELECT COUNT(*) AS c FROM stg_oracle_torneo;
SELECT COUNT(*) AS c FROM stg_rrhh_empleado_historial;
SELECT COUNT(*) AS c FROM stg_excel_presupuestos_ventas;
SELECT COUNT(*) AS c FROM stg_excel_lista_negra;
SELECT COUNT(*) AS c FROM stg_mongo_logs_actividad_raw;
SELECT COUNT(*) AS c FROM stg_mongo_feedback_torneos_raw;
```

---

## Fase 5 - Normalizacion de staging Mongo

En ETL_00_Staging.dtsx agregar Execute SQL Task final: SQL_Normalizar_Mongo.

Usar CONN_SQLSERVER_DW y ejecutar:

```sql
TRUNCATE TABLE stg_mongo_logs_actividad_evento;
TRUNCATE TABLE stg_mongo_feedback_torneos_evento;

INSERT INTO stg_mongo_logs_actividad_evento (
    oracle_usuario_id,
    tipo_evento,
    ip,
    user_agent,
    pais_origen,
    timestamp_evento,
    detalle_metodo,
    detalle_exitoso,
    detalle_duracion_sesion_min,
    detalle_termino,
    detalle_resultados_encontrados,
    detalle_perfil_visitado_id,
    detalle_tiempo_visualizacion_seg,
    detalle_desde_seccion,
    detalle_torneo_id,
    detalle_accion,
    detalle_item_id,
    detalle_categoria,
    detalle_seccion,
    detalle_campo_modificado,
    detalle_destinatario_id
)
SELECT
    TRY_CAST(NULLIF(LTRIM(RTRIM(oracle_usuario_id)), '') AS INT) AS oracle_usuario_id,
    NULLIF(LTRIM(RTRIM(tipo_evento)), '') AS tipo_evento,
    NULLIF(LTRIM(RTRIM(ip)), '') AS ip,
    NULLIF(LTRIM(RTRIM(user_agent)), '') AS user_agent,
    NULLIF(LTRIM(RTRIM(pais_origen)), '') AS pais_origen,
    TRY_CAST(REPLACE(REPLACE(NULLIF(LTRIM(RTRIM(timestamp_raw)), ''), 'T', ' '), 'Z', '') AS DATETIME2) AS timestamp_evento,
    NULLIF(LTRIM(RTRIM(detalle_metodo)), '') AS detalle_metodo,
    CASE
        WHEN LOWER(LTRIM(RTRIM(detalle_exitoso))) IN ('true', '1') THEN 1
        WHEN LOWER(LTRIM(RTRIM(detalle_exitoso))) IN ('false', '0') THEN 0
        ELSE NULL
    END AS detalle_exitoso,
    TRY_CAST(NULLIF(LTRIM(RTRIM(detalle_duracion_sesion_min)), '') AS INT) AS detalle_duracion_sesion_min,
    NULLIF(LTRIM(RTRIM(detalle_termino)), '') AS detalle_termino,
    TRY_CAST(NULLIF(LTRIM(RTRIM(detalle_resultados_encontrados)), '') AS INT) AS detalle_resultados_encontrados,
    TRY_CAST(NULLIF(LTRIM(RTRIM(detalle_perfil_visitado_id)), '') AS INT) AS detalle_perfil_visitado_id,
    TRY_CAST(NULLIF(LTRIM(RTRIM(detalle_tiempo_visualizacion_seg)), '') AS INT) AS detalle_tiempo_visualizacion_seg,
    NULLIF(LTRIM(RTRIM(detalle_desde_seccion)), '') AS detalle_desde_seccion,
    TRY_CAST(NULLIF(LTRIM(RTRIM(detalle_torneo_id)), '') AS INT) AS detalle_torneo_id,
    NULLIF(LTRIM(RTRIM(detalle_accion)), '') AS detalle_accion,
    TRY_CAST(NULLIF(LTRIM(RTRIM(detalle_item_id)), '') AS INT) AS detalle_item_id,
    NULLIF(LTRIM(RTRIM(detalle_categoria)), '') AS detalle_categoria,
    NULLIF(LTRIM(RTRIM(detalle_seccion)), '') AS detalle_seccion,
    NULLIF(LTRIM(RTRIM(detalle_campo_modificado)), '') AS detalle_campo_modificado,
    TRY_CAST(NULLIF(LTRIM(RTRIM(detalle_destinatario_id)), '') AS INT) AS detalle_destinatario_id
FROM stg_mongo_logs_actividad_raw;

INSERT INTO stg_mongo_feedback_torneos_evento (
    oracle_torneo_id,
    oracle_usuario_id,
    calificacion,
    comentario,
    tags,
    recomendaria,
    timestamp_evento
)
SELECT
    TRY_CAST(NULLIF(LTRIM(RTRIM(oracle_torneo_id)), '') AS INT) AS oracle_torneo_id,
    TRY_CAST(NULLIF(LTRIM(RTRIM(oracle_usuario_id)), '') AS INT) AS oracle_usuario_id,
    TRY_CAST(NULLIF(LTRIM(RTRIM(calificacion)), '') AS INT) AS calificacion,
    NULLIF(LTRIM(RTRIM(comentario)), '') AS comentario,
    NULLIF(LTRIM(RTRIM(tags)), '') AS tags,
    CASE
        WHEN LOWER(LTRIM(RTRIM(recomendaria))) IN ('true', '1') THEN 1
        WHEN LOWER(LTRIM(RTRIM(recomendaria))) IN ('false', '0') THEN 0
        ELSE NULL
    END AS recomendaria,
    TRY_CAST(REPLACE(REPLACE(NULLIF(LTRIM(RTRIM(timestamp_raw)), ''), 'T', ' '), 'Z', '') AS DATETIME2) AS timestamp_evento
FROM stg_mongo_feedback_torneos_raw;
```

---

## Fase 6 - Carga de dimensiones

Crear paquete ETL_01_Dimensiones.dtsx.

Agregar un Execute SQL Task: SQL_Cargar_Dimensiones con CONN_SQLSERVER_DW.

```sql
TRUNCATE TABLE fact_auditoria;
TRUNCATE TABLE fact_torneos;
TRUNCATE TABLE fact_actividad_usuario;
TRUNCATE TABLE fact_ingresos;

TRUNCATE TABLE dim_responsable_rrhh;
TRUNCATE TABLE dim_usuario_comprador;
TRUNCATE TABLE dim_origen_transaccion;
TRUNCATE TABLE dim_tipo_item;
TRUNCATE TABLE dim_region;

TRUNCATE TABLE dim_tipo_evento;
TRUNCATE TABLE dim_pais;
TRUNCATE TABLE dim_usuario;
TRUNCATE TABLE dim_juego;

TRUNCATE TABLE dim_modo_juego;
TRUNCATE TABLE dim_tipo_torneo;
TRUNCATE TABLE dim_plataforma;
TRUNCATE TABLE dim_region_torneo;

TRUNCATE TABLE dim_operacion;
TRUNCATE TABLE dim_tabla_auditada;
TRUNCATE TABLE dim_empleado_soporte;
TRUNCATE TABLE dim_pais_registro;
TRUNCATE TABLE dim_rol_usuario;

INSERT INTO dim_region (id_region, nombre_region)
VALUES (0, 'DESCONOCIDA');

INSERT INTO dim_region (id_region, nombre_region)
SELECT id_region, nombre_region
FROM stg_oracle_catalogo_region;

INSERT INTO dim_tipo_item (id_tipo_item, nombre_tipo)
VALUES (0, 'no_aplica');

INSERT INTO dim_tipo_item (id_tipo_item, nombre_tipo)
SELECT id_tipo_item, nombre_tipo
FROM stg_oracle_catalogo_tipo_item;

INSERT INTO dim_origen_transaccion (id_origen, nombre_origen)
SELECT id_origen, nombre_origen
FROM stg_oracle_catalogo_origen_transaccion;

INSERT INTO dim_usuario_comprador (id_usuario, nickname, pais, divisa, fecha_registro)
VALUES (0, 'USUARIO_DESCONOCIDO', 'DESCONOCIDO', 'USD', '2000-01-01');

INSERT INTO dim_usuario_comprador (id_usuario, nickname, pais, divisa, fecha_registro)
SELECT
    u.usuario_id,
    u.nickname,
    p.pais,
    p.divisa,
    u.creado_en
FROM stg_oracle_usuario u
LEFT JOIN stg_oracle_persona p ON p.persona_id = u.persona_id;

INSERT INTO dim_responsable_rrhh (
    id_empleado,
    nombre_completo,
    cargo,
    departamento,
    version,
    version_actual
)
SELECT
    id_empleado,
    nombre_completo,
    cargo,
    departamento,
    version,
    version_actual
FROM stg_rrhh_empleado_historial;

INSERT INTO dim_usuario (id_usuario, nickname, xp, estado, pais, fecha_registro)
VALUES (0, 'USUARIO_DESCONOCIDO', 0, 'desconocido', 'DESCONOCIDO', '2000-01-01');

INSERT INTO dim_usuario (id_usuario, nickname, xp, estado, pais, fecha_registro)
SELECT
    u.usuario_id,
    u.nickname,
    u.xp,
    u.estado,
    p.pais,
    u.creado_en
FROM stg_oracle_usuario u
LEFT JOIN stg_oracle_persona p ON p.persona_id = u.persona_id;

INSERT INTO dim_juego (id_juego, nombre_juego)
VALUES (0, 'NO_APLICA');

INSERT INTO dim_juego (id_juego, nombre_juego)
SELECT juego_id, nombre_juego
FROM stg_oracle_juego;

INSERT INTO dim_tipo_evento (nombre_evento)
SELECT DISTINCT LTRIM(RTRIM(tipo_evento))
FROM stg_mongo_logs_actividad_evento
WHERE tipo_evento IS NOT NULL
  AND LTRIM(RTRIM(tipo_evento)) <> '';

INSERT INTO dim_pais (nombre_pais)
VALUES ('DESCONOCIDO');

INSERT INTO dim_pais (nombre_pais)
SELECT DISTINCT LTRIM(RTRIM(pais_origen))
FROM stg_mongo_logs_actividad_evento
WHERE pais_origen IS NOT NULL
  AND LTRIM(RTRIM(pais_origen)) <> '';

INSERT INTO dim_modo_juego (id_modo_juego, nombre_modo, nombre_juego)
VALUES (0, 'NO_APLICA', 'NO_APLICA');

INSERT INTO dim_modo_juego (id_modo_juego, nombre_modo, nombre_juego)
SELECT
    m.modo_juego_id,
    m.nombre_modo,
    j.nombre_juego
FROM stg_oracle_modo_juego m
INNER JOIN stg_oracle_juego j ON j.juego_id = m.juego_id;

INSERT INTO dim_tipo_torneo (id_tipo_torneo, nombre_tipo, tipo_trofeo)
VALUES (0, 'no_aplica', 'no_aplica');

INSERT INTO dim_tipo_torneo (id_tipo_torneo, nombre_tipo, tipo_trofeo)
SELECT id_tipo_torneo, nombre_tipo, tipo_trofeo
FROM stg_oracle_catalogo_tipo_torneo;

INSERT INTO dim_plataforma (id_plataforma, nombre_plataforma)
VALUES (0, 'NO_APLICA');

INSERT INTO dim_plataforma (id_plataforma, nombre_plataforma)
SELECT id_plataforma, nombre_plataforma
FROM stg_oracle_catalogo_plataforma;

INSERT INTO dim_region_torneo (id_region, nombre_region)
VALUES (0, 'DESCONOCIDA');

INSERT INTO dim_region_torneo (id_region, nombre_region)
SELECT id_region, nombre_region
FROM stg_oracle_catalogo_region;

INSERT INTO dim_operacion (nombre_operacion)
SELECT DISTINCT operacion
FROM (
    SELECT operacion FROM stg_oracle_auditoria_log
    UNION ALL
    SELECT 'INSERT'
    UNION ALL
    SELECT 'UPDATE'
) src
WHERE operacion IS NOT NULL
    AND LTRIM(RTRIM(operacion)) <> '';

INSERT INTO dim_tabla_auditada (nombre_tabla)
SELECT DISTINCT tabla_auditada
FROM (
    SELECT tabla_auditada FROM stg_oracle_auditoria_log
    UNION ALL
    SELECT 'TIENDA_SOLICITUD_SOPORTE'
) src
WHERE tabla_auditada IS NOT NULL
    AND LTRIM(RTRIM(tabla_auditada)) <> '';

INSERT INTO dim_empleado_soporte (
    id_empleado,
    nombre_completo,
    cargo,
    departamento,
    version,
    version_actual
)
SELECT
    id_empleado,
    nombre_completo,
    cargo,
    departamento,
    version,
    version_actual
FROM stg_rrhh_empleado_historial;

INSERT INTO dim_pais_registro (nombre_pais, es_restringido, motivo_restriccion)
VALUES ('DESCONOCIDO', 0, NULL);

INSERT INTO dim_pais_registro (nombre_pais, es_restringido, motivo_restriccion)
SELECT DISTINCT
    LTRIM(RTRIM(p.pais)) AS nombre_pais,
    0 AS es_restringido,
    NULL AS motivo_restriccion
FROM stg_oracle_persona p
WHERE p.pais IS NOT NULL
  AND LTRIM(RTRIM(p.pais)) <> '';

UPDATE d
SET
    d.es_restringido = 1,
    d.motivo_restriccion = ln.motivo
FROM dim_pais_registro d
INNER JOIN stg_excel_lista_negra ln
    ON UPPER(LTRIM(RTRIM(d.nombre_pais))) = UPPER(LTRIM(RTRIM(ln.valor)))
WHERE UPPER(LTRIM(RTRIM(ln.tipo))) = 'PAIS'
  AND ln.activo = 1;

INSERT INTO dim_rol_usuario (id_rol, nombre_rol)
SELECT id_rol, nombre_rol
FROM stg_oracle_catalogo_rol;
```

---

## Fase 7 - Carga de hechos (DM1, DM2, DM3, DM4)

Crear cuatro paquetes:

- ETL_02_Fact_DM1_Ingresos.dtsx
- ETL_03_Fact_DM2_Comportamiento.dtsx
- ETL_04_Fact_DM3_Torneos.dtsx
- ETL_05_Fact_DM4_Auditoria.dtsx

Cada paquete contiene un Execute SQL Task usando CONN_SQLSERVER_DW.

### 7.1 SQL para ETL_02_Fact_DM1_Ingresos.dtsx

```sql
TRUNCATE TABLE fact_ingresos;

;WITH transacciones_enriquecidas AS (
    SELECT
        t.transaccion_id,
        t.creado_en AS fecha_evento,
        COALESCE(t.usuario_id, 0) AS id_usuario,
        COALESCE(r.id_region, 0) AS id_region,
        t.origen_id AS id_origen,
        COALESCE(orden_match.tipo_id, 0) AS id_tipo_item,
        COALESCE(orden_match.creditos_otorgados, 0) AS creditos_otorgados,
        t.monto
    FROM stg_oracle_transaccion t
    LEFT JOIN stg_oracle_usuario u
        ON u.usuario_id = t.usuario_id
    LEFT JOIN stg_oracle_persona p
        ON p.persona_id = u.persona_id
    LEFT JOIN dim_region r
        ON UPPER(LTRIM(RTRIM(r.nombre_region))) = UPPER(LTRIM(RTRIM(p.pais)))
    OUTER APPLY (
        SELECT TOP (1)
            i.tipo_id,
            i.creditos_otorgados
        FROM stg_oracle_tienda_orden o
        INNER JOIN stg_oracle_tienda_item i
            ON i.item_id = o.item_id
        WHERE o.usuario_id = t.usuario_id
          AND ABS(o.monto - t.monto) <= 0.01
          AND ABS(DATEDIFF(SECOND, o.creado_en, t.creado_en)) <= 300
        ORDER BY ABS(DATEDIFF(SECOND, o.creado_en, t.creado_en)), o.orden_id DESC
    ) orden_match
)
INSERT INTO fact_ingresos (
    id_dim_tiempo,
    id_dim_region,
    id_dim_tipo_item,
    id_dim_origen,
    id_dim_usuario,
    id_dim_responsable,
    version_responsable,
    monto_real,
    meta_ingresos,
    creditos_otorgados,
    cantidad
)
SELECT
    dt.id_tiempo,
    te.id_region,
    te.id_tipo_item,
    te.id_origen,
    te.id_usuario,
    rr.id_empleado,
    rr.version,
    te.monto AS monto_real,
    pv.meta_ingresos_usd AS meta_ingresos,
    te.creditos_otorgados,
    1 AS cantidad
FROM transacciones_enriquecidas te
INNER JOIN dim_tiempo dt
    ON dt.id_tiempo = (YEAR(te.fecha_evento) * 10000) + (MONTH(te.fecha_evento) * 100) + DAY(te.fecha_evento)
INNER JOIN dim_region dr
    ON dr.id_region = te.id_region
INNER JOIN dim_tipo_item dti
    ON dti.id_tipo_item = te.id_tipo_item
INNER JOIN dim_origen_transaccion dot
    ON dot.id_origen = te.id_origen
INNER JOIN dim_usuario_comprador duc
    ON duc.id_usuario = te.id_usuario
LEFT JOIN stg_excel_presupuestos_ventas pv
    ON pv.anio = dt.anio
   AND pv.mes = dt.mes_numero
   AND UPPER(LTRIM(RTRIM(pv.region))) = UPPER(LTRIM(RTRIM(dr.nombre_region)))
   AND UPPER(LTRIM(RTRIM(pv.categoria_producto))) = UPPER(LTRIM(RTRIM(dti.nombre_tipo)))
LEFT JOIN dim_responsable_rrhh rr
    ON rr.id_empleado = pv.responsable_rrhh_id
   AND rr.version_actual = 1;
```

### 7.2 SQL para ETL_03_Fact_DM2_Comportamiento.dtsx

```sql
TRUNCATE TABLE fact_actividad_usuario;

;WITH amigos AS (
    SELECT usuario_id, COUNT(*) AS total_amigos
    FROM (
        SELECT usuario1_id AS usuario_id FROM stg_oracle_usuario_amigos
        UNION ALL
        SELECT usuario2_id AS usuario_id FROM stg_oracle_usuario_amigos
    ) x
    WHERE usuario_id IS NOT NULL
    GROUP BY usuario_id
),
seguidores AS (
    SELECT seguido_id AS usuario_id, COUNT(*) AS total_seguidores
    FROM stg_oracle_usuario_seguidores
    WHERE seguido_id IS NOT NULL
    GROUP BY seguido_id
),
social AS (
    SELECT
        u.usuario_id,
        COALESCE(a.total_amigos, 0) AS total_amigos,
        COALESCE(s.total_seguidores, 0) AS total_seguidores
    FROM stg_oracle_usuario u
    LEFT JOIN amigos a ON a.usuario_id = u.usuario_id
    LEFT JOIN seguidores s ON s.usuario_id = u.usuario_id
),
stats AS (
    SELECT
        usuario_id,
        COALESCE(juego_id, 0) AS juego_id,
        SUM(victorias) AS victorias,
        SUM(horas_jugadas) AS horas_jugadas
    FROM stg_oracle_usuario_estadisticas_juego
    GROUP BY usuario_id, COALESCE(juego_id, 0)
),
logs AS (
    SELECT
        l.*,
        (YEAR(l.timestamp_evento) * 10000) + (MONTH(l.timestamp_evento) * 100) + DAY(l.timestamp_evento) AS id_tiempo
    FROM stg_mongo_logs_actividad_evento l
    WHERE l.timestamp_evento IS NOT NULL
)
INSERT INTO fact_actividad_usuario (
    id_dim_tiempo,
    id_dim_usuario,
    id_dim_juego,
    id_dim_tipo_evento,
    id_dim_pais,
    total_amigos,
    total_seguidores,
    xp_acumulado,
    cantidad_eventos,
    tiempo_sesion_seg,
    victorias,
    horas_jugadas
)
SELECT
    logs.id_tiempo,
    COALESCE(logs.oracle_usuario_id, 0) AS id_dim_usuario,
    COALESCE(t.juego_id, 0) AS id_dim_juego,
    dte.id_tipo_evento,
    dp.id_pais,
    COALESCE(sc.total_amigos, 0) AS total_amigos,
    COALESCE(sc.total_seguidores, 0) AS total_seguidores,
    COALESCE(du.xp, 0) AS xp_acumulado,
    1 AS cantidad_eventos,
    CASE
        WHEN logs.tipo_evento = 'logout' THEN COALESCE(logs.detalle_duracion_sesion_min, 0) * 60
        ELSE NULL
    END AS tiempo_sesion_seg,
    st.victorias,
    st.horas_jugadas
FROM logs
INNER JOIN dim_tiempo dt
    ON dt.id_tiempo = logs.id_tiempo
INNER JOIN dim_usuario du
    ON du.id_usuario = COALESCE(logs.oracle_usuario_id, 0)
INNER JOIN dim_tipo_evento dte
    ON dte.nombre_evento = logs.tipo_evento
INNER JOIN dim_pais dp
    ON dp.nombre_pais = COALESCE(NULLIF(LTRIM(RTRIM(logs.pais_origen)), ''), 'DESCONOCIDO')
LEFT JOIN stg_oracle_torneo t
    ON t.torneo_id = logs.detalle_torneo_id
LEFT JOIN dim_juego dj
    ON dj.id_juego = COALESCE(t.juego_id, 0)
LEFT JOIN social sc
    ON sc.usuario_id = COALESCE(logs.oracle_usuario_id, 0)
LEFT JOIN stats st
    ON st.usuario_id = COALESCE(logs.oracle_usuario_id, 0)
   AND st.juego_id = COALESCE(t.juego_id, 0);
```

### 7.3 SQL para ETL_04_Fact_DM3_Torneos.dtsx

```sql
TRUNCATE TABLE fact_torneos;

;WITH estado_confirmada AS (
    SELECT TOP (1) id_estado
    FROM stg_oracle_catalogo_estado_inscripcion
    WHERE UPPER(valor_estado) = 'CONFIRMADA'
),
inscripciones AS (
    SELECT
        ti.torneo_id,
        COUNT(*) AS total_inscritos,
        SUM(CASE WHEN ti.estado_id = ec.id_estado THEN 1 ELSE 0 END) AS inscritos_confirmados
    FROM stg_oracle_torneo_inscripcion ti
    CROSS JOIN estado_confirmada ec
    GROUP BY ti.torneo_id
),
feedback AS (
    SELECT
        f.oracle_torneo_id AS torneo_id,
        AVG(CAST(f.calificacion AS DECIMAL(10,2))) AS calificacion_promedio,
        COUNT(*) AS total_resenas,
        CASE
            WHEN COUNT(*) = 0 THEN 0
            ELSE 100.0 * SUM(CASE WHEN f.recomendaria = 1 THEN 1 ELSE 0 END) / COUNT(*)
        END AS pct_recomendacion
    FROM stg_mongo_feedback_torneos_evento f
    WHERE f.oracle_torneo_id IS NOT NULL
    GROUP BY f.oracle_torneo_id
),
base_torneo AS (
    SELECT
        t.torneo_id,
        t.fecha_inicio_torneo,
        (YEAR(t.fecha_inicio_torneo) * 10000) + (MONTH(t.fecha_inicio_torneo) * 100) + DAY(t.fecha_inicio_torneo) AS id_tiempo,
        COALESCE(t.juego_id, 0) AS juego_id,
        COALESCE(t.modo_juego_id, 0) AS modo_juego_id,
        COALESCE(t.tipo_torneo_id, 0) AS tipo_torneo_id,
        COALESCE(t.plataforma_id, 0) AS plataforma_id,
        COALESCE(t.region_id, 0) AS region_id,
        t.capacidad
    FROM stg_oracle_torneo t
    WHERE t.fecha_inicio_torneo IS NOT NULL
)
INSERT INTO fact_torneos (
    id_dim_tiempo,
    id_dim_juego,
    id_dim_modo_juego,
    id_dim_tipo_torneo,
    id_dim_plataforma,
    id_dim_region,
    total_inscritos,
    inscritos_confirmados,
    capacidad,
    fondo_premios,
    comision,
    calificacion_promedio,
    total_resenas,
    pct_recomendacion,
    cantidad_torneos
)
SELECT
    bt.id_tiempo,
    bt.juego_id,
    bt.modo_juego_id,
    bt.tipo_torneo_id,
    bt.plataforma_id,
    bt.region_id,
    COALESCE(i.total_inscritos, 0) AS total_inscritos,
    COALESCE(i.inscritos_confirmados, 0) AS inscritos_confirmados,
    bt.capacidad,
    COALESCE(tp.fondo_total, 0) AS fondo_premios,
    COALESCE(tp.comision_total, 0) AS comision,
    COALESCE(f.calificacion_promedio, 0) AS calificacion_promedio,
    COALESCE(f.total_resenas, 0) AS total_resenas,
    COALESCE(f.pct_recomendacion, 0) AS pct_recomendacion,
    1 AS cantidad_torneos
FROM base_torneo bt
INNER JOIN dim_tiempo dt
    ON dt.id_tiempo = bt.id_tiempo
INNER JOIN dim_juego dj
    ON dj.id_juego = bt.juego_id
INNER JOIN dim_modo_juego dmj
    ON dmj.id_modo_juego = bt.modo_juego_id
INNER JOIN dim_tipo_torneo dtt
    ON dtt.id_tipo_torneo = bt.tipo_torneo_id
INNER JOIN dim_plataforma dpl
    ON dpl.id_plataforma = bt.plataforma_id
INNER JOIN dim_region_torneo drt
    ON drt.id_region = bt.region_id
LEFT JOIN inscripciones i
    ON i.torneo_id = bt.torneo_id
LEFT JOIN stg_oracle_torneo_premios tp
    ON tp.torneo_id = bt.torneo_id
LEFT JOIN feedback f
    ON f.torneo_id = bt.torneo_id;
```

### 7.4 SQL para ETL_05_Fact_DM4_Auditoria.dtsx

```sql
TRUNCATE TABLE fact_auditoria;

;WITH audit_detalle AS (
    SELECT
        CAST(a.fecha AS DATE) AS fecha_evento,
        a.operacion,
        a.tabla_auditada,
        CASE
            WHEN a.tabla_auditada = 'USUARIO' THEN a.registro_id
            WHEN a.tabla_auditada = 'TIENDA_ORDEN' THEN o.usuario_id
            ELSE NULL
        END AS usuario_id
    FROM stg_oracle_auditoria_log a
    LEFT JOIN stg_oracle_tienda_orden o
        ON a.tabla_auditada = 'TIENDA_ORDEN'
       AND o.orden_id = a.registro_id
),
audit_agg AS (
    SELECT
        fecha_evento,
        operacion,
        tabla_auditada,
        usuario_id,
        COUNT(*) AS total_eventos
    FROM audit_detalle
    GROUP BY fecha_evento, operacion, tabla_auditada, usuario_id
)
INSERT INTO fact_auditoria (
    id_dim_tiempo,
    id_dim_operacion,
    id_dim_tabla,
    id_dim_empleado_soporte,
    version_empleado,
    id_dim_pais,
    id_dim_rol,
    total_eventos,
    tickets_soporte,
    tickets_resueltos,
    registros_restringidos
)
SELECT
    (YEAR(aa.fecha_evento) * 10000) + (MONTH(aa.fecha_evento) * 100) + DAY(aa.fecha_evento) AS id_dim_tiempo,
    dop.id_operacion,
    dta.id_tabla,
    des.id_empleado,
    des.version,
    dpr.id_pais,
    dru.id_rol,
    aa.total_eventos,
    0 AS tickets_soporte,
    0 AS tickets_resueltos,
    CASE WHEN dpr.es_restringido = 1 THEN aa.total_eventos ELSE 0 END AS registros_restringidos
FROM audit_agg aa
INNER JOIN dim_operacion dop
    ON dop.nombre_operacion = aa.operacion
INNER JOIN dim_tabla_auditada dta
    ON dta.nombre_tabla = aa.tabla_auditada
LEFT JOIN stg_oracle_usuario u
    ON u.usuario_id = aa.usuario_id
LEFT JOIN stg_oracle_persona p
    ON p.persona_id = u.persona_id
LEFT JOIN dim_pais_registro dpr
    ON dpr.nombre_pais = COALESCE(NULLIF(LTRIM(RTRIM(p.pais)), ''), 'DESCONOCIDO')
LEFT JOIN dim_rol_usuario dru
    ON dru.id_rol = u.rol_id
LEFT JOIN dim_empleado_soporte des
    ON des.id_empleado = aa.usuario_id
   AND des.version_actual = 1;

;WITH soporte_creado AS (
    SELECT
        CAST(s.creado_en AS DATE) AS fecha_evento,
        s.usuario_id,
        COUNT(*) AS tickets_soporte
    FROM stg_oracle_tienda_solicitud_soporte s
    GROUP BY CAST(s.creado_en AS DATE), s.usuario_id
)
INSERT INTO fact_auditoria (
    id_dim_tiempo,
    id_dim_operacion,
    id_dim_tabla,
    id_dim_empleado_soporte,
    version_empleado,
    id_dim_pais,
    id_dim_rol,
    total_eventos,
    tickets_soporte,
    tickets_resueltos,
    registros_restringidos
)
SELECT
    (YEAR(sc.fecha_evento) * 10000) + (MONTH(sc.fecha_evento) * 100) + DAY(sc.fecha_evento) AS id_dim_tiempo,
    dop.id_operacion,
    dta.id_tabla,
    NULL AS id_dim_empleado_soporte,
    NULL AS version_empleado,
    dpr.id_pais,
    dru.id_rol,
    0 AS total_eventos,
    sc.tickets_soporte,
    0 AS tickets_resueltos,
    CASE WHEN dpr.es_restringido = 1 THEN sc.tickets_soporte ELSE 0 END AS registros_restringidos
FROM soporte_creado sc
INNER JOIN dim_operacion dop
    ON dop.nombre_operacion = 'INSERT'
INNER JOIN dim_tabla_auditada dta
    ON dta.nombre_tabla = 'TIENDA_SOLICITUD_SOPORTE'
LEFT JOIN stg_oracle_usuario u
    ON u.usuario_id = sc.usuario_id
LEFT JOIN stg_oracle_persona p
    ON p.persona_id = u.persona_id
LEFT JOIN dim_pais_registro dpr
    ON dpr.nombre_pais = COALESCE(NULLIF(LTRIM(RTRIM(p.pais)), ''), 'DESCONOCIDO')
LEFT JOIN dim_rol_usuario dru
    ON dru.id_rol = u.rol_id;

;WITH soporte_resuelto AS (
    SELECT
        CAST(s.resuelto_en AS DATE) AS fecha_evento,
        s.resuelto_por,
        COUNT(*) AS tickets_resueltos
    FROM stg_oracle_tienda_solicitud_soporte s
    WHERE s.resuelto_en IS NOT NULL
      AND s.resuelto_por IS NOT NULL
    GROUP BY CAST(s.resuelto_en AS DATE), s.resuelto_por
)
INSERT INTO fact_auditoria (
    id_dim_tiempo,
    id_dim_operacion,
    id_dim_tabla,
    id_dim_empleado_soporte,
    version_empleado,
    id_dim_pais,
    id_dim_rol,
    total_eventos,
    tickets_soporte,
    tickets_resueltos,
    registros_restringidos
)
SELECT
    (YEAR(sr.fecha_evento) * 10000) + (MONTH(sr.fecha_evento) * 100) + DAY(sr.fecha_evento) AS id_dim_tiempo,
    dop.id_operacion,
    dta.id_tabla,
    des.id_empleado,
    des.version,
    dpr.id_pais,
    dru.id_rol,
    0 AS total_eventos,
    0 AS tickets_soporte,
    sr.tickets_resueltos,
    CASE WHEN dpr.es_restringido = 1 THEN sr.tickets_resueltos ELSE 0 END AS registros_restringidos
FROM soporte_resuelto sr
INNER JOIN dim_operacion dop
    ON dop.nombre_operacion = 'UPDATE'
INNER JOIN dim_tabla_auditada dta
    ON dta.nombre_tabla = 'TIENDA_SOLICITUD_SOPORTE'
LEFT JOIN stg_oracle_usuario u
    ON u.usuario_id = sr.resuelto_por
LEFT JOIN stg_oracle_persona p
    ON p.persona_id = u.persona_id
LEFT JOIN dim_pais_registro dpr
    ON dpr.nombre_pais = COALESCE(NULLIF(LTRIM(RTRIM(p.pais)), ''), 'DESCONOCIDO')
LEFT JOIN dim_rol_usuario dru
    ON dru.id_rol = u.rol_id
LEFT JOIN dim_empleado_soporte des
    ON des.id_empleado = sr.resuelto_por
   AND des.version_actual = 1;
```

---

## Fase 8 - Ejecucion secuencial de paquetes SSIS

Ejecutar en este orden exacto:

1. ETL_00_Staging.dtsx
2. ETL_01_Dimensiones.dtsx
3. ETL_02_Fact_DM1_Ingresos.dtsx
4. ETL_03_Fact_DM2_Comportamiento.dtsx
5. ETL_04_Fact_DM3_Torneos.dtsx
6. ETL_05_Fact_DM4_Auditoria.dtsx

Validacion inmediata en SQL Server:

```sql
SELECT COUNT(*) AS filas_dim_tiempo FROM dim_tiempo;
SELECT COUNT(*) AS filas_fact_ingresos FROM fact_ingresos;
SELECT COUNT(*) AS filas_fact_actividad_usuario FROM fact_actividad_usuario;
SELECT COUNT(*) AS filas_fact_torneos FROM fact_torneos;
SELECT COUNT(*) AS filas_fact_auditoria FROM fact_auditoria;
```

---

## Fase 9 - Cubos SSAS

### 9.1 Crear proyecto SSAS

1. En la misma solucion, agregar proyecto Analysis Services Multidimensional and Data Mining.
2. Nombre: SSAS_DW_ESPORTS.

### 9.2 Data Source y Data Source View

1. Data Source a localhost / DW_ESPORTS.
2. Data Source View con todas las tablas dim_* y fact_*.

### 9.3 Dimensiones

Crear dimensiones para cada tabla dim_*. Definir clave en su PK.

### 9.4 Cubos

Crear 4 cubos:

1. Cubo_Ingresos (Measure Group: fact_ingresos)
   - Medidas: monto_real, meta_ingresos, creditos_otorgados, cantidad
2. Cubo_Comportamiento (Measure Group: fact_actividad_usuario)
   - Medidas: total_amigos, total_seguidores, xp_acumulado, cantidad_eventos, tiempo_sesion_seg, victorias, horas_jugadas
3. Cubo_Torneos (Measure Group: fact_torneos)
   - Medidas: total_inscritos, inscritos_confirmados, capacidad, fondo_premios, comision, calificacion_promedio, total_resenas, pct_recomendacion, cantidad_torneos
4. Cubo_Auditoria (Measure Group: fact_auditoria)
   - Medidas: total_eventos, tickets_soporte, tickets_resueltos, registros_restringidos

### 9.5 Deploy y Process

1. Target Server: localhost.
2. Deploy del proyecto.
3. Process Full de dimensiones y cubos.

---

## Fase 10 - Dashboards Power BI y verificacion final

### 10.1 Conexion a SSAS

1. Power BI Desktop.
2. Get Data -> SQL Server Analysis Services database.
3. Server: localhost.
4. Modo: Connect live.

### 10.2 Crear 4 paginas obligatorias

1. Pagina Ingresos y Monetizacion
   - Visual 1: monto_real por nombre_region
   - Visual 2: meta_ingresos por mes_nombre
   - Visual 3: monto_real vs meta_ingresos

2. Pagina Comportamiento de Usuario
   - Visual 1: cantidad_eventos por nombre_evento
   - Visual 2: xp_acumulado por nickname
   - Visual 3: tiempo_sesion_seg por nombre_pais

3. Pagina Calidad de Torneos
   - Visual 1: total_inscritos por nombre_juego
   - Visual 2: calificacion_promedio por nombre_tipo
   - Visual 3: pct_recomendacion por nombre_plataforma

4. Pagina Seguridad y Auditoria
   - Visual 1: total_eventos por nombre_operacion
   - Visual 2: registros_restringidos por nombre_pais
   - Visual 3: tickets_soporte y tickets_resueltos por nombre_tabla

### 10.3 Verificacion final de consistencia

Ejecutar en SQL Server:

```sql
SELECT TOP 20 * FROM fact_ingresos ORDER BY id_dim_tiempo DESC;
SELECT TOP 20 * FROM fact_actividad_usuario ORDER BY id_dim_tiempo DESC;
SELECT TOP 20 * FROM fact_torneos ORDER BY id_dim_tiempo DESC;
SELECT TOP 20 * FROM fact_auditoria ORDER BY id_dim_tiempo DESC;

SELECT nombre_pais, es_restringido, motivo_restriccion
FROM dim_pais_registro
WHERE es_restringido = 1
ORDER BY nombre_pais;
```

Con esta secuencia el flujo completo queda:

Oracle + RRHH + Excel + Mongo CSV -> Staging normalizado -> Dimensiones -> Hechos -> SSAS -> Power BI.
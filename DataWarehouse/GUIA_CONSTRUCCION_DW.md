# Guia Secuencial Exacta de Construccion del Data Warehouse - eSports Platform

> Esta guia reemplaza el flujo anterior por una ejecucion unica, lineal y verificable.
> Se basa en las estructuras reales de:
> - Oracle: Script Maestro Oracle/BD/DO/DDL/03_TABLAS.sql
> - Oracle auditoria: Script Maestro Oracle/BD/DO/TRIGGER/01_TRIGGERS.sql
> - RRHH SQL Server: backend/src/database/scripts/base-rrhh.sql
> - Excel: DataWarehouse/Excel/generar_excel_dw.js
> - MongoDB: DataWarehouse/MongoDB/init_esports_analytics.js
> - XLSX Mongo exportados: DataWarehouse/MongoDB/exports/*.xlsx

## Indice

1. Fase 0 - Preparacion de fuentes
2. Fase 1 - Creacion de DW_ESPORTS y DIM_TIEMPO
3. Fase 2 - Creacion de tablas de staging normalizado y esquema estrella
4. Fase 3 - Configuracion del proyecto SSIS
5. Fase 4 - Carga de staging desde Oracle, RRHH, Excel y Mongo XLSX
6. Fase 5 - Normalizacion de staging Mongo
7. Fase 6 - Carga de dimensiones
8. Fase 7 - Carga de hechos (DM1, DM2, DM3, DM4)
9. Fase 8 - Ejecucion secuencial de paquetes SSIS
10. Fase 9 - Cubos SSAS
11. Fase 10 - Dashboards Power BI y verificacion final
12. Fase 11 - Proyecto Reporting Services (SSRS)

## Reglas de ejecucion

1. Ejecutar las fases en el orden exacto del indice.
2. No saltar fases.
3. No ejecutar cargas de hechos antes de completar staging y dimensiones.
4. Oracle en SSIS se configura con servidor: localhost:1521/xe
5. MongoDB se integra mediante archivos XLSX exportados con script Node.js.
6. En Fase 6, dim_responsable_rrhh y dim_empleado_soporte se cargan de forma incremental con MERGE y no se truncan.

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

### 0.3 Exportar MongoDB a XLSX

```powershell
node .\DataWarehouse\MongoDB\export_mongo_dw_xlsx.js
```

Esto genera:

- DataWarehouse/MongoDB/exports/logs_actividad_dw.xlsx
- DataWarehouse/MongoDB/exports/feedback_torneos_dw.xlsx

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

5. CONN_EXCEL_LOGS_ACTIVIDAD
   - Tipo: EXCEL
   - Archivo: DataWarehouse/MongoDB/exports/logs_actividad_dw.xlsx
   - First row has column names: marcado
   - Hoja: logs_actividad$

6. CONN_EXCEL_FEEDBACK_TORNEOS
   - Tipo: EXCEL
   - Archivo: DataWarehouse/MongoDB/exports/feedback_torneos_dw.xlsx
   - First row has column names: marcado
   - Hoja: feedback_torneos$

---

## Fase 4 - Carga de staging desde Oracle, RRHH, Excel y Mongo XLSX

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
    - SQL command text (sin punto y coma final):

```sql
SELECT ID AS id_region, VALOR AS nombre_region
FROM CATALOGO_REGION
```

5. Click Preview para verificar que trae filas.
6. Click OK.
7. En SSIS Toolbox (seccion Data Flow Transformations), arrastrar Data Conversion.
8. Renombrar a CNV_ORA_CATALOGO_REGION.
9. Arrastrar la flecha azul desde SRC_ORA_CATALOGO_REGION hacia CNV_ORA_CATALOGO_REGION.
10. Doble click en CNV_ORA_CATALOGO_REGION.
11. En Data Conversion Transformation Editor:
    - Marcar la columna NOMBRE_REGION (o nombre_region, segun aparezca).
    - Output Alias: nombre_region_str.
    - Data Type: string [DT_STR].
    - Length: 200.
    - Code page: 1252.
12. Click OK.
13. En SSIS Toolbox (seccion Other Destinations), arrastrar OLE DB Destination.
14. Renombrar a DST_STG_ORACLE_CATALOGO_REGION.
15. Arrastrar la flecha azul desde CNV_ORA_CATALOGO_REGION hacia DST_STG_ORACLE_CATALOGO_REGION.
16. Doble click en DST_STG_ORACLE_CATALOGO_REGION.
17. En OLE DB Destination Editor:
    - OLE DB connection manager: CONN_SQLSERVER_DW.
    - Data access mode: Table or view - fast load.
    - Name of the table or view: stg_oracle_catalogo_region.
18. Ir a la pestana Mappings.
19. Verificar:
    - id_region -> id_region
    - nombre_region_str -> nombre_region
20. Click OK.

#### 4.3.3 Duplicar rapidamente para las demas cargas Oracle

1. Seleccionar SRC_ORA_CATALOGO_REGION, CNV_ORA_CATALOGO_REGION y DST_STG_ORACLE_CATALOGO_REGION (mantener Ctrl y click en los 3).
2. Presionar Ctrl+C.
3. Presionar Ctrl+V para crear una copia del trio source/conversion/destination con sus flechas.
4. Renombrar los tres componentes copiados para la siguiente tabla.
5. Abrir el Source copiado y cambiar SQL.
6. Abrir el Data Conversion copiado y convertir todas las columnas de texto que van a VARCHAR destino:
    - Tipo: string [DT_STR]
    - Length: igual a la longitud de la columna destino
    - Code page: 1252
7. Abrir el Destination copiado y cambiar Name of the table or view.
8. Ir a Mappings y validar columnas (usar las columnas convertidas *_str para textos).
9. Repetir hasta completar toda la lista Oracle de abajo.

### 4.3.4 Lista exacta de cargas Oracle (SQL y destino)

Importante: todas estas consultas Oracle se pegan en OLE DB Source sin ';' al final.
Importante: si una columna destino en SQL Server es VARCHAR, convertir antes en Data Conversion a DT_STR (code page 1252) para evitar error Unicode/no-Unicode.

1. Destino: stg_oracle_catalogo_region

```sql
SELECT ID AS id_region, VALOR AS nombre_region
FROM CATALOGO_REGION
```

2. Destino: stg_oracle_catalogo_tipo_item

```sql
SELECT ID AS id_tipo_item, VALOR AS nombre_tipo
FROM CATALOGO_TIPO_ITEM
```

3. Destino: stg_oracle_catalogo_origen_transaccion

```sql
SELECT ID AS id_origen, VALOR AS nombre_origen
FROM CATALOGO_ORIGEN_TRANSACCION
```

4. Destino: stg_oracle_catalogo_tipo_torneo

```sql
SELECT ID AS id_tipo_torneo, VALOR AS nombre_tipo, TIPO_TROFEO AS tipo_trofeo
FROM CATALOGO_TIPO_TORNEO
```

5. Destino: stg_oracle_catalogo_plataforma

```sql
SELECT ID AS id_plataforma, VALOR AS nombre_plataforma
FROM CATALOGO_PLATAFORMA
```

6. Destino: stg_oracle_catalogo_rol

```sql
SELECT ID AS id_rol, VALOR AS nombre_rol
FROM CATALOGO_ROL
```

7. Destino: stg_oracle_catalogo_estado_inscripcion

```sql
SELECT ID AS id_estado, VALOR AS valor_estado
FROM CATALOGO_ESTADO_INSCRIPCION
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
FROM USUARIO
```

9. Destino: stg_oracle_persona

```sql
SELECT
    ID AS persona_id,
    PAIS AS pais,
    DIVISA AS divisa,
    CORREO AS correo
FROM PERSONA
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
FROM TRANSACCION
```

11. Destino: stg_oracle_tienda_item

```sql
SELECT
    ID AS item_id,
    NOMBRE AS nombre_item,
    PRECIO AS precio,
    CREDITOS_OTORGADOS AS creditos_otorgados,
    TIPO_ID AS tipo_id
FROM TIENDA_ITEM
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
FROM TIENDA_ORDEN
```

13. Destino: stg_oracle_juego

```sql
SELECT ID AS juego_id, NOMBRE AS nombre_juego
FROM JUEGO
```

14. Destino: stg_oracle_modo_juego

```sql
SELECT ID AS modo_juego_id, NOMBRE AS nombre_modo, JUEGO_ID AS juego_id
FROM MODO_JUEGO
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
FROM TORNEO
```

16. Destino: stg_oracle_torneo_inscripcion

```sql
SELECT
    ID AS inscripcion_id,
    FECHA AS fecha,
    TORNEO_ID AS torneo_id,
    USUARIO_ID AS usuario_id,
    ESTADO_ID AS estado_id
FROM TORNEO_INSCRIPCION
```

17. Destino: stg_oracle_torneo_premios

```sql
SELECT
    TORNEO_ID AS torneo_id,
    FONDO_TOTAL AS fondo_total,
    COMISION_TOTAL AS comision_total
FROM TORNEO_PREMIOS
```

18. Destino: stg_oracle_usuario_amigos

```sql
SELECT
    ID AS amistad_id,
    CREADO_EN AS creado_en,
    USUARIO1_ID AS usuario1_id,
    USUARIO2_ID AS usuario2_id,
    ESTADO_ID AS estado_id
FROM USUARIO_AMIGOS
```

19. Destino: stg_oracle_usuario_seguidores

```sql
SELECT
    ID AS seguimiento_id,
    CREADO_EN AS creado_en,
    SEGUIDOR_ID AS seguidor_id,
    SEGUIDO_ID AS seguido_id
FROM USUARIO_SEGUIDORES
```

20. Destino: stg_oracle_usuario_estadisticas_juego

```sql
SELECT
    USUARIO_ID AS usuario_id,
    JUEGO_ID AS juego_id,
    VICTORIAS AS victorias,
    HORAS_JUGADAS AS horas_jugadas
FROM USUARIO_ESTADISTICAS_JUEGO
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
FROM AUDITORIA_LOG
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
FROM TIENDA_SOLICITUD_SOPORTE
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

#### 4.6.1 Carga de logs_actividad_dw.xlsx

1. Arrastrar Excel Source.
2. Renombrar a SRC_XLS_LOGS_ACTIVIDAD.
3. Doble click en SRC_XLS_LOGS_ACTIVIDAD:
   - Excel connection manager: CONN_EXCEL_LOGS_ACTIVIDAD.
   - Data access mode: Table or view.
   - Name of the Excel sheet: logs_actividad$.
4. Click Preview.
5. Click OK.
6. Arrastrar Data Conversion y renombrar a DC_LOGS_ACTIVIDAD.
7. Conectar flecha azul de SRC_XLS_LOGS_ACTIVIDAD a DC_LOGS_ACTIVIDAD.
8. En DC_LOGS_ACTIVIDAD convertir las columnas de Excel (Unicode string [DT_WSTR]) a tipos compatibles con SQL Server:
   - IDs (oracle_usuario_id, detalle_perfil_visitado_id, detalle_torneo_id, detalle_item_id, detalle_destinatario_id): DT_I4 o DT_STR segun tabla destino.
   - Timestamp (_id y timestamp): DT_STR para campos raw o DT_DBTIMESTAMP cuando aplique conversion directa.
   - Mantener alias de salida claros (ejemplo: timestamp_raw_conv, oracle_usuario_id_conv).
9. Arrastrar OLE DB Destination.
10. Renombrar a DST_STG_MONGO_LOGS_RAW.
11. Conectar flecha azul de DC_LOGS_ACTIVIDAD a DST_STG_MONGO_LOGS_RAW.
12. Doble click en DST_STG_MONGO_LOGS_RAW:
   - OLE DB connection manager: CONN_SQLSERVER_DW.
   - Data access mode: Table or view - fast load.
   - Name of the table or view: stg_mongo_logs_actividad_raw.
13. Ir a Mappings y verificar exacto (usando columnas convertidas cuando corresponda):
   - oracle_usuario_id -> oracle_usuario_id
   - tipo_evento -> tipo_evento
   - ip -> ip
   - user_agent -> user_agent
   - pais_origen -> pais_origen
   - timestamp -> timestamp_raw
   - detalle_metodo -> detalle_metodo
   - detalle_exitoso -> detalle_exitoso
   - detalle_duracion_sesion_min -> detalle_duracion_sesion_min
   - detalle_termino -> detalle_termino
   - detalle_resultados_encontrados -> detalle_resultados_encontrados
   - detalle_perfil_visitado_id -> detalle_perfil_visitado_id
   - detalle_tiempo_visualizacion_seg -> detalle_tiempo_visualizacion_seg
   - detalle_desde_seccion -> detalle_desde_seccion
   - detalle_torneo_id -> detalle_torneo_id
   - detalle_accion -> detalle_accion
   - detalle_item_id -> detalle_item_id
   - detalle_categoria -> detalle_categoria
   - detalle_seccion -> detalle_seccion
   - detalle_campo_modificado -> detalle_campo_modificado
   - detalle_destinatario_id -> detalle_destinatario_id
14. Click OK.

#### 4.6.2 Carga de feedback_torneos_dw.xlsx

1. Arrastrar Excel Source.
2. Renombrar a SRC_XLS_FEEDBACK_TORNEOS.
3. Doble click en SRC_XLS_FEEDBACK_TORNEOS:
   - Excel connection manager: CONN_EXCEL_FEEDBACK_TORNEOS.
   - Data access mode: Table or view.
   - Name of the Excel sheet: feedback_torneos$.
4. Click Preview.
5. Click OK.
6. Arrastrar Data Conversion y renombrar a DC_FEEDBACK_TORNEOS.
7. Conectar flecha azul de SRC_XLS_FEEDBACK_TORNEOS a DC_FEEDBACK_TORNEOS.
8. En DC_FEEDBACK_TORNEOS convertir campos DT_WSTR a tipos SQL compatibles:
   - IDs (_id, oracle_torneo_id, oracle_usuario_id): DT_I4 o DT_STR segun destino.
   - Timestamp: DT_STR para timestamp_raw o DT_DBTIMESTAMP si se parsea en flujo.
9. Arrastrar OLE DB Destination.
10. Renombrar a DST_STG_MONGO_FEEDBACK_RAW.
11. Conectar flecha azul de DC_FEEDBACK_TORNEOS a DST_STG_MONGO_FEEDBACK_RAW.
12. Doble click en DST_STG_MONGO_FEEDBACK_RAW:
   - OLE DB connection manager: CONN_SQLSERVER_DW.
   - Data access mode: Table or view - fast load.
   - Name of the table or view: stg_mongo_feedback_torneos_raw.
13. Ir a Mappings y validar (usar salidas convertidas cuando aplique):
   - oracle_torneo_id -> oracle_torneo_id
   - oracle_usuario_id -> oracle_usuario_id
   - calificacion -> calificacion
   - comentario -> comentario
   - tags -> tags
   - recomendaria -> recomendaria
   - timestamp -> timestamp_raw
14. Click OK.

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
5. Antes de ejecutar SSIS, correr el export de Mongo a XLSX:
   ```powershell
   node .\DataWarehouse\MongoDB\export_mongo_dw_xlsx.js
   ```
6. Ejecutar el paquete con F5.
7. Esperar a que cada task cambie a color verde.
8. Si alguno queda rojo:
   - Click en pestana Progress.
   - Buscar primer mensaje Error.
   - Doble click en el componente indicado.
   - Corregir connection manager, SQL o mappings.
   - Ejecutar otra vez con F5.

Nota critica para Mongo normalizado:

1. Antes de continuar a Fase 6/7, abrir el task SQL_Normalizar_Mongo en ETL_00_Staging.dtsx.
2. Confirmar que el SQL del task contiene el bloque COALESCE con TRY_CONVERT(DATETIMEOFFSET, ..., 127).
3. Confirmar que SQL_Normalizar_Mongo esta conectado al final del flujo con flecha verde desde DFT_Cargar_Staging_Mongo_Raw.
4. Si no esta conectado, ETL_00 puede terminar en verde pero dejar stg_mongo_logs_actividad_evento vacia o con timestamp_evento nulo.

### 4.8 Verificacion SQL inmediata despues de ejecutar

Precondicion: confirmar que los archivos XLSX de Mongo fueron regenerados con:

```powershell
node .\DataWarehouse\MongoDB\export_mongo_dw_xlsx.js
```

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
SELECT COUNT(*) AS c FROM stg_mongo_logs_actividad_evento;
SELECT COUNT(*) AS c_timestamp_ok FROM stg_mongo_logs_actividad_evento WHERE timestamp_evento IS NOT NULL;
SELECT COUNT(*) AS c FROM stg_mongo_feedback_torneos_evento;
SELECT COUNT(*) AS c_timestamp_ok FROM stg_mongo_feedback_torneos_evento WHERE timestamp_evento IS NOT NULL;
```

---

## Fase 5 - Normalizacion de staging Mongo

En ETL_00_Staging.dtsx agregar Execute SQL Task final: SQL_Normalizar_Mongo.

Pasos obligatorios de conexion en Control Flow (orden estricto):

1. Arrastrar Execute SQL Task al final del flujo y renombrar a SQL_Normalizar_Mongo.
2. Conectar flecha verde de exito desde DFT_Cargar_Staging_Mongo_Raw hacia SQL_Normalizar_Mongo.
3. Abrir SQL_Normalizar_Mongo y asignar Connection: CONN_SQLSERVER_DW.
4. Pegar el SQL de esta fase y guardar.

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
    COALESCE(
        TRY_CONVERT(DATETIME2, TRY_CONVERT(DATETIMEOFFSET, NULLIF(LTRIM(RTRIM(timestamp_raw)), ''), 127)),
        TRY_CONVERT(DATETIME2, NULLIF(LTRIM(RTRIM(timestamp_raw)), ''), 126),
        TRY_CAST(REPLACE(REPLACE(NULLIF(LTRIM(RTRIM(timestamp_raw)), ''), 'T', ' '), 'Z', '') AS DATETIME2)
    ) AS timestamp_evento,
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
    COALESCE(
        TRY_CONVERT(DATETIME2, TRY_CONVERT(DATETIMEOFFSET, NULLIF(LTRIM(RTRIM(timestamp_raw)), ''), 127)),
        TRY_CONVERT(DATETIME2, NULLIF(LTRIM(RTRIM(timestamp_raw)), ''), 126),
        TRY_CAST(REPLACE(REPLACE(NULLIF(LTRIM(RTRIM(timestamp_raw)), ''), 'T', ' '), 'Z', '') AS DATETIME2)
    ) AS timestamp_evento
FROM stg_mongo_feedback_torneos_raw;
```

### 5.1 Gate obligatorio antes de Fase 6 (no continuar si falla)

Ejecutar inmediatamente en SSMS al terminar ETL_00_Staging.dtsx:

```sql
SELECT COUNT(*) AS c_raw_logs FROM stg_mongo_logs_actividad_raw;
SELECT COUNT(*) AS c_evento_logs FROM stg_mongo_logs_actividad_evento;
SELECT COUNT(*) AS c_evento_logs_timestamp_ok
FROM stg_mongo_logs_actividad_evento
WHERE timestamp_evento IS NOT NULL;
```

Criterio de avance a Fase 6:

1. c_raw_logs > 0
2. c_evento_logs > 0
3. c_evento_logs_timestamp_ok > 0

Si cualquiera da 0, detener el flujo y corregir en este orden exacto:

1. Abrir ETL_00_Staging.dtsx -> Control Flow.
2. Verificar que existe SQL_Normalizar_Mongo y que esta habilitado (Disabled = False).
3. Verificar precedencia: DFT_Cargar_Staging_Mongo_Raw -> SQL_Normalizar_Mongo con Exito (flecha verde).
4. Abrir SQL_Normalizar_Mongo y confirmar que el SQL es exactamente el de Fase 5 (incluyendo COALESCE con TRY_CONVERT DATETIMEOFFSET estilo 127).
5. Guardar el paquete (Ctrl+Shift+S).
6. Ejecutar solo ETL_00_Staging.dtsx.
7. Repetir este gate 5.1.
8. Solo si pasa el gate, continuar con ETL_01_Dimensiones.dtsx y luego hechos.

---

## Fase 6 - Carga de dimensiones

Crear paquete ETL_01_Dimensiones.dtsx.

### 6.1 Armar Control Flow secuencial del paquete ETL_01_Dimensiones.dtsx

1. Abrir ETL_01_Dimensiones.dtsx.
2. En SSIS Toolbox (seccion Common), arrastrar Execute SQL Task y renombrar a SQL_Reset_Dimensiones_FullRefresh.
3. Arrastrar otro Execute SQL Task y renombrar a SQL_Cargar_Dimensiones_FullRefresh.
4. Arrastrar otro Execute SQL Task y renombrar a SQL_Merge_Dimensiones_RRHH_Incremental.
5. Conectar flechas verdes en este orden:
   - SQL_Reset_Dimensiones_FullRefresh -> SQL_Cargar_Dimensiones_FullRefresh
   - SQL_Cargar_Dimensiones_FullRefresh -> SQL_Merge_Dimensiones_RRHH_Incremental

### 6.2 Configurar Task 1: SQL_Reset_Dimensiones_FullRefresh

1. Doble click en SQL_Reset_Dimensiones_FullRefresh.
2. En Execute SQL Task Editor:
   - ConnectionType: OLE DB.
   - Connection: CONN_SQLSERVER_DW.
   - SQLSourceType: Direct input.
3. Pegar exactamente este SQL:
    - Importante: pegar solo sentencias SQL, sin delimitadores de bloque markdown.

```sql
TRUNCATE TABLE fact_auditoria;
TRUNCATE TABLE fact_torneos;
TRUNCATE TABLE fact_actividad_usuario;
TRUNCATE TABLE fact_ingresos;

DELETE FROM dim_usuario_comprador;
DELETE FROM dim_origen_transaccion;
DELETE FROM dim_tipo_item;
DELETE FROM dim_region;

DELETE FROM dim_tipo_evento;
DELETE FROM dim_pais;
DELETE FROM dim_usuario;
DELETE FROM dim_juego;

DELETE FROM dim_modo_juego;
DELETE FROM dim_tipo_torneo;
DELETE FROM dim_plataforma;
DELETE FROM dim_region_torneo;

DELETE FROM dim_operacion;
DELETE FROM dim_tabla_auditada;
DELETE FROM dim_pais_registro;
DELETE FROM dim_rol_usuario;
```

4. Click OK.

### 6.3 Configurar Task 2: SQL_Cargar_Dimensiones_FullRefresh

1. Doble click en SQL_Cargar_Dimensiones_FullRefresh.
2. En Execute SQL Task Editor:
   - ConnectionType: OLE DB.
   - Connection: CONN_SQLSERVER_DW.
   - SQLSourceType: Direct input.
3. Pegar exactamente este SQL:

```sql
INSERT INTO dim_region (id_region, nombre_region)
VALUES (0, 'DESCONOCIDA');

INSERT INTO dim_region (id_region, nombre_region)
SELECT id_region, nombre_region
FROM stg_oracle_catalogo_region;

;WITH paises_faltantes AS (
    SELECT DISTINCT LTRIM(RTRIM(p.pais)) AS pais
    FROM stg_oracle_persona p
    WHERE p.pais IS NOT NULL
      AND LTRIM(RTRIM(p.pais)) <> ''
      AND NOT EXISTS (
          SELECT 1
          FROM dim_region r
          WHERE UPPER(LTRIM(RTRIM(r.nombre_region))) = UPPER(LTRIM(RTRIM(p.pais)))
      )
)
INSERT INTO dim_region (id_region, nombre_region)
SELECT
    base.max_id + ROW_NUMBER() OVER (ORDER BY pf.pais) AS id_region,
    pf.pais AS nombre_region
FROM paises_faltantes pf
CROSS JOIN (
    SELECT ISNULL(MAX(id_region), 0) AS max_id
    FROM dim_region
) base;

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
VALUES ('DESCONOCIDO');

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

4. Click OK.

### 6.4 Configurar Task 3: SQL_Merge_Dimensiones_RRHH_Incremental

1. Doble click en SQL_Merge_Dimensiones_RRHH_Incremental.
2. En Execute SQL Task Editor:
   - ConnectionType: OLE DB.
   - Connection: CONN_SQLSERVER_DW.
   - SQLSourceType: Direct input.
3. Pegar exactamente este SQL:

```sql
MERGE INTO dim_responsable_rrhh AS tgt
USING (
    SELECT
        id_empleado,
        nombre_completo,
        cargo,
        departamento,
        version,
        version_actual
    FROM stg_rrhh_empleado_historial
) AS src
ON tgt.id_empleado = src.id_empleado
AND tgt.version = src.version
WHEN MATCHED AND (
       ISNULL(tgt.nombre_completo, '') <> ISNULL(src.nombre_completo, '')
    OR ISNULL(tgt.cargo, '') <> ISNULL(src.cargo, '')
    OR ISNULL(tgt.departamento, '') <> ISNULL(src.departamento, '')
    OR ISNULL(tgt.version_actual, -1) <> ISNULL(src.version_actual, -1)
)
THEN
    UPDATE SET
        tgt.nombre_completo = src.nombre_completo,
        tgt.cargo = src.cargo,
        tgt.departamento = src.departamento,
        tgt.version_actual = src.version_actual
WHEN NOT MATCHED BY TARGET THEN
    INSERT (
        id_empleado,
        nombre_completo,
        cargo,
        departamento,
        version,
        version_actual
    )
    VALUES (
        src.id_empleado,
        src.nombre_completo,
        src.cargo,
        src.departamento,
        src.version,
        src.version_actual
    );

MERGE INTO dim_empleado_soporte AS tgt
USING (
    SELECT
        id_empleado,
        nombre_completo,
        cargo,
        departamento,
        version,
        version_actual
    FROM stg_rrhh_empleado_historial
) AS src
ON tgt.id_empleado = src.id_empleado
AND tgt.version = src.version
WHEN MATCHED AND (
       ISNULL(tgt.nombre_completo, '') <> ISNULL(src.nombre_completo, '')
    OR ISNULL(tgt.cargo, '') <> ISNULL(src.cargo, '')
    OR ISNULL(tgt.departamento, '') <> ISNULL(src.departamento, '')
    OR ISNULL(tgt.version_actual, -1) <> ISNULL(src.version_actual, -1)
)
THEN
    UPDATE SET
        tgt.nombre_completo = src.nombre_completo,
        tgt.cargo = src.cargo,
        tgt.departamento = src.departamento,
        tgt.version_actual = src.version_actual
WHEN NOT MATCHED BY TARGET THEN
    INSERT (
        id_empleado,
        nombre_completo,
        cargo,
        departamento,
        version,
        version_actual
    )
    VALUES (
        src.id_empleado,
        src.nombre_completo,
        src.cargo,
        src.departamento,
        src.version,
        src.version_actual
    );
```

4. Click OK.

### 6.5 Ejecutar y validar la Fase 6

1. Volver a Control Flow.
2. Confirmar que los 3 tasks estan en este orden:
   - SQL_Reset_Dimensiones_FullRefresh
   - SQL_Cargar_Dimensiones_FullRefresh
   - SQL_Merge_Dimensiones_RRHH_Incremental
3. Guardar con Ctrl+Shift+S.
4. Ejecutar ETL_01_Dimensiones.dtsx con F5.
5. En SSMS ejecutar exactamente estas validaciones:

```sql
SELECT COUNT(*) AS c_stg_rrhh FROM stg_rrhh_empleado_historial;
SELECT COUNT(*) AS c_dim_responsable_rrhh FROM dim_responsable_rrhh;
SELECT COUNT(*) AS c_dim_empleado_soporte FROM dim_empleado_soporte;

SELECT id_empleado, version, version_actual, cargo, departamento
FROM dim_responsable_rrhh
ORDER BY id_empleado, version;

SELECT id_empleado, version, version_actual, cargo, departamento
FROM dim_empleado_soporte
ORDER BY id_empleado, version;

SELECT id_empleado, version, COUNT(*) AS repeticiones
FROM dim_responsable_rrhh
GROUP BY id_empleado, version
HAVING COUNT(*) > 1;

SELECT id_empleado, version, COUNT(*) AS repeticiones
FROM dim_empleado_soporte
GROUP BY id_empleado, version
HAVING COUNT(*) > 1;
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
        COALESCE(t.tipo_id, 0) AS id_tipo_item,
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
    COALESCE(pv.meta_ingresos_usd, 0) AS meta_ingresos,
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
    AND rr.version_actual = 1
WHERE te.id_region <> 0
  AND te.id_tipo_item <> 0
  AND te.id_usuario <> 0
  AND te.monto > 0
  AND COALESCE(pv.meta_ingresos_usd, 0) > 0;
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
        LOWER(LTRIM(RTRIM(l.tipo_evento))) AS tipo_evento_key,
        UPPER(LTRIM(RTRIM(l.pais_origen))) AS pais_key,
        (YEAR(l.timestamp_evento) * 10000) + (MONTH(l.timestamp_evento) * 100) + DAY(l.timestamp_evento) AS id_tiempo
    FROM stg_mongo_logs_actividad_evento l
    WHERE l.timestamp_evento IS NOT NULL
      AND l.oracle_usuario_id IS NOT NULL
      AND NULLIF(LTRIM(RTRIM(l.tipo_evento)), '') IS NOT NULL
      AND NULLIF(LTRIM(RTRIM(l.pais_origen)), '') IS NOT NULL
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
    du.id_usuario AS id_dim_usuario,
    COALESCE(t.juego_id, 0) AS id_dim_juego,
    dte.id_tipo_evento AS id_dim_tipo_evento,
    dp.id_pais AS id_dim_pais,
    COALESCE(sc.total_amigos, 0) AS total_amigos,
    COALESCE(sc.total_seguidores, 0) AS total_seguidores,
    du.xp AS xp_acumulado,
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
    ON du.id_usuario = logs.oracle_usuario_id
INNER JOIN dim_tipo_evento dte
    ON LOWER(LTRIM(RTRIM(dte.nombre_evento))) = logs.tipo_evento_key
   AND dte.nombre_evento <> 'DESCONOCIDO'
INNER JOIN dim_pais dp
    ON UPPER(LTRIM(RTRIM(dp.nombre_pais))) = logs.pais_key
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
        CAST(COALESCE(s.resuelto_en, s.creado_en) AS DATE) AS fecha_evento,
        COALESCE(s.resuelto_por, s.usuario_id) AS resuelto_por,
        COUNT(*) AS tickets_resueltos
    FROM stg_oracle_tienda_solicitud_soporte s
    WHERE UPPER(LTRIM(RTRIM(COALESCE(s.estado, '')))) = 'RESUELTO'
      AND COALESCE(s.resuelto_por, s.usuario_id) IS NOT NULL
    GROUP BY CAST(COALESCE(s.resuelto_en, s.creado_en) AS DATE), COALESCE(s.resuelto_por, s.usuario_id)
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

1. Regenerar Excel de negocio (presupuestos y lista negra):
    ```powershell
    node .\DataWarehouse\Excel\generar_excel_dw.js
    ```
2. Generar export Mongo en XLSX:
   ```powershell
   node .\DataWarehouse\MongoDB\export_mongo_dw_xlsx.js
   ```
3. ETL_00_Staging.dtsx
4. ETL_01_Dimensiones.dtsx
5. ETL_02_Fact_DM1_Ingresos.dtsx
6. ETL_03_Fact_DM2_Comportamiento.dtsx
7. ETL_04_Fact_DM3_Torneos.dtsx
8. ETL_05_Fact_DM4_Auditoria.dtsx

Validacion inmediata en SQL Server:

```sql
SELECT COUNT(*) AS filas_dim_tiempo FROM dim_tiempo;
SELECT COUNT(*) AS filas_fact_ingresos FROM fact_ingresos;
SELECT COUNT(*) AS filas_fact_actividad_usuario FROM fact_actividad_usuario;
SELECT COUNT(*) AS filas_fact_torneos FROM fact_torneos;
SELECT COUNT(*) AS filas_fact_auditoria FROM fact_auditoria;
```

Si filas_fact_actividad_usuario = 0, ejecutar este diagnostico inmediato:

```sql
SELECT COUNT(*) AS c_raw_logs FROM stg_mongo_logs_actividad_raw;
SELECT COUNT(*) AS c_logs_timestamp_ok
FROM stg_mongo_logs_actividad_evento
WHERE timestamp_evento IS NOT NULL;

SELECT TOP 10 timestamp_raw,
             COALESCE(
                     TRY_CONVERT(DATETIME2, TRY_CONVERT(DATETIMEOFFSET, NULLIF(LTRIM(RTRIM(timestamp_raw)), ''), 127)),
                     TRY_CONVERT(DATETIME2, NULLIF(LTRIM(RTRIM(timestamp_raw)), ''), 126),
                     TRY_CAST(REPLACE(REPLACE(NULLIF(LTRIM(RTRIM(timestamp_raw)), ''), 'T', ' '), 'Z', '') AS DATETIME2)
             ) AS timestamp_parseado
FROM stg_mongo_logs_actividad_raw;

SELECT COUNT(*) AS c_tipo_evento_sin_match
FROM stg_mongo_logs_actividad_evento l
LEFT JOIN dim_tipo_evento d
    ON LOWER(LTRIM(RTRIM(d.nombre_evento))) = LOWER(LTRIM(RTRIM(COALESCE(l.tipo_evento, 'DESCONOCIDO'))))
WHERE l.timestamp_evento IS NOT NULL
    AND d.id_tipo_evento IS NULL;

SELECT COUNT(*) AS c_pais_sin_match
FROM stg_mongo_logs_actividad_evento l
LEFT JOIN dim_pais d
    ON UPPER(LTRIM(RTRIM(d.nombre_pais))) = UPPER(LTRIM(RTRIM(COALESCE(NULLIF(l.pais_origen, ''), 'DESCONOCIDO'))))
WHERE l.timestamp_evento IS NOT NULL
    AND d.id_pais IS NULL;
```

---

## Fase 9 - Cubos SSAS

Objetivo de esta fase:

1. Construir en SSAS 4 cubos multidimensionales (uno por datamart) usando exclusivamente tablas de DW_ESPORTS.
2. Dejar cada cubo procesado y navegable para consumo en Power BI Live Connection.
3. Ejecutar en una secuencia lineal, sin saltos ni regresos entre tipos de tarea.

Resultado esperado al terminar:

1. Proyecto SSAS_DW_ESPORTS creado en la misma solucion del proyecto SSIS.
2. Un Data Source apuntando a DW_ESPORTS en localhost.
3. Un Data Source View con todas las dimensiones y hechos del DW.
4. Dimensiones procesadas correctamente.
5. Cubos Cubo_Ingresos, Cubo_Comportamiento, Cubo_Torneos y Cubo_Auditoria desplegados y procesados.

### 9.1 Precondicion obligatoria antes de abrir SSAS

1. Verificar que la Fase 8 termino en verde (ETL_00 a ETL_05).
2. En SSMS (Database Engine), ejecutar sobre DW_ESPORTS:

```sql
SELECT COUNT(*) AS filas_dim_tiempo FROM dim_tiempo;
SELECT COUNT(*) AS filas_fact_ingresos FROM fact_ingresos;
SELECT COUNT(*) AS filas_fact_actividad_usuario FROM fact_actividad_usuario;
SELECT COUNT(*) AS filas_fact_torneos FROM fact_torneos;
SELECT COUNT(*) AS filas_fact_auditoria FROM fact_auditoria;
```

3. Criterio para continuar a 9.2:
    - filas_dim_tiempo > 0
    - filas_fact_ingresos > 0
    - filas_fact_actividad_usuario > 0
    - filas_fact_torneos > 0
    - filas_fact_auditoria > 0
4. Si cualquier conteo da 0, no avanzar a SSAS; corregir primero ETL en Fase 8.

### 9.2 Crear proyecto SSAS_DW_ESPORTS en la misma solucion

1. Abrir Visual Studio.
2. Abrir la solucion del DW (la que contiene SSIS_DW_ESPORTS).
3. En Solution Explorer:
    - Click derecho sobre la solucion.
    - Add -> New Project.
4. Buscar plantilla: Analysis Services Multidimensional and Data Mining Project.
5. Project name: SSAS_DW_ESPORTS.
6. Location: misma carpeta DataWarehouse.
7. Click Create.
8. Confirmar en Solution Explorer que existe el proyecto SSAS_DW_ESPORTS con carpetas:
    - Data Sources
    - Data Source Views
    - Dimensions
    - Cubes

### 9.3 Configurar propiedades del proyecto SSAS (una sola vez)

1. Click en proyecto SSAS_DW_ESPORTS.
2. Presionar F4 para abrir Properties.
3. Configurar:
    - Deployment Server Name = localhost
    - Database = SSAS_DW_ESPORTS
    - Processing Option = Default
4. Guardar (Ctrl+Shift+S).

### 9.4 Crear Data Source DS_DW_ESPORTS

1. En proyecto SSAS_DW_ESPORTS -> carpeta Data Sources:
    - Click derecho -> New Data Source.
2. En Data Source Wizard:
    - Click Next.
    - Create a data source based on an existing or new connection -> New.
3. En Connection Manager:
    - Provider native de SQL Server.
    - Server name: localhost.
    - Authentication: Windows Authentication.
    - Database: DW_ESPORTS.
4. Click Test Connection (debe decir Test connection succeeded).
5. Click OK.
6. En la pantalla de impersonation:
    - Seleccionar Use the service account.
7. Data Source name: DS_DW_ESPORTS.
8. Click Finish.
9. Confirmar que aparece DS_DW_ESPORTS en Data Sources.

### 9.5 Crear Data Source View DSV_DW_ESPORTS (todas las tablas del DW analitico)

1. En Data Source Views:
    - Click derecho -> New Data Source View.
2. Data Source Wizard:
    - Data source: DS_DW_ESPORTS.
3. En Select Tables and Views mover a Included exactamente estas tablas:
    - dim_tiempo
    - dim_region
    - dim_tipo_item
    - dim_origen_transaccion
    - dim_usuario_comprador
    - dim_responsable_rrhh
    - dim_usuario
    - dim_juego
    - dim_tipo_evento
    - dim_pais
    - dim_modo_juego
    - dim_tipo_torneo
    - dim_plataforma
    - dim_region_torneo
    - dim_operacion
    - dim_tabla_auditada
    - dim_empleado_soporte
    - dim_pais_registro
    - dim_rol_usuario
    - fact_ingresos
    - fact_actividad_usuario
    - fact_torneos
    - fact_auditoria
4. Name: DSV_DW_ESPORTS.
5. Click Finish.
6. Verificar en el diagrama del DSV que existen las relaciones fact -> dim para los 4 hechos.
7. Confirmar especialmente relaciones compuestas:
    - fact_ingresos (id_dim_responsable, version_responsable) -> dim_responsable_rrhh (id_empleado, version)
    - fact_auditoria (id_dim_empleado_soporte, version_empleado) -> dim_empleado_soporte (id_empleado, version)
8. Guardar (Ctrl+Shift+S).

### 9.6 Crear dimensiones en secuencia unica (sin intercalar cubos)

En este punto NO saltar entre dimensiones y cubos. Primero se crean y configuran TODAS las dimensiones.

Mapa rapido (para que no te confundas en el Wizard):

1. Main table: se coloca en pantalla Specify Source Information.
2. Key Columns: se coloca en pantalla Specify Source Information (PK de la tabla dim_*).
3. Name Column: se coloca en pantalla Specify Source Information (columna descriptiva para mostrar nombres).
4. Dimension name: se coloca en la pantalla final Completing the Wizard.
5. Atributos: se marcan en pantalla Select Dimension Attributes.

#### 9.6.1 Plantilla obligatoria (la repites para cada dimension)

1. En Solution Explorer -> carpeta Dimensions -> click derecho -> New Dimension.
2. Welcome: click Next.
3. Select Creation Method:
   - Use an existing table.
   - Click Next.
4. Specify Source Information:
   - Main table: selecciona la tabla segun la matriz 9.6.2.
   - Key Columns: selecciona la PK segun la matriz 9.6.2.
   - Name Column: selecciona columna descriptiva segun la matriz 9.6.2.
5. Select Dimension Attributes:
   - Marca solo las columnas indicadas en la matriz 9.6.2.
   - No marcar columnas de hechos ni columnas tecnicas que no se van a analizar.
6. Completing the Wizard:
   - Dimension name: escribe EXACTAMENTE el nombre indicado en la matriz 9.6.2.
7. Click Finish.
8. Guardar (Ctrl+Shift+S).

#### 9.6.2 Matriz exacta de configuracion por dimension

| # | Dimension name (wizard) | Main table | Key Columns | Name Column | Atributos a marcar en Select Dimension Attributes |
|---|---|---|---|---|---|
| 1 | DIM_Tiempo | dim_tiempo | id_tiempo | fecha | fecha, anio, trimestre, mes_nombre, mes_numero, semestre |
| 2 | DIM_Region_Ingresos | dim_region | id_region | nombre_region | nombre_region |
| 3 | DIM_Tipo_Item | dim_tipo_item | id_tipo_item | nombre_tipo | nombre_tipo |
| 4 | DIM_Origen_Transaccion | dim_origen_transaccion | id_origen | nombre_origen | nombre_origen |
| 5 | DIM_Usuario_Comprador | dim_usuario_comprador | id_usuario | nickname | nickname, pais, divisa, fecha_registro |
| 6 | DIM_Responsable_RRHH | dim_responsable_rrhh | id_empleado + version | nombre_completo | nombre_completo, cargo, departamento, version, version_actual |
| 7 | DIM_Usuario | dim_usuario | id_usuario | nickname | nickname, xp, estado, pais, fecha_registro |
| 8 | DIM_Juego | dim_juego | id_juego | nombre_juego | nombre_juego |
| 9 | DIM_Tipo_Evento | dim_tipo_evento | id_tipo_evento | nombre_evento | nombre_evento |
| 10 | DIM_Pais | dim_pais | id_pais | nombre_pais | nombre_pais |
| 11 | DIM_Modo_Juego | dim_modo_juego | id_modo_juego | nombre_modo | nombre_modo, nombre_juego |
| 12 | DIM_Tipo_Torneo | dim_tipo_torneo | id_tipo_torneo | nombre_tipo | nombre_tipo, tipo_trofeo |
| 13 | DIM_Plataforma | dim_plataforma | id_plataforma | nombre_plataforma | nombre_plataforma |
| 14 | DIM_Region_Torneo | dim_region_torneo | id_region | nombre_region | nombre_region |
| 15 | DIM_Operacion | dim_operacion | id_operacion | nombre_operacion | nombre_operacion |
| 16 | DIM_Tabla_Auditada | dim_tabla_auditada | id_tabla | nombre_tabla | nombre_tabla |
| 17 | DIM_Empleado_Soporte | dim_empleado_soporte | id_empleado + version | nombre_completo | nombre_completo, cargo, departamento, version, version_actual |
| 18 | DIM_Pais_Registro | dim_pais_registro | id_pais | nombre_pais | nombre_pais, es_restringido, motivo_restriccion |
| 19 | DIM_Rol_Usuario | dim_rol_usuario | id_rol | nombre_rol | nombre_rol |

#### 9.6.3 Orden exacto de ejecucion (sin saltar)

1. Crear DIM_Tiempo (fila 1 de la matriz).
2. Crear DIM_Region_Ingresos (fila 2).
3. Crear DIM_Tipo_Item (fila 3).
4. Crear DIM_Origen_Transaccion (fila 4).
5. Crear DIM_Usuario_Comprador (fila 5).
6. Crear DIM_Responsable_RRHH (fila 6).
7. Crear DIM_Usuario (fila 7).
8. Crear DIM_Juego (fila 8).
9. Crear DIM_Tipo_Evento (fila 9).
10. Crear DIM_Pais (fila 10).
11. Crear DIM_Modo_Juego (fila 11).
12. Crear DIM_Tipo_Torneo (fila 12).
13. Crear DIM_Plataforma (fila 13).
14. Crear DIM_Region_Torneo (fila 14).
15. Crear DIM_Operacion (fila 15).
16. Crear DIM_Tabla_Auditada (fila 16).
17. Crear DIM_Empleado_Soporte (fila 17).
18. Crear DIM_Pais_Registro (fila 18).
19. Crear DIM_Rol_Usuario (fila 19).

#### 9.6.4 Ajustes obligatorios despues del wizard (claves y jerarquias)

1. Abrir DIM_Responsable_RRHH -> Dimension Structure.
2. Click en el atributo clave (arriba, normalmente el nombre de la dimension).
3. Presionar F4 (Properties).
4. Verificar:
   - KeyColumns = id_empleado, version.
   - NameColumn = nombre_completo.
5. Repetir exactamente lo mismo para DIM_Empleado_Soporte.
6. Abrir DIM_Tiempo -> Dimension Structure.
7. En panel Attributes verificar que existen: anio, trimestre, mes_nombre, fecha.
8. En panel Hierarchies crear HJ_Calendario arrastrando en este orden:
   - anio -> trimestre -> mes_nombre -> fecha.
9. Abrir DIM_Modo_Juego -> Dimension Structure.
10. En panel Hierarchies crear HJ_Juego_Modo:
   - nombre_juego -> nombre_modo.

Al finalizar 9.6:

1. Guardar todo (Ctrl+Shift+S).
2. Confirmar que en carpeta Dimensions existen las 19 dimensiones.
3. No avanzar a 9.7 hasta confirmar que no hay iconos de error en ninguna dimension.

### 9.7 Crear cubos en secuencia (uno completo y luego el siguiente)

Regla para cada cubo:

1. Click derecho en Cubes -> New Cube.
2. Use existing tables.
3. Measure group table: fact correspondiente.
4. Seleccionar solo las medidas definidas en el DW.
5. Incluir solo las dimensiones relacionadas por FK de esa fact.
6. Finalizar wizard.
7. Abrir Cube Structure y validar nombres de medidas.
8. Abrir Dimension Usage y validar relaciones.

Crear en este orden exacto:

#### 9.7.1 Cubo_Ingresos

1. Measure group table: fact_ingresos.
2. Medidas a incluir:
    - monto_real
    - meta_ingresos
    - creditos_otorgados
    - cantidad
3. Dimensiones a incluir:
    - DIM_Tiempo
    - DIM_Region_Ingresos
    - DIM_Tipo_Item
    - DIM_Origen_Transaccion
    - DIM_Usuario_Comprador
    - DIM_Responsable_RRHH
4. En Dimension Usage revisar:
    - Todas en tipo Regular.
    - Para DIM_Responsable_RRHH mapear columnas compuestas:
      - fact_ingresos.id_dim_responsable -> dim_responsable_rrhh.id_empleado
      - fact_ingresos.version_responsable -> dim_responsable_rrhh.version

#### 9.7.2 Cubo_Comportamiento

1. Measure group table: fact_actividad_usuario.
2. Medidas a incluir:
    - total_amigos
    - total_seguidores
    - xp_acumulado
    - cantidad_eventos
    - tiempo_sesion_seg
    - victorias
    - horas_jugadas
3. Dimensiones a incluir:
    - DIM_Tiempo
    - DIM_Usuario
    - DIM_Juego
    - DIM_Tipo_Evento
    - DIM_Pais
4. En Dimension Usage revisar todas como Regular y con coincidencia 1 a 1 de FK.

#### 9.7.3 Cubo_Torneos

1. Measure group table: fact_torneos.
2. Medidas a incluir:
    - total_inscritos
    - inscritos_confirmados
    - capacidad
    - fondo_premios
    - comision
    - calificacion_promedio
    - total_resenas
    - pct_recomendacion
    - cantidad_torneos
3. Dimensiones a incluir:
    - DIM_Tiempo
    - DIM_Juego
    - DIM_Modo_Juego
    - DIM_Tipo_Torneo
    - DIM_Plataforma
    - DIM_Region_Torneo
4. Ajuste recomendado de agregacion:
    - calificacion_promedio = AverageOfChildren
    - pct_recomendacion = AverageOfChildren
    - El resto = Sum

#### 9.7.4 Cubo_Auditoria

1. Measure group table: fact_auditoria.
2. Medidas a incluir:
    - total_eventos
    - tickets_soporte
    - tickets_resueltos
    - registros_restringidos
3. Dimensiones a incluir:
    - DIM_Tiempo
    - DIM_Operacion
    - DIM_Tabla_Auditada
    - DIM_Empleado_Soporte
    - DIM_Pais_Registro
    - DIM_Rol_Usuario
4. En Dimension Usage revisar:
    - Todas en tipo Regular.
    - Para DIM_Empleado_Soporte mapear columnas compuestas:
      - fact_auditoria.id_dim_empleado_soporte -> dim_empleado_soporte.id_empleado
      - fact_auditoria.version_empleado -> dim_empleado_soporte.version

### 9.8 Deploy y Process Full (orden estricto)

1. Build de la solucion completa:
    - Menu Build -> Build Solution.
    - Corregir cualquier error antes de seguir.
2. Click derecho en proyecto SSAS_DW_ESPORTS -> Deploy.
3. Esperar mensaje Deploy completed successfully.
4. En Solution Explorer, abrir SSAS_DW_ESPORTS.database.
5. Click derecho sobre el nodo de base SSAS -> Process.
6. Seleccionar Process Full.
7. En la ventana de procesamiento confirmar que se procesan:
    - Todas las dimensiones DIM_...
    - Cubo_Ingresos
    - Cubo_Comportamiento
    - Cubo_Torneos
    - Cubo_Auditoria
8. Click Run.
9. Esperar estado Success en todos los objetos.
10. Click Close.

### 9.9 Verificacion final obligatoria de Fase 9

1. Abrir Cubo_Ingresos -> Browser.
    - Arrastrar monto_real y nombre_region.
    - Confirmar que devuelve datos.
2. Abrir Cubo_Comportamiento -> Browser.
    - Arrastrar cantidad_eventos y nombre_evento.
    - Confirmar que devuelve datos.
3. Abrir Cubo_Torneos -> Browser.
    - Arrastrar total_inscritos y nombre_juego.
    - Confirmar que devuelve datos.
4. Abrir Cubo_Auditoria -> Browser.
    - Arrastrar total_eventos y nombre_operacion.
    - Confirmar que devuelve datos.
5. Gate para pasar a Fase 10:
    - Los 4 cubos despliegan sin error.
    - Los 4 cubos procesan en Success.
    - Los 4 cubos muestran valores en Browser.
6. Solo si se cumple el gate, continuar con Power BI (Fase 10).

---

## Fase 10 - Dashboards Power BI (diseno profesional) y verificacion final

Objetivo de esta fase:

1. Construir dashboards finales en Power BI a partir de los 4 cubos SSAS ya procesados.
2. Mantener 1 dashboard por cada cubo SSAS (sin mezclar cubos en un mismo PBIX).
3. Aplicar un diseno visual profesional y consistente.
4. Validar que los resultados de Power BI coinciden con los datos del DW en SQL Server.

Resultado esperado al terminar:

1. 4 archivos .pbix (uno por datamart/cubo).
2. Cada archivo con 1 pagina principal, 1 slicer de anio y 3 visuales obligatorios.
3. Diseno limpio, legible y uniforme (tipografia, colores, espaciado y titulos).
4. Medidas visibles y coherentes con consultas SQL de control.

### 10.0 Regla de ejecucion lineal (obligatoria)

No mezclar pasos entre dashboards.

Secuencia obligatoria:

1. Completar Dashboard_DM1_Ingresos.pbix de inicio a fin:
    - Conexion
    - Estructura visual
    - Creacion de visuales
    - Formato final
    - Verificacion
    - Guardado
2. Solo despues iniciar Dashboard_DM2_Comportamiento.pbix y repetir el mismo ciclo completo.
3. Solo despues iniciar Dashboard_DM3_Torneos.pbix y repetir el ciclo completo.
4. Solo despues iniciar Dashboard_DM4_Auditoria.pbix y repetir el ciclo completo.
5. No hacer primero visuales de varios PBIX y luego volver a formatear; cada PBIX se cierra completo antes de pasar al siguiente.

### 10.1 Precondicion obligatoria antes de abrir Power BI

1. Confirmar que la Fase 9 termino en Success (Deploy + Process Full de los 4 cubos).
2. En SSMS (Analysis Services), verificar que existen y estan procesados:
    - Cubo_Ingresos
    - Cubo_Comportamiento
    - Cubo_Torneos
    - Cubo_Auditoria
3. Si algun cubo no esta procesado, volver a Fase 9.8 y no continuar.
4. En SSMS (Database Engine), ejecutar control rapido en DW_ESPORTS:

```sql
SELECT COUNT(*) AS filas_fact_ingresos FROM fact_ingresos;
SELECT COUNT(*) AS filas_fact_actividad_usuario FROM fact_actividad_usuario;
SELECT COUNT(*) AS filas_fact_torneos FROM fact_torneos;
SELECT COUNT(*) AS filas_fact_auditoria FROM fact_auditoria;
```

5. Si alguna fact esta en 0, detenerse y corregir ETL (Fase 8) antes de Power BI.

### 10.2 Estandar visual profesional obligatorio (aplica a los 4 dashboards)

Aplicar este estandar completo en cada PBIX para asegurar calidad profesional:

1. Lienzo:
    - Page size: 16:9.
    - Wallpaper color: #F3F5F9.
    - Wallpaper transparency: 0%.
2. Tipografia:
    - Titulos de pagina: Segoe UI Semibold, 20 pt, color #0F1E3A.
    - Titulos de visual: Segoe UI Semibold, 12 pt, color #1F2D3D.
    - Etiquetas y ejes: Segoe UI, 10 pt, color #425466.
3. Paleta base recomendada:
    - Azul principal: #1F4E79.
    - Azul secundario: #4F81BD.
    - Naranja de contraste: #E67E22.
    - Verde de apoyo: #2A9D8F.
    - Gris neutro: #7B8794.
4. Contenedores:
    - Cada visual dentro de un panel blanco (#FFFFFF).
    - Bordes suaves en color #D9E2EC.
    - Sin saturar el lienzo con demasiados colores.
5. Legibilidad:
    - Data labels activas en visuales obligatorios.
    - Separador de miles activado.
    - Evitar truncar titulos (ajustar ancho antes de reducir fuente).
6. Espaciado:
    - Margen superior para cabecera.
    - Slicer separado visualmente del area de graficos.
    - Distancia uniforme entre visuales.

### 10.3 Estructura de entrega obligatoria

1. Crear carpeta de salida para dashboards:
    - DataWarehouse/PowerBI
2. Crear exactamente estos archivos (en este orden):
    - Dashboard_DM1_Ingresos.pbix
    - Dashboard_DM2_Comportamiento.pbix
    - Dashboard_DM3_Torneos.pbix
    - Dashboard_DM4_Auditoria.pbix
3. Regla tecnica:
    - Como trabajas con cubos SSAS separados, usar 1 archivo PBIX por cubo para evitar mezclar modelos en una sola conexion Live.

### 10.4 Dashboard 1 - Ingresos y Monetizacion (Cubo_Ingresos)

#### 10.4.1 Crear archivo y conectar cubo

1. Abrir Power BI Desktop.
2. Home -> Get Data -> SQL Server Analysis Services database.
3. Server: localhost.
4. Connectivity mode: Connect live.
5. Click OK.
6. En Navigator seleccionar Cubo_Ingresos.
7. Click Connect.
8. Ir a File -> Save As.
9. Guardar como DataWarehouse/PowerBI/Dashboard_DM1_Ingresos.pbix.

#### 10.4.2 Configurar pagina base

1. Renombrar la pagina a PAG_DM1_Ingresos.
2. Click en fondo de pagina (sin seleccionar visual).
3. En panel Format:
    - Canvas settings -> Type: 16:9.
    - Wallpaper -> Color: #F3F5F9.
    - Wallpaper -> Transparency: 0%.
4. Insert -> Text box.
5. Titulo: Dashboard DM1 - Ingresos y Monetizacion.
6. Subtitulo recomendado: Cubo_Ingresos | DW_ESPORTS | Vista Ejecutiva.

#### 10.4.3 Crear filtro principal

1. Insertar Slicer.
2. Campo: DIM_Tiempo.anio.
3. Configurar slicer como lista vertical.
4. Activar seleccion unica (single select = On).
5. Colocar el slicer en la zona superior izquierda para que gobierne toda la pagina.

#### 10.4.4 Crear Visual 1 (obligatorio)

1. Insertar Clustered column chart.
2. Eje: DIM_Region_Ingresos.nombre_region.
3. Valores: monto_real.
4. Titulo: Ingresos reales por region.
5. Formato:
    - Data labels: On.
    - Data colors: #1F4E79.
    - Y-axis separador de miles: On.
    - Ordenar de mayor a menor por monto_real.
    - Filtro visual obligatorio: nombre_region <> 'DESCONOCIDA' y monto_real > 0.

#### 10.4.5 Crear Visual 2 (obligatorio)

1. Insertar Line chart.
2. Eje: jerarquia de DIM_Tiempo usando mes_nombre (dentro del anio filtrado).
3. Valores: meta_ingresos.
4. Titulo: Meta de ingresos por mes.
5. Formato:
    - Line color: #E67E22.
    - Data labels: On.
    - Markers: On.
    - Y-axis separador de miles: On.
    - Filtro visual obligatorio: meta_ingresos > 0.

#### 10.4.6 Crear Visual 3 (obligatorio)

1. Insertar Line and clustered column chart.
2. Shared axis: jerarquia de DIM_Tiempo (mes).
3. Column values: monto_real.
4. Line values: meta_ingresos.
5. Titulo: Real vs Meta de ingresos.
6. Formato:
    - Column color (monto_real): #1F4E79.
    - Line color (meta_ingresos): #E67E22.
    - Data labels: On.
    - Y-axis separador de miles: On.
    - Filtro visual obligatorio: monto_real > 0 y meta_ingresos > 0.

#### 10.4.7 Ajuste visual final y guardado

1. Verificar que los 3 visuales tengan tamano similar y alineacion uniforme.
2. Verificar que el slicer de anio filtre los 3 visuales.
3. Revisar que no existan titulos truncados ni etiquetas montadas.
4. Guardar (Ctrl+S).

### 10.5 Dashboard 2 - Comportamiento de Usuario (Cubo_Comportamiento)

#### 10.5.1 Crear archivo y conectar cubo

1. En Power BI, File -> New.
2. Home -> Get Data -> SQL Server Analysis Services database.
3. Server: localhost.
4. Connectivity mode: Connect live.
5. En Navigator seleccionar Cubo_Comportamiento.
6. Click Connect.
7. Guardar como DataWarehouse/PowerBI/Dashboard_DM2_Comportamiento.pbix.

#### 10.5.2 Configurar pagina base

1. Renombrar la pagina a PAG_DM2_Comportamiento.
2. Aplicar el mismo estandar de pagina definido en 10.2.
3. Insertar titulo: Dashboard DM2 - Comportamiento de Usuario.
4. Insertar subtitulo recomendado: Cubo_Comportamiento | DW_ESPORTS | Actividad y Engagement.

#### 10.5.3 Crear filtro principal

1. Insertar Slicer.
2. Campo: DIM_Tiempo.anio.
3. Configurar seleccion unica.
4. Ubicarlo en la misma posicion relativa usada en DM1 para mantener consistencia.

#### 10.5.4 Crear Visual 1 (obligatorio)

1. Insertar Clustered column chart.
2. Eje: DIM_Tipo_Evento.nombre_evento.
3. Valores: cantidad_eventos.
4. Titulo: Eventos por tipo.
5. Formato:
    - Data labels: On.
    - Data colors: #2A9D8F.
    - Ordenar de mayor a menor por cantidad_eventos.
    - Filtro visual obligatorio: nombre_evento <> 'DESCONOCIDO' y cantidad_eventos > 0.

#### 10.5.5 Crear Visual 2 (obligatorio)

1. Insertar Bar chart.
2. Eje: DIM_Usuario.nickname.
3. Valores: xp_acumulado.
4. Titulo: XP acumulado por usuario.
5. Formato:
    - Data labels: On.
    - Data colors: #1F4E79.
    - Ordenar de mayor a menor por xp_acumulado (obligatorio).
    - Filtro visual obligatorio: nickname <> 'USUARIO_DESCONOCIDO' y xp_acumulado > 0.

#### 10.5.6 Crear Visual 3 (obligatorio)

1. Insertar Clustered column chart.
2. Eje: DIM_Pais.nombre_pais.
3. Valores: tiempo_sesion_seg.
4. Titulo: Tiempo de sesion por pais.
5. Formato:
    - Data labels: On.
    - Data colors: #4F81BD.
    - Y-axis separador de miles: On.
    - Filtro visual obligatorio: nombre_pais <> 'DESCONOCIDO' y tiempo_sesion_seg > 0.

#### 10.5.7 Ajuste visual final y guardado

1. Verificar alineacion horizontal y vertical de los 3 visuales.
2. Verificar que el slicer de anio filtre los 3 visuales.
3. Revisar que Visual 2 conserve el orden descendente.
4. Guardar (Ctrl+S).

### 10.6 Dashboard 3 - Calidad de Torneos (Cubo_Torneos)

#### 10.6.1 Crear archivo y conectar cubo

1. File -> New.
2. Home -> Get Data -> SQL Server Analysis Services database.
3. Server: localhost.
4. Connectivity mode: Connect live.
5. En Navigator seleccionar Cubo_Torneos.
6. Click Connect.
7. Guardar como DataWarehouse/PowerBI/Dashboard_DM3_Torneos.pbix.

#### 10.6.2 Configurar pagina base

1. Renombrar pagina a PAG_DM3_Torneos.
2. Aplicar el mismo estandar visual de 10.2.
3. Insertar titulo: Dashboard DM3 - Calidad de Torneos.
4. Insertar subtitulo recomendado: Cubo_Torneos | DW_ESPORTS | Competencia y Satisfaccion.

#### 10.6.3 Crear filtro principal

1. Insertar Slicer.
2. Campo: DIM_Tiempo.anio.
3. Configurar seleccion unica.
4. Ubicar en la cabecera izquierda.

#### 10.6.4 Crear Visual 1 (obligatorio)

1. Insertar Clustered column chart.
2. Eje: DIM_Juego.nombre_juego.
3. Valores: total_inscritos.
4. Titulo: Inscritos por juego.
5. Formato:
    - Data labels: On.
    - Data colors: #1F4E79.
    - Ordenar de mayor a menor por total_inscritos.
    - Filtro visual obligatorio: nombre_juego <> 'NO_APLICA' y total_inscritos > 0.

#### 10.6.5 Crear Visual 2 (obligatorio)

1. Insertar Bar chart.
2. Eje: DIM_Tipo_Torneo.nombre_tipo.
3. Valores: calificacion_promedio.
4. Titulo: Calificacion promedio por tipo de torneo.
5. Formato:
    - Data labels: On.
    - Data colors: #2A9D8F.
    - Mostrar 2 decimales en etiquetas.
    - Filtro visual obligatorio: nombre_tipo <> 'no_aplica' y calificacion_promedio > 0.

#### 10.6.6 Crear Visual 3 (obligatorio)

1. Insertar Clustered column chart.
2. Eje: DIM_Plataforma.nombre_plataforma.
3. Valores: pct_recomendacion.
4. Titulo: Recomendacion por plataforma.
5. Formato:
    - Data labels: On.
    - Data colors: #E67E22.
    - Formato de medida: decimal con 2 decimales (0.00).
    - Filtro visual obligatorio: nombre_plataforma <> 'NO_APLICA' y pct_recomendacion > 0.

#### 10.6.7 Ajuste visual final y guardado

1. Verificar que los 3 visuales queden balanceados en ancho y alto.
2. Verificar que el slicer de anio filtre toda la pagina.
3. Revisar que el porcentaje de recomendacion muestre simbolo %.
4. Guardar (Ctrl+S).

### 10.7 Dashboard 4 - Seguridad y Auditoria (Cubo_Auditoria)

#### 10.7.1 Crear archivo y conectar cubo

1. File -> New.
2. Home -> Get Data -> SQL Server Analysis Services database.
3. Server: localhost.
4. Connectivity mode: Connect live.
5. En Navigator seleccionar Cubo_Auditoria.
6. Click Connect.
7. Guardar como DataWarehouse/PowerBI/Dashboard_DM4_Auditoria.pbix.

#### 10.7.2 Configurar pagina base

1. Renombrar pagina a PAG_DM4_Auditoria.
2. Aplicar el mismo estandar visual de 10.2.
3. Insertar titulo: Dashboard DM4 - Seguridad y Auditoria.
4. Insertar subtitulo recomendado: Cubo_Auditoria | DW_ESPORTS | Control y Riesgo Operativo.

#### 10.7.3 Crear filtro principal

1. Insertar Slicer.
2. Campo: DIM_Tiempo.anio.
3. Configurar seleccion unica.
4. Ubicar en zona superior izquierda.

#### 10.7.4 Crear Visual 1 (obligatorio)

1. Insertar Clustered column chart.
2. Eje: DIM_Operacion.nombre_operacion.
3. Valores: total_eventos.
4. Titulo: Eventos auditados por operacion.
5. Formato:
    - Data labels: On.
    - Data colors: #1F4E79.
    - Ordenar de mayor a menor por total_eventos.
    - Filtro visual obligatorio: total_eventos > 0.

#### 10.7.5 Crear Visual 2 (obligatorio)

1. Insertar Bar chart.
2. Eje: DIM_Pais_Registro.nombre_pais.
3. Valores: registros_restringidos.
4. Titulo: Registros restringidos por pais.
5. Formato:
    - Data labels: On.
    - Data colors: #C0392B.
    - Ordenar de mayor a menor por registros_restringidos.
    - Filtro visual obligatorio: nombre_pais <> 'DESCONOCIDO' y registros_restringidos > 0.

#### 10.7.6 Crear Visual 3 (obligatorio)

1. Insertar Line and clustered column chart.
2. Eje compartido: DIM_Operacion.nombre_operacion.
3. Column values: total_eventos.
4. Line values: registros_restringidos.
5. Titulo: Eventos vs registros restringidos por operacion.
6. Formato:
    - Column color (total_eventos): #4F81BD.
    - Line color (registros_restringidos): #2A9D8F.
    - Data labels: On.
    - Filtro visual obligatorio: total_eventos > 0 y registros_restringidos > 0.

#### 10.7.7 Ajuste visual final y guardado

1. Verificar que los 3 visuales respondan al slicer de anio.
2. Verificar que no haya categorias con texto cortado sin tooltip.
3. Confirmar etiquetas de datos activas en los 3 visuales (obligatorio).
4. Guardar (Ctrl+S).

### 10.8 Verificacion final de consistencia (obligatoria)

Ejecutar en SQL Server (DW_ESPORTS):

```sql
SELECT SUM(monto_real) AS total_monto_real,
         SUM(meta_ingresos) AS total_meta_ingresos,
         SUM(creditos_otorgados) AS total_creditos,
         SUM(cantidad) AS total_transacciones
FROM fact_ingresos;

SELECT SUM(cantidad_eventos) AS total_eventos_comportamiento,
         SUM(xp_acumulado) AS total_xp_acumulado,
         SUM(tiempo_sesion_seg) AS total_tiempo_sesion_seg
FROM fact_actividad_usuario;

SELECT SUM(total_inscritos) AS total_inscritos,
         SUM(total_resenas) AS total_resenas,
         SUM(cantidad_torneos) AS total_torneos
FROM fact_torneos;

SELECT SUM(total_eventos) AS total_eventos_auditoria,
         SUM(tickets_soporte) AS total_tickets_soporte,
         SUM(tickets_resueltos) AS total_tickets_resueltos,
         SUM(registros_restringidos) AS total_registros_restringidos
FROM fact_auditoria;

SELECT nombre_pais, es_restringido, motivo_restriccion
FROM dim_pais_registro
WHERE es_restringido = 1
ORDER BY nombre_pais;
```

Comparar contra Power BI (por cada PBIX, en secuencia):

1. Abrir un PBIX.
2. Agregar temporalmente tarjetas (Card) con las medidas principales de ese cubo.
3. Verificar que los totales coincidan con SQL para el mismo filtro de anio.
4. Si no coincide:
    - Revisar slicer de anio activo.
    - Revisar que el cubo conectado sea el correcto.
    - Revisar que Fase 9 y Fase 8 fueron ejecutadas en orden.
5. Repetir para el siguiente PBIX.
6. Retirar tarjetas temporales solo cuando el control cierre sin diferencias.

### 10.8.1 Diagnostico rapido cuando los visuales se ven planos o en cero

Si un dashboard abre pero los visuales parecen vacios o poco interpretables, ejecutar este bloque en DW_ESPORTS:

```sql
SELECT COUNT(*) AS filas,
       SUM(CASE WHEN id_dim_region = 0 THEN 1 ELSE 0 END) AS fk_region_desconocida,
       SUM(CASE WHEN id_dim_tipo_item = 0 THEN 1 ELSE 0 END) AS fk_tipo_item_desconocida,
       SUM(meta_ingresos) AS suma_meta
FROM fact_ingresos;

SELECT COUNT(*) AS filas,
       MIN(pct_recomendacion) AS pct_min,
       MAX(pct_recomendacion) AS pct_max
FROM fact_torneos;

SELECT COUNT(*) AS filas,
       SUM(registros_restringidos) AS suma_registros_restringidos
FROM fact_auditoria;
```

Interpretacion directa:

1. Si `fk_region_desconocida` o `fk_tipo_item_desconocida` es alto en `fact_ingresos`, hay problema de mapeo de llaves de negocio en ETL_02_Fact_DM1_Ingresos.dtsx.
2. Si `suma_meta = 0`, regenerar `DW_Fuentes_Excel.xlsx` y verificar que la region real (por ejemplo Honduras) exista en `Presupuestos_Ventas`.
3. Si `pct_recomendacion` en `fact_torneos` viene en escala 0-100, en Power BI debe mostrarse con formato decimal (`0.00`) y no porcentaje (`0.00%`) para evitar valores visuales inflados.
4. Si `suma_registros_restringidos = 0`, regenerar `DW_Fuentes_Excel.xlsx`, confirmar que la hoja `Lista_Negra` tenga el pais operativo activo y re-ejecutar ETL_00 -> ETL_01 -> ETL_05.

### 10.8.2 Regla anti-confusion para correcciones

Para corregir resultados en hechos, NO crear archivos SQL externos.

Usar siempre el SQL ya documentado en la guia dentro de estos tasks:

1. ETL_02_Fact_DM1_Ingresos.dtsx -> reemplazar/pegar el SQL de la seccion 7.1 en su Execute SQL Task.
2. ETL_03_Fact_DM2_Comportamiento.dtsx -> reemplazar/pegar el SQL de la seccion 7.2.
3. ETL_04_Fact_DM3_Torneos.dtsx -> reemplazar/pegar el SQL de la seccion 7.3.
4. ETL_05_Fact_DM4_Auditoria.dtsx -> reemplazar/pegar el SQL de la seccion 7.4.
5. Re-ejecutar la secuencia completa definida en Fase 8.

### 10.9 Cierre final de entrega

Checklist obligatorio:

1. Existen 4 archivos PBIX en DataWarehouse/PowerBI.
2. Cada PBIX corresponde a un solo cubo SSAS (sin mezcla).
3. Cada PBIX tiene 1 pagina principal con 1 slicer de anio y 3 visuales obligatorios.
4. Los 4 dashboards aplican formato profesional consistente (tipografia, colores, espaciado).
5. Los 4 dashboards responden al slicer de anio.
6. Los totales validan contra SQL.
7. No hay visuales en blanco ni errores de conexion.

---

## Fase 11 - Proyecto Reporting Services (SSRS)

Objetivo de esta fase:

1. Crear un proyecto SSRS en la misma solucion del DW.
2. Configurar despliegue al servidor Reporting Services instalado localmente.
3. Crear un origen de datos compartido contra DW_ESPORTS.
4. Crear datasets y reportes base para DM1, DM2, DM3 y DM4 usando solo tablas del DW ya definidas en esta guia.

Resultado esperado al terminar:

1. Proyecto SSRS_DW_ESPORTS visible en la solucion.
2. Shared Data Source DS_DW_ESPORTS creado y validado.
3. Cuatro Shared Datasets creados (DM1 a DM4).
4. Cuatro reportes RDL creados y desplegados en el portal SSRS.

### 11.0 Regla de ejecucion lineal (obligatoria)

1. Verificar precondiciones de datos.
2. Obtener URLs del servidor SSRS desde Configuration Manager.
3. Crear el proyecto SSRS.
4. Configurar propiedades de despliegue del proyecto.
5. Crear Shared Data Source.
6. Crear Shared Datasets.
7. Crear reportes RDL base.
8. Deploy y verificacion final en portal.

### 11.1 Precondicion obligatoria antes de crear el proyecto SSRS

1. Confirmar que la Fase 8 termino en verde (ETL_00 a ETL_05).
2. Ejecutar en SSMS sobre DW_ESPORTS:

```sql
SELECT COUNT(*) AS filas_fact_ingresos FROM fact_ingresos;
SELECT COUNT(*) AS filas_fact_actividad_usuario FROM fact_actividad_usuario;
SELECT COUNT(*) AS filas_fact_torneos FROM fact_torneos;
SELECT COUNT(*) AS filas_fact_auditoria FROM fact_auditoria;
```

3. Criterio para continuar:
    - filas_fact_ingresos > 0
    - filas_fact_actividad_usuario > 0
    - filas_fact_torneos > 0
    - filas_fact_auditoria > 0
4. Si cualquier conteo da 0, volver a Fase 8 y no continuar con SSRS.

### 11.2 Obtener URLs de Reporting Services (boton por boton)

1. Abrir menu Start de Windows.
2. Buscar SQL Server Reporting Services Configuration Manager.
3. Abrir SQL Server Reporting Services Configuration Manager.
4. En Connect to a Server:
    - Server Name: localhost
    - Report Server Instance: seleccionar la instancia instalada
5. Click Connect.
6. En panel izquierdo, click Web Service URL.
7. Copiar la URL completa de Web Service URL (esta URL se usa en Visual Studio como TargetServerURL).
8. En panel izquierdo, click Web Portal URL.
9. Click en la URL de Web Portal para confirmar que abre el portal.
10. Cerrar Configuration Manager.

### 11.3 Crear proyecto SSRS_DW_ESPORTS en la misma solucion (boton por boton)

1. Abrir Visual Studio.
2. Abrir la solucion donde ya existen SSIS_DW_ESPORTS y SSAS_DW_ESPORTS.
3. En Solution Explorer, click derecho sobre la solucion.
4. Click Add -> New Project.
5. En la caja de busqueda escribir Reporting Services Project.
6. Seleccionar la plantilla Reporting Services Project.
7. Click Next.
8. Project name: SSRS_DW_ESPORTS.
9. Location: carpeta DataWarehouse de este repositorio.
10. Click Create.
11. Confirmar que el proyecto contiene:
    - Shared Data Sources
    - Shared Datasets
    - Reports

### 11.4 Configurar propiedades de despliegue del proyecto SSRS

1. En Solution Explorer, seleccionar el proyecto SSRS_DW_ESPORTS.
2. Presionar F4 para abrir la ventana Properties.
3. Configurar exactamente:
    - TargetServerURL = URL de Web Service URL copiada en 11.2
    - TargetReportFolder = DW_ESPORTS
    - TargetDataSourceFolder = DW_ESPORTS_DataSources
    - TargetDatasetFolder = DW_ESPORTS_Datasets
    - OverwriteDataSources = True
    - OverwriteDatasets = True
4. Guardar con Ctrl+Shift+S.

### 11.5 Crear Shared Data Source DS_DW_ESPORTS (boton por boton)

1. En proyecto SSRS_DW_ESPORTS, click derecho en Shared Data Sources.
2. Click Add New Data Source.
3. Name: DS_DW_ESPORTS.
4. Select connection type: Microsoft SQL Server.
5. Connection string:

```text
Data Source=localhost;Initial Catalog=DW_ESPORTS
```

6. Click Credentials.
7. Seleccionar Use Windows Integrated Security.
8. Click OK para volver a la ventana principal del Data Source.
9. Click Test Connection y confirmar mensaje de exito.
10. Click OK para crear DS_DW_ESPORTS.

### 11.6 Crear Shared Datasets base (DM1, DM2, DM3, DM4)

Regla fija para cada dataset:

1. Click derecho en Shared Datasets -> Add New Dataset.
2. Name: segun corresponda.
3. Data source: Use a shared data source reference.
4. Shared data source: DS_DW_ESPORTS.
5. Query type: Text.
6. Pegar SQL.
7. Click Refresh Fields.
8. Click OK.

#### 11.6.1 Dataset DSD_DM1_INGRESOS

```sql
SELECT
    dt.anio,
    dt.mes_numero,
    dt.mes_nombre,
    dr.nombre_region,
    SUM(fi.monto_real) AS monto_real,
    SUM(fi.meta_ingresos) AS meta_ingresos,
    SUM(fi.cantidad) AS total_transacciones
FROM fact_ingresos fi
INNER JOIN dim_tiempo dt
    ON dt.id_tiempo = fi.id_dim_tiempo
INNER JOIN dim_region dr
    ON dr.id_region = fi.id_dim_region
WHERE dr.nombre_region <> 'DESCONOCIDA'
  AND fi.monto_real > 0
  AND fi.meta_ingresos > 0
GROUP BY dt.anio, dt.mes_numero, dt.mes_nombre, dr.nombre_region;
```

#### 11.6.2 Dataset DSD_DM2_COMPORTAMIENTO

```sql
SELECT
    dt.anio,
    dte.nombre_evento,
    du.nickname,
    dp.nombre_pais,
    SUM(fau.cantidad_eventos) AS cantidad_eventos,
    SUM(COALESCE(fau.xp_acumulado, 0)) AS xp_acumulado,
    SUM(COALESCE(fau.tiempo_sesion_seg, 0)) AS tiempo_sesion_seg
FROM fact_actividad_usuario fau
INNER JOIN dim_tiempo dt
    ON dt.id_tiempo = fau.id_dim_tiempo
INNER JOIN dim_tipo_evento dte
    ON dte.id_tipo_evento = fau.id_dim_tipo_evento
INNER JOIN dim_usuario du
    ON du.id_usuario = fau.id_dim_usuario
INNER JOIN dim_pais dp
    ON dp.id_pais = fau.id_dim_pais
WHERE dte.nombre_evento <> 'DESCONOCIDO'
  AND du.nickname <> 'USUARIO_DESCONOCIDO'
  AND dp.nombre_pais <> 'DESCONOCIDO'
GROUP BY dt.anio, dte.nombre_evento, du.nickname, dp.nombre_pais;
```

#### 11.6.3 Dataset DSD_DM3_TORNEOS

```sql
SELECT
    dt.anio,
    dj.nombre_juego,
    dtt.nombre_tipo,
    dpl.nombre_plataforma,
    SUM(ft.total_inscritos) AS total_inscritos,
    AVG(CAST(ft.calificacion_promedio AS DECIMAL(10,2))) AS calificacion_promedio,
    AVG(CAST(ft.pct_recomendacion AS DECIMAL(10,2))) AS pct_recomendacion
FROM fact_torneos ft
INNER JOIN dim_tiempo dt
    ON dt.id_tiempo = ft.id_dim_tiempo
INNER JOIN dim_juego dj
    ON dj.id_juego = ft.id_dim_juego
INNER JOIN dim_tipo_torneo dtt
    ON dtt.id_tipo_torneo = ft.id_dim_tipo_torneo
INNER JOIN dim_plataforma dpl
    ON dpl.id_plataforma = ft.id_dim_plataforma
WHERE dj.nombre_juego <> 'NO_APLICA'
  AND dtt.nombre_tipo <> 'no_aplica'
  AND dpl.nombre_plataforma <> 'NO_APLICA'
GROUP BY dt.anio, dj.nombre_juego, dtt.nombre_tipo, dpl.nombre_plataforma;
```

#### 11.6.4 Dataset DSD_DM4_AUDITORIA

```sql
SELECT
    dt.anio,
    dop.nombre_operacion,
    dpr.nombre_pais,
    SUM(fa.total_eventos) AS total_eventos,
    SUM(fa.tickets_soporte) AS tickets_soporte,
    SUM(fa.tickets_resueltos) AS tickets_resueltos,
    SUM(fa.registros_restringidos) AS registros_restringidos
FROM fact_auditoria fa
INNER JOIN dim_tiempo dt
    ON dt.id_tiempo = fa.id_dim_tiempo
INNER JOIN dim_operacion dop
    ON dop.id_operacion = fa.id_dim_operacion
INNER JOIN dim_pais_registro dpr
    ON dpr.id_pais = fa.id_dim_pais
WHERE dpr.nombre_pais <> 'DESCONOCIDO'
GROUP BY dt.anio, dop.nombre_operacion, dpr.nombre_pais;
```

### 11.7 Crear los 4 reportes base (boton por boton)

1. En proyecto SSRS_DW_ESPORTS, click derecho en Reports -> Add -> New Item.
2. Seleccionar Report.
3. Name: RPT_DM1_Ingresos.rdl.
4. Click Add.
5. Repetir los pasos 1 a 4 para:
    - RPT_DM2_Comportamiento.rdl
    - RPT_DM3_Torneos.rdl
    - RPT_DM4_Auditoria.rdl

Para vincular cada reporte a su dataset compartido:

1. Abrir un reporte (doble click en el .rdl).
2. Ir a menu View -> Report Data.
3. En panel Report Data, click derecho en Datasets -> Add Dataset.
4. Name: DS_RPT (cualquier nombre interno).
5. Seleccionar Use a shared dataset.
6. Elegir el dataset correspondiente:
    - RPT_DM1_Ingresos.rdl -> DSD_DM1_INGRESOS
    - RPT_DM2_Comportamiento.rdl -> DSD_DM2_COMPORTAMIENTO
    - RPT_DM3_Torneos.rdl -> DSD_DM3_TORNEOS
    - RPT_DM4_Auditoria.rdl -> DSD_DM4_AUDITORIA
7. Click OK.

### 11.8 Deploy y verificacion en portal SSRS

1. Menu Build -> Build Solution.
2. Corregir errores si existen.
3. Click derecho en proyecto SSRS_DW_ESPORTS -> Deploy.
4. Revisar Output y confirmar mensaje Deploy succeeded.
5. Abrir navegador y entrar a la URL de Web Portal obtenida en 11.2.
6. Verificar que existen las carpetas/objetos desplegados:
    - DW_ESPORTS (reportes)
    - DW_ESPORTS_DataSources
    - DW_ESPORTS_Datasets
7. Abrir cada reporte RPT_DM1, RPT_DM2, RPT_DM3, RPT_DM4 para validar que no hay error de conexion.

### 11.9 Gate final de Fase 11

1. Proyecto SSRS_DW_ESPORTS creado y guardado en la solucion.
2. DS_DW_ESPORTS prueba conexion en success.
3. Existen los 4 Shared Datasets DM1-DM4.
4. Existen los 4 reportes RDL DM1-DM4.
5. Deploy finaliza en success.
6. El portal SSRS abre los reportes sin error de datasource.

Con esta secuencia el flujo completo queda:

Oracle + RRHH + Excel + Mongo XLSX -> Staging normalizado -> Dimensiones -> Hechos -> SSAS -> Power BI -> SSRS.

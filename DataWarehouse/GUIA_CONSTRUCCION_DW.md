# 🏗️ Guía Completa de Construcción del Data Warehouse — eSports Platform

> **Esta guía es el complemento detallado de `CONTEXTO_DATAWAREHOUSE.md` (Sección 8).**
> Contiene la DDL de los 4 datamarts con esquema estrella y los pasos click-por-click de Visual Studio.

---

## Índice

1. [Fase 0: Preparación — Crear Base DW y DIM_TIEMPO](#fase-0)
2. [Datamart 1: Ingresos y Monetización (DDL Estrella)](#dm1)
3. [Datamart 2: Comportamiento del Usuario (DDL Estrella)](#dm2)
4. [Datamart 3: Calidad de Torneos (DDL Estrella)](#dm3)
5. [Datamart 4: Seguridad y Auditoría (DDL Estrella)](#dm4)
6. [Fase 1-3: Crear Proyecto SSIS en Visual Studio](#ssis)
7. [Fase 4-5: Crear Proyecto SSAS en Visual Studio](#ssas)
8. [Fase 6: Dashboards en Power BI](#powerbi)
9. [Fase 7: Exportar Excel desde SSAS](#export)

---

<a id="fase-0"></a>
## Fase 0: Preparación — Crear Base DW y DIM_TIEMPO

### 0.1 Crear la Base de Datos del DW en SQL Server

1. Abrir **SSMS** → Conectar al **Database Engine**
2. Click derecho en **Databases** → **New Database…**
3. Database name: `DW_ESPORTS` → **OK**

### 0.2 Crear DIM_TIEMPO (estructura exacta del profesor)

Abrir **New Query** contra `DW_ESPORTS` y ejecutar:

```sql
-- =============================================
-- DIM_TIEMPO — Dimensión compartida (todos los datamarts)
-- Estructura del profesor: id_tiempo = YYYYMMDD (INT)
-- =============================================
CREATE TABLE dim_tiempo (
    id_tiempo    INT          NOT NULL PRIMARY KEY,  -- YYYYMMDD (ej: 20260401)
    fecha        DATETIME     NULL,
    anio         INT          NULL,
    trimestre    INT          NULL,
    mes_nombre   VARCHAR(30)  NULL,
    mes_numero   INT          NULL,
    semestre     INT          NULL
);
GO
```

### 0.3 Crear y ejecutar los Stored Procedures del profesor

```sql
-- SP que inserta una fecha individual
CREATE PROCEDURE [dbo].[InsertarFecha]
   @CurrentDate datetime
AS
INSERT INTO dim_tiempo(id_tiempo, fecha, anio, trimestre, mes_nombre, mes_numero, semestre)
VALUES(
    (DATEPART(year, @CurrentDate) * 10000) + (DATEPART(month, @CurrentDate) * 100)
    + DATEPART(day, @CurrentDate)
    , @CurrentDate
    , DATEPART(year, @CurrentDate)
    , DATEPART(QUARTER, @CurrentDate)
    , DATENAME(month, @CurrentDate)
    , DATEPART(month, @CurrentDate)
    , CASE WHEN DATEPART(quarter, @CurrentDate) < 3 THEN 1 ELSE 2 END
);
GO

-- SP que llena DIM_TIEMPO desde 2000-01-30 hasta año actual + 5
CREATE PROCEDURE [dbo].[CargarDimTiempo]
AS
DECLARE @StartDate datetime, @EndDate datetime
SET @StartDate = '20000130'
SET @EndDate = CAST(CAST(YEAR(GETDATE()) + 5 AS CHAR(4)) + '1231' AS DATETIME)

WHILE @StartDate <= @EndDate BEGIN
    EXEC InsertarFecha @StartDate
    SET @StartDate = DATEADD(day, 1, @StartDate)
END
GO
```

### 0.4 Ejecutar la carga

```sql
EXEC CargarDimTiempo;
-- Tardará unos segundos. Genera ~11,000+ registros (2000-2031).
-- Verificar: SELECT COUNT(*) FROM dim_tiempo; SELECT TOP 5 * FROM dim_tiempo;
```

---

<a id="dm1"></a>
## Datamart 1: Ingresos y Monetización — DDL Esquema Estrella

> **Fuentes:** Oracle (transacciones, órdenes, items) + Excel (presupuestos) + RRHH (responsable)

```
                    ┌──────────────────────┐
                    │    dim_tiempo         │
                    │ PK id_tiempo (INT)   │
                    │    fecha, anio,       │
                    │    trimestre, mes_*,  │
                    │    semestre           │
                    └──────────┬───────────┘
                               │
┌──────────────────┐           │           ┌──────────────────────┐
│ dim_region       │           │           │ dim_tipo_item        │
│ PK id_region     │───┐       │       ┌───│ PK id_tipo_item      │
│    nombre_region │   │       │       │   │    nombre_tipo       │
└──────────────────┘   │       │       │   └──────────────────────┘
                       │       │       │
                  ┌────▼───────▼───────▼────────────────────┐
                  │           fact_ingresos                  │
                  │ FK id_dim_tiempo                        │
                  │ FK id_dim_region                        │
                  │ FK id_dim_tipo_item                     │
                  │ FK id_dim_origen                        │
                  │ FK id_dim_usuario                       │
                  │ FK id_dim_responsable_rrhh              │
                  │    monto_real, meta_ingresos,           │
                  │    creditos_otorgados, cantidad         │
                  └────┬───────────────────────┬────────────┘
                       │                       │
┌──────────────────────▼──┐    ┌───────────────▼────────────┐
│ dim_origen_transaccion  │    │ dim_usuario_comprador      │
│ PK id_origen            │    │ PK id_usuario              │
│    nombre_origen        │    │    nickname, pais, divisa,  │
└─────────────────────────┘    │    fecha_registro           │
                               └────────────────────────────┘
                 ┌─────────────────────────────────┐
                 │ dim_responsable_rrhh             │
                 │ PK id_empleado                   │
                 │    nombre_completo, cargo,       │
                 │    departamento, version,        │
                 │    version_actual                │
                 └─────────────────────────────────┘
```

### DDL:

```sql
USE DW_ESPORTS;
GO

-- ========== DIMENSIONES DM1 ==========

CREATE TABLE dim_region (
    id_region       INT          NOT NULL PRIMARY KEY,
    nombre_region   VARCHAR(200) NOT NULL
);

CREATE TABLE dim_tipo_item (
    id_tipo_item    INT          NOT NULL PRIMARY KEY,
    nombre_tipo     VARCHAR(100) NOT NULL
);

CREATE TABLE dim_origen_transaccion (
    id_origen       INT          NOT NULL PRIMARY KEY,
    nombre_origen   VARCHAR(100) NOT NULL
);

CREATE TABLE dim_usuario_comprador (
    id_usuario      INT          NOT NULL PRIMARY KEY,
    nickname        VARCHAR(100) NULL,
    pais            VARCHAR(100) NULL,
    divisa          VARCHAR(10)  NULL,
    fecha_registro  DATETIME     NULL
);

-- Patrón SCD del profesor (VERSION + VERSION_ACTUAL)
CREATE TABLE dim_responsable_rrhh (
    id_empleado     INT          NOT NULL,
    nombre_completo VARCHAR(150) NULL,
    cargo           VARCHAR(45)  NULL,
    departamento    VARCHAR(45)  NULL,
    version         INT          NOT NULL,
    version_actual  INT          NOT NULL,  -- 1=actual, 0=histórico
    PRIMARY KEY (id_empleado, version)
);

-- ========== TABLA DE HECHOS DM1 ==========

CREATE TABLE fact_ingresos (
    id_dim_tiempo           INT          NOT NULL,
    id_dim_region           INT          NOT NULL,
    id_dim_tipo_item        INT          NOT NULL,
    id_dim_origen           INT          NOT NULL,
    id_dim_usuario          INT          NOT NULL,
    id_dim_responsable      INT          NULL,
    version_responsable     INT          NULL,
    monto_real              DECIMAL(12,2) NULL,
    meta_ingresos           DECIMAL(12,2) NULL,
    creditos_otorgados      INT          NULL,
    cantidad                INT          DEFAULT 1,
    FOREIGN KEY (id_dim_tiempo) REFERENCES dim_tiempo(id_tiempo),
    FOREIGN KEY (id_dim_region) REFERENCES dim_region(id_region),
    FOREIGN KEY (id_dim_tipo_item) REFERENCES dim_tipo_item(id_tipo_item),
    FOREIGN KEY (id_dim_origen) REFERENCES dim_origen_transaccion(id_origen),
    FOREIGN KEY (id_dim_usuario) REFERENCES dim_usuario_comprador(id_usuario)
);
GO
```

### Query de carga (SSIS — OLE DB Source desde Oracle):

```sql
-- Para dim_region (desde Oracle)
SELECT ID AS id_region, VALOR AS nombre_region FROM CATALOGO_REGION;

-- Para dim_tipo_item (desde Oracle)
SELECT ID AS id_tipo_item, VALOR AS nombre_tipo FROM CATALOGO_TIPO_ITEM;

-- Para dim_origen_transaccion (desde Oracle)
SELECT ID AS id_origen, VALOR AS nombre_origen FROM CATALOGO_ORIGEN_TRANSACCION;

-- Para dim_usuario_comprador (desde Oracle)
SELECT u.ID AS id_usuario, u.NICKNAME, p.PAIS, p.DIVISA,
       u.CREADO_EN AS fecha_registro
FROM USUARIO u
JOIN PERSONA p ON p.ID = u.PERSONA_ID;

-- Para dim_responsable_rrhh (desde RRHH SQL Server — patrón del profesor)
SELECT e.idEmpleado AS id_empleado,
       e.pnombre + ' ' + e.snombre + ' ' + e.papellido AS nombre_completo,
       c.nombre AS cargo,
       d.Nombre AS departamento,
       ROW_NUMBER() OVER (PARTITION BY e.idEmpleado ORDER BY ce.fechaNombramiento ASC) AS version,
       CASE ROW_NUMBER() OVER (PARTITION BY e.idEmpleado ORDER BY ce.fechaNombramiento DESC)
            WHEN 1 THEN 1 ELSE 0 END AS version_actual
FROM Empleado e
INNER JOIN Cargo_empleado ce ON ce.idEmpleado = e.idEmpleado
INNER JOIN Cargo c ON c.idCargo = ce.idCargo
INNER JOIN Departamento d ON d.idDepartamento = e.idDepartamento;

-- Para fact_ingresos (desde Oracle)
SELECT
    EXTRACT(YEAR FROM t.CREADO_EN) * 10000 +
    EXTRACT(MONTH FROM t.CREADO_EN) * 100 +
    EXTRACT(DAY FROM t.CREADO_EN)           AS id_dim_tiempo,
    r.ID                                    AS id_dim_region,
    NVL(o.ITEM_ID, 0)                      AS id_dim_tipo_item_ref,
    t.ORIGEN_ID                             AS id_dim_origen,
    t.USUARIO_ID                            AS id_dim_usuario,
    t.MONTO                                 AS monto_real,
    ti.CREDITOS_OTORGADOS                   AS creditos_otorgados
FROM TRANSACCION t
JOIN USUARIO u ON u.ID = t.USUARIO_ID
JOIN PERSONA p ON p.ID = u.PERSONA_ID
LEFT JOIN CATALOGO_REGION r ON r.VALOR = p.PAIS
LEFT JOIN TIENDA_ORDEN o ON o.USUARIO_ID = t.USUARIO_ID
LEFT JOIN TIENDA_ITEM ti ON ti.ID = o.ITEM_ID;
```

---

<a id="dm2"></a>
## Datamart 2: Comportamiento del Usuario — DDL Esquema Estrella

> **Fuentes:** Oracle (usuarios, amigos, estadísticas) + MongoDB (logs_actividad)

```sql
USE DW_ESPORTS;
GO

-- ========== DIMENSIONES DM2 ==========

-- dim_tiempo (compartida)

CREATE TABLE dim_usuario (
    id_usuario      INT          NOT NULL PRIMARY KEY,
    nickname        VARCHAR(100) NULL,
    xp              INT          NULL,
    estado          VARCHAR(50)  NULL,
    pais            VARCHAR(100) NULL,
    fecha_registro  DATETIME     NULL
);

CREATE TABLE dim_juego (
    id_juego        INT          NOT NULL PRIMARY KEY,
    nombre_juego    VARCHAR(200) NOT NULL
);

CREATE TABLE dim_tipo_evento (
    id_tipo_evento  INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    nombre_evento   VARCHAR(100) NOT NULL
);

CREATE TABLE dim_pais (
    id_pais         INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    nombre_pais     VARCHAR(100) NOT NULL
);

-- ========== TABLA DE HECHOS DM2 ==========

CREATE TABLE fact_actividad_usuario (
    id_dim_tiempo       INT NOT NULL,
    id_dim_usuario      INT NOT NULL,
    id_dim_juego        INT NULL,
    id_dim_tipo_evento  INT NOT NULL,
    id_dim_pais         INT NULL,
    total_amigos        INT NULL,
    total_seguidores    INT NULL,
    xp_acumulado        INT NULL,
    cantidad_eventos    INT DEFAULT 1,
    tiempo_sesion_seg   INT NULL,
    victorias           INT NULL,
    horas_jugadas       INT NULL,
    FOREIGN KEY (id_dim_tiempo) REFERENCES dim_tiempo(id_tiempo),
    FOREIGN KEY (id_dim_usuario) REFERENCES dim_usuario(id_usuario),
    FOREIGN KEY (id_dim_juego) REFERENCES dim_juego(id_juego),
    FOREIGN KEY (id_dim_tipo_evento) REFERENCES dim_tipo_evento(id_tipo_evento),
    FOREIGN KEY (id_dim_pais) REFERENCES dim_pais(id_pais)
);
GO
```

### Query de carga:

```sql
-- dim_juego (desde Oracle)
SELECT ID AS id_juego, NOMBRE AS nombre_juego FROM JUEGO;

-- dim_usuario (desde Oracle)
SELECT u.ID AS id_usuario, u.NICKNAME, u.XP, u.ESTADO,
       p.PAIS, u.CREADO_EN AS fecha_registro
FROM USUARIO u JOIN PERSONA p ON p.ID = u.PERSONA_ID;

-- dim_tipo_evento (se inserta manualmente o desde MongoDB distinct)
INSERT INTO dim_tipo_evento (nombre_evento) VALUES
('login'),('logout'),('busqueda'),('perfil_visitado'),
('clic_torneo'),('clic_tienda'),('cambio_config'),('envio_solicitud_amistad');

-- dim_pais (desde MongoDB distinct + Oracle distinct)
-- Se puede poblar con: db.logs_actividad.distinct("pais_origen")
```

---

<a id="dm3"></a>
## Datamart 3: Calidad de Torneos y Juegos — DDL Esquema Estrella

> **Fuentes:** Oracle (torneos, inscripciones, premios) + MongoDB (feedback_torneos)

```sql
USE DW_ESPORTS;
GO

-- ========== DIMENSIONES DM3 ==========

-- dim_tiempo (compartida)
-- dim_juego (compartida con DM2)

CREATE TABLE dim_modo_juego (
    id_modo_juego   INT          NOT NULL PRIMARY KEY,
    nombre_modo     VARCHAR(200) NOT NULL,
    nombre_juego    VARCHAR(200) NOT NULL   -- Desnormalizado para estrella
);

CREATE TABLE dim_tipo_torneo (
    id_tipo_torneo  INT          NOT NULL PRIMARY KEY,
    nombre_tipo     VARCHAR(100) NOT NULL,
    tipo_trofeo     VARCHAR(100) NULL
);

CREATE TABLE dim_plataforma (
    id_plataforma   INT          NOT NULL PRIMARY KEY,
    nombre_plataforma VARCHAR(100) NOT NULL
);

CREATE TABLE dim_region_torneo (
    id_region       INT          NOT NULL PRIMARY KEY,
    nombre_region   VARCHAR(200) NOT NULL
);

-- ========== TABLA DE HECHOS DM3 ==========

CREATE TABLE fact_torneos (
    id_dim_tiempo           INT          NOT NULL,
    id_dim_juego            INT          NOT NULL,
    id_dim_modo_juego       INT          NULL,
    id_dim_tipo_torneo      INT          NULL,
    id_dim_plataforma       INT          NULL,
    id_dim_region           INT          NOT NULL,
    total_inscritos         INT          NULL,
    inscritos_confirmados   INT          NULL,
    capacidad               INT          NULL,
    fondo_premios           DECIMAL(12,2) NULL,
    comision                DECIMAL(12,2) NULL,
    calificacion_promedio   DECIMAL(3,2) NULL,
    total_resenas           INT          NULL,
    pct_recomendacion       DECIMAL(5,2) NULL,
    cantidad_torneos        INT          DEFAULT 1,
    FOREIGN KEY (id_dim_tiempo) REFERENCES dim_tiempo(id_tiempo),
    FOREIGN KEY (id_dim_juego) REFERENCES dim_juego(id_juego),
    FOREIGN KEY (id_dim_modo_juego) REFERENCES dim_modo_juego(id_modo_juego),
    FOREIGN KEY (id_dim_tipo_torneo) REFERENCES dim_tipo_torneo(id_tipo_torneo),
    FOREIGN KEY (id_dim_plataforma) REFERENCES dim_plataforma(id_plataforma),
    FOREIGN KEY (id_dim_region) REFERENCES dim_region_torneo(id_region)
);
GO
```

### Query de carga:

```sql
-- dim_modo_juego (desde Oracle)
SELECT m.ID AS id_modo_juego, m.NOMBRE AS nombre_modo, j.NOMBRE AS nombre_juego
FROM MODO_JUEGO m JOIN JUEGO j ON j.ID = m.JUEGO_ID;

-- dim_tipo_torneo (desde Oracle)
SELECT ID AS id_tipo_torneo, VALOR AS nombre_tipo, TIPO_TROFEO AS tipo_trofeo
FROM CATALOGO_TIPO_TORNEO;

-- dim_plataforma (desde Oracle)
SELECT ID AS id_plataforma, VALOR AS nombre_plataforma FROM CATALOGO_PLATAFORMA;

-- dim_region_torneo (desde Oracle — puede compartir con dim_region de DM1)
SELECT ID AS id_region, VALOR AS nombre_region FROM CATALOGO_REGION;

-- fact_torneos (desde Oracle — una fila por torneo)
SELECT
    EXTRACT(YEAR FROM t.FECHA_INICIO_TORNEO) * 10000 +
    EXTRACT(MONTH FROM t.FECHA_INICIO_TORNEO) * 100 +
    EXTRACT(DAY FROM t.FECHA_INICIO_TORNEO) AS id_dim_tiempo,
    t.JUEGO_ID                              AS id_dim_juego,
    t.MODO_JUEGO_ID                         AS id_dim_modo_juego,
    t.TIPO_TORNEO_ID                        AS id_dim_tipo_torneo,
    t.REGION_ID                             AS id_dim_region,
    t.CAPACIDAD,
    (SELECT COUNT(*) FROM TORNEO_INSCRIPCION ti WHERE ti.TORNEO_ID = t.ID) AS total_inscritos,
    (SELECT COUNT(*) FROM TORNEO_INSCRIPCION ti
     WHERE ti.TORNEO_ID = t.ID AND ti.ESTADO_ID = (SELECT ID FROM CATALOGO_ESTADO_INSCRIPCION WHERE VALOR='confirmada')
    ) AS inscritos_confirmados,
    tp.FONDO_TOTAL                          AS fondo_premios,
    tp.COMISION_TOTAL                       AS comision
FROM TORNEO t
LEFT JOIN TORNEO_PREMIOS tp ON tp.TORNEO_ID = t.ID;

-- Las columnas calificacion_promedio, total_resenas, pct_recomendacion
-- se llenan por separado desde MongoDB (feedback_torneos agrupado por oracle_torneo_id)
```

---

<a id="dm4"></a>
## Datamart 4: Seguridad y Auditoría — DDL Esquema Estrella

> **Fuentes:** Oracle (AUDITORIA_LOG, soporte) + RRHH (empleados) + Excel (lista negra)

```sql
USE DW_ESPORTS;
GO

-- ========== DIMENSIONES DM4 ==========

-- dim_tiempo (compartida)

CREATE TABLE dim_operacion (
    id_operacion    INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    nombre_operacion VARCHAR(20)  NOT NULL    -- INSERT, UPDATE, DELETE
);

CREATE TABLE dim_tabla_auditada (
    id_tabla        INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    nombre_tabla    VARCHAR(100) NOT NULL    -- USUARIO, TIENDA_ORDEN, etc.
);

-- Patrón SCD del profesor
CREATE TABLE dim_empleado_soporte (
    id_empleado     INT          NOT NULL,
    nombre_completo VARCHAR(150) NULL,
    cargo           VARCHAR(45)  NULL,
    departamento    VARCHAR(45)  NULL,
    version         INT          NOT NULL,
    version_actual  INT          NOT NULL,
    PRIMARY KEY (id_empleado, version)
);

CREATE TABLE dim_pais_registro (
    id_pais             INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    nombre_pais         VARCHAR(100) NOT NULL,
    es_restringido      INT          DEFAULT 0,    -- 1 si en Excel Lista_Negra
    motivo_restriccion  VARCHAR(200) NULL
);

CREATE TABLE dim_rol_usuario (
    id_rol          INT          NOT NULL PRIMARY KEY,
    nombre_rol      VARCHAR(100) NOT NULL    -- admin, usuario, moderador
);

-- ========== TABLA DE HECHOS DM4 ==========

CREATE TABLE fact_auditoria (
    id_dim_tiempo           INT NOT NULL,
    id_dim_operacion        INT NOT NULL,
    id_dim_tabla            INT NOT NULL,
    id_dim_empleado_soporte INT NULL,
    version_empleado        INT NULL,
    id_dim_pais             INT NULL,
    id_dim_rol              INT NULL,
    total_eventos           INT DEFAULT 1,
    tickets_soporte         INT NULL,
    tickets_resueltos       INT NULL,
    registros_restringidos  INT NULL,
    FOREIGN KEY (id_dim_tiempo) REFERENCES dim_tiempo(id_tiempo),
    FOREIGN KEY (id_dim_operacion) REFERENCES dim_operacion(id_operacion),
    FOREIGN KEY (id_dim_tabla) REFERENCES dim_tabla_auditada(id_tabla),
    FOREIGN KEY (id_dim_pais) REFERENCES dim_pais_registro(id_pais),
    FOREIGN KEY (id_dim_rol) REFERENCES dim_rol_usuario(id_rol)
);
GO
```

### Query de carga:

```sql
-- dim_operacion (manual)
INSERT INTO dim_operacion (nombre_operacion) VALUES ('INSERT'),('UPDATE'),('DELETE');

-- dim_tabla_auditada (desde Oracle AUDITORIA_LOG distinct)
-- SELECT DISTINCT TABLA FROM AUDITORIA_LOG;
INSERT INTO dim_tabla_auditada (nombre_tabla) VALUES ('USUARIO'),('TIENDA_ORDEN');

-- dim_rol_usuario (desde Oracle)
SELECT ID AS id_rol, VALOR AS nombre_rol FROM CATALOGO_ROL;

-- dim_empleado_soporte (desde RRHH — misma query patrón del profesor)
SELECT e.idEmpleado AS id_empleado,
       e.pnombre + ' ' + e.snombre + ' ' + e.papellido AS nombre_completo,
       c.nombre AS cargo, d.Nombre AS departamento,
       ROW_NUMBER() OVER (PARTITION BY e.idEmpleado ORDER BY ce.fechaNombramiento ASC) AS version,
       CASE ROW_NUMBER() OVER (PARTITION BY e.idEmpleado ORDER BY ce.fechaNombramiento DESC)
            WHEN 1 THEN 1 ELSE 0 END AS version_actual
FROM Empleado e
INNER JOIN Cargo_empleado ce ON ce.idEmpleado = e.idEmpleado
INNER JOIN Cargo c ON c.idCargo = ce.idCargo
INNER JOIN Departamento d ON d.idDepartamento = e.idDepartamento;

-- dim_pais_registro (cruce Oracle PERSONA + Excel Lista_Negra)
-- Paso 1: INSERT distintos países de Oracle
-- Paso 2: UPDATE es_restringido = 1 WHERE nombre_pais IN (SELECT valor FROM Excel Lista_Negra WHERE tipo='pais')

-- fact_auditoria (desde Oracle)
SELECT
    EXTRACT(YEAR FROM a.FECHA) * 10000 +
    EXTRACT(MONTH FROM a.FECHA) * 100 +
    EXTRACT(DAY FROM a.FECHA)   AS id_dim_tiempo,
    a.OPERACION                 AS nombre_operacion,   -- resolver a id_dim_operacion con lookup
    a.TABLA                     AS nombre_tabla,        -- resolver a id_dim_tabla con lookup
    1                           AS total_eventos
FROM AUDITORIA_LOG a;
```

---

<a id="ssis"></a>
## Pasos Detallados — Proyecto SSIS en Visual Studio

### Paso 1: Crear el proyecto

1. Abrir **Visual Studio**
2. Menú: **File → New → Project…**
3. En el cuadro de búsqueda superior, escribir: `Integration Services`
4. Seleccionar la plantilla **"Integration Services Project"**
5. Click en **Next**
6. **Project name:** `SSIS_DW_ESPORTS`
7. **Location:** `c:\Users\USER\Desktop\projects\esports-platform\DataWarehouse\SSIS\`
8. Click en **Create**
9. Se abre el diseñador con un paquete `Package.dtsx` vacío

### Paso 2: Configurar Connection Managers

En la parte **inferior** del diseñador hay un panel que dice **"Connection Managers"**.

#### 2.1 Conexión a Oracle (Fuente OLTP)

1. Click derecho en el panel "Connection Managers" → **New OLE DB Connection…**
2. Click en **New…** en el diálogo
3. **Provider:** seleccionar `Oracle Provider for OLE DB`
   - Si no aparece, usar `Microsoft OLE DB Provider for Oracle`
   - Si tampoco aparece, necesitas instalar **Oracle Data Access Components (ODAC)**
4. **Server name (Data Source):** `localhost:1521/XEPDB1`
5. **User name:** `ESPORTS_APP`
6. **Password:** `Esports2026`
7. Click en **Test Connection** → debe decir "Test connection succeeded"
8. **OK** → **OK**
9. El connection manager aparece abajo. Click derecho → **Rename** → `CONN_ORACLE_ESPORTS`

#### 2.2 Conexión a SQL Server RRHH (Fuente)

1. Click derecho en "Connection Managers" → **New OLE DB Connection…** → **New…**
2. **Provider:** `SQL Server Native Client` (o `Microsoft OLE DB Provider for SQL Server`)
3. **Server name:** `localhost` (o `.\SQLEXPRESS` si es instancia nombrada)
4. **Authentication:** Windows Authentication
5. **Select or enter a database name:** `RRHH_Transaccional`
6. **Test Connection** → **OK** → **OK**
7. Renombrar a `CONN_SQLSERVER_RRHH`

#### 2.3 Conexión a SQL Server DW (Destino)

1. Mismos pasos que 2.2, pero seleccionar database: `DW_ESPORTS`
2. Renombrar a `CONN_SQLSERVER_DW`

#### 2.4 Conexión a Excel (Fuente)

1. Click derecho en "Connection Managers" → **New Connection…**
2. En "Add SSIS Connection Manager", seleccionar tipo: **EXCEL**
3. Click **Add**
4. **Excel file path:** navegar a `DataWarehouse\Excel\DW_Fuentes_Excel.xlsx`
5. Marcar ☑ **"First row has column names"**
6. **OK**
7. Renombrar a `CONN_EXCEL_FUENTES`

#### 2.5 Conexión a MongoDB (Fuente)

**Opción A — ODBC:**
1. Instalar **MongoDB ODBC Driver** (descargar de mongodb.com)
2. Click derecho → **New Connection…** → **ODBC**
3. Configurar con: `Server=localhost;Port=27017;Database=esports_analytics`

**Opción B — Flat File (más simple):**
1. Exportar desde MongoDB a CSV: `mongoexport --db esports_analytics --collection logs_actividad --type=csv --out logs.csv`
2. Click derecho → **New Connection…** → **FLATFILE**
3. Seleccionar `logs.csv`

### Paso 3: Crear Paquetes ETL

#### 3.1 Renombrar y crear paquetes

1. En **Solution Explorer** (panel derecho): Expandir **SSIS Packages**
2. Click derecho sobre `Package.dtsx` → **Rename** → `ETL_DIM_Compartidas.dtsx`
3. Click derecho sobre **SSIS Packages** → **New SSIS Package** → renombrar a `ETL_DM1_Ingresos.dtsx`
4. Repetir para: `ETL_DM2_Comportamiento.dtsx`, `ETL_DM3_Torneos.dtsx`, `ETL_DM4_Auditoria.dtsx`

#### 3.2 Diseñar un paquete (ejemplo: ETL_DIM_Compartidas.dtsx)

**En la pestaña "Control Flow":**

1. Desde el **Toolbox** (panel izquierdo), arrastrar un **"Data Flow Task"** al canvas
2. Doble click en el nombre del Data Flow Task → renombrarlo a `DFT_Cargar_dim_region`
3. Arrastrar otro **"Data Flow Task"** debajo → renombrar a `DFT_Cargar_dim_tipo_item`
4. Arrastrar otro → `DFT_Cargar_dim_origen_transaccion`
5. Arrastrar otro → `DFT_Cargar_dim_juego`
6. Arrastrar otro → `DFT_Cargar_dim_plataforma`
7. Arrastrar otro → `DFT_Cargar_dim_tipo_torneo`
8. etc.
9. **Conectar en secuencia**: click en el primer DFT, arrastrar la flecha verde al siguiente

**En cada Data Flow Task (doble click para entrar):**

1. Desde el Toolbox arrastrar un **"OLE DB Source"** al canvas
2. Doble click en el OLE DB Source:
   - **OLE DB connection manager:** seleccionar `CONN_ORACLE_ESPORTS`
   - **Data access mode:** "SQL command"
   - **SQL command text:** pegar la query de carga correspondiente (ej: `SELECT ID AS id_region, VALOR AS nombre_region FROM CATALOGO_REGION`)
   - OK
3. Desde el Toolbox arrastrar un **"OLE DB Destination"** debajo del Source
4. **Conectar:** click en el Source, arrastrar flecha azul al Destination
5. Doble click en el OLE DB Destination:
   - **OLE DB connection manager:** `CONN_SQLSERVER_DW`
   - **Name of the table or the view:** seleccionar `dim_region`
   - Click en **Mappings** (panel izquierdo)
   - Verificar que las columnas se mapean correctamente: `id_region → id_region`, `nombre_region → nombre_region`
   - **OK**

#### 3.3 Para paquetes que combinan fuentes (ej: ETL_DM1_Ingresos.dtsx)

Dentro del Data Flow de `fact_ingresos`:

1. Arrastrar **OLE DB Source** (Oracle — query de fact_ingresos)
2. Arrastrar **Excel Source** (Excel — Presupuestos_Ventas)
3. Arrastrar un **Lookup Transformation** debajo del Oracle Source
4. Conectar Oracle Source → Lookup con flecha azul
5. Doble click en Lookup:
   - **Connection:** `CONN_EXCEL_FUENTES`
   - **Reference table:** `Presupuestos_Ventas$`
   - **Columns:** mapear `id_dim_region` ↔ `region` para agregar `meta_ingresos_usd`
   - **OK**
6. Arrastrar **OLE DB Destination** (DW → fact_ingresos)
7. Conectar Lookup → Destination

### Paso 4: Ejecutar paquetes

1. Click derecho sobre el paquete en Solution Explorer → **Execute Package** (o F5)
2. El diseñador cambia a modo de ejecución
3. Cada Data Flow Task aparecerá en **verde** ✅ si fue exitoso o **rojo** ❌ si falló
4. Para ver errores: click en la pestaña **"Progress"** en la parte inferior
5. Para detener: botón **Stop Debugging** (ícono cuadrado rojo) en la barra de herramientas
6. **Ejecutar en orden:** Primero `ETL_DIM_Compartidas`, luego DM1, DM2, DM3, DM4

---

<a id="ssas"></a>
## Pasos Detallados — Proyecto SSAS en Visual Studio

### Paso 5: Crear el proyecto SSAS

1. En Visual Studio con la solución abierta:
2. Menú: **File → Add → New Project…**
3. Buscar: `Analysis Services`
4. Seleccionar **"Analysis Services Multidimensional and Data Mining Project"**
5. **Project name:** `SSAS_DW_ESPORTS`
6. Click **Add**

### Paso 6: Configurar Data Source

1. En Solution Explorer, expandir el proyecto `SSAS_DW_ESPORTS`
2. Click derecho en **Data Sources** → **New Data Source…**
3. Click **Next** en el wizard
4. Click **New…** → configurar conexión a SQL Server:
   - Server: `localhost`
   - Database: `DW_ESPORTS`
   - Windows Authentication → **Test Connection** → **OK**
5. **Next** → Impersonation info: seleccionar **"Use the service account"** → **Next**
6. Data source name: `DS_DW_ESPORTS` → **Finish**

### Paso 7: Crear Data Source View

1. Click derecho en **Data Source Views** → **New Data Source View…**
2. Seleccionar `DS_DW_ESPORTS` → **Next**
3. En **"Available objects"** aparecen todas las tablas del DW
4. Seleccionar **TODAS** las tablas (`dim_*` y `fact_*`) → click el botón **>** para moverlas a "Included objects"
5. **Next** → Nombre: `DSV_DW_ESPORTS` → **Finish**
6. Se abre un **diagrama visual** con todas las tablas
7. Verificar que las relaciones (líneas entre tablas) estén correctas
8. Si falta alguna relación:
   - Click derecho en la tabla de hechos → **New Relationship…**
   - Source: columna FK de la fact → Destination: columna PK de la dim → **OK**

### Paso 8: Crear Dimensiones

Para **cada dimensión** (dim_tiempo, dim_region, dim_juego, dim_usuario, etc.):

1. Click derecho en **Dimensions** → **New Dimension…**
2. **Next** → Seleccionar **"Use an existing table"** → **Next**
3. **Main table:** seleccionar la tabla dimensión (ej: `dim_tiempo`)
4. **Key column:** se detecta automáticamente (ej: `id_tiempo`)
5. **Name column:** seleccionar un nombre descriptivo (ej: `fecha`)
6. **Next** → Seleccionar los atributos a incluir:
   - Para dim_tiempo: ☑ id_tiempo, ☑ anio, ☑ trimestre, ☑ mes_nombre, ☑ mes_numero, ☑ semestre
   - Para dim_juego: ☑ id_juego, ☑ nombre_juego
7. **Next** → Nombre de la dimensión (ej: `Dim Tiempo`) → **Finish**

**Configurar jerarquías (IMPORTANTE):**

1. Doble click en la dimensión creada (ej: `Dim Tiempo.dim`)
2. En el panel izquierdo aparecen los **Attributes**
3. Para crear una jerarquía, arrastrar atributos al panel central **"Hierarchies"**:
   - **Dim Tiempo:** Arrastrar en orden: `Anio` → `Semestre` → `Trimestre` → `Mes Nombre`
   - **Dim Modo Juego:** `Nombre Juego` → `Nombre Modo`
   - **Dim Responsable RRHH:** `Departamento` → `Cargo` → `Nombre Completo`
4. **Guardar** (Ctrl+S)

### Paso 9: Crear Cubos (uno por datamart)

1. Click derecho en **Cubes** → **New Cube…**
2. **Next** → Seleccionar **"Use existing tables"** → **Next**
3. **Measure Group Tables:** marcar ☑ la tabla de hechos (ej: `fact_ingresos`)
4. **Next** → **Measures:** marcar ☑ las métricas a incluir:
   - Para Cubo_Ingresos: ☑ monto_real, ☑ meta_ingresos, ☑ creditos_otorgados, ☑ cantidad
   - Para Cubo_Torneos: ☑ total_inscritos, ☑ fondo_premios, ☑ calificacion_promedio, etc.
5. **Next** → **Dimensions:** marcar ☑ todas las dimensiones relacionadas
6. **Next** → Cube name: `Cubo Ingresos` → **Finish**
7. **Repetir** para `Cubo Comportamiento`, `Cubo Torneos`, `Cubo Auditoria`

### Paso 10: Procesar y Desplegar

1. Click derecho sobre el proyecto SSAS en Solution Explorer → **Properties**
2. En **Deployment → Target → Server:** escribir `localhost`
3. **OK**
4. Click derecho sobre el proyecto → **Deploy**
5. Se abre la ventana de progreso de despliegue
6. Debe terminar con **"Deploy Succeeded"**
7. Si hay errores, leer el mensaje en el panel **Output**

### Paso 11: Verificar en SSMS

1. Abrir **SSMS**
2. En "Connect to Server":
   - **Server type:** `Analysis Services` (NO Database Engine)
   - **Server name:** `localhost`
   - **Connect**
3. En Object Explorer expandir: `Databases → SSAS_DW_ESPORTS → Cubes`
4. Click derecho en un cubo → **Browse**
5. Se abre un explorador donde puedes arrastrar medidas y dimensiones
6. Verificar que los datos se ven correctos

---

<a id="powerbi"></a>
## Pasos Detallados — Power BI

### Paso 12: Conectar Power BI a SSAS

1. Abrir **Power BI Desktop**
2. En la pantalla de inicio click **Get Data** (o menú Home → Get Data)
3. Buscar **"Analysis Services"** → seleccionar **"SQL Server Analysis Services database"** → **Connect**
4. **Server:** `localhost`
5. **Database:** dejar vacío
6. Seleccionar **"Connect live"** → **OK**
7. En el Navigator, expandir la base de datos y seleccionar un cubo (ej: `Cubo Ingresos`)
8. Click **Load** (o **Transform Data** si quieres editar antes)
9. En el panel derecho **"Fields"** aparecen las dimensiones y medidas del cubo

### Paso 13: Crear Dashboards (mínimo 4 páginas)

**Para cada dashboard:**

1. Click en **"+"** en la barra inferior para crear una nueva página
2. Renombrar la pestaña: doble click → ej: `Ingresos y Monetización`
3. Arrastrar campos al canvas para crear visualizaciones:
   - **Gráfico de barras:** Arrastrar `Dim Region → Nombre Region` al eje X, `monto_real` al eje Y
   - **Gráfico de líneas:** Arrastrar `Dim Tiempo → Anio` y `Dim Tiempo → Mes` al eje X, `monto_real` al eje Y
   - **KPI card:** Arrastrar `monto_real` → se muestra el total
   - **Tabla:** Arrastrar múltiples campos
4. Ajustar colores, títulos, y formato en el panel **Format**

**Sugerencias por dashboard:**
- **Ingresos:** Ventas vs Metas por región, tendencia mensual, top items vendidos
- **Comportamiento:** Top usuarios por XP, correlación amigos vs actividad, mapa de eventos
- **Torneos:** Juegos más populares, tasa de llenado, calificación promedio por tipo
- **Auditoría:** Eventos por tipo de operación, países restringidos, tickets resueltos

### Paso 14: Guardar como .pbix

1. **File → Save As** → guardar en `DataWarehouse/PowerBI/DW_ESPORTS.pbix`

---

<a id="export"></a>
## Pasos Detallados — Exportar Excel desde SSAS

### Paso 15: Exportar datos de cubos a Excel

1. Abrir **SSMS** → Conectar a **Analysis Services** (`localhost`)
2. Expandir: `Databases → SSAS_DW_ESPORTS → Cubes`
3. Click derecho en `Cubo Ingresos` → **Browse**
4. En el browser MDX, arrastrar dimensiones y medidas para crear la vista deseada
5. En la barra de herramientas buscar **"Analyze in Excel"** (ícono de Excel)
   - Si no está disponible: copiar los resultados manualmente, o...
   - Abrir Excel → pestaña **Data** → **From Other Sources** → **From Analysis Services**
   - Server: `localhost` → seleccionar el cubo → se crea una tabla dinámica
6. Guardar el archivo como `DataWarehouse/Excel/Exports_SSAS/Cubo_Ingresos.xlsx`
7. **Repetir** para cada cubo

### Paso 16: Generar Documento PDF

1. En Power BI: **File → Export → Export to PDF**
2. Incluir una descripción textual de cada dashboard
3. Guardar en `DataWarehouse/Docs/Dashboards_DW_ESPORTS.pdf`

# 📦 Contexto General del Proyecto — Data Warehouse (eSports Platform)

**Autor**: Eduardo Valenzuela  
**Fecha**: Abril 2026  
**Universidad**: UNAH  
**Objetivo**: Construir un **Data Warehouse** alojado en **SQL Server** utilizando múltiples fuentes de datos heterogéneas, con cubos OLAP y dashboards en Power BI.

---

## 📋 Tabla de Contenidos

1. [Resumen del Proyecto](#1-resumen-del-proyecto)
2. [Arquitectura General del Sistema Original](#2-arquitectura-general-del-sistema-original)
3. [Fuentes de Datos del Data Warehouse](#3-fuentes-de-datos-del-data-warehouse)
4. [Herramientas y Software Requerido](#4-herramientas-y-software-requerido)
5. [Estado Actual del Proyecto OLTP](#5-estado-actual-del-proyecto-oltp)
6. [Estado de la Migración Backend (NestJS → Oracle)](#6-estado-de-la-migración-backend-nestjs--oracle)
7. [Esquema de la Base de Datos RRHH (SQL Server)](#7-esquema-de-la-base-de-datos-rrhh-sql-server)
8. [Plan de Construcción del Data Warehouse](#8-plan-de-construcción-del-data-warehouse)
9. [Entregables Finales](#9-entregables-finales)
10. [Estructura de Archivos del Proyecto](#10-estructura-de-archivos-del-proyecto)
11. [Notas Importantes y Restricciones](#11-notas-importantes-y-restricciones)

---

## 1. Resumen del Proyecto

Este proyecto tiene **dos grandes fases**:

### Fase A — Sistema OLTP (ya completado en su mayoría)

Un sistema web de una **plataforma de eSports** con:

- **Frontend**: Next.js (React)
- **Backend/API**: NestJS con TypeORM
- **Base de datos original**: PostgreSQL 16 Alpine (Docker)
- **BD migrada**: Oracle 21c XE (migración completa de DDL, DML, funciones, triggers y paquetes PL/SQL)
- **BD en producción para backend**: En proceso de migración de decoradores TypeORM de UUID a `increment` (NUMBER) para compatibilidad con Oracle

### Fase B — Data Warehouse (por construir)

Construcción de un **Data Warehouse multidimensional** en **SQL Server** que:

- Extrae datos de **4 fuentes heterogéneas** (ver sección 3)
- Usa **SSIS** (SQL Server Integration Services) para ETL
- Construye **cubos OLAP** con **SSAS** (SQL Server Analysis Services)
- Genera **reportes** con **SSRS** (SQL Server Reporting Services)
- Se visualiza con **Power BI**

---

## 2. Arquitectura General del Sistema Original

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SISTEMA ORIGINAL (OLTP)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────┐    HTTP/REST    ┌──────────┐    TypeORM    ┌────────┐│
│  │ Next.js  │ ──────────────> │  NestJS  │ ───────────> │PostgreSQL│
│  │ Frontend │ <────────────── │  API     │ <─────────── │ 16      ││
│  │ :3000    │                 │ :3001    │              │ :5433   ││
│  └──────────┘                 └──────────┘              └────────┘│
│                                    │                               │
│                                    │ (migración en proceso)        │
│                                    ▼                               │
│                              ┌───────────┐                        │
│                              │ Oracle    │                        │
│                              │ 21c XE   │                        │
│                              │ :1521    │                        │
│                              └───────────┘                        │
└─────────────────────────────────────────────────────────────────────┘

                                    │
                                    │ ETL (SSIS)
                                    ▼

┌─────────────────────────────────────────────────────────────────────┐
│                     DATA WAREHOUSE (SQL Server)                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐  │
│  │ Datamart 1 │  │ Datamart 2 │  │ Datamart 3 │  │ Datamart 4 │  │
│  │(Monetizac.)│  │(Comportam.)│  │(Torneos/   │  │(Seguridad/ │  │
│  │            │  │            │  │ Juegos)    │  │ Auditoría) │  │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  │
│        │               │               │               │          │
│        └───────────┬────┴───────┬───────┘               │          │
│                    ▼            ▼                        ▼          │
│              ┌──────────────────────────────────────────────┐      │
│              │         SSAS — Cubos OLAP                    │      │
│              │   (Mínimo 1 cubo por datamart = 4 cubos)     │      │
│              └──────────────────┬───────────────────────────┘      │
│                                 │                                   │
│              ┌──────────────────▼───────────────────────────┐      │
│              │         Power BI — Dashboards                │      │
│              │   (Mínimo 1 dashboard por datamart = 4)      │      │
│              └──────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Fuentes de Datos del Data Warehouse

El DW se alimenta de **4 fuentes heterogéneas**:

| #   | Fuente                        | Motor         | Estado           | Uso en Datamarts                                                                                       |
| --- | ----------------------------- | ------------- | ---------------- | ------------------------------------------------------------------------------------------------------ |
| 1   | **eSports Platform (Oracle)** | Oracle 21c XE | ✅ Completa      | Fuente principal: transacciones, torneos, usuarios, tienda, estadísticas, auditoría. 40 tablas, ~1,800 registros. |
| 2   | **RRHH Transaccional**        | SQL Server    | ✅ Script listo  | Empleados responsables de regiones (DM1), personal de soporte/seguridad (DM4). 11 tablas.              |
| 3   | **MongoDB**                   | MongoDB       | ❌ Por construir | Logs de actividad de usuarios (DM2), feedback/reseñas de torneos (DM3).                                |
| 4   | **Archivo Excel**             | Excel (.xlsx) | ❌ Por crear     | Metas de venta/presupuestos (DM1), lista negra de países/dominios (DM4).                               |

### 3.1 Detalle: Base de Datos Oracle (eSports Platform)

**39 tablas** distribuidas así:

#### Tablas Catálogo (15 tablas)

| Tabla                         | Registros aprox. |
| ----------------------------- | ---------------- |
| `CATALOGO_AVATAR`             | 70               |
| `CATALOGO_ESTADO_AMISTAD`     | 4                |
| `CATALOGO_ESTADO_INSCRIPCION` | 4                |
| `CATALOGO_ESTADO_TORNEO`      | 4                |
| `CATALOGO_GENERO`             | 4                |
| `CATALOGO_ORIGEN_TRANSACCION` | 7                |
| `CATALOGO_PLATAFORMA`         | 14               |
| `CATALOGO_REGION`             | 15               |
| `CATALOGO_ROL`                | 3                |
| `CATALOGO_TIPO_ENTRADA`       | 4                |
| `CATALOGO_TIPO_ITEM`          | 5                |
| `CATALOGO_TIPO_TORNEO`        | 5                |
| `CATALOGO_TRANSACCION_TIPO`   | 4                |
| `MEMBRESIA_TIPO`              | 5                |
| `LOGRO`                       | varios           |

#### Tablas Transaccionales (24 tablas)

| Tabla                        | Área         |
| ---------------------------- | ------------ |
| `PERSONA`                    | Usuarios     |
| `USUARIO`                    | Usuarios     |
| `EQUIPO`                     | Equipos      |
| `EQUIPO_MIEMBROS`            | Equipos      |
| `JUEGO`                      | Gaming       |
| `JUEGO_PLATAFORMAS`          | Gaming (M:N) |
| `MODO_JUEGO`                 | Gaming       |
| `TIENDA_ITEM`                | Tienda       |
| `TIENDA_ORDEN`               | Tienda       |
| `TIENDA_SOLICITUD_SOPORTE`   | Tienda       |
| `TORNEO`                     | Torneos      |
| `TORNEO_INSCRIPCION`         | Torneos      |
| `TORNEO_PREMIOS`             | Torneos      |
| `TORNEO_REDES`               | Torneos      |
| `TORNEO_RESULTADOS`          | Torneos      |
| `TRANSACCION`                | Financiero   |
| `USUARIO_AMIGOS`             | Social       |
| `USUARIO_CUENTA_JUEGO`       | Gaming       |
| `USUARIO_ESTADISTICAS_JUEGO` | Gaming       |
| `USUARIO_LOGROS`             | Gamificación |
| `USUARIO_MEMBRESIAS`         | Membresías   |
| `USUARIO_RED_SOCIAL`         | Social       |
| `USUARIO_SEGUIDORES`         | Social       |
| `USUARIO_TROFEOS`            | Gamificación |

#### Objetos PL/SQL (52 funciones en 5 paquetes)

| Paquete       | Funciones   | Área                                                                 |
| ------------- | ----------- | -------------------------------------------------------------------- |
| `PKG_ESPORTS` | 5 SP + 2 FN | Core (registro, inscripción, compra, estadísticas, finalizar torneo) |
| `PKG_TIENDA`  | 10 FN       | Tienda (catálogo, órdenes, pago PayPal, soporte)                     |
| `PKG_PERFIL`  | 10 FN       | Perfil de usuario (datos, amigos, trofeos, logros)                   |
| `PKG_TORNEO`  | 9 FN        | Torneos (CRUD, estados, redes sociales)                              |
| `PKG_CONFIG`  | 16 FN       | Configuración de usuario (personal, social, juegos, seguridad)       |

#### Triggers (6)

- Auditoría de cambios
- Timestamps automáticos
- Validaciones de negocio
- Actualización de fondo de premios (`TRG_ACTUALIZAR_FONDO_PREMIOS`)

### 3.2 Detalle: Base de Datos RRHH (SQL Server)

La BD `RRHH_Transaccional` contiene **11 tablas**:

```
RRHH_Transaccional
├── Departamento (idDepartamento, Nombre)
├── Empleado (idEmpleado, pnombre, snombre, papellido, direccion, telefono, celular, incrementoSueldo, idEmpleadoJefe FK, idDepartamento FK)
├── Cargo (idCargo, nombre, sueldoBase)
├── Cargo_empleado (idCargo FK, idEmpleado FK, fechaNombramiento)
├── Bono (idBono, fecha, monto, descripcion)
├── Planilla (idPlanilla, fechaEfectiva, fechaInicio, fechaFin)
├── Empleado_bono (Empleado_idEmpleado FK, Bono_idBono FK, Estado, Planilla_idPlanilla FK)
├── Anticipo (idAnticipo, fecha, descripcion, monto, idEmpleado FK, Estado, Planilla_idPlanilla FK)
├── TipoDeduccion (idTipoDeduccion, descripcion)
├── Deduccion (idDeduccion, fechaInicio, fechaFin, valor, TipoDeduccion FK, tipo [P-Porcentaje/M-Monto])
└── Deduccion_has_Empleado (Deduccion FK, Empleado FK, Fecha, Estado, Planilla FK)
    Empleado_has_Planilla (Empleado FK, Planilla FK)
```

**Relaciones clave:**

- `Empleado` tiene auto-referencia para jerarquía (`idEmpleadoJefe`)
- `Empleado` pertenece a un `Departamento`
- `Cargo_empleado` es la asignación M:N de cargos a empleados con fecha
- `Empleado_bono` asocia bonos a empleados dentro de una planilla
- `Anticipo` y `Deduccion_has_Empleado` representan movimientos financieros por planilla

### 3.3 MongoDB — Base de Datos `esports_analytics`

Dos colecciones alineadas a los datamarts 2 y 3:

#### Colección: `logs_actividad` (Datamart 2 — Comportamiento del Usuario)

Registra eventos/acciones que los usuarios realizan en la plataforma. Datos semiestructurados que no caben en tablas fijas.

```json
{
  "_id": ObjectId,
  "oracle_usuario_id": 42,
  "tipo_evento": "perfil_visitado",   // login, busqueda, perfil_visitado, clic_torneo, compra_inicio, etc.
  "detalle": {
    "perfil_visitado_id": 15,
    "tiempo_visualizacion_seg": 35,
    "desde_seccion": "ranking"
  },
  "ip": "190.100.50.22",
  "user_agent": "Mozilla/5.0...",
  "pais_origen": "Honduras",
  "timestamp": ISODate("2026-03-15T14:30:00Z")
}
```

**Tipos de evento sugeridos:** `login`, `logout`, `busqueda`, `perfil_visitado`, `clic_torneo`, `clic_tienda`, `cambio_config`, `envio_solicitud_amistad`

**Relación con Oracle:** Campo `oracle_usuario_id` → `USUARIO.ID` en Oracle.

#### Colección: `feedback_torneos` (Datamart 3 — Calidad de Torneos)

Reseñas y comentarios que los usuarios dejan al terminar un torneo.

```json
{
  "_id": ObjectId,
  "oracle_torneo_id": 5,
  "oracle_usuario_id": 42,
  "calificacion": 4,               // 1 a 5 estrellas
  "comentario": "Buen torneo, pero el matchmaking fue lento",
  "tags": ["buen_premio", "lag", "buena_organizacion"],
  "recomendaria": true,
  "timestamp": ISODate("2026-03-20T18:00:00Z")
}
```

**Relación con Oracle:** `oracle_torneo_id` → `TORNEO.ID`, `oracle_usuario_id` → `USUARIO.ID`.

### 3.4 Archivo Excel — `DW_Fuentes_Excel.xlsx`

Dos hojas alineadas a los datamarts 1 y 4:

#### Hoja 1: `Presupuestos_Ventas` (Datamart 1 — Ingresos y Monetización)

Metas mensuales de venta por región y categoría de producto.

| Columna              | Tipo       | Ejemplo                |
| -------------------- | ---------- | ---------------------- |
| `anio`               | INT        | 2026                   |
| `mes`                | INT        | 3                      |
| `region`             | VARCHAR    | LATAM                  |
| `categoria_producto` | VARCHAR    | creditos / membresia / servicio |
| `meta_ingresos_usd`  | DECIMAL    | 5000.00                |
| `meta_transacciones` | INT        | 200                    |
| `responsable_rrhh_id`| INT        | 3 (FK → Empleado.idEmpleado en RRHH) |

**Relación con RRHH:** `responsable_rrhh_id` → `Empleado.idEmpleado` en SQL Server.  
**Relación con Oracle:** `region` se mapea a `CATALOGO_REGION.VALOR`, `categoria_producto` a `CATALOGO_TIPO_ITEM.VALOR`.

#### Hoja 2: `Lista_Negra` (Datamart 4 — Seguridad y Auditoría)

Países restringidos y dominios de correo prohibidos.

| Columna            | Tipo    | Ejemplo           |
| ------------------ | ------- | ----------------- |
| `tipo`             | VARCHAR | pais / dominio    |
| `valor`            | VARCHAR | Corea del Norte / tempmail.com |
| `motivo`           | VARCHAR | Sanciones internacionales / Correo temporal |
| `fecha_agregado`   | DATE    | 2026-01-15        |
| `activo`           | INT     | 1                 |

### 3.5 Mapa de Relaciones entre Fuentes

Las 4 fuentes se conectan mediante claves compartidas:

```
ORACLE (eSports)                RRHH (SQL Server)
┌──────────────┐                ┌──────────────────┐
│ USUARIO.ID   │◄──────────────►│                  │
│ PERSONA.PAIS │                │ Empleado         │
│ CATALOGO_    │                │   .idEmpleado ◄──┼── Excel.responsable_rrhh_id
│   REGION     │◄──────────────►│   .idDepto       │
│ TORNEO.ID    │                │ Departamento     │
│ AUDITORIA_LOG│                │ Cargo            │
└──────┬───────┘                └──────────────────┘
       │
       │ oracle_usuario_id / oracle_torneo_id
       │
┌──────▼───────┐                ┌──────────────────┐
│ MongoDB      │                │ Excel (.xlsx)    │
│              │                │                  │
│ logs_actividad│               │ Presupuestos:    │
│  .oracle_    │                │  .region ◄───────┼── Oracle.CATALOGO_REGION
│   usuario_id │                │  .categoria ◄────┼── Oracle.CATALOGO_TIPO_ITEM
│              │                │  .responsable_   │
│ feedback_    │                │   rrhh_id ◄──────┼── RRHH.Empleado.idEmpleado
│  torneos     │                │                  │
│  .oracle_    │                │ Lista_Negra:     │
│   torneo_id  │                │  .valor ◄────────┼── Oracle.PERSONA.PAIS / .CORREO
│  .oracle_    │                │                  │
│   usuario_id │                └──────────────────┘
└──────────────┘
```

**Cambios necesarios en las BDD existentes:** Ninguno. Oracle y RRHH no necesitan modificaciones. Las relaciones son lógicas (por valor de campo), no por FK físicas entre motores.

---

## 4. Herramientas y Software Requerido

### Instalaciones Obligatorias

| #   | Software                                            | Componentes/Notas                                                                                                                                                                                                           |
| --- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **SQL Server** (Developer Edition, gratis vía UNAH) | • Database Engine<br>• SQL Server Analysis Services (SSAS)<br>• SQL Server Reporting Services (SSRS)<br>• SQL Server Integration Services (SSIS)                                                                            |
| 2   | **SQL Server Management Studio (SSMS)**             | Probar conexión con DB Engine y SSAS                                                                                                                                                                                        |
| 3   | **Oracle Database** (21c XE)                        | Ya instalado — base OLTP migrada                                                                                                                                                                                            |
| 4   | **SQL Developer**                                   | Probar conexión con Oracle                                                                                                                                                                                                  |
| 5   | **Visual Studio 2017/2019/2022**                    | Con complementos:<br>• SQL Server Data Tools (SSDT)<br>• Oracle Data Provider for .NET (ODP.NET) o Oracle OLE DB Provider<br>• Al crear proyecto deben aparecer: Integration Services, Analysis Services (Multidimensional) |
| 6   | **Power BI Desktop**                                | Para dashboards finales                                                                                                                                                                                                     |

### Verificaciones Post-Instalación

- [ ] SSMS se conecta al Database Engine de SQL Server
- [ ] SSMS se conecta a SSAS (Analysis Services)
- [ ] SQL Developer se conecta a Oracle 21c XE (`ESPORTS_APP / Esports2026` en `XEPDB1`)
- [ ] Visual Studio muestra plantillas de Integration Services al crear nuevo proyecto
- [ ] Visual Studio muestra plantillas de Analysis Services (Multidimensional) al crear nuevo proyecto
- [ ] ODP.NET o Oracle OLE DB Provider están disponibles como conexión en SSIS

---

## 5. Estado Actual del Proyecto OLTP

### Componentes Completos ✅

| Componente       | Estado                                  | Detalle                                                                   |
| ---------------- | --------------------------------------- | ------------------------------------------------------------------------- |
| Frontend Next.js | ✅ Completo                             | App completa con SSR, autenticación, tienda, torneos, perfil, admin panel |
| Backend NestJS   | ✅ Funcional (PG), 🔄 Migrando (Oracle) | 40 módulos, TypeORM, JWT auth, PayPal, uploads                            |
| PostgreSQL DDL   | ✅ Completo                             | 39 tablas con seeders                                                     |
| Oracle DDL/DML   | ✅ Completo                             | Script Maestro con 39 tablas, ~1,800 registros                            |
| Oracle PL/SQL    | ✅ Completo                             | 5 paquetes con 52 funciones/procedimientos                                |
| Oracle Triggers  | ✅ Completo                             | 6 triggers + tabla auditoría                                              |
| Oracle Vistas    | ✅ Completo                             | 6 vistas de reportes                                                      |
| Docker Compose   | ✅ Completo                             | PostgreSQL 16 + Backend + Frontend + pgAdmin                              |

### Componentes En Progreso 🔄

| Componente                 | Estado           | Detalle                                                                                                                                                          |
| -------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Entidades TypeORM → Oracle | 🔄 Casi completo | Todas las entidades ya usan `PrimaryGeneratedColumn('increment')` en vez de UUID. Tipos `boolean` ya cambiados a `number`.                                       |
| Servicios NestJS → Oracle  | 🔄 Parcial       | Se creó `OracleFunctionHelper` para abstracción. 5 servicios migrados (tienda-orden, tienda-solicitud, perfil-usuario, configuración-usuario, torneo-funciones). |
| DTOs → Oracle              | 🔄 Parcial       | Algunos DTOs ya cambiados de `boolean` a `number` (catalogo-avatar, torneo, usuario, usuario-membresia).                                                         |

### Componentes Pendientes ❌

| Componente                  | Estado           |
| --------------------------- | ---------------- |
| Data Warehouse (SQL Server) | ❌ Por construir |
| MongoDB (fuente adicional)  | ❌ Por construir |
| Excel (fuente adicional)    | ❌ Por crear     |
| SSIS ETL Packages           | ❌ Por construir |
| SSAS Cubos OLAP             | ❌ Por construir |
| Power BI Dashboards         | ❌ Por construir |

---

## 6. Estado de la Migración Backend (NestJS → Oracle)

### Lo que ya se hizo (conversación anterior):

1. **`OracleFunctionHelper`** — Helper de abstracción creado en `backend/src/common/helpers/oracle-function.helper.ts`. Detecta automáticamente si el motor es PostgreSQL u Oracle y genera la sintaxis SQL adecuada.

2. **Entidades TypeORM** — Todas migradas de `@PrimaryGeneratedColumn('uuid')` a `@PrimaryGeneratedColumn('increment')` con `id: number`. Los tipos `boolean` se cambiaron a `type: 'number', precision: 1`.

3. **Servicios con SQL directo** — 5 de ~5 servicios con queries SQL directas migrados a usar el helper.

4. **DTOs** — Algunos actualizados de `boolean` → `number` para compatibilidad Oracle.

5. **Compilación** — `npx tsc --noEmit` reportaba 0 errores al final de la sesión anterior.

### Lo que falta para terminar la migración:

- Posibles ajustes menores en servicios CRUD que usen filtros con `boolean`
- Pruebas de integración reales con Oracle XE corriendo
- Docker Compose para Oracle (opcional)

### Configuración Oracle en app.module.ts

```typescript
if (dbType === "oracle") {
  return {
    type: "oracle",
    host: dbHost,
    port: +configService.get("DB_PORT") || 1521,
    serviceName: configService.get("DB_SERVICE_NAME") || "XEPDB1",
    username: configService.get("DB_USERNAME"),
    password: configService.get("DB_PASSWORD"),
    synchronize: false, // Oracle no debe usar synchronize
  };
}
```

Para activar Oracle, usar en `.env`:

```env
DB_TYPE=oracle
DB_HOST=localhost
DB_PORT=1521
DB_SERVICE_NAME=XEPDB1
DB_USERNAME=ESPORTS_APP
DB_PASSWORD=Esports2026
```

---

## 7. Esquema de la Base de Datos RRHH (SQL Server)

Archivo: `backend/src/database/scripts/base-rrhh.sql`

```sql
-- Base de datos: RRHH_Transaccional (SQL Server)
-- 11 tablas

Departamento (idDepartamento INT PK, Nombre VARCHAR(45))
Empleado (idEmpleado INT IDENTITY PK, pnombre, snombre, papellido, direccion, telefono, celular, incrementoSueldo DECIMAL, idEmpleadoJefe FK→Empleado, idDepartamento FK→Departamento)
Cargo (idCargo INT IDENTITY PK, nombre VARCHAR(45), sueldoBase DECIMAL)
Cargo_empleado (idCargo FK, idEmpleado FK, fechaNombramiento DATE) — PK compuesta
Bono (idBono INT PK, fecha DATE, monto DECIMAL, descripcion)
Planilla (idPlanilla INT PK, fechaEfectiva DATE, fechaInicio DATE, fechaFin DATE)
Empleado_bono (Empleado_idEmpleado FK, Bono_idBono FK, Estado VARCHAR(1), Planilla_idPlanilla FK) — PK compuesta
Anticipo (idAnticipo INT PK, fecha DATE, descripcion, monto DECIMAL, idEmpleado FK, Estado, Planilla_idPlanilla FK)
TipoDeduccion (idTipoDeduccion INT PK, descripcion)
Deduccion (idDeduccion INT PK, fechaInicio DATE, fechaFin DATE, valor DECIMAL, TipoDeduccion FK, tipo VARCHAR(1) [P/M])
Deduccion_has_Empleado (Deduccion FK, Empleado FK, Fecha DATE, Estado, Planilla FK) — PK compuesta
Empleado_has_Planilla (Empleado FK, Planilla FK) — PK compuesta
```

**NOTA**: Esta base de datos ya está en SQL Server, por lo tanto es la fuente más directa para el DW (no necesita driver externo en SSIS, solo conexión nativa).

---

## 8. Plan de Construcción del Data Warehouse

### Paso 1: Diseño del Modelo Dimensional — 4 Datamarts

---

#### Datamart 1: **Ingresos y Monetización** (El "Core")

> Analiza de dónde viene el dinero: Tienda, Membresías, Inscripciones a torneos.

**Fuentes involucradas:** Oracle (principal) + Excel (metas) + SQL Server RRHH (responsable de región)

**Tablas Oracle usadas:**
- `TRANSACCION` → monto, tipo_id, origen_id, usuario_id, creado_en
- `TIENDA_ORDEN` → monto, estado, item_id, usuario_id, divisa, creado_en, completado_en
- `TIENDA_ITEM` → nombre, precio, tipo_id, creditos_otorgados
- `USUARIO_MEMBRESIAS` → fecha_inicio, fecha_fin, activa, membresia_tipo_id
- `MEMBRESIA_TIPO` → nombre, precio, duracion_dias
- `TORNEO_INSCRIPCION` → torneo_id, usuario_id, estado_id, fecha
- `TORNEO_PREMIOS` → cuota, fondo_total, comision_total
- `CATALOGO_TIPO_ITEM` → valor (creditos, membresia, servicio, avatar, banner)
- `CATALOGO_TRANSACCION_TIPO` → valor (saldo, creditos, premio, inscripcion)
- `CATALOGO_ORIGEN_TRANSACCION` → valor (compra, premio, reembolso, etc.)
- `CATALOGO_REGION` → valor (LATAM, Norte America, etc.)
- `PERSONA` → pais, divisa
- `USUARIO` → saldo, creditos

**Excel usado:** Hoja `Presupuestos_Ventas` → metas de ingresos por región y categoría  
**RRHH usado:** `Empleado` + `Departamento` → responsable de la región de venta

**Tabla de hechos:** `FACT_INGRESOS`
- Métricas: monto_real, meta_ingresos, variacion_meta, cantidad_transacciones, creditos_otorgados
- Granularidad: por transacción/orden individual

**Dimensiones:** DIM_TIEMPO, DIM_REGION, DIM_TIPO_ITEM, DIM_ORIGEN_TRANSACCION, DIM_USUARIO, DIM_RESPONSABLE_RRHH

**Objetivo:** Comparar ventas reales vs. metas del Excel por región y categoría.

---

#### Datamart 2: **Comportamiento del Usuario y Gaming** (Social)

> Analiza cómo interactúan los usuarios: amigos, seguidores, XP, actividad en la plataforma.

**Fuentes involucradas:** Oracle (principal) + MongoDB (logs de actividad)

**Tablas Oracle usadas:**
- `USUARIO` → xp, saldo, creditos, estado, creado_en, ultima_conexion
- `USUARIO_AMIGOS` → usuario1_id, usuario2_id, estado_id, creado_en
- `USUARIO_SEGUIDORES` → seguidor_id, seguido_id, creado_en
- `USUARIO_ESTADISTICAS_JUEGO` → victorias, derrotas, empates, horas_jugadas, nivel_rango
- `USUARIO_LOGROS` → logro_id, fecha
- `USUARIO_TROFEOS` → tipo_trofeo, ganado_en, torneo_id
- `CATALOGO_ESTADO_AMISTAD` → valor (pendiente, aceptado, rechazado, bloqueado)
- `LOGRO` → nombre, descripcion
- `JUEGO` → nombre
- `TORNEO_RESULTADOS` → posicion, torneo_id, usuario_id

**MongoDB usado:** Colección `logs_actividad` → tipo_evento, tiempo_visualizacion, pais_origen, timestamp

**Tabla de hechos:** `FACT_ACTIVIDAD_USUARIO`
- Métricas: total_amigos, total_seguidores, xp_acumulado, logins_periodo, eventos_periodo, tiempo_en_plataforma, torneos_participados, victorias

**Dimensiones:** DIM_TIEMPO, DIM_USUARIO, DIM_JUEGO, DIM_TIPO_EVENTO, DIM_PAIS

**Objetivo:** Correlacionar si usuarios con más amigos/seguidores tienen más XP o crean más torneos.

---

#### Datamart 3: **Calidad de Torneos y Juegos**

> Analiza qué juegos y modos de juego son los más exitosos y mejor valorados.

**Fuentes involucradas:** Oracle (principal) + MongoDB (feedback/reseñas)

**Tablas Oracle usadas:**
- `TORNEO` → titulo, capacidad, cerrado, fecha_inicio_torneo, juego_id, modo_juego_id, region_id, tipo_entrada_id, tipo_torneo_id, estado_id
- `TORNEO_INSCRIPCION` → estado_id (confirmada, cancelada, etc.)
- `TORNEO_PREMIOS` → cuota, fondo_total, comision_porcentaje, fondo_despues_comision
- `TORNEO_RESULTADOS` → posicion, usuario_id
- `JUEGO` → nombre
- `MODO_JUEGO` → nombre, juego_id
- `CATALOGO_TIPO_TORNEO` → valor (eliminacion_simple, doble, todos_contra_todos, grupos, suizo)
- `CATALOGO_TIPO_ENTRADA` → valor (mando, teclado, todos, touch)
- `CATALOGO_ESTADO_TORNEO` → valor (proximamente, en_curso, terminado, cancelado)
- `CATALOGO_PLATAFORMA` → valor (PC, PS5, Xbox, etc.)
- `CATALOGO_REGION` → valor

**MongoDB usado:** Colección `feedback_torneos` → calificacion, tags, recomendaria, comentario

**Tabla de hechos:** `FACT_TORNEOS`
- Métricas: total_inscritos, inscritos_confirmados, fondo_premios, comision, calificacion_promedio, pct_recomendacion, tasa_llenado (inscritos/capacidad)

**Dimensiones:** DIM_TIEMPO, DIM_JUEGO, DIM_MODO_JUEGO, DIM_REGION, DIM_TIPO_TORNEO, DIM_PLATAFORMA, DIM_TIPO_ENTRADA

**Objetivo:** Identificar qué combinaciones juego/modo atraen más usuarios y tienen mejores reseñas en MongoDB.

---

#### Datamart 4: **Seguridad y Auditoría Administrativa**

> Analiza registros de seguridad, auditoría del sistema, y gestión administrativa.

**Fuentes involucradas:** Oracle (principal) + SQL Server RRHH (personal de soporte) + Excel (lista negra)

**Tablas Oracle usadas:**
- `AUDITORIA_LOG` → tabla, operacion, registro_id, usuario_bd, detalle, fecha
- `USUARIO` → nickname, estado (activo/suspendido/baneado), creado_en
- `PERSONA` → correo, pais, ciudad
- `TIENDA_SOLICITUD_SOPORTE` → tipo, estado, creado_en, resuelto_en, resuelto_por, usuario_id
- `CATALOGO_ROL` → valor (admin, usuario, moderador)

**RRHH usado:** `Empleado` + `Cargo` + `Departamento` → personal de Soporte Técnico o Seguridad (nombre, turno, cargo)
**Excel usado:** Hoja `Lista_Negra` → países restringidos y dominios de correo prohibidos

**Tabla de hechos:** `FACT_AUDITORIA`
- Métricas: total_eventos, registros_nuevos, intentos_login, solicitudes_soporte, tickets_resueltos, registros_pais_restringido

**Dimensiones:** DIM_TIEMPO, DIM_OPERACION, DIM_TABLA_AUDITADA, DIM_EMPLEADO_SOPORTE, DIM_PAIS, DIM_ROL_USUARIO

**Objetivo:** Cruzar quién de RRHH atendió un reporte, validar si registros vienen de países permitidos según el Excel.

---

### Paso 2: ETL con SSIS (Integration Services)

| Fuente            | Conexión en SSIS                        | Datamarts que alimenta |
| ----------------- | --------------------------------------- | ---------------------- |
| Oracle 21c XE     | ODP.NET o Oracle OLE DB Provider        | DM1, DM2, DM3, DM4    |
| SQL Server (RRHH) | ADO.NET nativo (misma instancia)        | DM1, DM4               |
| MongoDB           | MongoDB ODBC Driver o export JSON→CSV   | DM2, DM3               |
| Excel (.xlsx)     | Excel Source nativo en SSIS             | DM1, DM4               |

**Paquetes SSIS sugeridos:**

1. `ETL_DIM_Tiempo.dtsx` — Genera dimensión tiempo programáticamente
2. `ETL_DM1_Ingresos.dtsx` — Oracle (transacciones, órdenes, membresías) + Excel (presupuestos) + RRHH (responsables)
3. `ETL_DM2_Comportamiento.dtsx` — Oracle (amigos, seguidores, estadísticas, logros) + MongoDB (logs_actividad)
4. `ETL_DM3_Torneos.dtsx` — Oracle (torneos, inscripciones, resultados, premios) + MongoDB (feedback_torneos)
5. `ETL_DM4_Auditoria.dtsx` — Oracle (auditoria_log, usuarios, soporte) + RRHH (empleados soporte) + Excel (lista negra)

### Paso 3: Cubos OLAP con SSAS (Analysis Services)

1. `Cubo_Ingresos` — Basado en FACT_INGRESOS → análisis de ventas vs metas por región
2. `Cubo_Comportamiento` — Basado en FACT_ACTIVIDAD_USUARIO → análisis social y de engagement
3. `Cubo_Torneos` — Basado en FACT_TORNEOS → análisis de calidad y popularidad por juego/modo
4. `Cubo_Auditoria` — Basado en FACT_AUDITORIA → análisis de seguridad y gestión administrativa

### Paso 4: Dashboards con Power BI

1. **Dashboard Ingresos**: Ventas reales vs metas Excel, ingresos por región, tipo de producto, tendencias mensuales
2. **Dashboard Comportamiento**: Correlación amigos↔XP, top usuarios activos, mapa de calor de actividad (MongoDB)
3. **Dashboard Torneos**: Juegos más populares, tasa de llenado, calificación promedio (MongoDB), premios distribuidos
4. **Dashboard Auditoría**: Eventos por tipo, registros de países restringidos (Excel), tickets resueltos por empleado RRHH

### Paso 5: Exportar Excel desde Analysis Services

Desde SSMS conectado a SSAS:

- Navegar a cada cubo
- Exportar los datos procesados a Excel
- Este es un entregable específico

---

## 9. Entregables Finales

| #   | Entregable                        | Formato            | Notas                                        |
| --- | --------------------------------- | ------------------ | -------------------------------------------- |
| 1   | **Excel exportado de SSAS**       | `.xlsx`            | Todos los cubos generados exportados         |
| 2   | **Proyecto Integration Services** | `.dtsx` / `.ispac` | Paquetes ETL en Visual Studio                |
| 3   | **Proyecto Analysis Services**    | `.dwproj`          | Cubos OLAP Multidimensionales                |
| 4   | **Mínimo 4 datamarts**            | SQL Server tables  | Esquema estrella con hechos y dimensiones    |
| 5   | **Mínimo 4 cubos OLAP**           | SSAS               | 1 cubo por datamart                          |
| 6   | **Proyecto Power BI**             | `.pbix`            | Export del proyecto completo                 |
| 7   | **Mínimo 4 dashboards**           | Power BI           | 1 dashboard por datamart                     |
| 8   | **Documento PDF explicativo**     | `.pdf`             | Descripción de todos los dashboards/gráficos |

---

## 10. Estructura de Archivos del Proyecto

```
esports-platform/
├── .env                                    ← Variables de entorno (PG por defecto)
├── docker-compose.yml                      ← Docker: PostgreSQL + Backend + Frontend + pgAdmin
│
├── backend/                                ← API NestJS
│   ├── src/
│   │   ├── app.module.ts                  ← Soporte dual PostgreSQL/Oracle
│   │   ├── common/
│   │   │   ├── guards/                    ← JWT + Roles guards
│   │   │   └── helpers/
│   │   │       └── oracle-function.helper.ts  ← Helper para llamar funciones PG/Oracle
│   │   ├── database/
│   │   │   ├── scripts/
│   │   │   │   ├── base-rrhh.sql          ← ⭐ Script RRHH para SQL Server
│   │   │   │   ├── database.sql           ← DDL PostgreSQL original
│   │   │   │   └── ... (otros scripts SQL)
│   │   │   └── seeds/                     ← Seeders TypeORM (solo PostgreSQL)
│   │   └── modules/                       ← 40 módulos NestJS
│   │       ├── auth/                      ← Autenticación JWT
│   │       ├── usuario/                   ← Usuarios + Perfil + Configuración
│   │       ├── torneo/                    ← Torneos + Funciones PL/SQL
│   │       ├── tienda/                    ← Tienda + Órdenes + Soporte
│   │       ├── equipo/                    ← Equipos + Miembros
│   │       ├── juego/                     ← Juegos + Plataformas + Modos
│   │       ├── catalogo-*/                ← 14 módulos de catálogos
│   │       └── usuario-*/                 ← 9 módulos de relaciones usuario
│   └── package.json                       ← oracledb ^6.3.0 instalado
│
├── frontend/                               ← Next.js App
│   ├── app/                               ← App Router de Next.js
│   ├── components/                        ← Componentes React
│   └── ...
│
├── Script Maestro Oracle/                  ← ⭐ Entrega Oracle OLTP
│   ├── README.md                          ← Documentación completa de la migración
│   └── BD/
│       ├── DO/
│       │   ├── RUN.sql                    ← Script maestro (ejecutar como SYS)
│       │   ├── DDL/                       ← 01_USUARIOS_ROLES, 02_SECUENCIAS, 03_TABLAS
│       │   ├── DML/                       ← 01_CATALOGOS, 02_DATOS_MASIVOS
│       │   ├── VIEW/                      ← 01_VISTAS (6 vistas)
│       │   ├── PACKAGE/                   ← PKG_ESPORTS (SPEC+BODY) + 4 más
│       │   └── TRIGGER/                   ← 01_TRIGGERS (6 triggers)
│       └── UNDO/
│           └── DDL/DROP_ALL.sql           ← Limpieza completa
│
├── Script Maestro (RUN)/                   ← Scripts PostgreSQL originales
│
├── DataWarehouse/                          ← ⭐ POR CREAR - Proyecto DW
│   ├── SQL/                               ← Scripts DDL del DW (staging, dimensiones, hechos)
│   ├── SSIS/                              ← Proyecto Integration Services (5 paquetes .dtsx)
│   ├── SSAS/                              ← Proyecto Analysis Services (4 cubos OLAP)
│   ├── PowerBI/                           ← Archivos .pbix (4 dashboards)
│   ├── Excel/
│   │   ├── DW_Fuentes_Excel.xlsx          ← ⭐ FUENTE: Presupuestos_Ventas + Lista_Negra
│   │   └── Exports_SSAS/                  ← Exports de cubos desde SSAS
│   ├── MongoDB/
│   │   └── init_esports_analytics.js      ← Script para crear colecciones + datos de prueba
│   └── Docs/                              ← Documento PDF con dashboards
│
└── postgres-init/                          ← Scripts de inicialización Docker PostgreSQL
```

---

## 11. Notas Importantes y Restricciones

### ⚠️ Sobre SQL Server

- La versión de SQL Server **debe tener SSAS, SSRS y SSIS**. No todas las versiones los incluyen.
- La **SQL Server Developer Edition** (gratuita para estudiantes) incluye todos estos componentes.
- Se puede obtener gratis a través del software académico de la UNAH.

### ⚠️ Sobre Visual Studio

- Debe ser **2017, 2019 o 2022**.
- Los complementos **SSDT** (SQL Server Data Tools) deben instalarse por separado desde el instalador de Visual Studio (Workloads → Data storage and processing).
- **ODP.NET** se instala con Oracle Data Access Components (ODAC).
- Al crear un nuevo proyecto, deben aparecer las plantillas:
  - "Integration Services Project"
  - "Analysis Services Multidimensional and Data Mining Project"

### ⚠️ Sobre las Fuentes de Datos

- **Oracle → SQL Server**: Requiere ODP.NET o Oracle OLE DB Provider configurado como proveedor de conexión en SSIS.
- **MongoDB → SQL Server**: Puede requerir un driver ODBC para MongoDB, o extraer a CSV/JSON intermedio y luego cargar a staging con SSIS.
- **Excel → SQL Server**: Soporte nativo en SSIS con Excel Source.
- **SQL Server RRHH → DW**: Conexión nativa (misma instancia).
- **PostgreSQL NO se usa** como fuente del DW. Solo Oracle, RRHH (SQL Server), MongoDB y Excel.

### ⚠️ Sobre la Migración Backend

- La migración de decoradores TypeORM (UUID → increment, boolean → number) **ya está prácticamente completa**.
- Todas las entidades ya usan `@PrimaryGeneratedColumn('increment')` con `id: number`.
- No quedan tipos `boolean` en las entidades.
- La compilación TypeScript (`tsc --noEmit`) pasaba sin errores en la última sesión.
- Para el DW, **no es estrictamente necesario** que el backend NestJS funcione con Oracle — el DW puede extraer datos directamente de Oracle con SSIS.

### ⚠️ Sobre Datos

- Las tablas Oracle ya tienen ~1,800 registros generados con bloques anónimos PL/SQL.
- La BD RRHH necesita ser poblada con datos de prueba (INSERT INTO con al menos 20-50 registros por tabla transaccional).
- MongoDB y Excel aún no tienen datos.

---

## 📌 Referencia Rápida de Conexiones

```
┌─────────────────────────────────────────────────────────────────┐
│ Oracle 21c XE                                                    │
│   Host: localhost | Port: 1521 | Service: XEPDB1                │
│   User: ESPORTS_APP | Pass: Esports2026                         │
│   Tablespace: TBS_ESPORTS                                       │
├─────────────────────────────────────────────────────────────────┤
│ SQL Server (RRHH)                                                │
│   Host: localhost | Instance: (default o named)                  │
│   DB: RRHH_Transaccional | Auth: Windows Auth o sa               │
├─────────────────────────────────────────────────────────────────┤
│ SQL Server (Data Warehouse)                                      │
│   Host: localhost | Instance: (misma que RRHH)                   │
│   DB: DW_ESPORTS (por crear) | Auth: Windows Auth o sa          │
├─────────────────────────────────────────────────────────────────┤
│ MongoDB                                                          │
│   Host: localhost | Port: 27017 | DB: esports_analytics          │
│   Colecciones: logs_actividad, feedback_torneos                  │
├─────────────────────────────────────────────────────────────────┤
│ NestJS Backend                                                   │
│   URL: http://localhost:3001 | Auth: JWT Bearer Token            │
├─────────────────────────────────────────────────────────────────┤
│ Next.js Frontend                                                 │
│   URL: http://localhost:3000                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

_Documento generado para proporcionar contexto completo a agentes de IA que trabajen en cualquier parte de este proyecto._

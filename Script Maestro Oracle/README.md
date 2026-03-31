# 🎮 Plataforma eSports - Script Maestro Oracle

## Autor

**Eduardo Valenzuela**  
Fecha: Marzo 2026

---

## 📋 Descripción

Este directorio contiene el **Script Maestro** para crear la base de datos OLTP de la Plataforma eSports en **Oracle Database**. Es un entregable independiente del sistema de producción (que usa PostgreSQL + NestJS + Next.js).

La base de datos modela una plataforma de eSports con gestión de usuarios, torneos, tienda virtual, estadísticas de juego, equipos, logros, y más.

---

## 📁 Estructura de Archivos

```
Script Maestro Oracle/
├── README.md                          ← Este archivo
├── BD/
│   ├── DO/                            ← Scripts de instalación
│   │   ├── RUN.sql                    ← SCRIPT MAESTRO (ejecutar este)
│   │   ├── DDL/
│   │   │   ├── 01_USUARIOS_ROLES.sql  ← Tablespace, usuario y roles Oracle
│   │   │   ├── 02_SECUENCIAS.sql      ← 40 secuencias para IDs
│   │   │   └── 03_TABLAS.sql          ← 39 tablas con FK/PK/CHECK
│   │   ├── DML/
│   │   │   ├── 01_CATALOGOS.sql       ← Inserts de catálogos (~200 registros)
│   │   │   └── 02_DATOS_MASIVOS.sql   ← Bloques anónimos PL/SQL (~1,600 reg.)
│   │   ├── VIEW/
│   │   │   └── 01_VISTAS.sql          ← 6 vistas de reportes
│   │   ├── PACKAGE/
│   │   │   ├── PKG_ESPORTS_SPEC.sql   ← Especificación del paquete
│   │   │   └── PKG_ESPORTS_BODY.sql   ← Cuerpo: 5 SPs + 2 funciones
│   │   └── TRIGGER/
│   │       └── 01_TRIGGERS.sql        ← 5 triggers + tabla auditoría
│   └── UNDO/                          ← Scripts de desinstalación
│       ├── RUN_UNDO.sql               ← Script maestro UNDO
│       └── DDL/
│           └── DROP_ALL.sql           ← Elimina todo dinámicamente
```

---

## 🚀 Cómo Ejecutar

### Requisitos

- Oracle Database (19c, 21c, o XE)
- SQL Developer o SQL\*Plus

### Instalación

1. Abrir **SQL Developer** conectado como `SYS` (SYSDBA)
2. Abrir el archivo `BD/DO/RUN.sql`
3. Ejecutar con **F5** (Run Script)
4. El log se genera en `!RUN_ESPORTS_2026.log`

### Desinstalación

1. Conectarse como `ESPORTS_APP`
2. Ejecutar `BD/UNDO/RUN_UNDO.sql`

---

## 📊 Resumen de Objetos

| Objeto     | Cantidad | Detalle                                                    |
| ---------- | -------- | ---------------------------------------------------------- |
| Tablespace | 1        | `TBS_ESPORTS`                                              |
| Usuario    | 1        | `ESPORTS_APP`                                              |
| Rol        | 1        | `ROL_ESPORTS_ADMIN`                                        |
| Secuencias | 40       | Una por tabla                                              |
| Tablas     | 40       | 15 catálogos + 24 transaccionales + 1 auditoría            |
| Vistas     | 6        | Perfil, Dashboard, Ventas, Ranking, Equipos, Transacciones |
| Paquetes   | 5        | Ver detalle abajo                                          |
| Triggers   | 6        | Auditoría, timestamps, validaciones, fondo premios         |
| Registros  | ~1,800   | Mínimo 50 por tabla transaccional                          |

### Paquetes PL/SQL

| Paquete       | Funciones | Descripción                           |
| ------------- | --------- | ------------------------------------- |
| `PKG_ESPORTS` | 5 SP + 2 FN | Paquete original con SPs y funciones |
| `PKG_TIENDA`  | 10 FN     | Funciones de tienda migradas de PostgreSQL |
| `PKG_PERFIL`  | 10 FN     | Funciones de perfil de usuario        |
| `PKG_TORNEO`  | 9 FN      | Funciones de gestión de torneos       |
| `PKG_CONFIG`  | 16 FN     | Funciones de configuración de usuario |

**Total: 52 funciones/procedimientos PL/SQL**

### Paquete PKG_ESPORTS (Original)

| Tipo | Nombre                       | Descripción                                            |
| ---- | ---------------------------- | ------------------------------------------------------ |
| SP   | `SP_REGISTRAR_USUARIO`       | Crea persona + usuario con manejo transaccional        |
| SP   | `SP_INSCRIBIR_EN_TORNEO`     | Inscribe usuario con validaciones de negocio           |
| SP   | `SP_PROCESAR_COMPRA`         | Procesa compra, actualiza saldo, registra transacción  |
| SP   | `SP_ACTUALIZAR_ESTADISTICAS` | MERGE (UPSERT) de estadísticas + cálculo de XP         |
| SP   | `SP_FINALIZAR_TORNEO`        | Cierra torneo, registra resultados, distribuye premios |
| FN   | `FN_CALCULAR_NIVEL`          | Retorna el nivel del usuario basado en su XP           |
| FN   | `FN_INGRESOS_TIENDA`         | Calcula ingresos totales en un rango de fechas         |

---

## ✅ Migración Completa de PostgreSQL a Oracle

La migración de las funciones PL/pgSQL a PL/SQL ha sido **completada**. Todos los componentes del proyecto original han sido portados a Oracle.

### Estado Actual vs Proyecto Completo

```
┌──────────────────────────────────┬─────────────┬─────────────────┐
│ Componente                       │ Script      │ Proyecto        │
│                                  │ Maestro     │ Original (PG)   │
├──────────────────────────────────┼─────────────┼─────────────────┤
│ Tablas DDL                       │ ✅ 39       │ 39              │
│ Seeds/Datos                      │ ✅ ~1,800   │ ~200 (seeders)  │
│ Secuencias                       │ ✅ 40       │ N/A (UUID)      │
│ Vistas                           │ ✅ 6        │ 0               │
│ Paquete Original (SP+FN)         │ ✅ 5SP+2FN  │ N/A             │
│ Triggers                         │ ✅ 6        │ 1               │
│ Funciones PL/pgSQL (Tienda)      │ ✅ 10 FN    │ 10 funciones    │
│ Funciones PL/pgSQL (Torneos)     │ ✅ 9 FN     │ 9 funciones     │
│ Funciones PL/pgSQL (Perfil)      │ ✅ 10 FN    │ 10 funciones    │
│ Funciones PL/pgSQL (Config)      │ ✅ 16 FN    │ 16 funciones    │
│ Trigger Fondo Premios            │ ✅          │ 1               │
│ Backend NestJS + TypeORM         │ ❌          │ 38 módulos      │
│ Frontend Next.js                 │ ❌          │ Completo        │
└──────────────────────────────────┴─────────────┴─────────────────┘
```

### Paso 1: Resolver el Problema de UUID

**Problema**: Tu backend usa `UUID v4` en todas las entidades TypeORM. Oracle no soporta UUID como tipo nativo de columna.

**Opciones de solución**:

#### Opción A: Usar `RAW(16)` en Oracle (Recomendada para compatibilidad)

```sql
-- Oracle puede almacenar UUIDs como RAW(16)
CREATE TABLE USUARIO (
    ID RAW(16) DEFAULT SYS_GUID() NOT NULL,
    ...
);
```

- `SYS_GUID()` genera un identificador único similar a UUID
- El formato es diferente (sin guiones), pero es convertible
- TypeORM puede configurarse con un `ValueTransformer` para convertir

#### Opción B: Usar `VARCHAR2(36)` en Oracle (Más simple)

```sql
CREATE TABLE USUARIO (
    ID VARCHAR2(36) DEFAULT LOWER(RAWTOHEX(SYS_GUID())) NOT NULL,
    ...
);
```

- Almacena el UUID como texto
- Más simple de manejar, pero menos eficiente
- No requiere transformaciones en el backend

#### Opción C: Mantener `NUMBER` (Solo Oracle, sin conectar al backend)

```sql
-- Lo que tenemos actualmente en el Script Maestro
CREATE TABLE USUARIO (
    ID NUMBER NOT NULL,
    ...
);
```

- Funcional solo para la entrega académica
- **No compatible** con el backend NestJS

### Paso 2: Configurar TypeORM para Oracle

Si quisieras conectar tu backend NestJS a Oracle, necesitarías:

#### 2.1 Instalar el driver de Oracle

```bash
npm install oracledb
```

#### 2.2 Modificar la configuración de TypeORM

```typescript
// app.module.ts o database config
TypeOrmModule.forRoot({
  type: "oracle", // Cambiar de 'postgres' a 'oracle'
  host: "localhost",
  port: 1521,
  serviceName: "XEPDB1", // O tu service name
  username: "ESPORTS_APP",
  password: "Esports2026",
  entities: [__dirname + "/**/*.entity{.ts,.js}"],
  synchronize: false, // IMPORTANTE: false en Oracle
});
```

#### 2.3 Modificar las Entidades

Cada entidad necesitaría cambios para Oracle:

```typescript
// ANTES (PostgreSQL):
@PrimaryGeneratedColumn('uuid')
id: string;

@Column({ type: 'boolean', default: true })
disponible: boolean;

@Column({ type: 'text' })
descripcion: string;

@Column({ type: 'jsonb' })
metadata: object;

// DESPUÉS (Oracle):
@PrimaryGeneratedColumn('uuid')       // TypeORM maneja RAW(16) internamente
id: string;

@Column({ type: 'number', default: 1 })  // No hay boolean en Oracle
disponible: number;

@Column({ type: 'clob' })                // No hay text en Oracle
descripcion: string;

@Column({ type: 'clob' })                // No hay jsonb en Oracle
metadata: string;                         // Serializar/deserializar manualmente
```

### Paso 3: Migrar las Funciones PL/pgSQL a PL/SQL

Tu proyecto tiene **~40 funciones PostgreSQL** que necesitarían convertirse. Aquí están las principales diferencias:

| Concepto               | PostgreSQL (PL/pgSQL)     | Oracle (PL/SQL)                              |
| ---------------------- | ------------------------- | -------------------------------------------- |
| Retornar JSON          | `RETURNS JSONB`           | `RETURN CLOB` (serializar con `JSON_OBJECT`) |
| Construir JSON         | `jsonb_build_object(...)` | `JSON_OBJECT(...)` (Oracle 12c+)             |
| Arreglos JSON          | `jsonb_agg(...)`          | `JSON_ARRAYAGG(...)`                         |
| Variables de tipo fila | `RECORD`                  | `%ROWTYPE` o cursor                          |
| Excepciones            | `RAISE EXCEPTION 'msg'`   | `RAISE_APPLICATION_ERROR(-20001, 'msg')`     |
| BOOLEAN                | `BOOLEAN`                 | `NUMBER(1)` (no hay boolean en tablas)       |
| `NOW()`                | `NOW()`                   | `SYSTIMESTAMP` / `SYSDATE`                   |
| `RETURNING id INTO`    | ✅ Soportado              | ✅ Soportado                                 |
| `ILIKE`                | ✅ Case-insensitive       | `UPPER(col) LIKE UPPER(val)`                 |
| `LIMIT/OFFSET`         | ✅ Soportado              | `FETCH FIRST n ROWS ONLY` / `OFFSET` (12c+)  |
| `ON CONFLICT DO`       | ✅ Nativo                 | `MERGE INTO ... WHEN MATCHED/NOT MATCHED`    |
| `SECURITY DEFINER`     | ✅ Soportado              | `AUTHID DEFINER`                             |
| `$$ delimiter`         | ✅ (dollar quoting)       | No existe, usar `/` para terminar            |

#### Ejemplo de conversión completa:

```sql
-- POSTGRESQL (original):
CREATE OR REPLACE FUNCTION tienda_cancelar_orden(p_orden_id UUID, p_usuario_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_orden RECORD;
BEGIN
    SELECT * INTO v_orden FROM tienda_orden WHERE id = p_orden_id;
    IF v_orden IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Orden no encontrada');
    END IF;
    IF v_orden.usuario_id != p_usuario_id THEN
        RETURN jsonb_build_object('success', false, 'error', 'Sin permiso');
    END IF;
    UPDATE tienda_orden SET estado = 'cancelado', actualizado_en = NOW() WHERE id = p_orden_id;
    RETURN jsonb_build_object('success', true, 'message', 'Orden cancelada');
END;
$$;

-- ORACLE (convertido):
CREATE OR REPLACE FUNCTION TIENDA_CANCELAR_ORDEN(
    P_ORDEN_ID NUMBER,
    P_USUARIO_ID NUMBER
) RETURN CLOB
AUTHID DEFINER
IS
    V_USUARIO_ORD NUMBER;
    V_ESTADO      VARCHAR2(50);
BEGIN
    SELECT USUARIO_ID, ESTADO INTO V_USUARIO_ORD, V_ESTADO
    FROM TIENDA_ORDEN WHERE ID = P_ORDEN_ID;

    IF V_USUARIO_ORD != P_USUARIO_ID THEN
        RETURN '{"success": false, "error": "Sin permiso"}';
    END IF;
    IF V_ESTADO != 'pendiente' THEN
        RETURN '{"success": false, "error": "Solo se cancelan pendientes"}';
    END IF;

    UPDATE TIENDA_ORDEN SET ESTADO = 'cancelado', ACTUALIZADO_EN = SYSTIMESTAMP
    WHERE ID = P_ORDEN_ID;
    COMMIT;

    RETURN '{"success": true, "message": "Orden cancelada"}';
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN '{"success": false, "error": "Orden no encontrada"}';
    WHEN OTHERS THEN
        RETURN '{"success": false, "error": "' || SQLERRM || '"}';
END;
/
```

### Paso 4: Migrar el Trigger de Fondo de Premios

Tu proyecto tiene un trigger en PostgreSQL que actualiza el fondo de premios:

```sql
-- ORACLE (convertido):
CREATE OR REPLACE TRIGGER TRG_ACTUALIZAR_FONDO_PREMIOS
AFTER INSERT OR UPDATE ON TORNEO_INSCRIPCION
FOR EACH ROW
DECLARE
    V_CUOTA             NUMBER;
    V_COMISION_PCT      NUMBER(5,2);
    V_INSCRITOS         NUMBER;
    V_FONDO             NUMBER(12,2);
    V_COMISION          NUMBER(12,2);
    V_ESTADO_CONF_ID    NUMBER;
BEGIN
    SELECT ID INTO V_ESTADO_CONF_ID
    FROM CATALOGO_ESTADO_INSCRIPCION WHERE VALOR = 'confirmada';

    IF :NEW.ESTADO_ID = V_ESTADO_CONF_ID THEN
        SELECT CUOTA, COMISION_PORCENTAJE INTO V_CUOTA, V_COMISION_PCT
        FROM TORNEO_PREMIOS WHERE TORNEO_ID = :NEW.TORNEO_ID;

        SELECT COUNT(*) INTO V_INSCRITOS
        FROM TORNEO_INSCRIPCION
        WHERE TORNEO_ID = :NEW.TORNEO_ID AND ESTADO_ID = V_ESTADO_CONF_ID;

        V_FONDO := V_CUOTA * V_INSCRITOS;
        V_COMISION := V_FONDO * V_COMISION_PCT / 100;

        UPDATE TORNEO_PREMIOS
        SET FONDO_TOTAL = V_FONDO,
            COMISION_TOTAL = V_COMISION,
            FONDO_DESPUES_COMISION = V_FONDO - V_COMISION
        WHERE TORNEO_ID = :NEW.TORNEO_ID;
    END IF;
END;
/
```

**✅ Este trigger ya ha sido agregado al Script Maestro como `TRG_ACTUALIZAR_FONDO_PREMIOS` en el archivo `TRIGGER/01_TRIGGERS.sql`.**

### Paso 5: Inventario de Funciones Migradas

#### Funciones de Tienda (PKG_TIENDA) - 10 funciones ✅

| Función PG                       | Función Oracle                  | Estado |
| -------------------------------- | ------------------------------- | ------ |
| `tienda_obtener_catalogo()`      | `FN_OBTENER_CATALOGO`           | ✅     |
| `tienda_crear_orden()`           | `FN_CREAR_ORDEN`                | ✅     |
| `tienda_registrar_pago_paypal()` | `FN_REGISTRAR_PAGO_PAYPAL`      | ✅     |
| `tienda_confirmar_compra()`      | `FN_CONFIRMAR_COMPRA`           | ✅     |
| `tienda_cancelar_orden()`        | `FN_CANCELAR_ORDEN`             | ✅     |
| `tienda_historial_compras()`     | `FN_HISTORIAL_COMPRAS`          | ✅     |
| `tienda_verificar_nickname()`    | `FN_VERIFICAR_NICKNAME`         | ✅     |
| `tienda_comprar_con_saldo()`     | `FN_COMPRAR_CON_SALDO`          | ✅     |
| `tienda_obtener_solicitudes_soporte()` | `FN_OBTENER_SOLICITUDES_SOPORTE` | ✅     |
| `tienda_resolver_solicitud_soporte()`  | `FN_RESOLVER_SOLICITUD_SOPORTE`  | ✅     |

#### Funciones de Torneos (PKG_TORNEO) - 9 funciones ✅

| Función PG                     | Función Oracle            | Estado |
| ------------------------------ | ------------------------- | ------ |
| `torneo_crear()`               | `FN_CREAR`                | ✅     |
| `torneo_actualizar()`          | `FN_ACTUALIZAR`           | ✅     |
| `torneo_cambiar_estado()`      | `FN_CAMBIAR_ESTADO`       | ✅     |
| `torneo_obtener_detalle()`     | `FN_OBTENER_DETALLE`      | ✅     |
| `torneo_listar()`              | `FN_LISTAR`               | ✅     |
| `torneo_obtener_catalogos()`   | `FN_OBTENER_CATALOGOS`    | ✅     |
| `torneo_upsert_red_social()`   | `FN_UPSERT_RED_SOCIAL`    | ✅     |
| `torneo_eliminar_red_social()` | `FN_ELIMINAR_RED_SOCIAL`  | ✅     |
| `torneo_finalizar()`           | `FN_FINALIZAR`            | ✅     |

#### Funciones de Perfil (PKG_PERFIL) - 10 funciones ✅

| Función PG                       | Función Oracle              | Estado |
| -------------------------------- | --------------------------- | ------ |
| `obtener_perfil_usuario()`       | `FN_OBTENER_PERFIL`         | ✅     |
| `obtener_lista_amigos()`         | `FN_LISTA_AMIGOS`           | ✅     |
| `obtener_vitrina_trofeos()`      | `FN_VITRINA_TROFEOS`        | ✅     |
| `obtener_logros_usuario()`       | `FN_LOGROS_USUARIO`         | ✅     |
| `obtener_estadisticas_juegos()`  | `FN_ESTADISTICAS_JUEGOS`    | ✅     |
| `obtener_historial_torneos()`    | `FN_HISTORIAL_TORNEOS`      | ✅     |
| `obtener_redes_sociales()`       | `FN_REDES_SOCIALES`         | ✅     |
| `obtener_cuentas_juego()`        | `FN_CUENTAS_JUEGO`          | ✅     |
| `obtener_equipos_usuario()`      | `FN_EQUIPOS_USUARIO`        | ✅     |
| `obtener_perfil_completo_json()` | `FN_PERFIL_COMPLETO_JSON`   | ✅     |

#### Funciones de Configuración (PKG_CONFIG) - 16 funciones ✅

| Función PG                     | Función Oracle             | Estado |
| ------------------------------ | -------------------------- | ------ |
| `config_get_personal()`        | `FN_GET_PERSONAL`          | ✅     |
| `config_update_personal()`     | `FN_UPDATE_PERSONAL`       | ✅     |
| `config_get_social()`          | `FN_GET_SOCIAL`            | ✅     |
| `config_upsert_social()`       | `FN_UPSERT_SOCIAL`         | ✅     |
| `config_delete_social()`       | `FN_DELETE_SOCIAL`         | ✅     |
| `config_get_juegos()`          | `FN_GET_JUEGOS`            | ✅     |
| `config_upsert_cuenta_juego()` | `FN_UPSERT_CUENTA_JUEGO`   | ✅     |
| `config_delete_cuenta_juego()` | `FN_DELETE_CUENTA_JUEGO`   | ✅     |
| `config_get_preferencias()`    | `FN_GET_PREFERENCIAS`      | ✅     |
| `config_update_preferencias()` | `FN_UPDATE_PREFERENCIAS`   | ✅     |
| `config_get_cuenta()`          | `FN_GET_CUENTA`            | ✅     |
| `config_update_password()`     | `FN_UPDATE_PASSWORD`       | ✅     |
| `config_get_seguridad()`       | `FN_GET_SEGURIDAD`         | ✅     |
| `config_update_seguridad()`    | `FN_UPDATE_SEGURIDAD`      | ✅     |
| `config_get_retiro()`          | `FN_GET_RETIRO`            | ✅     |
| `config_get_completa()`        | `FN_GET_COMPLETA`          | ✅     |

### Paso 6: Consideraciones del Frontend

Tu frontend en **Next.js** no necesita cambios si solo cambias PostgreSQL por Oracle en el backend. El frontend habla con la API de NestJS, no directamente con la base de datos.

```
Frontend (Next.js) → API (NestJS) → TypeORM → Oracle/PostgreSQL
         ↑                                         ↑
    SIN CAMBIOS                              SOLO AQUÍ HAY CAMBIOS
```

### Paso 7: Pasos Pendientes para Conexión del Backend

| Fase               | Tarea                                           | Esfuerzo      | Estado    |
| ------------------ | ----------------------------------------------- | ------------- | --------- |
| 1                  | Decidir UUID strategy (RAW(16) vs VARCHAR2(36)) | 2h            | ⏳ Pendiente |
| 2                  | Recrear DDL con UUID elegido                    | 4h            | ⏳ Pendiente |
| 3                  | Configurar TypeORM para Oracle                  | 2h            | ⏳ Pendiente |
| 4                  | Modificar entidades (.entity.ts) para Oracle    | 8h            | ⏳ Pendiente |
| 5                  | Migrar funciones PL/SQL (Tienda)                | 6h            | ✅ Completado |
| 6                  | Migrar funciones PL/SQL (Torneos)               | 8h            | ✅ Completado |
| 7                  | Migrar funciones PL/SQL (Perfil)                | 6h            | ✅ Completado |
| 8                  | Migrar funciones PL/SQL (Config)                | 8h            | ✅ Completado |
| 9                  | Migrar trigger de fondo de premios              | 2h            | ✅ Completado |
| 10                 | Pruebas de integración frontend ↔ API ↔ Oracle  | 8h            | ⏳ Pendiente |
| 11                 | Docker Compose para Oracle XE                   | 4h            | ⏳ Pendiente |
| **Completado**     |                                                 | **~30 horas** |           |
| **Pendiente**      |                                                 | **~24 horas** |           |

---

## 📝 Notas Importantes

### ¿TypeORM depende de PostgreSQL?

**No.** TypeORM soporta múltiples bases de datos: PostgreSQL, MySQL, Oracle, SQL Server, SQLite, etc. Solo necesitas cambiar el `type` en la configuración y ajustar los tipos de datos en las entidades.

### ¿Necesito crear un módulo NestJS por cada tabla?

**Solo si esa tabla necesita un endpoint en la API.** Las tablas catálogo y tablas de relación (como `juego_plataformas` o `equipo_miembros`) generalmente se manejan como parte de otro módulo. Por ejemplo, `equipo_miembros` se gestiona desde el módulo `equipo`.

### ¿Se usará Oracle en producción?

**Sí.** El proyecto está migrando completamente a Oracle para cumplir con los requerimientos de la clase. La rama `backup-postgresql` contiene el código funcional con PostgreSQL en caso de necesitar revertir.

---

## 📄 Licencia

Proyecto académico - Universidad

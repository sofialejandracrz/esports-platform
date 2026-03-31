# 🎮 eSports Platform - Manual Técnico

## 📋 Descripción del Proyecto

**eSports Platform** es una plataforma integral de competencias de eSports que permite a los jugadores participar en torneos, gestionar equipos, conectar con otros gamers y competir por premios. El sistema está desarrollado con una arquitectura moderna de microservicios utilizando Docker para su despliegue.

### Stack Tecnológico

| Componente | Tecnología | Versión |
|------------|-----------|---------|
| **Frontend** | Next.js + React | 16.0.4 / 19.2.0 |
| **Backend** | NestJS | 11.0.1 |
| **Base de Datos** | PostgreSQL | 16-alpine |
| **ORM** | TypeORM | 0.3.19 |
| **Autenticación** | JWT (Passport) | 10.2.0 |
| **Pagos** | PayPal REST API | v2 |
| **Contenedores** | Docker + Docker Compose | Latest |
| **Administrador BD** | pgAdmin 4 | Latest |

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                        DOCKER NETWORK                           │
│                      (esports-network)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   Frontend   │    │   Backend    │    │  PostgreSQL  │      │
│  │   (Next.js)  │───▶│   (NestJS)   │───▶│     (DB)     │      │
│  │   Port:3000  │    │   Port:3001  │    │   Port:5433  │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│                                                 │               │
│                                                 │               │
│                                          ┌──────────────┐      │
│                                          │   pgAdmin    │      │
│                                          │   Port:5050  │      │
│                                          └──────────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura del Proyecto

```
esports-platform/
├── 📄 docker-compose.yml          # Orquestación de contenedores
├── 📄 .env                        # Variables de entorno 
├── 📄 .gitignore                  # Archivos ignorados por Git
├── 📄 README.md                   # Este archivo
│
├── 📂 backend/                    # API REST (NestJS)
│   ├── 📄 Dockerfile              # Imagen Docker del backend
│   ├── 📄 package.json            # Dependencias Node.js
│   ├── 📄 tsconfig.json           # Configuración TypeScript
│   ├── 📄 nest-cli.json           # Configuración NestJS
│   └── 📂 src/
│       ├── 📄 main.ts             # Punto de entrada
│       ├── 📄 app.module.ts       # Módulo principal
│       ├── 📂 common/             # Guards, decoradores
│       ├── 📂 database/           # Seeds y scripts SQL
│       └── 📂 modules/            # Módulos de la aplicación
│           ├── auth/              # Autenticación JWT
│           ├── usuario/           # Gestión de usuarios
│           ├── torneo/            # Gestión de torneos
│           ├── equipo/            # Gestión de equipos
│           ├── juego/             # Catálogo de juegos
│           ├── tienda/            # Tienda virtual
│           └── ...                # +35 módulos adicionales
│
├── 📂 frontend/                   # Aplicación Web (Next.js)
│   ├── 📄 Dockerfile              # Imagen Docker del frontend
│   ├── 📄 package.json            # Dependencias Node.js
│   ├── 📄 next.config.mjs         # Configuración Next.js
│   └── 📂 app/                    # Páginas y rutas
│       ├── 📂 auth/               # Login y registro
│       ├── 📂 dashboard/          # Panel de usuario
│       ├── 📂 usuario/            # Perfil y configuración
│       └── ...
│
└── 📂 postgres-init/              # Scripts de inicialización BD
    └── 📄 pg_hba.conf             # Configuración de autenticación
```

---

## ⚙️ Procedimiento de Instalación

### Requisitos Previos

- **Docker Desktop** v20.10 o superior
- **Docker Compose** v2.0 o superior
- **Git** (para clonar el repositorio)

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/sofialejandracrz/esports-platform.git
cd esports-platform
```

### Paso 2: Configurar Variables de Entorno

Crear el archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
# ============================================
# CONFIGURACIÓN DE BASE DE DATOS
# ============================================
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=esports_admin
DB_PASSWORD=esports_password_2024
DB_DATABASE=esports_platform

# ============================================
# CONFIGURACIÓN DE LA APLICACIÓN
# ============================================
NODE_ENV=development
PORT=3001

# ============================================
# CONFIGURACIÓN DE SEEDS (Datos iniciales)
# ============================================
# SKIP_SEEDS=true  # Descomenta para evitar seeds automáticos

# ============================================
# CONFIGURACIÓN DE CORS
# ============================================
FRONTEND_URL=http://localhost:3000

# ============================================
# CONFIGURACIÓN JWT (Autenticación)
# ============================================
JWT_SECRET=esports-secret-key-development-2024
JWT_EXPIRES_IN=7d

# ============================================
# CONFIGURACIÓN DE ARCHIVOS
# ============================================
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# ============================================
# CONFIGURACIÓN DE PAYPAL (Pagos)
# ============================================
PAYPAL_CLIENT_ID=tu_paypal_client_id_aqui
PAYPAL_CLIENT_SECRET=tu_paypal_client_secret_aqui
PAYPAL_SANDBOX=true
```

### Paso 3: Iniciar los Contenedores

```bash
# Construir e iniciar todos los servicios
docker-compose up -d --build

# Verificar que los contenedores estén corriendo
docker-compose ps
```

### Paso 4: Verificar la Instalación

| Servicio | URL | Estado Esperado |
|----------|-----|-----------------|
| Frontend | http://localhost:3000 | Página de inicio visible |
| Backend API | http://localhost:3001/api | Respuesta JSON |
| pgAdmin | http://localhost:5050 | Panel de administración |

---

## 🔌 Procedimiento de Conexión: Aplicativo ↔ Base de Datos

### Arquitectura de Conexión

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│     NestJS      │         │    TypeORM      │         │   PostgreSQL    │
│    (Backend)    │────────▶│  (ORM Driver)   │────────▶│   (Database)    │
│                 │         │                 │         │                 │
│  app.module.ts  │         │   pg driver     │         │  esports_db     │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

### Configuración de TypeORM (app.module.ts)

El backend se conecta a PostgreSQL mediante TypeORM con la siguiente configuración:

```typescript
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST'),        // localhost o 'postgres' en Docker
    port: +configService.get<number>('DB_PORT'), // 5433 (externo) / 5432 (interno)
    username: configService.get('DB_USERNAME'),  // esports_admin
    password: configService.get('DB_PASSWORD'),  // esports_password_2024
    database: configService.get('DB_DATABASE'),  // esports_platform
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: configService.get('NODE_ENV') !== 'production',
    logging: configService.get('NODE_ENV') !== 'production',
  }),
  inject: [ConfigService],
}),
```

### Flujo de Conexión

1. **Inicio del Backend**: NestJS lee las variables de entorno desde `.env`
2. **ConfigModule**: Inyecta las variables en `ConfigService`
3. **TypeORM**: Establece conexión con PostgreSQL usando el driver `pg`
4. **Sincronización**: En desarrollo, TypeORM sincroniza automáticamente las entidades
5. **Seeds**: Se ejecutan datos iniciales si `SKIP_SEEDS` no está activo

### Puertos de Conexión

| Contexto | Host | Puerto | Descripción |
|----------|------|--------|-------------|
| Desarrollo Local | localhost | 5433 | Conexión desde máquina host |
| Docker Interno | postgres | 5432 | Comunicación entre contenedores |
| pgAdmin | postgres | 5432 | Administración de base de datos |

---

## 🔐 Credenciales del Sistema

### ⚠️ IMPORTANTE: Credenciales de Desarrollo

> **Nota:** Las siguientes credenciales son únicamente para entornos de desarrollo. En producción, se deben cambiar por valores seguros.

### Base de Datos PostgreSQL

| Parámetro | Valor |
|-----------|-------|
| **Host** | `localhost` (externo) / `postgres` (Docker) |
| **Puerto** | `5433` (externo) / `5432` (interno) |
| **Usuario** | `esports_admin` |
| **Contraseña** | `esports_password_2024` |
| **Base de Datos** | `esports_platform` |

#### Cadena de Conexión

```
postgresql://esports_admin:esports_password_2024@localhost:5433/esports_platform
```

### pgAdmin 4 (Administrador de BD)

| Parámetro | Valor |
|-----------|-------|
| **URL** | http://localhost:5050 |
| **Email** | `admin@esports.com` |
| **Contraseña** | `admin123` |

#### Configuración de Servidor en pgAdmin

Para agregar el servidor PostgreSQL en pgAdmin:

1. Acceder a http://localhost:5050
2. Click derecho en "Servers" → "Register" → "Server"
3. **General Tab**:
   - Name: `eSports Platform`
4. **Connection Tab**:
   - Host: `postgres` (nombre del contenedor)
   - Port: `5432`
   - Maintenance database: `esports_platform`
   - Username: `esports_admin`
   - Password: `esports_password_2024`

### JWT (Autenticación)

| Parámetro | Valor |
|-----------|-------|
| **Secret Key** | `esports-secret-key-development-2024` |
| **Expiración** | `7d` (7 días) |

### Usuario Administrador (Seeds)

Al iniciar por primera vez, el sistema crea automáticamente:

| Parámetro | Valor |
|-----------|-------|
| **Email** | `admin@esports.com` |
| **Nickname** | `admin` |
| **Contraseña** | `Admin123!` |
| **Rol** | `admin` |

### 💳 PayPal (Sistema de Pagos)

La plataforma integra PayPal para el procesamiento de pagos en la tienda virtual.

#### Variables de Entorno

| Variable | Descripción | Valor de Ejemplo |
|----------|-------------|------------------|
| `PAYPAL_CLIENT_ID` | ID de cliente de la aplicación PayPal | `AaBbCcDd...` |
| `PAYPAL_CLIENT_SECRET` | Secreto de la aplicación PayPal | `EeFfGgHh...` |
| `PAYPAL_SANDBOX` | Modo sandbox (pruebas) o producción | `true` / `false` |

#### Modos de Operación

| Modo | URL Base API | Uso |
|------|--------------|-----|
| **Sandbox** | `https://api-m.sandbox.paypal.com` | Desarrollo y pruebas |
| **Producción** | `https://api-m.paypal.com` | Ambiente productivo |

#### Cómo Obtener las Credenciales de PayPal

1. **Crear cuenta de desarrollador**:
   - Ir a https://developer.paypal.com
   - Iniciar sesión o crear cuenta

2. **Crear aplicación**:
   - Navegar a "Dashboard" → "Apps & Credentials"
   - Click en "Create App"
   - Seleccionar tipo: "Merchant"
   - Nombrar la aplicación: `eSports Platform`

3. **Obtener credenciales**:
   - Copiar el **Client ID**
   - Copiar el **Secret** (hacer click en "Show")

4. **Configurar en el proyecto**:
   ```env
   PAYPAL_CLIENT_ID=tu_client_id_copiado
   PAYPAL_CLIENT_SECRET=tu_secret_copiado
   PAYPAL_SANDBOX=true
   ```

#### Cuentas de Prueba (Sandbox)

PayPal proporciona cuentas de prueba en el sandbox:

| Tipo | Email | Contraseña |
|------|-------|------------|
| **Personal (Comprador)** | `sb-buyer@personal.example.com` | Generada por PayPal |
| **Business (Vendedor)** | `sb-merchant@business.example.com` | Generada por PayPal |

> **Nota:** Las cuentas sandbox se crean automáticamente en el panel de desarrollador de PayPal en la sección "Sandbox" → "Accounts".

#### Flujo de Integración

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│   PayPal    │────▶│   Usuario   │
│  (Checkout) │     │  (API)      │     │   (API)     │     │  (Aprueba)  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │                   │
       │  1. Crear orden   │                   │                   │
       │──────────────────▶│                   │                   │
       │                   │  2. Create Order  │                   │
       │                   │──────────────────▶│                   │
       │                   │  3. Order ID +    │                   │
       │                   │     Approve URL   │                   │
       │                   │◀──────────────────│                   │
       │  4. Redirect URL  │                   │                   │
       │◀──────────────────│                   │                   │
       │                   │                   │  5. Aprobación    │
       │                   │                   │◀──────────────────│
       │  6. Return URL    │                   │                   │
       │◀──────────────────────────────────────────────────────────│
       │                   │                   │                   │
       │  7. Capturar pago │                   │                   │
       │──────────────────▶│                   │                   │
       │                   │  8. Capture Order │                   │
       │                   │──────────────────▶│                   │
       │                   │  9. Confirmación  │                   │
       │                   │◀──────────────────│                   │
       │  10. Éxito        │                   │                   │
       │◀──────────────────│                   │                   │
       └───────────────────┴───────────────────┴───────────────────┘
```

#### Endpoints de Tienda/PayPal

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/tienda/ordenes` | Crear orden de compra |
| POST | `/tienda/ordenes/:id/paypal` | Iniciar pago con PayPal |
| POST | `/tienda/ordenes/:id/paypal/capture` | Capturar pago aprobado |
| GET | `/tienda/ordenes/:id` | Consultar estado de orden |

---

## 🚀 Comandos Útiles

### Docker Compose

```bash
# Iniciar todos los servicios
docker-compose up -d

# Iniciar con reconstrucción de imágenes
docker-compose up -d --build

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f postgres

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (⚠️ BORRA LA BD)
docker-compose down -v

# Reiniciar un servicio específico
docker-compose restart backend

# Ver estado de los contenedores
docker-compose ps
```

### Desarrollo Local (Sin Docker)

```bash
# Backend
cd backend
npm install
npm run start:dev

# Frontend
cd frontend
pnpm install
pnpm dev
```

### Base de Datos

```bash
# Acceder a PostgreSQL desde terminal
docker exec -it esports_postgres psql -U esports_admin -d esports_platform

# Ejecutar script SQL
docker exec -i esports_postgres psql -U esports_admin -d esports_platform < script.sql

# Backup de la base de datos
docker exec esports_postgres pg_dump -U esports_admin esports_platform > backup.sql

# Restaurar backup
docker exec -i esports_postgres psql -U esports_admin -d esports_platform < backup.sql
```

---

## 📡 Endpoints de la API

### Base URL: `http://localhost:3001/api`

### Autenticación

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Registro de usuario | Público |
| POST | `/auth/login` | Inicio de sesión | Público |
| GET | `/auth/profile` | Obtener perfil actual | JWT |

### Usuarios

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/usuarios` | Listar usuarios | JWT |
| GET | `/usuarios/:id` | Obtener usuario | JWT |
| PATCH | `/usuarios/:id` | Actualizar usuario | JWT |
| DELETE | `/usuarios/:id` | Eliminar usuario | Admin |

### Torneos

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/torneos` | Listar torneos | Público |
| GET | `/torneos/:id` | Detalle de torneo | Público |
| POST | `/torneos` | Crear torneo | JWT |
| POST | `/torneos/:id/join` | Inscribirse | JWT |

### Juegos

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/juegos` | Listar juegos | Público |
| GET | `/juegos/:id` | Detalle de juego | Público |
| POST | `/juegos` | Crear juego | Admin |

---

## 🔧 Solución de Problemas

### Error: Puerto 5433 en uso

```bash
# Windows
netstat -ano | findstr :5433
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5433
kill -9 <PID>
```

### Error: Contenedor no inicia

```bash
# Ver logs detallados
docker-compose logs postgres

# Recrear contenedor
docker-compose down
docker-compose up -d --build
```

### Error: Conexión rechazada a la BD

1. Verificar que el contenedor esté corriendo: `docker-compose ps`
2. Verificar las variables de entorno en `.env`
3. Esperar a que PostgreSQL esté listo (healthcheck)

### Limpiar todo y empezar de cero

```bash
docker-compose down -v --rmi all
docker system prune -af
docker-compose up -d --build
```

---

## 👥 Autores

- **eSports Platform Team**
- Repositorio: https://github.com/sofialejandracrz/esports-platform

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

*Manual Técnico generado el 28 de Noviembre de 2025*

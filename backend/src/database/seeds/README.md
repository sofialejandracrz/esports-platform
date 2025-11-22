# Sistema de Seeds

## Descripción

Este sistema de seeds se encarga de poblar la base de datos con datos iniciales necesarios para el funcionamiento de la plataforma eSports.

## Funcionamiento Automático

Los seeds se ejecutan **automáticamente** la primera vez que inicias el servidor. El sistema verifica si ya existen datos y evita duplicados.

### Verificación Automática

El sistema verifica:
- Si existe el usuario `admin`
- Si existen roles en la base de datos

Si ambos existen, los seeds se saltan automáticamente.

## Datos que se Crean

### 1. Catálogos Base

- **Roles**: admin, usuario, moderador
- **Géneros**: Masculino, Femenino, Otro, Prefiero no decir
- **Estados de Amistad**: pendiente, aceptada, rechazada, bloqueada
- **Estados de Inscripción**: pendiente, confirmada, cancelada, rechazada
- **Estados de Torneo**: borrador, abierto, en_curso, finalizado, cancelado
- **Orígenes de Transacción**: compra, premio, reembolso, regalo, logro, torneo
- **Plataformas**: PC, PlayStation 5, PlayStation 4, Xbox Series X/S, Xbox One, Nintendo Switch, Mobile, Steam, Epic Games, Battle.net
- **Regiones**: Norte América, Sur América, Europa, Asia, Oceanía, África, LATAM, Brasil, Global
- **Tipos de Entrada**: gratis, pago, invitacion
- **Tipos de Item**: skin, avatar, banner, insignia, marco, emote, boost
- **Tipos de Transacción**: credito, debito

### 2. Usuario Administrador

Se crea automáticamente un usuario administrador con las siguientes credenciales:

```
Nickname: admin
Password: Admin123!
Email: admin@esports.com
```

**⚠️ IMPORTANTE**: Cambia esta contraseña en producción.

## Controlar la Ejecución de Seeds

### Opción 1: Variable de Entorno (Recomendado)

Para evitar que los seeds se ejecuten al iniciar el servidor, agrega esta línea en tu archivo `.env`:

```env
SKIP_SEEDS=true
```

### Opción 2: Ejecutar Seeds Manualmente

Si necesitas ejecutar los seeds manualmente:

```bash
npm run seed
```

### Opción 3: Re-ejecutar Seeds

Para forzar la re-ejecución de todos los seeds:

1. Elimina el usuario `admin` de la base de datos
2. Reinicia el servidor o ejecuta `npm run seed`

## Estructura de Archivos

```
src/database/seeds/
├── README.md              # Esta documentación
├── seeder.module.ts       # Módulo de NestJS para seeds
├── seeder.service.ts      # Lógica de seeds
└── seed.ts               # Script standalone para ejecutar seeds
```

## Mensajes en la Consola

Cuando los seeds se ejecutan, verás mensajes como:

```
🌱 Verificando seeds...
🌱 Iniciando seeds...
  ✓ Rol creado: admin
  ✓ Género creado: Masculino
  ...
  ✓ Usuario administrador creado:
    - Nickname: admin
    - Password: Admin123!
    - Email: admin@esports.com
✅ Seeds completados exitosamente!
```

Si los seeds ya fueron ejecutados previamente:

```
🌱 Verificando seeds...
⏭️  Seeds ya ejecutados previamente. Saltando...
💡 Para forzar la re-ejecución, elimina el usuario admin de la base de datos.
```

## Probar la API con el Usuario Admin

1. Abre Swagger en: `http://localhost:3001/api/docs`
2. Ve al endpoint `POST /api/auth/login`
3. Usa este JSON:

```json
{
  "login": "admin",
  "password": "Admin123!"
}
```

4. Copia el token JWT de la respuesta
5. Haz clic en el botón "Authorize" arriba
6. Pega el token y ahora puedes usar todos los endpoints protegidos

## Solución de Problemas

### Los seeds no se ejecutan

- Verifica que `SKIP_SEEDS` no esté en `true` en tu `.env`
- Verifica que el usuario `admin` no exista ya en la base de datos

### Error al ejecutar seeds

- Asegúrate de que la base de datos esté corriendo
- Verifica las credenciales en el archivo `.env`
- Revisa los logs de la consola para más detalles

### Quiero limpiar la base de datos

Para empezar de cero:

1. Detén el servidor
2. Borra la base de datos o ejecuta `DROP DATABASE esports_platform;`
3. Recrea la base de datos: `CREATE DATABASE esports_platform;`
4. Inicia el servidor - los seeds se ejecutarán automáticamente

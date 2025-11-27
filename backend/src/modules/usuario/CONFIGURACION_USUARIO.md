# Configuración de Usuario - Funciones Almacenadas PostgreSQL

## 📋 Resumen

Este módulo consume funciones almacenadas de PostgreSQL para gestionar toda la configuración del dashboard de usuario de manera eficiente.

---

## 🏗️ Arquitectura

```
┌─────────────────┐     ┌──────────────────────────────┐     ┌─────────────────┐
│    Frontend     │────▶│         NestJS Backend        │────▶│   PostgreSQL    │
│   (React/Next)  │     │  ConfiguracionUsuarioService  │     │   (Docker)      │
└─────────────────┘     └──────────────────────────────┘     └─────────────────┘
        │                           │                               │
        │  fetch('/usuario/config') │  dataSource.query()           │  config_get_*()
        │                           │                               │
        │◀──────JSON────────────────│◀──────JSONB───────────────────│
```

---

## 📁 Archivos Creados

| Archivo | Descripción |
|---------|-------------|
| `dto/configuracion-usuario.dto.ts` | DTOs para requests y responses |
| `configuracion-usuario.service.ts` | Servicio que ejecuta las funciones almacenadas |
| `configuracion-usuario.controller.ts` | Controlador REST protegido con JWT |

---

## 🔗 Endpoints Disponibles

### Endpoint Principal (Configuración Completa)
```
GET /usuario/configuracion
```
Retorna TODA la configuración en una sola llamada.

### Secciones Individuales

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/usuario/configuracion/personal` | Obtener config personal |
| PUT | `/usuario/configuracion/personal` | Actualizar config personal |
| GET | `/usuario/configuracion/social` | Obtener redes sociales |
| POST | `/usuario/configuracion/social` | Agregar/actualizar red social |
| DELETE | `/usuario/configuracion/social/:id` | Eliminar red social |
| GET | `/usuario/configuracion/juegos` | Obtener cuentas de juego |
| POST | `/usuario/configuracion/juegos` | Agregar/actualizar cuenta |
| DELETE | `/usuario/configuracion/juegos/:id` | Eliminar cuenta |
| GET | `/usuario/configuracion/preferencias` | Obtener preferencias |
| PUT | `/usuario/configuracion/preferencias` | Actualizar preferencias |
| GET | `/usuario/configuracion/cuenta` | Obtener info de cuenta |
| PUT | `/usuario/configuracion/cuenta/password` | Cambiar contraseña |
| GET | `/usuario/configuracion/seguridad` | Obtener datos de pago |
| PUT | `/usuario/configuracion/seguridad` | Actualizar datos de pago |
| GET | `/usuario/configuracion/retiro` | Info de retiro (placeholder) |

---

## 🔐 Autenticación

**IMPORTANTE:** Todos los endpoints requieren autenticación JWT.

```typescript
// Headers requeridos
{
  'Authorization': 'Bearer <token>',
  'Content-Type': 'application/json'
}
```

---

## 📡 Cómo Consumir desde Frontend

### 1. Cargar toda la configuración (recomendado)

```typescript
// lib/api/configuracion.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function obtenerConfiguracionCompleta(token: string) {
  const response = await fetch(`${API_URL}/usuario/configuracion`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener configuración');
  }

  return response.json();
}
```

### 2. Actualizar configuración personal

```typescript
export async function actualizarConfigPersonal(
  token: string,
  data: {
    biografia?: string;
    genero_id?: string;
    timezone?: string;
    avatar_id?: string;
  }
) {
  const response = await fetch(`${API_URL}/usuario/configuracion/personal`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar configuración');
  }

  return response.json();
}
```

### 3. Agregar red social

```typescript
export async function agregarRedSocial(
  token: string,
  data: {
    plataforma: string;  // 'Twitter', 'Twitch', 'YouTube', etc.
    enlace: string;      // URL del perfil
    red_id?: string;     // Solo para actualizar existente
  }
) {
  const response = await fetch(`${API_URL}/usuario/configuracion/social`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return response.json();
}
```

### 4. Cambiar contraseña

```typescript
export async function cambiarPassword(
  token: string,
  data: {
    password_actual: string;
    password_nuevo: string;
    password_confirmacion: string;
  }
) {
  const response = await fetch(`${API_URL}/usuario/configuracion/cuenta/password`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al cambiar contraseña');
  }

  return response.json();
}
```

---

## 📝 Estructura de Respuestas

### Configuración Completa

```json
{
  "personal": {
    "nickname": "gamer123",
    "biografia": "Pro player de FIFA",
    "genero": { "id": "uuid", "valor": "Masculino" },
    "timezone": "America/Mexico_City",
    "foto_perfil": null,
    "avatar": { "id": "uuid", "nombre": "bottts-felix", "url": "..." },
    "generos_disponibles": [...]
  },
  "social": {
    "redes_sociales": [
      { "id": "uuid", "plataforma": "Twitter", "enlace": "https://..." }
    ],
    "plataformas_sugeridas": ["Twitter", "Twitch", "YouTube", ...]
  },
  "juegos": {
    "cuentas_juego": [
      { "id": "uuid", "plataforma_id": "uuid", "plataforma": "Steam", "identificador": "..." }
    ],
    "plataformas_disponibles": [...]
  },
  "preferencias": {
    "desafios_habilitados": true
  },
  "cuenta": {
    "correo": "usuario@email.com",
    "nickname": "gamer123",
    "creado_en": "2025-01-01T00:00:00Z",
    "ultima_conexion": "2025-11-26T10:00:00Z",
    "estado": "activo"
  },
  "seguridad": {
    "correo_paypal": null,
    "p_nombre": "Juan",
    "p_apellido": "Pérez",
    "telefono": "+52 555 123 4567",
    "pais": "México",
    "divisa": "MXN",
    "divisas_disponibles": ["USD", "EUR", "MXN", ...]
  },
  "retiro": {
    "saldo_disponible": "100.00",
    "creditos": 50,
    "paypal_configurado": false,
    "mensaje": "Funcionalidad en desarrollo"
  }
}
```

### Respuesta de éxito

```json
{
  "success": true,
  "message": "Configuración actualizada correctamente"
}
```

---

## ⚠️ Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Datos inválidos (validación fallida) |
| 401 | No autenticado o contraseña incorrecta |
| 404 | Usuario no encontrado |

---

## 🚀 Ejemplo de Uso en React

```tsx
// app/usuario/configuracion/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { obtenerConfiguracionCompleta } from '@/lib/api/configuracion';

export default function ConfiguracionPage() {
  const { token } = useAuth();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarConfig() {
      try {
        // ¡UN SOLO FETCH para toda la configuración!
        const data = await obtenerConfiguracionCompleta(token);
        setConfig(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      cargarConfig();
    }
  }, [token]);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="configuracion-dashboard">
      {/* Sección Personal */}
      <section>
        <h2>Información Personal</h2>
        <p>Nickname: {config.personal.nickname}</p>
        <p>Biografía: {config.personal.biografia || 'Sin biografía'}</p>
      </section>

      {/* Sección Redes Sociales */}
      <section>
        <h2>Redes Sociales</h2>
        {config.social.redes_sociales.map(red => (
          <div key={red.id}>
            {red.plataforma}: {red.enlace}
          </div>
        ))}
      </section>

      {/* ... más secciones */}
    </div>
  );
}
```

---

## 📌 Notas Importantes

1. **Las funciones almacenadas deben existir en PostgreSQL** antes de usar el servicio
2. El script SQL está en: `backend/src/database/scripts/config_get_completa_usuario.sql`
3. El **nickname es de solo lectura** - no se puede cambiar desde configuración personal
4. La sección de **retiro es un placeholder** para integración futura con pasarelas de pago
5. Las **divisas disponibles** son: USD, EUR, MXN, COP, ARS, CLP, PEN, BRL

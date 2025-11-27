# Gestión de Torneos - Funciones Almacenadas PostgreSQL

## 📋 Resumen

Este módulo consume funciones almacenadas de PostgreSQL para gestionar la creación y administración de torneos de manera eficiente.

---

## 🏗️ Arquitectura

```
┌─────────────────┐     ┌──────────────────────────────┐     ┌─────────────────┐
│    Frontend     │────▶│         NestJS Backend        │────▶│   PostgreSQL    │
│   (React/Next)  │     │    TorneoFuncionesService     │     │   (Docker)      │
└─────────────────┘     └──────────────────────────────┘     └─────────────────┘
        │                           │                               │
        │  fetch('/torneos/...')    │  dataSource.query()           │  torneo_*()
        │                           │                               │
        │◀──────JSON────────────────│◀──────JSONB───────────────────│
```

---

## 📁 Archivos Creados

| Archivo | Descripción |
|---------|-------------|
| `dto/torneo-funciones.dto.ts` | DTOs para requests y responses |
| `torneo-funciones.service.ts` | Servicio que ejecuta las funciones almacenadas |
| `torneo-funciones.controller.ts` | Controlador REST (algunos endpoints públicos) |

---

## 🔗 Endpoints Disponibles

### Endpoints Públicos (Sin autenticación)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/torneos/catalogos` | Obtener catálogos para el formulario |
| GET | `/torneos` | Listar torneos con filtros |
| GET | `/torneos/:id` | Obtener detalle de un torneo |

### Endpoints Protegidos (Requieren JWT)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/torneos` | Crear un nuevo torneo |
| PUT | `/torneos/:id` | Actualizar torneo (solo anfitrión) |
| PUT | `/torneos/:id/estado` | Cambiar estado del torneo |
| POST | `/torneos/:id/redes` | Agregar/actualizar red social |
| DELETE | `/torneos/:id/redes/:redId` | Eliminar red social |
| POST | `/torneos/:id/finalizar` | Finalizar y distribuir premios |
| GET | `/torneos/mis/torneos` | Listar mis torneos como anfitrión |

---

## 🔐 Autenticación

Los endpoints protegidos requieren autenticación JWT:

```typescript
// Headers requeridos
{
  'Authorization': 'Bearer <token>',
  'Content-Type': 'application/json'
}
```

---

## 📡 Cómo Consumir desde Frontend

### 1. Cargar catálogos para el formulario

```typescript
// lib/api/torneos.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function obtenerCatalogos() {
  const response = await fetch(`${API_URL}/torneos/catalogos`);

  if (!response.ok) {
    throw new Error('Error al obtener catálogos');
  }

  return response.json();
}
```

### 2. Crear un nuevo torneo

```typescript
export async function crearTorneo(token: string, data: CrearTorneoData) {
  const response = await fetch(`${API_URL}/torneos`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear torneo');
  }

  return response.json();
}
```

### 3. Listar torneos con filtros

```typescript
export async function listarTorneos(params?: {
  estado?: string;
  juego_id?: string;
  region_id?: string;
  busqueda?: string;
  limit?: number;
  offset?: number;
}) {
  const searchParams = new URLSearchParams();
  
  if (params?.estado) searchParams.set('estado', params.estado);
  if (params?.juego_id) searchParams.set('juego_id', params.juego_id);
  if (params?.region_id) searchParams.set('region_id', params.region_id);
  if (params?.busqueda) searchParams.set('busqueda', params.busqueda);
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.offset) searchParams.set('offset', params.offset.toString());

  const response = await fetch(`${API_URL}/torneos?${searchParams}`);

  if (!response.ok) {
    throw new Error('Error al listar torneos');
  }

  return response.json();
}
```

### 4. Obtener detalle de un torneo

```typescript
export async function obtenerTorneoDetalle(torneoId: string) {
  const response = await fetch(`${API_URL}/torneos/${torneoId}`);

  if (!response.ok) {
    throw new Error('Error al obtener torneo');
  }

  return response.json();
}
```

### 5. Actualizar torneo

```typescript
export async function actualizarTorneo(
  token: string,
  torneoId: string,
  data: Partial<CrearTorneoData>
) {
  const response = await fetch(`${API_URL}/torneos/${torneoId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar torneo');
  }

  return response.json();
}
```

### 6. Cambiar estado del torneo

```typescript
export async function cambiarEstadoTorneo(
  token: string,
  torneoId: string,
  nuevoEstado: 'proximamente' | 'en_curso' | 'terminado' | 'cancelado'
) {
  const response = await fetch(`${API_URL}/torneos/${torneoId}/estado`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nuevo_estado: nuevoEstado }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al cambiar estado');
  }

  return response.json();
}
```

---

## 📝 Estructura de Datos

### Crear Torneo (Request)

```typescript
interface CrearTorneoData {
  // Paso 1: Información básica
  titulo: string;
  descripcion?: string;
  fecha_inicio_registro?: string;  // ISO timestamp
  fecha_fin_registro?: string;
  fecha_inicio_torneo?: string;

  // Paso 2: Detalles
  juego_id?: string;
  plataforma_id?: string;
  modo_juego_id?: string;
  region_id?: string;
  tipo_torneo_id?: string;
  al_mejor_de?: 1 | 3 | 5 | 7;
  formato?: '1v1' | '2v2' | '3v3' | '4v4' | '5v5';
  cerrado?: boolean;
  reglas?: string;
  jugadores_pc_permitidos?: boolean;
  requiere_transmision?: boolean;
  requiere_camara?: boolean;
  tipo_entrada_id?: string;
  capacidad?: number;

  // Paso 3: Premios
  cuota?: number;               // Créditos por jugador
  comision_porcentaje?: number; // 0-100
  ganador1_porcentaje?: number; // Default 70
  ganador2_porcentaje?: number; // Default 30

  // Paso 4: Anfitrión
  contacto_anfitrion?: string;
  discord_servidor?: string;
  redes_sociales?: Array<{
    plataforma: string;
    url: string;
  }>;

  // Paso 5: Gráficos
  banner_url?: string;
  miniatura_url?: string;
}
```

### Catálogos (Response)

```json
{
  "success": true,
  "catalogos": {
    "juegos": [
      {
        "id": "uuid",
        "nombre": "FIFA 24",
        "plataformas": [
          { "id": "uuid", "valor": "PlayStation 5" }
        ],
        "modos_juego": [
          { "id": "uuid", "nombre": "Ultimate Team" }
        ]
      }
    ],
    "regiones": [
      { "id": "uuid", "valor": "LATAM" }
    ],
    "tipos_torneo": [
      { 
        "id": "uuid", 
        "valor": "eliminacion_simple",
        "descripcion": "Eliminación simple - Un jugador pierde y queda eliminado",
        "tipo_trofeo": "trofeo_eliminacion"
      }
    ],
    "tipos_entrada": [
      { "id": "uuid", "valor": "mando" }
    ],
    "al_mejor_de": [1, 3, 5, 7],
    "formatos": ["1v1", "2v2", "3v3", "4v4", "5v5"],
    "redes_sociales": ["twitch", "discord", "youtube", "facebook", "x"]
  }
}
```

### Detalle del Torneo (Response)

```json
{
  "success": true,
  "torneo": {
    "id": "uuid",
    "titulo": "Torneo FIFA 24",
    "descripcion": "Gran torneo de FIFA",
    "fechas": {
      "inicio_registro": "2025-12-01T00:00:00Z",
      "fin_registro": "2025-12-10T00:00:00Z",
      "inicio_torneo": "2025-12-15T18:00:00Z"
    },
    "juego": { "id": "uuid", "nombre": "FIFA 24" },
    "plataforma": { "id": "uuid", "valor": "PlayStation 5" },
    "modo_juego": { "id": "uuid", "nombre": "Ultimate Team" },
    "region": { "id": "uuid", "valor": "LATAM" },
    "tipo_torneo": { 
      "id": "uuid", 
      "valor": "eliminacion_simple",
      "tipo_trofeo": "trofeo_eliminacion"
    },
    "tipo_entrada": { "id": "uuid", "valor": "mando" },
    "configuracion": {
      "al_mejor_de": 3,
      "formato": "1v1",
      "cerrado": false,
      "reglas": "Reglas del torneo...",
      "capacidad": 32,
      "jugadores_pc_permitidos": false,
      "requiere_transmision": true,
      "requiere_camara": false
    },
    "estado": { "id": "uuid", "valor": "proximamente" },
    "premios": {
      "cuota": 10,
      "fondo_total": "320.00",
      "fondo_despues_comision": "304.00",
      "comision_porcentaje": "5.00",
      "comision_total": "16.00",
      "ganador1_porcentaje": "70.00",
      "ganador2_porcentaje": "30.00",
      "premio_1er_lugar": "212.80",
      "premio_2do_lugar": "91.20"
    },
    "anfitrion": {
      "id": "uuid",
      "nickname": "pro_player",
      "foto_perfil": null,
      "avatar_url": "https://...",
      "contacto": "contacto@email.com",
      "discord_servidor": "https://discord.gg/..."
    },
    "redes_sociales": [
      { "id": "uuid", "plataforma": "twitch", "url": "https://twitch.tv/..." }
    ],
    "graficos": {
      "banner_url": "https://...",
      "miniatura_url": "https://..."
    },
    "estadisticas": {
      "inscritos": 24,
      "capacidad_restante": 8
    },
    "creado_en": "2025-11-20T10:00:00Z",
    "actualizado_en": "2025-11-25T15:30:00Z"
  }
}
```

---

## ⚠️ Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Datos inválidos (validación fallida) |
| 401 | No autenticado |
| 403 | No autorizado (no es el anfitrión) |
| 404 | Torneo/recurso no encontrado |

---

## 🚀 Ejemplo de Uso en React (Formulario de Creación)

```tsx
// app/torneos/crear/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { obtenerCatalogos, crearTorneo } from '@/lib/api/torneos';
import { useRouter } from 'next/navigation';

export default function CrearTorneoPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [catalogos, setCatalogos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paso, setPaso] = useState(1);
  const [formData, setFormData] = useState({
    // Paso 1
    titulo: '',
    descripcion: '',
    fecha_inicio_registro: '',
    fecha_fin_registro: '',
    fecha_inicio_torneo: '',
    // Paso 2
    juego_id: '',
    plataforma_id: '',
    modo_juego_id: '',
    region_id: '',
    tipo_torneo_id: '',
    al_mejor_de: 1,
    formato: '1v1',
    // ... más campos
  });

  useEffect(() => {
    async function cargarCatalogos() {
      try {
        const data = await obtenerCatalogos();
        setCatalogos(data.catalogos);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    cargarCatalogos();
  }, []);

  const handleSubmit = async () => {
    try {
      const result = await crearTorneo(token, formData);
      if (result.success) {
        router.push(`/torneos/${result.torneo_id}`);
      }
    } catch (error) {
      console.error('Error al crear torneo:', error);
    }
  };

  if (!isAuthenticated) {
    return <div>Debes iniciar sesión para crear un torneo</div>;
  }

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="crear-torneo">
      <h1>Crear Nuevo Torneo</h1>
      
      {/* Indicador de pasos */}
      <div className="pasos">
        {[1, 2, 3, 4, 5].map((p) => (
          <div 
            key={p} 
            className={`paso ${paso === p ? 'activo' : ''}`}
            onClick={() => setPaso(p)}
          >
            Paso {p}
          </div>
        ))}
      </div>

      {/* Formulario por pasos */}
      {paso === 1 && (
        <div className="paso-1">
          <h2>Información Básica</h2>
          <input
            type="text"
            placeholder="Título del torneo"
            value={formData.titulo}
            onChange={(e) => setFormData({...formData, titulo: e.target.value})}
          />
          {/* ... más campos */}
        </div>
      )}

      {paso === 2 && (
        <div className="paso-2">
          <h2>Detalles del Torneo</h2>
          <select 
            value={formData.juego_id}
            onChange={(e) => setFormData({...formData, juego_id: e.target.value})}
          >
            <option value="">Selecciona un juego</option>
            {catalogos?.juegos.map((juego) => (
              <option key={juego.id} value={juego.id}>{juego.nombre}</option>
            ))}
          </select>
          {/* ... más campos */}
        </div>
      )}

      {/* ... pasos 3, 4, 5 */}

      <div className="acciones">
        {paso > 1 && (
          <button onClick={() => setPaso(paso - 1)}>Anterior</button>
        )}
        {paso < 5 ? (
          <button onClick={() => setPaso(paso + 1)}>Siguiente</button>
        ) : (
          <button onClick={handleSubmit}>Crear Torneo</button>
        )}
      </div>
    </div>
  );
}
```

---

## 📌 Notas Importantes

1. **Las funciones almacenadas deben existir en PostgreSQL** antes de usar el servicio
2. El script SQL está en: `backend/src/database/scripts/crear_torneos.sql`
3. El **anfitrión se obtiene automáticamente** del token JWT (no se envía en el body)
4. Solo el **anfitrión puede modificar** su torneo
5. Los torneos **terminados o cancelados no se pueden modificar**
6. El **fondo de premios se calcula automáticamente** cuando se inscriben jugadores
7. Al **finalizar el torneo**, los premios se distribuyen automáticamente

---

## 🔄 Estados del Torneo

| Estado | Descripción | Transiciones permitidas |
|--------|-------------|-------------------------|
| `proximamente` | Torneo creado, esperando inicio de inscripciones | → en_curso, cancelado |
| `en_curso` | Inscripciones abiertas o torneo en progreso | → terminado, cancelado |
| `terminado` | Torneo finalizado | (ninguna) |
| `cancelado` | Torneo cancelado | (ninguna) |

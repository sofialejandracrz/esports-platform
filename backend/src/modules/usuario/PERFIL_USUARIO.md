# Perfil de Usuario - Funciones Almacenadas PostgreSQL

## 📋 Resumen

Este módulo consume funciones almacenadas (stored functions) de PostgreSQL para obtener toda la información del perfil de un usuario de manera eficiente.

---

## 🤔 ¿Qué son las Funciones Almacenadas?

Las **funciones almacenadas** (stored functions) son bloques de código SQL que se guardan directamente en la base de datos. En lugar de hacer múltiples consultas desde el backend, ejecutas UNA función que hace todo el trabajo y retorna los datos listos para usar.

### Analogía Simple
Imagina un restaurante:
- **Sin funciones almacenadas**: El mesero (backend) va a la cocina 10 veces para traer cada ingrediente por separado.
- **Con funciones almacenadas**: El mesero pide "el plato completo" y la cocina (PostgreSQL) lo prepara todo junto.

---

## 🏗️ Arquitectura

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Frontend     │────▶│     NestJS      │────▶│   PostgreSQL    │
│   (React/Next)  │     │    Backend      │     │   (Docker)      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        │  fetch('/perfil/x')   │  dataSource.query()   │  obtener_perfil_completo_json()
        │                       │                       │
        │◀──────JSON────────────│◀──────JSONB───────────│
```

---

## 📁 Archivos Creados

| Archivo | Descripción |
|---------|-------------|
| `dto/perfil-usuario.dto.ts` | Definición de tipos TypeScript para las respuestas |
| `perfil-usuario.service.ts` | Servicio que ejecuta las funciones almacenadas |
| `perfil-usuario.controller.ts` | Endpoints REST para consumir desde frontend |

---

## 🔗 Endpoints Disponibles

### Endpoint Principal (RECOMENDADO)
```
GET /perfil/:nickname
```
Retorna TODA la información del perfil en una sola llamada.

### Endpoints Adicionales (para paginación)
```
GET /perfil/:nickname/amigos?limit=20&offset=0
GET /perfil/:nickname/trofeos?limit=50&offset=0
GET /perfil/:nickname/logros?limit=50&offset=0
GET /perfil/:nickname/estadisticas-juegos
GET /perfil/:nickname/historial-torneos?limit=20&offset=0
GET /perfil/:nickname/redes-sociales
GET /perfil/:nickname/cuentas-juego
GET /perfil/:nickname/equipos
```

---

## 📡 Cómo Consumir desde Frontend

### ¿Se hace solo un fetch?

**¡Sí!** Para cargar la página de perfil completa, solo necesitas UN fetch al endpoint principal:

```typescript
// lib/api/perfil.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface PerfilCompleto {
  usuario: {
    id: string;
    nickname: string;
    xp: number;
    saldo: number;
    creditos: number;
    foto_perfil: string | null;
    biografia: string | null;
    estado: string;
    ultima_conexion: Date | null;
    desafios_habilitados: boolean;
    creado_en: Date;
    avatar_url: string | null;
    avatar_nombre: string | null;
    rol: string;
  };
  datos_personales: {
    nombre_completo?: string;
    correo?: string;
    fecha_nacimiento?: Date;
    pais: string | null;
    ciudad: string | null;
  };
  estadisticas_globales: {
    total_amigos: number;
    total_seguidores: number;
    total_siguiendo: number;
    total_trofeos: number;
    total_logros: number;
    total_torneos_participados: number;
    total_victorias_torneos: number;
    total_derrotas_global: number;
    dinero_total_ganado: number;
  };
  estado_amistad: {
    estado: string | null;
    solicitud_id: string | null;
    puede_agregar: boolean;
  };
  amigos: Array<{
    id: string;
    nickname: string;
    foto_perfil: string | null;
    avatar_url: string | null;
    estado: string;
    ultima_conexion: Date | null;
    xp: number;
    fecha_amistad: Date;
  }>;
  trofeos: Array<{...}>;
  logros: Array<{...}>;
  estadisticas_juegos: Array<{...}>;
  historial_torneos: Array<{...}>;
  redes_sociales: Array<{...}>;
  cuentas_juego: Array<{...}>;
  equipos: Array<{...}>;
}

// Función principal para obtener el perfil
export async function obtenerPerfil(nickname: string, token?: string): Promise<PerfilCompleto> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Si el usuario está logueado, enviar el token para ver datos privados
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/perfil/${nickname}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Usuario no encontrado');
    }
    throw new Error('Error al obtener el perfil');
  }

  return response.json();
}

// Función para cargar más amigos (paginación)
export async function obtenerMasAmigos(
  nickname: string, 
  offset: number, 
  limit: number = 20
) {
  const response = await fetch(
    `${API_URL}/perfil/${nickname}/amigos?limit=${limit}&offset=${offset}`
  );
  return response.json();
}
```

### Ejemplo de uso en un componente React/Next.js:

```tsx
// app/usuario/perfil/[nickname]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { obtenerPerfil, PerfilCompleto } from '@/lib/api/perfil';
import { useAuth } from '@/contexts/auth-context';

export default function PerfilPage() {
  const { nickname } = useParams();
  const { token } = useAuth();
  const [perfil, setPerfil] = useState<PerfilCompleto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarPerfil() {
      try {
        setLoading(true);
        // ¡UN SOLO FETCH para todo el perfil!
        const data = await obtenerPerfil(nickname as string, token);
        setPerfil(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (nickname) {
      cargarPerfil();
    }
  }, [nickname, token]);

  if (loading) return <div>Cargando perfil...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!perfil) return <div>Perfil no encontrado</div>;

  return (
    <div className="perfil-container">
      {/* Información básica */}
      <div className="perfil-header">
        <img src={perfil.usuario.avatar_url || '/default-avatar.png'} alt="Avatar" />
        <h1>{perfil.usuario.nickname}</h1>
        <p>{perfil.usuario.biografia}</p>
        <span>XP: {perfil.usuario.xp}</span>
      </div>

      {/* Estadísticas */}
      <div className="estadisticas">
        <div>Amigos: {perfil.estadisticas_globales.total_amigos}</div>
        <div>Seguidores: {perfil.estadisticas_globales.total_seguidores}</div>
        <div>Trofeos: {perfil.estadisticas_globales.total_trofeos}</div>
        <div>Torneos ganados: {perfil.estadisticas_globales.total_victorias_torneos}</div>
      </div>

      {/* Datos personales (solo si ve su propio perfil) */}
      {perfil.datos_personales.correo && (
        <div className="datos-personales">
          <h2>Tus datos personales</h2>
          <p>Correo: {perfil.datos_personales.correo}</p>
          <p>Nombre: {perfil.datos_personales.nombre_completo}</p>
        </div>
      )}

      {/* Botón de agregar amigo */}
      {perfil.estado_amistad.puede_agregar && (
        <button onClick={() => agregarAmigo(perfil.usuario.id)}>
          Agregar amigo
        </button>
      )}

      {/* Lista de amigos (primeros 10) */}
      <div className="amigos">
        <h2>Amigos ({perfil.estadisticas_globales.total_amigos})</h2>
        {perfil.amigos.map(amigo => (
          <div key={amigo.id}>{amigo.nickname}</div>
        ))}
        {perfil.estadisticas_globales.total_amigos > 10 && (
          <button onClick={() => cargarMasAmigos()}>Ver más</button>
        )}
      </div>

      {/* Trofeos */}
      <div className="trofeos">
        <h2>Trofeos</h2>
        {perfil.trofeos.map(trofeo => (
          <div key={trofeo.id}>
            🏆 {trofeo.tipo} - {trofeo.torneo_titulo}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🔐 Autenticación y Privacidad

- **Sin token**: Se pueden ver todos los perfiles públicos
- **Con token**: 
  - Si ves TU propio perfil: verás tus datos personales (correo, nombre completo, etc.)
  - Si ves OTRO perfil: verás el estado de amistad (si son amigos, si hay solicitud pendiente)

---

## 🛠️ Cómo Funciona Internamente

### 1. El servicio usa `DataSource` de TypeORM

```typescript
// En perfil-usuario.service.ts

const result = await this.dataSource.query(
  `SELECT obtener_perfil_completo_json($1, $2) as perfil`,
  [nickname, viewerId || null],
);
```

**Explicación:**
- `dataSource.query()` ejecuta SQL raw directamente
- `$1, $2` son parámetros posicionales (previenen SQL injection)
- La función PostgreSQL `obtener_perfil_completo_json` hace todo el trabajo
- El resultado viene como JSON directamente desde PostgreSQL

### 2. La función PostgreSQL hace múltiples cosas

```sql
-- Dentro de obtener_perfil_completo_json():
-- 1. Busca el usuario por nickname
-- 2. Obtiene sus datos básicos + avatar + rol
-- 3. Cuenta amigos, seguidores, trofeos, etc.
-- 4. Verifica el estado de amistad con el viewer
-- 5. Agrupa todo en un JSON estructurado
-- 6. Retorna TODO en UNA sola respuesta
```

---

## ⚡ Ventajas de este Enfoque

| Ventaja | Descripción |
|---------|-------------|
| **Rendimiento** | Una sola query en lugar de 10+ queries separadas |
| **Menos latencia** | Un solo round-trip al servidor |
| **Lógica centralizada** | Las reglas de negocio están en la DB |
| **Menos código backend** | El servicio solo ejecuta y mapea |
| **Consistencia** | Los datos siempre se calculan igual |

---

## 🚀 Pasos para Usar

1. **Ejecutar el script SQL** en PostgreSQL:
   ```bash
   docker exec -i <container_postgres> psql -U <usuario> -d <database> < datos-perfil-usuario.sql
   ```

2. **Reiniciar el backend** si está corriendo:
   ```bash
   npm run start:dev
   ```

3. **Probar el endpoint**:
   ```bash
   curl http://localhost:3000/perfil/nickname_de_prueba
   ```

---

## 📝 Notas Importantes

- Las funciones almacenadas ya deben existir en la base de datos
- El archivo `datos-perfil-usuario.sql` debe ejecutarse primero
- Los endpoints de paginación son útiles para "ver más" en listas largas
- El endpoint principal retorna los primeros 10-20 items de cada lista

# 🚀 Guía de Despliegue en Azure

Esta guía te ayudará a desplegar la plataforma eSports en Azure usando tu cuenta de Azure for Students.

## 📋 Prerrequisitos

### 1. Instalar Azure CLI

Descarga e instala Azure CLI desde:
https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows

Verifica la instalación:
```powershell
az version
```

### 2. Iniciar sesión en Azure

```powershell
az login
```

Se abrirá tu navegador para autenticarte con tu cuenta de estudiante.

### 3. Verificar tu suscripción

```powershell
az account show
```

Deberías ver tu suscripción de Azure for Students.

---

## 🚀 Despliegue Automático

### Ejecutar despliegue en 2 fases (Recomendado)

El despliegue se realiza en 2 fases porque el Frontend necesita conocer la URL del Backend en tiempo de build.

1. Abre PowerShell como Administrador
2. Navega a la carpeta azure:
   ```powershell
   cd c:\Users\USER\Desktop\eSports\azure
   ```

3. **FASE 1**: Crear infraestructura y desplegar Backend:
   ```powershell
   .\deploy-phase1.ps1
   ```
   - Crea grupo de recursos
   - Crea Container Registry
   - Crea PostgreSQL
   - Despliega Backend
   - **Tiempo: ~10-15 minutos**

4. **FASE 2**: Desplegar Frontend:
   ```powershell
   .\deploy-phase2.ps1
   ```
   - Construye Frontend con URL del Backend
   - Despliega Frontend
   - Actualiza Backend con URL del Frontend
   - **Tiempo: ~5-10 minutos**

### Opción alternativa: Script único (todo en uno)

Si prefieres ejecutar todo de una vez:
```powershell
.\deploy.ps1
```

**Tiempo total estimado: 15-25 minutos**

---

## 📝 Despliegue Manual (Paso a Paso)

Si prefieres hacer el despliegue manualmente:

### Paso 1: Crear grupo de recursos

```powershell
az group create --name esports-platform-rg --location eastus
```

### Paso 2: Crear Container Registry

```powershell
az acr create `
    --resource-group esports-platform-rg `
    --name esportsplatformacr `
    --sku Basic `
    --admin-enabled true
```

### Paso 3: Construir y subir imágenes

```powershell
# Iniciar sesión en ACR
az acr login --name esportsplatformacr

# Backend
cd backend
az acr build --registry esportsplatformacr --image esports-backend:latest .

# Frontend
cd ../frontend
az acr build --registry esportsplatformacr --image esports-frontend:latest .
```

### Paso 4: Crear PostgreSQL

```powershell
az postgres flexible-server create `
    --resource-group esports-platform-rg `
    --name esports-postgres-server `
    --location eastus `
    --admin-user esports_admin `
    --admin-password "EsP0rts_Pr0d_2024!" `
    --database-name esports_platform `
    --sku-name Standard_B1ms `
    --tier Burstable `
    --storage-size 32 `
    --version 16 `
    --yes
```

### Paso 5: Crear Container Apps Environment

```powershell
az containerapp env create `
    --name esports-env `
    --resource-group esports-platform-rg `
    --location eastus
```

### Paso 6: Desplegar contenedores

Ver el script `deploy.ps1` para los comandos completos.

---

## 🔧 Configuración Post-Despliegue

### 1. Actualizar URLs de PayPal

Una vez desplegado, actualiza las URLs de callback en el dashboard de PayPal Developer:
- Return URL: `https://[tu-frontend-url]/tienda/pago-exitoso`
- Cancel URL: `https://[tu-frontend-url]/tienda/pago-cancelado`

### 2. Verificar el despliegue

```powershell
# Ver estado de los contenedores
az containerapp list --resource-group esports-platform-rg --output table

# Ver logs del backend
az containerapp logs show --name esports-backend --resource-group esports-platform-rg --follow

# Ver logs del frontend
az containerapp logs show --name esports-frontend --resource-group esports-platform-rg --follow
```

### 3. Escalar la aplicación (opcional)

```powershell
# Aumentar réplicas del backend
az containerapp update `
    --name esports-backend `
    --resource-group esports-platform-rg `
    --min-replicas 1 `
    --max-replicas 3
```

---

## 💰 Control de Costos

### Monitorear consumo

1. Ve al [Portal de Azure](https://portal.azure.com)
2. Busca "Cost Management"
3. Revisa el consumo de tus créditos

### Recursos y costos aproximados

| Recurso | Costo Aproximado |
|---------|------------------|
| Container Apps (2 apps) | ~$15-20/mes |
| PostgreSQL Flexible (B1ms) | ~$12-15/mes |
| Container Registry (Basic) | ~$5/mes |
| **Total** | **~$32-40/mes** |

Con tus $100 de créditos, puedes tener el proyecto corriendo ~2-3 meses.

### Reducir costos

1. **Escalar a 0 cuando no uses**: Los Container Apps pueden escalar a 0 réplicas
2. **Usar PostgreSQL Burstable**: Ya configurado, es la opción más económica
3. **Eliminar cuando termines**: Usa `cleanup.ps1` para eliminar todo

---

## 🗑️ Eliminar Recursos

Cuando ya no necesites el proyecto:

```powershell
cd azure
.\cleanup.ps1
```

O manualmente:
```powershell
az group delete --name esports-platform-rg --yes
```

---

## ❓ Solución de Problemas

### Error: "ACR name already exists"
El nombre del Container Registry debe ser único globalmente. Cambia `ACR_NAME` en el script.

### Error: "Quota exceeded"
Tu suscripción de estudiante tiene límites. Intenta en otra región o espera a que se liberen recursos.

### Error de conexión a PostgreSQL
Verifica que el firewall permite conexiones desde Azure Services:
```powershell
az postgres flexible-server firewall-rule create `
    --resource-group esports-platform-rg `
    --name esports-postgres-server `
    --rule-name AllowAzureServices `
    --start-ip-address 0.0.0.0 `
    --end-ip-address 0.0.0.0
```

### Los contenedores no inician
Revisa los logs:
```powershell
az containerapp logs show --name esports-backend --resource-group esports-platform-rg
```

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs de los contenedores
2. Verifica las variables de entorno
3. Consulta la documentación de Azure Container Apps

¡Buena suerte con tu despliegue! 🎮

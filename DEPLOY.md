# LICIMX — Guia de Deploy

Dos opciones de despliegue: **Netlify** (serverless/edge) y **Railway** (contenedor Node.js).

---

## Variables de Entorno (ambas plataformas)

| Variable | Descripcion | Ejemplo |
|---|---|---|
| `JWT_SECRET` | Clave secreta para firmar tokens JWT (min 32 chars) | `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | URL publica del sitio | `https://licimx.netlify.app` |
| `NODE_ENV` | Entorno | `production` |

> **Nota:** La app funciona sin Supabase. Si deseas conectar Supabase a futuro, agrega `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

Genera tu JWT_SECRET:

```bash
openssl rand -base64 32
```

---

## Opcion 1: Netlify

### Requisitos

- Cuenta en [netlify.com](https://netlify.com)
- Repo en GitHub: `https://github.com/Arturo0214/LICIMX`

### Paso 1 — Instalar plugin de Next.js

```bash
npm install -D @netlify/plugin-nextjs
```

### Paso 2 — Crear `netlify.toml` en la raiz del proyecto

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20.18.0"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Paso 3 — Deploy desde Netlify Dashboard

1. Ve a [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
2. Conecta tu repo de GitHub (`Arturo0214/LICIMX`)
3. Configura:
   - **Base directory:** `licimx`
   - **Build command:** `npm run build`
   - **Publish directory:** `licimx/.next`
4. En **Environment variables**, agrega:
   - `JWT_SECRET` = (tu clave generada)
   - `NEXT_PUBLIC_SITE_URL` = `https://tu-sitio.netlify.app`
5. Click **Deploy site**

### Paso 4 — Deploy por CLI (alternativa)

```bash
# Instalar CLI de Netlify
npm install -g netlify-cli

# Login
netlify login

# Inicializar (en la carpeta licimx/)
cd licimx
netlify init

# Setear variables de entorno
netlify env:set JWT_SECRET "$(openssl rand -base64 32)"
netlify env:set NEXT_PUBLIC_SITE_URL "https://tu-sitio.netlify.app"

# Deploy
netlify deploy --build --prod
```

### Notas Netlify

- El plugin `@netlify/plugin-nextjs` convierte API routes y middleware en Netlify Functions/Edge Functions automaticamente
- Si el middleware da problemas (Next.js 16 depreca middleware a favor de proxy), puedes deshabilitarlo temporalmente removiendo `middleware.ts` y protegiendo rutas desde el cliente
- Free tier: 100GB bandwidth, 300 build minutes/mes

---

## Opcion 2: Railway

### Requisitos

- Cuenta en [railway.app](https://railway.app)
- Repo en GitHub: `https://github.com/Arturo0214/LICIMX`

### Paso 1 — Deploy desde Railway Dashboard

1. Ve a [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. Conecta tu repo (`Arturo0214/LICIMX`)
3. Railway detecta automaticamente que es un proyecto Node.js
4. Configura:
   - **Root Directory:** `licimx`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. En **Variables**, agrega:
   - `JWT_SECRET` = (tu clave generada)
   - `NEXT_PUBLIC_SITE_URL` = `https://tu-app.up.railway.app`
   - `PORT` = `3000`
6. Click **Deploy**

### Paso 2 — Deploy por CLI (alternativa)

```bash
# Instalar CLI de Railway
npm install -g @railway/cli

# Login
railway login

# Inicializar proyecto
cd licimx
railway init

# Setear variables de entorno
railway variables set JWT_SECRET="$(openssl rand -base64 32)"
railway variables set NEXT_PUBLIC_SITE_URL="https://tu-app.up.railway.app"
railway variables set PORT=3000

# Deploy
railway up
```

### Paso 3 — Generar dominio publico

```bash
railway domain
```

O desde el dashboard: **Settings** → **Networking** → **Generate Domain**

### Paso 4 (Opcional) — Agregar PostgreSQL

Si quieres migrar de localStorage a base de datos real:

```bash
# Agregar servicio de PostgreSQL al proyecto
railway add --plugin postgresql

# La variable DATABASE_URL se inyecta automaticamente
# Luego ejecuta las migraciones:
railway run npx supabase db push
```

### Notas Railway

- Railway ejecuta tu app como un servidor Node.js persistente (no serverless)
- El middleware y API routes funcionan nativamente sin plugins
- Ideal si planeas agregar PostgreSQL, Redis, o workers en el futuro
- Free tier: $5 USD de credito/mes, luego pay-as-you-go (~$5-10/mes para apps pequenas)
- Soporta custom domains gratis

---

## Comparativa

| Caracteristica | Netlify | Railway |
|---|---|---|
| **Tipo** | Serverless / Edge | Contenedor Node.js |
| **API Routes** | Via Netlify Functions | Nativo |
| **Middleware** | Via Edge Functions | Nativo |
| **Base de datos** | Externo (Supabase, PlanetScale) | PostgreSQL integrado |
| **Cold starts** | Si (serverless) | No (servidor persistente) |
| **Costo base** | Gratis (100GB BW) | $5 USD/mes credito gratis |
| **Ideal para** | Landing + marketing | Full-stack con DB |
| **Custom domain** | Gratis | Gratis |
| **SSL** | Automatico | Automatico |
| **CI/CD** | Auto-deploy en push | Auto-deploy en push |

---

## Recomendacion

**Para MVP/demo rapido:** Netlify — deploy en 2 minutos, funciona bien para la landing y el dashboard con localStorage.

**Para produccion con datos reales:** Railway — agrega PostgreSQL con un click, sin cold starts, servidor persistente ideal para el CRM completo.

---

## Post-Deploy Checklist

- [ ] Verificar que la landing carga correctamente en `/`
- [ ] Probar login con `demo@licimx.com` / `demo1234`
- [ ] Verificar que el dashboard carga despues del login
- [ ] Probar crear una licitacion desde `/licitaciones`
- [ ] Verificar que el pipeline kanban funciona
- [ ] Probar importar desde `/explorar`
- [ ] Verificar que logout redirige a `/login`

---

## Troubleshooting

### Error: "middleware" is deprecated (Next.js 16)

Next.js 16 muestra un warning sobre middleware. La app sigue funcionando, pero si causa problemas en Netlify:

```typescript
// next.config.ts - agrega esto si es necesario
const nextConfig: NextConfig = {
  experimental: {
    middlewarePrefetch: 'strict',
  },
};
```

### Error: Node.js version

Ambas plataformas necesitan Node >= 20.9.0. Asegurate de configurar:

- **Netlify:** `NODE_VERSION = "20.18.0"` en `netlify.toml` o en variables de entorno
- **Railway:** Agrega `"engines": { "node": ">=20.18.0" }` en `package.json`

### Error: JWT_SECRET not set

Si ves errores de autenticacion, verifica que `JWT_SECRET` esta configurado en las variables de entorno de la plataforma. Debe tener al menos 32 caracteres.

# Guía para subir el proyecto a GitHub

## 1. Requisitos

- una cuenta de GitHub;
- Git instalado;
- Node.js 22.13 o superior;
- pnpm mediante Corepack.

```bash
git --version
node --version
corepack enable
pnpm --version
```

## 2. Crear el repositorio

1. Ingrese en `https://github.com/new`.
2. Use un nombre como `evaluacion-gobernanza-ia-aadtc`.
3. Elija **Private** si todavía está en desarrollo.
4. No agregue README, `.gitignore` ni licencia desde GitHub.
5. Presione **Create repository**.

## 3. Preparar y revisar

Descomprima el ZIP, abra una terminal dentro de `gobernanza-ia-aadtc` y compruebe que no haya secretos:

```bash
git status
git grep -n "ADMIN_PASSWORD"
```

Es correcto encontrar el nombre de la variable, pero nunca una contraseña real.

## 4. Inicializar Git

```bash
git init -b main
git add .
git commit -m "Initial release: evaluación de gobernanza de IA"
```

## 5. Vincularlo con GitHub

Reemplace `TU_USUARIO` por su usuario:

```bash
git remote add origin https://github.com/TU_USUARIO/evaluacion-gobernanza-ia-aadtc.git
git push -u origin main
```

GitHub puede solicitar autenticación mediante navegador o Personal Access Token; no use la contraseña normal de la cuenta.

## 6. Actualizaciones futuras

```bash
git status
git add .
git commit -m "Descripción breve del cambio"
git push
```

## 7. Ejecutar localmente

```bash
corepack enable
pnpm install
cp .env.example .env.local
pnpm run build
```

Complete `.env.local` con credenciales de prueba. Para generar `SESSION_SECRET` en Linux:

```bash
openssl rand -hex 32
```

## 8. Base D1 local

Después de construir, aplique las migraciones en orden:

```bash
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_sleepy_pyro.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_motionless_scarlet_witch.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0002_young_secret_warriors.sql
```

Luego:

```bash
pnpm run dev
```

## 9. Límites de GitHub Pages

GitHub Pages no puede ejecutar esta aplicación completa porque requiere servidor, secretos, rutas API y Cloudflare D1. GitHub conserva el código; el sitio debe alojarse en ChatGPT Sites o en infraestructura compatible con Cloudflare Workers/D1.

## 10. No subir

- `.env.local` y otros `.env` reales;
- `node_modules/`;
- `dist/`;
- `.wrangler/`;
- `.sites-runtime/`;
- tokens, contraseñas o copias de la base de producción.

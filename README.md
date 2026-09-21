# Evaluación grupal: Gobernanza de IA — AADTC

Aplicación educativa para el **Módulo 6: Evolución y Desafío de las TIC**, correspondiente al Curso Anual de Profundización en Derecho de las Telecomunicaciones, Servicios de Comunicación Audiovisual y Tecnologías de la Información y las Comunicaciones.

## Funciones

- evaluación grupal de 12 preguntas;
- registro de grupo, integrantes y DNI;
- bloqueo de reintentos y habilitación docente;
- panel docente protegido;
- resultados persistentes en Cloudflare D1;
- exportación administrativa en CSV;
- certificados individuales en PDF;
- código QR único con página pública de verificación;
- acceso público al examen sin cuenta de ChatGPT.

## Tecnologías

- TypeScript, React y Vinext;
- Cloudflare Workers y D1;
- Drizzle ORM y migraciones SQL;
- jsPDF y QRCode;
- pnpm y Node.js 22.13 o superior.

## Inicio local

```bash
corepack enable
pnpm install
cp .env.example .env.local
pnpm run build
```

Consulte `GITHUB_UPLOAD_GUIDE.md` para aplicar las migraciones D1 y subir el proyecto.

## Seguridad

Las credenciales reales del docente no están incluidas. Configure `ADMIN_USER`, `ADMIN_PASSWORD` y `SESSION_SECRET` como secretos del entorno. No confirme `.env.local` en Git.

## Publicación

GitHub Pages no puede ejecutar la aplicación completa porque requiere servidor y D1. GitHub se utiliza para versionar el proyecto; el despliegue debe realizarse en una plataforma compatible con Cloudflare Workers y D1 o mantenerse en ChatGPT Sites.

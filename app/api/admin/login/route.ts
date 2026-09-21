import { env } from "cloudflare:workers";
import { createSession, secureCompare } from "../../../../lib/admin-auth";
export async function POST(request: Request) {
  const body = await request.json() as { username?: string; password?: string };
  if (!secureCompare(body.username || "", env.ADMIN_USER || "") || !secureCompare(body.password || "", env.ADMIN_PASSWORD || "")) return Response.json({ error: "Usuario o contraseña incorrectos." }, { status: 401 });
  const session = await createSession();
  return new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json", "set-cookie": `admin_session=${session}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800` } });
}

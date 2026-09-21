import { env } from "cloudflare:workers";
import { validSession } from "../../../../lib/admin-auth";
export async function POST(request: Request) {
  if (!await validSession(request)) return Response.json({ error: "No autorizado" }, { status: 401 });
  const { groupId, allowed } = await request.json() as { groupId?: string; allowed?: boolean };
  if (!groupId) return Response.json({ error: "Grupo inválido" }, { status: 400 });
  await env.DB.prepare("UPDATE groups SET retake_allowed=? WHERE id=? AND status='completed'").bind(allowed ? 1 : 0, groupId).run();
  return Response.json({ ok: true });
}

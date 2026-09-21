import { env } from "cloudflare:workers";

const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
export async function POST(request: Request) {
  try {
    const body = await request.json() as { groupName?: string; members?: { fullName?: string; dni?: string }[] };
    const groupName = body.groupName?.trim() || "";
    const members = (body.members || []).map(m => ({ fullName: m.fullName?.trim() || "", dni: (m.dni || "").replace(/\D/g, "") }));
    if (groupName.length < 2 || !members.length || members.some(m => m.fullName.length < 4 || m.dni.length < 7 || m.dni.length > 9)) return Response.json({ error: "Completá el grupo y todos los integrantes con apellido, nombres y DNI válido." }, { status: 400 });
    const key = `${normalize(groupName)}:${members.map(m => m.dni).sort().join("-")}`;
    const existing = await env.DB.prepare("SELECT id, status, retake_allowed FROM groups WHERE group_key = ?").bind(key).first<{id:string;status:string;retake_allowed:number}>();
    if (existing) {
      if (existing.status === "completed" && !existing.retake_allowed) return Response.json({ error: "Este grupo ya completó el examen. Solo el docente puede habilitar otro intento.", locked: true }, { status: 409 });
      if (existing.status === "completed" && existing.retake_allowed) {
        await env.DB.prepare("UPDATE groups SET status='in_progress', score=0, percentage=0, correct_count=0, level='Inicial', answers_json='[]', attempts=attempts+1, retake_allowed=0, started_at=?, completed_at=NULL WHERE id=?").bind(new Date().toISOString(), existing.id).run();
      }
      return Response.json({ groupId: existing.id });
    }
    const id = crypto.randomUUID();
    const statements = [env.DB.prepare("INSERT INTO groups (id, group_name, group_key, status, started_at) VALUES (?, ?, ?, 'in_progress', ?)").bind(id, groupName, key, new Date().toISOString()), ...members.map(m => env.DB.prepare("INSERT INTO members (group_id, full_name, dni) VALUES (?, ?, ?)").bind(id, m.fullName, m.dni))];
    await env.DB.batch(statements);
    return Response.json({ groupId: id }, { status: 201 });
  } catch { return Response.json({ error: "No fue posible iniciar el examen. Intentá nuevamente." }, { status: 500 }); }
}

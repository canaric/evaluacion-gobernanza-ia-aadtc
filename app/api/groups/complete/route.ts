import { env } from "cloudflare:workers";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { groupId?: string; answers?: number[] };
    if (!body.groupId || !Array.isArray(body.answers) || body.answers.length !== 12) return Response.json({ error: "Resultado incompleto." }, { status: 400 });
    const row = await env.DB.prepare("SELECT status FROM groups WHERE id=?").bind(body.groupId).first<{status:string}>();
    if (!row || row.status !== "in_progress") return Response.json({ error: "El examen ya fue entregado o no existe." }, { status: 409 });
    const correctAnswers = [1,2,0,1,1,0,1,2,1,0,1,2];
    const correct = body.answers.reduce((n, a, i) => n + (a === correctAnswers[i] ? 1 : 0), 0);
    const percentage = Math.round(correct / 12 * 100), score = correct * 100;
    const level = percentage >= 85 ? "Avanzado" : percentage >= 70 ? "Competente" : percentage >= 60 ? "En desarrollo" : "Inicial";
    const completedAt = new Date().toISOString();
    const members = await env.DB.prepare("SELECT id, full_name AS fullName, dni FROM members WHERE group_id=? ORDER BY id").bind(body.groupId).all<{id:number;fullName:string;dni:string}>();
    const statements = [env.DB.prepare("UPDATE groups SET status='completed', score=?, percentage=?, correct_count=?, level=?, answers_json=?, completed_at=? WHERE id=? AND status='in_progress'").bind(score, percentage, correct, level, JSON.stringify(body.answers), completedAt, body.groupId)];
    if (percentage >= 60) for (const member of members.results) statements.push(env.DB.prepare("INSERT OR IGNORE INTO certificates (id, group_id, member_id, verification_code, status, issued_at) VALUES (?, ?, ?, ?, 'active', ?)").bind(crypto.randomUUID(), body.groupId, member.id, crypto.randomUUID().replace(/-/g, ""), completedAt));
    await env.DB.batch(statements);
    const issued = percentage >= 60 ? await env.DB.prepare("SELECT m.full_name AS fullName, m.dni, c.verification_code AS verificationCode FROM members m JOIN certificates c ON c.member_id=m.id AND c.group_id=m.group_id WHERE m.group_id=? ORDER BY m.id").bind(body.groupId).all() : { results: members.results.map(({fullName,dni}) => ({fullName,dni})) };
    return Response.json({ score, percentage, correct, level, passed: percentage >= 60, members: issued.results });
  } catch { return Response.json({ error: "No fue posible registrar la entrega." }, { status: 500 }); }
}

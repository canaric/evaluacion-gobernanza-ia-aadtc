import { env } from "cloudflare:workers";
import { validSession } from "../../../../lib/admin-auth";
export async function GET(request: Request) {
  if (!await validSession(request)) return Response.json({ error: "No autorizado" }, { status: 401 });
  const groups = await env.DB.prepare("SELECT id, group_name AS groupName, status, score, percentage, correct_count AS correctCount, level, attempts, retake_allowed AS retakeAllowed, started_at AS startedAt, completed_at AS completedAt FROM groups ORDER BY COALESCE(completed_at, started_at) DESC").all();
  const members = await env.DB.prepare("SELECT group_id AS groupId, full_name AS fullName, dni FROM members ORDER BY id").all();
  return Response.json({ groups: groups.results.map((g:any) => ({ ...g, members: members.results.filter((m:any) => m.groupId === g.id) })) });
}

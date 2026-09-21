import { env } from "cloudflare:workers";
import { CheckCircle2, ShieldCheck, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";
function maskDni(dni:string){return dni.length>3?`${"•".repeat(dni.length-3)}${dni.slice(-3)}`:"•••"}

export default async function CertificateVerification({params}:{params:Promise<{code:string}>}){
  const {code}=await params;
  const record=await env.DB.prepare("SELECT c.verification_code AS verificationCode, c.status, c.issued_at AS issuedAt, m.full_name AS fullName, m.dni, g.group_name AS groupName, g.percentage, g.level FROM certificates c JOIN members m ON m.id=c.member_id JOIN groups g ON g.id=c.group_id WHERE c.verification_code=? LIMIT 1").bind(code).first<{verificationCode:string;status:string;issuedAt:string;fullName:string;dni:string;groupName:string;percentage:number;level:string}>();
  const valid=record?.status==="active";
  return <main className="verifyShell">
    <header><img src="/aadtc-logo.png" alt="AADTC"/><a href="/">Ir a la evaluación</a></header>
    <section className={`verifyCard card ${valid?"valid":"invalid"}`}>
      {valid?<>
        <CheckCircle2 className="verifyIcon"/><span className="verifyEyebrow">Certificado verificado</span><h1>Registro válido y vigente</h1>
        <p>La Asociación Argentina del Derecho de las Telecomunicaciones, Tecnologías de la Información y las Comunicaciones certifica que:</p>
        <div className="identity"><strong>{record.fullName}</strong><span>DNI terminado en {maskDni(record.dni)}</span></div>
        <p>Ha cumplido con los requisitos teóricos y prácticos establecidos para la finalización de la capacitación de referencia.</p>
        <dl>
          <div><dt>Grupo</dt><dd>{record.groupName}</dd></div>
          <div><dt>Capacitación</dt><dd>Diseño, gestión responsable y Gobernanza de la IA: Retos y Oportunidades en el sector TIC</dd></div>
          <div><dt>Resultado</dt><dd>Aprobado · {record.percentage}% · Nivel {record.level}</dd></div>
          <div><dt>Fecha de emisión</dt><dd>{new Date(record.issuedAt).toLocaleDateString("es-AR",{day:"numeric",month:"long",year:"numeric"})}</dd></div>
          <div><dt>Código</dt><dd className="code">{record.verificationCode.toUpperCase()}</dd></div>
        </dl>
        <div className="verifiedBy"><ShieldCheck/> Verificación oficial AADTC</div>
      </>:<><XCircle className="verifyIcon"/><span className="verifyEyebrow">Verificación no disponible</span><h1>Certificado inválido o no vigente</h1><p>El código consultado no corresponde a un certificado activo. Verifique que el enlace esté completo o comuníquese con la institución.</p></>}
    </section>
  </main>
}

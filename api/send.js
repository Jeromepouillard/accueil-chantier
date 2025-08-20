import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

async function parseBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok:false, error:"Method Not Allowed" });
  }
  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ ok:false, error:"Missing RESEND_API_KEY" });
  }

  try {
    const {
      to = "jpouillard@ateliermmr.com",
      subject = "Formulaire P+R – PDF",
      html = "<p>Veuillez trouver le PDF en pièce jointe.</p>",
      filename = "formulaire.pdf",
      pdfBase64, // base64 “pur” (ton code génère déjà sans préfixe data:)
      from = "onboarding@resend.dev"
    } = await parseBody(req);

    if (!pdfBase64 || typeof pdfBase64 !== "string" || pdfBase64.length < 1000) {
      return res.status(400).json({ ok:false, error:"pdfBase64 manquant ou trop court" });
    }

    const result = await resend.emails.send({
      from, to, subject, html,
      attachments: [{ filename, content: pdfBase64 }] // base64 direct
    });

    console.log("RESEND_RESULT", result);
    return res.status(200).json({ ok:true, id: result?.id || null });
  } catch (error) {
    console.error("Resend error:", error);
    return res.status(400).json({ ok:false, details: error });
  }
}


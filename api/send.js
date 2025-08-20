import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    const {
      to = 'jpouillard@ateliermmr.com', 
      subject = 'Formulaire P+R – PDF',
      html = '<p>Veuillez trouver le PDF en pièce jointe.</p>',
      filename = 'formulaire.pdf',
      pdfBase64, 
      from = 'onboarding@resend.dev' 
    } = req.body; // <-- Le corps de la requête est maintenant directement dans req.body

    if (!pdfBase64 || typeof pdfBase64 !== 'string') {
      return res.status(400).json({ ok: false, error: 'pdfBase64 requis' });
    }

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      attachments: [
        {
          filename: filename,
          content: pdfBase64,
        },
      ],
    });

    if (error) {
      return res.status(400).json({ ok: false, error: error.message, details: error });
    }

    return res.status(200).json({ ok: true, id: data.id });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || String(err) });
  }
}

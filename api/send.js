// /api/send.js — Vercel Serverless Function (sans dépendances)
// Envoie un email via Resend avec un PDF en pièce jointe (base64).

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ ok: false, error: 'RESEND_API_KEY manquante' });
    }

    const {
      to = 'jpouillard@ateliermmr.com', // destinataire par défaut
      subject = 'Formulaire P+R – PDF',
      html = '<p>Veuillez trouver le PDF en pièce jointe.</p>',
      filename = 'formulaire.pdf',
      pdfBase64, // <— base64 pur (sans data:…)
      from = 'onboarding@resend.dev' // sandbox Resend, OK pour démo
    } = await readJson(req);

    if (!pdfBase64 || typeof pdfBase64 !== 'string') {
      return res.status(400).json({ ok: false, error: 'pdfBase64 requis' });
    }

    const payload = {
      from,
      to,
      subject,
      html,
      attachments: [
        {
          filename,
          content: pdfBase64,            // base64 PUR
          contentType: 'application/pdf' // mime type
        }
      ]
    };

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await r.json();
    if (!r.ok) {
      return res.status(r.status).json({ ok: false, error: data?.message || 'Échec envoi Resend', details: data });
    }

    return res.status(200).json({ ok: true, id: data?.id });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || String(err) });
  }
}

// Petit helper pour lire le JSON proprement
async function readJson(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

async function parseBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString());
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const { 
      to = "jerome.pouillard74@gmail.com",
      subject = "Formulaire P+R – TEST sans PDF",
      html = "<p>Voici un test sans pièce jointe 🚀</p>",
      from = "onboarding@resend.dev"
    } = await parseBody(req);

    await resend.emails.send({ from, to, subject, html });

    return res.status(200).json({ ok: true, message: "Email envoyé (sans PDF)" });
  } catch (error) {
    console.error("Erreur envoi:", error);
    return res.status(400).json({ ok: false, details: error });
  }
}

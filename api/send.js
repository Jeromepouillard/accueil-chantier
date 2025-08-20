import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const {
      to = "jerome.pouillard74@gmail.com", // ton Gmail
      subject = "Formulaire P+R – TEST sans PDF",
      html = "<p>Voici un test sans pièce jointe 🚀</p>",
      from = "onboarding@resend.dev" // adresse sandbox de Resend
    } = await req.json(); // ou readJson(req) si tu utilises ça

    await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    return res.status(200).json({ ok: true, message: "Email envoyé (sans PDF)" });
  } catch (error) {
    console.error("Erreur envoi:", error);
    return res.status(400).json({ ok: false, details: error });
  }
}


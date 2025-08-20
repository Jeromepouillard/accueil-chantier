import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Le code de la nouvelle fonction qui utilise la librairie `resend`
  console.log("Resend key loaded:", !!process.env.RESEND_API_KEY);

  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "jerome.pouillard74@gmail.com",
      subject: "Test Resend",
      html: "<p>Yes! 🎉 L'API marche</p>",
    });

    console.log("Email sent response:", data);
    res.status(200).json(data);
  } catch (error) {
    console.error("Resend error:", error);
    res.status(400).json(error);
  }
}

// Le petit helper qui reste
async function readJson(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

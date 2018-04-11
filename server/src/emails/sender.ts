import sgMail from "@sendgrid/mail";

const API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = "rentals@zenc.io";

if (!API_KEY) {
  throw new Error(`Missing environment variable SENDGRID_API_KEY.`);
}
sgMail.setApiKey(API_KEY);

export async function sendEmail(message: {
  to: string;
  subject: string;
  html: string;
}) {
  if (API_KEY === "TEST") {
    return;
  }
  await sgMail.send({
    to: message.to,
    from: FROM_EMAIL,
    subject: message.subject,
    html: message.html,
  });
}

require("dotenv").config();
const nodemailer = require("nodemailer");

const useTls = String(process.env.EMAIL_USE_TLS || "true").toLowerCase() === "true";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT || 587),
  secure: Number(process.env.EMAIL_PORT || 587) === 465,
  auth: {
    user: process.env.EMAIL_HOST_USER,
    pass: process.env.EMAIL_HOST_PASSWORD,
  },
  requireTLS: useTls,
  tls: useTls
    ? {
        rejectUnauthorized: false,
      }
    : undefined,
});

async function sendEmail(optionsOrTo, maybeSubject, maybeHtmlContent) {
  const emailOptions =
    typeof optionsOrTo === "object"
      ? optionsOrTo
      : {
          to: optionsOrTo,
          subject: maybeSubject,
          htmlContent: maybeHtmlContent,
        };

  const { to, subject, htmlContent } = emailOptions;

  if (!to || !subject || !htmlContent) {
    throw new Error("Missing required email fields");
  }

  if (!process.env.EMAIL_HOST_USER || !process.env.EMAIL_HOST_PASSWORD) {
    console.warn("Email credentials are missing. Skipping email send.", { to, subject });
    return null;
  }

  const response = await transporter.sendMail({
    from: process.env.DEFAULT_FROM_EMAIL || process.env.EMAIL_HOST_USER,
    to,
    subject,
    html: htmlContent,
  });

  console.log("Email sent:", response.messageId);
  return response;
}

module.exports = sendEmail;

const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

// Initialize Brevo client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
defaultClient.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

// Transactional Emails API
const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

/**
 * Send transactional email
 * @param {Object} options
 * @param {string} options.to - recipient email
 * @param {string} options.subject - email subject
 * @param {string} options.htmlContent - email body HTML
 */
async function sendEmail({ to, subject, htmlContent }) {
  const email = new SibApiV3Sdk.SendSmtpEmail({
    to: [{ email: to }],
    sender: {
      name: process.env.BREVO_SENDER_NAME,
      email: process.env.BREVO_SENDER_EMAIL,
    },
    subject,
    htmlContent,
  });

  try {
    const response = await tranEmailApi.sendTransacEmail(email);
    console.log('✅ Email sent:', response.messageId);
    return response;
  } catch (err) {
    console.error('❌ Email sending error:', err.response ? err.response.body : err);
    throw err;
  }
}

module.exports = sendEmail;

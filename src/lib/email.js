import axios from 'axios';
import { BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME } from './database/secret';

export const sendEmail = async ({ to, subject, htmlContent }) => {
  if (!BREVO_API_KEY) {
    console.warn("BREVO_API_KEY is not configured. Skipping email send.");
    return false;
  }

  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { name: BREVO_SENDER_NAME || 'System', email: BREVO_SENDER_EMAIL },
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlContent,
      },
      {
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending email via Brevo:", error?.response?.data || error.message);
    throw new Error("Failed to send email");
  }
};

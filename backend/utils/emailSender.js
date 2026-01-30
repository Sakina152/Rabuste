import SibApiV3Sdk from 'sib-api-v3-sdk';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

const sendEmail = async (options) => {
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = options.subject;
  sendSmtpEmail.htmlContent = options.html || options.message; // Use html if available, fall back to message
  sendSmtpEmail.sender = {
    name: "Rabuste Team",
    email: process.env.EMAIL_USER // Make sure this is a verified sender in Brevo
  };
  sendSmtpEmail.to = [{ email: options.email }];

  if (options.message && !options.html) {
    sendSmtpEmail.textContent = options.message;
  }

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Email sent successfully via Brevo. Message ID: ' + data.messageId);
  } catch (error) {
    console.error('❌ Brevo Email Error:', error);
    // Log more specific error details if available from Brevo SDK
    if (error.response && error.response.body) {
      console.error('   Error Body:', JSON.stringify(error.response.body, null, 2));
    }
    throw new Error('Email sending failed');
  }
};

export default sendEmail;
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

const sendEmail = async (options) => {
  // 1. Create the Transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, 
    },
  });

  // 2. Define the Email Options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html:options.html
  };

  // 3. Send the Email
  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email Sent Successfully to: ' + options.email);
  } catch (error) {
    if (error.code === 'EAUTH') {
      console.warn('⚠️  Email Auth Failed: Please check your EMAIL_USER and EMAIL_PASS in .env');
      console.warn('   (Use an App Password if using Gmail: https://myaccount.google.com/apppasswords)');
    } else {
      console.error('❌ Email could not be sent:', error.message);
    }
    // We throw so the controller knows it failed, but the log is now cleaner
    throw new Error('Email sending failed'); 
  }
};

export default sendEmail;
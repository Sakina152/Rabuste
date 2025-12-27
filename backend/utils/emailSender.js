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
  };

  // 3. Send the Email
  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email Sent Successfully to: ' + options.email);
  } catch (error) {
    console.error('❌ Email could not be sent:', error);
    throw new Error('Email could not be sent'); 
  }
};

export default sendEmail;
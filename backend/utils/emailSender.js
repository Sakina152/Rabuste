const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config(); 

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.html // Optional: If we want to send fancy HTML emails later
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email Sent Successfully to: ' + options.email);
  } catch (error) {
    console.error('❌ Email could not be sent:', error);
    throw new Error('Email could not be sent'); 
  }
};

module.exports = sendEmail;
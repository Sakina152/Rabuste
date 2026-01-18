import Franchise from '../models/Franchise.js';
import Contact from '../models/Contact.js';
import sendEmail from '../utils/emailSender.js';

// @desc    Submit a Franchise Application
// @route   POST /api/franchise
// @access  Public
export const submitFranchise = async (req, res) => {
  try {
    const { name, email, phone, location, budget, experience } = req.body;

    // 1. Save to Database
    const franchise = await Franchise.create({
      name,
      email,
      phone,
      location,
      budget,
      experience
    });

    // 2. Try to Send Emails (Don't block success if email fails)
    try {
      // Alert the Admin
      await sendEmail({
        email: process.env.EMAIL_USER,
        subject: `🔥 New Franchise Lead: ${name}`,
        message: `You have a new franchise inquiry! \n\nName: ${name} \nBudget: ${budget} \nLocation: ${location} \nPhone: ${phone} \nEmail: ${email}`
      });

      // Send Beautiful HTML Email to Customer
      const emailTemplate = `
      <div style="background-color: #1a1a1a; padding: 40px; font-family: Arial, sans-serif; color: #ffffff;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #2a2a2a; padding: 30px; border-radius: 10px; border: 1px solid #333;">
          
          <h1 style="color: #c25e00; text-align: center; font-size: 30px; margin-bottom: 20px; font-family: 'Georgia', serif;">
            ☕ RABUSTE COFFEE
          </h1>
          <hr style="border: 1px solid #444; margin-bottom: 30px;">

          <h2 style="color: #ffffff;">Hello ${name},</h2>
          <p style="font-size: 16px; color: #cccccc; line-height: 1.6;">
            Thank you for your interest in becoming a <strong>Rabuste Franchise Partner</strong>! 
            We have successfully received your application for the <span style="color: #c25e00;">${location}</span> area.
          </p>

          <div style="background-color: #1a1a1a; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #c25e00;">
            <p style="margin: 5px 0; color: #aaaaaa;"><strong>Reference ID:</strong> #${franchise._id}</p>
            <p style="margin: 5px 0; color: #aaaaaa;"><strong>Selected Budget:</strong> ${budget}</p>
            <p style="margin: 5px 0; color: #aaaaaa;"><strong>Status:</strong> <span style="color: #ffd700;">Pending Review</span></p>
          </div>

          <p style="font-size: 16px; color: #cccccc; line-height: 1.6;">
            Our franchise team reviews applications every week. You can expect to hear from us within <strong>48 hours</strong> to schedule a discovery call.
          </p>

          <div style="text-align: center; margin-top: 40px;">
            <a href="http://localhost:5173" style="background-color: #c25e00; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Return to Website
            </a>
          </div>

          <hr style="border: 1px solid #444; margin-top: 40px;">
          <p style="text-align: center; color: #666; font-size: 12px;">
            &copy; 2025 Rabuste Coffee. All rights reserved.<br>
            This is an automated message.
          </p>
        </div>
      </div>
    `;

      await sendEmail({
        email: email, 
        subject: 'Application Received - Rabuste Coffee',
        message: `Hi ${name},\n\nThank you for your interest! We received your application for ${location}.`, 
        html: emailTemplate 
      });
      
    } catch (emailError) {
      console.warn("⚠️ Notification emails failed to send (Bad Credentials), but database record was saved.");
      console.warn(emailError.message);
      // Suppress error so frontend receives success response
    }


    res.status(201).json({
      success: true,
      data: franchise,
      message: 'Application submitted successfully! We will contact you soon.'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Submit a General Contact Message
// @route   POST /api/franchise/contact
// @access  Public
export const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      message
    });

    await sendEmail({
      email: email,
      subject: 'Thanks for contacting Coffee Shop!',
      message: `Hi ${name},\n\nWe received your message: "${message}".\n\nSomeone from our team will get back to you shortly!`
    });

    res.status(201).json({
      success: true,
      data: contact,
      message: 'Message sent successfully!'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
import Franchise from '../models/Franchise.js';
import Contact from '../models/Contact.js';
import sendEmail from '../utils/emailSender.js';

// @desc    Submit a Franchise Application
// @route   POST /api/franchise
// @access  Public
export const submitFranchise = async (req, res) => {
  try {
    const { name, email, phone, location, budget, experience } = req.body;

    const franchise = await Franchise.create({
      name,
      email,
      phone,
      location,
      budget,
      experience
    });

    await sendEmail({
      email: process.env.EMAIL_USER,
      subject: `New Franchise Application from ${name}`,
      message: `You have a new franchise inquiry! \n\nName: ${name} \nBudget: ${budget} \nLocation: ${location} \nPhone: ${phone} \nEmail: ${email}'`
    });

    await sendEmail({
      email: email, 
      subject: 'Application Received - Rabuste Coffee',
      message: `Hi ${name},\n\nThank you for your interest in franchising with Rabuste Coffee!\n\nWe have received your application for the ${location} area.\nOur team will review your details and contact you within 48 hours.\n\nBest regards,\nThe Rabuste Team`
    });

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
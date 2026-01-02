import Art from '../models/Art.js';
import ArtInquiry from '../models/ArtInquiry.js';
import sendEmail from '../utils/emailSender.js';

// 1. Get all Art (Customers see this) 
export const getAllArt = async (req, res) => {
    try {
        const filter = req.query.status ? { status: req.query.status } : {};
        const gallery = await Art.find(filter);
        res.status(200).json(gallery);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// 2. Add New Art (Admin only)
export const addArt = async (req, res) => {
    try {
        const newArt = new Art(req.body);
        await newArt.save();
        res.status(201).json({ message: "Art piece added successfully", newArt });
    } catch (error) {
        res.status(400).json({ message: "Failed to add art", error });
    }
};

// 3. Toggle Art Status (The "Available -> Reserved -> Sold" logic)

export const updateArtStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Expecting 'Available', 'Reserved', or 'Sold'

        const updatedArt = await Art.findByIdAndUpdate(
            id, 
            { status }, 
            { new: true, runValidators: true }
        );

        if (!updatedArt) return res.status(404).json({ message: "Art piece not found" });

        res.status(200).json({ message: `Status updated to ${status}`, updatedArt });
    } catch (error) {
        res.status(400).json({ message: "Update failed", error });
    }
};

// 4. Submit Art Inquiry (Customer interest)
// import { sendEmail } from '../utils/emailSender.js'; 

export const submitInquiry = async (req, res) => {
  try {
    const { artId, customerName, email, phone, message } = req.body;

    // 1. Validate Art exists
    const art = await Art.findById(artId);
    if (!art) {
      return res.status(404).json({
        success: false,
        message: 'Art piece not found'
      });
    }

    // 2. Save inquiry to DB
    const newInquiry = await ArtInquiry.create({
      artId,
      customerName,
      email,
      phone,
      message
    });

    // 3. Email to ADMIN
    await sendEmail({
      email: process.env.EMAIL_USER, // admin email
      subject: `📩 New Art Inquiry: ${art.title}`,
      message: `
New inquiry received:

Art: ${art.title}
Artist: ${art.artist}

Customer: ${customerName}
Email: ${email}
Phone: ${phone || 'Not provided'}

Message:
${message}
      `,
      html: `
        <h2>New Art Inquiry</h2>
        <p><strong>Art:</strong> ${art.title}</p>
        <p><strong>Artist:</strong> ${art.artist}</p>
        <hr />
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    // 4. Email CONFIRMATION to CUSTOMER
    await sendEmail({
      email,
      subject: `We received your inquiry – Rabuste Gallery`,
      message: `
Hi ${customerName},

Thank you for your interest in "${art.title}".
Our team will contact you shortly.

– Rabuste Gallery
      `,
      html: `
        <p>Hi <strong>${customerName}</strong>,</p>
        <p>Thank you for your interest in <strong>"${art.title}"</strong>.</p>
        <p>Our team will contact you shortly.</p>
        <br/>
        <p>– Rabuste Gallery ☕</p>
      `
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully'
    });

  } catch (error) {
    console.error('Inquiry Error:', error);

    res.status(500).json({
      success: false,
      message: 'Inquiry saved but email failed',
      error: error.message
    });
  }
};


/* *Will be uncommented when Developer 4 completes the email handling*
// Function to handle a confirmed purchase
export const purchaseArt = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the art and ensure it's still 'Available'
        const art = await Art.findById(id);

        if (!art) return res.status(404).json({ message: "Art not found" });
        if (art.status === 'Sold') return res.status(400).json({ message: "This piece is already sold!" });

        // Update to Sold
        art.status = 'Sold';
        await art.save();

        // Send confirmation email via Dev 4's utility
        await sendEmail({
            to: req.user.email, // The admin logged in
            subject: `Sale Confirmed: ${art.title}`,
            text: `The painting ${art.title} has been marked as SOLD.`
        });

        res.status(200).json({ message: "Purchase successful", art });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};*/
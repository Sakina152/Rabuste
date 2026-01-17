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
    const artData = {
      ...req.body,
      imageUrl: req.file ? req.file.path : null // Handle image upload
    };
    const newArt = new Art(artData);
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
    const { status } = req.body;

    const update = { status };

    if (status === "Sold") {
      update.soldAt = new Date();
    }

    const updatedArt = await Art.findByIdAndUpdate(
      id,
      update,
      { new: true }
    );

    if (!updatedArt) {
      return res.status(404).json({ message: "Art not found" });
    }

    res.json(updatedArt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 4. Submit Art Inquiry (Customer interest)
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
    // (Ensure EMAIL_USER is set in your .env)
    if (process.env.EMAIL_USER) {
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
    }

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully'
    });

  } catch (error) {
    console.error('Inquiry Error:', error);

    // Don't fail the whole request just because email failed, but warn the user
    res.status(500).json({
      success: false,
      message: 'Inquiry saved but email failed',
      error: error.message
    });
  }
};

// 5. Purchase Art (Called automatically after payment success)
export const purchaseArt = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the art
    const art = await Art.findById(id);

    if (!art) {
      return res.status(404).json({ message: "Art not found" });
    }

    // Double check status to prevent race conditions
    if (art.status === 'Sold') {
      return res.status(400).json({ message: "This piece is already sold!" });
    }

    // Update to Sold
    art.status = 'Sold';
    art.soldAt = new Date();

    // If the user is logged in (from authMiddleware), save who bought it
    if (req.user) {
      art.owner = req.user._id;
    }

    await art.save();

    res.status(200).json({ message: "Purchase successful", art });
  } catch (error) {
    console.error("Purchase Error:", error);
    res.status(500).json({ message: "Purchase failed", error: error.message });
  }
};

// 6. Editing Art Details (Admin-Side)

export const updateArt = async (req, res) => {
  try {
    const art = await Art.findById(req.params.id);

    if (!art) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    art.title = req.body.title ?? art.title;
    art.artist = req.body.artist ?? art.artist;
    art.price = req.body.price ?? art.price;
    art.status = req.body.status ?? art.status;

    if (req.file) {
      art.imageUrl = req.file.path;
    }

    const updatedArt = await art.save();

    res.json(updatedArt);
  } catch (error) {
    console.error("Update art error:", error);
    res.status(400).json({
      message: "Failed to update art",
      error: error.message,
    });
  }
};

// 7. Deleting Artwork (Admin-Side)

export const deleteArt = async (req, res) => {
  try {
    const art = await Art.findById(req.params.id);

    if (!art) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    await art.deleteOne();

    res.json({ message: "Artwork deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete artwork" });
  }
};
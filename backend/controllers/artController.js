import Art from '../models/Art.js';
import ArtInquiry from '../models/ArtInquiry.js';
// import { sendEmail } from '../utils/emailSender.js';

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

        const newInquiry = new ArtInquiry({
            artId,
            customerName,
            email,
            phone,
            message
        });

        await newInquiry.save();

        console.log(`📩 Inquiry saved for art ${artId}. (Email notification pending Dev 4)`);
        
        /* if (sendEmail) { *Requires Developer 4's email feature to be added*
            await sendEmail({
                to: 'admin@cafe.com',
                subject: `New Art Inquiry: ${customerName}`,
                text: message
            });
        } 
        */

        res.status(201).json({ 
            success: true, 
            message: "Inquiry saved successfully! (Note: Email notification will be active once Dev 4 completes utility)" 
        });
    } catch (error) {
        res.status(400).json({ success: false, message: "Failed to send inquiry", error: error.message });
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
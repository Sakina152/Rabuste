import ArtistSubmission from '../models/ArtistSubmission.js';
import sendEmail from '../utils/emailSender.js';

// @desc    Submit new artist portfolio
// @route   POST /api/artist-submissions
// @access  Public
const submitPortfolio = async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        // Check if files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Please upload at least one image.' });
        }

        console.log('Files received:', req.files); // Debug log

        // Extract secure URLs from Cloudinary response
        // Multer-storage-cloudinary usually provides 'path' or 'secure_url'
        const portfolioUrls = req.files.map(file => file.path || file.secure_url);

        const submission = await ArtistSubmission.create({
            name,
            email,
            phone,
            portfolio: portfolioUrls,
        });

        // --- Send Emails ---
        try {
            // 1. Email to Owner (Admin)
            // User requested to send to the owner email specified in .env
            // We assume EMAIL_USER is the owner/admin email as well.
            const adminEmail = process.env.EMAIL_USER || "rabustecoffee@gmail.com";

            const ownerMessageHtml = `
        <h2>New Artist Portfolio Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Portfolio Images:</strong></p>
        <ul>
          ${portfolioUrls.map(url => `<li><a href="${url}" target="_blank">View Image</a></li>`).join('')}
        </ul>
      `;

            await sendEmail({
                email: adminEmail,
                subject: `🎨 New Portfolio: ${name}`,
                message: `New submission from ${name}. Check HTML for details.`,
                html: ownerMessageHtml,
            });

            // 2. Email to Artist (Confirmation)
            const artistMessageHtml = `
        <h2>Submission Received</h2>
        <p>Hi ${name},</p>
        <p>Thank you for submitting your portfolio to Rabuste!</p>
        <p>We have successfully received your work and notified our team. We will review your portfolio and reach out if there is a potential fit for our gallery.</p>
        <br/>
        <p>Best Regards,</p>
        <p>The Rabuste Team</p>
      `;

            await sendEmail({
                email: email,
                subject: `Portfolio Submission Received - Rabuste`,
                message: `Hi ${name}, Thanks for submitting your portfolio. We will review it shortly.`,
                html: artistMessageHtml,
            });

        } catch (emailError) {
            console.error("Failed to send email notifications:", emailError);
            // We proceed without failing the request, as the data is already saved.
        }

        res.status(201).json({
            success: true,
            message: 'Portfolio submitted successfully!',
            data: submission,
        });
    } catch (error) {
        console.error('Portfolio Submission Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error. Could not submit portfolio.',
            error: error.message,
        });
    }
};

export { submitPortfolio };

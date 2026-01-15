import ArtistSubmission from '../models/ArtistSubmission.js';

// @desc    Submit new artist portfolio
// @route   POST /api/artist-submission
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
        const portfolioUrls = req.files.map(file => file.path || file.secure_url); // Try both path and secure_url

        const submission = await ArtistSubmission.create({
            name,
            email,
            phone,
            portfolio: portfolioUrls,
        });

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

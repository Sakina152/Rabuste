
/**
 * @desc    Get recent bookings for dashboard (public for now)
 * @route   GET /api/workshops/bookings
 * @access  Public
 */
export const getRecentBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('workshop', 'title date');

        res.status(200).json(bookings);
    } catch (err) {
        console.error('Error fetching recent bookings:', err);
        res.status(500).json([]);
    }
};

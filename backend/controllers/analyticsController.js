import Order from '../models/Order.js';
import Art from '../models/Art.js';
import Booking from '../models/Booking.js';
import Workshop from '../models/Workshop.js';
import MenuItem from '../models/MenuItem.js';

// @desc    Get Sales Analytics (Daily, Monthly)
// @route   GET /api/analytics/sales
// @access  Private/Admin
export const getSalesAnalytics = async (req, res) => {
    try {
        const { type } = req.query; // 'daily', 'monthly' (default daily)

        const today = new Date();
        let startDate;

        if (type === 'monthly') {
            startDate = new Date(today.getFullYear(), 0, 1); // Start of year
        } else {
            startDate = new Date();
            startDate.setDate(today.getDate() - 7); // Last 7 days
        }

        const salesConfig = type === 'monthly' ? {
            format: "%Y-%m", // YYYY-MM
            groupBy: { $dateToString: { format: "%Y-%m", date: "$paidAt" } }
        } : {
            format: "%Y-%m-%d", // YYYY-MM-DD
            groupBy: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } }
        };

        const sales = await Order.aggregate([
            {
                $match: {
                    isPaid: true,
                    paidAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: salesConfig.groupBy,
                    totalSales: { $sum: "$totalPrice" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json(sales);
    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ message: "Failed to fetch sales analytics" });
    }
};

// @desc    Get Category / Order Type Analytics
// @route   GET /api/analytics/categories
// @access  Private/Admin
export const getCategoryAnalytics = async (req, res) => {
    try {
        const stats = await Order.aggregate([
            {
                $match: { isPaid: true }
            },
            {
                $group: {
                    _id: "$orderType",
                    totalRevenue: { $sum: "$totalPrice" },
                    count: { $sum: 1 }
                }
            }
        ]);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch category analytics" });
    }
};

// @desc    Get Best Selling Items
// @route   GET /api/analytics/bestsellers
// @access  Private/Admin
export const getBestSellers = async (req, res) => {
    try {
        const bestSellers = await Order.aggregate([
            { $match: { isPaid: true } },
            { $unwind: "$orderItems" },
            {
                $group: {
                    _id: "$orderItems.name",
                    totalSold: { $sum: "$orderItems.qty" },
                    revenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.qty"] } }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 }
        ]);

        res.json(bestSellers);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch best sellers" });
    }
};

// @desc    Get Comprehensive Analytics for all modules
// @route   GET /api/analytics/comprehensive
// @access  Private/Admin
export const getComprehensiveStats = async (req, res) => {
    try {
        const now = new Date();
        const startOfThisWeek = new Date(now);
        startOfThisWeek.setDate(now.getDate() - 7);
        const startOfLastWeek = new Date(now);
        startOfLastWeek.setDate(now.getDate() - 14);

        // 1. Menu Analytics
        const menuBestSellers = await Order.aggregate([
            { $match: { orderType: 'MENU', isPaid: true } },
            { $unwind: "$orderItems" },
            {
                $group: {
                    _id: "$orderItems.name",
                    totalSold: { $sum: "$orderItems.qty" },
                    revenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.qty"] } }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 10 }
        ]);

        // 2. Art Analytics
        // Calculate total art revenue from the Art model itself for accuracy (only Sold items)
        const totalArtRevenueStats = await Art.aggregate([
            { $match: { status: 'Sold' } },
            { $group: { _id: null, total: { $sum: '$price' } } }
        ]);

        const topArtists = await Art.aggregate([
            { $match: { status: 'Sold' } },
            {
                $group: {
                    _id: "$artist",
                    count: { $sum: 1 },
                    revenue: { $sum: "$price" }
                }
            },
            { $sort: { revenue: -1 } },
            { $limit: 5 }
        ]);

        // 3. Workshop Analytics
        const workshopStats = await Booking.aggregate([
            { $match: { status: 'confirmed' } },
            {
                $group: {
                    _id: "$workshop",
                    totalBookings: { $sum: 1 },
                    totalSeats: { $sum: "$numberOfSeats" },
                    revenue: { $sum: "$totalAmount" }
                }
            },
            {
                $lookup: {
                    from: "workshops",
                    localField: "_id",
                    foreignField: "_id",
                    as: "workshopDetails"
                }
            },
            { $unwind: "$workshopDetails" },
            {
                $project: {
                    title: "$workshopDetails.title",
                    revenue: 1,
                    totalBookings: 1,
                    totalSeats: 1
                }
            },
            { $sort: { revenue: -1 } }
        ]);

        // 4. Time-series Revenue (Last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);

        const dailyRevenue = await Order.aggregate([
            {
                $match: {
                    isPaid: true,
                    paidAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
                    revenue: { $sum: "$totalPrice" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 5. Overall Trends (Last 7 Days)
        // This includes EVERYTHING: Menu Orders, Art Orders, and Workshop Bookings
        const thisWeekOrders = await Order.aggregate([
            { $match: { isPaid: true, paidAt: { $gte: startOfThisWeek } } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);

        const thisWeekBookings = await Booking.aggregate([
            { $match: { status: 'confirmed', createdAt: { $gte: startOfThisWeek } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        const lastWeekOrders = await Order.aggregate([
            { $match: { isPaid: true, paidAt: { $gte: startOfLastWeek, $lt: startOfThisWeek } } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);

        const lastWeekBookings = await Booking.aggregate([
            { $match: { status: 'confirmed', createdAt: { $gte: startOfLastWeek, $lt: startOfThisWeek } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        const thisWeekTotal = (thisWeekOrders[0]?.total || 0) + (thisWeekBookings[0]?.total || 0);
        const lastWeekTotal = (lastWeekOrders[0]?.total || 0) + (lastWeekBookings[0]?.total || 0);
        const revenueTrend = lastWeekTotal > 0 ? ((thisWeekTotal - lastWeekTotal) / lastWeekTotal * 100).toFixed(1) : 0;

        res.json({
            menu: {
                bestSellers: menuBestSellers,
            },
            art: {
                totalRevenue: totalArtRevenueStats[0]?.total || 0,
                topArtists,
            },
            workshops: {
                stats: workshopStats,
            },
            charts: {
                dailyRevenue
            },
            summary: {
                thisWeekRevenue: thisWeekTotal,
                revenueTrend: parseFloat(revenueTrend)
            }
        });

    } catch (error) {
        console.error("Comprehensive Analytics Error:", error);
        res.status(500).json({ message: "Failed to fetch comprehensive analytics" });
    }
};

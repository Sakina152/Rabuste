import Order from '../models/Order.js';

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

        // Use 'paidAt' instead of 'createdAt' for sales analytics
        // If paidAt is missing, it won't be counted, which is correct for sales.
        const salesConfig = type === 'monthly' ? {
            format: "%Y-%m", // YYYY-MM
            groupBy: { $dateToString: { format: "%Y-%m", date: "$paidAt" } }
        } : {
            format: "%Y-%m-%d", // YYYY-MM-DD
            groupBy: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } }
        };

        console.log(`Fetching sales analytics: type=${type}, startDate=${startDate}`);

        const sales = await Order.aggregate([
            {
                $match: {
                    isPaid: true,
                    paidAt: { $gte: startDate } // Filter by payment date
                }
            },
            {
                $group: {
                    _id: salesConfig.groupBy,
                    totalSales: { $sum: "$totalPrice" }, // Use totalPrice as requested
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } } // Sort by date ascending
        ]);

        console.log("Sales Data:", sales);

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
            // Unwind items from 'orderItems' (Standard for Menu)
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

import Art from '../models/Art.js';
import ArtInquiry from '../models/ArtInquiry.js';
import Order from '../models/Order.js';
import Booking from '../models/Booking.js';
import Franchise from '../models/Franchise.js';
import sendEmail from '../utils/emailSender.js';

export const getSalesOverview = async (req, res) => {
  try {
    const soldArt = await Art.find({ status: 'Sold' });

    const totalRevenue = soldArt.reduce(
      (sum, art) => sum + art.price,
      0
    );

    res.json({
      totalSold: soldArt.length,
      totalRevenue
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getWeeklySalesStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - 7);

    const startOfLastWeek = new Date(now);
    startOfLastWeek.setDate(now.getDate() - 14);

    const thisWeekSales = await Art.countDocuments({
      status: 'Sold',
      soldAt: { $gte: startOfThisWeek }
    });

    const lastWeekSales = await Art.countDocuments({
      status: 'Sold',
      soldAt: {
        $gte: startOfLastWeek,
        $lt: startOfThisWeek
      }
    });

    let percentageChange = 0;

    if (lastWeekSales > 0) {
      percentageChange =
        ((thisWeekSales - lastWeekSales) / lastWeekSales) * 100;
    }

    res.json({
      thisWeekSales,
      lastWeekSales,
      percentageChange: Number(percentageChange.toFixed(2))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getInquiryStats = async (req, res) => {
  try {
    const total = await ArtInquiry.countDocuments();
    res.json({ totalInquiries: total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get comprehensive dashboard statistics
// @route   GET /api/admin/stats/dashboard
// @access  Public (add auth later)
export const getDashboardStats = async (req, res) => {
  try {
    // Calculate date ranges
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - 7);
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Menu Orders Statistics
    const totalMenuOrders = await Order.countDocuments({ orderType: 'MENU' });
    const paidMenuOrders = await Order.countDocuments({
      orderType: 'MENU',
      isPaid: true
    });
    const menuRevenue = await Order.aggregate([
      { $match: { orderType: 'MENU', isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalMenuRevenue = menuRevenue[0]?.total || 0;

    // Art Sales Statistics
    const totalArtSold = await Art.countDocuments({ status: 'Sold' });
    const artRevenue = await Order.aggregate([
      { $match: { orderType: 'ART', isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalArtRevenue = artRevenue[0]?.total || 0;

    // Weekly sales (this week vs last week)
    const thisWeekOrders = await Order.countDocuments({
      isPaid: true,
      createdAt: { $gte: startOfThisWeek }
    });
    const lastWeekStart = new Date(startOfThisWeek);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeekOrders = await Order.countDocuments({
      isPaid: true,
      createdAt: {
        $gte: lastWeekStart,
        $lt: startOfThisWeek
      }
    });

    // This week revenue
    const thisWeekRevenue = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: { $gte: startOfThisWeek }
        }
      },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const thisWeekRevenueTotal = thisWeekRevenue[0]?.total || 0;

    // Last week revenue
    const lastWeekRevenue = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: {
            $gte: lastWeekStart,
            $lt: startOfThisWeek
          }
        }
      },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const lastWeekRevenueTotal = lastWeekRevenue[0]?.total || 0;

    // Workshop bookings
    const totalWorkshops = await Booking.countDocuments();
    const confirmedWorkshops = await Booking.countDocuments({ status: 'confirmed' });

    // Pending franchises
    const pendingFranchises = await Franchise.countDocuments({
      status: 'pending'
    }).catch(() => 0);

    // Calculate trends
    const revenueTrend = lastWeekRevenueTotal > 0
      ? ((thisWeekRevenueTotal - lastWeekRevenueTotal) / lastWeekRevenueTotal * 100).toFixed(1)
      : 0;
    const ordersTrend = lastWeekOrders > 0
      ? ((thisWeekOrders - lastWeekOrders) / lastWeekOrders * 100).toFixed(1)
      : 0;

    res.json({
      // Revenue Stats
      totalRevenue: totalMenuRevenue + totalArtRevenue,
      menuRevenue: totalMenuRevenue,
      artRevenue: totalArtRevenue,
      thisWeekRevenue: thisWeekRevenueTotal,
      lastWeekRevenue: lastWeekRevenueTotal,
      revenueTrend: parseFloat(revenueTrend),

      // Order Stats
      totalOrders: totalMenuOrders,
      paidOrders: paidMenuOrders,
      thisWeekOrders,
      lastWeekOrders,
      ordersTrend: parseFloat(ordersTrend),

      // Art Stats
      totalArtSold,

      // Workshop Stats
      totalWorkshops,
      confirmedWorkshops,

      // Franchise Stats
      pendingFranchises,

      // Recent activity indicators
      recentOrders: await Order.countDocuments({
        createdAt: { $gte: startOfToday }
      })
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ error: err.message });
  }
};

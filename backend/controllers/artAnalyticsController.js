import Art from '../models/Art.js';
import ArtInquiry from '../models/ArtInquiry.js';
import Order from '../models/Order.js';
import ArtPurchase from '../models/ArtPurchase.js';
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

    // --- 1. REVENUE CALCULATIONS ---

    // Menu Revenue (from Order)
    const menuRevenueResult = await Order.aggregate([
      { $match: { orderType: 'MENU', isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalMenuRevenue = menuRevenueResult[0]?.total || 0;

    // Art Revenue (from ArtPurchase)
    const artRevenueResult = await ArtPurchase.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$purchasePrice' } } }
    ]);
    const totalArtRevenue = artRevenueResult[0]?.total || 0;

    // Workshop Revenue (from Booking)
    const workshopRevenueResult = await Booking.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalWorkshopRevenue = workshopRevenueResult[0]?.total || 0;

    const totalRevenue = totalMenuRevenue + totalArtRevenue + totalWorkshopRevenue;

    // --- 2. ORDER/ACTIVITY COUNTS ---

    const totalMenuOrders = await Order.countDocuments({ orderType: 'MENU' });
    const paidMenuOrders = await Order.countDocuments({ orderType: 'MENU', isPaid: true });

    const totalArtSold = await ArtPurchase.countDocuments({ paymentStatus: 'completed' });
    const totalWorkshops = await Booking.countDocuments();
    const confirmedWorkshops = await Booking.countDocuments({ status: 'confirmed' });

    // --- 3. WEEKLY REVENUE TRENDS (This Week vs Last Week) ---

    const lastWeekStart = new Date(startOfThisWeek);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    // Helpers to get revenue in range
    const getRevenueInRange = async (Model, dateField, priceField, matchCriteria = {}) => {
      const result = await Model.aggregate([
        {
          $match: {
            ...matchCriteria,
            [dateField]: { $gte: startOfThisWeek }
          }
        },
        { $group: { _id: null, total: { $sum: `$${priceField}` } } }
      ]);
      return result[0]?.total || 0;
    };

    const getRevenueInLastWeekRange = async (Model, dateField, priceField, matchCriteria = {}) => {
      const result = await Model.aggregate([
        {
          $match: {
            ...matchCriteria,
            [dateField]: { $gte: lastWeekStart, $lt: startOfThisWeek }
          }
        },
        { $group: { _id: null, total: { $sum: `$${priceField}` } } }
      ]);
      return result[0]?.total || 0;
    };

    const thisWeekMenuRev = await getRevenueInRange(Order, 'createdAt', 'totalPrice', { orderType: 'MENU', isPaid: true });
    const thisWeekArtRev = await getRevenueInRange(ArtPurchase, 'createdAt', 'purchasePrice', { paymentStatus: 'completed' });
    const thisWeekWorkshopRev = await getRevenueInRange(Booking, 'createdAt', 'totalAmount', { paymentStatus: 'completed' });
    const thisWeekRevenueTotal = thisWeekMenuRev + thisWeekArtRev + thisWeekWorkshopRev;

    const lastWeekMenuRev = await getRevenueInLastWeekRange(Order, 'createdAt', 'totalPrice', { orderType: 'MENU', isPaid: true });
    const lastWeekArtRev = await getRevenueInLastWeekRange(ArtPurchase, 'createdAt', 'purchasePrice', { paymentStatus: 'completed' });
    const lastWeekWorkshopRev = await getRevenueInLastWeekRange(Booking, 'createdAt', 'totalAmount', { paymentStatus: 'completed' });
    const lastWeekRevenueTotal = lastWeekMenuRev + lastWeekArtRev + lastWeekWorkshopRev;

    const revenueTrend = lastWeekRevenueTotal > 0
      ? ((thisWeekRevenueTotal - lastWeekRevenueTotal) / lastWeekRevenueTotal * 100).toFixed(1)
      : 0;

    // --- 4. WEEKLY ORDER TRENDS ---

    const getCountInRange = async (Model, dateField, matchCriteria = {}) => {
      return await Model.countDocuments({
        ...matchCriteria,
        [dateField]: { $gte: startOfThisWeek }
      });
    }

    const getCountInLastWeekRange = async (Model, dateField, matchCriteria = {}) => {
      return await Model.countDocuments({
        ...matchCriteria,
        [dateField]: { $gte: lastWeekStart, $lt: startOfThisWeek }
      });
    }

    const thisWeekMenuCount = await getCountInRange(Order, 'createdAt', { isPaid: true });
    const thisWeekArtCount = await getCountInRange(ArtPurchase, 'createdAt', { paymentStatus: 'completed' });
    const thisWeekWorkshopCount = await getCountInRange(Booking, 'createdAt', { status: 'confirmed' });
    const thisWeekOrders = thisWeekMenuCount + thisWeekArtCount + thisWeekWorkshopCount;

    const lastWeekMenuCount = await getCountInLastWeekRange(Order, 'createdAt', { isPaid: true });
    const lastWeekArtCount = await getCountInLastWeekRange(ArtPurchase, 'createdAt', { paymentStatus: 'completed' });
    const lastWeekWorkshopCount = await getCountInLastWeekRange(Booking, 'createdAt', { status: 'confirmed' });
    const lastWeekOrders = lastWeekMenuCount + lastWeekArtCount + lastWeekWorkshopCount;

    const ordersTrend = lastWeekOrders > 0
      ? ((thisWeekOrders - lastWeekOrders) / lastWeekOrders * 100).toFixed(1)
      : 0;

    // Pending franchises
    const pendingFranchises = await Franchise.countDocuments({
      status: 'pending'
    }).catch(() => 0);

    res.json({
      // Revenue Stats
      totalRevenue: totalRevenue,
      menuRevenue: totalMenuRevenue,
      artRevenue: totalArtRevenue,
      workshopRevenue: totalWorkshopRevenue,
      thisWeekRevenue: thisWeekRevenueTotal,
      lastWeekRevenue: lastWeekRevenueTotal,
      revenueTrend: parseFloat(revenueTrend.toString()),

      // Order/Activity Stats
      totalOrders: totalMenuOrders + totalArtSold + confirmedWorkshops,
      paidOrders: paidMenuOrders + totalArtSold + confirmedWorkshops, // Used for "Active Orders"
      thisWeekOrders,
      lastWeekOrders,
      ordersTrend: parseFloat(ordersTrend.toString()),

      // Sub-stats
      totalArtSold,
      totalWorkshops,
      confirmedWorkshops,
      pendingFranchises,
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ error: err.message });
  }
};

import Art from '../models/Art.js';
import ArtInquiry from '../models/ArtInquiry.js';
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
  const total = await ArtInquiry.countDocuments();
  res.json({ totalInquiries: total });
};

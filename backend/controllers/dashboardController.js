import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Get dashboard analytics
// @route   GET /api/dashboard
// @access  Private/Admin
const getDashboardData = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });

    const orders = await Order.find({});
    const totalSales = orders.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0);

    // Sales over time (last 7 days as example, but simple implementation here)
    const recentOrders = await Order.find({}).sort({ createdAt: -1 }).limit(5).populate('user', 'firstName lastName email');
    
    // Group orders by date for chart
    const salesData = await Order.aggregate([
      {
        $match: { isPaid: true }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: "$totalPrice" },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $limit: 30
      }
    ]);

    const formattedSalesData = salesData.map(data => ({
      name: data._id,
      sales: data.sales,
      orders: data.orders
    }));

    // Category performance
    const categoryData = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      }
    ]);

    await Product.populate(categoryData, { path: "_id", select: "name" });
    
    const formattedCategoryData = categoryData.map(data => ({
      name: data._id?.name || 'Uncategorized',
      value: data.count
    }));

    const lowStockProducts = await Product.find({ countInStock: { $lt: 10 } }).select('name countInStock image').limit(5);

    res.json({
      summary: {
        totalOrders,
        totalProducts,
        totalUsers,
        totalSales,
      },
      salesData: formattedSalesData,
      categoryData: formattedCategoryData,
      recentOrders,
      lowStockProducts
    });
  } catch (error) {
    next(error);
  }
};

export { getDashboardData };

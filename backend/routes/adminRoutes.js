import express from 'express';
import { protect, requireRole } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Lead from '../models/Lead.js';
import Appointment from '../models/Appointment.js';
import Invoice from '../models/Invoice.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const router = express.Router();

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
router.get('/dashboard', protect, requireRole('admin', 'superadmin'), async (req, res) => {
  try {
    // Determine date range filter
    let dateFilter = {};
    const days = parseInt(req.query.days);
    if (days && days > 0) {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - days);
      dateFilter = { createdAt: { $gte: pastDate } };
    }

    const totalLeads = await Lead.countDocuments(dateFilter);
    const totalCustomers = await User.countDocuments({ role: 'user', ...dateFilter });
    const totalAppointments = await Appointment.countDocuments(dateFilter);
    
    // Calculate total revenue from paid invoices (or orders)
    // To be precise with eCommerce, we can calculate from paid orders
    const allOrders = await Order.find(dateFilter).populate('user', 'firstName lastName email');
    const totalOrders = allOrders.length;
    let productsSold = 0;
    
    // Status breakdown
    let statuses = {
      'Delivered': 0,
      'Processing': 0,
      'Shipped': 0,
      'Pending': 0,
      'Cancelled': 0
    };

    let totalRevenue = 0;
    allOrders.forEach(order => {
      if (order.isPaid) {
        totalRevenue += order.totalPrice;
      }
      // Calculate products sold
      order.orderItems.forEach(item => {
        productsSold += item.qty;
      });
      if (statuses[order.status] !== undefined) {
        statuses[order.status] += 1;
      }
    });

    // Calculate Inventory
    const allProducts = await Product.find({});
    const totalProducts = allProducts.length;
    const inStock = allProducts.filter(p => p.countInStock > 0).length;
    const outOfStock = totalProducts - inStock;
    const availableStockPercent = totalProducts > 0 ? ((inStock / totalProducts) * 100).toFixed(1) : 0;
    const damageStockPercent = totalProducts > 0 ? ((outOfStock / totalProducts) * 100).toFixed(1) : 0;

    // Get Recent Reviews (Feedbacks)
    let allReviews = [];
    allProducts.forEach(product => {
      if (product.reviews && product.reviews.length > 0) {
        product.reviews.forEach(review => {
          allReviews.push({
            id: review._id,
            name: review.name,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt,
            productName: product.name
          });
        });
      }
    });
    // Sort descending by date
    allReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const recentFeedbacks = allReviews.slice(0, 3); // Top 3

    // Mock Sales Data for Composed Chart for now, or dynamically generate
    const salesData = [
      { name: 'Jan', currentYear: 12000, previousYear: 8000, growth: 50 },
      { name: 'Feb', currentYear: 19000, previousYear: 12000, growth: 58 },
      { name: 'Mar', currentYear: 15000, previousYear: 20000, growth: -25 },
      { name: 'Apr', currentYear: 22000, previousYear: 15000, growth: 46 },
      { name: 'May', currentYear: 28000, previousYear: 18000, growth: 55 },
      { name: 'Jun', currentYear: 32000, previousYear: 22000, growth: 45 },
    ];



    // Recent orders (Top 5)
    const recentOrders = await Order.find({}).sort({ createdAt: -1 }).limit(5).populate('user', 'firstName lastName email');
    const formattedRecentOrders = recentOrders.map(order => ({
      _id: order._id,
      customerName: order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest User',
      totalPrice: order.totalPrice,
      status: order.status || (order.isDelivered ? 'Delivered' : order.isPaid ? 'Processing' : 'Pending'),
      // Just pick the first item image for display
      image: order.orderItems.length > 0 ? order.orderItems[0].image : ''
    }));

    // Top selling products (sort by numReviews for now as a proxy, since we don't have soldCount explicitly)
    const topProducts = await Product.find({}).sort({ numReviews: -1 }).limit(4);
    const topSellingProducts = topProducts.map(p => ({
      _id: p._id,
      name: p.name,
      image: p.images && p.images.length > 0 ? p.images[0].url : '',
      sold: p.numReviews * 12 + Math.floor(Math.random() * 50) // Mock calculation
    }));

    res.json({
      totalLeads,
      totalCustomers,
      totalAppointments,
      totalRevenue,
      totalOrders,
      productsSold,
      inventory: {
        total: totalProducts,
        availablePercent: availableStockPercent,
        damagePercent: damageStockPercent
      },
      feedbacks: recentFeedbacks,
      salesData,
      recentOrders: formattedRecentOrders,
      orderStatusBreakdown: Object.keys(statuses).map(key => ({ name: key, value: statuses[key] })),
      topSellingProducts,
      customersOverview: {
        new: Math.floor(totalCustomers * 0.25),
        returning: Math.floor(totalCustomers * 0.75)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all leads
// @route   GET /api/admin/leads
// @access  Private/Admin
router.get('/leads', protect, requireRole('admin', 'superadmin', 'staff'), async (req, res) => {
  try {
    const leads = await Lead.find({}).populate('assignedTo', 'firstName lastName');
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create a lead
// @route   POST /api/admin/leads
// @access  Private/Admin
router.post('/leads', protect, requireRole('admin', 'superadmin', 'staff'), async (req, res) => {
  try {
    const lead = new Lead(req.body);
    const createdLead = await lead.save();
    res.status(201).json(createdLead);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

import { 
  getCustomers, getCustomerProfile, createCustomer, updateCustomer, deleteCustomer 
} from '../controllers/adminCustomerController.js';

// ... existing routes ...

// Customers Module
router.route('/customers')
  .get(protect, requireRole('admin', 'superadmin', 'staff'), getCustomers)
  .post(protect, requireRole('admin', 'superadmin', 'staff'), createCustomer);

router.route('/customers/:id')
  .get(protect, requireRole('admin', 'superadmin', 'staff'), getCustomerProfile)
  .put(protect, requireRole('admin', 'superadmin', 'staff'), updateCustomer)
  .delete(protect, requireRole('admin', 'superadmin'), deleteCustomer);

import {
  getAppointments, getAppointmentById, createAppointment, updateAppointment, deleteAppointment
} from '../controllers/adminAppointmentController.js';

// ... existing code ...

// Appointments Module
router.route('/appointments')
  .get(protect, requireRole('admin', 'superadmin', 'staff'), getAppointments)
  .post(protect, requireRole('admin', 'superadmin', 'staff'), createAppointment);

router.route('/appointments/:id')
  .get(protect, requireRole('admin', 'superadmin', 'staff'), getAppointmentById)
  .put(protect, requireRole('admin', 'superadmin', 'staff'), updateAppointment)
  .delete(protect, requireRole('admin', 'superadmin'), deleteAppointment);

import {
  getServices, getServiceById, createService, updateService, deleteService
} from '../controllers/adminServiceController.js';

// ... existing code ...

// Services Module
router.route('/services')
  .get(protect, requireRole('admin', 'superadmin', 'staff'), getServices)
  .post(protect, requireRole('admin', 'superadmin'), createService);

router.route('/services/:id')
  .get(protect, requireRole('admin', 'superadmin', 'staff'), getServiceById)
  .put(protect, requireRole('admin', 'superadmin'), updateService)
  .delete(protect, requireRole('admin', 'superadmin'), deleteService);

export default router;

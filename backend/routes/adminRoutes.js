import express from 'express';
import { protect, requireRole } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Lead from '../models/Lead.js';
import Appointment from '../models/Appointment.js';
import Invoice from '../models/Invoice.js';

const router = express.Router();

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
router.get('/dashboard', protect, requireRole('admin', 'superadmin'), async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'user' });
    const totalAppointments = await Appointment.countDocuments();
    
    // Calculate total revenue from paid invoices
    const invoices = await Invoice.find({ status: 'Paid' });
    const totalRevenue = invoices.reduce((acc, curr) => acc + curr.totalAmount, 0);

    res.json({
      totalLeads,
      totalCustomers,
      totalAppointments,
      totalRevenue,
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

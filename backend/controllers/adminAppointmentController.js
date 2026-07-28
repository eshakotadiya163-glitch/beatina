import Appointment from '../models/Appointment.js';
import User from '../models/User.js';

// @desc    Get all appointments
// @route   GET /api/admin/appointments
// @access  Private/Admin/Staff
export const getAppointments = async (req, res) => {
  try {
    let query = {};
    
    // Role-based access: staff can only see their own appointments
    if (req.user.role === 'staff') {
      query.staff = req.user._id;
    }

    // Apply filters if provided
    if (req.query.status) query.status = req.query.status;
    if (req.query.date) {
      const startOfDay = new Date(req.query.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(req.query.date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }
    if (req.query.staff && req.user.role !== 'staff') {
      query.staff = req.query.staff;
    }

    const appointments = await Appointment.find(query)
      .populate('customer', 'firstName lastName email phoneNumber')
      .populate('staff', 'firstName lastName')
      .populate('services', 'name price duration')
      .sort({ date: 1, timeSlot: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single appointment
// @route   GET /api/admin/appointments/:id
// @access  Private/Admin/Staff
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('customer', 'firstName lastName email phoneNumber')
      .populate('staff', 'firstName lastName')
      .populate('services', 'name price duration');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Role check
    if (req.user.role === 'staff' && appointment.staff._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this appointment' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create appointment
// @route   POST /api/admin/appointments
// @access  Private/Admin/Staff
export const createAppointment = async (req, res) => {
  try {
    const { customer, services, staff, date, timeSlot, notes } = req.body;

    const appointmentDate = new Date(date);
    
    // Prevent past bookings
    if (appointmentDate < new Date().setHours(0,0,0,0)) {
      return res.status(400).json({ message: 'Cannot book an appointment in the past' });
    }

    // Prevent double booking for the same staff member at the same time
    if (staff) {
      const doubleBooking = await Appointment.findOne({
        staff,
        date: {
          $gte: new Date(appointmentDate.setHours(0,0,0,0)),
          $lt: new Date(appointmentDate.setHours(23,59,59,999))
        },
        timeSlot,
        status: { $nin: ['Cancelled', 'No Show'] }
      });

      if (doubleBooking) {
        return res.status(400).json({ message: 'Staff member is already booked for this time slot' });
      }
    }

    const appointment = new Appointment({
      customer,
      services,
      staff: req.user.role === 'staff' ? req.user._id : staff, // Staff can only book for themselves
      date,
      timeSlot,
      notes
    });

    const createdAppointment = await appointment.save();
    res.status(201).json(createdAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update appointment
// @route   PUT /api/admin/appointments/:id
// @access  Private/Admin/Staff
export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Staff can only update status of their own appointments
    if (req.user.role === 'staff') {
      if (appointment.staff.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this appointment' });
      }
      
      // If staff, only allow status updates
      if (req.body.status) appointment.status = req.body.status;
      if (req.body.notes) appointment.notes = req.body.notes;
    } else {
      // Admins can update everything
      const { customer, services, staff, date, timeSlot, status, notes } = req.body;
      
      if (date && timeSlot && staff) {
         // Check double booking if changing time/staff
         const appointmentDate = new Date(date);
         const doubleBooking = await Appointment.findOne({
            _id: { $ne: appointment._id },
            staff,
            date: {
              $gte: new Date(appointmentDate.setHours(0,0,0,0)),
              $lt: new Date(appointmentDate.setHours(23,59,59,999))
            },
            timeSlot,
            status: { $nin: ['Cancelled', 'No Show'] }
          });
    
          if (doubleBooking) {
            return res.status(400).json({ message: 'Staff member is already booked for this time slot' });
          }
      }

      appointment.customer = customer || appointment.customer;
      appointment.services = services || appointment.services;
      appointment.staff = staff || appointment.staff;
      appointment.date = date || appointment.date;
      appointment.timeSlot = timeSlot || appointment.timeSlot;
      appointment.status = status || appointment.status;
      appointment.notes = notes || appointment.notes;
    }

    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/admin/appointments/:id
// @access  Private/Admin
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await Appointment.deleteOne({ _id: appointment._id });
    res.json({ message: 'Appointment removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

import { z } from 'zod';
import Service from '../models/Service.js';
import AuditLog from '../models/AuditLog.js';

const serviceSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  category: z.string().default('General'),
  description: z.string().optional(),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  duration: z.number().min(1, 'Duration must be greater than 0'),
  tax: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  isActive: z.boolean().default(true),
  featured: z.boolean().default(false),
  image: z.string().url().optional().or(z.literal('')),
});

// Helper to log audit
const logAudit = async (action, resource, user, details) => {
  try {
    await AuditLog.create({ action, resource, user, details });
  } catch (err) {
    console.error('Audit Log Error:', err);
  }
};

// @desc    Get all services
// @route   GET /api/admin/services
// @access  Private/Admin/Staff
export const getServices = async (req, res) => {
  try {
    const services = await Service.find({}).populate('createdBy', 'firstName lastName').sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single service
// @route   GET /api/admin/services/:id
// @access  Private/Admin/Staff
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create service
// @route   POST /api/admin/services
// @access  Private/Admin
export const createService = async (req, res) => {
  try {
    // Role check: Staff are View Only based on requirements
    if (req.user.role === 'staff') {
      return res.status(403).json({ message: 'Staff are not allowed to create services' });
    }

    const validatedData = serviceSchema.parse(req.body);

    const exists = await Service.findOne({ name: validatedData.name });
    if (exists) {
      return res.status(400).json({ message: 'Service with this name already exists' });
    }

    const service = new Service({
      ...validatedData,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    const createdService = await service.save();

    await logAudit('CREATE', 'Service', req.user._id, `Created service: ${createdService.name}`);

    res.status(201).json(createdService);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update service
// @route   PUT /api/admin/services/:id
// @access  Private/Admin
export const updateService = async (req, res) => {
  try {
    if (req.user.role === 'staff') {
      return res.status(403).json({ message: 'Staff are not allowed to edit services' });
    }

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const validatedData = serviceSchema.parse(req.body);

    // Check duplicate name
    if (validatedData.name !== service.name) {
      const exists = await Service.findOne({ name: validatedData.name });
      if (exists) {
        return res.status(400).json({ message: 'Service with this name already exists' });
      }
    }

    Object.assign(service, validatedData);
    service.updatedBy = req.user._id;

    const updatedService = await service.save();

    await logAudit('UPDATE', 'Service', req.user._id, `Updated service: ${updatedService.name}`);

    res.json(updatedService);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete service
// @route   DELETE /api/admin/services/:id
// @access  Private/Admin
export const deleteService = async (req, res) => {
  try {
    if (req.user.role === 'staff') {
      return res.status(403).json({ message: 'Staff are not allowed to delete services' });
    }

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await Service.deleteOne({ _id: service._id });

    await logAudit('DELETE', 'Service', req.user._id, `Deleted service: ${service.name}`);

    res.json({ message: 'Service removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

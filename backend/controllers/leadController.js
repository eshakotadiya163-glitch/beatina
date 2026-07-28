import Lead from '../models/Lead.js';
import AuditLog from '../models/AuditLog.js';

// @desc    Get all leads
// @route   GET /api/admin/leads
// @access  Private/Admin
const getLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find({}).populate('assignedTo', 'firstName lastName email');
    res.json(leads);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new lead
// @route   POST /api/admin/leads
// @access  Private/Admin
const createLead = async (req, res, next) => {
  try {
    const lead = await Lead.create(req.body);
    
    // Log action
    await AuditLog.create({
      user: req.user._id,
      action: 'CREATE_LEAD',
      resource: 'Lead',
      resourceId: lead._id,
      details: lead,
      ipAddress: req.ip
    });

    res.status(201).json(lead);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a lead
// @route   PUT /api/admin/leads/:id
// @access  Private/Admin
const updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if (lead) {
      await AuditLog.create({
        user: req.user._id,
        action: 'UPDATE_LEAD',
        resource: 'Lead',
        resourceId: lead._id,
        details: lead,
        ipAddress: req.ip
      });
      res.json(lead);
    } else {
      res.status(404);
      throw new Error('Lead not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a lead
// @route   DELETE /api/admin/leads/:id
// @access  Private/Admin
const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    
    if (lead) {
      await AuditLog.create({
        user: req.user._id,
        action: 'DELETE_LEAD',
        resource: 'Lead',
        resourceId: lead._id,
        ipAddress: req.ip
      });
      res.json({ message: 'Lead removed' });
    } else {
      res.status(404);
      throw new Error('Lead not found');
    }
  } catch (error) {
    next(error);
  }
};

export { getLeads, createLead, updateLead, deleteLead };

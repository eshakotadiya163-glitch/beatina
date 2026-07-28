import mongoose from 'mongoose';

const auditLogSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true, // e.g., 'CREATE_LEAD', 'UPDATE_INVOICE'
    },
    resource: {
      type: String,
      required: true, // e.g., 'Lead', 'Invoice'
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    details: {
      type: Object, // Store previous/new values or other metadata
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;

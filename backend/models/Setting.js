import mongoose from 'mongoose';

const settingSchema = mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true, // e.g., 'business_info', 'whatsapp_api', 'smtp'
    },
    value: {
      type: mongoose.Schema.Types.Mixed, // Can be object, string, boolean
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model('Setting', settingSchema);

export default Setting;

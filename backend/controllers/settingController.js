import asyncHandler from 'express-async-handler';
import Setting from '../models/Setting.js';

// @desc    Get all settings
// @route   GET /api/settings
// @access  Private/Admin
const getSettings = asyncHandler(async (req, res) => {
  const settings = await Setting.find({});
  // Convert array of settings to key-value object for frontend ease
  const settingsObj = {};
  settings.forEach(setting => {
    settingsObj[setting.key] = setting.value;
  });
  res.json(settingsObj);
});

// @desc    Update a setting
// @route   PUT /api/settings/:key
// @access  Private/Admin
const updateSetting = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;

  let setting = await Setting.findOne({ key });

  if (setting) {
    setting.value = value;
    setting.updatedBy = req.user._id;
    const updatedSetting = await setting.save();
    res.json(updatedSetting);
  } else {
    // Create new if not exists
    setting = new Setting({
      key,
      value,
      updatedBy: req.user._id
    });
    const createdSetting = await setting.save();
    res.status(201).json(createdSetting);
  }
});

export { getSettings, updateSetting };

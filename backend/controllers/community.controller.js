const CommunityAlert = require('../models/CommunityAlert');

// GET /api/community/alerts
exports.getAlerts = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, severity } = req.query;
    const query = { status: 'active' };
    if (type) query.alertType = type;
    if (severity) query.severity = severity;
    const alerts = await CommunityAlert.find(query).populate('reportedBy', 'name avatar').sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit);
    const total = await CommunityAlert.countDocuments(query);
    res.json({ success: true, alerts, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/community/report
exports.reportAlert = async (req, res) => {
  try {
    const { alertType, productName, brand, barcode, description, severity, location } = req.body;
    if (!alertType || !description) return res.status(400).json({ success: false, message: 'Alert type and description are required.' });
    const alert = await CommunityAlert.create({
      reportedBy: req.user._id, alertType, productName, brand, barcode, description, severity: severity || 'medium', location
    });
    res.status(201).json({ success: true, message: 'Alert reported. Thank you for keeping the community safe!', alert });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/community/upvote/:alertId
exports.upvoteAlert = async (req, res) => {
  try {
    const alert = await CommunityAlert.findById(req.params.alertId);
    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found.' });
    const alreadyUpvoted = alert.upvotedBy.includes(req.user._id);
    if (alreadyUpvoted) {
      alert.upvotedBy.pull(req.user._id);
      alert.upvotes = Math.max(0, alert.upvotes - 1);
    } else {
      alert.upvotedBy.push(req.user._id);
      alert.upvotes += 1;
    }
    await alert.save();
    res.json({ success: true, upvotes: alert.upvotes, upvoted: !alreadyUpvoted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

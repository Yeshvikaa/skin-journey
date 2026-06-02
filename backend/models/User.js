const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  age: { type: Number, min: 10, max: 100 },
  skinType: { type: String, enum: ['oily', 'dry', 'combination', 'sensitive', 'normal'], default: 'normal' },
  allergies: [{ type: String }],
  medications: [{ type: String }],
  healthConditions: [{ type: String }],
  avatar: { type: String, default: '' },
  location: {
    city: String,
    country: String,
    coordinates: { lat: Number, lng: Number }
  },
  periodSync: {
    enabled: { type: Boolean, default: false },
    lastPeriodDate: Date,
    cycleLength: { type: Number, default: 28 }
  },
  preferences: {
    notifications: { type: Boolean, default: true },
    emailAlerts: { type: Boolean, default: true },
    darkMode: { type: Boolean, default: false }
  },
  otp: { code: String, expiresAt: Date },
  isVerified: { type: Boolean, default: false },
  profileCompleted: { type: Boolean, default: false },
  glowScore: { type: Number, default: 0 },
  streakDays: { type: Number, default: 0 },
  lastActiveAt: { type: Date, default: Date.now }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.otp;
  return obj;
};

module.exports = mongoose.model('User', userSchema);

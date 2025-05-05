// في ملف userSchema.js
const mongoose = require('mongoose');



const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String },
  status: { type: String, enum: ['active', 'waiting'], default: 'waiting' },
  phoneNumber: { type: String, required: true, unique: true },
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date },
  goingDirection: { type: String, enum: ['to_university', 'from_university'], default: 'to_university' },
  transportType: { type: String, enum: ['tuk_tuk', 'uber'], default: 'tuk_tuk' },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: false
    }
  },
  direction : { type: String, enum: ['Going', 'Coming back'], default: 'Going' },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

userSchema.index({ location: '2dsphere' });
  
module.exports = mongoose.model('User', userSchema);


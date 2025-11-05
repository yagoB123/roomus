const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  compatibilityAnswers: [{
    questionId: Number,
    answer: Number
  }],
  preferences: {
    location: String,
    budget: {
      min: Number,
      max: Number
    },
    moveInDate: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add a method to calculate compatibility with another user
userSchema.methods.calculateCompatibility = function(otherUser) {
  if (!this.compatibilityAnswers || !otherUser.compatibilityAnswers) return 0;
  
  let score = 0;
  let totalQuestions = Math.min(this.compatibilityAnswers.length, otherUser.compatibilityAnswers.length);
  
  if (totalQuestions === 0) return 0;
  
  for (let i = 0; i < totalQuestions; i++) {
    const thisAnswer = this.compatibilityAnswers.find(a => a.questionId === i);
    const otherAnswer = otherUser.compatibilityAnswers.find(a => a.questionId === i);
    
    if (thisAnswer && otherAnswer) {
      // Calculate difference in answers (0-3 scale)
      const diff = Math.abs(thisAnswer.answer - otherAnswer.answer);
      // Convert to similarity score (0-100%)
      score += (1 - (diff / 3)) * 100;
    }
  }
  
  return Math.round(score / totalQuestions);
};

module.exports = mongoose.model('User', userSchema);

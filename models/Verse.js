const mongoose = require('mongoose');

const verseSchema = new mongoose.Schema({
  chapter: {
    type: Number,
    required: [true, 'Chapter number is required'],
    min: [1, 'Chapter number must be at least 1'],
    max: [18, 'Chapter number cannot exceed 18']
  },
  verse: {
    type: Number,
    required: [true, 'Verse number is required'],
    min: [1, 'Verse number must be at least 1']
  },
  sanskrit: {
    type: String,
    required: [true, 'Sanskrit text is required'],
    trim: true
  },
  transliteration: {
    type: String,
    required: [true, 'Transliteration is required'],
    trim: true
  },
  translation: {
    type: String,
    required: [true, 'Translation is required'],
    trim: true
  },
  meaning: {
    type: String,
    required: [true, 'Meaning is required'],
    trim: true
  },
  commentary: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for chapter and verse to ensure uniqueness
verseSchema.index({ chapter: 1, verse: 1 }, { unique: true });

// Virtual for full reference
verseSchema.virtual('reference').get(function() {
  return `${this.chapter}.${this.verse}`;
});

// Pre-save middleware to validate chapter-verse combination
verseSchema.pre('save', function(next) {
  if (this.chapter === 1 && this.verse > 47) {
    return next(new Error('Chapter 1 cannot have more than 47 verses'));
  }
  if (this.chapter === 2 && this.verse > 72) {
    return next(new Error('Chapter 2 cannot have more than 72 verses'));
  }
  // Add more chapter-specific validations as needed
  next();
});

// Static method to find verses by chapter
verseSchema.statics.findByChapter = function(chapter) {
  return this.find({ chapter, isActive: true }).sort({ verse: 1 });
};

// Instance method to get verse summary
verseSchema.methods.getSummary = function() {
  return {
    reference: this.reference,
    sanskrit: this.sanskrit,
    translation: this.translation,
    tags: this.tags
  };
};

module.exports = mongoose.model('Verse', verseSchema);

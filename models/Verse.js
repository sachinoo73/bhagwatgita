const mongoose = require('mongoose');

const verseSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
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
  slok: {
    type: String,
    required: [true, 'Sanskrit text (slok) is required'],
    trim: true
  },
  transliteration: {
    type: String,
    required: [true, 'Transliteration is required'],
    trim: true
  },
  // Multiple commentary objects
  tej: {
    author: String,
    ht: String,  // Hindi translation
    et: String   // English translation
  },
  siva: {
    author: String,
    et: String,  // English translation
    ec: String   // English commentary
  },
  purohit: {
    author: String,
    et: String
  },
  chinmay: {
    author: String,
    hc: String
  },
  san: {
    author: String,
    et: String
  },
  adi: {
    author: String,
    et: String
  },
  gambir: {
    author: String,
    et: String
  },
  madhav: {
    author: String,
    sc: String
  },
  anand: {
    author: String,
    sc: String
  },
  rams: {
    author: String,
    ht: String,
    hc: String
  },
  raman: {
    author: String,
    sc: String,
    et: String
  },
  abhinav: {
    author: String,
    sc: String,
    et: String
  },
  sankar: {
    author: String,
    ht: String,
    sc: String,
    et: String
  },
  jaya: {
    author: String,
    sc: String
  },
  vallabh: {
    author: String,
    sc: String
  },
  ms: {
    author: String,
    sc: String
  },
  srid: {
    author: String,
    sc: String
  },
  dhan: {
    author: String,
    sc: String
  },
  venkat: {
    author: String,
    sc: String
  },
  puru: {
    author: String,
    sc: String
  },
  neel: {
    author: String,
    sc: String
  },
  prabhu: {
    author: String,
    et: String,
    ec: String
  },
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

// Virtual for sanskrit (alias to slok for API compatibility)
verseSchema.virtual('sanskrit').get(function() {
  return this.slok;
});

// Virtual for translation (get first available English translation)
verseSchema.virtual('translation').get(function() {
  return this.tej?.et || this.siva?.et || this.purohit?.et || 
         this.chinmay?.et || this.san?.et || this.adi?.et || 
         this.gambir?.et || this.rams?.et || this.raman?.et || 
         this.abhinav?.et || this.sankar?.et || this.prabhu?.et || 
         'Translation not available';
});

// Virtual for meaning (get first available Hindi translation/commentary)
verseSchema.virtual('meaning').get(function() {
  return this.tej?.ht || this.siva?.ec || this.chinmay?.hc || 
         this.rams?.ht || this.sankar?.ht || 'Meaning not available';
});

// Virtual for commentary (get first available Sanskrit commentary)
verseSchema.virtual('commentary').get(function() {
  return this.sankar?.sc || this.anand?.sc || this.rams?.hc || 
         this.raman?.sc || this.abhinav?.sc || this.jaya?.sc || 
         this.vallabh?.sc || this.ms?.sc || this.srid?.sc || 
         this.dhan?.sc || this.venkat?.sc || this.puru?.sc || 
         this.neel?.sc || 'Commentary not available';
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
    tags: [`chapter-${this.chapter}`, `verse-${this.verse}`]
  };
};

// Try to connect to the slok collection, but be flexible
let Verse;
try {
  Verse = mongoose.model('Verse', verseSchema, 'slok');
} catch (error) {
  // If slok collection doesn't exist, try without specifying collection name
  try {
    Verse = mongoose.model('Verse', verseSchema);
  } catch (err) {
    // If that fails, create a new model
    Verse = mongoose.model('Verse', verseSchema);
  }
}

module.exports = Verse;

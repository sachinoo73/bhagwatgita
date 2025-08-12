const mongoose = require('mongoose');
require('dotenv').config({ path: '../config.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bhagwat_gita', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the old schema for reading existing data
const oldVerseSchema = new mongoose.Schema({
  _id: String,
  chapter: Number,
  verse: Number,
  slok: String,
  transliteration: String,
  tej: {
    author: String,
    ht: String,
    et: String
  },
  siva: {
    author: String,
    et: String,
    ec: String
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
  }
}, { strict: false });

const OldVerse = mongoose.model('OldVerse', oldVerseSchema, 'verses');

// Define the new schema for the transformed data
const newVerseSchema = new mongoose.Schema({
  chapter: {
    type: Number,
    required: true,
    min: 1,
    max: 18
  },
  verse: {
    type: Number,
    required: true,
    min: 1
  },
  sanskrit: {
    type: String,
    required: true,
    trim: true
  },
  transliteration: {
    type: String,
    required: true,
    trim: true
  },
  translation: {
    type: String,
    required: true,
    trim: true
  },
  meaning: {
    type: String,
    required: true,
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
  },
  // Store original commentaries for reference
  commentaries: {
    tej: Object,
    siva: Object,
    purohit: Object,
    chinmay: Object,
    san: Object,
    adi: Object,
    gambir: Object,
    madhav: Object,
    anand: Object,
    rams: Object,
    raman: Object,
    abhinav: Object,
    sankar: Object,
    jaya: Object,
    vallabh: Object,
    ms: Object,
    srid: Object,
    dhan: Object,
    venkat: Object,
    puru: Object,
    neel: Object,
    prabhu: Object
  }
}, {
  timestamps: true
});

// Create compound index
newVerseSchema.index({ chapter: 1, verse: 1 }, { unique: true });

const NewVerse = mongoose.model('NewVerse', newVerseSchema);

async function migrateData() {
  try {
    console.log('Starting data migration...');
    
    // Get all old verses
    const oldVerses = await OldVerse.find({});
    console.log(`Found ${oldVerses.length} verses to migrate`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const oldVerse of oldVerses) {
      try {
        // Transform the data
        const newVerseData = {
          chapter: oldVerse.chapter,
          verse: oldVerse.verse,
          sanskrit: oldVerse.slok || '',
          transliteration: oldVerse.transliteration || '',
          translation: oldVerse.tej?.et || oldVerse.siva?.et || oldVerse.purohit?.et || 
                     oldVerse.chinmay?.et || oldVerse.san?.et || oldVerse.adi?.et || 
                     oldVerse.gambir?.et || oldVerse.rams?.et || oldVerse.raman?.et || 
                     oldVerse.abhinav?.et || oldVerse.sankar?.et || oldVerse.prabhu?.et || 
                     'Translation not available',
          meaning: oldVerse.tej?.ht || oldVerse.siva?.ec || oldVerse.chinmay?.hc || 
                  oldVerse.rams?.ht || oldVerse.sankar?.ht || 'Meaning not available',
          commentary: oldVerse.sankar?.sc || oldVerse.anand?.sc || oldVerse.rams?.hc || 
                     oldVerse.raman?.sc || oldVerse.abhinav?.sc || oldVerse.jaya?.sc || 
                     oldVerse.vallabh?.sc || oldVerse.ms?.sc || oldVerse.srid?.sc || 
                     oldVerse.dhan?.sc || oldVerse.venkat?.sc || oldVerse.puru?.sc || 
                     oldVerse.neel?.sc || 'Commentary not available',
          tags: [
            'bhagwat-gita',
            `chapter-${oldVerse.chapter}`,
            `verse-${oldVerse.verse}`,
            'migrated'
          ],
          isActive: true,
          commentaries: {
            tej: oldVerse.tej,
            siva: oldVerse.siva,
            purohit: oldVerse.purohit,
            chinmay: oldVerse.chinmay,
            san: oldVerse.san,
            adi: oldVerse.adi,
            gambir: oldVerse.gambir,
            madhav: oldVerse.madhav,
            anand: oldVerse.anand,
            rams: oldVerse.rams,
            raman: oldVerse.raman,
            abhinav: oldVerse.abhinav,
            sankar: oldVerse.sankar,
            jaya: oldVerse.jaya,
            vallabh: oldVerse.vallabh,
            ms: oldVerse.ms,
            srid: oldVerse.srid,
            dhan: oldVerse.dhan,
            venkat: oldVerse.venkat,
            puru: oldVerse.puru,
            neel: oldVerse.neel,
            prabhu: oldVerse.prabhu
          }
        };
        
        // Check if verse already exists
        const existingVerse = await NewVerse.findOne({ 
          chapter: newVerseData.chapter, 
          verse: newVerseData.verse 
        });
        
        if (existingVerse) {
          // Update existing verse
          await NewVerse.findOneAndUpdate(
            { chapter: newVerseData.chapter, verse: newVerseData.verse },
            newVerseData,
            { new: true, runValidators: true }
          );
          console.log(`Updated verse ${newVerseData.chapter}.${newVerseData.verse}`);
        } else {
          // Create new verse
          const newVerse = new NewVerse(newVerseData);
          await newVerse.save();
          console.log(`Created verse ${newVerseData.chapter}.${newVerseData.verse}`);
        }
        
        successCount++;
      } catch (error) {
        console.error(`Error migrating verse ${oldVerse.chapter}.${oldVerse.verse}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\nMigration completed!');
    console.log(`Successfully migrated: ${successCount} verses`);
    console.log(`Errors: ${errorCount} verses`);
    
    // Show sample of migrated data
    const sampleVerse = await NewVerse.findOne({ chapter: 10, verse: 1 });
    if (sampleVerse) {
      console.log('\nSample migrated verse (10.1):');
      console.log(JSON.stringify(sampleVerse, null, 2));
    }
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run migration
migrateData();

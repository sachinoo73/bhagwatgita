const express = require('express');
const router = express.Router();
const Verse = require('../models/Verse');

// GET all verses with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, chapter, search, tags } = req.query;
    
    // Build filter object - temporarily remove isActive filter
    const filter = {};
    if (chapter) filter.chapter = parseInt(chapter);
    if (search) {
      filter.$or = [
        { slok: { $regex: search, $options: 'i' } },
        { transliteration: { $regex: search, $options: 'i' } },
        { 'tej.et': { $regex: search, $options: 'i' } },
        { 'siva.et': { $regex: search, $options: 'i' } },
        { 'tej.ht': { $regex: search, $options: 'i' } },
        { 'siva.ec': { $regex: search, $options: 'i' } }
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { chapter: 1, verse: 1 }
    };

    // Debug: Log the filter and model info
    console.log('Filter:', JSON.stringify(filter));
    console.log('Verse model:', Verse.modelName);
    console.log('Collection name:', Verse.collection.name);

    const verses = await Verse.find(filter)
      .sort(options.sort)
      .limit(options.limit)
      .skip((options.page - 1) * options.limit);

    const total = await Verse.countDocuments(filter);

    console.log(`Found ${verses.length} verses, total: ${total}`);

    res.json({
      verses,
      pagination: {
        currentPage: options.page,
        totalPages: Math.ceil(total / options.limit),
        totalItems: total,
        itemsPerPage: options.limit
      }
    });
  } catch (error) {
    console.error('Error in GET /:', error);
    res.status(500).json({ message: 'Error fetching verses', error: error.message });
  }
});

// GET verse by ID
router.get('/:id', async (req, res) => {
  try {
    const verse = await Verse.findById(req.params.id);
    if (!verse) {
      return res.status(404).json({ message: 'Verse not found' });
    }
    res.json(verse);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching verse', error: error.message });
  }
});

// GET verses by chapter
router.get('/chapter/:chapter', async (req, res) => {
  try {
    const chapter = parseInt(req.params.chapter);
    if (chapter < 1 || chapter > 18) {
      return res.status(400).json({ message: 'Chapter number must be between 1 and 18' });
    }
    
    // Temporarily remove isActive filter
    const verses = await Verse.find({ chapter }).sort({ verse: 1 });
    res.json({ chapter, verses, count: verses.length });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chapter verses', error: error.message });
  }
});

// GET verse by chapter and verse number
router.get('/:chapter/:verse', async (req, res) => {
  try {
    const chapter = parseInt(req.params.chapter);
    const verse = parseInt(req.params.verse);
    
    // Temporarily remove isActive filter
    const verseDoc = await Verse.findOne({ chapter, verse });
    if (!verseDoc) {
      return res.status(404).json({ message: 'Verse not found' });
    }
    
    // Return simplified verse data with virtual fields
    const simplifiedVerse = {
      _id: verseDoc._id,
      id: verseDoc.id,
      chapter: verseDoc.chapter,
      verse: verseDoc.verse,
      reference: verseDoc.reference,
      sanskrit: verseDoc.sanskrit, // Virtual field
      transliteration: verseDoc.transliteration,
      translation: verseDoc.translation, // Virtual field
      meaning: verseDoc.meaning, // Virtual field
      commentary: verseDoc.commentary, // Virtual field
      tags: [`chapter-${verseDoc.chapter}`, `verse-${verseDoc.verse}`],
      createdAt: verseDoc.createdAt,
      updatedAt: verseDoc.updatedAt
    };
    
    res.json(simplifiedVerse);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching verse', error: error.message });
  }
});

// GET verse by chapter and verse number with full commentaries
router.get('/:chapter/:verse/full', async (req, res) => {
  try {
    const chapter = parseInt(req.params.chapter);
    const verse = parseInt(req.params.verse);
    
    // Temporarily remove isActive filter
    const verseDoc = await Verse.findOne({ chapter, verse });
    if (!verseDoc) {
      return res.status(404).json({ message: 'Verse not found' });
    }
    
    // Return the full verse with all commentary data
    res.json({
      ...verseDoc.toObject(),
      message: 'Full verse data with commentaries retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching verse', error: error.message });
  }
});

// POST create new verse
router.post('/', async (req, res) => {
  try {
    const verse = new Verse(req.body);
    await verse.save();
    res.status(201).json({
      message: 'Verse created successfully',
      verse
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Verse already exists with this chapter and verse number' 
      });
    }
    res.status(400).json({ message: 'Error creating verse', error: error.message });
  }
});

// PUT update verse by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Remove fields that shouldn't be updated
    delete updateData._id;
    delete updateData.createdAt;
    
    const verse = await Verse.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!verse) {
      return res.status(404).json({ message: 'Verse not found' });
    }
    
    res.json({
      message: 'Verse updated successfully',
      verse
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Verse already exists with this chapter and verse number' 
      });
    }
    res.status(400).json({ message: 'Error updating verse', error: error.message });
  }
});

// PATCH partial update verse by ID
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Remove fields that shouldn't be updated
    delete updateData._id;
    delete updateData.createdAt;
    
    const verse = await Verse.findByIdAndUpdate(
      id, 
      { $set: updateData }, 
      { new: true, runValidators: true }
    );
    
    if (!verse) {
      return res.status(404).json({ message: 'Verse not found' });
    }
    
    res.json({
      message: 'Verse updated successfully',
      verse
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Verse already exists with this chapter and verse number' 
      });
    }
    res.status(400).json({ message: 'Error updating verse', error: error.message });
  }
});

// DELETE verse by ID (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const verse = await Verse.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!verse) {
      return res.status(404).json({ message: 'Verse not found' });
    }
    
    res.json({
      message: 'Verse deleted successfully',
      verse
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting verse', error: error.message });
  }
});

// DELETE verse permanently (hard delete)
router.delete('/:id/permanent', async (req, res) => {
  try {
    const verse = await Verse.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!verse) {
      return res.status(404).json({ message: 'Verse not found' });
    }
    
    res.json({
      message: 'Verse permanently deleted',
      verse
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting verse', error: error.message });
  }
});

// GET statistics
router.get('/stats/overview', async (req, res) => {
  try {
    // Temporarily remove isActive filter
    const stats = await Verse.aggregate([
      {
        $group: {
          _id: '$chapter',
          verseCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Temporarily remove isActive filter
    const totalVerses = await Verse.countDocuments({});
    const totalChapters = stats.length;
    
    res.json({
      totalVerses,
      totalChapters,
      chapterStats: stats
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});

// Debug endpoint to check database connection and collections
router.get('/debug/database', async (req, res) => {
  try {
    const db = Verse.db;
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    // Try to get a sample document from each collection
    const sampleDocs = {};
    for (const collectionName of collectionNames) {
      try {
        const sample = await db.collection(collectionName).findOne({});
        sampleDocs[collectionName] = {
          exists: true,
          sampleKeys: sample ? Object.keys(sample) : [],
          sampleCount: await db.collection(collectionName).countDocuments()
        };
      } catch (err) {
        sampleDocs[collectionName] = {
          exists: false,
          error: err.message
        };
      }
    }
    
    res.json({
      database: db.databaseName,
      collections: collectionNames,
      sampleDocs,
      verseModel: {
        modelName: Verse.modelName,
        collectionName: Verse.collection.name,
        schemaFields: Object.keys(Verse.schema.paths)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error checking database', 
      error: error.message,
      stack: error.stack
    });
  }
});

module.exports = router;

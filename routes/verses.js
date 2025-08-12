const express = require('express');
const router = express.Router();
const Verse = require('../models/Verse');

// GET all verses with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, chapter, search, tags } = req.query;
    
    // Build filter object
    const filter = { isActive: true };
    if (chapter) filter.chapter = parseInt(chapter);
    if (tags) filter.tags = { $in: tags.split(',') };
    if (search) {
      filter.$or = [
        { sanskrit: { $regex: search, $options: 'i' } },
        { transliteration: { $regex: search, $options: 'i' } },
        { translation: { $regex: search, $options: 'i' } },
        { meaning: { $regex: search, $options: 'i' } }
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { chapter: 1, verse: 1 }
    };

    const verses = await Verse.find(filter)
      .sort(options.sort)
      .limit(options.limit)
      .skip((options.page - 1) * options.limit);

    const total = await Verse.countDocuments(filter);

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
    
    const verses = await Verse.findByChapter(chapter);
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
    
    const verseDoc = await Verse.findOne({ chapter, verse, isActive: true });
    if (!verseDoc) {
      return res.status(404).json({ message: 'Verse not found' });
    }
    res.json(verseDoc);
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
    const verse = await Verse.findByIdAndDelete(req.params.id);
    
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
    const stats = await Verse.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$chapter',
          verseCount: { $sum: 1 },
          tags: { $addToSet: '$tags' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    const totalVerses = await Verse.countDocuments({ isActive: true });
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

module.exports = router;

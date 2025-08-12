# Bhagwat Gita Data Migration Guide

## Overview
This guide explains how to migrate your existing Bhagwat Gita verse data from the old format to the new API-compatible format.

## Problem
Your existing data has a different structure than what your API expects:
- **Old format**: Uses `slok`, `tej.et`, `siva.ec`, etc.
- **New format**: Uses `sanskrit`, `translation`, `meaning`, `commentary`

## Migration Process

### 1. Backup Your Data
Before running the migration, make sure you have a backup of your current database.

### 2. Run the Migration Script
```bash
cd scripts
./run-migration.sh
```

Or manually:
```bash
cd scripts
node migrate-data.js
```

### 3. What the Migration Does
The migration script will:
- Read all existing verses from your current collection
- Transform the data structure to match your new API schema
- Create new verses with the transformed data
- Preserve all original commentary data in a `commentaries` field
- Set appropriate default values for missing fields

### 4. Data Transformation Mapping
| Old Field | New Field | Notes |
|-----------|-----------|-------|
| `slok` | `sanskrit` | Sanskrit text |
| `tej.et` / `siva.et` / etc. | `translation` | English translation (first available) |
| `tej.ht` / `siva.ec` / etc. | `meaning` | Hindi translation/commentary (first available) |
| `sankar.sc` / `anand.sc` / etc. | `commentary` | Sanskrit commentary (first available) |
| All commentary objects | `commentaries` | Preserved in full |

### 5. After Migration
- Your API endpoints should work correctly
- The endpoint `/api/verses/4/24` should now return data
- All original commentary data is preserved
- New verses can be created using the standard API format

### 6. Testing
After migration, test your endpoints:
```bash
# Test the problematic endpoint
curl https://bhagwatgita-sk8b.onrender.com/api/verses/4/24

# Test other endpoints
curl https://bhagwatgita-sk8b.onrender.com/api/verses/1/1
curl https://bhagwatgita-sk8b.onrender.com/api/verses/chapter/4
```

## Troubleshooting

### Common Issues
1. **Connection Error**: Make sure your MongoDB connection string is correct in `config.env`
2. **Permission Error**: Ensure the migration script has execute permissions
3. **Data Not Found**: Check if your database has the expected collection name

### Rollback
If something goes wrong, you can restore from your backup. The migration script doesn't delete the original data.

## Schema Changes

### Before Migration
```javascript
{
  "_id": "BG10.1",
  "chapter": 10,
  "verse": 1,
  "slok": "श्रीभगवानुवाच...",
  "tej": { "author": "...", "et": "...", "ht": "..." },
  "siva": { "author": "...", "et": "...", "ec": "..." }
  // ... more commentary objects
}
```

### After Migration
```javascript
{
  "_id": "ObjectId...",
  "chapter": 10,
  "verse": 1,
  "sanskrit": "श्रीभगवानुवाच...",
  "transliteration": "...",
  "translation": "The Blessed Lord said...",
  "meaning": "भगवान् ने कहा...",
  "commentary": "सातवें और नवें अध्यायमें...",
  "tags": ["bhagwat-gita", "chapter-10", "verse-1", "migrated"],
  "isActive": true,
  "commentaries": {
    "tej": { "author": "...", "et": "...", "ht": "..." },
    "siva": { "author": "...", "et": "...", "ec": "..." }
    // ... all original commentary data preserved
  }
}
```

## Next Steps
After successful migration:
1. Test all your API endpoints
2. Update your frontend to use the new data structure
3. Consider adding more validation and error handling
4. Monitor your API performance

## Support
If you encounter issues during migration, check:
1. MongoDB connection and permissions
2. Database collection names
3. Data format consistency
4. Node.js version compatibility

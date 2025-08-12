# Bhagwat Gita Backend API

A complete Node.js/Express backend application with MongoDB integration for managing Bhagavad Gita verses. This application provides full CRUD operations with advanced features like pagination, filtering, and search.

## Features

- **Complete CRUD Operations**: Create, Read, Update, and Delete verses
- **Advanced Filtering**: Filter by chapter, tags, and search terms
- **Pagination**: Efficient data retrieval with page-based navigation
- **Data Validation**: Comprehensive input validation and error handling
- **Security**: Helmet, CORS, and rate limiting for production readiness
- **MongoDB Integration**: Robust database operations with Mongoose ODM
- **Sample Data**: Pre-loaded with authentic Bhagavad Gita verses

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BhagwatGita
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy the config file
   cp config.env.example config.env
   
   # Edit config.env with your MongoDB connection string
   MONGODB_URI=mongodb://localhost:27017/bhagwat_gita
   PORT=3000
   NODE_ENV=development
   ```

4. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

5. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

6. **Start the application**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Health Check
```
GET /health
```

### Verses

#### Get All Verses
```
GET /verses?page=1&limit=10&chapter=1&search=karma&tags=yoga,detachment
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `chapter`: Filter by chapter number (1-18)
- `search`: Search in sanskrit, transliteration, translation, and meaning
- `tags`: Filter by tags (comma-separated)

#### Get Verse by ID
```
GET /verses/:id
```

#### Get Verses by Chapter
```
GET /verses/chapter/:chapter
```

#### Get Verse by Chapter and Verse Number
```
GET /verses/:chapter/:verse
```

#### Create New Verse
```
POST /verses
```

**Request Body:**
```json
{
  "chapter": 1,
  "verse": 3,
  "sanskrit": "Sanskrit text here",
  "transliteration": "Transliteration here",
  "translation": "English translation",
  "meaning": "Detailed meaning",
  "commentary": "Optional commentary",
  "tags": ["tag1", "tag2"]
}
```

#### Update Verse
```
PUT /verses/:id
PATCH /verses/:id
```

#### Delete Verse (Soft Delete)
```
DELETE /verses/:id
```

#### Delete Verse Permanently
```
DELETE /verses/:id/permanent
```

#### Get Statistics
```
GET /verses/stats/overview
```

## Data Model

### Verse Schema
```javascript
{
  chapter: Number,        // Chapter number (1-18)
  verse: Number,          // Verse number within chapter
  sanskrit: String,       // Original Sanskrit text
  transliteration: String, // Romanized Sanskrit
  translation: String,     // English translation
  meaning: String,         // Detailed meaning
  commentary: String,      // Optional commentary
  tags: [String],          // Array of tags
  isActive: Boolean,       // Soft delete flag
  createdAt: Date,         // Creation timestamp
  updatedAt: Date          // Last update timestamp
}
```

## Usage Examples

### Using cURL

1. **Get all verses**
   ```bash
   curl http://localhost:3000/api/verses
   ```

2. **Create a new verse**
   ```bash
   curl -X POST http://localhost:3000/api/verses \
     -H "Content-Type: application/json" \
     -d '{
       "chapter": 1,
       "verse": 3,
       "sanskrit": "Test Sanskrit",
       "transliteration": "Test transliteration",
       "translation": "Test translation",
       "meaning": "Test meaning",
       "tags": ["test"]
     }'
   ```

3. **Update a verse**
   ```bash
   curl -X PUT http://localhost:3000/api/verses/VERS_ID \
     -H "Content-Type: application/json" \
     -d '{"translation": "Updated translation"}'
   ```

4. **Delete a verse**
   ```bash
   curl -X DELETE http://localhost:3000/api/verses/VERS_ID
   ```

### Using JavaScript/Fetch

```javascript
// Get verses with filters
const response = await fetch('/api/verses?chapter=2&search=karma&page=1&limit=5');
const data = await response.json();

// Create a new verse
const newVerse = await fetch('/api/verses', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    chapter: 1,
    verse: 4,
    sanskrit: "Sanskrit text",
    transliteration: "Transliteration",
    translation: "Translation",
    meaning: "Meaning",
    tags: ["spiritual"]
  })
});
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `500`: Internal Server Error

Error response format:
```json
{
  "message": "Error description",
  "error": "Detailed error information"
}
```

## Development

### Scripts
- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `npm run seed`: Seed database with sample data

### Project Structure
```
BhagwatGita/
├── models/          # Mongoose models
├── routes/          # API route handlers
├── utils/           # Utility functions
├── scripts/         # Database scripts
├── config.env       # Environment configuration
├── package.json     # Dependencies and scripts
├── server.js        # Main application file
└── README.md        # This file
```

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API request throttling
- **Input Validation**: Data sanitization and validation
- **Error Handling**: Secure error messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please create an issue in the repository.

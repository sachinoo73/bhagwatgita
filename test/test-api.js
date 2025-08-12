const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test configuration
const testConfig = {
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
};

// Test functions
async function testHealthCheck() {
  try {
    console.log('🔍 Testing health check...');
    const response = await axios.get(`${BASE_URL.replace('/api', '')}/health`, testConfig);
    console.log('✅ Health check passed:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

async function testGetVerses() {
  try {
    console.log('\n🔍 Testing GET /verses...');
    const response = await axios.get(`${BASE_URL}/verses`, testConfig);
    console.log('✅ Get verses passed. Count:', response.data.verses.length);
    console.log('📊 Pagination info:', response.data.pagination);
    return response.data.verses;
  } catch (error) {
    console.error('❌ Get verses failed:', error.message);
    return [];
  }
}

async function testGetVersesByChapter() {
  try {
    console.log('\n🔍 Testing GET /verses/chapter/1...');
    const response = await axios.get(`${BASE_URL}/verses/chapter/1`, testConfig);
    console.log('✅ Get verses by chapter passed. Count:', response.data.count);
    return response.data.verses;
  } catch (error) {
    console.error('❌ Get verses by chapter failed:', error.message);
    return [];
  }
}

async function testCreateVerse() {
  try {
    console.log('\n🔍 Testing POST /verses...');
    const newVerse = {
      chapter: 1,
      verse: 5,
      sanskrit: "Test Sanskrit Verse",
      transliteration: "Test transliteration",
      translation: "This is a test verse for API testing",
      meaning: "A test verse created to verify the API functionality",
      tags: ["test", "api", "demo"]
    };
    
    const response = await axios.post(`${BASE_URL}/verses`, newVerse, testConfig);
    console.log('✅ Create verse passed. ID:', response.data.verse._id);
    return response.data.verse._id;
  } catch (error) {
    console.error('❌ Create verse failed:', error.message);
    return null;
  }
}

async function testUpdateVerse(verseId) {
  if (!verseId) return false;
  
  try {
    console.log('\n🔍 Testing PUT /verses/:id...');
    const updateData = {
      translation: "Updated translation for testing purposes"
    };
    
    const response = await axios.put(`${BASE_URL}/verses/${verseId}`, updateData, testConfig);
    console.log('✅ Update verse passed. Updated:', response.data.verse.translation);
    return true;
  } catch (error) {
    console.error('❌ Update verse failed:', error.message);
    return false;
  }
}

async function testDeleteVerse(verseId) {
  if (!verseId) return false;
  
  try {
    console.log('\n🔍 Testing DELETE /verses/:id...');
    const response = await axios.delete(`${BASE_URL}/verses/${verseId}`, testConfig);
    console.log('✅ Delete verse passed. Deleted verse:', response.data.verse._id);
    return true;
  } catch (error) {
    console.error('❌ Delete verse failed:', error.message);
    return false;
  }
}

async function testSearchAndFilter() {
  try {
    console.log('\n🔍 Testing search and filter functionality...');
    
    // Test search
    const searchResponse = await axios.get(`${BASE_URL}/verses?search=karma`, testConfig);
    console.log('✅ Search passed. Found verses with "karma":', searchResponse.data.verses.length);
    
    // Test chapter filter
    const chapterResponse = await axios.get(`${BASE_URL}/verses?chapter=2`, testConfig);
    console.log('✅ Chapter filter passed. Chapter 2 verses:', chapterResponse.data.verses.length);
    
    // Test pagination
    const pageResponse = await axios.get(`${BASE_URL}/verses?page=1&limit=3`, testConfig);
    console.log('✅ Pagination passed. Page 1 with limit 3:', pageResponse.data.verses.length);
    
    return true;
  } catch (error) {
    console.error('❌ Search and filter tests failed:', error.message);
    return false;
  }
}

async function testStatistics() {
  try {
    console.log('\n🔍 Testing statistics endpoint...');
    const response = await axios.get(`${BASE_URL}/verses/stats/overview`, testConfig);
    console.log('✅ Statistics passed. Total verses:', response.data.totalVerses);
    console.log('📊 Chapter stats:', response.data.chapterStats.length, 'chapters');
    return true;
  } catch (error) {
    console.error('❌ Statistics test failed:', error.message);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  
  // Check if server is running
  const healthOk = await testHealthCheck();
  if (!healthOk) {
    console.log('\n❌ Server is not running. Please start the server first with: npm run dev');
    return;
  }
  
  // Run all tests
  const verses = await testGetVerses();
  await testGetVersesByChapter();
  const newVerseId = await testCreateVerse();
  await testUpdateVerse(newVerseId);
  await testDeleteVerse(newVerseId);
  await testSearchAndFilter();
  await testStatistics();
  
  console.log('\n🎉 All tests completed!');
  console.log('\n💡 To run these tests, make sure:');
  console.log('   1. MongoDB is running');
  console.log('   2. Server is started (npm run dev)');
  console.log('   3. Database is seeded (npm run seed)');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testHealthCheck,
  testGetVerses,
  testCreateVerse,
  testUpdateVerse,
  testDeleteVerse,
  testSearchAndFilter,
  testStatistics
};

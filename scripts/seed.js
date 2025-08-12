const mongoose = require('mongoose');
const Verse = require('../models/Verse');
require('dotenv').config({ path: './config.env' });

const sampleVerses = [
  {
    chapter: 1,
    verse: 1,
    sanskrit: "धृतराष्ट्र उवाच | धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः | मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ||१||",
    transliteration: "dhṛtarāṣṭra uvāca | dharma-kṣetre kuru-kṣetre samavetā yuyutsavaḥ | māmakāḥ pāṇḍavāś caiva kim akurvata sañjaya ||1||",
    translation: "Dhritarashtra said: O Sanjaya, what did my sons and the sons of Pandu do when they had assembled together, eager for battle, on the holy plain of Kurukshetra?",
    meaning: "This verse sets the scene for the entire Bhagavad Gita. Dhritarashtra, the blind king, asks his charioteer Sanjaya about the events on the battlefield of Kurukshetra, where the great war between the Kauravas and Pandavas is about to begin.",
    commentary: "The opening verse establishes the context - a battlefield where dharma (righteousness) is at stake. Kurukshetra is not just a physical location but a symbolic place where the eternal battle between good and evil, right and wrong, takes place.",
    tags: ["opening", "battlefield", "dharma", "kurukshetra"]
  },
  {
    chapter: 1,
    verse: 2,
    sanskrit: "सञ्जय उवाच | दृष्ट्वा तु पाण्डवानीकं व्यूढं दुर्योधनस्तदा | आचार्यमुपसङ्गम्य राजा वचनमब्रवीत् ||२||",
    transliteration: "sañjaya uvāca | dṛṣṭvā tu pāṇḍavānīkaṁ vyūḍhaṁ duryodhanas tadā | ācāryam upasaṅgamya rājā vacanam abravīt ||2||",
    translation: "Sanjaya said: Having seen the army of the Pandavas drawn up in battle array, King Duryodhana then approached his teacher (Drona) and spoke these words.",
    meaning: "Sanjaya describes how Duryodhana, seeing the well-organized Pandava army, approaches his teacher Drona to express his concerns and observations about the enemy forces.",
    commentary: "This verse shows Duryodhana's reaction to seeing the organized Pandava army. His approach to his teacher indicates both respect for authority and his need for guidance in this critical moment.",
    tags: ["army", "duryodhana", "drona", "battle-preparation"]
  },
  {
    chapter: 2,
    verse: 47,
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन | मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ||४७||",
    transliteration: "karmaṇy evādhikāras te mā phaleṣu kadācana | mā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi ||47||",
    translation: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself to be the cause of the results of your activities, nor be attached to inaction.",
    meaning: "This is one of the most famous verses of the Gita, teaching the principle of 'karma yoga' - the yoga of selfless action. It emphasizes doing one's duty without attachment to results.",
    commentary: "This verse encapsulates the essence of selfless service and detachment. It teaches that we should focus on the action itself rather than its outcome, which leads to inner peace and spiritual growth.",
    tags: ["karma-yoga", "detachment", "duty", "selfless-action", "famous"]
  },
  {
    chapter: 2,
    verse: 48,
    sanskrit: "योग: कर्मसु कौशलम् ||४८||",
    transliteration: "yogaḥ karmasu kauśalam ||48||",
    translation: "Yoga is skill in action.",
    meaning: "True yoga is the art of performing actions with skill and excellence, maintaining equanimity in success and failure.",
    commentary: "This concise verse defines yoga as the skillful performance of actions. It suggests that spiritual practice is not about avoiding work but about doing it with mastery and balance.",
    tags: ["yoga", "skill", "action", "excellence"]
  },
  {
    chapter: 4,
    verse: 7,
    sanskrit: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत | अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ||७||",
    transliteration: "yadā yadā hi dharmasya glānir bhavati bhārata | abhyutthānam adharmasya tadātmānaṁ sṛjāmy aham ||7||",
    translation: "Whenever and wherever there is a decline in religious practice, O descendant of Bharata, and a predominant rise of irreligion—at that time I descend Myself.",
    meaning: "This verse explains the concept of divine incarnation (avatar) - that God descends to earth whenever dharma declines and adharma (unrighteousness) increases.",
    commentary: "This verse establishes the principle of divine intervention in human affairs. It gives hope that whenever evil seems to prevail, divine help will manifest to restore balance and righteousness.",
    tags: ["avatar", "dharma", "divine-incarnation", "divine-intervention"]
  }
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bhagwat_gita', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await Verse.deleteMany({});
    console.log('Cleared existing verses');
    
    // Insert sample data
    const insertedVerses = await Verse.insertMany(sampleVerses);
    console.log(`Inserted ${insertedVerses.length} sample verses`);
    
    // Display inserted verses
    console.log('\nSample verses inserted:');
    insertedVerses.forEach(verse => {
      console.log(`Chapter ${verse.chapter}, Verse ${verse.verse}: ${verse.translation.substring(0, 50)}...`);
    });
    
    console.log('\nDatabase seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleVerses };

const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const mongoose = require('mongoose');

const app = express(); // Create an Express app

/* Define a route for the dashboard page
app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});*/

app.get('/dashboard-data', async (req, res) => {
  try {
    const users = await User.find({});
     // Retrieve and calculate other required data
    const accuracy100 = await History.countDocuments({accuracy: 100});
    const accuracy60 = await History.countDocuments({accuracy:60});
    const accuracy0 = await History.countDocuments({accuracy: 0});
    const historyEntries = await History.find({}).sort({ timestamp: -1 });

    // Create an object to store the count for each date
    const historyCountByDate = {};

    for (const entry of historyEntries) {
      const currentDate = new Date(entry.timestamp);
      const dateKey = currentDate.toDateString(); // Use the date string as the key

      if (historyCountByDate[dateKey]) {
        // Increment the count for the date
        historyCountByDate[dateKey]++;
      } else {
        // Initialize the count for the date
        historyCountByDate[dateKey] = 1;
      }
    }

    let streak = 0;
    let previousDate = null;

    for (const entry of historyEntries) {
      const currentDate = new Date(entry.timestamp);

      if (!previousDate) {
        // First entry
        previousDate = currentDate;
        streak = 1;
      } else {
        const timeDifference = previousDate.getTime() - currentDate.getTime();
        const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

        if (daysDifference === 1) {
          // Consecutive days
          streak++;
          previousDate = currentDate;
        } else {
          // Gap in entries, streak ended
          break;
        }
      }
    }

    //how much has been answered (how many documents are in history table?)
    //=> TBD: check next to "category" also if "history.username == CurrentUser.username"
    const answered = await History.countDocuments({});
    const answeredPercentage = (answered / 60 * 100).toFixed(2);

    const categoryGeography = await History.countDocuments({category: "geography"});
    const categoryVocabulary = await History.countDocuments({category: "vocabulary"});
    const categoryFacts = await History.countDocuments({category: "facts"});
    const categoryCulture = await History.countDocuments({category: "culture"});
    const categoryHistory = await History.countDocuments({category: "history"});

    const skillGeography = await History.countDocuments({category: "geography", accuracy: 100});
    const skillVocabulary = await History.countDocuments({category: "vocabulary", accuracy: 100});
    const skillFacts = await History.countDocuments({category: "facts", accuracy: 100});
    const skillCulture = await History.countDocuments({category: "culture", accuracy: 100});
    const skillHistory = await History.countDocuments({category: "history", accuracy: 100});
   
    const percentageVocabulary = (skillVocabulary / categoryVocabulary * 100).toFixed(2);
    const percentageGeography = (skillGeography / categoryGeography * 100).toFixed(2);
    const percentageFacts = (skillFacts / categoryFacts * 100).toFixed(2);
    const percentageCulture = (skillCulture / categoryCulture * 100).toFixed(2);
    const percentageHistory = (skillHistory / categoryHistory * 100).toFixed(2);

    //Individual
    //TBD: check next to "category" also if "user.username == CurrentUser.username"
    const categoryGeographyInd = await History.countDocuments({category: "geography"});
    const categoryVocabularyInd = await History.countDocuments({category: "vocabulary"});
    const categoryFactsInd = await History.countDocuments({category: "facts"});
    const categoryCultureInd = await History.countDocuments({category: "culture"});
    const categoryHistoryInd = await History.countDocuments({category: "history"});

    const skillGeographyInd = await History.countDocuments({category: "geography", accuracy: 100});
    const skillVocabularyInd = await History.countDocuments({category: "vocabulary", accuracy: 100});
    const skillFactsInd = await History.countDocuments({category: "facts", accuracy: 100});
    const skillCultureInd = await History.countDocuments({category: "culture", accuracy: 100});
    const skillHistoryInd = await History.countDocuments({category: "history", accuracy: 100});
   
    const percentageVocabularyInd = (skillVocabularyInd / categoryVocabularyInd * 100).toFixed(2);
    const percentageGeographyInd = (skillGeographyInd / categoryGeographyInd * 100).toFixed(2);
    const percentageFactsInd = (skillFactsInd / categoryFactsInd * 100).toFixed(2);
    const percentageCultureInd = (skillCultureInd / categoryCultureInd * 100).toFixed(2);
    const percentageHistoryInd = (skillHistoryInd / categoryHistoryInd * 100).toFixed(2);

    const userScores = [accuracy100, accuracy60, accuracy0];
    var skillsScores = [percentageVocabulary, percentageGeography, percentageFacts, percentageCulture, percentageHistory];
    var skillsScoresInd = [percentageVocabularyInd, percentageGeographyInd, percentageFactsInd, percentageCultureInd, percentageHistoryInd];
    
    const data = {
      usersList: users, 
      accuracy100: accuracy100, 
      accuracy60: accuracy60, 
      accuracy0: accuracy0,  
      percentageGeography: percentageGeography,
      percentageHistory: percentageHistory, 
      percentageFacts: percentageFacts, 
      percentageVocabulary: percentageVocabulary, 
      percentageCulture: percentageCulture,
      skillsScores: skillsScores, 
      userScores: userScores,
      answeredPercentage: answeredPercentage,
      streak:streak,
      historyCountByDate: historyCountByDate,
      percentageVocabularyInd:percentageVocabularyInd,
      percentageGeographyInd:percentageGeographyInd,
      percentageFactsInd:percentageFactsInd,
      percentageCultureInd:percentageCultureInd,
      percentageHistoryInd:percentageHistoryInd,
      skillsScoresInd:skillsScoresInd
      // Include other data properties
    };

   
    res.render('dashboard', { data });
      
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Set the static directory for serving HTML files
app.use(express.static(__dirname + '/public'));

app.use(express.static(path.join(__dirname, 'img')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//kill nodejs instances with: taskkill /f /im node.exe
const uri = "mongodb+srv://projectcountryrunner:PW@cluster0.jr9krae.mongodb.net/countryrunner?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const historySchema = new mongoose.Schema({
  _id: String,
  username: String,
  timestamp: String,
  category: String,
  question: String,
  correct_answer: Boolean,
  accuracy: Number,
  reward: Number
});

// Define the user schema
const userSchema = new mongoose.Schema({
  _id: String,
  username: String,
  score: Number
});

// Create the User model
const User = mongoose.model('User', userSchema, 'user');

// Create the History model
const History = mongoose.model('History', historySchema, 'history');

async function connectToDatabase() {

  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB!");

    app.listen(3000, () => {
      console.log('Server is listening on port 3000');
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}

app.get('/', async (req, res) => {

 try {
  users.forEach(user => {
    console.log("Username:", user.username);
    
   
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

async function run() {
  try {
    await client.connect(); // Connect the client to the server (optional starting in v4.7)
    await client.db("admin").command({ ping: 1 }); // Send a ping to confirm a successful connection
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    await connectToDatabase();
  } finally {
    await client.close(); // Ensures that the client will close when you finish/error
  }
}

run().catch(console.dir);
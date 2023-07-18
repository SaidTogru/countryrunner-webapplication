const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const ejs = require("ejs");
const path = require("path");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");

const app = express(); // Create an Express app

/* Define a route for the dashboard page
  app.get('/dashboard', (req, res) => {
  res.render('dashboard');
  });*/

app.get("/dashboard-data", async (req, res) => {
  try {
    const currentUser = await CurrentUser.findOne({});
    const currentUser_answered = await History.countDocuments({
      username: currentUser.username,
    });
    let data;
    if (currentUser_answered > 0) {
      const users = await User.find({});

      let count20 = 0;
      let count50 = 0;
      let count100 = 0;

      const totalGraphicalHotspots = await GraphicalHotspot.countDocuments();
      const totalImagebased = await ImageBased.countDocuments();
      const totalMultipleChoice = await MultipleChoice.countDocuments();
      const totalMultipleResponse = await MultipleResponse.countDocuments();
      const totalShortText = await ShortText.countDocuments();

      const totalQuestions =
        totalGraphicalHotspots +
        totalImagebased +
        totalMultipleChoice +
        totalMultipleResponse +
        totalShortText;

      for (const user of users) {
        const answered = await History.countDocuments({
          username: user.username,
        });

        const answeredPercentageAll = (
          (answered / totalQuestions) *
          100
        ).toFixed(2);

        // Check the ranges for different percentages
        if (parseFloat(answeredPercentageAll) > 20) {
          count20++;
        }
        if (parseFloat(answeredPercentageAll) > 50) {
          count50++;
        }
        if (parseFloat(answeredPercentageAll) === 100) {
          count100++;
        }
      }

      // Calculate the percentages
      const percentage20 = ((count20 / users.length) * 100).toFixed(2);
      const percentage50 = ((count50 / users.length) * 100).toFixed(2);
      const percentage100 = ((count100 / users.length) * 100).toFixed(2);

      // Retrieve and calculate other required data
      const accuracy100 = await History.countDocuments({
        accuracy: 100,
        username: `${currentUser.username}`,
      });
      const accuracy50 = await History.countDocuments({
        accuracy: 50,
        username: `${currentUser.username}`,
      });
      const accuracy0 = await History.countDocuments({
        accuracy: 0,
        username: `${currentUser.username}`,
      });
      const historyEntries = await History.find({})
      .sort({ timestamp: -1 });
    

      // Create an object to store the count for each date
const historyCountByDate = {};

for (const entry of historyEntries) {
  
  const currentDate = new Date(entry.timestamp);
  console.log(currentDate);
  
  const dateKey = currentDate.toDateString(); // Use the date string as the key
  console.log(dateKey);

  if (entry.username === currentUser.username) {
    if (historyCountByDate[dateKey]) {
      // If the date already exists in the historyCountByDate object, increment the count
      historyCountByDate[dateKey] = historyCountByDate[dateKey] + 1;
    } else {
      // If the date does not exist, initialize the count for the date
      historyCountByDate[dateKey] = 1;
    }
  }
}

      const historyCountByDateAvg = {};

      for (const entry of historyEntries) {
        const currentDate = new Date(entry.timestamp);
        const dateKey = currentDate.toDateString(); // Use the date string as the key

        if (historyCountByDateAvg[dateKey]) {
          // Increment the count for the date
          historyCountByDateAvg[dateKey].count += 1;
          historyCountByDateAvg[dateKey].userCount.add(entry.username);
        } else {
          // Initialize the count for the date
          historyCountByDateAvg[dateKey] = {
            count: 1,
            userCount: new Set([entry.username]),
          };
        }
      }



      for (const dateKey in historyCountByDateAvg) {
        const { count, userCount } = historyCountByDateAvg[dateKey];
        const average = count / userCount.size;
        const roundedAverage = parseFloat(average.toFixed(2));
        historyCountByDateAvg[dateKey] = roundedAverage;
      }

      const usersWithStreak = await User.find({
        streak: {
          $lt: currentUser.currentStreak,
        },
      }).countDocuments();
      const totalUsers = await User.countDocuments();
      const totalUsersWithoutCurrent = await User.countDocuments({
        username: { $ne: currentUser.username },
      });

      const streakPercentage = ((usersWithStreak / totalUsers) * 100).toFixed(
        2
      );
    
      const currentDate = new Date(); // Get the current date
      let currentStreak = 0;
      let previousDate = null;
      
      for (const entry of historyEntries) {
        const entryDate = new Date(entry.timestamp);
      
        // Check if entryDate is a valid date object and the username matches
        if (
          isNaN(entryDate.getTime()) ||
          entry.username !== currentUser.username
        ) {
          // Skip this entry and move to the next one
          continue;
        }
      
        if (!previousDate) {
          // First entry for the current user
          previousDate = entryDate;
          currentStreak = 1;
        } else {
          const timeDifference = previousDate.getTime() - entryDate.getTime();
          const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
      
          if (daysDifference === 1) {
            // Consecutive days for the current user
            currentStreak++;
            previousDate = entryDate;
          } else {
            // Gap in entries, streak ended
            currentStreak=0;
            break;
          }
        }
      }
      
      console.log(`Streak including the current day: ${currentStreak} days`);
      
      
      //how much has been answered (how many documents are in history table?)
      const answered = await History.countDocuments({
        username: `${currentUser.username}`,
      });

      const answeredPercentage = ((answered / totalQuestions) * 100).toFixed(2);

      const categoryGeography = await History.countDocuments({
        category: "geography",
      });
      const categoryVocabulary = await History.countDocuments({
        category: "vocabulary",
      });
      const categoryFacts = await History.countDocuments({
        category: "facts",
      });
      const categoryCulture = await History.countDocuments({
        category: "culture",
      });
      const categoryHistory = await History.countDocuments({
        category: "history",
      });

      const skillGeography = await History.countDocuments({
        category: "geography",
        accuracy: 100,
      });
      const skillVocabulary = await History.countDocuments({
        category: "vocabulary",
        accuracy: 100,
      });
      const skillFacts = await History.countDocuments({
        category: "facts",
        accuracy: 100,
      });
      const skillCulture = await History.countDocuments({
        category: "culture",
        accuracy: 100,
      });
      const skillHistory = await History.countDocuments({
        category: "history",
        accuracy: 100,
      });

      const percentageVocabulary = (
        (skillVocabulary / categoryVocabulary) *
        100
      ).toFixed(2);
      const percentageGeography = (
        (skillGeography / categoryGeography) *
        100
      ).toFixed(2);
      const percentageFacts = ((skillFacts / categoryFacts) * 100).toFixed(2);
      const percentageCulture = (
        (skillCulture / categoryCulture) *
        100
      ).toFixed(2);
      const percentageHistory = (
        (skillHistory / categoryHistory) *
        100
      ).toFixed(2);

      //Individual
      const categoryGeographyInd = await History.countDocuments({
        category: "geography",
        username: `${currentUser.username}`,
      });
      const categoryVocabularyInd = await History.countDocuments({
        category: "vocabulary",
        username: `${currentUser.username}`,
      });
      const categoryFactsInd = await History.countDocuments({
        category: "facts",
        username: `${currentUser.username}`,
      });
      const categoryCultureInd = await History.countDocuments({
        category: "culture",
        username: `${currentUser.username}`,
      });
      const categoryHistoryInd = await History.countDocuments({
        category: "history",
        username: `${currentUser.username}`,
      });

      const skillGeographyInd = await History.countDocuments({
        category: "geography",
        accuracy: 100,
        username: `${currentUser.username}`,
      });
      const skillVocabularyInd = await History.countDocuments({
        category: "vocabulary",
        accuracy: 100,
        username: `${currentUser.username}`,
      });
      const skillFactsInd = await History.countDocuments({
        category: "facts",
        accuracy: 100,
        username: `${currentUser.username}`,
      });
      const skillCultureInd = await History.countDocuments({
        category: "culture",
        accuracy: 100,
        username: `${currentUser.username}`,
      });
      const skillHistoryInd = await History.countDocuments({
        category: "history",
        accuracy: 100,
        username: `${currentUser.username}`,
      });

      const percentageVocabularyInd = (
        (skillVocabularyInd / categoryVocabularyInd) *
        100
      ).toFixed(2);
      const percentageGeographyInd = (
        (skillGeographyInd / categoryGeographyInd) *
        100
      ).toFixed(2);
      const percentageFactsInd = (
        (skillFactsInd / categoryFactsInd) *
        100
      ).toFixed(2);
      const percentageCultureInd = (
        (skillCultureInd / categoryCultureInd) *
        100
      ).toFixed(2);
      const percentageHistoryInd = (
        (skillHistoryInd / categoryHistoryInd) *
        100
      ).toFixed(2);

      const userScores = [accuracy100, accuracy50, accuracy0];
      var skillsScores = [
        percentageVocabulary,
        percentageGeography,
        percentageFacts,
        percentageCulture,
        percentageHistory,
      ];
      var skillsScoresInd = [
        percentageVocabularyInd,
        percentageGeographyInd,
        percentageFactsInd,
        percentageCultureInd,
        percentageHistoryInd,
      ];

      // Assuming you have the current user's username in the variable currentUsername

      // Retrieve the current user's score

      // Retrieve the current user document based on the username from the "users" table

      let currentUser2 = await User.findOne({ username: currentUser.username });

      if (!currentUser2) {
        // If no user is found, create a new one
        currentUser2 = new User({ username: currentUser.username, score: 0 });
        await currentUser2.save();
      }

      const currentUserScore = currentUser2.score;

      // Get the count of users with a score less than the current user's score
      const countUsersWithLessScore = await User.countDocuments({
        score: { $lt: currentUserScore },
      });

      // Calculate the percentage
      const worsePercentage = (
        (countUsersWithLessScore / totalUsersWithoutCurrent) *
        100
      ).toFixed(2);

      data = {
        history: true,
        usersList: users,
        accuracy100: accuracy100,
        accuracy50: accuracy50,
        accuracy0: accuracy0,
        percentageGeography: percentageGeography,
        percentageHistory: percentageHistory,
        percentageFacts: percentageFacts,
        percentageVocabulary: percentageVocabulary,
        percentageCulture: percentageCulture,
        skillsScores: skillsScores,
        userScores: userScores,
        answeredPercentage: answeredPercentage,
        currentStreak: currentStreak,
        historyCountByDate: historyCountByDate,
        percentageVocabularyInd: percentageVocabularyInd,
        percentageGeographyInd: percentageGeographyInd,
        percentageFactsInd: percentageFactsInd,
        percentageCultureInd: percentageCultureInd,
        percentageHistoryInd: percentageHistoryInd,
        skillsScoresInd: skillsScoresInd,
        currentUser: currentUser,
        percentage20: percentage20,
        percentage50: percentage50,
        percentage100: percentage100,
        streakPercentage: streakPercentage,
        worsePercentage: worsePercentage,
        historyCountByDateAvg: historyCountByDateAvg,
        // Include other data properties
      };
    } else {
      data = { history: false };
    }
    res.render("dashboard", {
      data,
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get("/feedback", async (req, res) => {
  try {
    const currentUser = await CurrentUser.findOne({});
    const currentUser_answered = await History.countDocuments({
      username: currentUser.username,
    });
    let data;
    if (currentUser_answered > 0) {
      const categoryGeographyInd = await History.countDocuments({
        category: "geography",
        username: `${currentUser.username}`,
      });
      const categoryVocabularyInd = await History.countDocuments({
        category: "vocabulary",
        username: `${currentUser.username}`,
      });
      const categoryFactsInd = await History.countDocuments({
        category: "facts",
        username: `${currentUser.username}`,
      });
      const categoryCultureInd = await History.countDocuments({
        category: "culture",
        username: `${currentUser.username}`,
      });
      const categoryHistoryInd = await History.countDocuments({
        category: "history",
        username: `${currentUser.username}`,
      });

      const skillGeographyInd = await History.countDocuments({
        category: "geography",
        accuracy: 100,
        username: `${currentUser.username}`,
      });
      const skillVocabularyInd = await History.countDocuments({
        category: "vocabulary",
        accuracy: 100,
        username: `${currentUser.username}`,
      });
      const skillFactsInd = await History.countDocuments({
        category: "facts",
        accuracy: 100,
        username: `${currentUser.username}`,
      });
      const skillCultureInd = await History.countDocuments({
        category: "culture",
        accuracy: 100,
        username: `${currentUser.username}`,
      });
      const skillHistoryInd = await History.countDocuments({
        category: "history",
        accuracy: 100,
        username: `${currentUser.username}`,
      });

      let percentageVocabularyInd = (
        (skillVocabularyInd / categoryVocabularyInd) *
        100
      ).toFixed(2);
      let percentageGeographyInd = (
        (skillGeographyInd / categoryGeographyInd) *
        100
      ).toFixed(2);
      let percentageFactsInd = (
        (skillFactsInd / categoryFactsInd) *
        100
      ).toFixed(2);
      let percentageCultureInd = (
        (skillCultureInd / categoryCultureInd) *
        100
      ).toFixed(2);
      let percentageHistoryInd = (
        (skillHistoryInd / categoryHistoryInd) *
        100
      ).toFixed(2);

      // Check if a variable is NaN and assign the string if true
      if (isNaN(percentageHistoryInd)) {
        percentageHistoryInd =
          "No question in this category has been answered yet!";
      }
      if (isNaN(percentageCultureInd)) {
        percentageCultureInd =
          "No question in this category has been answered yet!";
      }
      if (isNaN(percentageFactsInd)) {
        percentageFactsInd =
          "No question in this category has been answered yet!";
      }
      if (isNaN(percentageGeographyInd)) {
        percentageGeographyInd =
          "No question in this category has been answered yet!";
      }
      if (isNaN(percentageVocabularyInd)) {
        percentageVocabularyInd =
          "No question in this category has been answered yet!";
      }

      // TODO: feedbacke.ejs
      // TODO: on categories check if it is empty if yes instead of sending prompt to chatgpt display that the following category didnt get played yet
      // TODO: Learning Plan with learn type
      const currentUserHistory = await History.find({
        username: currentUser.username,
      }).select({ _id: 0, accuracy: 0, reward: 0 });
      let History_Correct = await History.find({
        username: currentUser.username,
        correct_answer: true,
      })
        .sort({ timestamp: -1 })
        .limit(5)
        .select({ _id: 0, accuracy: 0, reward: 0 });

      let History_Wrong = await History.find({
        username: currentUser.username,
        correct_answer: false,
      })
        .sort({ timestamp: -1 })
        .limit(5)
        .select({ _id: 0, accuracy: 0, reward: 0 });

      let History_History = await History.find({
        username: currentUser.username,
        category: "history",
      })
        .sort({ timestamp: -1 })
        .limit(5)
        .select({ _id: 0, accuracy: 0, reward: 0 });

      let History_Vocabulary = await History.find({
        username: currentUser.username,
        category: "vocabulary",
      })
        .sort({ timestamp: -1 })
        .limit(5)
        .select({ _id: 0, accuracy: 0, reward: 0 });

      let History_Facts = await History.find({
        username: currentUser.username,
        category: "facts",
      })
        .sort({ timestamp: -1 })
        .limit(5)
        .select({ _id: 0, accuracy: 0, reward: 0 });

      let History_Culture = await History.find({
        username: currentUser.username,
        category: "culture",
      })
        .sort({ timestamp: -1 })
        .limit(5)
        .select({ _id: 0, accuracy: 0, reward: 0 });

      let History_Geography = await History.find({
        username: currentUser.username,
        category: "geography",
      })
        .sort({ timestamp: -1 })
        .limit(5)
        .select({ _id: 0, accuracy: 0, reward: 0 });

      data = {
        history: true,
        API_KEY: process.env.API_KEY,
        history_json: currentUserHistory,
        percentageVocabularyInd: percentageVocabularyInd,
        percentageGeographyInd: percentageGeographyInd,
        percentageFactsInd: percentageFactsInd,
        percentageCultureInd: percentageCultureInd,
        percentageHistoryInd: percentageHistoryInd,
        History_Correct: History_Correct,
        History_Wrong: History_Wrong,
        History_History: History_History,
        History_Vocabulary: History_Vocabulary,
        History_Facts: History_Facts,
        History_Culture: History_Culture,
        History_Geography: History_Geography,
      };
    } else {
      data = { history: false };
    }
    res.render("feedback", {
      data,
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Set the static directory for serving HTML files
app.use(express.static(__dirname + "/public"));

app.use(express.static(path.join(__dirname, "img")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//kill nodejs instances with: taskkill /f /im node.exe
const uri = `mongodb+srv://projectcountryrunner:${process.env.DB_PASSWORD}@cluster0.jr9krae.mongodb.net/countryrunner?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const historySchema = new mongoose.Schema({
  username: String,
  timestamp: String,
  category: String,
  question: String,
  correct_answer: Boolean,
  accuracy: Number,
});

// Define the user schema
const userSchema = new mongoose.Schema({
  username: String,
  score: Number,
});

const currentSchema = new mongoose.Schema({
  _id: String,
  username: String,
});

const graphicalHotspotSchema = new mongoose.Schema({
  _id: String,
  question: String,
});

const imagebasedSchema = new mongoose.Schema({
  _id: String,
  item_type: String,
  category: String,
  question: String,
  image_url: String,
  options: Array,
  correct_responses: Array,
});

const multiplechoiceSchema = new mongoose.Schema({
  _id: String,
  item_type: String,
  question: String,
  options: Array,
  correct_responses: Array,
  category: String,
});

const multipleresponseSchema = new mongoose.Schema({
  _id: String,
  item_type: String,
  category: String,
  question: String,
  options: Array,
  correct_responses: Array,
});

const shorttextSchema = new mongoose.Schema({
  _id: String,
  item_type: String,
  question: String,
  category: String,
  max_length: Number,
  correct_answer: Array,
});

// Create the User model
const User = mongoose.model("User", userSchema, "user");

// Create the History model
const History = mongoose.model("History", historySchema, "history");

// Create the CurrentUser model
const CurrentUser = mongoose.model(
  "CurrentUser",
  currentSchema,
  "Current_User"
);

// Create the GraphicalHotspot model
const GraphicalHotspot = mongoose.model(
  "GraphicalHotspot",
  graphicalHotspotSchema,
  "GraphicalHotspotsData"
);

// Create the ImageBased
const ImageBased = mongoose.model(
  "ImageBased",
  imagebasedSchema,
  "ImageBasedMultiResponseData"
);

//Create MC
const MultipleChoice = mongoose.model(
  "MultipleChoice",
  multiplechoiceSchema,
  "MultipleChoiceData"
);

//Create MR
const MultipleResponse = mongoose.model(
  "MultipleResponse",
  multipleresponseSchema,
  "MultipleResponseData"
);

//Create ST
const ShortText = mongoose.model("ShortText", shorttextSchema, "ShortTextData");

async function connectToDatabase() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB!");

    app.listen(3000, () => {
      console.log("Server is listening on port 3000");
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}

app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const username = req.body.username; // get the username from the request body

    let currentUser = await User.findOne({ username: username });

    if (!currentUser) {
      // If no user is found, create a new one
      currentUser = new User({ username: username, score: 0 });
      await currentUser.save();
    }

    const result = await CurrentUser.findOneAndUpdate(
      {}, // empty filter means match any document in the collection
      { username: username }, // update the username field
      { new: true, upsert: true } // options: return updated doc and create if not exists
    );

    if (!result) {
      res.status(404).send({ message: "No document found to update." });
    } else {
      res.status(200).send(result); // send updated document
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

async function run() {
  try {
    await client.connect(); // Connect the client to the server (optional starting in v4.7)
    await client.db("admin").command({
      ping: 1,
    }); // Send a ping to confirm a successful connection
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    await connectToDatabase();
  } finally {
    await client.close(); // Ensures that the client will close when you finish/error
  }
}

run().catch(console.dir);

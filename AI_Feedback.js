// Select all the cards
const cards = document.querySelectorAll(".card");
let basic_prefix = `I have been participating in a quiz game featuring various question types like multiple choice and short answer, covering categories like vocabulary, history, geography, facts, and culture. The game tracks my performance history, recording correct and incorrect answers, along with their respective categories and question types.
    I would like personalized feedback on every question I answered, why correct or why wrong.
    `;
let advanced_prefix = `I have been participating in a quiz game featuring various question types like multiple choice and short answer, covering categories like vocabulary, history, geography, facts, and culture. The game tracks my performance history, recording correct and incorrect answers, along with their respective categories and question types.
    I would like personalized feedback based on my game performance, using established literature to ensure its effectiveness. Specifically, apply Hattie & Timperley's (2007) feedback model to my case. This model suggests that feedback should reduce the discrepancy between current performance and desired goals by addressing three questions: Where am I going (the goals)? How am I going (current status)? Where to next (improvements)?
    Feedback should operate at four levels: task, process, self-regulation, and self. The goal is to motivate learning and enhance performance. Also, consider Narciss's (2006, 2020) perspectives on feedback strategies and categories, and theories around timing, direct vs. indirect, and the quality of feedback.
    Using these guidelines, provide me with relevant, informative feedback that encourages self-assessment and a dialogic learning process.
    `;
let category_prefix = `I have been participating in a quiz game featuring various question types like multiple choice and short answer, covering categories like vocabulary, history, geography, facts, and culture. The game tracks my performance history, recording correct and incorrect answers, along with their respective categories and question types. 
    `;
let plan_prefix = `I am currently engaged in a multi-faceted quiz game which includes a variety of question formats such as multiple choice and short answer. The game spans a broad range of topics, including vocabulary, history, geography, general knowledge, and cultural studies. Importantly, it keeps a record of my performance history, including correct and incorrect responses, as well as the specific categories and question types. 
In your analysis, please take into consideration the following literature in the fields of e-assessment, learning analytics, and technology-enhanced learning: "Narciss (2006, 2020)" and "Hattie & Timperley (2007)", among others.
`;
let suffix = `Instructions:
Please structure your response using appropriate HTML formatting for better readability.
Utilize tags such as headings (h1, h2, etc.), lists (ul, ol, li), pre or code tags for code blocks, and other relevant HTML features as necessary.
Your answer should be comprehensive and well-structured.`;
let infix = ` Here is the data I can provide you with: 
`;
let chatOutput = document.getElementById("chat-output");
// Loop through the cards and add click event listeners
cards.forEach((card) => {
  card.addEventListener("click", async (event) => {
    // Get the chat output element
    chatOutput = document.getElementById("chat-output");
    // Make the outer div visible
    chatOutput.innerHTML = loadingAnimation;
    // Get the text from the span within the card

    var cardType = card.querySelector("span").id;
    if (cardType == "1") {
      var prompt =
        basic_prefix +
        `What were my mistakes?` +
        infix +
        "History of wrong answers: " +
        History_Wrong +
        "\n" +
        suffix;
    }
    if (cardType == "2") {
      var prompt =
        basic_prefix +
        `Where did I do well?` +
        infix +
        "History of correct answers: " +
        History_Correct +
        "\n" +
        suffix;
    }
    if (cardType == "3") {
      var base = `Based on my performance, what specific goals can I set for the next game? 
            This could be about improving my overall score or focusing on a specific category where you had more wrong answers.`;
      var prompt =
        advanced_prefix +
        base +
        infix +
        "History of answered questions: " +
        whole_history +
        +"\n" +
        "Percentage in the Vocabolury category: " +
        percentageVocabularyInd +
        "\n" +
        "Percentage in the Vocabolury geography: " +
        percentageGeographyInd +
        "\n" +
        "Percentage in the Vocabolury facts: " +
        percentageFactsInd +
        "\n" +
        "Percentage in the Vocabolury culture: " +
        percentageCultureInd +
        "\n" +
        "Percentage in the Vocabolury history: " +
        percentageHistoryInd +
        "\n" +
        suffix;
    }
    if (cardType == "4") {
      var base = `Considering my overall performance across all categories, can you provide elaborated feedback 
            that addresses my task understanding, self-regulation, and overall learning process to improve in all areas?`;
      var prompt =
        advanced_prefix +
        base +
        infix +
        "History of answered questions: " +
        whole_history +
        +"\n" +
        "Percentage in the Vocabolury category: " +
        percentageVocabularyInd +
        "\n" +
        "Percentage in the Vocabolury geography: " +
        percentageGeographyInd +
        "\n" +
        "Percentage in the Vocabolury facts: " +
        percentageFactsInd +
        "\n" +
        "Percentage in the Vocabolury culture: " +
        percentageCultureInd +
        "\n" +
        "Percentage in the Vocabolury history: " +
        percentageHistoryInd +
        "\n" +
        suffix;
    }
    if (cardType == "5") {
      var base = `Looking at the timestamps of my activities, 
            what insights can you share about my learning habits, and how might these affect my performance?`;
      var prompt =
        advanced_prefix +
        base +
        infix +
        "History of answered questions: " +
        whole_history +
        +"\n" +
        "Percentage in the Vocabolury category: " +
        percentageVocabularyInd +
        "\n" +
        "Percentage in the Vocabolury geography: " +
        percentageGeographyInd +
        "\n" +
        "Percentage in the Vocabolury facts: " +
        percentageFactsInd +
        "\n" +
        "Percentage in the Vocabolury culture: " +
        percentageCultureInd +
        "\n" +
        "Percentage in the Vocabolury history: " +
        percentageHistoryInd +
        "\n" +
        suffix;
    }
    if (cardType == "6") {
      var base = `Based on my accuracy records, how well am I performing in the vocabulary category, and how can I improve my percentage in vocabulary?`;
      var prompt =
        category_prefix +
        base +
        infix +
        "History of answered questions in the vocabulary category: " +
        History_Vocabulary +
        +"\n" +
        "Percentage in the vocabulary category: " +
        percentageVocabularyInd +
        "\n" +
        suffix;
    }
    if (cardType == "7") {
      var base = `Considering my geography-related question accuracy, how can I enhance my percentage in geography, and what learning strategies should I employ?`;
      var prompt =
        category_prefix +
        base +
        infix +
        "History of answered questions in the geography category: " +
        History_Geography +
        +"\n" +
        "Percentage in the geography category: " +
        percentageGeographyInd +
        "\n" +
        suffix;
    }
    if (cardType == "8") {
      var base = `Reflecting on my history questions accuracy and my percentage in history, what areas should I focus on to better understand or perform in this category?`;
      var prompt =
        category_prefix +
        base +
        infix +
        "History of answered questions in the history category: " +
        History_History +
        +"\n" +
        "Percentage in the history category: " +
        percentageHistoryInd +
        "\n" +
        suffix;
    }
    if (cardType == "9") {
      var base = `Reviewing my performance in the facts category, particularly focusing on my percentage in facts, what are my strengths and areas for improvement?`;
      var prompt =
        category_prefix +
        base +
        infix +
        "History of answered questions in the Facts category: " +
        History_Facts +
        +"\n" +
        "Percentage in the facts category: " +
        percentageFactsInd +
        "\n" +
        suffix;
    }
    if (cardType == "10") {
      var base = `Given my accuracy in culture-related questions and my percentage in culture, how should I adjust my learning strategies to improve in this category?`;
      var prompt =
        category_prefix +
        base +
        infix +
        "History of answered questions in the culture category: " +
        History_Culture +
        +"\n" +
        "Percentage in the culture category: " +
        percentageCultureInd +
        "\n" +
        suffix;
    }
    if (cardType == "11") {
      let selectElement = document.getElementById("personalized-option");
      let learn_type = selectElement.value;
      var base = `Given that I'm a ${learn_type} learner and considering my overall performance 
            and patterns identified in my learning history, could you provide a detailed 7-day ${learn_type}-oriented 
            learning plan to enhance my understanding across all categories, particularly 
            focusing on areas where my accuracy has been lower?`;
      var prompt =
        plan_prefix +
        base +
        infix +
        "History of answered questions: " +
        whole_history +
        +"\n" +
        "Percentage in the Vocabolury category: " +
        percentageVocabularyInd +
        "\n" +
        "Percentage in the Vocabolury geography: " +
        percentageGeographyInd +
        "\n" +
        "Percentage in the Vocabolury facts: " +
        percentageFactsInd +
        "\n" +
        "Percentage in the Vocabolury culture: " +
        percentageCultureInd +
        "\n" +
        "Percentage in the Vocabolury history: " +
        percentageHistoryInd +
        "\n" +
        suffix;
    }
    // Make the API request to ChatGPT
    var API_KEY = "<%- data.API_KEY %>";
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`, // Get from .env
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    // Parse the response
    const dataGPT = await response.json();

    // Get the chat output element
    chatOutput = document.getElementById("chat-output");
    // Display the content in the output field
    chatOutput.innerHTML = dataGPT.choices[0].message.content;
  });
});

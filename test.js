// Make the API request to ChatGPT
const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: "Bearer API_KEY", // Replace with your actual API Key
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
const data = await response.json();

// Get the chat output element
const chatOutput = document.getElementById("chat-output");

// Display the content in the output field
chatOutput.innerHTML = data.choices[0].message.content;


   document.addEventListener("DOMContentLoaded", () => {
    const chatForm = document.getElementById("chatForm");
    const userInput = document.getElementById("userInput");
    const chatMessages = document.getElementById("chatMessages");
    const sendButton = document.getElementById("sendButton");
  
    // Automatically resize the textarea as the user types
    userInput.addEventListener("input", () => {
      userInput.style.height = "auto";
      userInput.style.height = userInput.scrollHeight + "px";
    });
  
    // Handle form submission
    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Prevent page reload on form submit
      const message = userInput.value.trim();
      if (!message) return;
  
      // Display the user's message
      displayMessage(message, "user");
  
      // Clear the input field and disable the send button
      userInput.value = "";
      userInput.style.height = "auto";
      sendButton.disabled = true;
  
      try {
        // Generate AI response
        const responseMessage = await generateResponse(message);
        displayMessage(responseMessage, "bot");
      } catch (error) {
        displayMessage("Oops! Something went wrong. Please try again.", "error");
        console.error("Error generating response:", error);
      } finally {
        sendButton.disabled = false; // Re-enable the button
      }
    });
  
    // Function to generate AI response using the API
    async function generateResponse(prompt) {
      const apiKey = "AIzaSyDeMVGUbvzwjBI5_tAmgQQthrk693xALlE"; // Your API key
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${apiKey}`;
  
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: {
            text: prompt,
          },
          maxOutputTokens: 100, // Limit the response length
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text(); // Fetch the error response text
        console.error("API Response Error: ", errorText); // Log error details
        throw new Error("Failed to fetch response from the API.");
      }
  
      const data = await response.json();
      console.log("API Response:", data); // Debug: Log the full response object
  
      // Extract and return the response text
      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].output; // Adjust based on the response structure
      } else {
        throw new Error("No response generated by the model.");
      }
    }
  
    // Function to display messages in the chat
    function displayMessage(message, type) {
      const messageElement = document.createElement("div");
      messageElement.className = `message ${type}`;
      messageElement.innerHTML = `
        <div class="avatar">${type === "user" ? "You" : type === "bot" ? "AI" : "!"}</div>
        <div class="message-content">${message}</div>
      `;
      chatMessages.appendChild(messageElement);
  
      // Scroll to the latest message
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  });
  

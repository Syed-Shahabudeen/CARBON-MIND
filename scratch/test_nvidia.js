import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.NVIDIA_API_KEY;

async function test() {
  console.log("Testing NVIDIA API with key:", apiKey ? "Present" : "Missing");
  try {
    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "Accept": "application/json"
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-8b-instruct",
        max_tokens: 512,
        messages: [
          { role: "system", content: "You are a test bot." },
          { role: "user", content: "hello" }
        ],
      }),
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Test Error:", error);
  }
}

test();

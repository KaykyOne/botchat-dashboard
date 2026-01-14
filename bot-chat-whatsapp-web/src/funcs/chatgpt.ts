import OpenAI from "openai";

const chatgpt = new OpenAI({
  apiKey: process.env.KEY
});

export default chatgpt;

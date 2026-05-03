import OpenAI from "openai";

const chatgpt = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

export default chatgpt;

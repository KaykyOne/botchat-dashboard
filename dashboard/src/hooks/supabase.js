import { createClient } from "@supabase/supabase-js";

let client;

function getPublicEnv() {
  if (typeof window !== "undefined" && window.__BOTCHAT_PUBLIC_ENV__) {
    return window.__BOTCHAT_PUBLIC_ENV__;
  }

  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  };
}

function getSupabaseClient() {
  if (client) return client;

  const {
    NEXT_PUBLIC_SUPABASE_URL: apiURL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: apiKey,
  } = getPublicEnv();

  if (!apiURL || !apiKey) {
    if (typeof window === "undefined") {
      return null;
    }

    throw new Error("Supabase environment variables are missing.");
  }

  client = createClient(apiURL, apiKey);
  return client;
}

/** @type {any} */
const supabase = new Proxy(
  {},
  {
    get(_target, prop) {
      const currentClient = getSupabaseClient();

      if (!currentClient) {
        throw new Error("Supabase client is unavailable during prerender.");
      }

      const value = currentClient[prop];
      return typeof value === "function" ? value.bind(currentClient) : value;
    },
  }
);

export { supabase };

const path = require("path");

module.exports = {
  apps: [
    {
      name: "botchat-back",
      cwd: path.join(__dirname, "bot"),
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
      },
      autorestart: true,
      watch: false,
      time: true,
    },
    {
      name: "botchat-dashboard",
      cwd: path.join(__dirname, "dashboard"),
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        BOT_INTERNAL_URL: "http://127.0.0.1:3001",
      },
      autorestart: true,
      watch: false,
      time: true,
    },
  ],
};

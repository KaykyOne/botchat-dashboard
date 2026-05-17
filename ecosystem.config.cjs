module.exports = {
  apps: [
    {
      name: "botchat-dashboard-web",
      cwd: "./dashboard",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "botchat-dashboard-bot",
      cwd: "./bot",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
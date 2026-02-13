module.exports = {
  apps: [
    {
      name: "webscrape-notify",
      script: "src/index.js",
      cwd: __dirname,
      interpreter: "node",
      instances: 1,
      autorestart: true,
      watch: false,
      max_restarts: 10,
      min_uptime: "5s",
      time: true,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      error_file: "logs/pm2-error.log",
      out_file: "logs/pm2-out.log",
      merge_logs: true,
    },
  ],
};

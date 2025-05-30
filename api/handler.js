// handler.js
const awsServerlessExpress = require("aws-serverless-express");
const app = require("./index"); // if you renamed to app.js, change to './app'

const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
  return awsServerlessExpress.proxy(server, event, context);
};

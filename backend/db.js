const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/2fa");

const db = mongoose.connection;

db.on("error", (err) => {
  console.error(`MongoDB Error: ${err.message}`);
  process.exit(1);
});

db.once("open", () => {
  console.log("MongoDB connection successful");
});

require("./models");

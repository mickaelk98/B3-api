const mongoose = require("mongoose");
const MONGODB_LINK = process.env.MONGODB_LINK;

// Connect to the database
mongoose
  .connect(MONGODB_LINK, {})
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log(`MongoDB connection error: ${err}`));

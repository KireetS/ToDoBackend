const mongoose = require("mongoose");
const url = process.env.MONGO_URI;
const connectToMongo = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB ");
  } catch (err) {
    console.error("error connecting to MongoDB ", err);
  }
};
module.exports = connectToMongo;

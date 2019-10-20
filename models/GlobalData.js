const mongoose = require("mongoose");

const globalSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    email: String,
    photo: String,
    events: Array
  }
);

const GlobalData = mongoose.model("GlobalData", globalSchema);

module.exports = GlobalData;

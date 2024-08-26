const mongoose = require("mongoose");

const trainPositionSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true },
  lat: { type: Number, required: true },
  long: { type: Number, required: true },
  timeLogged: { type: Date, default: Date.now },
});

const TrainPosition = mongoose.model("TrainPosition", trainPositionSchema);

module.exports = TrainPosition;

const mongoose = require("mongoose");

const attendeeSchema = new mongoose.Schema({
  qrCode: { type: String, required: true, unique: true },
  entered: { type: Boolean, default: false },
});

module.exports = mongoose.model("Attendee", attendeeSchema);

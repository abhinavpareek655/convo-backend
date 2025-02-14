const mongoose = require("mongoose");
const Attendee = require("./models/Attendee"); // Import the model

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/convocationDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const attendees = [
  { qrCode: "QR12345", entered: false },
  { qrCode: "QR67890", entered: false },
  { qrCode: "QR11111", entered: false },
];

// Insert sample data
async function seedDB() {
  await Attendee.deleteMany({});
  await Attendee.insertMany(attendees);
  console.log("Sample attendees added!");
  mongoose.connection.close();
}

seedDB();

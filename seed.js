const mongoose = require("mongoose");
const xlsx = require("xlsx");
const path = require("path");

// MongoDB Connection URI
const mongoURI = "mongodb+srv://abhinavpareek566:abhinav123@cluster0.fry2v.mongodb.net/convocation?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Define Schema
const attendeeSchema = new mongoose.Schema({
  qrCode: { type: String, required: true, unique: true },
  entered: { type: Boolean, default: false },
});

const Attendee = mongoose.model("ids", attendeeSchema); // Ensure collection name matches "ids"

// Load and Parse Excel File BEFORE Connecting to MongoDB
const filePath = path.join(__dirname, "enroll_numbers.xlsx"); // Ensure the file exists
const workbook = xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[0]; // Read the first sheet

// Convert Excel Data to JSON (Assumes NO Column Name)
const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 }); // Reads as an array

// Sample Data
const sampleData = sheetData.map(row => ({
  qrCode: row[0], // Since there is no header, take the first column value
  entered: false
})).filter(entry => entry.qrCode); // Filter out empty rows

// Insert Data
async function insertData() {
  try {
    await Attendee.insertMany(sampleData, { ordered: false });
    console.log("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    mongoose.connection.close();
  }
}

insertData();

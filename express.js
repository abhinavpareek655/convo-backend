const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = "mongodb+srv://abhinavpareek566:abhinav123@cluster0.fry2v.mongodb.net/convocation?retryWrites=true&w=majority&appName=Cluster0";

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// Schema and Model
const EntrySchema = new mongoose.Schema({
    qrCode: { type: String, required: true, unique: true },
    entered: { type: Boolean, default: false },
});

const VariableSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true},
    value: { type: Number, default: 0},
});

const Entry = mongoose.model("ids", EntrySchema);
const Variable = mongoose.model("variables", VariableSchema);
// Check server status
app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is running" });
});

// Handle QR Code Entry
app.post("/api/update-entry", async (req, res) => {
    try {
        const { enrollmentNumber } = req.body;
        console.log(enrollmentNumber);

        let TotalEntries = await Variable.findOne({ name: "entryCount" });

        if (!enrollmentNumber) {
            return res.status(400).json({ message: "Invalid QR Code", count: TotalEntries.value });
        }
        let entry = await Entry.findOne({ qrCode: String(enrollmentNumber).trim() });
        if (!entry) {
            return res.status(404).json({ message: "Enrollment number not found", count: TotalEntries.value });
        }

        if (entry.entered) {
            return res.status(403).json({ message: "Entry Denied: Already Checked In", count: TotalEntries.value });
        }

        entry.entered = true;
        await entry.save();
        TotalEntries.value = TotalEntries.value + 1;
        await TotalEntries.save();
        res.status(200).json({ message: "Entry Granted", count:  TotalEntries.value });
    } catch (error) {
        console.error("Error updating entry:", error);
        res.status(500).json({ message: "Please Connect to Database" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

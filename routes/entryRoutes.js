const express = require("express");
const Attendee = require("../models/Attendee");

const router = express.Router();

// API to update entry status
router.post("/update-entry", async (req, res) => {
  const { qrCode } = req.body;

  try {
    const attendee = await Attendee.findOne({ qrCode });

    if (!attendee) {
      return res.status(404).json({ message: "Invalid QR Code" });
    }

    res.json({ message: `Entry ${attendee.entered ? "Revoked" : "Granted"}`, entered: attendee.entered });

    attendee.entered = true;
    await attendee.save();

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;

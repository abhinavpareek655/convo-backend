require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const entryRoutes = require("./routes/entryRoutes");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/api", entryRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));

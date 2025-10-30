// Import required packages
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from .env file
dotenv.config();

// Create an express app
const app = express();

// Middleware setup
app.use(express.json()); // allows reading JSON data
app.use(express.urlencoded({ extended: true })); // allows reading form data
app.use(express.static(path.join(__dirname, "public"))); // serves static files

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const mainRoutes = require("./routes/mainRoutes");
app.use("/", mainRoutes);

// Connect to MongoDB
console.log("MONGO_URI is:", process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

/**Define a test route
app.get("/", (req, res) => {
  res.render("index", { title: "Quiz App Home" });
});
**/

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
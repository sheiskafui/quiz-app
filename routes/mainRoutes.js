const express = require("express");
const router = express.Router();

// Home page route
router.get("/", (req, res) => {
  res.render("index", { title: "Quiz App Home" });
});

// Signup page route
router.get("/signup", (req, res) => {
  res.render("signup", { title: "Sign Up" });
});

// Login page route
router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

// Quiz selection page route
router.get("/quiz-selection", (req, res) => {
  res.render("quiz-selection", { title: "Choose Your Quiz" });
});

module.exports = router;
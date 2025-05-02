const express = require("express");
const app = express(); //instance of express
const hbs = require("hbs");
const path = require("path");
const session = require("express-session");
const nocache = require("nocache");


// Middleware to handle sessions
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
   // Set to true if using HTTPS
  })
);

// Middleware to prevent caching
app.use(nocache());

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files (for CSS, JS, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Set view engine and views directory
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views")); // Optional but recommended

// Routes
app.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/home"); // Redirect to home if already logged in
  } else {
    res.render("login", { msg: null }); // Show login page
  }
});

app.get("/home", (req, res) => {
  if (req.session.user) {
    res.render("home");
  } else {
    res.redirect("/");
  }
});

// Hardcoded credentials (if needed)
const username = "admin";
const password = "admin@123";


app.post("/verify", (req, res) => {
  const { username: inputUser, password: inputPass } = req.body;

  if (inputUser === username && inputPass === password) {
    req.session.user = inputUser; // Store user in session
    res.redirect("/home");
  } else {
    res.render("login", { msg: "Invalid username or password" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
});


app.listen(3000, () => {
  console.log("✅ Server is running on http://localhost:3000");
});

require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

/* ================= DATABASE ================= */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

/* ================= MIDDLEWARE ================= */

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

/* ================= CHECK AUTH ================= */

app.get("/check-auth", (req, res) => {
  if (req.session.userId) {
    res.json({ loggedIn: true, name: req.session.name });
  } else {
    res.json({ loggedIn: false });
  }
});

/* ================= REGISTER ================= */

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const check = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (check.rows.length > 0) {
      return res.json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1,$2,$3)",
      [name, email, hashed]
    );

    res.json({ message: "Registered Successfully" });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ================= LOGIN ================= */

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.json({ message: "Invalid Email" });
    }

    const valid = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!valid) {
      return res.json({ message: "Wrong Password" });
    }

    req.session.userId = user.rows[0].id;
    req.session.name = user.rows[0].name;

    res.json({ message: "Login Success" });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ================= LOGOUT ================= */

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

/* ================= LOAD QUESTIONS ================= */

const questions = require("./questions.json");

app.get("/questions", (req, res) => {
  if (!req.session.userId) {
    return res.json({ message: "Login Required" });
  }
  res.json(questions);
});

/* ================= SUBMIT ================= */

app.post("/submit", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.json({ message: "Login Required" });
    }

    let score = 0;

    questions.forEach(q => {
      if (req.body["q" + q.id] === q.correct) {
        score++;
      }
    });

    await pool.query(
      "INSERT INTO results (user_id, score, total) VALUES ($1,$2,$3)",
      [req.session.userId, score, questions.length]
    );

    const leaderboard = await pool.query(`
      SELECT users.name, results.score
      FROM results
      JOIN users ON users.id = results.user_id
      ORDER BY results.score DESC
    `);

    res.json({
      score,
      total: questions.length,
      leaderboard: leaderboard.rows
    });

  } catch (err) {
    console.error("Submit Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ================= START SERVER ================= */

app.listen(PORT, () => {
  console.log("Server Running on port " + PORT);
});
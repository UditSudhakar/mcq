require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

/* ================= DB CONNECTION ================= */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

/* ================= MIDDLEWARE ================= */

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

/* ================= HOME ROUTE ================= */

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

/* ================= QUESTIONS ================= */

const questions = require("./questions.json");

/* ================= INIT DATABASE ================= */

async function initDB() {

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      rollno TEXT
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS results (
      id SERIAL PRIMARY KEY,
      name TEXT,
      rollno TEXT,
      score INTEGER,
      total INTEGER
    );
  `);

  console.log("Tables Ready");
}

/* ================= REGISTER ================= */

app.post("/register", async (req, res) => {

  try {

    const { name, email, password, rollno } = req.body;

    const check = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (check.rows.length > 0) {
      return res.json({ message: "Email already exists" });
    }

    await pool.query(
      "INSERT INTO users (name,email,password,rollno) VALUES ($1,$2,$3,$4)",
      [name, email, password, rollno]
    );

    res.json({ message: "Registered Successfully" });

  } catch (err) {
    console.log(err);
    res.json({ message: "Register Error" });
  }

});

/* ================= LOGIN ================= */

app.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    /* ADMIN LOGIN */
    if (
      email === "Sudhakarudit@gmail.com" &&
      password === "omuditlaxmi"
    ) {
      return res.json({ message: "Admin Login Success", role: "admin" });
    }

    /* USER LOGIN */
    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.json({ message: "Invalid Email" });
    }

    if (user.rows[0].password !== password) {
      return res.json({ message: "Wrong Password" });
    }

    res.json({ message: "Login Success", role: "user" });

  } catch (err) {
    console.log(err);
    res.json({ message: "Login Error" });
  }

});

/* ================= QUESTIONS ================= */

app.get("/questions", (req, res) => {
  res.json(questions);
});

/* ================= SUBMIT ================= */

app.post("/submit", async (req, res) => {

  try {

    let score = 0;

    questions.forEach(q => {
      if (req.body["q" + q.id] === q.correct) {
        score++;
      }
    });

    const name = req.body.name || "Unknown";
    const rollno = req.body.rollno || "N/A";

    await pool.query(
      "INSERT INTO results (name, rollno, score, total) VALUES ($1,$2,$3,$4)",
      [name, rollno, score, questions.length]
    );

    const leaderboard = await pool.query(
      "SELECT * FROM results ORDER BY score DESC"
    );

    res.json({
      score,
      total: questions.length,
      leaderboard: leaderboard.rows
    });

  } catch (err) {
    console.log(err);
    res.json({ message: "Submit Error" });
  }

});

/* ================= START SERVER ================= */

async function startServer() {

  await initDB();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });

}

startServer();
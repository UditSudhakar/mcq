require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");

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

/* ================= QUESTIONS ================= */

const questions = require("./questions.json");

/* ================= INIT DB ================= */

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

/* ================= GET QUESTIONS ================= */

app.get("/questions", (req, res) => {
  res.json(questions);
});

/* ================= SUBMIT ================= */

app.post("/submit", async (req, res) => {

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
});

/* ================= START SERVER ================= */

async function startServer() {

  await initDB();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });

}

startServer();
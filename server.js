require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

const ADMIN_EMAIL = "Sudhakarudit@gmail.com";
const ADMIN_PASS = "omuditlaxmi";

/* REGISTER */
app.post("/register", async (req,res)=>{
  const { name,email,password,rollno } = req.body;

  const check = await pool.query("SELECT * FROM users WHERE email=$1",[email]);
  if(check.rows.length > 0) return res.json({message:"Email exists"});

  const hash = await bcrypt.hash(password,10);

  await pool.query(
    "INSERT INTO users(name,email,password,rollno) VALUES($1,$2,$3,$4)",
    [name,email,hash,rollno]
  );

  res.json({message:"Registered Successfully"});
});

/* LOGIN */
app.post("/login", async (req,res)=>{
  const { email,password } = req.body;

  if(email === ADMIN_EMAIL && password === ADMIN_PASS){
    req.session.admin = true;
    return res.json({message:"Admin Login Success"});
  }

  const user = await pool.query("SELECT * FROM users WHERE email=$1",[email]);
  if(user.rows.length === 0) return res.json({message:"Invalid Email"});

  const valid = await bcrypt.compare(password,user.rows[0].password);
  if(!valid) return res.json({message:"Wrong Password"});

  req.session.userId = user.rows[0].id;
  req.session.name = user.rows[0].name;

  res.json({message:"Login Success"});
});

/* QUESTIONS */
const questions = require("./questions.json");

app.get("/questions",(req,res)=>{
  if(!req.session.userId) return res.json({message:"Login Required"});
  res.json(questions);
});

/* SUBMIT */
app.post("/submit", async (req,res)=>{
  let score = 0;

  questions.forEach(q=>{
    if(req.body["q"+q.id] === q.correct){
      score++;
    }
  });

  await pool.query(
    "INSERT INTO results(user_id,score,total) VALUES($1,$2,$3)",
    [req.session.userId,score,questions.length]
  );

  const leaderboard = await pool.query(`
    SELECT users.name, users.rollno, results.score
    FROM results
    JOIN users ON users.id = results.user_id
    ORDER BY results.score DESC
  `);

  res.json({
    score,
    total: questions.length,
    leaderboard: leaderboard.rows
  });
});

app.listen(PORT,"0.0.0.0",()=>{
  console.log("Server Running");
});
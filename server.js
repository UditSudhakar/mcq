const express = require("express");
<<<<<<< HEAD
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

=======
const app = express();
const PORT = process.env.PORT || 3000;

>>>>>>> 6e832a6d8264f4bd95934682a4767a97dda05d2e
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

<<<<<<< HEAD
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
=======
let leaderboard = [];

const questions = [

{ id:1, unit:"UNIT I", question:"Which protocol transfers web pages?", options:["HTTP","FTP","SMTP","TCP"], correct:"HTTP" },
{ id:2, unit:"UNIT I", question:"Full form of URL?", options:["Uniform Resource Locator","User Record Link","Universal Link","None"], correct:"Uniform Resource Locator" },
{ id:3, unit:"UNIT I", question:"Which is a server-side language?", options:["PHP","HTML","CSS","XML"], correct:"PHP" },
{ id:4, unit:"UNIT I", question:"Which is example of web application?", options:["Gmail","Notepad","Paint","Calculator"], correct:"Gmail" },
{ id:5, unit:"UNIT I", question:"IDE stands for?", options:["Integrated Development Environment","Internal Dev Env","Internet Dev","None"], correct:"Integrated Development Environment" },

{ id:6, unit:"UNIT II", question:"HTML is used for?", options:["Structuring web pages","Styling","Database","Networking"], correct:"Structuring web pages" },
{ id:7, unit:"UNIT II", question:"Which attribute sets background color?", options:["bgcolor","color","font","style"], correct:"bgcolor" },
{ id:8, unit:"UNIT II", question:"Which list shows numbers?", options:["Ordered List","Unordered List","Definition List","Menu List"], correct:"Ordered List" },
{ id:9, unit:"UNIT II", question:"HTML form is used to?", options:["Collect user data","Style page","Play video","Create database"], correct:"Collect user data" },
{ id:10, unit:"UNIT II", question:"XML is mainly used for?", options:["Data storage and transfer","Designing","Gaming","Animation"], correct:"Data storage and transfer" },

{ id:11, unit:"UNIT III", question:"CSS stands for?", options:["Cascading Style Sheets","Color Style System","Creative Sheet","None"], correct:"Cascading Style Sheets" },
{ id:12, unit:"UNIT III", question:"ID selector symbol?", options:["#",".","*","&"], correct:"#"},
{ id:13, unit:"UNIT III", question:"Text color property?", options:["color","background","font","border"], correct:"color"},
{ id:14, unit:"UNIT III", question:"Inline CSS uses?", options:["style attribute","external file","database","head"], correct:"style attribute"},
{ id:15, unit:"UNIT III", question:"Margin controls?", options:["Outer space","Inner space","Color","Size"], correct:"Outer space" },

{ id:16, unit:"UNIT IV", question:"JavaScript is?", options:["Client-side scripting","Database","Server","Compiler"], correct:"Client-side scripting"},
{ id:17, unit:"UNIT IV", question:"Variable keyword in JavaScript?", options:["var","int","define","string"], correct:"var"},
{ id:18, unit:"UNIT IV", question:"Alert box function?", options:["alert()","prompt()","show()","msg()"], correct:"alert()"},
{ id:19, unit:"UNIT IV", question:"DOM stands for?", options:["Document Object Model","Data Object Mode","Digital Output","None"], correct:"Document Object Model"},
{ id:20, unit:"UNIT IV", question:"Which loop is valid in JS?", options:["for","repeat","cycle","iterate"], correct:"for"},

{ id:21, unit:"UNIT V", question:"PHP variable starts with?", options:["$","#","@","&"], correct:"$"},
{ id:22, unit:"UNIT V", question:"MySQL connection function?", options:["mysqli_connect()","connect()","mysql()","db()"], correct:"mysqli_connect()"},
{ id:23, unit:"UNIT V", question:"Session is used to?", options:["Store user data","Design page","Alert user","Create table"], correct:"Store user data"},
{ id:24, unit:"UNIT V", question:"Inheritance belongs to?", options:["OOP","HTML","CSS","Loop"], correct:"OOP"},
{ id:25, unit:"UNIT V", question:"PHP is?", options:["Server-side language","Browser","Protocol","Tag"], correct:"Server-side language"}

];

app.get("/questions",(req,res)=>{ res.json(questions); });

app.post("/submit",(req,res)=>{

let score = 0;
let name = req.body.name || "Unknown";

questions.forEach(q=>{
if(req.body["q"+q.id]===q.correct){ score++; }
});

leaderboard.push({ name:name, score:score });
leaderboard.sort((a,b)=> b.score - a.score);

res.json({
score:score,
total:questions.length,
leaderboard:leaderboard
});

});

app.listen(PORT,()=>{ console.log("Server running"); });
>>>>>>> 6e832a6d8264f4bd95934682a4767a97dda05d2e

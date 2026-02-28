require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const User = require("./models/User");
const Result = require("./models/Result");

const app = express();
const PORT = process.env.PORT || 3000;

/* ================= DATABASE ================= */

mongoose.connect("mongodb+srv://uditsudhakar:udit1234@udit.vvxf0oq.mongodb.net/mcq?retryWrites=true&w=majority")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

/* ================= MIDDLEWARE ================= */

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:false
}));

/* ================= QUESTIONS ================= */

const questions = require("./questions.json");

app.get("/questions",(req,res)=>{
  res.json(questions);
});

/* ================= AUTH CHECK ================= */

app.get("/check-auth",(req,res)=>{
  res.json({loggedIn: !!req.session.userId});
});

/* ================= REGISTER ================= */

app.post("/register", async (req,res)=>{
  const {name,email,password} = req.body;

  if(!name || !email || !password){
    return res.json({message:"All fields required"});
  }

  const existing = await User.findOne({email});
  if(existing){
    return res.json({message:"Email already registered"});
  }

  const hashed = await bcrypt.hash(password,10);

  await new User({
    name,
    email,
    password: hashed
  }).save();

  res.json({message:"Registered Successfully"});
});

/* ================= LOGIN ================= */

app.post("/login", async (req,res)=>{
  const {email,password} = req.body;

  const user = await User.findOne({email});
  if(!user){
    return res.json({message:"Invalid Email"});
  }

  const match = await bcrypt.compare(password,user.password);
  if(!match){
    return res.json({message:"Wrong Password"});
  }

  req.session.userId = user._id;
  req.session.role = user.role;

  res.json({message:"Login Success"});
});

/* ================= LOGOUT ================= */

app.get("/logout",(req,res)=>{
  req.session.destroy(()=>{
    res.redirect("/");
  });
});

/* ================= SUBMIT EXAM ================= */

app.post("/submit", async (req,res)=>{

  if(!req.session.userId){
    return res.json({message:"Login Required"});
  }

  let score = 0;

  questions.forEach(q=>{
    if(req.body["q"+q.id] === q.correct){
      score++;
    }
  });

  await new Result({
    userId: req.session.userId,
    score,
    total: questions.length
  }).save();

  const leaderboardData = await Result.find()
  .populate("userId","name")
  .sort({score:-1});

  const leaderboard = leaderboardData.map(r=>({
    name: r.userId.name,
    score: r.score
  }));

  res.json({
    score,
    total: questions.length,
    leaderboard
  });
});

/* ================= ADMIN DATA ================= */

app.get("/admin-data", async (req,res)=>{
  if(req.session.role !== "admin"){
    return res.json({message:"Unauthorized"});
  }

  const users = await User.find();
  const results = await Result.find().populate("userId","name");

  res.json({users,results});
});

app.listen(PORT,()=>console.log("Server Running"));
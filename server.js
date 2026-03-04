const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

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

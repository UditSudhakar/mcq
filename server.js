const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const questions = [

{ id:1, question:"Which protocol transfers web pages?", options:["HTTP","FTP","SMTP","TCP"], correct:"HTTP" },
{ id:2, question:"Full form of URL?", options:["Uniform Resource Locator","User Record Link","Universal Link","None"], correct:"Uniform Resource Locator" },
{ id:3, question:"Which is a server-side language?", options:["PHP","HTML","CSS","XML"], correct:"PHP" },
{ id:4, question:"Which is example of web application?", options:["Gmail","Notepad","Paint","Calculator"], correct:"Gmail" },
{ id:5, question:"IDE stands for?", options:["Integrated Development Environment","Internal Dev Env","Internet Dev","None"], correct:"Integrated Development Environment" },

{ id:6, question:"HTML is used for?", options:["Structuring web pages","Styling","Database","Networking"], correct:"Structuring web pages" },
{ id:7, question:"Which attribute sets background color?", options:["bgcolor","color","font","style"], correct:"bgcolor" },
{ id:8, question:"Which list shows numbers?", options:["Ordered List","Unordered List","Definition List","Menu List"], correct:"Ordered List" },
{ id:9, question:"HTML form is used to?", options:["Collect user data","Style page","Play video","Create database"], correct:"Collect user data" },
{ id:10, question:"XML is mainly used for?", options:["Data storage and transfer","Designing","Gaming","Animation"], correct:"Data storage and transfer" },

{ id:11, question:"CSS stands for?", options:["Cascading Style Sheets","Color Style System","Creative Sheet","None"], correct:"Cascading Style Sheets" },
{ id:12, question:"ID selector symbol?", options:["#",".","*","&"], correct:"#"},
{ id:13, question:"Text color property?", options:["color","background","font","border"], correct:"color"},
{ id:14, question:"Inline CSS uses?", options:["style attribute","external file","database","head"], correct:"style attribute"},
{ id:15, question:"Margin controls?", options:["Outer space","Inner space","Color","Size"], correct:"Outer space" },

{ id:16, question:"JavaScript is?", options:["Client-side scripting","Database","Server","Compiler"], correct:"Client-side scripting"},
{ id:17, question:"Variable keyword in JavaScript?", options:["var","int","define","string"], correct:"var"},
{ id:18, question:"Alert box function?", options:["alert()","prompt()","show()","msg()"], correct:"alert()"},
{ id:19, question:"DOM stands for?", options:["Document Object Model","Data Object Mode","Digital Output","None"], correct:"Document Object Model"},
{ id:20, question:"Which loop is valid in JS?", options:["for","repeat","cycle","iterate"], correct:"for"},

{ id:21, question:"PHP variable starts with?", options:["$","#","@","&"], correct:"$"},
{ id:22, question:"MySQL connection function?", options:["mysqli_connect()","connect()","mysql()","db()"], correct:"mysqli_connect()"},
{ id:23, question:"Session is used to?", options:["Store user data","Design page","Alert user","Create table"], correct:"Store user data"},
{ id:24, question:"Inheritance belongs to?", options:["OOP","HTML","CSS","Loop"], correct:"OOP"},
{ id:25, question:"PHP is?", options:["Server-side language","Browser","Protocol","Tag"], correct:"Server-side language"}

];

app.get("/questions", (req,res)=>{ res.json(questions); });

app.post("/submit",(req,res)=>{
let score=0;
questions.forEach(q=>{
if(req.body["q"+q.id]===q.correct){ score++; }
});
res.json({score:score,total:questions.length});
});

app.listen(PORT,()=>{ console.log("Server running"); });
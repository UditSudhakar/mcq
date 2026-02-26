<!DOCTYPE html>
<html>
<head>
    <title>Result</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<h2>Exam Result</h2>

<h3 id="result"></h3>

<script>

let score = localStorage.getItem("score");
let total = localStorage.getItem("total");

document.getElementById("result").innerHTML =
"Your Score: " + score + " / " + total;

</script>

</body>
</html>

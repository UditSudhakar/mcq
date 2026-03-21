/* ================= SUBMIT ================= */

app.post("/submit", async (req,res)=>{

  let score = 0;

  questions.forEach(q=>{
    if(req.body["q"+q.id] === q.correct){
      score++;
    }
  });

  const name = req.body.name;
  const rollno = req.body.rollno || "N/A";

  /* 🔥 DUPLICATE FIX */
  const existing = await pool.query(
    "SELECT * FROM results WHERE name=$1",
    [name]
  );

  if(existing.rows.length > 0){
    await pool.query(
      "UPDATE results SET score=$1, total=$2 WHERE name=$3",
      [score, questions.length, name]
    );
  }else{
    await pool.query(
      "INSERT INTO results (name,rollno,score,total) VALUES ($1,$2,$3,$4)",
      [name,rollno,score,questions.length]
    );
  }

  const leaderboard = await pool.query(
    "SELECT * FROM results ORDER BY score DESC"
  );

  res.json({
    score,
    total: questions.length,
    leaderboard: leaderboard.rows
  });

});
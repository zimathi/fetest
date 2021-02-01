const express = require('express');
const mysql = require('mysql');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sunanext244',
  database: 'nodeapp'
});

connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success');
});


app.get('/',(req, res) => {
      res.render('top.ejs');
    }
  );

app.get('/top',(req, res) => {
      res.render('top.ejs');
    }
  );


app.get('/index',(req, res) => {
  connection.query(
    'SELECT * FROM lists',
    (error, results) => {
      console.log(results);
      res.render('index.ejs',{lists: results});
    }
  );
});


app.get("/quiz",(req,res) => {
  connection.query(
    "SELECT * FROM lists ORDER BY RAND() LIMIT 1",
    // [],
      (error,results)=>{
      res.render("quiz.ejs", {list: results[0]});
    }
  );
});


app.get("/new",(req,res) => {
  res.render("new.ejs");
})

app.post("/create",(req,res)=>{
  const que = req.body.que;
  const ans = req.body.ans;
  connection.query(
    "INSERT INTO lists (Q,A) values (?,?)",
    [que,ans],
    (error,results) => {
      res.redirect("/top");
    }
  );
});

app.get("/delete/:id",(req,res)=>{
  connection.query(
    "select * from lists where id =?",
    [req.params.id],
      (error,results)=>{
        res.render("delete.ejs", {list: results[0]});
      }
  );
});


app.post("/delete/:id",(req,res)=>{
  connection.query(
    "delete from lists where id = ?",
    [req.params.id],
    (error,results) => {
      res.redirect("/index");
    });
  });

app.get("/edit/:id",(req,res)=>{
  connection.query(
    "select * from lists where id =?",
    [req.params.id],
      (error,results)=>{
        res.render("edit.ejs", {list: results[0]});
      }
  );
});

app.post("/update/:id",(req,res)=>{
  const que = req.body.que;
  const ans = req.body.ans;
  connection.query(
    "UPDATE lists SET Q=?,A=? WHERE id = ?",
    [que,ans,req.params.id],
    (error,results)=>{
      res.redirect("/index");
    }
  );
});

app.listen(3000);

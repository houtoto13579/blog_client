const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const knex = require('knex')({
  client: 'mysql',
  // connection: {
  //   host : '127.0.0.1',
  //   user : 'newuser',
  //   password : 'newpassword',
  //   database : 'new_db'
  // }
  connection: {
    host : 'us-cdbr-iron-east-03.cleardb.net',
    user : 'bebc0ed9d320fa',
    password : 'aeed0c97',
    database : 'heroku_2c1bbdfc714eedf'
  }
  	
});

const app = express();
const data = {};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())
// routing
app.get('/blogs', function (req, res) {
  console.log('someone get');
  knex.select().from('blogs').then(result => {
    console.log(result);
    res.json(result);
});
});
// routing
app.post('/new', function (req, res) {
  var reqBody = (req.body);
  var name = reqBody.name;
  var title = reqBody.title;
  var article = reqBody.article;
  var time = reqBody.time;
  var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
  let id = S4()+S4()+S4()+S4();
  console.log(name);
  knex.insert({ 
    Name: name,
    Title: title,
    Article: article,
    Time: time,
    Id: id
  }).into('blogs').then(result=>{
    res.json({ 
      text: 'POST SUCCESS!',
      result: result,
     });
  });
});
app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});

var express = require("express")
var app = express();
var router = express.Router(); // router set
var path = require("path")
var mysql = require("mysql")

// DATABASE SETTING
var connection = mysql.createConnection({
  host : "localhost",
  user : "root",
  password : "1234",
  database : "newsstand"
})

connection.connect();

router.get("/news", function(req, res){
  res.sendFile(path.join(__dirname, "../public/src/html/main.html"));
})

router.get("/news/load_data", function(req, res){
  var arr = [];
  var pressSql = "SELECT * FROM PRESS"
  var newsSql = "SELECT * FROM NEWS"
  connection.query(pressSql, function(err, rows){
    if(err) throw err;
    arr.push(rows)
    connection.query(newsSql, function(err, rows){
      if(err) throw err;
      arr.push(rows)
      var totalPressList = [];
      for(var i = 0; i < arr[0].length; i++){
        totalPressList.push({
          "id" : arr[0][i].PRESSID,
          "subscription" : arr[0][i].SUBSCRIPTION,
          "title" : arr[0][i].PRESSTITLE,
          "imgurl" : arr[0][i].IMGURL,
          "newslist" : []
        })
        for(var x = 0; x < arr[1].length;x++){
          if(totalPressList[i].id === arr[1][x].PID){
            totalPressList[i].newslist.push(arr[1][x].NEWSTITLE);
          }
        }
      }
      res.json(totalPressList)
    })
  })
})

router.post("/news/set_subscription", function(req, res){
  var pressId = req.body.pressid;
  var subscription = req.body.subscription;
  //var sql = 'UPDATE PRESS SET SUBSCRIPTION = ?? WHERE PRESSID = ?? ';
  //var params = [subscription, pressId];
  var sql = 'UPDATE PRESS SET SUBSCRIPTION = "' + subscription + '" WHERE PRESSID = "' + pressId + '"';
  connection.query(sql, function(err, rows){
    if(err) throw err;
    console.log("good")
  })

})


module.exports = router;

var express = require("express")
var app = express();
var bodyParser = require("body-parser")
var router = require("./router/news")

app.listen(3000, function(){
  console.log("start! port3000!");
});

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(router)

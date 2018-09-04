const express = require('express');
const fs = require("fs");
const app = express();
const path = require('path');

app.use(express.static("public" + '/'));

app.get('/', function(request, response, error){
    response.sendFile("./public/index.html");
  })

app.get('/game', function(request, response, error){
    response.sendFile("./public/game.html", {root: __dirname});
  })  

app.listen(3000); 
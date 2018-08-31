const express = require('express');
const fs = require("fs");
const app = express();
const path = require('path');

app.use(express.static(__dirname + '/'));

app.get('/', function(request, response, error){
    response.sendFile("./index.html");
  })

app.listen(3000); 
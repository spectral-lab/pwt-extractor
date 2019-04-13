const express = require('express');
const app = express();

app.use(express.static(__dirname + '/dist'));

app.get('/', function(request, response) {
  console.log('new access');
  response.send('Hello World!')
});

app.listen(3000, function() {
  console.log("Node app is running at localhost:" + 3000);
});
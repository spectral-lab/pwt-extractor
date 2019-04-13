const express = require('express');
const app = express();

app.use(express.static(__dirname + '/dist'));

app.get('/', function(request, response) {
  console.log('new access');
  response.send('Hello World!')
});

app.listen(process.env.PORT, function() {
  console.log("Node app is running at localhost:" + process.env.PORT);
});
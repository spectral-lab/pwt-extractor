const express = require('express');
const app = express();

app.use(express.static(__dirname + '/dist'));

app.get('/', function(request, response) {
  console.log('new access');
  response.send('Hello World!')
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
  console.log(`Node app is running at localhost:${PORT}`);
});

//dependencies
var express = require('express');

//create instance of express
var app = express();

//middleware
app.use(express.static('./client'));

//set up port to listen on
var port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log('Autocomplete listening on port ' + port + '!');
});
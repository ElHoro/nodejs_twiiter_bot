'use strict'

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

var app = require('./app.js');
var port = process.env.PORT || 3567;


app.listen(port, () => {
    console.log(`API leviosa bot working on port:${port}`);
});

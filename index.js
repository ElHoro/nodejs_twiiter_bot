'use strict'
const app = require('./app.js');
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`API leviosa bot working on port:${port}`);
});

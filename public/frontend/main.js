/*jshint esversion: 6 */

const express       = require('express');
const app           = express();

const path          = require('path');
const port = process.env.PORT || 3001; 

/* WE NEED A SERVER TO RUN FRONT_END */
app.use(express.static(path.join(__dirname, '../frontend')));
app.listen(port, () => {
    console.log(`Client app is serving front-end on port ${port}`);
});

/*jshint esversion: 6 */

//load express library
const express = require('express');
// Parse incoming request bodies in a 
// middleware before your request handlers process them.
const bodyParser = require('body-parser'); 
const nodegraphRoute = require('./routes/nodegraph');
//load  mini app "contacts" assumes ./routes/contacts.js exists
const accountFeedRoute = require('./routes/accountFeed');
//instantiate instance of express webserver
const app = express();

const cors = require('cors');
app.use(cors());
const http = require('http');
const port = process.env.PORT || 9999;

const logger = require('morgan');  // require morgan logging middleware library
app.use(logger('dev')); // use the middleware function returned by logger(“dev”); 


// Only parse JSON bodies
app.use(bodyParser.json()); 
//  extended: true means to parse deeply nested objects
//  extended: false means users should not post nested
//  objects because they will not be parsed. 
app.use(bodyParser.urlencoded({extended: true})); 

//  Respond to get request on the root path '/'
//    Send a 'Hello World' response 
app.get('/', (req, res) => {
    //commentout line to see waiting status on server
    res.send('Hello World');
});

// Route traffic sent to /contacts to the mini app
app.use('/accountfeed', accountFeedRoute);

app.use('/nodegraph', nodegraphRoute);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

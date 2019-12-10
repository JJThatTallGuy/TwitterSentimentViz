const express = require('express'),
    router = express.Router();
const methodOverride = require('method-override');
router.use(methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        const method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

var Sentiment = require('sentiment');
var sentiment = new Sentiment();



var Twitter = require('twitter');
 
var client = new Twitter({
  consumer_key: 'x2twtWnTBtgNDDf9D5m9JhGxh',
  consumer_secret: 'KtYuJO8O7kVjlc0W7mWXBI64qQCDsFERV38Du6v7ERg1t04Ysy',
  access_token_key: '331090508-3vrIZUb2ZKZNWeFIVnNTPEhtCGdg1F5ROyORVuPx',
  access_token_secret: 'LnMHwEIOBH44h9rlyq3wrAQp054O0TEFubI8GYF2nXGZ0'
});

router.route('/:username')
    // GET all contacts
    .get((req, res, next) => {
        var params = {screen_name: req.params.username,count:200};
        var returndata = {"users":[]};
    client.get('followers/list', params, function(error, followers, response) {
        if (!error) {
            console.log(followers);
            let followcount=0;
            for(let i =0; i<followers.users.length;i++){
                var params = {id: followers.users[i].screen_name,text: 'full_text'};
                client.get('statuses/user_timeline', params, function(error, tweets, response) {
                    if(!error){
                        //console.log("tweets returned: "+i);
                        let total=0;
                        for(let k =0;k<tweets.length;k++){
                            total += sentiment.analyze(tweets[k].text).score;
                            
                        }
                        //console.log("total: "+total);
                        //console.log("test");
                        let compositescore
                        if(tweets==null||tweets.length==0){
                            compositescore=0;
                        }
                        else{
                            compositescore=total/tweets.length;
                        }
                        
                        returndata.users[i] = {"id": followers.users[i].id,"screen_name": followers.users[i].screen_name,"composite_score": compositescore,"followers_count":followers.users[i].followers_count};
                        //console.log(returndata.users[i]);
                        
                        //console.log(returndata.users[i]); 
                        
                        
                    }
                    else{
                        console.log(error);
                        returndata.users[i] = {"id": followers.users[i].id,"screen_name": followers.users[i].screen_name,"composite_score": 0,"followers_count":followers.users[i].followers_count};
                    }
                    if(i==followers.users.length-1){
                        //console.log(returndata);
                        res.json(returndata);
                    }
                });
               
            }      
            
        }
        else console.log(error);
    });
    
});

function handleError(err, res, msg) {
    err.message =`${err.message} ${msg}`;
    err.status = res.statusCode;
    res.json(err);
}

module.exports = router;

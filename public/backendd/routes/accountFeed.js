/*jshint esversion: 6 */

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
var bearer;
var request = require('request');
var options = {
    url: 'https://api.twitter.com/oauth2/token',
    method: 'POST',
    headers: {
    "Authorization": "Basic eDJ0d3RXblRCdGdORERmOUQ1bTlKaEd4aDpLdFl1Sk84TzdrVmpsYzBXN21XWEJJNjRxUUNEc0ZFUlYzOER1NnY3RVJnMXQwNFlzeQ==",
    "Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"
    },
    body: "grant_type=client_credentials"
  };
  
  request.post(options, function(error, response, body){
    if(!error){
        bearer = JSON.parse(body).access_token;
        console.log(bearer);
        
    }
    
  });

var Twitter = require('twitter');
 
var client = new Twitter({
  consumer_key: 'x2twtWnTBtgNDDf9D5m9JhGxh',
  consumer_secret: 'KtYuJO8O7kVjlc0W7mWXBI64qQCDsFERV38Du6v7ERg1t04Ysy',
  bearer_token: bearer
});

router.route('/:username')
    .get((req, res, next) => {
        var params = {screen_name: req.params.username,tweet_mode:"extended",text: 'full_text',include_rts:'false',count:200};
        var returndata = {"users":[]};
client.get('users/show', params, function(error, pics, response) {
    if (!error) {
       console.log(pics);
        returndata.profile_pic = pics.profile_image_url;
        returndata.banner_pic=pics.profile_banner_url;
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (!error) {
                //console.log(tweets);
                for(let i =0;i<tweets.length;i++){
                    returndata.users[i]=tweets[i];
                }
                res.json(returndata);
                    }
        });
    }
            
});

    })

router.route('/:username/:tweetid')
    .get((req, res, next) => {
    let currentid;
    let k =0;
    var returndata = {};
   
    var params = {q:"to:@"+req.params.username,since_id:req.params.tweetid,count:800};
    client.get('search/tweets', params, function(error, tweets, response) {
        if (!error&&tweets!=null) {
            //console.log(tweets);
            for(let i =0;i<tweets.statuses.length;i++){
                currentid = tweets.statuses[i].id;
                if(tweets.statuses[i].in_reply_to_status_id_str != null &&
                    tweets.statuses[i].in_reply_to_status_id_str==req.params.tweetid) {
                    //console.log(tweets.statuses[i]);
                    returndata[i]=tweets.statuses[i];
                    k++;
                }
            }
           
            console.log(returndata);
            console.log(req.params.tweetid);
            // gettweets(req.params.username,req.params.tweetid,req.params.tweetid,currentid-1,returndata,k);
            res.json(returndata);
        }
        //console.log(error);
    });
    
    })

function handleError(err, res, msg) {
    err.message =`${err.message} ${msg}`;
    err.status = res.statusCode;
    res.json(err);
}

function gettweets(username,tweetid,sinceid,maxid,returndata,k){
    var params2 = {q:"to:@"+username,since_id: sinceid,max_id:maxid,count:200};
                client.get('search/tweets', params2, function(error, tweets, response) {
                    if (!error&&tweets!=null) {
                        // console.log(tweets.statuses.length);
                        // console.log(tweets);
                        for(let i =0;i<tweets.statuses.length;i++){
                            maxid = tweets.statuses[i].id;
                            if(tweets.statuses[i].in_reply_to_status_id != null &&
                                tweets.statuses[i].in_reply_to_status_id==tweetid) {
                                //console.log(tweets.statuses[i]);
                                returndata[k]=tweets.statuses[i];
                                k++;
                            }
                        }
                        // console.log(returndata);
                        if(maxid>=tweetid){
                            console.log("maxid>=tweetid");
                            console.log("maxid"+maxid);
                            let temp = Number(maxid) - 1;
                            console.log("maxid: "+temp);
                            gettweets(username,tweetid,sinceid,maxid,returndata,k);
                        }
                    }
                });   
}

module.exports = router;

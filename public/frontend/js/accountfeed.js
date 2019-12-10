/*jshint esversion: 6 */

if (sessionStorage.getItem('user') == null) {
    window.location.replace("login.html");
}


function getTweets() {
    getTweetsForUser(sessionStorage.getItem('user'));
}


function getTweetsForUser(username) {
    $.ajax({
        url: "https://csse-280-twit-analysis.herokuapp.com/accountFeed/" + username,
        type: 'GET',
        dataType: 'JSON',
        success: (data) => {
            if (data) {
                initialize(username, data.users);
                document.getElementById("profilepic").src = data.profile_pic;
                document.getElementById("bannerpic").src = data.banner_pic;
            } else {
                console.log("User not Found");
            }
        },
        error: (request, status, error) => {
            console.log(error, status, request);
        }
    });
}

function initialize(username, allTweets) {
    let tweets = Array.from(document.getElementsByClassName("tweet"));
    const feed = document.getElementsByClassName('feed')[0];
    allTweets.map(function(tweet) {
        const tweetElement = document.createElement('div');
        const pElement = document.createElement('p');
        tweetElement.classList.add(username);
        tweetElement.classList.add('tweet');
        tweetElement.name = username;
        tweetElement.id_str = tweet.id_str;
        pElement.textContent = tweet.full_text;
        tweetElement.appendChild(pElement);
        tweetElement.addEventListener('click', function() {
            if (tweetElement.childNodes.length > 1) {
                //If the tweet is already displaying replies, remove them
                tweetElement.removeChild(tweetElement.childNodes[1]);
            } else {
                showReplies(tweetElement);
            }
        });
        feed.appendChild(tweetElement);
    });
}



function showReplies(tweet) {
    let responseTexts = [
    ];
    
    let repliesDiv = document.createElement("div");

    responseTexts.map(function(text) {
        let reply = document.createElement("div");
        reply.classList.add("reply");
        let replyText = document.createElement("p");
        replyText.textContent = text;
        reply.appendChild(replyText);
        repliesDiv.appendChild(reply);
    });

    tweet.appendChild(repliesDiv);
    const username = tweet.classList[0];
    $.ajax({
        url: "http://localhost:9999/accountFeed/" + username + "/" + tweet.id_str,
        type: 'GET',
        dataType: 'JSON',
        success: (data) => {
            if (data) {
                console.log(data);
                let numResponses = 0;
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        const responseTweet = data[key];
                        if (responseTweet.hasOwnProperty("text")) {
                            numResponses++;
                            if (numResponses > 5) {
                                break;
                            }
                            console.log(responseTweet);
                            let reply = document.createElement("div");
                            reply.classList.add("reply");
                            let replyText = document.createElement("p");
                            replyText.textContent = responseTweet.text;
                            reply.appendChild(replyText);
                            repliesDiv.appendChild(reply);
                        }
                    }
                }
                if (numResponses > 0) {
                    tweet.appendChild(repliesDiv);
                }
            } else {
                console.log("User not Found");
            }
        },
        error: (request, status, error) => {
            console.log(error, status, request);
        }
    });
}



getTweets();


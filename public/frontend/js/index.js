/*jshint esversion: 6 */

console.log(sessionStorage); //for some reason session storage is empty most of the time in index.html
if (sessionStorage.getItem('user') == null) {
    window.location.replace("frontend/html/login.html");
}

function loadImages(username) {
    $.ajax({
        url: "https://csse-280-twit-analysis.herokuapp.com/accountFeed/" + username,
        type: 'GET',
        dataType: 'JSON',
        success: (data) => {
            if (data) {
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

loadImages(sessionStorage.getItem('user'));

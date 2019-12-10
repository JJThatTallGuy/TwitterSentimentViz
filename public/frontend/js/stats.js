/*jshint esversion: 6 */

if (sessionStorage.getItem('user') == null) {
    window.location.replace("login.html");
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

function makeGraph(elementId, data, start, end) {
    const container = document.getElementById(elementId);
    const dataset = new vis.DataSet(data);
    const options = {
        start: start,
        end: end,
        zoomable: false
    };
    const graph = new vis.Graph2d(container, dataset, options);

    return graph;
}

/*
var container = document.getElementById('followers');


var dataset = new vis.DataSet(followers);

var options_f = {
    start: '2019-05-01',
    end: '2019-12-01',
    //width: '40%',
    //height: '200px',
    zoomable: false,
};
var graph_f = new vis.Graph2d(container, dataset, options_f);

var container = document.getElementById('influence');


var dataset = new vis.DataSet(influence);
var options_i = {
    start: '2019-05-01',
    end: '2019-12-01',
    //width: '40%',
    //height: '200px',
    zoomable: false
};
var graph_i = new vis.Graph2d(container, dataset, options_i);
*/

const followers = [
    {x: '2019-06-01', y: 5874470},
    {x: '2019-07-01', y: 5887967},
    {x: '2019-08-01', y: 5918772},
    {x: '2019-09-01', y: 5926005},
    {x: '2019-10-01', y: 5939094},
    {x: '2019-11-01', y: 5949846}
];

const  influence = [
    {x: '2019-06-01', y: 1500},
    {x: '2019-07-01', y: 1300},
    {x: '2019-08-01', y: 2000},
    {x: '2019-09-01', y: 2100},
    {x: '2019-10-01', y: 1400},
    {x: '2019-11-01', y: 2200}
];

const start = '2019-05-01';
const end = '2019-12-01';

makeGraph('followers', followers, start, end);
makeGraph('influence', influence, start, end);
/*jshint esversion: 6 */

if (sessionStorage.getItem('user') == null) {
  window.location.replace("login.html");
}


function initialize() {
    const data = loadData(sessionStorage.getItem('user'));
    // createNodeGraph(data);
}

function loadData(username) {
    $.ajax({
      url: "https://csse-280-twit-analysis.herokuapp.com/nodegraph/" + username,
      type: 'GET',
      dataType: 'JSON',
      // data: { username: username },
      success: (data) => {
          if (data) {
            constructGraphData(username, data);
          } else {
              console.log("User not Found");
          }
      },
      error: (request, status, error) => {
          console.log(error, status, request);
      }
  });
}

function constructGraphData(user, followers) {
  let followerUsers = [];
  followers.users.map(function(user) {
    if (user != null) {
      let color = "yellow";
      if (user.composite_score >= 1) {
        color = "green";
      } else if (user.composite_score <= -1) {
        color = "red";
      }
      const followerUser = {
        name: user.screen_name,
        color: color,
        value: Math.min(Math.max(user.followers_count, 10),90)
      };
      if (followerUsers.length < 20) {
        followerUsers.push(followerUser);
      }
    }
  });
  data = {
    user: {
      name: user,
      color: "blue",
      value: 100
    },
    followers: followerUsers
  };

  createNodeGraph(data);
    // let tweets = Array.from(document.getElementsByClassName("tweet"));
    // const feed = document.getElementsByClassName('feed')[0];
    // allTweets.map(function(tweet) {
    //     const tweetElement = document.createElement('div');
    //     const pElement = document.createElement('p');
    //     tweetElement.classList.add('tweet');
    //     pElement.textContent = tweet;
    //     tweetElement.appendChild(pElement);
    //     tweetElement.addEventListener('click', function() {
    //         if (tweetElement.childNodes.length > 1) {
    //             //If the tweet is already displaying replies, remove them
    //             tweetElement.removeChild(tweetElement.childNodes[1]);
    //         } else {
    //             showReplies(tweetElement);
    //         }
    //     });
    //     feed.appendChild(tweetElement);
    // });
}

function parseNodes(data) {
    const nodes = [];
    nodes.push({
        data: {
            id: data.user.name,
            value: 100,
            color: data.user.color
        }
    });
    data.followers.forEach(follower => {
        const nodeData = {
            data: {
                id: follower.name,
                value: follower.value,
                color: follower.color
            }
        };
        nodes.push(nodeData);
    });
    return nodes;
}

function parseEdges(data) {
    const edges = [];
    const username = data.user.name;
    data.followers.forEach(follower => {
        const edgeData = {
            data: {
                id: username + follower.name,
                source: username,
                target: follower.name
            }
        };
        edges.push(edgeData);
    });
    return edges;
}

function createNodeGraph(data) {
    const nodes = parseNodes(data);
    const edges = parseEdges(data);

    let style = [
        {
            selector: 'node',
            style: {
                'label': 'data(id)',
                // 'background-color': 'mapData(value, 0, 100, #CCCCCC, #38A1F3)',
                'background-color': 'data(color)', //use this background-color mapping instead to allow hard-coded colors
                'width': 'mapData(value, 0, 100, 1, 100)',
                'height': 'mapData(value, 0, 100, 1, 100)',
                'font-size': 'mapData(value, 0, 100, 1, 18)',
                'text-valign': 'center'
            }
        },
    
        {
            selector: 'edge',
            style: {
                'width': 3,
                'line-color': '#CCCCCC'
            }
        }
    ];

    let layout = {
        name: 'concentric',
        rows: 1
    };

    let cy = cytoscape({
        container: document.getElementById('nodegraph'),
        elements: { nodes: nodes, edges: edges },
        style: style,
        layout: layout
    });
}







// Data
const nodegraphData = 
{
  // main user
  user: {
    name: "@mainuser",
    color: "blue"
  },

  // followers
  followers: [
    {
      name: "@followera",
      value: 60,
      color: "red"
    },
    {
      name: "@followerb",
      value: 30,
      color: "blue"
    },
    {
      name: "@followerc",
      value: 80,
      color: "red"
    },
    {
      name: "@followerd",
      value: 90,
      color: "red"
    },
    {
      name: "@followere",
      value: 20,
      color: "green"
    },
    {
      name: "@followerf",
      value: 60,
      color: "orange"
    },
    {
      name: "@followerg",
      value: 50,
      color: "green"
    }
  ]
};


initialize();


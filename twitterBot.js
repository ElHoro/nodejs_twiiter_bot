// define the dependencies
const twit = require('twit');
global.lastTweetId = 0;

const config = {
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret
}

const Twitter = new twit(config);

let readTweets = function()
{
    let params = {
        count: 10
    }

    if(global.lastTweetId > 0) {
      params = {
        since_id: global.lastTweetId
      }
    }

  // search through all tweets using our params and execute a function:
  Twitter.get('statuses/mentions_timeline', params, function(err, data) {
        // if there is no error
        if (!err) {
          if (data.length > 0) {
            global.lastTweetId = data[0].id_str;
            console.log("Last tweet registered: " + global.lastTweetId);
            console.log("Tweets received in this interval :" + data.length);
            // loop through the first 4 returned tweets
            for (let i = 0; i < data.length; i++) {
              // iterate through those first four defining a rtId that is equal to the value of each of those tweets' ids
              let tId = data[i].id_str;
              Twitter.post('favorites/create/:id', {
                id: tId
              }, function(err, response) {
                if (response) {
                  console.log('Successfully liked');
                }
                if (err) {
                  console.log(err);
                }
              })
            }
          } else {
            console.log("No tweets receiven in this interval");
          }
      } else {
          // catch all log if the search could not be executed
          console.log('Could not search tweets.');
        }
    });
}
readTweets();
setInterval(readTweets, (1 * 60 * 1000));

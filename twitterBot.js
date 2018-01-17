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
        q: 'leviosa',
        result_type: 'recent',
        since_id: global.lastTweetId
    }

  // search through all tweets using our params and execute a function:
  Twitter.get('search/tweets', params, function(err, data) {
        // if there is no error
        if (!err) {
          global.lastTweetId = data.statused[0].id_str;
          console.log("Last tweet registered: " + global.lastTweetId);
          // loop through the first 4 returned tweets
          for (let i = 0; i < 10; i++) {
          // iterate through those first four defining a rtId that is equal to the value of each of those tweets' ids
          let rtId = data.statuses[i].id_str;
          let name = data.statuses[i].user.screen_name;
          //TODO: make something.
        }
      } else {
          // catch all log if the search could not be executed
          console.log('Could not search tweets.');
        }
    });
}
readTweets();
setInterval(readTweets, (60 * 60 * 1000));

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

let getAnswer = function()
{
  let answerNumber = Math.floor((Math.random() * 3) + 1);

  switch(answerNumber) {
    case 1:
      return 'You’re saying it wrong, It’s Wing-GAR-dium Levi-O-sa, make the “gar” nice and long.';
    case 2:
      return 'Swish and flick, remember, swish and flick.';
    case 3:
      return 'Never forget Wizard Baruffio, who said ‘s’ instead of ‘f’ and found himself on the floor with a buffalo on his chest.'
    default:
     return 'You do it, then, if you’re so clever'
  }
}

let main = function()
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
          } else {
            console.log("No tweets receiven in this interval");
          }
        } else {
          // catch all log if the search could not be executed
          console.log('Could not search tweets.');
        }
    }).then(function(data) {
      let tweets = data.data;
      // loop through the returned tweets
      for (let i = 0; i < tweets.length; i++) {
        // iterate through those first four defining a rtId that is equal to the value of each of those tweets' ids
        let tId = tweets[i].id_str;
        if (tweets[i].favorited) {
          console.log('already liked ' + tweets[i].user.name + ' tweet.');
          continue;
        }
        //Like tweet
        Twitter.post('favorites/create', {
          id: tId
        }, function(err, response) {
          if (response) {
            console.log('Successfully liked ' + tweets[i].user.name + ' tweet.');
          }
          if (err) {
            console.log(err);
          }
        });
        //answer tweet
        Twitter.post('statuses/update', {
            status: '@'+tweets[i].user.screen_name+' '+getAnswer(),
            in_reply_to_status_id: tweets[i].id_str
        }, function(err, response) {
          if (response) {
            console.log('Successfully answered ' + tweets[i].user.name + ' tweet.');
          }
          if (err) {
            console.log(err);
          }
        });
      }
    });
}

setInterval(main, (60 * 60 * 1000));

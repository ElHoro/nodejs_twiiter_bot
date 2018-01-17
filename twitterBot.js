// define the dependencies
const twit = require('twit');

const config = {
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret
}

const Twitter = new twit(config);

let retweet = function() {
    let params = {
        q: 'leviosa',
        result_type: 'recent',
        lang: 'en'
    }

    // search through all tweets using our params and execute a function:
Twitter.get('search/tweets', params, function(err, data) {
        // if there is no error
        if (!err) {
           // loop through the first 4 returned tweets
          for (let i = 0; i < 2; i++) {
            // iterate through those first four defining a rtId that is equal to the value of each of those tweets' ids
          let rtId = data.statuses[i].id_str;
          let name = data.statuses[i].user.screen_name;
            // the post action
          console.log(rtId);
          Twitter.post('statuses/update', {
            status: '@'+name+' You’re saying it wrong, It’s Wing-GAR-dium Levi-O-sa, make the “gar” nice and long.',
            // setting the id equal to the rtId variable
            in_reply_to_status_id: rtId
            // log response and log error
          }, function(err, data, response) {
            if (response) {
              console.log(data.text + 'successfully answered');
            }
            if (err) {
              console.log(err);
            }
          });
        }
      }
        else {
            // catch all log if the search could not be executed
          console.log('Could not search tweets.');
        }
    });
}
retweet();
setInterval(retweet, (60 * 60 * 1000));

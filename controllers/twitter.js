'use strict'
const crypto = require('crypto');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}
const request = require('request');

const twitter_oauth = {
    CONSUMER_KEY: process.env.CONSUMER_KEY,
    CONSUMER_SECRET: process.env.CONSUMER_SECRET,
    TOKEN: process.env.ACCESS_TOKEN,
    TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET
  }

let getAnswer = function(){
    let answerNumber = Math.floor((Math.random() * 3) + 1);

    switch(answerNumber) {
        case 1:
        return 'You’re saying it wrong, It’s Wing-GAR-dium Levi-O-sa, make the “gar” nice and long.';
        case 2:
        return 'Swish and flick, remember, swish and flick.';
        case 3:
        return 'Never forget Wizard Baruffio, who said ‘s’ instead of ‘f’ and found himself on the floor with a buffalo on his chest.';
        default:
        return 'You do it, then, if you’re so clever';
    }
}

function getChallengeResponse(crc_token, CONSUMER_SECRET){
    let hmac = crypto.createHmac('sha256', CONSUMER_SECRET).update(crc_token).digest('base64')
  
    return hmac
}

function webhookChallenge(req, res){
  const crcToken = req.query.crc_token;
  console.log('webhook received ' + crcToken);
  var response = getChallengeResponse(crcToken, process.env.CONSUMER_SECRET)

  res.status(200).send({'response_TOKEN': 'sha256='+response});
}

function getWebhook(req, res){
    if(req.body.tweet_create_events){
        const tweetsReceived = req.body.tweet_create_events;
        for (let i = 0; i < tweetsReceived.length; i++) {
            console.log("Tweet received: "+tweetsReceived[i].id_str+" - "+tweetsReceived[i].text);
            if(tweetsReceived[i].user.id == process.env.BOT_USER_ID){
                console.log('Auto tweet. Skipping auto reply');
                break;
            }

            const like_request_options = {
                url: 'https://api.twitter.com/1.1/favorites/create.json?id='+tweetsReceived[i].id_str,
                oauth: twitter_oauth
            }

            // POST request to send Direct Message
            request.post(like_request_options, function (error, response, body) {
                console.log("Tweet Liked");
            });

            const tweet_request_options = {
                url: 'https://api.twitter.com/1.1/statuses/update.json',
                oauth: twitter_oauth,
                headers: {
                    'Content-type': 'application/json'
                },
                form: {
                    in_reply_to_status_id: tweetsReceived[i].id_str,
                    status: '@'+tweetsReceived[i].user.screen_name+' '+getAnswer()
                }
            }

            request.post(tweet_request_options, function (error, response, body) {
                console.log("Answered");
            });
        }
    }

    res.status(200).send({'done':'done'});
}

function registerWebhook(req, res){
    console.log("Registering hook: "+req.body.url);

    // request options
   const request_options = {
        url: 'https://api.twitter.com/1.1/account_activity/all/dev/webhooks.json',
        oauth: twitter_oauth,
        headers: {
          'Content-type': 'application/json'
        },
        form: {
          url: req.body.url
        }
      };

    request.post(request_options, function (error, response, body) {
        console.log(body)
    })

    res.status(200).send({'done':'done'});
}

function removeWebhook(req, res){
    console.log("Removing hook "+req.query.id);

    // request options
    const request_options = {
        url: 'https://api.twitter.com/1.1/account_activity/all/dev/webhooks/'+req.query.id+'.json',
        oauth: twitter_oauth
      };

    request.delete(request_options, function (error, response, body) {
        if (response.statusCode == 204) {
            console.log('Webhook removed.')
        } else {
            console.log('Something went wrong.')
        }
    })

    res.status(200).send({'done':'done'});
}

function subscribeToWebhook(req, res){
    // request options
    const request_options = {
        url: 'https://api.twitter.com/1.1/account_activity/all/dev/subscriptions.json',
        oauth: twitter_oauth
    };

    request.post(request_options, function (error, response, body) {
        if (response.statusCode == 204) {
            console.log('Subscription added.')
        } else {
            console.log('User has not authorized your app.')
        }
    });

    res.status(200).send({'done':'done'});
}

module.exports = {
  webhookChallenge,
  getWebhook,
  registerWebhook,
  subscribeToWebhook,
  removeWebhook
}

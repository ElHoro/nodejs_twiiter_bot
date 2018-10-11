'use strict'

var express = require('express');
var TwitterController = require('../controllers/twitter');
var api = express.Router();

api.get('/twitter/webhook', TwitterController.webhookChallenge);
api.post('/twitter/webhook', TwitterController.getWebhook);
api.post('/twitter/webhook/register', TwitterController.registerWebhook);
api.get('/twitter/webhook/subscribe', TwitterController.subscribeToWebhook);
api.delete('/twitter/webhook', TwitterController.removeWebhook);

module.exports = api;

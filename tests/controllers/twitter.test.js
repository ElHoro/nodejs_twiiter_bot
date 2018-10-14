'use strict'

process.env.NODE_ENV = 'TESTING';

const request = require('supertest');
const app = require('../../app.js');

test('receives a string and returns a valid hash', () => {
  const string = "something";
  const hash = "sha256=8oY1szLnm7uTIs6/Jo3Cu38TyQ5SMQ2OywpWurioubc=";
  
  return request(app)
  .get('/api/twitter/webhook')
  .query({crc_token: string})
  .then(response => {
    expect(response.body.response_token).toBe(hash);
  });
});
import '@babel/polyfill';
const app = require('./index');
import { response } from 'express';
const supertest = require('supertest');
const request = supertest(app);

it('gets the test endpoint', async done => {
    const response = await request.get('http://localhost:8080/call');
  
    expect(response.status).toBe(404);
    done();
  });


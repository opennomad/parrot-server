const request = require('supertest');

const express = require('express');
const app = express(); //an instance of an express app, a 'fake' express app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routes = require('../app/routes');

let server;
beforeEach(() => {
  server = app.listen();
});
afterEach(() => {
  server.close();
});

describe('endpoint: /', () => {
  test('GET /', () => {
    app.all('/', routes.root);
    return request(server).get('/').then(data => {
      expect(data.status).toBe(200);
    });
  });
  test('POST /', () => {
    app.all('/', routes.root);
    return request(server).post('/').then(data => {
      expect(data.status).toEqual(200);
    });
  });
});

describe('endpoint: /heatlh', () => {
  test('GET /health', () => {
    app.all('/health', routes.health);
    return request(server).get('/health').then(data => {
      expect(data.status).toBe(200);
      expect(data.text).toBe('OK');
    });
  });

  test('POST /health', () => {
    app.all('/health', routes.health);
    return request(server).post('/health').then(data => {
      expect(data.status).toBe(200);
      expect(data.text).toBe('OK');
    });
  });
});

describe('endpoint: /pause', () => {
  test('GET /pause (default)', () => {
    app.all('/pause', routes.pause);
    return request(server).get('/pause').then(data => {
      expect(data.text).toBe('Pause complete after 2 seconds');
      expect(data.status).toBe(200);
    });
  });
  test('POST /pause (default)', () => {
    app.all('/pause', routes.pause);
    return request(server).post('/pause').then(data => {
      expect(data.text).toBe('Pause complete after 2 seconds');
      expect(data.status).toBe(200);
    });
  });
  test('POST /pause (3 seconds)', () => {
    app.all('/pause', routes.pause);
    return request(server).get('/pause?seconds=3').then(data => {
      expect(data.status).toBe(200);
      expect(data.text).toBe('Pause complete after 3 seconds');
    });
  });
  test('POST /pause (3 seconds)', () => {
    app.all('/pause', routes.pause);
    return request(server).post('/pause').send({'seconds':3}).then(data => {
      expect(data.status).toBe(200);
      expect(data.text).toBe('Pause complete after 3 seconds');
    });
  });
});

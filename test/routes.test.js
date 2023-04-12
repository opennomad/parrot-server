const request = require('supertest');

const express = require('express');
const fileUpload = require('express-fileupload');
const app = express(); //an instance of an express app, a 'fake' express app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

const routes = require('../app/routes');

let server;
beforeEach(() => {
  server = app.listen();
});
afterEach(() => {
  server.close();
});

describe('endpoint: /', () => {

  app.all('/', routes.root);

  test('GET /', () => {
    return request(server).get('/').then(data => {
      expect(data.status).toBe(200);
    });
  });
  test('POST /', () => {
    return request(server).post('/').then(data => {
      expect(data.status).toEqual(200);
    });
  });
});

describe('endpoint: /heatlh', () => {

  app.all('/health', routes.health);

  test('GET /health', () => {
    return request(server).get('/health').then(data => {
      expect(data.status).toBe(200);
      expect(data.text).toBe('OK');
    });
  });

  test('POST /health', () => {
    return request(server).post('/health').then(data => {
      expect(data.status).toBe(200);
      expect(data.text).toBe('OK');
    });
  });
});

describe('endpoint: /pause', () => {

  app.all('/pause', routes.pause);

  test('GET /pause (default)', () => {
    return request(server).get('/pause').then(data => {
      expect(data.text).toBe('Pause complete after 2 seconds');
      expect(data.status).toBe(200);
    });
  });
  test('POST /pause (default)', () => {
    return request(server).post('/pause').then(data => {
      expect(data.text).toBe('Pause complete after 2 seconds');
      expect(data.status).toBe(200);
    });
  });
  test('POST /pause (3 seconds)', () => {
    return request(server).get('/pause?seconds=3').then(data => {
      expect(data.status).toBe(200);
      expect(data.text).toBe('Pause complete after 3 seconds');
    });
  });
  test('POST /pause (3 seconds)', () => {
    return request(server).post('/pause').send({'seconds':3}).then(data => {
      expect(data.status).toBe(200);
      expect(data.text).toBe('Pause complete after 3 seconds');
    });
  });
});

describe('endpoint: /headers', () => {

  app.all('/headers', routes.headers);

  test('GET /headers (default)', () => {
    return request(server).get('/headers').then(data => {
      expect(data.status).toBe(200);
      expect(data.headers.connection).toBe('close');
    });
  });

  test('POST /headers (default)', () => {
    return request(server).post('/headers').then(data => {
      expect(data.status).toBe(200);
      expect(data.headers.connection).toBe('close');
    });
  });

  test('GET /headers (added header)', () => {
    return request(server)
      .get('/headers')
      .set('parrot', 'squawk')
      .then(data => {
        expect(data.status).toBe(200);
        expect(data.headers.connection).toBe('close');
      });
  });

  test('POST /headers (added header)', () => {
    return request(server)
      .post('/headers')
      .set('parrot', 'squawk')
      .then(data => {
        expect(data.status).toBe(200);
        expect(data.headers.connection).toBe('close');
      });
  });
});

describe('endpoint: /echo', () => {

  app.all('/echo', routes.echo);

  test('GET /echo (empty)', () => {
    return request(server).get('/echo').then(data => {
      expect(data.status).toBe(200);
      expect(data.text).toBe('{}');
    });
  });

  test('POST /echo (empty)', () => {
    return request(server).post('/echo').then(data => {
      expect(data.status).toBe(200);
      expect(data.text).toBe('{}');
    });
  });

  test('GET /echo (added header)', () => {
    return request(server)
      .get('/echo?parrot=squawk')
      .then(data => {
        expect(data.status).toBe(200);
        expect(data.text).toBe('{"parrot":"squawk"}');
      });
  });

  test('POST /echo (added header)', () => {
    return request(server)
      .post('/echo')
      .send({'parrot': 'squawk'})
      .then(data => {
        expect(data.status).toBe(200);
        expect(data.text).toBe('{"parrot":"squawk"}');
      });
  });

  test('DELETE /echo (empty)', () => {
    return request(server).delete('/echo').then(data => {
      expect(data.status).toBe(501);
      expect(data.text).toBe('{"parrot":"not implemented"}');
    });
  });
});

describe('endpoint: /upload', () => {

  app.all('/upload*', routes.upload);

  test('GET /upload (empty directory)', () => {
    return request(server).get('/upload').then(data => {
      expect(data.status).toBe(200);
      expect(data.text).toBe('[]');
    });
  });

  test('POST /upload (file upload)', () => {
    return request(server)
      .post('/upload')
      .attach('file', 'test/testfile')
      .then(data => {
        expect(data.status).toBe(200);
        expect(data.text).toContain('testfile');
        expect(data.text).toContain('1255644d61eff0f74df0a25b4671080d');
        expect(data.text).toContain('7eb2f9df5048f28b041f72129cd5f57abe5ecac8');
        expect(data.text).toContain('1c696aa4eca8de21603d82d0da658c698a76f6aa685e6a9e7c71d62a757955ca');
      });
  });

  test('PUT /upload (file upload)', () => {
    return request(server)
      .put('/upload')
      .attach('file', 'test/testfile')
      .then(data => {
        expect(data.status).toBe(200);
        expect(data.text).toContain('testfile');
        expect(data.text).toContain('1255644d61eff0f74df0a25b4671080d');
        expect(data.text).toContain('7eb2f9df5048f28b041f72129cd5f57abe5ecac8');
        expect(data.text).toContain('1c696aa4eca8de21603d82d0da658c698a76f6aa685e6a9e7c71d62a757955ca');
      });
  });

  test('POST /upload (no file)', () => {
    return request(server)
      .post('/upload')
      .then(data => {
        expect(data.status).toBe(400);
        expect(data.text).toBe('No files were uploaded.');
      });
  });

  test('PUT /upload (no file)', () => {
    return request(server)
      .put('/upload')
      .then(data => {
        expect(data.status).toBe(400);
        expect(data.text).toBe('No files were uploaded.');
      });
  });

  test('POST /upload (failure)', () => {
    return request(server)
      .post('/upload')
      .attach('filefake', 'test/testfile')
      .then(data => {
        expect(data.status).toBe(500);
        expect(data.text).toBe('500 upload failure');
      });
  });

  test('GET /uploads/testfile (existing file)', () => {
    return request(server)
      .get('/uploads/testfile')
      .then(data => {
        expect(data.status).toBe(200);
      });
  });

  test('DELETE /uploads/testfile (existing file)', () => {
    return request(server)
      .delete('/uploads/testfile')
      .then(data => {
        expect(data.status).toBe(200);
        expect(data.text).toBe('testfile has been deleted');
      });
  });

  test('GET /uploads/testfile (deleted file)', () => {
    return request(server)
      .get('/uploads/testfile')
      .then(data => {
        expect(data.status).toBe(404);
        expect(data.text).toBe('testfile not found');
      });
  });

  test('DELETE /uploads/testfile (deleted file)', () => {
    return request(server)
      .delete('/uploads/testfile')
      .then(data => {
        expect(data.status).toBe(404);
        expect(data.text).toBe('testfile could not be found for deletion');
      });
  });

  test('PATH /uploads/ (unsupported http verb)', () => {
    return request(server)
      .patch('/uploads/')
      .then(data => {
        expect(data.status).toBe(501);
        expect(data.text).toBe('501 not implemented');
      });
  });
});

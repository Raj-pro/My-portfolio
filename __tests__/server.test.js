const request = require('supertest');
const server = require('../server');

afterAll(done => {
  server.close(done);
});

describe('server', () => {
  test('GET /health returns UP JSON', async () => {
    const res = await request(server).get('/health');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body).toMatchObject({ status: 'UP' });
  });

  test('GET / returns success HTML', async () => {
    const res = await request(server).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/CI\/CD Pipeline Successful/i);
  });
});

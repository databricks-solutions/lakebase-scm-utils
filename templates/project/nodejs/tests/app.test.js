const request = require('supertest');
const app = require('../src/index');

describe('Health check', () => {
  test('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('API docs (Swagger UI for acceptance review)', () => {
  test('GET /openapi.json exposes the OpenAPI spec, including annotated routes', async () => {
    const res = await request(app).get('/openapi.json');
    expect(res.statusCode).toBe(200);
    expect(res.body.openapi).toBeDefined();
    // The @openapi annotation on the health route is picked up by swagger-jsdoc.
    expect(res.body.paths['/health']).toBeDefined();
  });

  test('GET /docs/ serves the Swagger UI', async () => {
    const res = await request(app).get('/docs/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/swagger-ui/i);
  });
});

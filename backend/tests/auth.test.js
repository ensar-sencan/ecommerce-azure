const request = require('supertest');
const app = require('../src/app');

// Mock database to avoid real Azure SQL connection in tests
jest.mock('../src/config/database', () => ({
  query: jest.fn(),
  sql: {},
}));

const { query } = require('../src/config/database');

describe('POST /api/auth/register', () => {
  it('returns 422 for invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'not-an-email', password: 'password123' });
    expect(res.status).toBe(422);
  });

  it('returns 422 for short password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@test.com', password: '123' });
    expect(res.status).toBe(422);
  });

  it('registers a new user successfully', async () => {
    query
      .mockResolvedValueOnce({ recordset: [] }) // email check
      .mockResolvedValueOnce({ recordset: [{ id: 1, name: 'Test', email: 'test@test.com', role: 'customer' }] }); // insert

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@test.com', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('test@test.com');
  });
});

describe('POST /api/auth/login', () => {
  it('returns 401 for wrong credentials', async () => {
    query.mockResolvedValueOnce({ recordset: [] });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'x@x.com', password: 'wrongpass' });
    expect(res.status).toBe(401);
  });
});

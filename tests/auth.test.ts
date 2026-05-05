import request from 'supertest';

import { createAuthTestApp, mockAdjutorBlacklistMatch, mockAdjutorNoMatch } from './test-helpers';

describe('auth routes', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('registers a user, creates a wallet, and returns a JWT', async () => {
    mockAdjutorNoMatch();
    const app = createAuthTestApp();

    const response = await request(app).post('/api/v1/auth/register').send({
      firstName: 'Omovie',
      lastName: 'Smith',
      email: 'omovie@example.com',
      phone: '08012345678',
      password: 'password123',
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Registration successful');
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe('omovie@example.com');
    expect(response.body.wallet.currency).toBe('NGN');
    expect(response.body.passwordHashPreview).toBeUndefined();
  });

  it('rejects duplicate email registration', async () => {
    mockAdjutorNoMatch();
    const app = createAuthTestApp();

    await request(app).post('/api/v1/auth/register').send({
      firstName: 'Omovie',
      lastName: 'Smith',
      email: 'omovie@example.com',
      phone: '08012345678',
      password: 'password123',
    });

    const response = await request(app).post('/api/v1/auth/register').send({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'omovie@example.com',
      phone: '08098765432',
      password: 'password123',
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Email is already registered');
  });

  it('rejects blacklisted users', async () => {
    mockAdjutorBlacklistMatch();
    const app = createAuthTestApp();

    const response = await request(app).post('/api/v1/auth/register').send({
      firstName: 'Blocked',
      lastName: 'User',
      email: 'blocked@example.com',
      phone: '08012345678',
      password: 'password123',
    });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('User failed blacklist screening');
  });

  it('logs in a registered user and returns a JWT', async () => {
    mockAdjutorNoMatch();
    const app = createAuthTestApp();

    await request(app).post('/api/v1/auth/register').send({
      firstName: 'Omovie',
      lastName: 'Smith',
      email: 'omovie@example.com',
      phone: '08012345678',
      password: 'password123',
    });

    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'omovie@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.token).toBeDefined();
  });

  it('returns the authenticated user on /auth/me', async () => {
    mockAdjutorNoMatch();
    const app = createAuthTestApp();

    const registerResponse = await request(app).post('/api/v1/auth/register').send({
      firstName: 'Omovie',
      lastName: 'Smith',
      email: 'omovie@example.com',
      phone: '08012345678',
      password: 'password123',
    });

    const response = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${registerResponse.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe('omovie@example.com');
  });
});

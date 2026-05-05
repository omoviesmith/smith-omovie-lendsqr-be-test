import request from 'supertest';

import { createAuthTestApp, mockAdjutorNoMatch } from './test-helpers';

describe('wallet routes', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('requires authentication for the wallet endpoint', async () => {
    const app = createAuthTestApp();

    const response = await request(app).get('/api/v1/wallets/me');

    expect(response.status).toBe(401);
  });

  it('returns the authenticated user wallet', async () => {
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
      .get('/api/v1/wallets/me')
      .set('Authorization', `Bearer ${registerResponse.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.wallet.currency).toBe('NGN');
  });
});

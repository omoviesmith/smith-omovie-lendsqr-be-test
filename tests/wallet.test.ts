import request from 'supertest';

import {
  createAuthTestApp,
  fundWalletForTest,
  mockAdjutorNoMatch,
} from './test-helpers';

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

  it('funds the authenticated wallet and returns an updated balance', async () => {
    mockAdjutorNoMatch();
    const app = createAuthTestApp();

    const registerResponse = await request(app).post('/api/v1/auth/register').send({
      firstName: 'Omovie',
      lastName: 'Smith',
      email: 'omovie@example.com',
      phone: '08012345678',
      password: 'password123',
    });

    const response = await fundWalletForTest(registerResponse.body.token, 5000);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Wallet funded successfully');
    expect(response.body.reference).toMatch(/^FUND_/);
    expect(response.body.wallet.balance).toBe('5000.0000');
  });

  it('rejects invalid funding amounts', async () => {
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
      .post('/api/v1/wallets/fund')
      .set('Authorization', `Bearer ${registerResponse.body.token}`)
      .send({ amount: 0 });

    expect(response.status).toBe(400);
  });
});

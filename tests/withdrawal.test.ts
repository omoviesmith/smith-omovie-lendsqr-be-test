import request from 'supertest';

import {
  createAuthTestApp,
  fundWalletForTest,
  getUserWalletBalance,
  mockAdjutorNoMatch,
} from './test-helpers';

describe('withdraw route', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('withdraws funds and returns the updated wallet balance', async () => {
    mockAdjutorNoMatch();
    const app = createAuthTestApp();

    const registerResponse = await request(app).post('/api/v1/auth/register').send({
      firstName: 'Omovie',
      lastName: 'Smith',
      email: 'omovie@example.com',
      phone: '08012345678',
      password: 'password123',
    });

    await fundWalletForTest(registerResponse.body.token, 5000);

    const response = await request(app)
      .post('/api/v1/wallets/withdraw')
      .set('Authorization', `Bearer ${registerResponse.body.token}`)
      .send({
        amount: 1200,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Withdrawal completed successfully');
    expect(response.body.reference).toMatch(/^WDR_/);
    expect(response.body.wallet.balance).toBe('3800.0000');
    expect(await getUserWalletBalance('omovie@example.com')).toBe('3800.0000');
  });

  it('rejects withdrawal when balance is insufficient', async () => {
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
      .post('/api/v1/wallets/withdraw')
      .set('Authorization', `Bearer ${registerResponse.body.token}`)
      .send({
        amount: 1200,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Insufficient wallet balance');
  });
});

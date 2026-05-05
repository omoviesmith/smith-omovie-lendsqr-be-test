import request from 'supertest';

import { createAuthTestApp, mockAdjutorNoMatch } from './test-helpers';

describe('withdraw route', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns withdrawal scaffold response', async () => {
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

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Withdrawal scaffold created');
    expect(response.body.amount).toBe('1200.00');
  });
});

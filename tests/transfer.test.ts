import request from 'supertest';

import { createAuthTestApp, mockAdjutorNoMatch } from './test-helpers';

describe('transfer route', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns transfer scaffold response', async () => {
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
      .post('/api/v1/wallets/transfer')
      .set('Authorization', `Bearer ${registerResponse.body.token}`)
      .send({
        recipientEmail: 'receiver@example.com',
        amount: 5000,
        narration: 'Wallet transfer',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Transfer scaffold created');
    expect(response.body.reference).toMatch(/^TRF_/);
  });
});

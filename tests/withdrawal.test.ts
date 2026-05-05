import request from 'supertest';

import { createApp } from '../src/app';

describe('withdraw route', () => {
  it('returns withdrawal scaffold response', async () => {
    const app = createApp();

    const response = await request(app).post('/api/v1/wallets/withdraw').send({
      amount: 1200,
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Withdrawal scaffold created');
    expect(response.body.amount).toBe('1200.00');
  });
});

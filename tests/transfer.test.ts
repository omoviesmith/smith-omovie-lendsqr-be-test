import request from 'supertest';

import { createApp } from '../src/app';

describe('transfer route', () => {
  it('returns transfer scaffold response', async () => {
    const app = createApp();

    const response = await request(app).post('/api/v1/wallets/transfer').send({
      recipientEmail: 'receiver@example.com',
      amount: 5000,
      narration: 'Wallet transfer',
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Transfer scaffold created');
    expect(response.body.reference).toMatch(/^TRF_/);
  });
});

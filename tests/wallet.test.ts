import request from 'supertest';

import { createApp } from '../src/app';

describe('wallet routes', () => {
  it('returns wallet scaffold for the authenticated wallet endpoint', async () => {
    const app = createApp();

    const response = await request(app).get('/api/v1/wallets/me');

    expect(response.status).toBe(200);
    expect(response.body.wallet.currency).toBe('NGN');
  });
});

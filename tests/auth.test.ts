import request from 'supertest';

import { createApp } from '../src/app';

describe('auth routes', () => {
  it('register endpoint returns scaffold response', async () => {
    const app = createApp();

    const response = await request(app).post('/api/v1/auth/register').send({
      firstName: 'Omovie',
      lastName: 'Smith',
      email: 'omovie@example.com',
      phone: '08012345678',
      password: 'password123',
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Registration scaffold created');
    expect(response.body.token).toBeDefined();
  });
});

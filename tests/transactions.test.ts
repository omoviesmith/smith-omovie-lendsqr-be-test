import request from 'supertest';

import {
  createAuthTestApp,
  fundWalletForTest,
  mockAdjutorNoMatch,
} from './test-helpers';

describe('transactions route', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('lists transactions for the authenticated wallet', async () => {
    mockAdjutorNoMatch();
    const app = createAuthTestApp();

    const registerResponse = await request(app).post('/api/v1/auth/register').send({
      firstName: 'Omovie',
      lastName: 'Smith',
      email: 'omovie@example.com',
      phone: '08012345678',
      password: 'password123',
    });

    await fundWalletForTest(registerResponse.body.token, 2500);

    const response = await request(app)
      .get('/api/v1/transactions')
      .set('Authorization', `Bearer ${registerResponse.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.transactions).toHaveLength(1);
    expect(response.body.transactions[0].type).toBe('FUNDING');
  });
});

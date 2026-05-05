import request from 'supertest';

import {
  createAuthTestApp,
  fundWalletForTest,
  getUserWalletBalance,
  mockAdjutorNoMatch,
} from './test-helpers';

describe('transfer route', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('transfers funds between wallets and preserves balance consistency', async () => {
    mockAdjutorNoMatch();
    const app = createAuthTestApp();

    const senderRegisterResponse = await request(app).post('/api/v1/auth/register').send({
      firstName: 'Omovie',
      lastName: 'Smith',
      email: 'omovie@example.com',
      phone: '08012345678',
      password: 'password123',
    });
    await request(app).post('/api/v1/auth/register').send({
      firstName: 'Receiver',
      lastName: 'User',
      email: 'receiver@example.com',
      phone: '08098765432',
      password: 'password123',
    });
    await fundWalletForTest(senderRegisterResponse.body.token, 5000);

    const response = await request(app)
      .post('/api/v1/wallets/transfer')
      .set('Authorization', `Bearer ${senderRegisterResponse.body.token}`)
      .send({
        recipientEmail: 'receiver@example.com',
        amount: 1500,
        narration: 'Wallet transfer',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Transfer completed successfully');
    expect(response.body.reference).toMatch(/^TRF_/);
    expect(response.body.senderWallet.balance).toBe('3500.0000');

    expect(await getUserWalletBalance('omovie@example.com')).toBe('3500.0000');
    expect(await getUserWalletBalance('receiver@example.com')).toBe('1500.0000');
  });

  it('rejects transfer to self', async () => {
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
      .post('/api/v1/wallets/transfer')
      .set('Authorization', `Bearer ${registerResponse.body.token}`)
      .send({
        recipientEmail: 'omovie@example.com',
        amount: 500,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('You cannot transfer funds to yourself');
  });

  it('rejects missing recipient wallets', async () => {
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
      .post('/api/v1/wallets/transfer')
      .set('Authorization', `Bearer ${registerResponse.body.token}`)
      .send({
        recipientEmail: 'missing@example.com',
        amount: 500,
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Recipient not found');
  });

  it('rejects transfer when sender balance is insufficient', async () => {
    mockAdjutorNoMatch();
    const app = createAuthTestApp();

    const senderRegisterResponse = await request(app).post('/api/v1/auth/register').send({
      firstName: 'Omovie',
      lastName: 'Smith',
      email: 'omovie@example.com',
      phone: '08012345678',
      password: 'password123',
    });
    await request(app).post('/api/v1/auth/register').send({
      firstName: 'Receiver',
      lastName: 'User',
      email: 'receiver@example.com',
      phone: '08098765432',
      password: 'password123',
    });
    await fundWalletForTest(senderRegisterResponse.body.token, 1000);

    const response = await request(app)
      .post('/api/v1/wallets/transfer')
      .set('Authorization', `Bearer ${senderRegisterResponse.body.token}`)
      .send({
        recipientEmail: 'receiver@example.com',
        amount: 5000,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Insufficient wallet balance');
    expect(await getUserWalletBalance('omovie@example.com')).toBe('1000.0000');
    expect(await getUserWalletBalance('receiver@example.com')).toBe('0.0000');
  });
});

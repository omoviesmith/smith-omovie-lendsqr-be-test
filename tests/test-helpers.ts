import request from 'supertest';
import { getDb } from '../src/config/database';

import { createApp } from '../src/app';

export const createAuthTestApp = () => createApp();

export const mockAdjutorNoMatch = () =>
  jest.spyOn(global, 'fetch').mockResolvedValue({
    ok: false,
    status: 404,
  } as Response);

export const mockAdjutorBlacklistMatch = () =>
  jest.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({
      status: 'success',
      data: {
        karma_identity: '2348012345678',
      },
    }),
  } as Response);

export const registerTestUser = async () => {
  const app = createAuthTestApp();

  const response = await request(app).post('/api/v1/auth/register').send({
    firstName: 'Omovie',
    lastName: 'Smith',
    email: 'omovie@example.com',
    phone: '08012345678',
    password: 'password123',
  });

  return {
    app,
    response,
  };
};

export const fundWalletForTest = async (token: string, amount: number) => {
  const app = createAuthTestApp();

  return request(app)
    .post('/api/v1/wallets/fund')
    .set('Authorization', `Bearer ${token}`)
    .send({ amount });
};

export const getUserWalletBalance = async (email: string) => {
  const db = getDb();
  const user = await db('users').where({ email }).first();
  const wallet = await db('wallets').where({ user_id: user.id }).first();

  return wallet.balance as string;
};

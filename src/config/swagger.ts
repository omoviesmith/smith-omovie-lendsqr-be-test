export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Demo Credit Wallet API',
    version: '1.0.0',
    description: 'Stage 2 scaffold for the Lendsqr backend engineering assessment.',
  },
  servers: [
    {
      url: '/api/v1',
    },
  ],
  paths: {
    '/auth/register': {
      post: {
        summary: 'Register a new user',
      },
    },
    '/auth/login': {
      post: {
        summary: 'Authenticate a user',
      },
    },
    '/wallets/me': {
      get: {
        summary: 'Get authenticated wallet',
      },
    },
  },
};

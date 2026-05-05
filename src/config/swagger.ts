export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Demo Credit Wallet API',
    version: '1.0.0',
    description:
      'Production-minded wallet API for the Lendsqr Backend Engineer assessment, including JWT authentication, Adjutor Karma blacklist screening, wallet operations, and transaction history.',
  },
  servers: [
    {
      url: '/api/v1',
      description: 'API v1',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Registration, login, and authenticated profile access' },
    { name: 'Wallets', description: 'Wallet balance and money movement operations' },
    { name: 'Transactions', description: 'Wallet transaction history' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Insufficient wallet balance',
          },
        },
      },
      UserProfile: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          firstName: { type: 'string', example: 'Smith' },
          lastName: { type: 'string', example: 'Omovie' },
          email: { type: 'string', format: 'email', example: 'smith@example.com' },
          phone: { type: 'string', example: '2348012345678' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Wallet: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          balance: { type: 'string', example: '5000.0000' },
          currency: { type: 'string', example: 'NGN' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Transaction: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 10 },
          reference: { type: 'string', example: 'trf_1714900000000_abcd1234' },
          walletId: { type: 'integer', example: 1 },
          sourceWalletId: { type: 'integer', nullable: true, example: 1 },
          destinationWalletId: { type: 'integer', nullable: true, example: 2 },
          type: {
            type: 'string',
            enum: ['FUNDING', 'WITHDRAWAL', 'TRANSFER_DEBIT', 'TRANSFER_CREDIT'],
            example: 'TRANSFER_DEBIT',
          },
          amount: { type: 'string', example: '5000.0000' },
          balanceBefore: { type: 'string', example: '15000.0000' },
          balanceAfter: { type: 'string', example: '10000.0000' },
          status: {
            type: 'string',
            enum: ['PENDING', 'SUCCESSFUL', 'FAILED'],
            example: 'SUCCESSFUL',
          },
          narration: { type: 'string', example: 'Wallet transfer' },
          metadata: {
            type: 'object',
            additionalProperties: true,
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      RegisterRequest: {
        type: 'object',
        required: ['firstName', 'lastName', 'email', 'phone', 'password'],
        properties: {
          firstName: { type: 'string', example: 'Smith' },
          lastName: { type: 'string', example: 'Omovie' },
          email: { type: 'string', format: 'email', example: 'smith@example.com' },
          phone: { type: 'string', example: '2348012345678' },
          password: { type: 'string', format: 'password', example: 'Password123' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'smith@example.com' },
          password: { type: 'string', format: 'password', example: 'Password123' },
        },
      },
      FundWalletRequest: {
        type: 'object',
        required: ['amount'],
        properties: {
          amount: { type: 'number', example: 5000 },
        },
      },
      WithdrawWalletRequest: {
        type: 'object',
        required: ['amount'],
        properties: {
          amount: { type: 'number', example: 2500 },
        },
      },
      TransferWalletRequest: {
        type: 'object',
        required: ['recipientEmail', 'amount'],
        properties: {
          recipientEmail: { type: 'string', format: 'email', example: 'user@example.com' },
          amount: { type: 'number', example: 5000 },
          narration: { type: 'string', example: 'Wallet transfer' },
        },
      },
      RegisterResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Registration successful' },
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          user: { $ref: '#/components/schemas/UserProfile' },
          wallet: { $ref: '#/components/schemas/Wallet' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Login successful' },
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          user: { $ref: '#/components/schemas/UserProfile' },
          wallet: { $ref: '#/components/schemas/Wallet' },
        },
      },
      AuthenticatedUserResponse: {
        type: 'object',
        properties: {
          user: { $ref: '#/components/schemas/UserProfile' },
        },
      },
      WalletResponse: {
        type: 'object',
        properties: {
          wallet: { $ref: '#/components/schemas/Wallet' },
        },
      },
      WalletTransactionResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Wallet funded successfully' },
          reference: { type: 'string', example: 'fund_1714900000000_abcd1234' },
          wallet: { $ref: '#/components/schemas/Wallet' },
          transaction: { $ref: '#/components/schemas/Transaction' },
        },
      },
      TransferResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Transfer completed successfully' },
          reference: { type: 'string', example: 'trf_1714900000000_abcd1234' },
          senderWallet: { $ref: '#/components/schemas/Wallet' },
          recipientWallet: { $ref: '#/components/schemas/Wallet' },
        },
      },
      TransactionsResponse: {
        type: 'object',
        properties: {
          transactions: {
            type: 'array',
            items: { $ref: '#/components/schemas/Transaction' },
          },
        },
      },
    },
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user and create a wallet',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Registration succeeded',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegisterResponse' },
              },
            },
          },
          '403': {
            description: 'User failed Adjutor blacklist screening',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '409': {
            description: 'Email or phone number already exists',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Authenticate a user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login succeeded',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' },
              },
            },
          },
          '401': {
            description: 'Invalid email or password',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get authenticated user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Authenticated user profile',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthenticatedUserResponse' },
              },
            },
          },
          '401': {
            description: 'Missing or invalid JWT',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/wallets/me': {
      get: {
        tags: ['Wallets'],
        summary: 'Get authenticated user wallet',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Wallet retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/WalletResponse' },
              },
            },
          },
          '401': {
            description: 'Missing or invalid JWT',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/wallets/fund': {
      post: {
        tags: ['Wallets'],
        summary: 'Fund authenticated user wallet',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/FundWalletRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Wallet funded successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/WalletTransactionResponse' },
              },
            },
          },
          '400': {
            description: 'Invalid amount',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Missing or invalid JWT',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/wallets/withdraw': {
      post: {
        tags: ['Wallets'],
        summary: 'Withdraw from authenticated user wallet',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/WithdrawWalletRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Withdrawal completed successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/WalletTransactionResponse' },
              },
            },
          },
          '400': {
            description: 'Invalid amount or insufficient balance',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Missing or invalid JWT',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/wallets/transfer': {
      post: {
        tags: ['Wallets'],
        summary: 'Transfer funds to another wallet by recipient email',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TransferWalletRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Transfer completed successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TransferResponse' },
              },
            },
          },
          '400': {
            description: 'Invalid amount, self-transfer, or insufficient balance',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Missing or invalid JWT',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Recipient not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/transactions': {
      get: {
        tags: ['Transactions'],
        summary: 'List authenticated user wallet transactions',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Transaction history retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TransactionsResponse' },
              },
            },
          },
          '401': {
            description: 'Missing or invalid JWT',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
} as const;

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env';
import { swaggerDocument } from './config/swagger';
import { authRoutes } from './modules/auth/auth.routes';
import { transactionRoutes } from './modules/transactions/transaction.routes';
import { walletRoutes } from './modules/wallets/wallet.routes';
import { errorMiddleware } from './shared/errors/error.middleware';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  app.get('/health', (_request, response) => {
    response.status(200).json({
      status: 'ok',
      service: env.APP_NAME,
      environment: env.NODE_ENV,
    });
  });

  app.use(`${env.API_PREFIX}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use(`${env.API_PREFIX}/auth`, authRoutes);
  app.use(`${env.API_PREFIX}/wallets`, walletRoutes);
  app.use(`${env.API_PREFIX}/transactions`, transactionRoutes);

  app.use(errorMiddleware);

  return app;
};

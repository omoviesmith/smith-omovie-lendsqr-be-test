import type { Knex } from 'knex';

import { env } from './src/config/env';

const sharedConfig: Partial<Knex.Config> = {
  client: 'mysql2',
  migrations: {
    directory: './src/database/migrations',
    extension: 'ts',
  },
  seeds: {
    directory: './src/database/seeds',
    extension: 'ts',
  },
};

const config: Record<string, Knex.Config> = {
  development: {
    ...sharedConfig,
    connection: {
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
    },
  } as Knex.Config,
  test: {
    ...sharedConfig,
    connection: {
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: `${env.DB_NAME}_test`,
    },
  } as Knex.Config,
  production: {
    ...sharedConfig,
    connection: {
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
    },
  } as Knex.Config,
};

export default config;

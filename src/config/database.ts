import path from 'path';

import knex, { type Knex } from 'knex';

import { env } from './env';

let dbInstance: Knex | null = null;

const resolveDatabaseName = () => {
  return env.NODE_ENV === 'test' ? `${env.DB_NAME}_test` : env.DB_NAME;
};

export const getDb = () => {
  if (!dbInstance) {
    dbInstance = knex({
      client: 'mysql2',
      connection: {
        host: env.DB_HOST,
        port: env.DB_PORT,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: resolveDatabaseName(),
      },
      pool: {
        min: 0,
        max: 10,
      },
      migrations: {
        directory: path.resolve(__dirname, '../database/migrations'),
        extension: 'ts',
      },
      seeds: {
        directory: path.resolve(__dirname, '../database/seeds'),
        extension: 'ts',
      },
    });
  }

  return dbInstance;
};

export const closeDb = async () => {
  if (dbInstance) {
    await dbInstance.destroy();
    dbInstance = null;
  }
};

export const getDatabaseName = resolveDatabaseName;

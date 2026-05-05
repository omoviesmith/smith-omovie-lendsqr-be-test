import knex, { type Knex } from 'knex';

import { env } from './env';

let dbInstance: Knex | null = null;

export const getDb = () => {
  if (!dbInstance) {
    dbInstance = knex({
      client: 'mysql2',
      connection: {
        host: env.DB_HOST,
        port: env.DB_PORT,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
      },
      pool: {
        min: 0,
        max: 10,
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

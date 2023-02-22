import pg from 'pg';
import { Sequelize } from 'sequelize';

import * as Article from './Article/entity';
import * as Comment from './Comment/entity';
import * as User from './User/entity';

const NODE_ENV = process.env.NODE_ENV,
  DATABASE_URL = process.env.DATABASE_URL!;

export const isProduct = NODE_ENV === 'production';

export const sequelize = isProduct
  ? new Sequelize(DATABASE_URL, { dialectModule: pg })
  : new Sequelize({ dialect: 'sqlite', storage: '.data/test.db' });

export const readyDB = (async () => {
  for (const { init } of [User, Article, Comment]) init(sequelize);

  await sequelize.authenticate();

  await sequelize.sync({ alter: true });
})();

export interface ListChunk<T> {
  rows: T[];
  count: number;
}

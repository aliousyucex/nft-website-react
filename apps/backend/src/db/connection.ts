import {Kysely, PostgresDialect} from 'kysely';
import {Pool} from 'pg';
import config from '../config';
import logger from '../utils/logger';
import type {Database} from './types';

class DatabaseConnection {
  private pool: Pool;
  public db: Kysely<Database>;
  private static instance: DatabaseConnection;

  private constructor() {
    this.pool = new Pool({
      connectionString: config.database.url,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.pool.on('error', (err) => {
      logger.error('Unexpected error on idle client', err);
      process.exit(-1);
    });

    this.pool.on('connect', () => {
      logger.info('Database connected successfully');
    });

    // Initialize Kysely with PostgreSQL dialect
    this.db = new Kysely<Database>({
      dialect: new PostgresDialect({
        pool: this.pool,
      }),
      log(event) {
        if (event.level === 'query') {
          logger.debug('Kysely query', {
            sql: event.query.sql,
            params: event.query.parameters,
            duration: event.queryDurationMillis,
          });
        } else if (event.level === 'error') {
          logger.error('Kysely error', event.error);
        }
      },
    });
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public getPool(): Pool {
    return this.pool;
  }

  public getKysely(): Kysely<Database> {
    return this.db;
  }

  public async testConnection(): Promise<boolean> {
    try {
      const result = await this.db
        .selectFrom('leaderboard')
        .select(this.db.fn.count<number>('id').as('count'))
        .executeTakeFirst();

      logger.info('Database connection test successful', {
        tableCheck: 'leaderboard',
        rowCount: result?.count,
      });
      return true;
    } catch (error) {
      logger.error('Database connection test failed', error);
      return false;
    }
  }

  public async close(): Promise<void> {
    await this.db.destroy();
    await this.pool.end();
    logger.info('Database connection closed');
  }
}

const dbConnection = DatabaseConnection.getInstance();

// Export both the instance and the kysely db
export default dbConnection;
export const db = dbConnection.getKysely();

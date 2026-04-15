import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5433,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgrespwd',
    database: process.env.DB_NAME || 'sql_class_2_db',
    max: 20,
    connectionTimeoutMillis: 0,
    idleTimeoutMillis: 0,
});

export default pool;
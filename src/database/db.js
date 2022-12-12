import pkg from 'pg';
const { Pool } = pkg;

const connection = new Pool({
    connectionString: process.env.DATABASE_URL,
    host: 'localhost',
    port: 5432,
    user: "postgres",
    password: "driven2022",
    database: "boardcamp"
});

export default connection;
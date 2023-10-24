import mysql from 'mysql2/promise';

const db = await mysql.createConnection({
    host: process.env.DB_CONNEXION_HOST,
    user: process.env.DB_CONNEXION_USER,
    password: process.env.DB_CONNEXION_PASSWORD,
    database: process.env.DB_CONNEXION_DATABASE,
    port: process.env.DB_CONNEXION_PORT
});

export default db;
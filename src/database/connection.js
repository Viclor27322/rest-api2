import mysql from 'mysql2/promise';
import config from '../config';

export const dbSettings = {
  host: config.dbServer,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbDatabase,
};

export const getConnection = async () => {
  try {
    const pool = await mysql.createConnection(dbSettings);
    return pool;
  } catch (error) {
    console.error('Error de conexión: ', error);
  }
};

export { mysql };
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
//import pkg from 'pg';


dotenv.config({ silent: true });
//const { Pool } = pkg;

const db = new Sequelize(
  {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    define: {
      timestamps: false
    }
  }
);

//console.log(`DB_USER: ${process.env.DB_USER} DB_HOST:${process.env.DB_HOST} DB_NAME:${process.env.DB_NAME} DB_PORT: ${process.env.DB_PORT} DB_PASS: ${process.env.DB_PASS}`);

/*
// Configure the PostgreSQL connection parameters
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,

});

export default pool;
*/

export default db;
import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config({ silent: true });

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

export default db;
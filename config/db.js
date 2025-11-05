import { Sequelize } from "sequelize";
import config from "./index.js";
import mysql from "mysql2/promise";



// create DB
await mysql.createConnection({ host: config.DATABASE_HOST, port: config.DATABASE_PORT, user: config.DATABASE_USERNAME, password: config.DATABASE_PASSWORD })
  .then(conn => conn.query(`CREATE DATABASE IF NOT EXISTS \`${config.DATABASE_NAME}\`;`).then(() => conn.end()));

const sequelize = new Sequelize(
  config.DATABASE_NAME,
  config.DATABASE_USERNAME,
  config.DATABASE_PASSWORD,
  {
    dialect: config.DATABASE_DIALECT,
    host: config.DATABASE_HOST,
    port: config.DATABASE_PORT,
    logging: (msg) => console.log(msg),
  }
);

export const connection = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Unable to connect to the database:", error);
  }
};

export default sequelize;

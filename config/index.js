import dotenv from "dotenv";
dotenv.config();

export default {
  ENVIRONMENT: process.env.NODE_ENV || "dev",
  PORT: Number(process.env.PORT || 3000),
  DATABASE_NAME: process.env.DATABASE_NAME || "quizApp_db",
  DATABASE_USERNAME: process.env.DATABASE_USERNAME || "cisco",
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || "cisco123",
  DATABASE_PORT: Number(process.env.DATABASE_PORT || 3306),
  DATABASE_DIALECT: process.env.DATABASE_DIALECT || "mysql",
  DATABASE_HOST: process.env.DATABASE_HOST || "localhost",
};

import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

export const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // For self-signed certs
      },
    },
    port: parseInt(process.env.DB_PORT as string, 10) || 5432,
  },
);

import "../models/Facility";
import "../models/ProductionLine";
import "../models/TestResult";

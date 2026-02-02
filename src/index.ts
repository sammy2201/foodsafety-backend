import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { sequelize } from "./db";

const PORT = 3000;

(async () => {
  await sequelize.authenticate();
  await sequelize.sync();

  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
})();

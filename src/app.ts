import express from "express";
import routes from "./routes/testResults.routes";
import cors from "cors";

const app = express();

// Allow all origins (development only)
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use(express.json());

app.use(express.json());
app.use("/api", routes);

export default app;

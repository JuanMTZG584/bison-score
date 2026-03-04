import express from "express";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.route.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(env.PORT, () => 
  console.log(`Server listening on port ${env.PORT}`)
);
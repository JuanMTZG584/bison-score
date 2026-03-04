import express from "express";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.route.js";
import path from "path";

const app = express();

//app.use(express.json());
const __dirname = path.resolve();

app.use("/api/auth", authRoutes);

//make ready for deployment
if (env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.use((req, res) => {
    res.sendFile(
      path.join(__dirname, "../frontend", "dist", "index.html")
    );
  });
}

app.listen(env.PORT, () =>
  console.log(`Server listening on port ${env.PORT}`)
);
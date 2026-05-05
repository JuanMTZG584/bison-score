import { env } from "./config/env.js";
import express from "express";
import authRoutes from "./routes/auth.route.js";
import platformRoutes from "./routes/platform.route.js";
import path from "path";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/platforms",platformRoutes);

//make ready for deployment
if (env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.use((req, res) => {
    res.sendFile(
      path.join(__dirname, "../frontend", "dist", "index.html")
    );
  });
}

app.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`)
  connectDB();
});
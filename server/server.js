import express from "express";
import cors from "cors";
import { PORT } from "./config/env.js";
import connectToDB from "./database/postgres.js";
import { sequelize } from "./database/postgres.js";
import { models } from "./models/index.models.js";
import internshipRouter from "./routes/internship.routes.js";
import authRouter from "./routes/auth.routes.js";
import projectRouter from "./routes/project.routes.js";
import userRouter from "./routes/user.routes.js";
import teamRouter from "./routes/team.routes.js";
import postRouter from "./routes/mediaPost.routes.js";
import livekitRouter from "./routes/livekit.routes.js";

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Increase payload limit for base64 images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use("/api/auth", authRouter);
app.use("/api/internships", internshipRouter);
app.use("/api/projects", projectRouter);
app.use("/api/users", userRouter);
app.use("/api/teams", teamRouter);
app.use("/api/posts", postRouter);
app.use("/api/livekit", livekitRouter);


app.get("/", (req, res) => {
  res.send("Welcome to DevPath");
});

app.listen(PORT, async () => {
  await connectToDB();
  console.log(`DevPath is running on http://localhost:${PORT}`);
  await sequelize.sync({ alter: true });
});

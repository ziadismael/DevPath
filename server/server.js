import express from "express";
import { PORT } from "./config/env.js";
import connectToDB from "./database/postgres.js";
import {sequelize} from "./database/postgres.js";
import {models} from "./models/index.models.js";
import internshipRouter from "./routes/internship.routes.js";

const app = express();
app.use(express.json());
app.use("/internships", internshipRouter);

app.get("/", (req, res) => {
  res.send("Welcome to DevPath");
});

app.listen(PORT, async() => {
  await connectToDB();
  console.log(`DevPath is running on http://localhost:${PORT}`);
  await sequelize.sync({alter: true});
});

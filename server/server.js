import express from "express";
import { PORT } from "./config/env.js";
import connectToDB from "./database/postgres.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to DevPath");
});

app.listen(PORT, async() => {
  console.log(`DevPath is running on http://localhost:${PORT}`);
  await connectToDB();
});


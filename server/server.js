import express from "express";
import { PORT } from "./config/env.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to DevPath");
});

app.listen(PORT, () => {
  console.log(`DevPath is running on http://localhost:${PORT}`);
}); 
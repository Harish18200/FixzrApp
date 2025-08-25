import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import routes from "./routes/router";

dotenv.config();

const app = express();
app.use(express.json()); // for parsing application/json

app.use("/api/", routes); // all routes start with /api/users

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error(err));

app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});

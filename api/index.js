import express, { json } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err.message));

const PORT = 3000;
const app = express();

app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/user", authRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error!";

  res.status(statusCode).json({
    success: "false",
    statusCode,
    message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running with Port ${PORT}`);
});

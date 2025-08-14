// 1. External imports
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

// 2. Internal files
import connectDB from "./config/dbconnect.js";
import router from "./routes/root.js";
import authRouter from "./routes/authRoute.js";
import usersRouter from "./routes/usersRoute.js";
import exchangeRateRouter from "./routes/exchangeRateRoute.js";
import transactionsRouter from "./routes/transactionsRoute.js";

dotenv.config();
const app = express();

// Connect to DB
connectDB();
mongoose.connection.once("open", () => {
  console.log("✅ Connected to MongoDB");
});
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error", err);
});

// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://frontend-paymeny.vercel.app"
//     ],
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);


app.use(express.json());
app.use(cookieParser());

// 3. Routes
app.use("/", router);
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/exchange-rate", exchangeRateRouter); 
app.use("/transactions", transactionsRouter); 



app.all(/.*/, (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

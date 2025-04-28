const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectToDatabase = require("./Utils/connectDB");
const userRoute = require("./Routes/route.user");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

connectToDatabase();

// Middleware
app.use(
  cors({
    origin: [
      `${process.env.USER_FRONTEND_URL}`,
      `${process.env.BANK_FRONTEND_URL}`,
      `${process.env.DISTRIBUTER_FRONTEND_URL}`,
    ],
    credentials: true,
  })
); // Enable CORS for all routes
app.use(morgan("dev")); // Logger middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser());

// Routes
app.use("/api/user", userRoute);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is healthy" });
});

// Error handling middleware
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(
    `Server is running on http://localhost:${PORT}      ==============   USER DASHBOARD     ====================`
  );
});

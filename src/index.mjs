import express from "express";
import cors from "cors";
import { dirname } from "path";
import { fileURLToPath } from "url";

// Import our modules
import pool from "./common/config/db/db.js";
import ApiResponse from "./common/utils/api-response.js";
import ApiError from "./common/utils/api-error.js";

// Import routes
import authRoutes from "./modules/auth/auth.routes.js";
import seatRoutes from "./modules/booking/seat.routes.js";
import movieRoutes from "./modules/movie/movie.routes.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const port = process.env.PORT || 8080;

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static files (for the frontend)
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/../index.html");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/movies", movieRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  ApiResponse.ok(res, "Server is running");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

// 404 handler - must be last
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📊 Database connected`);
});
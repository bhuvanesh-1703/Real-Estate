const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

const isProduction =
  process.env.NODE_ENV === "production" || process.env.STRICT_DB === "true";

// Validate production auth requirements
if (isProduction) {
  const missingSecrets = [];
  if (!process.env.JWT_SECRET) missingSecrets.push("JWT_SECRET");
  if (!process.env.ADMIN_USERNAME) missingSecrets.push("ADMIN_USERNAME");
  if (!process.env.ADMIN_PASSWORD) missingSecrets.push("ADMIN_PASSWORD");

  if (missingSecrets.length > 0) {
    console.error(
      `[Auth Fatal] Missing required authentication environment variables in production: ${missingSecrets.join(", ")}`,
    );
    console.error(
      "[Auth Fatal] Startup aborted to prevent unauthorized access via default credentials.",
    );
    process.exit(1);
  }
}

const app = express();

// Parse CORS allowed origins safely
const getCorsOrigins = () => {
  const rawOrigins = process.env.FRONTEND_URL || "http://localhost:5173";
  return rawOrigins.split(",").map((o) => o.trim().replace(/\/$/, ""));
};

const allowedOrigins = getCorsOrigins();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes("*") ||
        !isProduction
      ) {
        return callback(null, true);
      }
      return callback(
        new Error(
          `CORS policy error: Origin ${origin} is not allowed by FRONTEND_URL configuration.`,
        ),
      );
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API Route with dynamic database status
app.get("/api/health", (req, res) => {
  const dbConnected =
    mongoose.connection && mongoose.connection.readyState === 1;
  res.json({
    status: "online",
    platform: "Aetheria AI Real Estate Engine",
    architecture: "MVC (Models, Controllers, Routes)",
    database: {
      connected: dbConnected,
      state: dbConnected ? "connected" : "disconnected",
    },
    timestamp: new Date().toISOString(),
  });
});

// Import & Mount Modular Routes
const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const leadRoutes = require("./routes/leadRoutes");
const visitRoutes = require("./routes/visitRoutes");
const aiRoutes = require("./routes/aiRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/ai", aiRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("[Unhandled Server Error]:", err.message || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on this server.`,
  });
});

// Async Server Startup Lifecycle
const PORT = process.env.PORT || 5000;

async function startServer() {
  console.log("[Startup] Initiating Aetheria Backend service boot sequence...");
  const isDbConnected = await connectDB();

  if (!isDbConnected && isProduction) {
    console.error(
      "[Startup Fatal] Production server startup failed because MongoDB connection could not be established.",
    );
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(
      `[Aetheria Backend] Server running on http://localhost:${PORT}`,
    );
    console.log(
      `[Aetheria Backend] Environment: ${process.env.NODE_ENV || "development"}`,
    );
    console.log(
      `[Aetheria Backend] Database Status: ${isDbConnected ? "MongoDB Connected" : "In-Memory Fallback Active"}`,
    );
  });
}

startServer();

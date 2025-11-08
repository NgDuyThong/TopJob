import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import { testConnection as testNeo4j } from "./config/neo4j.js";
import { socketHandler } from "./socket/socketHandler.js";

// Routes
import accountRoutes from "./routes/accountRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import employerRoutes from "./routes/employerRoutes.js";
import jobPostRoutes from "./routes/jobPostRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import comparisonRoutes from "./routes/comparisonRoutes.js";

// Middlewares
import { verifyToken } from "./middlewares/auth.js";

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Kết nối databases
connectDB();
testNeo4j();

// Tạo app
const app = express();

// CORS configuration - Cho phép tất cả origins trong development
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Uploads directory - Serve static files from backend/uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', verifyToken, accountRoutes);
app.use('/api/candidates', verifyToken, candidateRoutes);
app.use('/api/employers', employerRoutes); // Public endpoints included
app.use('/api/jobs', jobPostRoutes); // Một số endpoint không cần auth
app.use('/api/applications', verifyToken, applicationRoutes);
app.use('/api/comparison', comparisonRoutes); // MongoDB vs Neo4j Comparison

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", message: "Backend API is running 🚀" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

// Tạo HTTP + Socket server
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL }
});

// Socket.io handler
socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

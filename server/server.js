// server.js
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const cookieParser = require("cookie-parser");
const path = require("path");
const helmet = require("helmet");
const fs = require('fs');


// worker
const logger = require('./utils/logger');
const connectToDatabase  = require('./config/db');

// middleware
const errorMiddleware  = require('./middleware/error-middleware');


// routers
const uploadRoute = require('./routers/upload-router');

// Server Setup
// Server
const app = express();
const server = http.createServer(app);
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
    })
);
app.set("trust proxy", 1); // Trust first proxy (e.g., Nginx, Cloudflare)

app.use(cookieParser());

const allowedOrigins = ["http://localhost:5173"];
const PORT = process.env.PORT || 5000;


app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, origin); // ✅ Allow only one
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("Created 'uploads' directory.");
}

// Serve static files from the uploads folder
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"), {
        setHeaders: (res, filePath) => {
            // Allow cross-origin requests
            res.set("Access-Control-Allow-Origin", "*"); // or set your frontend URL here
            res.set("Access-Control-Allow-Methods", "GET");
            res.set("Access-Control-Allow-Headers", "Content-Type");
            res.set("Access-Control-Expose-Headers", "Content-Length"); // Expose content length for media

            // Set content type based on the file extension
            if (filePath.endsWith(".mp4")) {
                res.set("Content-Type", "video/mp4"); // Set correct content type for video
            } else if (
                filePath.endsWith(".jpeg") ||
                filePath.endsWith(".jpg") ||
                filePath.endsWith(".png")
            ) {
                res.set("Content-Type", "image/jpeg"); // Set content type for images
            }
        },
    })
);


// Routes Defining
app.get("/", (req, res) => {
    res.send("Welcome to the API");
});
app.use('/api/upload',uploadRoute);



// Error Catch
app.use(errorMiddleware);

// Server Starting with Connecting Database
connectToDatabase()
.then(async () => {
    console.log("Connected to MongoDB successfully");

    server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            logger.info(`Server running on port ${PORT}`);
            
        });
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    });
process.on("SIGINT", () => {
    console.log("Shutting down server...");
    server.close(() => {
        console.log("Server shut down gracefully.");
        process.exit(0);
    });
});
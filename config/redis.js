import Redis from "ioredis";

const redis = new Redis({
    host: process.env.REDIS_HOST || "redis-stack" , // Use the Docker Compose service name
    port: process.env.REDIS_PORT  || 6379,
    password: process.env.REDIS_PASSWORD || "",
    retryStrategy: (times) => {
        // Retry connection with exponential backoff
        const delay = Math.min(times * 50, 2000); // Max delay of 2 seconds
        console.log(`Retrying Redis connection... Attempt #${times}`);
        return delay;
    },
    connectTimeout: 10000, // 10 seconds timeout
});

// Handle connection errors
redis.on("error", (err) => {
    console.error("Redis connection error:", err.message);
});

// Log successful connection
redis.on("connect", () => {
    console.log("Connected to Redis successfully.");
});

export default redis;


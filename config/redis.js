import Redis from "ioredis";

const redis = new Redis({
    host: "redis-stack", // Use the Docker Compose service name
    port: 6379,
});

export default redis;

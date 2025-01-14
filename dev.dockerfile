# Use the Node.js 20 image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker's caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Install nodemon globally for live-reloading
RUN npm install -g nodemon

# Copy the rest of the application files
COPY . .

# Expose port 5000
EXPOSE 5000

# Use nodemon for the command in development
CMD ["nodemon", "--watch", ".", "index.js"]

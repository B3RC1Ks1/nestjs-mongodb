# Stage 1: Build the application
FROM node:16-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire source code and build the project
COPY . .
RUN npm run build

# Stage 2: Create the production image
FROM node:16-alpine

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install --production

# Copy the built files from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the port your app listens on
EXPOSE 7856

# Set environment variables (if desired, you can override these in docker-compose)
ENV API_KEY=123

# Start the application
CMD ["node", "dist/main.js"]


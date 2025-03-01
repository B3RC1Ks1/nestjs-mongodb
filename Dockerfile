# Stage 1: Build the application
FROM node:16-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the NestJS application (adjust if you use a different build command)
RUN npm run build

# Stage 2: Run the application
FROM node:16-alpine

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install --production

# Copy the built files from the build stage
COPY --from=build /app/dist ./dist

# Expose the port that the app listens on
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]

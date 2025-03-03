# NestJS Reservations & Tasks Processor API

## Overview

This project is a dockerized API built with [NestJS](https://nestjs.com/) that manages reservations and processes Excel files to update reservation records. It features secure API key authentication, real-time WebSocket notifications, health-check endpoints, and comprehensive error reporting. The stack integrates with MongoDB for data storage and Redis (via Bull) for background job processing.

---

## Features

- **Secure API Endpoints:**  
  Protect your endpoints using a custom API key guard.

- **Health Monitoring:**  
  Check application health and MongoDB connectivity using NestJS Terminus.

- **Reservations Management:**  
  Add or update reservation records from Excel files with full data validation and error reporting.

- **Background Task Processing:**  
  Process uploaded XLSX files asynchronously with Bull and generate CSV error reports if necessary.

- **Real-time Notifications:**  
  Stay updated with task statuses via a WebSocket gateway powered by Socket.io.

- **Dockerized Setup:**  
  Seamlessly deploy the complete stack with Docker Compose, including MongoDB and Redis services.

---

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)

---

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/B3RC1Ks1/nestjs-mongodb.git
   cd nestjs-mongodb
   ```

2. **Configure Environment Variables:**

   **Note:** This application is for demonstration purposes only, so the environment variables are already set in the docker-compose.yml to simplify deployment and testing. There is no need to create a .env file when running the application with Docker.

3. **Build and Run with Docker Compose:**

   ```bash
   docker-compose up --build
   ```

   This command builds the Docker images and starts the application along with the MongoDB and Redis services.

---

## Tools for using API and Database

To test API requests, we recommend using:
- **[Postman](https://www.postman.com/)** - For sending requests to the API endpoints.
- **[MongoDB Compass](https://www.mongodb.com/try/download/compass)** - For visualizing and managing MongoDB data.

Use the following connection string to connect MongoDB Compass to the running database:

```plaintext
mongodb://127.0.0.1:27018/
```

---

## Usage

**Note:** All endpoints require the `x-api-key` header with your API key. By default for demonstration purposes `x-api-key:123` will work.

### API Endpoints

#### Health Check:
- `GET /health` - Returns the health status of the application including MongoDB connectivity.

#### Task Upload:
**Important:** When using Postman, make sure to upload the file as `form-data` with the key set to `file`. This is required for the upload to work correctly.

- `POST /tasks/upload` - Upload an XLSX file containing reservation data.

#### Task Status:
- `GET /tasks/status/:taskId` - Retrieve the current status and error details (if any) of a specific task.

#### Error Report:
- `GET /tasks/report/:taskId` - Get error report in CSV format for a task that encountered validation or processing issues.

### Example XLSX Files for Testing
Two sample Excel files are provided for testing:
1. `reservations_correct.xlsx` - Contains correctly formatted reservation data with no errors.
2. `reservations_errors.xlsx` - Contains intentional errors to demonstrate the validation and error reporting system.

Upload these files via the `/tasks/upload` endpoint to see the system in action.

---

### WebSocket Testing

A sample HTML file called `test-websocket.html` is provided to test WebSocket notifications.

To check it out simply open the HTML file in your browser and enter console to see live notifications as tasks are processed.

---

## Project Structure

```
.
├── src
│   ├── app.module.ts                # Main application module
│   ├── main.ts                      # Application entry point
│   ├── guard
│   │   └── Api-key.guard.ts         # API key authentication guard
│   ├── health
│   │   ├── Health.controller.ts     # Health check endpoint controller
│   │   ├── Health.gateway.ts        # WebSocket gateway for health status updates
│   │   └── Health.module.ts         # Health module setup
│   ├── reservations
│   │   ├── Reservation.dto.ts       # Data Transfer Object for reservations
│   │   ├── Reservation.module.ts    # Reservations module
│   │   └── Reservation.service.ts   # Business logic for reservations
│   ├── schemas
│   │   ├── Reservation.schema.ts    # Mongoose schema for reservations
│   │   └── Task.schema.ts           # Mongoose schema for tasks
│   └── tasks
│       ├── Task.controller.ts       # Endpoints for file upload and task status
│       ├── Task.gateway.ts          # WebSocket gateway for real-time updates
│       ├── Task.module.ts           # Tasks module
│       ├── Task.processor.ts        # Background processor for tasks
│       └── Task.service.ts          # Task management service
├── docker-compose.yml               # Docker Compose configuration
├── Dockerfile                       # Multi-stage Dockerfile for building the app
└── src/test-websocket.html          # Sample WebSocket test client
```

---

## Docker Files

### Dockerfile
The `Dockerfile` uses a multi-stage build process:

- **Builder Stage:**
  - Installs dependencies, copies source code, and builds the project.
- **Production Stage:**
  - Copies the built files and installs only production dependencies to create a lean runtime image.

### docker-compose.yml
This file defines three services:

- `app`: Your NestJS application.
- `mongo`: MongoDB service for data persistence.
- `redis`: Redis service for managing the task queue.

---


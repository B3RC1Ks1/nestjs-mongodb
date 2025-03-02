<p align="center">
  <a href="https://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

<p align="center">
  <b>A simple NestJS + MongoDB application for uploading and processing Excel reservations.</b>
</p>

<p align="center">
  <a href="LICENSE" target="blank">
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License"/>
  </a>
  <a href="https://github.com/yourname/your-repo/actions" target="blank">
    <img src="https://github.com/yourname/your-repo/actions/workflows/ci.yml/badge.svg" alt="CI Status" />
  </a>
  <a href="https://hub.docker.com/r/yourname/your-repo" target="blank">
    <img src="https://img.shields.io/docker/pulls/library/ubuntu?label=docker%20pulls" alt="Docker Pulls" />
  </a>
</p>

---

## Description

This NestJS application demonstrates how to:

- **Upload and process Excel files** containing reservation data  
- **Store reservations in MongoDB**  
- **Track tasks** (upload/processing) with BullMQ (Redis)  
- **Generate error reports** for invalid rows in CSV format  
- **Socket.IO notifications** for real-time task status updates  
- **API key guard** for basic endpoint protection  
- **Health checks** using NestJS Terminus (pinging MongoDB)

## Features

1. **File Upload & Processing**  
   - `/tasks/upload` accepts `.xlsx` files (via Multer)  
   - A background queue (BullMQ) processes reservations row-by-row

2. **Task Monitoring**  
   - Check task status at `/tasks/status/:taskId`  
   - Download error reports at `/tasks/report/:taskId`

3. **Socket.IO Gateway**  
   - Real-time updates on each task’s status  
   - Subscribed clients receive `taskStatusUpdate` events

4. **API Key Protection**  
   - All routes require `x-api-key` header matching `process.env.API_KEY`

5. **Health Endpoint**  
   - `/health` checks MongoDB connectivity

---

## Project Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/yourname/your-repo.git
   cd your-repo

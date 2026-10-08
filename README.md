# CivicFix

A full-stack civic issue reporting and tracking platform that connects citizens with administrators to report, monitor, prioritize, and resolve local civic problems.

## 🚀 Features

### 👤 Citizen

* User registration and login
* Report civic issues with category, title, description, and location
* Interactive map-based location selection
* View previously reported issues
* Track issue status:

  * Reported
  * In Progress
  * Resolved
* View issue details, priority, category, and location
* Persistent authentication across sessions

### 🛡️ Admin

* Secure admin authentication
* Dashboard with issue statistics
* View all reported civic issues
* Interactive India map with issue markers
* Filter issues by status, category, and priority
* Update issue status
* Update issue priority
* View detailed issue information

## 🏗️ Architecture

```text
┌─────────────────────────┐
│     Citizen / Admin     │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   React + Vite Frontend │
└────────────┬────────────┘
             │ REST API
             ▼
┌─────────────────────────┐
│      FastAPI Backend    │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   PostgreSQL Database   │
└─────────────────────────┘
```

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* React Router
* Leaflet
* React Leaflet
* Lucide React

### Backend

* FastAPI
* Python
* SQLAlchemy
* PostgreSQL
* JWT / Bearer Authentication

### Infrastructure

* Docker
* Docker Compose

## 📂 Project Structure

```text
CivicFix/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

## 🔐 Authentication & Roles

CivicFix uses role-based authentication to provide different functionality to citizens and administrators.

| Role    | Capabilities                                    |
| ------- | ----------------------------------------------- |
| Citizen | Report and track civic issues                   |
| Admin   | Manage, prioritize, and resolve reported issues |

Authentication is handled using bearer tokens, with protected endpoints for administrative operations.

## 📍 Issue Management

Each reported issue contains information such as:

* Ticket ID
* Category
* Title
* Description
* Location
* Priority
* Status
* Reporting citizen
* Timestamps

Issues follow a simple lifecycle:

```text
REPORTED
    ↓
IN_PROGRESS
    ↓
RESOLVED
```

Administrators can update the status and priority of reported issues from the admin dashboard.

## 🐳 Running Locally

### Prerequisites

Make sure you have:

* Docker Desktop
* Git

### Clone the repository

```bash
git clone https://github.com/bravimab3/CivicFix.git
cd CivicFix
```

### Start the application

```bash
docker compose up --build
```

The frontend and backend will start through Docker Compose along with the PostgreSQL database.

### Backend API

The FastAPI backend runs inside the Docker environment and exposes REST API endpoints for authentication, issue reporting, issue tracking, and administration.

FastAPI's interactive API documentation is available at:

```text
/docs
```

when accessing the backend locally.

## 🔮 Future Improvements

* Image upload for reported civic issues
* Email/SMS notifications for status updates
* Automatic issue categorization
* Duplicate issue detection
* Analytics for identifying high-priority civic problem areas
* Deployment with a production database and cloud infrastructure

## 🎯 Project Goal

CivicFix aims to provide a centralized platform for reporting and managing civic issues while improving transparency between citizens and local administrators.

## 👨‍💻 Author

**Bravima Billa**

GitHub: https://github.com/bravimab3

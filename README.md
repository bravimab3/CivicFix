@"
# CivicFix

A full-stack civic issue reporting and tracking platform that connects citizens with administrators to report, monitor, and manage local civic problems.

## Features

### Citizen
- User registration and login
- Report civic issues with category, title, description, and location
- Interactive map-based location selection
- View previously reported issues
- Track issue status from Reported → In Progress → Resolved
- View issue details, priority, category, and location

### Admin
- Secure admin authentication
- Dashboard with issue statistics
- View all reported civic issues
- Interactive India map with issue markers
- Filter issues by status, category, and priority
- Update issue status
- Update issue priority
- View detailed issue information

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Leaflet
- React Leaflet
- Lucide React

### Backend
- FastAPI
- Python
- SQLAlchemy
- PostgreSQL
- JWT/Bearer authentication

### Infrastructure
- Docker
- Docker Compose

## Architecture

```text
Citizen / Admin
       |
       v
React + Vite Frontend
       |
       v
FastAPI REST API
       |
       v
PostgreSQL Database
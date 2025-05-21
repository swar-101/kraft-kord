# Kord Kraft

A web application for generating chord progressions with MIDI export capabilities.

## Project Structure

```
kord-kraft/
├── frontend/           # React frontend
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   ├── Dockerfile     # Frontend Docker configuration
│   └── nginx.conf     # Nginx configuration
├── backend/           # Python FastAPI backend
│   ├── main.py        # Backend code
│   ├── requirements.txt
│   └── Dockerfile     # Backend Docker configuration
└── docker-compose.yml # Docker orchestration
```

## Development Setup

### Local Development (Without Docker)

#### Frontend (React)
```bash
cd frontend
npm install
npm start
```
The frontend will run at http://localhost:3000

#### Backend (Python)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
The backend will run at http://localhost:8000

### Docker Development

```bash
# Build and start all services
docker-compose up --build

# Start services in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Features

- Select different moods for chord progressions
- Preview chords with different instruments
- Export MIDI files for use in DAWs
- Clean separation between frontend and backend

## Development

Both frontend and backend support hot-reloading:
- Frontend changes will automatically refresh the browser
- Backend changes will automatically restart the server

## API Documentation

The backend API documentation is available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Deployment

For production deployment:
1. Build the Docker images:
```bash
docker-compose -f docker-compose.prod.yml build
```

2. Start the services:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

Note: Make sure to configure proper environment variables and security settings for production deployment.

# CampusBite

CampusBite is a full-stack restaurant ordering and delivery application. Customers can browse restaurants and menus and place orders, while restaurant staff and admins manage menus and orders through role-based access.

## Features

- User registration and login with JWT authentication
- Role-based access control (RBAC) for different user roles
- Restaurant, menu and order management
- Order placement and tracking
- AI-generated order insights using the OpenAI API
- Fully containerised setup with Docker Compose

## Tech Stack

| Layer     | Technology                |
|-----------|---------------------------|
| Frontend  | React                     |
| Backend   | FastAPI (Python)          |
| Database  | SQLAlchemy ORM            |
| Auth      | JWT, role-based access    |
| AI        | OpenAI API                |
| DevOps    | Docker, Docker Compose    |

## Project Structure

```
.
├── CampusBite/
│   ├── Backend/        # FastAPI application
│   └── Frontend/       # React application
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- An OpenAI API key (for the order insights feature)

### Run with Docker

1. Clone the repository:
   ```
   git clone https://github.com/ruchigupta17/iitRproject-.git
   cd iitRproject-
   ```
2. Create a `.env` file inside the backend folder with your own values:
   ```
   SECRET_KEY=your_jwt_secret
   OPENAI_API_KEY=your_openai_api_key
   DATABASE_URL=your_database_url
   ```
3. Start the application:
   ```
   docker compose up --build
   ```

### Run without Docker

**Backend**
```
cd CampusBite/Backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend**
```
cd CampusBite/Frontend
npm install
npm start
```

## API Documentation

When the backend is running, interactive API docs are available at:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Author

Ruchi Gupta
M.Tech, Information Architecture & Software Engineering, DAVV/SCSIT Indore

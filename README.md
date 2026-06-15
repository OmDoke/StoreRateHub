# StoreRateHub

A full-stack role-based store rating platform where administrators manage stores and users, customers submit ratings, and store owners monitor performance through analytics dashboards.

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: NestJS with TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Auth**: JWT with bcrypt password hashing
- **Security**: Helmet, CORS, Rate Limiting, Global Exception Handling

### Frontend
- **Library**: React 19 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: Material UI (MUI)
- **Routing**: React Router v7
- **Forms**: React Hook Form
- **HTTP Client**: Axios with JWT interceptors
- **Charts**: Recharts
- **State**: Context API

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Docker (optional, for database)

### Database Setup

**Option 1: Docker**
```bash
docker compose up -d
```

**Option 2: Local PostgreSQL**

Create a database named `storeratehub` and update the connection string in `backend/.env`.

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env   # Edit database credentials if needed
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@storeratehub.com | Admin@123 |
| Store Owner | john.storeowner@example.com | Owner@123 |
| Store Owner | jane.storeowner@example.com | Owner@123 |
| User | alice.johnson@example.com | User@1234 |
| User | bob.williams@example.com | User@1234 |
| User | charlie.brown@example.com | User@1234 |

## Features

### Authentication
- JWT-based authentication with refresh tokens
- bcrypt password hashing
- Role-Based Access Control (RBAC)

### Admin Dashboard
- Total Users, Stores, Ratings stats
- Ratings distribution bar chart
- Users by role donut chart

### User Management (Admin)
- CRUD operations for all user types
- Server-side search, filter, sort, pagination

### Store Management (Admin)
- CRUD operations for stores
- Owner assignment

### Normal User
- View all stores with ratings
- Submit / update star ratings (1-5)
- Change password

### Store Owner
- Dashboard with store info and average rating
- List of user ratings with details
- Change password

## API Endpoints

| Method | Endpoint | Auth | Roles |
|--------|----------|------|-------|
| POST | /auth/login | No | - |
| POST | /auth/register | No | - |
| POST | /auth/change-password | Yes | All |
| POST | /auth/refresh | Yes | All |
| GET | /users | Yes | Admin |
| GET | /users/:id | Yes | Admin |
| POST | /users | Yes | Admin |
| PUT | /users/:id | Yes | Admin |
| DELETE | /users/:id | Yes | Admin |
| GET | /stores | Yes | All |
| GET | /stores/:id | Yes | All |
| POST | /stores | Yes | Admin |
| PUT | /stores/:id | Yes | Admin |
| DELETE | /stores/:id | Yes | Admin |
| POST | /ratings | Yes | User |
| PUT | /ratings/:id | Yes | User |
| GET | /ratings/store/:storeId | Yes | All |
| GET | /dashboard/admin | Yes | Admin |
| GET | /dashboard/store-owner | Yes | Store Owner |

## Project Structure

```
StoreRateHub/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── stores/
│   │   ├── ratings/
│   │   ├── dashboard/
│   │   ├── prisma/
│   │   ├── common/
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/layout/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── types/
│   │   └── App.tsx
│   └── index.html
├── docker-compose.yml
└── README.md
```

## License

MIT

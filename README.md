# Samadhan Desk - Public Complaint Portal

A complete full-stack application for managing public complaints, departments, users, and feedbacks.

## Project Structure

```
samadhan-desk/
├── server/          # Backend (Node.js + Express + TypeScript)
└── client/          # Frontend (React + Vite)
```

## Backend

A TypeScript-based REST API for managing public complaints, departments, users, and feedbacks.

## Features

- User authentication and authorization (Citizen, Officer, Admin, Politician)
- Complaint management system
- Department management
- Feedback system for resolved complaints
- JWT-based authentication
- MongoDB database integration

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Project Structure

```
server/
├── src/
│   ├── configs/          # Configuration files (database, etc.)
│   ├── controllers/      # Route controllers
│   ├── middlewares/      # Custom middlewares (auth, etc.)
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   └── server.ts         # Application entry point
├── dist/                 # Compiled JavaScript (generated)
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd samadhan-desk/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/samadhan-desk
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Run the server**
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get current user profile (Protected)
- `GET /api/users/all` - Get all users (Admin only)

### Departments
- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get department by ID
- `POST /api/departments` - Create department (Admin only)
- `PUT /api/departments/:id` - Update department (Admin only)
- `DELETE /api/departments/:id` - Delete department (Admin only)

### Complaints
- `POST /api/complaints` - Create complaint (Protected)
- `GET /api/complaints/my` - Get user's complaints (Protected)
- `GET /api/complaints` - Get all complaints (Admin/Officer only)
- `GET /api/complaints/:id` - Get complaint by ID (Protected)
- `PUT /api/complaints/:id` - Update complaint (Admin/Officer only)
- `DELETE /api/complaints/:id` - Delete complaint (Protected)

### Feedbacks
- `POST /api/feedbacks/:complaintId` - Create feedback for resolved complaint (Protected)
- `GET /api/feedbacks/:complaintId` - Get feedbacks for a complaint (Protected)

## User Roles

- **citizen**: Default role, can create complaints and submit feedback
- **officer**: Can view and update complaints
- **admin**: Full access to all resources
- **politician**: Special role for politicians

## Development

### Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Run in development mode with auto-reload
- `npm start` - Run compiled JavaScript
- `npm run type-check` - Check TypeScript types without compiling

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment (development/production) | development |
| `MONGO_URI` | MongoDB connection string | - |
| `JWT_SECRET` | Secret key for JWT tokens | - |

## Frontend

A modern, user-friendly React frontend with a clean and simple design.

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

4. **Build for production**
   ```bash
   npm run build
   ```

### Frontend Features

- 🎨 Clean and simple UI design
- 🔐 User authentication (Login/Register)
- 📝 File and track complaints
- 📊 Dashboard with statistics
- 🏢 Browse departments
- 💬 Submit feedback on resolved complaints
- 📱 Fully responsive design

## Running the Full Stack

1. **Start the backend server** (from `server/` directory)
   ```bash
   cd server
   npm run dev
   ```

2. **Start the frontend** (from `client/` directory)
   ```bash
   cd client
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## License

ISC

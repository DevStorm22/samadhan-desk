# Samadhan Desk - Frontend

A modern, user-friendly frontend for the Samadhan Desk Public Complaint Portal.

## Features

- 🎨 Clean and simple UI design
- 🔐 User authentication (Login/Register)
- 📝 File and track complaints
- 📊 Dashboard with statistics
- 🏢 Browse departments
- 💬 Submit feedback on resolved complaints
- 📱 Fully responsive design

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type-safe development
- **React Router** - Navigation
- **Axios** - HTTP client
- **Vite** - Build tool

## Setup

1. **Install dependencies**
   ```bash
   cd client
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Type checking**
   ```bash
   npm run type-check
   ```

## Environment Variables

Create a `.env` file in the `client` directory (optional):

```env
VITE_API_URL=http://localhost:5000/api
```

## Project Structure

```
client/
├── src/
│   ├── components/     # Reusable UI components (TypeScript)
│   ├── contexts/        # React contexts (Auth)
│   ├── pages/          # Page components (TypeScript)
│   ├── services/       # API service layer (TypeScript)
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── index.html
├── package.json
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## Color Scheme

- **Primary**: Blue (#2563eb)
- **Background**: Light gray (#f8fafc)
- **Surface**: White (#ffffff)
- **Text**: Dark gray (#1e293b)
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Danger**: Red (#ef4444)

## API Integration

The frontend connects to the backend API running on `http://localhost:5000/api`. Make sure the backend server is running before using the frontend.


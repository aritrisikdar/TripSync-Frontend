# TripSync AI — Frontend

Smart AI-powered travel destination recommender. Built with React + Vite.

## Tech Stack
- React 18
- Vite 5
- Axios (HTTP client)

## Project Structure

```
tripsync-frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── pages/
│   │   └── Home.jsx        ← Main UI page
│   ├── App.jsx             ← Root component
│   ├── App.css             ← All styles
│   └── main.jsx            ← Entry point
├── index.html
├── vite.config.js          ← Proxy to backend :5000
├── package.json
└── .gitignore
```

## Setup & Run

```bash
# Install dependencies
npm install

# Start dev server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build
```

## Backend Connection

This frontend connects to the backend at `http://localhost:5000`.

The Vite dev server proxies `/destination` requests to `http://localhost:5000`
so there are **no CORS issues** in development.

Make sure your backend teammate runs:
```bash
cd backend
node server.js
```

## API Used

**POST** `/destination/recommend`

Request body:
```json
{
  "budget": 30000,
  "members": [
    { "interests": "Adventure" },
    { "interests": "Mountains" }
  ],
  "mood": "Relaxed",
  "route": "Scenic"
}
```

Response:
```json
{
  "destination": "Manali",
  "score": 95,
  "reason": "Best match found"
}
```

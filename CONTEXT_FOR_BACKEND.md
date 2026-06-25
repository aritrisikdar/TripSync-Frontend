# TripSync AI — Frontend Context for Backend Team

## What This Project Does
TripSync AI is a group travel destination recommender.
The user fills in trip details and adds group members (name, interest, mood).
The frontend sends this to the backend and displays the recommended destination
with weather, cost, distance, and group tag info.

---

## Tech Stack
- React 18 + Vite 5
- Axios for HTTP requests
- Frontend runs on: http://localhost:3000
- Backend expected at: http://localhost:8000 (FastAPI default)
- Vite proxy: all /recommend calls → http://localhost:8000/recommend

---

## API Contract

### Endpoint
```
POST http://localhost:8000/recommend
Content-Type: application/json
```

### Request Body (what frontend sends)
```json
{
  "budget": 20000,
  "route": "Scenic",
  "start_location": "Mumbai",
  "members": [
    { "name": "Arjun",  "interest": "History", "mood": "Exploration" },
    { "name": "Sneha",  "interest": "Culture", "mood": "Relaxed"     }
  ]
}
```

### Response Body (what frontend expects)
```json
{
  "recommended_destination": "Agra",
  "estimated_cost": 12000,
  "enjoyment_score": 83,
  "budget_efficiency": 0.0069,
  "weather": {
    "temperature": 38.42,
    "condition": "Clouds",
    "humidity": 25,
    "wind_speed": 5.14,
    "city": "Agra"
  },
  "route_distance": "1313.39km",
  "group_interests": ["history", "culture"],
  "group_moods": ["exploration", "relaxed"]
}
```

---

## How Each Field Is Displayed

| Response Field          | Where it shows in UI              |
|-------------------------|-----------------------------------|
| recommended_destination | Big destination heading           |
| enjoyment_score         | Badge — e.g. "Enjoyment Score: 83/100" |
| estimated_cost          | Meta box — formatted as ₹12,000  |
| budget_efficiency       | Meta box                          |
| route_distance          | Meta box — e.g. "1313.39km"      |
| weather.city            | Weather card — city name          |
| weather.condition       | Weather tag + emoji (see below)   |
| weather.temperature     | 🌡️ temp                          |
| weather.humidity        | 💧 humidity %                    |
| weather.wind_speed      | 💨 wind m/s                      |
| group_interests         | Green tags at bottom              |
| group_moods             | Blue tags at bottom               |

---

## Weather Condition Emoji Map (built into frontend)
```
Clear        → ☀️
Clouds       → ☁️
Rain         → 🌧️
Drizzle      → 🌦️
Thunderstorm → ⛈️
Snow         → ❄️
Mist/Haze/Fog→ 🌫️
anything else→ 🌍
```

---

## Route values sent from frontend
Exactly one of: "Scenic", "Fastest", "Cheapest"

---

## Notes
- Backend uses FastAPI → runs on port 8000 by default
- CORS is already enabled on backend (allow_origins=["*"]) ✅
- Frontend handles missing weather block gracefully (card just won't render)
- group_interests and group_moods should be lowercase string arrays

import { useState } from 'react'
import axios from 'axios'

const WEATHER_ICONS = {
  Clear: '☀️',
  Clouds: '☁️',
  Rain: '🌧️',
  Drizzle: '🌦️',
  Thunderstorm: '⛈️',
  Snow: '❄️',
  Mist: '🌫️',
  Haze: '🌫️',
  Fog: '🌫️',
}

function Home() {
  const [budget, setBudget] = useState('')
  const [route, setRoute] = useState('')
  const [startLocation, setStartLocation] = useState('')
  const [members, setMembers] = useState([])
  const [name, setName] = useState('')
  const [interest, setInterest] = useState('')
  const [mood, setMood] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function addMember() {
    if (!name.trim() || !interest.trim() || !mood.trim()) return
    setMembers([...members, { name: name.trim(), interest: interest.trim(), mood: mood.trim() }])
    setName('')
    setInterest('')
    setMood('')
  }

  function removeMember(index) {
    setMembers(members.filter((_, i) => i !== index))
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') { e.preventDefault(); addMember() }
  }

  async function submitData() {
    setError('')
    if (!budget || !route || !startLocation) {
      setError('Please fill in budget, route type, and starting location.')
      return
    }
    if (members.length === 0) {
      setError('Add at least one group member with their interest and mood.')
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const response = await axios.post('/recommend', {
        budget: Number(budget),
        route,
        start_location: startLocation,
        members,
      })
      setResult(response.data)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Could not connect to backend. Make sure the server is running on port 8000.'
      )
    } finally {
      setLoading(false)
    }
  }

  const weather = result?.weather
  const weatherIcon = weather ? WEATHER_ICONS[weather.condition] || '🌍' : null

  return (
    <div className="page">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="container">
        <header className="header">
          <div className="logo-badge">✈ AI TRAVEL</div>
          <h1 className="title">Trip<span className="title-accent">Sync</span></h1>
          <p className="subtitle">Tell us your group's vibe — we'll find where you belong</p>
        </header>

        <div className="card">
          <div className="card-section">
            <p className="section-label">Trip Details</p>
            <div className="row-2">
              <div className="field">
                <label>Budget (₹)</label>
                <input type="number" placeholder="e.g. 20000" value={budget} onChange={(e) => setBudget(e.target.value)} />
              </div>
              <div className="field">
                <label>Starting Location</label>
                <input type="text" placeholder="e.g. Mumbai" value={startLocation} onChange={(e) => setStartLocation(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>Route Type</label>
              <select value={route} onChange={(e) => setRoute(e.target.value)}>
                <option value="">Select route</option>
                <option value="Scenic">Scenic</option>
                <option value="Fastest">Fastest</option>
                <option value="Cheapest">Cheapest</option>
              </select>
            </div>
          </div>

          <div className="divider" />

          <div className="card-section">
            <p className="section-label">Group Members</p>
            <div className="member-form-grid">
              <input type="text" placeholder="Name (e.g. Arjun)" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={handleKeyDown} />
              <input type="text" placeholder="Interest (e.g. History)" value={interest} onChange={(e) => setInterest(e.target.value)} onKeyDown={handleKeyDown} />
              <input type="text" placeholder="Mood (e.g. Exploration)" value={mood} onChange={(e) => setMood(e.target.value)} onKeyDown={handleKeyDown} />
            </div>
            <button className="btn-add btn-add-full" onClick={addMember}>+ Add Member</button>

            {members.length > 0 ? (
              <div className="member-list">
                {members.map((m, i) => (
                  <div className="member-row" key={i}>
                    <span className="chip-num">{i + 1}</span>
                    <div className="member-info">
                      <span className="member-name">{m.name}</span>
                      <span className="member-tags">
                        <span className="tag tag-interest">{m.interest}</span>
                        <span className="tag tag-mood">{m.mood}</span>
                      </span>
                    </div>
                    <span className="chip-x" onClick={() => removeMember(i)}>×</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-hint">Add each member's name, interest, and mood</p>
            )}
          </div>
        </div>

        {error && <div className="error-box">⚠ {error}</div>}

        <button className={`btn-generate ${loading ? 'loading' : ''}`} onClick={submitData} disabled={loading}>
          {loading ? (<><span className="spinner" />Finding your destination…</>) : ('✦ Generate Destination')}
        </button>

        {result && (
          <div className="result-card">
            <div className="result-tag">✦ Recommended Destination</div>
            <div className="result-main">
              <div className="result-icon">📍</div>
              <div className="result-info">
                <h2 className="result-name">{result.recommended_destination}</h2>
                <div className="result-score-row">
                  <div className="score-badge">Enjoyment Score: {result.enjoyment_score}/100</div>
                </div>
              </div>
            </div>

            <div className="result-meta">
              <div className="meta-item">
                <span className="meta-label">Estimated Cost</span>
                <span className="meta-val">₹{Number(result.estimated_cost).toLocaleString('en-IN')}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Budget Efficiency</span>
                <span className="meta-val">{result.budget_efficiency}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Route Distance</span>
                <span className="meta-val">{result.route_distance}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Starting From</span>
                <span className="meta-val">{startLocation}</span>
              </div>
            </div>

            {weather && (
              <div className="weather-card">
                <div className="weather-icon">{weatherIcon}</div>
                <div className="weather-details">
                  <div className="weather-top">
                    <span className="weather-city">{weather.city}</span>
                    <span className="weather-condition">{weather.condition}</span>
                  </div>
                  <div className="weather-stats">
                    <span className="weather-stat">🌡️ {weather.temperature}°C</span>
                    <span className="weather-stat">💧 {weather.humidity}%</span>
                    <span className="weather-stat">💨 {weather.wind_speed} m/s</span>
                  </div>
                </div>
              </div>
            )}

            <div className="tag-section">
              <p className="tag-section-label">Group Interests</p>
              <div className="tag-row">
                {result.group_interests?.map((t, i) => (<span className="tag tag-interest" key={i}>{t}</span>))}
              </div>
            </div>

            <div className="tag-section">
              <p className="tag-section-label">Group Moods</p>
              <div className="tag-row">
                {result.group_moods?.map((t, i) => (<span className="tag tag-mood" key={i}>{t}</span>))}
              </div>
            </div>
          </div>
        )}

        <footer className="footer">
          TripSync AI — Frontend by Team A &nbsp;·&nbsp; Backend by Team B
        </footer>
      </div>
    </div>
  )
}

export default Home

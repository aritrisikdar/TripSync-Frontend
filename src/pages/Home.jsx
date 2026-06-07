import { useState } from 'react'
import axios from 'axios'

const DESTINATION_ICONS = {
  Manali: '🏔️',
  Goa: '🏖️',
  Munnar: '🌿',
}

function Home() {
  const [budget, setBudget] = useState('')
  const [members, setMembers] = useState([])
  const [interest, setInterest] = useState('')
  const [mood, setMood] = useState('')
  const [route, setRoute] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function addMember() {
    if (!interest.trim()) return
    setMembers([...members, { interests: interest.trim() }])
    setInterest('')
  }

  function removeMember(index) {
    setMembers(members.filter((_, i) => i !== index))
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') addMember()
  }

  async function submitData() {
    setError('')
    if (!budget || !mood || !route) {
      setError('Please fill in budget, mood, and route type.')
      return
    }
    if (members.length === 0) {
      setError('Add at least one group member.')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await axios.post('/destination/recommend', {
        budget: Number(budget),
        members,
        mood,
        route,
      })
      setResult(response.data)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not connect to backend. Make sure the server is running on port 5000.'
      )
    } finally {
      setLoading(false)
    }
  }

  const icon = result ? DESTINATION_ICONS[result.destination] || '📍' : null

  return (
    <div className="page">
      {/* Background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="logo-badge">✈ AI TRAVEL</div>
          <h1 className="title">
            Trip<span className="title-accent">Sync</span>
          </h1>
          <p className="subtitle">
            Tell us your group's vibe — we'll find where you belong
          </p>
        </header>

        {/* Form card */}
        <div className="card">
          <div className="card-section">
            <p className="section-label">Trip Details</p>
            <div className="row-2">
              <div className="field">
                <label>Budget (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 30000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
              <div className="field">
                <label>Mood / Vibe</label>
                <select value={mood} onChange={(e) => setMood(e.target.value)}>
                  <option value="">Select mood</option>
                  <option value="Relaxed">Relaxed</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Food">Food</option>
                </select>
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
            <div className="member-input-row">
              <input
                type="text"
                placeholder="Member's interest (e.g. Adventure, Mountains, Food…)"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="btn-add" onClick={addMember}>
                + Add
              </button>
            </div>

            {members.length > 0 ? (
              <div className="chips">
                {members.map((m, i) => (
                  <div className="chip" key={i}>
                    <span className="chip-num">{i + 1}</span>
                    <span className="chip-text">{m.interests}</span>
                    <span className="chip-x" onClick={() => removeMember(i)}>
                      ×
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-hint">
                Add each member's interest — the algorithm will aggregate them
              </p>
            )}
          </div>
        </div>

        {/* Error */}
        {error && <div className="error-box">⚠ {error}</div>}

        {/* Generate button */}
        <button
          className={`btn-generate ${loading ? 'loading' : ''}`}
          onClick={submitData}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner" />
              Finding your destination…
            </>
          ) : (
            '✦ Generate Destination'
          )}
        </button>

        {/* Result */}
        {result && (
          <div className="result-card">
            <div className="result-tag">✦ Recommended Destination</div>

            <div className="result-main">
              <div className="result-icon">{icon}</div>
              <div className="result-info">
                <h2 className="result-name">{result.destination}</h2>
                <div className="result-score-row">
                  <div className="score-badge">Score: {result.score}</div>
                </div>
              </div>
            </div>

            <p className="result-reason">{result.reason}</p>

            <div className="result-meta">
              <div className="meta-item">
                <span className="meta-label">Budget</span>
                <span className="meta-val">
                  ₹{Number(budget).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Mood</span>
                <span className="meta-val">{mood}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Route</span>
                <span className="meta-val">{route}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Members</span>
                <span className="meta-val">{members.length}</span>
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

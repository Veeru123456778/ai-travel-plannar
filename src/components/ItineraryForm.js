// pages/index.js
import { useState } from 'react';

export default function Itinerary() {
  const [prompt, setPrompt] = useState('');
  const [itinerary, setItinerary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setItinerary('');

    try {
      const response = await fetch('/api/generateItinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate itinerary.');
      }

      const data = await response.json();
      setItinerary(data.itinerary);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Travel Itinerary Generator</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your travel preferences..."
          rows="5"
          cols="50"
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Itinerary'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {itinerary && (
        <div>
          <h2>Your Itinerary:</h2>
          <p>{itinerary}</p>
        </div>
      )}
    </div>
  );
}

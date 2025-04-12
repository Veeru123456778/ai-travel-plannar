import { useState } from 'react';

export default function SearchForm() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/fetch-tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, destination, date }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch train data.');
      }

      const data = await response.json();
      setResults(data.trains);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Source Station"
          required
        />
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Destination Station"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search Trains'}
        </button>
      </form>

      {error && <p>{error}</p>}

      {results && (
        <ul>
          {results.map((train, index) => (
            <li key={index}>
              <h3>{train.name}</h3>
              <p>Departure: {train.departure}</p>
              <p>Arrival: {train.arrival}</p>
              <p>Duration: {train.duration}</p>
              <p>Price: {train.price}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

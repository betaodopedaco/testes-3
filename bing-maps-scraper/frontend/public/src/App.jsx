import React, { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          location,
          limit: 10
        })
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      alert('Erro na busca: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = async () => {
    window.open(
      `http://localhost:5000/api/search?format=excel`,
      '_blank'
    );
  };

  return (
    <div className="app">
      <h1>Bing Maps Scraper</h1>
      
      <div className="search-box">
        <input
          type="text"
          placeholder="O que procurar?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <input
          type="text"
          placeholder="Local (Cidade, Estado)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button onClick={search} disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
        {results.length > 0 && (
          <button onClick={downloadExcel}>Exportar Excel</button>
        )}
      </div>

      <div className="results">
        {results.map((item, index) => (
          <div key={index} className="result-card">
            <h3>{item.name}</h3>
            <p>{item.address}</p>
            <p>📞 {item.phone}</p>
            {item.website && (
              <a href={item.website} target="_blank" rel="noreferrer">
                🌐 Visitar Site
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

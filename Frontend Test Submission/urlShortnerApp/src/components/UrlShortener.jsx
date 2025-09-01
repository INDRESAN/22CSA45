import { useState } from 'react';
import './UrlShortener.css';
import logger from '../middleware/logger';

const UrlShortener = () => {
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState('');
  
  // Wrap state updates with logger
  const loggedSetUrls = logger('SET_URLS')(setUrls);
  const loggedSetError = logger('SET_ERROR')(setError);

  
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const isValidPeriod = (period) => {
    if (!period) return true;
    return Number.isInteger(Number(period)) && Number(period) > 0;
  };

  const isValidShortcode = (code) => {
    if (!code) return true;
    return /^[a-zA-Z0-9_-]+$/.test(code);
  };

  const addUrl = () => {
    if (urls.length >= 5) {
      loggedSetError('Maximum 5 URLs allowed');
      return;
    }
    loggedSetUrls([...urls, { longUrl: '', validityPeriod: '', shortcode: '', shortened: '' }]);
    loggedSetError('');
  };

  const handleInputChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    loggedSetUrls(newUrls);
  };

  const shortenUrl = (index) => {
    const url = urls[index];
    
    if (!isValidUrl(url.longUrl)) {
      loggedSetError('Please enter a valid URL');
      return;
    }
    if (!isValidPeriod(url.validityPeriod)) {
      loggedSetError('Validity period must be a positive integer');
      return;
    }
    if (!isValidShortcode(url.shortcode)) {
      loggedSetError('Shortcode can only contain letters, numbers, underscore and hyphen');
      return;
    }

    
    const mockShorten = () => {
      const randomCode = Math.random().toString(36).substr(2, 6);
      const shortCode = url.shortcode || randomCode;
      const expiryDate = url.validityPeriod 
        ? new Date(Date.now() + parseInt(url.validityPeriod) * 60000).toLocaleString()
        : 'Never';
      
      return {
        shortened:"<>",
        expiryDate
      };
    };

    const result = mockShorten();
    const newUrls = [...urls];
    newUrls[index] = {
      ...url,
      shortened: result.shortened,
      expiryDate: result.expiryDate
    };
    loggedSetUrls(newUrls);
    loggedSetError('');
  };

  const removeUrl = (index) => {
    const newUrls = urls.filter((_, i) => i !== index);
    loggedSetUrls(newUrls);
  };

  return (
    <div className="url-shortener">
      <h2>URL Shortener</h2>
      {error && <div className="error">{error}</div>}
      
      {urls.map((url, index) => (
        <div key={index} className="url-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter long URL"
              value={url.longUrl}
              onChange={(e) => handleInputChange(index, 'longUrl', e.target.value)}
            />
            <input
              type="number"
              placeholder="Validity (minutes)"
              value={url.isValidPeriod}
              onChange={(e) => handleInputChange(index, 'validityPeriod', e.target.value)}
            />
            <input
              type="text"
              placeholder="Custom shortcode (optional)"
              value={url.shortcode}
              onChange={(e) => handleInputChange(index, 'shortcode', e.target.value)}
            />
            <button onClick={() => shortenUrl(index)}>Shorten</button>
            <button onClick={() => removeUrl(index)} className="remove-btn">×</button>
          </div>
          
          {url.shortened && (
            <div className="result">
              <p>
                Shortened URL: <a href={url.shortened} target="_blank" rel="noopener noreferrer">{url.shortened}</a>
              </p>
              <p>Original URL: <span className="original-url">{url.longUrl}</span></p>
              <p>Expires: {url.expiryDate}</p>
            </div>
          )}
        </div>
      ))}

      {urls.length < 5 && (
        <button onClick={addUrl} className="add-url-btn">
          Add URL
        </button>
      )}
    </div>
  );
};

export default UrlShortener;

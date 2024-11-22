import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [config, setConfig] = useState({
    config_root: '~/work/.cursorboost/config.json',
    max_depth: 3,
    ignore_patterns: ['venv', 'pycache', 'node_modules', 'build', 'public', 'dist', '.git'],
    ignore_extensions: ['.pyc', '.pyo', '.pyd', '.so', '.dll', '.class'],
    disk_usage_threshold: 80,
    ignore_containers: ['redis-commander', 'anvil_redis', 'anvil_pdf_signer', 'anvil_jobs', 'anvil_webpack', 'anvil_db']
  });

  const addItem = (field, value) => {
    if (value && !config[field].includes(value)) {
      setConfig({ ...config, [field]: [...config[field], value] });
    }
  };

  const removeItem = (field, index) => {
    const newArray = config[field].filter((_, i) => i !== index);
    setConfig({ ...config, [field]: newArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const configPath = config.config_root;
    const configData = { ...config };
    delete configData.config_root;
    
    try {
      const response = await fetch('http://localhost:3003/save-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ configPath, configData }),
        mode: 'cors',
        credentials: 'include'
      });
      
      const result = await response.json();
      if (result.success) {
        alert('Configuration saved successfully!');
      } else {
        alert('Error saving configuration: ' + result.message);
      }
    } catch (error) {
      alert('Error saving configuration: ' + error.message);
    }
  };

  return (
    <div className="app">
      <h1>Cursor Boost Config Manager</h1>
      
      <form onSubmit={handleSubmit}>
        <section>
          <h2>Configuration Location</h2>
          <div className="form-group">
            <label>
              Config Root:
              <input
                type="text"
                value={config.config_root}
                onChange={(e) => setConfig({ ...config, config_root: e.target.value })}
                placeholder="Enter config file path..."
              />
            </label>
          </div>

          <h2>Tree Configuration</h2>
          
          <div className="form-group">
            <label>
              Maximum Depth:
              <input
                type="number"
                min="1"
                max="10"
                value={config.max_depth}
                onChange={(e) => setConfig({ ...config, max_depth: parseInt(e.target.value) })}
              />
            </label>
          </div>

          <div className="form-group">
            <label>Ignore Patterns:</label>
            <div className="multi-input">
              {config.ignore_patterns.map((pattern, index) => (
                <div key={index} className="tag">
                  {pattern}
                  <button type="button" onClick={() => removeItem('ignore_patterns', index)}>×</button>
                </div>
              ))}
              <input
                type="text"
                placeholder="Add pattern..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem('ignore_patterns', e.target.value);
                    e.target.value = '';
                  }
                }}
              />
            </div>
          </div>
        </section>

        <div className="form-actions">
          <button type="submit" className="primary">Save Configuration</button>
          <button type="button" onClick={() => window.location.reload()}>Reset</button>
        </div>
      </form>
    </div>
  );
}

export default App;

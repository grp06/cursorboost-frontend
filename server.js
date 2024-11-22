const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
const port = 3003 // Different from React's 3000

// More detailed CORS configuration
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['POST', 'GET', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'sec-ch-ua', 'sec-ch-ua-mobile', 'sec-ch-ua-platform'],
  credentials: true
}))

// Add OPTIONS handling for preflight requests
app.options('*', cors())

app.use(express.json())

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ success: false, message: err.message })
})

// Endpoint to save config
app.post('/save-config', (req, res) => {
  console.log('Received request');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  
  const { configPath, configData } = req.body;
  console.log('Config Path:', configPath);
  console.log('Config Data:', configData);
  
  // Resolve the path (handles ~ for home directory)
  const fullPath = configPath.replace(/^~/, process.env.HOME)

  // Ensure directory exists
  const dir = path.dirname(fullPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  try {
    fs.writeFileSync(fullPath, JSON.stringify(configData, null, 2))
    res.json({ success: true, message: 'Configuration saved successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

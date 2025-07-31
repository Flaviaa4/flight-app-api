// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors()); // allow frontend requests

// Serve static assets 
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/airports', express.static(path.join(__dirname, 'airports')));
app.use(express.static(__dirname)); 

const API_KEY = process.env.AVIATIONSTACK_KEY; // Store in .env

// Proxy endpoint for airports
app.get('/api/airports', async (req, res) => {
  const { query } = req;
  const params = new URLSearchParams({
    access_key: API_KEY,
    ...query // pass through any query params
  });
  const apiUrl = `http://api.aviationstack.com/v1/airports?${params}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// Proxy endpoint for flights
app.get('/api/flights', async (req, res) => {
  const { query } = req;
  const params = new URLSearchParams({
    access_key: API_KEY,
    ...query
  });
  const apiUrl = `http://api.aviationstack.com/v1/flights?${params}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server running on port " + PORT));

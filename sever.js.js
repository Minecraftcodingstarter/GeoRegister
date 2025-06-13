// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
const FILE = 'words.json';

app.use(express.json());
app.use(express.static(path.join(__dirname, '.'))); // Serve index.html

let words = new Set();

// Lade gespeicherte Wörter
if (fs.existsSync(FILE)) {
  const data = JSON.parse(fs.readFileSync(FILE));
  words = new Set(data);
}

function saveWords() {
  fs.writeFileSync(FILE, JSON.stringify(Array.from(words)));
}

// API: Wort hinzufügen
app.post('/add-word', (req, res) => {
  const { word } = req.body;
  if (!word || typeof word !== 'string') {
    return res.json({ success: false, message: 'Ungültiges Wort.' });
  }

  const lower = word.toLowerCase();

  if (words.has(lower)) {
    return res.json({ success: false, message: 'Wort bereits vorhanden.' });
  }

  words.add(lower);
  saveWords();
  res.json({ success: true });
});

// API: Wörter abrufen
app.get('/words', (req, res) => {
  res.json(Array.from(words));
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});

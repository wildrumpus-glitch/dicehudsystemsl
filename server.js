const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve dashboard files
app.use(express.static(path.join(__dirname, "public")));

// Create SQLite database
const db = new sqlite3.Database("dice_rolls.db", (err) => {
  if (err) console.error("DB Error:", err);
  else console.log("Connected to SQLite DB");
});

// Create table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS rolls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account TEXT,
    character TEXT,
    die TEXT,
    result INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// API to log a roll
app.post("/api/roll", (req, res) => {
  const { account, character, die, result } = req.body;
  if (!account || !character || !die || result === undefined) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const stmt = db.prepare(
    "INSERT INTO rolls (account, character, die, result) VALUES (?, ?, ?, ?)"
  );
  stmt.run(account, character, die, result, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
  stmt.finalize();
});

// API to fetch all rolls
app.get("/api/rolls", (req, res) => {
  db.all("SELECT * FROM rolls ORDER BY timestamp DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Auto-delete rolls older than 6 months
const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000;
setInterval(() => {
  const cutoff = Date.now() - SIX_MONTHS_MS;
  const cutoffISO = new Date(cutoff).toISOString();
  db.run("DELETE FROM rolls WHERE timestamp < ?", cutoffISO);
}, 24 * 60 * 60 * 1000); // Run once a day

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

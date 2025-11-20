
const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const db = new Database("rolls.db");

// Create table if not exists
db.prepare(`
CREATE TABLE IF NOT EXISTS rolls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_name TEXT,
  character_name TEXT,
  die_type TEXT,
  result INTEGER,
  timestamp TEXT
)
`).run();

// Auto delete entries older than 6 months
db.prepare(`
DELETE FROM rolls WHERE timestamp < datetime('now', '-6 months')
`).run();

app.post("/api/roll", (req, res) => {
  const { account, character, die, result } = req.body;

  const stmt = db.prepare(`
    INSERT INTO rolls (account_name, character_name, die_type, result, timestamp)
    VALUES (?, ?, ?, ?, datetime('now'))
  `);
  stmt.run(account, character, die, result);

  res.json({ success: true });
});

app.get("/api/history", (req, res) => {
  const rows = db.prepare("SELECT * FROM rolls ORDER BY id DESC").all();
  res.json(rows);
});

// Serve dashboard
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server running on port " + port));

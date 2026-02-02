CREATE TABLE request_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  method TEXT,
  path TEXT,
  ip TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

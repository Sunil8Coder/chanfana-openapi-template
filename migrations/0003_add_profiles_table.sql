CREATE TABLE profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  full_name TEXT,
  phone TEXT,
  location TEXT,
  summary TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

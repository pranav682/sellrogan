-- Migration number: 0001 	 2025-04-02T14:44:00.000Z
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS product_sources;
DROP TABLE IF EXISTS selling_platforms;
DROP TABLE IF EXISTS user_credentials;
DROP TABLE IF EXISTS product_listings;
DROP TABLE IF EXISTS search_history;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Product sources table (where products can be bought)
CREATE TABLE IF NOT EXISTS product_sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  price REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  shipping_cost REAL,
  availability TEXT,
  reliability_score REAL,
  last_checked DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Selling platforms table
CREATE TABLE IF NOT EXISTS selling_platforms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  base_fee REAL,
  percentage_fee REAL,
  api_endpoint TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- User credentials for platforms
CREATE TABLE IF NOT EXISTS user_credentials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  platform_id INTEGER NOT NULL,
  credentials_json TEXT NOT NULL, -- Encrypted JSON with credentials
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (platform_id) REFERENCES selling_platforms(id) ON DELETE CASCADE
);

-- Product listings (products listed for sale)
CREATE TABLE IF NOT EXISTS product_listings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  platform_id INTEGER NOT NULL,
  source_id INTEGER NOT NULL,
  listing_url TEXT,
  listing_price REAL NOT NULL,
  status TEXT NOT NULL, -- active, sold, cancelled
  profit_margin REAL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (platform_id) REFERENCES selling_platforms(id) ON DELETE CASCADE,
  FOREIGN KEY (source_id) REFERENCES product_sources(id) ON DELETE CASCADE
);

-- Search history
CREATE TABLE IF NOT EXISTS search_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  search_query TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Initial data for selling platforms
INSERT INTO selling_platforms (name, base_fee, percentage_fee, api_endpoint) VALUES 
  ('Amazon', 0.99, 0.15, 'https://api.amazon.com'),
  ('eBay', 0.35, 0.10, 'https://api.ebay.com'),
  ('Etsy', 0.20, 0.05, 'https://api.etsy.com'),
  ('Walmart', 0, 0.15, 'https://api.walmart.com');

-- Create indexes
CREATE INDEX idx_product_sources_product_id ON product_sources(product_id);
CREATE INDEX idx_product_sources_price ON product_sources(price);
CREATE INDEX idx_user_credentials_user_id ON user_credentials(user_id);
CREATE INDEX idx_product_listings_user_id ON product_listings(user_id);
CREATE INDEX idx_product_listings_product_id ON product_listings(product_id);
CREATE INDEX idx_search_history_user_id ON search_history(user_id);

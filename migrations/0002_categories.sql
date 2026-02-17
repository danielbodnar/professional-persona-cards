-- Category definitions (replaces hardcoded domain-signals.ts)
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  group_name TEXT NOT NULL,
  icon TEXT DEFAULT '',
  accent_color TEXT DEFAULT '#888888',
  languages TEXT DEFAULT '[]',
  topics TEXT DEFAULT '[]',
  keywords TEXT DEFAULT '[]',
  stat_labels TEXT DEFAULT '[]',
  stack_pool TEXT DEFAULT '[]',
  taglines TEXT DEFAULT '[]',
  title_prefixes TEXT DEFAULT '["Principal","Staff","Senior"]',
  enabled INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Per-user aggregated stats (top-10 charts)
CREATE TABLE IF NOT EXISTS user_aggregates (
  username TEXT NOT NULL,
  agg_type TEXT NOT NULL,
  item TEXT NOT NULL,
  count INTEGER DEFAULT 0,
  from_owned INTEGER DEFAULT 0,
  from_starred INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  PRIMARY KEY (username, agg_type, item),
  FOREIGN KEY (username) REFERENCES profiles(username) ON DELETE CASCADE
);

-- Per-user category scores (replaces fixed 9-domain personas table)
CREATE TABLE IF NOT EXISTS user_categories (
  username TEXT NOT NULL,
  category_id TEXT NOT NULL,
  raw_score REAL DEFAULT 0,
  normalized_score INTEGER DEFAULT 0,
  activated INTEGER DEFAULT 0,
  experience_label TEXT DEFAULT '',
  years_active TEXT DEFAULT '',
  title TEXT DEFAULT '',
  tagline TEXT DEFAULT '',
  confidence REAL DEFAULT 0,
  accent_color TEXT DEFAULT '#888888',
  icon TEXT DEFAULT '',
  stats TEXT DEFAULT '[]',
  stack TEXT DEFAULT '[]',
  details TEXT DEFAULT '[]',
  starred_repos TEXT DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  PRIMARY KEY (username, category_id),
  FOREIGN KEY (username) REFERENCES profiles(username) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_categories_activated
  ON user_categories(username, activated, sort_order);
CREATE INDEX IF NOT EXISTS idx_user_aggregates_type
  ON user_aggregates(username, agg_type, sort_order);
CREATE INDEX IF NOT EXISTS idx_categories_group
  ON categories(group_name, enabled);

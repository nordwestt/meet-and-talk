-- Meet & Talk content schema (libSQL / SQLite)
-- Source of truth for cities, events, venues, topics, organisers, community, press.
-- Regenerated into lib/data/*.ts via `npm run content:generate`.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS topics (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('live', 'soon')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS organisers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  bio TEXT,
  avatar TEXT,
  social TEXT, -- JSON array of SocialLink
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS cities (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  country_flag TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('live', 'planned')),
  image TEXT,
  gallery TEXT, -- JSON string array
  member_count INTEGER,
  social TEXT NOT NULL DEFAULT '[]', -- JSON array of SocialLink
  timezone TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS venues (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city_id TEXT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  description TEXT,
  capacity INTEGER,
  image TEXT,
  social TEXT, -- JSON array of SocialLink
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  city_id TEXT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  venue_id TEXT NOT NULL REFERENCES venues(id) ON DELETE RESTRICT,
  topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE RESTRICT,
  languages TEXT, -- JSON array of {code,label}
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  recurring TEXT,
  description TEXT NOT NULL,
  capacity INTEGER,
  going INTEGER,
  image TEXT,
  price TEXT,
  social TEXT, -- JSON array of SocialLink
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  quote TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  city_id TEXT REFERENCES cities(id) ON DELETE SET NULL,
  avatar TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS press_mentions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  url TEXT NOT NULL,
  outlet TEXT NOT NULL,
  author TEXT,
  date TEXT,
  city_id TEXT REFERENCES cities(id) ON DELETE SET NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS city_organisers (
  city_id TEXT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  organiser_id TEXT NOT NULL REFERENCES organisers(id) ON DELETE CASCADE,
  PRIMARY KEY (city_id, organiser_id)
);

CREATE TABLE IF NOT EXISTS city_topics (
  city_id TEXT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  PRIMARY KEY (city_id, topic_id)
);

CREATE TABLE IF NOT EXISTS organiser_cities (
  organiser_id TEXT NOT NULL REFERENCES organisers(id) ON DELETE CASCADE,
  city_id TEXT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  PRIMARY KEY (organiser_id, city_id)
);

CREATE TABLE IF NOT EXISTS event_organisers (
  event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  organiser_id TEXT NOT NULL REFERENCES organisers(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, organiser_id)
);

-- Bump updated_at on row edits (skip if caller already set a new timestamp)
CREATE TRIGGER IF NOT EXISTS topics_updated_at
AFTER UPDATE ON topics
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE topics SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS organisers_updated_at
AFTER UPDATE ON organisers
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE organisers SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS cities_updated_at
AFTER UPDATE ON cities
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE cities SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS venues_updated_at
AFTER UPDATE ON venues
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE venues SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS events_updated_at
AFTER UPDATE ON events
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE events SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS testimonials_updated_at
AFTER UPDATE ON testimonials
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE testimonials SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS faqs_updated_at
AFTER UPDATE ON faqs
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE faqs SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS press_mentions_updated_at
AFTER UPDATE ON press_mentions
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE press_mentions SET updated_at = datetime('now') WHERE id = NEW.id;
END;

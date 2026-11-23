-- Ajout des colonnes optionnelles à la table users
ALTER TABLE users
  ADD COLUMN "web3ModeEnabled" BOOLEAN DEFAULT FALSE,        -- préférence utilisateur
  ADD COLUMN "walletAddress"   TEXT,                          -- adresse Solana liée (nullable)
  ADD COLUMN "walletConnectedAt" TIMESTAMPTZ;                 -- date de connexion

-- Flag global admin (table de config séparée)
CREATE TABLE IF NOT EXISTS feature_flags (
  key   TEXT PRIMARY KEY,
  value BOOLEAN DEFAULT FALSE,
  updatedAt TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO feature_flags (key, value) VALUES ('FEATURE_WEB3', FALSE)
ON CONFLICT (key) DO NOTHING;
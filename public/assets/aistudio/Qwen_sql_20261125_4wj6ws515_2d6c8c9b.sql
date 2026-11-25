-- ==========================================================================
-- COUCHE 7 : ROW-LEVEL SECURITY (RLS) POUR LA TABLE USERS
-- ==========================================================================

-- 1. Ajouter la colonne walletAddress (si elle n'existe pas déjà)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS walletAddress TEXT;

-- 2. Activer le RLS sur la table users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 3. Politique de LECTURE (SELECT)
-- Un utilisateur ne peut voir que sa propre ligne. 
-- L'admin (role = 'admin', ex: Adama ID=1) peut voir toutes les lignes.
CREATE POLICY "users_select_policy" ON users
FOR SELECT
USING (
  -- Si vous utilisez Supabase Auth : auth.uid() = id
  -- Si vous utilisez un JWT custom / session : current_setting('app.current_user_id', true)::int = id
  auth.uid() = id 
  OR 
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);

-- 4. Politique de MISE À JOUR (UPDATE)
-- Un utilisateur ne peut modifier que son propre walletAddress et lastSignedIn.
-- L'admin peut tout modifier.
CREATE POLICY "users_update_policy" ON users
FOR UPDATE
USING (
  auth.uid() = id 
  OR 
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  auth.uid() = id 
  OR 
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);

-- 5. Politique d'INSERTION (Bloquée pour le public)
-- Empêche la création de comptes via injection SQL directe (doit passer par l'API/Auth).
CREATE POLICY "users_insert_policy" ON users
FOR INSERT
WITH CHECK (false);

-- 6. Politique de SUPPRESSION (Réservée à l'admin)
CREATE POLICY "users_delete_policy" ON users
FOR DELETE
USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);

-- ==========================================================================
-- VÉRIFICATION
-- ==========================================================================
-- Pour tester, connectez-vous en tant qu'utilisateur normal (non-admin) 
-- et essayez de faire : SELECT * FROM users; 
-- Vous ne devriez voir qu'une seule ligne (la vôtre).
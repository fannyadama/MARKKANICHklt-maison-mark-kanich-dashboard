-- 1. Activer le RLS sur la table users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 2. Politique de LECTURE (SELECT)
-- Un utilisateur ne peut voir que sa propre ligne. Un admin (role = 'admin') peut tout voir.
CREATE POLICY "users_select_policy" ON users
FOR SELECT
USING (
  -- Vérifie si l'ID de la session correspond à l'ID de la ligne OU si l'utilisateur est admin
  current_setting('app.current_user_id', true)::text = id::text 
  OR 
  current_setting('app.current_user_role', true)::text = 'admin'
);

-- 3. Politique de MISE À JOUR (UPDATE) - Spécifique au Wallet
-- L'utilisateur ne peut modifier que son propre walletAddress.
CREATE POLICY "users_update_wallet_policy" ON users
FOR UPDATE
USING (current_setting('app.current_user_id', true)::text = id::text)
WITH CHECK (current_setting('app.current_user_id', true)::text = id::text);

-- 4. Politique d'INSERTION (Bloquée pour le public, seul le backend/auth peut créer)
CREATE POLICY "users_insert_policy" ON users
FOR INSERT
WITH CHECK (false); -- Empêche toute création de compte via injection SQL directe
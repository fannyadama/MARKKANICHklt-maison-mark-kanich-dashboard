-- ÉTAPE 1 : Vérification (à exécuter en premier)
SELECT id, name, email, role FROM users 
WHERE email LIKE '%@test.com' OR name LIKE 'Test %';

-- ÉTAPE 2 : Purge définitive
DELETE FROM users 
WHERE email LIKE '%@test.com' OR name LIKE 'Test %';

-- ÉTAPE 3 : Vérification du résultat (doit retourner 0 ligne)
SELECT COUNT(*) FROM users WHERE email LIKE '%@test.com';
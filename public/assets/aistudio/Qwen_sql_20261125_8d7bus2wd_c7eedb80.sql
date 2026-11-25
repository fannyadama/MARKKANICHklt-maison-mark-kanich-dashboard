-- ÉTAPE 1 : Vérifier ce qui va être supprimé (doit retourner les 4 lignes test)
SELECT id, name, email, role FROM users 
WHERE email LIKE '%@test.com' OR id IN (720001, 720002, 720003, 720004);

-- ÉTAPE 2 : Suppression définitive des comptes de test
DELETE FROM users 
WHERE email LIKE '%@test.com' OR id IN (720001, 720002, 720003, 720004);

-- ÉTAPE 3 : Vérification finale (doit retourner 0)
SELECT COUNT(*) FROM users WHERE email LIKE '%@test.com';
-- 1. Vérifier d'abord les comptes qui seront supprimés (Sécurité)
SELECT id, name, email, role FROM users WHERE email LIKE '%@test.com' OR name LIKE 'Test %';

-- 2. Supprimer les comptes de test (Exécutez ceci uniquement après vérification)
DELETE FROM users WHERE email LIKE '%@test.com' OR name LIKE 'Test %';
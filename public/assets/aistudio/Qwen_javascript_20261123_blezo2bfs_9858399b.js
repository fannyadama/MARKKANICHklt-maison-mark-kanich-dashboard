// backend/routes/exportUsers.js (Exemple Node.js/Express)
import { db } from '../db'; // Votre instance de base de données

export async function exportUsersToCSV(req, res) {
  // ❌ AVANT (Dangereux) : SELECT * FROM users
  // ✅ APRÈS (Sécurisé) : Ne sélectionner que les champs non-PII
  const query = `
    SELECT id, name, role, "createdAt", "lastSignedIn" 
    FROM users 
    WHERE email NOT LIKE '%@test.com' -- Exclut aussi les tests restants
  `;
  
  const users = await db.query(query);
  
  // Générer le CSV sans la colonne openId ni email
  const csvHeader = "id,name,role,createdAt,lastSignedIn\n";
  const csvRows = users.map(u => 
    `${u.id},"${u.name}",${u.role},${u.createdAt},${u.lastSignedIn}`
  ).join("\n");

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=users_export.csv');
  res.send(csvHeader + csvRows);
}
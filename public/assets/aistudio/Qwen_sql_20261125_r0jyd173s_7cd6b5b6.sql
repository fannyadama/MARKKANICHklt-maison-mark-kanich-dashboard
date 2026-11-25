-- Exemple de requête backend sécurisée pour le parrainage
SELECT 
  r.id, r.name, r.email, r.createdAt,
  CASE 
    WHEN s.subscription_status = 'active' THEN 'active'
    WHEN s.payment_pending = true THEN 'pending'
    ELSE 'paid'
  END as status,
  COALESCE(s.referral_reward_klt, 0) as rewardAmount
FROM users r
JOIN referrals ref ON r.id = ref.referred_user_id
LEFT JOIN subscriptions s ON r.id = s.user_id
WHERE ref.referrer_user_id = $current_user_id
  AND r.email NOT LIKE '%@test.com' -- 🛡️ FILTRE CRITIQUE ANTI-FAUSSES MÉTRIQUES
ORDER BY r.createdAt DESC;
// pages/dashboard.tsx (ou app/dashboard/page.tsx)
import OptInWallet from '../components/OptInWallet';

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      {/* Colonne principale : modules SaaS (KIIS CashFlow, ImmoScale, Paddle) */}
      <div className="lg:col-span-2 space-y-6">
        <RevenueCard />
        <AffiliationCard />   {/* votre module parrainage déjà codé */}
      </div>

      {/* Colonne latérale : le wallet KLT est OPTIONNEL et isolé ici */}
      <aside className="space-y-6">
        <OptInWallet />       {/* ← LA SEULE LIGNE À AJOUTER */}
        <SupportCard />
      </aside>
    </div>
  );
}
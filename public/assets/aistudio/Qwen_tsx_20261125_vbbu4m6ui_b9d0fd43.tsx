// Dans votre composant principal (ex: App.tsx ou Dashboard.tsx)
import { NotificationProvider, useRaydiumMigrationWatcher } from './components/NotificationSystem';
import StakingDashboard from './components/StakingDashboard';

const DashboardContent: React.FC = () => {
  const { isMigrated } = useRaydiumMigrationWatcher();
  
  return (
    <div>
      {/* Autres composants du dashboard */}
      <StakingDashboard isMigrated={isMigrated} />
    </div>
  );
};

export default function App() {
  return (
    <NotificationProvider>
      <DashboardContent />
    </NotificationProvider>
  );
}
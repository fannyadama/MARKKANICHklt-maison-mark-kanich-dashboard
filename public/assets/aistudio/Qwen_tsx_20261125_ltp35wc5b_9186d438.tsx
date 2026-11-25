// Extrait du composant d'affichage
const { isConnecting, connectionError, handleConnect } = useKLTWallet();

if (connectionError) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
      <p className="text-red-600 text-sm font-medium mb-2">⚠️ {connectionError}</p>
      <button 
        onClick={handleConnect}
        className="text-sm text-klt-teal-600 hover:underline font-semibold"
      >
        Réessayer la connexion
      </button>
    </div>
  );
}
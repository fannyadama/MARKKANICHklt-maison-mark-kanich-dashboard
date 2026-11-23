// components/admin/Web3Toggle.tsx — réservé au rôle "admin" (votre compte id:1)
export default function Web3Toggle() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    fetch('/api/flags/FEATURE_WEB3').then(r => r.json()).then(d => setOn(d.value));
  }, []);

  const toggle = () => {
    fetch('/api/flags/FEATURE_WEB3', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: !on }),
    }).then(() => setOn(!on));
  };

  return (
    <label className="flex items-center gap-3 p-4 bg-gray-900 rounded-lg text-white">
      <input type="checkbox" checked={on} onChange={toggle} className="w-5 h-5 accent-teal-500" />
      <span>FEATURE_WEB3 — Activer le wallet $KLT pour tous les utilisateurs</span>
    </label>
  );
}
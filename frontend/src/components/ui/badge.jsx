// src/components/ui/badge.jsx
export function Badge({ children, variant = "default" }) {
  const colors = {
    default: 'bg-gray-200 text-gray-800',
    secondary: 'bg-yellow-200 text-yellow-800',
    destructive: 'bg-red-200 text-red-800'
  };
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${colors[variant] || colors.default}`}>
      {children}
    </span>
  );
}

// src/components/ui/card.jsx
export function Card({ children, className = '', ...props }) {
  return <div className={`bg-white shadow rounded p-4 ${className}`} {...props}>{children}</div>;
}

export function CardHeader({ children }) {
  return <div className="mb-2">{children}</div>;
}

export function CardTitle({ children }) {
  return <h3 className="font-semibold text-lg">{children}</h3>;
}

export function CardDescription({ children }) {
  return <p className="text-sm text-gray-500">{children}</p>;
}

export function CardContent({ children }) {
  return <div>{children}</div>;
}

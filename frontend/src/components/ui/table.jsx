// src/components/ui/table.jsx
export function Table({ children }) { return <table className="w-full border">{children}</table>; }
export function TableHeader({ children }) { return <thead>{children}</thead>; }
export function TableBody({ children }) { return <tbody>{children}</tbody>; }
export function TableRow({ children }) { return <tr className="border-b">{children}</tr>; }
export function TableHead({ children }) { return <th className="px-2 py-1 text-left">{children}</th>; }
export function TableCell({ children, className = '' }) { return <td className={`px-2 py-1 ${className}`}>{children}</td>; }

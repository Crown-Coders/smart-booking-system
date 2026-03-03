// src/components/ui/dialog.jsx
export function Dialog({ children, open }) { if(!open) return null; return <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">{children}</div>; }
export function DialogContent({ children }) { return <div className="bg-white p-4 rounded w-96">{children}</div>; }
export function DialogHeader({ children }) { return <div className="mb-2">{children}</div>; }
export function DialogTitle({ children }) { return <h3 className="font-semibold">{children}</h3>; }
export function DialogDescription({ children }) { return <p className="text-sm text-gray-500">{children}</p>; }

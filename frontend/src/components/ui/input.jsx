// src/components/ui/input.jsx
export function Input(props) {
  return (
    <input
      {...props}
      className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}

// Renders **phrase** as white text. Use in bullet points and descriptions.
export function highlight(text: string): React.ReactNode[] {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="text-white font-medium">{part}</span>
    ) : (
      part
    )
  );
}

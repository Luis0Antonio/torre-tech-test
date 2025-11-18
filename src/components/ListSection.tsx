"use client";

interface ListSectionProps {
  className?: string;
}

export function ListSection({ className }: ListSectionProps) {
  const items = [
    "First item in the list",
    "Second item in the list",
    "Third item in the list",
  ];

  return (
    <section className={`w-full max-w-md space-y-6 ${className || ""}`}>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li
            key={index}
            className="rounded-md border bg-card p-4 text-card-foreground shadow-sm"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}


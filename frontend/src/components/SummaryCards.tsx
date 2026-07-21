import type { TaskSummary } from "../types";

type SummaryCardsProps = {
  summary: TaskSummary;
};

const cards = [
  { key: "total", label: "Total Tasks" },
  { key: "pending", label: "Pending" },
  { key: "inProgress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "overdue", label: "Overdue" },
] as const;

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <section className="summary-grid">
      {cards.map((card) => (
        <article key={card.key} className="summary-card">
          <p>{card.label}</p>
          <strong>{summary[card.key]}</strong>
        </article>
      ))}
    </section>
  );
}


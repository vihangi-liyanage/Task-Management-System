const features = [
  "JWT auth with default admin credentials",
  "Task CRUD with search, filters, and sorting",
  "Dashboard counts for task status and overdue items",
  "Responsive layout for desktop, tablet, and mobile",
];

export default function App() {
  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">Task Management System</p>
        <h1>Assessment foundation is in place.</h1>
        <p className="lead">
          This monorepo is scaffolded for the Koncepthive intern assessment and
          ready for authentication, task workflows, and dashboard features.
        </p>

        <div className="feature-grid">
          {features.map((feature) => (
            <article key={feature} className="feature-card">
              {feature}
            </article>
          ))}
        </div>

        <div className="login-hint">
          <strong>Default credentials:</strong> admin@test.com / 123456
        </div>
      </section>
    </main>
  );
}


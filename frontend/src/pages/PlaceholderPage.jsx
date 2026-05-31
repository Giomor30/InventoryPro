export default function PlaceholderPage({ title, description }) {
  return (
    <section>
      <h1 className="page-title">{title}</h1>
      <div className="panel">
        <p>{description}</p>
      </div>
    </section>
  );
}

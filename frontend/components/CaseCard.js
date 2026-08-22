import Link from 'next/link';

export default function CaseCard({ id, title, number, area, status, next }) {
  return <Link href={`/case/${id}`} className="case-card">
    <div className="case-card-top"><span className="case-tag">{area}</span><span className={`status status-${status}`}>{status}</span></div>
    <h3>{title}</h3><p className="muted">{number}</p>
    <div className="case-card-bottom"><span>Next: {next}</span><span className="arrow">-&gt;</span></div>
  </Link>;
}

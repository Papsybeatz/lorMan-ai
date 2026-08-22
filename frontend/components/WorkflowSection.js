import Link from 'next/link';

export default function WorkflowSection({ eyebrow, title, description, href, action, children }) {
  return <section className="workflow-section"><div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{description && <p className="muted workflow-description">{description}</p>}</div>{href && <Link href={href} className="text-button">{action || 'Open desk'} -&gt;</Link>}</div>{children}</section>;
}

import Link from 'next/link';

export default function DocketTimeline() {
  return <section className="timeline"><div className="section-heading"><div><p className="eyebrow">Docket</p><h2>No key dates</h2></div><Link href="/intake" className="text-button">Add first case -&gt;</Link></div><div className="empty-state"><p>Docket events will appear after your first case is created.</p></div></section>;
}

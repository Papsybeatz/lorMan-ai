export default function DocketTimeline() {
  const events = [['18 Sep 2026', 'Hearing bundle due', 'Upcoming'], ['04 Sep 2026', 'Case management conference', 'Complete'], ['12 Aug 2026', 'Originating process filed', 'Complete']];
  return <section className="timeline"><div className="section-heading"><div><p className="eyebrow">Docket</p><h2>Key dates</h2></div><button className="text-button">View all -&gt;</button></div>{events.map(([date, title, state]) => <div className="timeline-item" key={title}><span className="timeline-dot" /><div><small>{date}</small><strong>{title}</strong><span className="muted">{state}</span></div></div>)}</section>;
}

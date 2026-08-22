import Link from 'next/link';

export default function Shell({ children, eyebrow = 'Workspace' }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">l</span><span>lorMan</span></div>
        <p className="sidebar-label">{eyebrow}</p>
        <nav>
          <Link href="/dashboard">Overview</Link>
          <Link href="/intake">New intake</Link>
          <Link href="/civil">Civil desk</Link>
          <Link href="/criminal">Criminal desk</Link>
          <Link href="/onboarding">Preferences</Link>
        </nav>
        <div className="sidebar-footer"><span className="avatar">CK</span><div><strong>Charles K.</strong><small>Lead counsel</small></div></div>
      </aside>
      <main className="main-content">
        <header className="topbar"><span className="breadcrumb">Lawyers workspace / {eyebrow}</span><button className="icon-button" aria-label="Notifications">o</button></header>
        {children}
      </main>
    </div>
  );
}

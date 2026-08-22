import { useRouter } from 'next/router';
import Shell from '../../components/Shell';
import DocketTimeline from '../../components/DocketTimeline';
import DocumentViewer from '../../components/DocumentViewer';

export default function CasePage() { const { query } = useRouter(); const title = query.id ? String(query.id).replaceAll('-', ' ') : 'Case workspace'; return <Shell eyebrow="Case workspace"><div className="page"><div className="page-intro"><div><p className="eyebrow">Active matter / LD/124/2026</p><h1 style={{textTransform:'capitalize'}}>{title}</h1></div><div className="action-row"><button className="ghost-button">Add document</button><button className="primary-button">Share workspace <span>-&gt;</span></button></div></div><div className="workspace-grid"><DocumentViewer title="Selected document" /><DocketTimeline /></div></div></Shell>; }

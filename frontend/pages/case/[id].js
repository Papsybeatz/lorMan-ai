import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Shell from '../../components/Shell';
import DocketTimeline from '../../components/DocketTimeline';
import { getCase } from '../../utils/api';

export default function CasePage() {
  const { query } = useRouter();
  const [caseData, setCaseData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!query.id) return;
    getCase(String(query.id))
      .then((response) => setCaseData(response.case))
      .catch((requestError) => setError(requestError.message || 'Could not load this case.'));
  }, [query.id]);

  const title = caseData?.title || 'Loading case...';
  const brief = caseData?.documents?.find((document) => document.type === 'brief');
  const intake = caseData?.documents?.find((document) => document.type === 'intake');

  return <Shell eyebrow="Case workspace"><div className="page"><div className="page-intro"><div><p className="eyebrow">Active matter / {caseData?.caseNumber || 'Case workspace'}</p><h1 style={{textTransform:'capitalize'}}>{title}</h1></div><div className="action-row"><button className="ghost-button">Add document</button><button className="primary-button">Share workspace <span>-&gt;</span></button></div></div>{error && <p className="form-error">{error}</p>}<div className="workspace-grid"><section className="document-viewer"><div className="document-toolbar"><span>{brief?.name || 'Selected document'}</span><button className="ghost-button">Export draft</button></div><article className="paper"><p className="paper-kicker">WORKING DRAFT / PRIVILEGED</p><h2>AI matter brief</h2>{brief?.content ? <pre style={{whiteSpace:'pre-wrap', fontFamily:'inherit'}}>{brief.content}</pre> : intake?.content ? <p>{intake.content}</p> : <p>Loading case documents...</p>}</article></section><DocketTimeline /></div></div></Shell>;
}

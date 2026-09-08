import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Shell from '../../components/Shell';
import DocketTimeline from '../../components/DocketTimeline';
import { getCase, regenerateBrief, saveCaseFacts } from '../../utils/api';

export default function CasePage() {
  const { query } = useRouter();
  const [caseData, setCaseData] = useState(null);
  const [factsText, setFactsText] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [savingFacts, setSavingFacts] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  async function loadCase(id) {
    const response = await getCase(id);
    setCaseData(response.case);
    setFactsText((response.case.facts || []).map((fact) => fact.text).join('\n'));
  }

  useEffect(() => {
    if (!query.id) return;
    loadCase(String(query.id))
      .catch((requestError) => setError(requestError.message || 'Could not load this case.'));
  }, [query.id]);

  async function saveFacts() {
    setError('');
    setNotice('');
    setSavingFacts(true);
    try {
      const facts = factsText.split('\n').map((fact) => fact.trim()).filter(Boolean);
      await saveCaseFacts(String(query.id), facts);
      await loadCase(String(query.id));
      setNotice('Approved facts saved.');
    } catch (requestError) {
      setError(requestError.message || 'Could not save the approved facts.');
    } finally {
      setSavingFacts(false);
    }
  }

  async function regenerate() {
    setError('');
    setNotice('');
    setRegenerating(true);
    try {
      const facts = factsText.split('\n').map((fact) => fact.trim()).filter(Boolean);
      await saveCaseFacts(String(query.id), facts);
      await regenerateBrief(String(query.id));
      await loadCase(String(query.id));
      setNotice('Brief regenerated from the approved facts.');
    } catch (requestError) {
      setError(requestError.message || 'Could not regenerate the brief.');
    } finally {
      setRegenerating(false);
    }
  }

  const title = caseData?.title || 'Loading case...';
  const brief = caseData?.documents?.find((document) => document.type === 'brief');
  const intake = caseData?.documents?.find((document) => document.type === 'intake');

  return <Shell eyebrow="Case workspace"><div className="page"><div className="page-intro"><div><p className="eyebrow">Active matter / {caseData?.caseNumber || 'Case workspace'}</p><h1 style={{textTransform:'capitalize'}}>{title}</h1></div><div className="action-row"><button className="ghost-button">Add document</button><button className="primary-button">Share workspace <span>-&gt;</span></button></div></div>{error && <p className="form-error">{error}</p>}{notice && <p className="form-note">{notice}</p>}<div className="workspace-grid"><section className="facts-panel"><div className="section-heading"><div><p className="eyebrow">Case preparation</p><h2>Approved intake facts</h2></div></div><p className="muted">Optional refinement layer. Add one validated fact per line; AI uses only these facts when you regenerate the brief.</p><textarea className="facts-editor" value={factsText} onChange={(event) => setFactsText(event.target.value)} rows="14" placeholder="Client was arrested on 08/12/2026 at East Legon.&#10;Police did not provide a caution statement.&#10;Client alleges unlawful detention." disabled={!caseData} /><div className="facts-actions"><button className="ghost-button" onClick={saveFacts} disabled={savingFacts || regenerating}>{savingFacts ? 'Saving...' : 'Save facts'}</button><button className="primary-button" onClick={regenerate} disabled={savingFacts || regenerating || !factsText.trim()}>{regenerating ? 'Regenerating...' : 'Regenerate brief'} <span>-&gt;</span></button></div></section><section className="document-viewer"><div className="document-toolbar"><span>{brief?.name || 'Selected document'}</span><button className="ghost-button">Export draft</button></div><article className="paper"><p className="paper-kicker">WORKING DRAFT / PRIVILEGED</p><h2>AI matter brief</h2>{brief?.content ? <pre style={{whiteSpace:'pre-wrap', fontFamily:'inherit'}}>{brief.content}</pre> : intake?.content ? <p>{intake.content}</p> : <p>Loading case documents...</p>}</article></section><DocketTimeline /></div></div></Shell>;
}

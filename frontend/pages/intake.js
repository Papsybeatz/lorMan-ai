import Shell from '../components/Shell';
import IntakeForm from '../components/IntakeForm';
import DocumentViewer from '../components/DocumentViewer';

export default function Intake() { return <Shell eyebrow="New intake"><div className="page"><div className="page-intro"><div><p className="eyebrow">Matter intake</p><h1>Start with the facts.</h1></div><p className="muted">Turn a first conversation into a structured matter brief. You stay in control of every fact and assumption.</p></div><div className="form-layout"><IntakeForm /><DocumentViewer title="AI matter brief" /></div></div></Shell>; }

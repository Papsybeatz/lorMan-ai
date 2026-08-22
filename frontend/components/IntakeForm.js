import { useState } from 'react';

export default function IntakeForm() {
  const [submitted, setSubmitted] = useState(false);
  return <form className="intake-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
    <label>Client or matter name<input required name="matter" placeholder="e.g. Okafor v. Bello" /></label>
    <label>What happened?<textarea required name="facts" rows="6" placeholder="Capture the facts in your own words..." /></label>
    <div className="form-grid"><label>Practice area<select name="area"><option>Civil litigation</option><option>Criminal defense</option><option>Family</option></select></label><label>Urgency<select name="urgency"><option>Standard</option><option>Time-sensitive</option><option>Immediate</option></select></label></div>
    <button className="primary-button" type="submit">{submitted ? 'Intake captured' : 'Capture intake'} <span>-&gt;</span></button>
    {submitted && <p className="form-note">Your intake is ready for review. AI generation will run once the external provider is configured.</p>}
  </form>;
}

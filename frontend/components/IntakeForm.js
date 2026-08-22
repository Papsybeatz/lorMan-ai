import { useState } from 'react';
import { useRouter } from 'next/router';
import { createIntake } from '../utils/api';

export default function IntakeForm() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  async function submitIntake(event) {
    event.preventDefault();
    setError('');
    setSaving(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await createIntake({
        matter: form.get('matter'),
        userInput: form.get('facts'),
        practiceArea: form.get('area'),
        urgency: form.get('urgency'),
        country: 'Nigeria',
        lawyer: { name: 'Charles K.', email: 'charles@lorman.local' }
      });
      setSubmitted(true);
      if (response.case?.id) router.push(`/case/${response.case.id}`);
    } catch (requestError) {
      setError(requestError.message || 'Could not save this intake.');
    } finally {
      setSaving(false);
    }
  }
  return <form className="intake-form" onSubmit={submitIntake}>
    <label>Client or matter name<input required name="matter" placeholder="e.g. Okafor v. Bello" /></label>
    <label>What happened?<textarea required name="facts" rows="6" placeholder="Capture the facts in your own words..." /></label>
    <div className="form-grid"><label>Practice area<select name="area"><option>Civil litigation</option><option>Criminal defense</option><option>Family</option></select></label><label>Urgency<select name="urgency"><option>Standard</option><option>Time-sensitive</option><option>Immediate</option></select></label></div>
    <button className="primary-button" type="submit" disabled={saving}>{saving ? 'Saving intake...' : submitted ? 'Intake captured' : 'Capture intake'} <span>-&gt;</span></button>
    {error && <p className="form-error">{error}</p>}
    {submitted && <p className="form-note">Your intake is ready for review. AI generation will run once the external provider is configured.</p>}
  </form>;
}

import { useState } from 'react'
import { CheckCircle2, LoaderCircle, Send } from 'lucide-react'

type EnquiryResponse = { id: number; message: string }

export default function EnquiryForm({ propertyName, selectedPlotNumber }: { propertyName?: string; selectedPlotNumber?: string }) {
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const phone = String(data.get('phone') || '').trim()
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid phone number (at least 10 digits).')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          phone,
          email: data.get('email'),
          propertyName: data.get('property'),
          plotNumber: data.get('plot'),
          visitDate: data.get('visitDate'),
          message: data.get('message')
        })
      })
      const result = await response.json() as Partial<EnquiryResponse> & { error?: string }
      if (!response.ok) {
        throw new Error(result.error || 'We could not submit your enquiry. Please try again.')
      }
      if (typeof result.id !== 'number') {
        throw new Error('The server response was incomplete. Please contact us before submitting again.')
      }
      form.reset()
      setSent(true)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to reach the enquiry service. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return <form className="enquiry-form" onSubmit={submit}>
    {sent ? <div className="form-success" role="status">
      <CheckCircle2 size={28}/><h3>Thank you for your interest.</h3>
      <p>Your enquiry has been saved. Our team can follow up using the contact details you provided. This demo does not send an email notification.</p>
      <button type="button" className="text-link" onClick={() => setSent(false)}>Send another enquiry</button>
    </div> : <>
      <div className="form-row"><label>Your name<input name="name" placeholder="Full name" required minLength={2} maxLength={100}/></label><label>Phone number<input name="phone" type="tel" placeholder="+91 98765 43210" required maxLength={30}/></label></div>
      <label>Email address<input name="email" type="email" placeholder="you@example.com" required maxLength={254}/></label>
      <label>Property<input name="property" value={propertyName ?? 'General enquiry'} readOnly/></label>
      {selectedPlotNumber && <label>Selected sample plot<input name="plot" value={selectedPlotNumber} readOnly/></label>}
      <label>Preferred visit date<input name="visitDate" type="date" min={new Date().toLocaleDateString('en-CA')}/></label>
      <label>Message<textarea name="message" rows={4} maxLength={2000} defaultValue={propertyName ? `I'm interested in ${propertyName}. Please share more details.` : ''} placeholder="Tell us what you're looking for..." required/></label>
      <label className="enquiry-consent"><input name="consent" type="checkbox" required/><span>I agree that NOVARA may store these details in its local enquiry database and contact me about this request.</span></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-dark" type="submit" disabled={submitting}>{submitting ? <>Saving enquiry <LoaderCircle size={15} className="spin"/></> : <>Submit enquiry <Send size={15}/></>}</button>
      <p className="form-note">Your enquiry is stored in this project's SQLite database. No email or WhatsApp notification is sent automatically.</p>
    </>}
  </form>
}

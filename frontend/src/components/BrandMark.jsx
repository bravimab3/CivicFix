import { Link } from 'react-router-dom'

export function BrandMark({ light = false, link = true }) {
  const mark = <span className={`brand-mark ${light ? 'brand-mark-light' : ''}`}>
    <span className="brand-icon" aria-hidden="true"><svg viewBox="0 0 42 42" role="img"><path d="M9 28.5C14.5 34 27 34 33 26.5" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" /><path d="M12 28.5 17.2 22 23 25.8 30.6 12" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="28.5" r="4" fill="currentColor" /><circle cx="30.6" cy="12" r="4" fill="currentColor" /><path d="m26 30 4.2 4.2L36 28.4" fill="none" stroke="var(--brand-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
    <span className="brand-wordmark"><strong>Civic</strong><em>Fix</em></span>
  </span>
  return link ? <Link to="/" className="brand-link" aria-label="CivicFix home">{mark}</Link> : mark
}

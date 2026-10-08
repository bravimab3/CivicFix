import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { BrandMark } from '../components/BrandMark'
import { Button } from '../components/UI'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [touched, setTouched] = useState(false)
  const from = location.state?.from

  async function submit(event) {
    event.preventDefault(); setTouched(true); setError('')
    if (!form.email || !form.password) return
    try {
      const session = await login(form)
      navigate(session.role === 'ADMIN' ? '/admin' : '/app', { replace: true })
    } catch (err) { setError(err.message || 'Unable to log in. Please check your details and try again.') }
  }
  return <div className="auth-page"><div className="auth-aside"><Link className="auth-back" to="/"><ArrowLeft size={16} /> Back to home</Link><div className="auth-aside-content"><div className="auth-mark"><span className="pulse-dot" /> CIVICFIX / SECURE ACCESS</div><h1>Keep the city<br /><span>in sight.</span></h1><p>Pick up where you left off — from the issue you reported to the response that follows.</p><div className="auth-quote"><ShieldCheck size={19} /><span>“The best civic tools make progress feel visible.”<small>CivicFix principle</small></span></div></div><div className="auth-aside-foot"><BrandMark light link={false} /><span>Resident portal</span></div></div><div className="auth-panel"><div className="auth-panel-inner"><BrandMark /><div className="auth-form-heading"><span className="eyebrow">WELCOME BACK</span><h2>Sign in to CivicFix</h2><p>Use the account connected to your neighborhood reports.</p></div>{error && <div className="form-alert" role="alert">{error}</div>}<form onSubmit={submit} noValidate><label className={touched && !form.email ? 'has-error' : ''}>Email address<div className="input-wrap"><Mail size={17} /><input type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>{touched && !form.email && <small>Enter your email address.</small>}</label><label className={touched && !form.password ? 'has-error' : ''}>Password<div className="input-wrap"><LockKeyhole size={17} /><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /><button type="button" className="input-icon-button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>{touched && !form.password && <small>Enter your password.</small>}</label><Button className="button-full" loading={isLoading} type="submit">Sign in <ArrowRight size={16} /></Button></form><p className="auth-switch">New to CivicFix? <Link to="/signup">Create an account</Link></p>{from && <p className="auth-note">Sign in to continue to your protected page.</p>}</div></div></div>
}

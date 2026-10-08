import { Menu, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { BrandMark } from '../components/BrandMark'

export function PublicNav() {
  const [open, setOpen] = useState(false)
  return <header className="public-nav"><div className="container nav-inner"><BrandMark /><button className="icon-button nav-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X size={20} /> : <Menu size={20} />}</button><nav className={`public-links ${open ? 'public-links-open' : ''}`}><NavLink to="/" end onClick={() => setOpen(false)}>Home</NavLink><a href="#how-it-works" onClick={() => setOpen(false)}>How it works</a><Link to="/login" onClick={() => setOpen(false)}>Track issues</Link><span className="nav-divider" /><Link className="nav-login" to="/login" onClick={() => setOpen(false)}>Log in</Link><Link className="button button-small button-primary" to="/signup" onClick={() => setOpen(false)}>Create account</Link></nav></div></header>
}

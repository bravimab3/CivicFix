import { BarChart3, FilePlus2, LayoutDashboard, ListChecks, LogOut, Menu, UserRound, X } from 'lucide-react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { BrandMark } from './BrandMark'
import { useAuth } from '../context/AuthContext'

const citizenLinks = [{ to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true }, { to: '/app/report', label: 'Report issue', icon: FilePlus2 }, { to: '/app/issues', label: 'My issues', icon: ListChecks }, { to: '/app/profile', label: 'Profile', icon: UserRound }]
const adminLinks = [{ to: '/admin', label: 'Dashboard', icon: BarChart3, end: true }, { to: '/admin/issues', label: 'All issues', icon: ListChecks }, { to: '/admin/users', label: 'Users', icon: UserRound }]

export function AppShell({ children, variant = 'citizen' }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const isAdmin = variant === 'admin'
  const links = isAdmin ? adminLinks : citizenLinks
  const name = user?.name || user?.full_name || user?.email?.split('@')[0] || (isAdmin ? 'Operations team' : 'Civic resident')
  const close = () => setOpen(false)
  function handleLogout() { logout(); navigate('/'); }
  return <div className={`app-shell ${isAdmin ? 'app-shell-admin' : ''}`}>
    <aside className={`app-sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="sidebar-head"><BrandMark light /><button className="icon-button sidebar-close" onClick={close} aria-label="Close menu"><X size={18} /></button></div>
      <div className="sidebar-context"><span className="eyebrow">{isAdmin ? 'Operations console' : 'Resident workspace'}</span><strong>{isAdmin ? 'City response' : 'Your civic pulse'}</strong></div>
      <nav className="side-nav" aria-label="Application navigation">{links.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} onClick={close} className={({ isActive }) => isActive ? 'active' : ''}><Icon size={18} /><span>{label}</span></NavLink>)}</nav>
      <div className="sidebar-foot"><div className="profile-mini"><span className="avatar">{name.charAt(0).toUpperCase()}</span><span><strong>{name}</strong><small>{isAdmin ? 'Administrator' : 'Citizen account'}</small></span></div><button className="sidebar-logout" onClick={handleLogout}><LogOut size={16} /> Log out</button></div>
    </aside>
    <div className="app-main"><header className="app-topbar"><button className="icon-button mobile-menu" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={21} /></button><div className="topbar-crumb"><span className="pulse-dot" /> {isAdmin ? 'CivicFix Admin' : 'CivicFix resident portal'}</div><div className="topbar-actions"><span className="topbar-date">{new Intl.DateTimeFormat('en', { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date())}</span><button className="avatar avatar-button" onClick={() => navigate(isAdmin ? '/admin' : '/app/profile')} aria-label="Open profile">{name.charAt(0).toUpperCase()}</button></div></header><main className="page-wrap">{children}</main></div>
    {open && <button className="drawer-scrim" onClick={close} aria-label="Close menu" />}
    {location.pathname === '/' ? null : null}
  </div>
}

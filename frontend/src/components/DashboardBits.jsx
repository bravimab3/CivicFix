import { Activity, AlertTriangle, CheckCircle2, FileText, TrendingUp } from 'lucide-react'

const iconMap = { total: FileText, reported: Activity, inProgress: TrendingUp, resolved: CheckCircle2, high: AlertTriangle }

export function PageHeader({ eyebrow, title, description, action }) { return <div className="page-header"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div> }

export function MetricGrid({ metrics, admin = false }) { return <div className={`metric-grid ${admin ? 'metric-grid-admin' : ''}`}>{metrics.map((metric) => { const Icon = iconMap[metric.key] || FileText; return <div className={`metric-card metric-${metric.key}`} key={metric.key}><div className="metric-card-top"><span className="metric-icon"><Icon size={18} /></span>{metric.delta && <span className="metric-delta">{metric.delta}</span>}</div><strong>{metric.value}</strong><span>{metric.label}</span></div> })}</div> }

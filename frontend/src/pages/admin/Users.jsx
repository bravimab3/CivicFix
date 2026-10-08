import { ArrowLeft, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AppShell } from '../../components/AppShell'
import { PageHeader } from '../../components/DashboardBits'
import { EmptyState } from '../../components/StateViews'

export default function AdminUsers() {
  return <AppShell variant="admin"><PageHeader eyebrow="CITY RESPONSE / USERS" title="People in the loop." description="The user directory will stay connected to the real FastAPI account model — never a fabricated list." action={<Link className="button button-secondary" to="/admin"><ArrowLeft size={15} /> Back to overview</Link>} /><EmptyState icon={UsersRound} title="User directory endpoint not configured." description="No FastAPI user-list endpoint was available in this sandbox. Add the real route in src/api/ when the backend contract is available, and this surface can render live account records without changing the UI shell." action={<Link className="button button-primary button-small" to="/admin">Return to dashboard</Link>} /></AppShell>
}

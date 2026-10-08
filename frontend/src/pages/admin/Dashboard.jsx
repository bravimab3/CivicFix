import { ArrowRight, ListChecks } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'

import {
  listAdminIssues,
  normalizeIssues,
  updateIssueStatus,
  updateIssuePriority,
} from '../../api/issues'

import { AppShell } from '../../components/AppShell'

import {
  CategoryChart,
  PriorityChart,
  StatusChart,
} from '../../components/charts/Charts'

import {
  PageHeader,
  MetricGrid,
} from '../../components/DashboardBits'

import { IssueCard } from '../../components/IssueViews'

import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '../../components/StateViews'

import { useToast } from '../../context/ToastContext'
import { deriveMetrics } from '../../utils'
import IndiaMap from '../../IndiaMap'


export default function AdminDashboard() {

  const { push } = useToast()

  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // ===============================
  // MAP FILTERS
  // ===============================

  const [mapStatus, setMapStatus] = useState('ALL')
  const [mapCategory, setMapCategory] = useState('ALL')
  const [mapPriority, setMapPriority] = useState('ALL')


  // ===============================
  // ADMIN ISSUE MANAGEMENT
  // ===============================

  const [selectedIssue, setSelectedIssue] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedPriority, setSelectedPriority] = useState('')

  const [savingStatus, setSavingStatus] = useState(false)
  const [savingPriority, setSavingPriority] = useState(false)


  // ===============================
  // LOAD ISSUES
  // ===============================

  const load = useCallback(async () => {

    setLoading(true)
    setError('')

    try {

      const data = normalizeIssues(
        await listAdminIssues()
      )

      setIssues(data)

    } catch (err) {

      setError(err.message)
      push(err.message, 'error')

    } finally {

      setLoading(false)

    }

  }, [push])


  useEffect(() => {
    load()
  }, [load])


  const metrics = deriveMetrics(issues)


  // ===============================
  // MAP CATEGORIES
  // ===============================

  const mapCategories = [
    ...new Set(
      issues
        .map((issue) => issue.category)
        .filter(Boolean)
    ),
  ]


  // ===============================
  // MAP FILTERING
  // ===============================

  const mapIssues = issues.filter((issue) => {

    const statusMatch =
      mapStatus === 'ALL' ||
      issue.status === mapStatus

    const categoryMatch =
      mapCategory === 'ALL' ||
      issue.category === mapCategory

    const priorityMatch =
      mapPriority === 'ALL' ||
      issue.priority === mapPriority

    return (
      statusMatch &&
      categoryMatch &&
      priorityMatch
    )

  })


  // ===============================
  // SELECT ISSUE FOR MANAGEMENT
  // ===============================

  const handleSelectIssue = (issue) => {

    setSelectedIssue(issue)
    setSelectedStatus(issue.status)
    setSelectedPriority(issue.priority)

  }


  // ===============================
  // UPDATE STATUS
  // ===============================

  const handleStatusUpdate = async () => {

    if (!selectedIssue) return

    setSavingStatus(true)

    try {

      await updateIssueStatus(
        selectedIssue.ticketId,
        selectedStatus
      )

      push(
        `${selectedIssue.ticketId} status updated successfully.`,
        'success'
      )

      await load()

      setSelectedIssue((current) => (
        current
          ? {
              ...current,
              status: selectedStatus,
            }
          : current
      ))

    } catch (err) {

      push(
        err.message || 'Unable to update issue status.',
        'error'
      )

    } finally {

      setSavingStatus(false)

    }

  }


  // ===============================
  // UPDATE PRIORITY
  // ===============================

  const handlePriorityUpdate = async () => {

    if (!selectedIssue) return

    setSavingPriority(true)

    try {

      await updateIssuePriority(
        selectedIssue.ticketId,
        selectedPriority
      )

      push(
        `${selectedIssue.ticketId} priority updated successfully.`,
        'success'
      )

      await load()

      setSelectedIssue((current) => (
        current
          ? {
              ...current,
              priority: selectedPriority,
            }
          : current
      ))

    } catch (err) {

      push(
        err.message || 'Unable to update issue priority.',
        'error'
      )

    } finally {

      setSavingPriority(false)

    }

  }


  return (
    <AppShell variant="admin">

      <PageHeader
        eyebrow="CITY RESPONSE / OVERVIEW"
        title="The response room."
        description="A live view of what residents are making visible and what needs attention next."
        action={
          <Link
            className="button button-primary"
            to="/admin/issues"
          >
            Open all issues
            <ArrowRight size={16} />
          </Link>
        }
      />


      {/* ===============================
          METRICS
      =============================== */}

      <MetricGrid
        admin
        metrics={[
          {
            key: 'total',
            label: 'Total issues',
            value: metrics.total,
          },
          {
            key: 'reported',
            label: 'Reported',
            value: metrics.reported,
          },
          {
            key: 'inProgress',
            label: 'In progress',
            value: metrics.inProgress,
          },
          {
            key: 'resolved',
            label: 'Resolved',
            value: metrics.resolved,
          },
          {
            key: 'high',
            label: 'High priority',
            value: metrics.high,
          },
        ]}
      />


      {loading ? (

        <LoadingState label="Loading the response room…" />

      ) : error ? (

        <ErrorState
          message="Unable to load the admin issue feed. Please try again."
          onRetry={load}
        />

      ) : (

        <>

          {/* ===============================
              CHARTS
          =============================== */}

          <section className="chart-grid">

            <div className="data-card chart-card">

              <div className="data-card-head">

                <div>

                  <span className="eyebrow">
                    STATUS MIX
                  </span>

                  <h2>
                    Where reports stand
                  </h2>

                </div>

                <span className="chart-note">
                  Live issue data
                </span>

              </div>

              <StatusChart issues={issues} />

            </div>


            <div className="data-card chart-card">

              <div className="data-card-head">

                <div>

                  <span className="eyebrow">
                    CATEGORY SIGNAL
                  </span>

                  <h2>
                    What residents see
                  </h2>

                </div>

              </div>

              <CategoryChart issues={issues} />

            </div>


            <div className="data-card chart-card">

              <div className="data-card-head">

                <div>

                  <span className="eyebrow">
                    PRIORITY LOAD
                  </span>

                  <h2>
                    What needs focus
                  </h2>

                </div>

              </div>

              <PriorityChart issues={issues} />

            </div>

          </section>


          {/* ===============================
              INDIA MAP
          =============================== */}

          <section className="dashboard-section">

            <div className="section-row">

              <div>

                <span className="eyebrow">
                  ISSUE MAP
                </span>

                <h2>
                  Reports across India
                </h2>

              </div>

              <span className="chart-note">
                {mapIssues.length} mapped issue
                {mapIssues.length !== 1 ? 's' : ''}
              </span>

            </div>


            {/* MAP FILTERS */}

            <div
              className="data-card"
              style={{
                marginBottom: '12px',
                padding: '16px',
              }}
            >

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(3, minmax(0, 1fr))',
                  gap: '12px',
                }}
              >

                {/* STATUS */}

                <label
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                  }}
                >

                  Status

                  <select
                    value={mapStatus}
                    onChange={(e) =>
                      setMapStatus(e.target.value)
                    }
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #E5DED3',
                      background: '#FFFFFF',
                      fontSize: '14px',
                    }}
                  >

                    <option value="ALL">
                      All statuses
                    </option>

                    <option value="REPORTED">
                      Reported
                    </option>

                    <option value="IN_PROGRESS">
                      In Progress
                    </option>

                    <option value="RESOLVED">
                      Resolved
                    </option>

                  </select>

                </label>


                {/* CATEGORY */}

                <label
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                  }}
                >

                  Category

                  <select
                    value={mapCategory}
                    onChange={(e) =>
                      setMapCategory(e.target.value)
                    }
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #E5DED3',
                      background: '#FFFFFF',
                      fontSize: '14px',
                    }}
                  >

                    <option value="ALL">
                      All categories
                    </option>

                    {mapCategories.map((category) => (

                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>

                    ))}

                  </select>

                </label>


                {/* PRIORITY */}

                <label
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                  }}
                >

                  Priority

                  <select
                    value={mapPriority}
                    onChange={(e) =>
                      setMapPriority(e.target.value)
                    }
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #E5DED3',
                      background: '#FFFFFF',
                      fontSize: '14px',
                    }}
                  >

                    <option value="ALL">
                      All priorities
                    </option>

                    <option value="LOW">
                      Low
                    </option>

                    <option value="MEDIUM">
                      Medium
                    </option>

                    <option value="HIGH">
                      High
                    </option>

                    <option value="CRITICAL">
                      Critical
                    </option>

                  </select>

                </label>

              </div>

            </div>


            {/* MAP */}

            <div
              className="data-card"
              style={{
                padding: '16px',
              }}
            >

              <IndiaMap
                issues={mapIssues}
              />

            </div>

          </section>


          {/* ===============================
              ADMIN ISSUE MANAGEMENT
          =============================== */}

          <section className="dashboard-section">

            <div className="section-row">

              <div>

                <span className="eyebrow">
                  ADMIN CONTROL
                </span>

                <h2>
                  Manage an issue
                </h2>

              </div>

              <span className="chart-note">
                Update status and priority
              </span>

            </div>


            <div
              className="data-card"
              style={{
                padding: '20px',
              }}
            >

              {/* ISSUE SELECTOR */}

              <label
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '18px',
                }}
              >

                Select issue

                <select
                  value={
                    selectedIssue?.ticketId || ''
                  }
                  onChange={(e) => {

                    const issue =
                      issues.find(
                        (item) =>
                          item.ticketId ===
                          e.target.value
                      )

                    if (issue) {
                      handleSelectIssue(issue)
                    } else {
                      setSelectedIssue(null)
                    }

                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #E5DED3',
                    background: '#FFFFFF',
                    fontSize: '14px',
                  }}
                >

                  <option value="">
                    Choose an issue
                  </option>

                  {issues.map((issue) => (

                    <option
                      key={
                        issue.id ||
                        issue.ticketId
                      }
                      value={issue.ticketId}
                    >
                      {issue.ticketId} — {issue.title}
                    </option>

                  ))}

                </select>

              </label>


              {selectedIssue ? (

                <div>

                  {/* ISSUE DETAILS */}

                  <div
                    style={{
                      padding: '16px',
                      background: '#FFF9F2',
                      border: '1px solid #E5DED3',
                      borderRadius: '10px',
                      marginBottom: '18px',
                    }}
                  >

                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#E07A2D',
                        marginBottom: '6px',
                      }}
                    >
                      {selectedIssue.ticketId}
                    </div>

                    <h3
                      style={{
                        margin: '0 0 8px',
                        fontSize: '20px',
                      }}
                    >
                      {selectedIssue.title}
                    </h3>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(2, minmax(0, 1fr))',
                        gap: '8px',
                        fontSize: '14px',
                      }}
                    >

                      <div>
                        <strong>Category:</strong>{' '}
                        {selectedIssue.category}
                      </div>

                      <div>
                        <strong>Current status:</strong>{' '}
                        {selectedIssue.status}
                      </div>

                      <div>
                        <strong>Current priority:</strong>{' '}
                        {selectedIssue.priority}
                      </div>

                      {selectedIssue.latitude !== null &&
                        selectedIssue.latitude !== undefined && (
                          <div>
                            <strong>Location:</strong>{' '}
                            {Number(selectedIssue.latitude).toFixed(5)},{' '}
                            {Number(selectedIssue.longitude).toFixed(5)}
                          </div>
                        )}

                    </div>

                    <div
                      style={{
                        marginTop: '12px',
                        paddingTop: '12px',
                        borderTop:
                          '1px solid #E5DED3',
                        lineHeight: '1.6',
                        color: '#4B5563',
                      }}
                    >

                      <strong>
                        Description:
                      </strong>

                      <div>
                        {selectedIssue.description ||
                          'No description provided.'}
                      </div>

                    </div>

                  </div>


                  {/* CONTROLS */}

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(2, minmax(0, 1fr))',
                      gap: '16px',
                    }}
                  >

                    {/* STATUS */}

                    <div>

                      <label
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          fontSize: '13px',
                          fontWeight: '600',
                        }}
                      >

                        Change status

                        <select
                          value={selectedStatus}
                          onChange={(e) =>
                            setSelectedStatus(
                              e.target.value
                            )
                          }
                          style={{
                            padding: '11px 12px',
                            borderRadius: '8px',
                            border:
                              '1px solid #E5DED3',
                            background: '#FFFFFF',
                            fontSize: '14px',
                          }}
                        >

                          <option value="REPORTED">
                            Reported
                          </option>

                          <option value="IN_PROGRESS">
                            In Progress
                          </option>

                          <option value="RESOLVED">
                            Resolved
                          </option>

                        </select>

                      </label>


                      <button
                        type="button"
                        className="button button-primary"
                        onClick={handleStatusUpdate}
                        disabled={
                          savingStatus ||
                          selectedStatus ===
                            selectedIssue.status
                        }
                        style={{
                          marginTop: '10px',
                          width: '100%',
                          justifyContent: 'center',
                        }}
                      >

                        {savingStatus
                          ? 'Updating...'
                          : 'Update status'}

                      </button>

                    </div>


                    {/* PRIORITY */}

                    <div>

                      <label
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          fontSize: '13px',
                          fontWeight: '600',
                        }}
                      >

                        Change priority

                        <select
                          value={selectedPriority}
                          onChange={(e) =>
                            setSelectedPriority(
                              e.target.value
                            )
                          }
                          style={{
                            padding: '11px 12px',
                            borderRadius: '8px',
                            border:
                              '1px solid #E5DED3',
                            background: '#FFFFFF',
                            fontSize: '14px',
                          }}
                        >

                          <option value="LOW">
                            Low
                          </option>

                          <option value="MEDIUM">
                            Medium
                          </option>

                          <option value="HIGH">
                            High
                          </option>

                          <option value="CRITICAL">
                            Critical
                          </option>

                        </select>

                      </label>


                      <button
                        type="button"
                        className="button button-primary"
                        onClick={handlePriorityUpdate}
                        disabled={
                          savingPriority ||
                          selectedPriority ===
                            selectedIssue.priority
                        }
                        style={{
                          marginTop: '10px',
                          width: '100%',
                          justifyContent: 'center',
                        }}
                      >

                        {savingPriority
                          ? 'Updating...'
                          : 'Update priority'}

                      </button>

                    </div>

                  </div>

                </div>

              ) : (

                <div
                  style={{
                    padding: '30px',
                    textAlign: 'center',
                    color: '#6B7280',
                    background: '#FFF9F2',
                    borderRadius: '10px',
                    border: '1px dashed #E5DED3',
                  }}
                >

                  Select an issue above to view its
                  details and manage its status or
                  priority.

                </div>

              )}

            </div>

          </section>


          {/* ===============================
              RECENT REPORTS
          =============================== */}

          <section className="dashboard-section">

            <div className="section-row">

              <div>

                <span className="eyebrow">
                  LATEST SIGNALS
                </span>

                <h2>
                  Recent reports
                </h2>

              </div>

              <Link
                className="text-action"
                to="/admin/issues"
              >
                Manage all issues
                <ArrowRight size={15} />
              </Link>

            </div>


            {issues.length ? (

              <div className="issue-card-grid">

                {issues
                  .slice(0, 3)
                  .map((issue) => (

                    <IssueCard
                      key={
                        issue.id ||
                        issue.ticketId
                      }
                      issue={issue}
                      admin
                    />

                  ))}

              </div>

            ) : (

              <EmptyState
                icon={ListChecks}
                title="No issue records available."
                description="The dashboard will populate from the connected FastAPI admin endpoint."
              />

            )}

          </section>

        </>

      )}

    </AppShell>
  )
}
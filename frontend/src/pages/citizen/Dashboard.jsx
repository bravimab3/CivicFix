import { ArrowRight, FilePlus2, ListChecks } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'

import {
  listCitizenIssues,
  normalizeIssues,
} from '../../api/issues'

import { AppShell } from '../../components/AppShell'

import {
  PageHeader,
  MetricGrid,
} from '../../components/DashboardBits'

import { Button } from '../../components/UI'

import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '../../components/StateViews'

import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import {
  deriveMetrics,
  getDisplayName,
} from '../../utils'


export default function CitizenDashboard() {

  const { user } = useAuth()
  const { push } = useToast()

  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  // ===============================
  // LOAD CITIZEN ISSUES
  // ===============================

  const load = useCallback(async () => {

    setLoading(true)
    setError('')

    try {

      setIssues(
        normalizeIssues(
          await listCitizenIssues()
        )
      )

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

  const firstName =
    getDisplayName(user, 'there').split(' ')[0]


  // ===============================
  // STATUS PROGRESS
  // ===============================

  const statusSteps = [
    'REPORTED',
    'IN_PROGRESS',
    'RESOLVED',
  ]


  const getStatusIndex = (status) => {
    return statusSteps.indexOf(status)
  }


  return (
    <AppShell>

      {/* ===============================
          HEADER
      =============================== */}

      <PageHeader
        eyebrow="RESIDENT WORKSPACE"
        title={`Good morning, ${firstName}.`}
        description="Here’s the current pulse of the issues you’ve made visible."
        action={
          <Link
            className="button button-primary"
            to="/app/report"
          >
            <FilePlus2 size={16} />
            Report an issue
          </Link>
        }
      />


      {/* ===============================
          METRICS
      =============================== */}

      <MetricGrid
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
        ]}
      />


      {/* ===============================
          RECENT ISSUES
      =============================== */}

      <section className="dashboard-section">

        <div className="section-row">

          <div>

            <span className="eyebrow">
              YOUR ACTIVITY
            </span>

            <h2>
              Recent issues
            </h2>

          </div>

          <Link
            className="text-action"
            to="/app/issues"
          >
            View all issues
            <ArrowRight size={15} />
          </Link>

        </div>


        {/* LOADING */}

        {loading ? (

          <LoadingState
            label="Loading your issue activity…"
          />

        ) : error ? (

          <ErrorState
            message="Unable to load your issues. Please try again."
            onRetry={load}
          />

        ) : issues.length === 0 ? (

          <EmptyState
            icon={ListChecks}
            title="No issues reported yet."
            description="When you report a civic issue, its progress will appear here."
            action={
              <Link
                className="button button-primary button-small"
                to="/app/report"
              >
                Report your first issue
              </Link>
            }
          />

        ) : (

          <div
            style={{
              display: 'grid',
              gap: '16px',
            }}
          >

            {issues.slice(0, 3).map((issue) => {

              const currentStatusIndex =
                getStatusIndex(issue.status)

              return (

                <div
                  key={
                    issue.id ||
                    issue.ticketId
                  }
                  className="data-card"
                  style={{
                    padding: '20px',
                  }}
                >

                  {/* ===============================
                      TOP ROW
                  =============================== */}

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '16px',
                      flexWrap: 'wrap',
                    }}
                  >

                    <div>

                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: '700',
                          color: '#E07A2D',
                          marginBottom: '5px',
                        }}
                      >
                        {issue.ticketId}
                      </div>

                      <h3
                        style={{
                          margin: '0 0 6px',
                          fontSize: '19px',
                        }}
                      >
                        {issue.title}
                      </h3>

                      <div
                        style={{
                          fontSize: '13px',
                          color: '#6B7280',
                        }}
                      >
                        {issue.category}
                      </div>

                    </div>


                    {/* STATUS BADGE */}

                    <div
                      style={{
                        padding: '7px 12px',
                        borderRadius: '999px',
                        background:
                          issue.status === 'RESOLVED'
                            ? '#EAF4EE'
                            : issue.status === 'IN_PROGRESS'
                              ? '#FFF2E3'
                              : '#FCEBDD',
                        color:
                          issue.status === 'RESOLVED'
                            ? '#3F7D58'
                            : issue.status === 'IN_PROGRESS'
                              ? '#C77B30'
                              : '#B84A39',
                        fontSize: '12px',
                        fontWeight: '700',
                      }}
                    >
                      {issue.status === 'IN_PROGRESS'
                        ? 'IN PROGRESS'
                        : issue.status}
                    </div>

                  </div>


                  {/* ===============================
                      DESCRIPTION
                  =============================== */}

                  <div
                    style={{
                      marginTop: '14px',
                      color: '#4B5563',
                      fontSize: '14px',
                      lineHeight: '1.6',
                    }}
                  >
                    {issue.description ||
                      'No description provided.'}
                  </div>


                  {/* ===============================
                      PRIORITY
                  =============================== */}

                  <div
                    style={{
                      marginTop: '12px',
                      fontSize: '13px',
                      color: '#6B7280',
                    }}
                  >

                    <strong>
                      Priority:
                    </strong>{' '}

                    {issue.priority}

                  </div>


                  {/* ===============================
                      STATUS PROGRESS
                  =============================== */}

                  <div
                    style={{
                      marginTop: '20px',
                    }}
                  >

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0',
                      }}
                    >

                      {statusSteps.map(
                        (step, index) => {

                          const completed =
                            index <= currentStatusIndex

                          return (

                            <div
                              key={step}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                flex:
                                  index <
                                  statusSteps.length - 1
                                    ? 1
                                    : 'initial',
                              }}
                            >

                              {/* DOT */}

                              <div
                                style={{
                                  width: '12px',
                                  height: '12px',
                                  borderRadius: '50%',
                                  background:
                                    completed
                                      ? '#E07A2D'
                                      : '#E5DED3',
                                  flexShrink: 0,
                                }}
                              />


                              {/* LINE */}

                              {index <
                                statusSteps.length - 1 && (

                                <div
                                  style={{
                                    height: '2px',
                                    flex: 1,
                                    background:
                                      index <
                                      currentStatusIndex
                                        ? '#E07A2D'
                                        : '#E5DED3',
                                  }}
                                />

                              )}

                            </div>

                          )

                        }
                      )}

                    </div>


                    {/* STATUS LABELS */}

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '7px',
                        fontSize: '11px',
                        color: '#6B7280',
                      }}
                    >

                      <span>
                        Reported
                      </span>

                      <span>
                        In Progress
                      </span>

                      <span>
                        Resolved
                      </span>

                    </div>

                  </div>


                  {/* ===============================
                      DETAILS
                  =============================== */}

                  <div
                    style={{
                      marginTop: '18px',
                      paddingTop: '14px',
                      borderTop:
                        '1px solid #E5DED3',
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >

                    <Link
                      className="text-action"
                      to={`/app/issues/${encodeURIComponent(
                        issue.ticketId
                      )}`}
                    >
                      View details
                      <ArrowRight size={15} />
                    </Link>

                  </div>

                </div>

              )

            })}

          </div>

        )}

      </section>

    </AppShell>
  )
}
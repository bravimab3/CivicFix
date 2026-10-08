import {
  Check,
  FileImage,
  FilePlus2,
  LocateFixed,
  MapPin,
  UploadCloud,
  X,
} from 'lucide-react'

import { Link } from 'react-router-dom'
import { useRef, useState } from 'react'

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from 'react-leaflet'

import 'leaflet/dist/leaflet.css'

import { createIssue, ISSUE_CATEGORIES } from '../../api/issues'
import { AppShell } from '../../components/AppShell'
import { Button } from '../../components/UI'
import { useToast } from '../../context/ToastContext'


const initial = {
  category: '',
  title: '',
  description: '',
  latitude: '',
  longitude: '',
}


/* Map click component */
function LocationPicker({ form, setForm }) {
  useMapEvents({
    click(e) {
      setForm((current) => ({
        ...current,
        latitude: e.latlng.lat.toFixed(6),
        longitude: e.latlng.lng.toFixed(6),
      }))
    },
  })

  if (!form.latitude || !form.longitude) {
    return null
  }

  return (
    <Marker
      position={[
        Number(form.latitude),
        Number(form.longitude),
      ]}
    />
  )
}


export default function ReportIssue() {
  const { push } = useToast()

  const [form, setForm] = useState(initial)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [touched, setTouched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)

  const fileRef = useRef(null)


  function update(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }))

    setError('')
  }


  function selectFile(event) {
    const next = event.target.files?.[0]

    if (!next) return

    setFile(next)
    setPreview(URL.createObjectURL(next))
  }


  function useLocation() {
    if (!navigator.geolocation) {
      push(
        'Browser geolocation is not available.',
        'error'
      )
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setForm((current) => ({
          ...current,
          latitude: coords.latitude.toFixed(6),
          longitude: coords.longitude.toFixed(6),
        }))

        push(
          'Your location was added to the report.',
          'success'
        )
      },
      () => {
        push(
          'We could not access your location. You can select a location on the map.',
          'error'
        )
      }
    )
  }


  async function submit(event) {
    event.preventDefault()

    setTouched(true)

    if (
      !form.category ||
      !form.title ||
      !form.description
    ) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const payload = await createIssue(form)

      const value = payload?.data || payload || {}

      setSuccess(value)

      push(
        'Your issue has been reported successfully.',
        'success'
      )
    } catch (err) {
      setError(err.message)

      push(
        err.message,
        'error'
      )
    } finally {
      setLoading(false)
    }
  }


  /* SUCCESS SCREEN */

  if (success) {
    const ticket =
      success.ticket_id ||
      success.ticketId ||
      success.reference ||
      (
        success.id
          ? `CF-${String(success.id).padStart(4, '0')}`
          : 'Ticket ID pending'
      )

    return (
      <AppShell>
        <div className="success-panel">

          <div className="success-mark">
            <Check size={28} />
          </div>

          <span className="eyebrow">
            REPORT RECEIVED
          </span>

          <h1>
            Your issue has been
            <br />
            <span>reported successfully.</span>
          </h1>

          <p>
            Thanks for helping make the city more responsive.
            Keep this ticket ID to follow the response.
          </p>

          <div className="success-ticket">
            <span>YOUR TICKET ID</span>
            <strong>{ticket}</strong>
          </div>

          <div className="success-actions">

            <Link
              className="button button-primary"
              to={
                success.id
                  ? `/app/issues/${success.id}`
                  : '/app/issues'
              }
            >
              View my issue
            </Link>

            <button
              className="button button-secondary"
              onClick={() => {
                setSuccess(null)
                setForm(initial)
                setFile(null)
                setPreview('')
              }}
            >
              Report another
            </button>

          </div>

        </div>
      </AppShell>
    )
  }


  return (
    <AppShell>

      <div className="form-page-header">

        <div>
          <span className="eyebrow">
            NEW CIVIC REPORT
          </span>

          <h1>
            Make it visible.
          </h1>

          <p>
            Give the right city team enough context
            to move the issue forward.
          </p>
        </div>

        <div className="form-step">
          <span>01</span>
          <span>of 01</span>
        </div>

      </div>


      {error && (
        <div
          className="form-alert"
          role="alert"
        >
          {error}
        </div>
      )}


      <form
        className="issue-form"
        onSubmit={submit}
        noValidate
      >

        {/* STEP 1 */}

        <div className="form-card">

          <div className="form-card-title">

            <span className="number-disc">
              1
            </span>

            <div>
              <h2>
                Tell us what’s happening
              </h2>

              <p>
                Clear details help your report reach
                the right team.
              </p>
            </div>

          </div>


          <div className="field-grid">

            <label
              className={
                touched && !form.category
                  ? 'has-error'
                  : ''
              }
            >
              Issue category

              <select
                value={form.category}
                onChange={(e) =>
                  update('category', e.target.value)
                }
              >
                <option value="">
                  Select a category
                </option>

                {ISSUE_CATEGORIES.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>

              {touched && !form.category && (
                <small>
                  Choose a category.
                </small>
              )}
            </label>


            <label
              className={
                touched && !form.title
                  ? 'has-error'
                  : ''
              }
            >
              Short title

              <input
                value={form.title}
                onChange={(e) =>
                  update('title', e.target.value)
                }
                placeholder="e.g. Pothole near the bus stop"
              />

              {touched && !form.title && (
                <small>
                  Add a short title.
                </small>
              )}
            </label>

          </div>


          <label
            className={
              touched && !form.description
                ? 'has-error'
                : ''
            }
          >
            Description

            <textarea
              rows="5"
              value={form.description}
              onChange={(e) =>
                update('description', e.target.value)
              }
              placeholder="What did you notice? Include useful context like landmarks, timing, or safety impact."
            />

            {touched && !form.description && (
              <small>
                Add a few details so the team can
                understand the issue.
              </small>
            )}

          </label>

        </div>


        {/* STEP 2 */}

        <div className="form-card">

          <div className="form-card-title">

            <span className="number-disc">
              2
            </span>

            <div>
              <h2>
                Add a location
              </h2>

              <p>
                Click anywhere on the map to place
                the issue location.
              </p>
            </div>

            <button
              type="button"
              className="button button-secondary button-small form-card-action"
              onClick={useLocation}
            >
              <LocateFixed size={15} />
              Use my location
            </button>

          </div>


          {/* MAP */}

          <div
            style={{
              height: '400px',
              width: '100%',
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '16px',
            }}
          >

            <MapContainer
              center={[22.5937, 78.9629]}
              zoom={5}
              style={{
                height: '100%',
                width: '100%',
              }}
            >

              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <LocationPicker
                form={form}
                setForm={setForm}
              />

            </MapContainer>

          </div>


          {/* COORDINATES */}

          <div className="field-grid">

            <label>
              Latitude

              <input
                inputMode="decimal"
                value={form.latitude}
                onChange={(e) =>
                  update('latitude', e.target.value)
                }
                placeholder="Click the map"
              />
            </label>


            <label>
              Longitude

              <input
                inputMode="decimal"
                value={form.longitude}
                onChange={(e) =>
                  update('longitude', e.target.value)
                }
                placeholder="Click the map"
              />
            </label>

          </div>


          <div className="location-note">

            <MapPin size={15} />

            <span>
              Click on the map to choose the exact
              location. You can also use your current
              location.
            </span>

          </div>

        </div>


        {/* STEP 3 */}

        <div className="form-card">

          <div className="form-card-title">

            <span className="number-disc">
              3
            </span>

            <div>
              <h2>
                Show the issue
              </h2>

              <p>
                A photo gives the city team a head start.
              </p>
            </div>

          </div>


          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={selectFile}
            hidden
          />


          {preview ? (

            <div className="upload-preview">

              <img
                src={preview}
                alt="Preview of uploaded issue"
              />

              <button
                type="button"
                className="remove-image"
                onClick={() => {
                  setFile(null)
                  setPreview('')

                  if (fileRef.current) {
                    fileRef.current.value = ''
                  }
                }}
                aria-label="Remove image"
              >
                <X size={16} />
              </button>

              <div className="preview-name">
                <FileImage size={15} />
                {file?.name}
              </div>

            </div>

          ) : (

            <button
              type="button"
              className="upload-zone"
              onClick={() =>
                fileRef.current?.click()
              }
            >

              <span className="upload-icon">
                <UploadCloud size={21} />
              </span>

              <strong>
                Upload a photo
              </strong>

              <span>
                PNG, JPG up to 10MB · optional
              </span>

            </button>

          )}

        </div>


        {/* ACTIONS */}

        <div className="form-actions">

          <Link
            className="button button-secondary"
            to="/app"
          >
            Cancel
          </Link>

          <Button
            loading={loading}
            type="submit"
          >
            <FilePlus2 size={16} />
            Submit issue
          </Button>

        </div>

      </form>

    </AppShell>
  )
}
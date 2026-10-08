import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from 'react-leaflet'

import 'leaflet/dist/leaflet.css'


function IndiaMap({ issues = [] }) {
  const indiaCenter = [22.5937, 78.9629]

  const mappedIssues = issues.filter(
    (issue) =>
      issue.latitude !== null &&
      issue.latitude !== undefined &&
      issue.longitude !== null &&
      issue.longitude !== undefined
  )

  return (
    <div
      style={{
        height: '500px',
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <MapContainer
        center={indiaCenter}
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


        {mappedIssues.map((issue) => (

          <Marker
            key={issue.id || issue.ticketId}
            position={[
              Number(issue.latitude),
              Number(issue.longitude),
            ]}
          >

            <Popup>

              <div
                style={{
                  minWidth: '220px',
                  lineHeight: '1.5',
                }}
              >

                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#E07A2D',
                    marginBottom: '4px',
                  }}
                >
                  CIVICFIX REPORT
                </div>


                <div
                  style={{
                    fontSize: '17px',
                    fontWeight: '700',
                    marginBottom: '8px',
                  }}
                >
                  {issue.title || 'Untitled issue'}
                </div>


                <div>
                  <strong>Ticket:</strong>{' '}
                  {issue.ticketId || '—'}
                </div>


                <div>
                  <strong>Category:</strong>{' '}
                  {issue.category || 'Unknown'}
                </div>


                <div>
                  <strong>Status:</strong>{' '}
                  {issue.status || 'Unknown'}
                </div>


                <div>
                  <strong>Priority:</strong>{' '}
                  {issue.priority || 'Unknown'}
                </div>


                <div
                  style={{
                    marginTop: '8px',
                    paddingTop: '8px',
                    borderTop: '1px solid #E5DED3',
                  }}
                >
                  <strong>Description:</strong>
                  <br />
                  {issue.description || 'No description provided.'}
                </div>


                <div
                  style={{
                    marginTop: '8px',
                    fontSize: '12px',
                    color: '#6B7280',
                  }}
                >
                  📍 {Number(issue.latitude).toFixed(6)},{' '}
                  {Number(issue.longitude).toFixed(6)}
                </div>

              </div>

            </Popup>

          </Marker>

        ))}

      </MapContainer>
    </div>
  )
}


export default IndiaMap
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function ApprovalHistory() {
  const { salonId } = useParams()
  const [history, setHistory] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`http://localhost:5000/approval/history/${salonId}`)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text()
          throw new Error(text)
        }
        return res.json()
      })
      .then((data) => setHistory(data))
      .catch((err) => setError(err.message))
  }, [salonId])

  return (
    <div className="customer-table-container py-4">
      <div className="customer-table-header">
        <h2>Salon Approval History</h2>
      </div>

      {error && (
        <div className="error-banner">
          <strong>Error:</strong> {error}
        </div>
      )}

      {history.length === 0 && !error ? (
        <p className="text-muted">No approval history available.</p>
      ) : (
        <table className="customer-table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Performed By</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry, index) => (
              <tr key={index}>
                <td>{entry.action}</td>
                <td>{entry.admin_name}</td>
                <td>{new Date(entry.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

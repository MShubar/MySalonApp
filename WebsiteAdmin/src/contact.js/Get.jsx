import { useEffect, useState } from 'react'

function Get() {
  const [packages, setPackages] = useState([])

  useEffect(() => {
    fetch('http://localhost:5000/contacts')
      .then((res) => res.json())
      .then((data) => {
        setPackages(data)
      })
      .catch((err) => console.error('Error:', err))
  }, [])

  return (
    <div className="customer-table-container">
      <div className="customer-table-header">
        <h2>All Contacts</h2>
      </div>

      <table className="customer-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((packagew) => (
            <tr key={packagew.id}>
              <td>{packagew.name}</td>
              <td>{packagew.email}</td>
              <td>{packagew.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Get

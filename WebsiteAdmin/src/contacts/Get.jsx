import { useEffect, useState } from 'react'
import { API_URL } from '../config'

function Get() {
  const [contacts, setContacts] = useState([])

  useEffect(() => {
    fetch(`${API_URL}/contacts`)
      .then((res) => res.json())
      .then((data) => {
        setContacts(data)
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
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td>{contact.name}</td>
              <td>{contact.email}</td>
              <td>{contact.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Get

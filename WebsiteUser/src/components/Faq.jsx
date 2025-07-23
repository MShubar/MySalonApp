import React from 'react'
import Accordion from 'react-bootstrap/Accordion'

const Faq = () => (
  <div className="container text-light py-5">
    <h2 className="text-center mb-4">Frequently Asked Questions</h2>
    <Accordion flush defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>How do I book an appointment?</Accordion.Header>
        <Accordion.Body>
          Go to the salon page, choose your services and pick a suitable time.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Can I cancel or reschedule?</Accordion.Header>
        <Accordion.Body>
          Yes. Manage upcoming appointments from your bookings page.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header>Do you offer home service?</Accordion.Header>
        <Accordion.Body>
          Some salons provide home visits. Check their details or contact them
          directly.
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  </div>
)

export default Faq

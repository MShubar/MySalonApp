describe('Booking', () => {
  it('loads booking page', () => {
    cy.visit('/salon/1/book')
    cy.contains('Book Appointment')
  })
})

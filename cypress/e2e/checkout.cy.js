describe('Checkout', () => {
  it('loads checkout page', () => {
    cy.visit('/checkout')
    cy.contains('Checkout')
    cy.contains('Place Order')
  })
})

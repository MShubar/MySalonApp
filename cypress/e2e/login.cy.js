describe('Login', () => {
  it('loads the login page', () => {
    cy.visit('/signin')
    cy.contains('Sign In')
    cy.get('input[type="text"]').type('testuser')
    cy.get('input[type="password"]').type('password')
  })
})

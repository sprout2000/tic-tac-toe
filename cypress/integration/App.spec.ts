describe('Test the result of TicTacToe', () => {
  // Visit Home URL
  beforeEach(() => {
    cy.visit('/');
  });

  it('winner: X', () => {
    // X: upper left
    cy.get('[data-e2e="button-0"]')
      .click()
      .get('[data-e2e="button-0"]')
      .should('have.text', 'X');
    // O: top middle
    cy.get('[data-e2e="button-1"]')
      .click()
      .get('[data-e2e="button-1"]')
      .should('have.text', 'O');
    // X: middle row on the left
    cy.get('[data-e2e="button-3"]')
      .click()
      .get('[data-e2e="button-3"]')
      .should('have.text', 'X');
    // O: middle row on the middle
    cy.get('[data-e2e="button-4"]')
      .click()
      .get('[data-e2e="button-4"]')
      .should('have.text', 'O');
    // X: lower left
    cy.get('[data-e2e="button-6"]')
      .click()
      .get('[data-e2e="button-6"]')
      .should('have.text', 'X');
    // Winner: X
    cy.get('[data-e2e="status"]').should('have.text', 'Winner: X');
  });
});

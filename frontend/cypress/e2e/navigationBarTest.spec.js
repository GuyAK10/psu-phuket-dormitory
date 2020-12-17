describe('navigation bar', () => {
    it('should have', () => {
        cy.visit('http://localhost:3000')
        cy.get(':nth-child(3) > span.jsx-1156372328 > .text-lg')
    })
})
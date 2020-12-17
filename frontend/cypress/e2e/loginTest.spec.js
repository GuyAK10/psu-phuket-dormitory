describe('login test', () => {
    it('แสดงข้อความล็อกอินผิด', () => {
        cy.visit('http://localhost:3000')
        cy.get('.utillities > .cursor-pointer > .flex > a')
            .then(button => {
                if (button.text() === 'ออกจากระบบ') {
                    cy.get('.utillities > .cursor-pointer > .flex > a').click()
                    cy.get('.ant - message - custom - content > : nth - child(2)')
                        .should('have.text', 'ออกจากระบบแล้ว')
                }
            })

        cy.get('.utillities > .cursor-pointer > .flex > a').click()
        cy.get('[type="text"]').type('student')
        cy.get('[type="password"]').type('wrong password')
        cy.get('.bg-transparent').click()
        cy.get('.ant-message-custom-content > :nth-child(2)')
            .should('have.text', 'ID หรือรหัสผ่านผิดพลาด')
    })
    it('แสดงผลล็อกอินและออกจากระบบถูกต้อง', () => {
        cy.visit('http://localhost:3000')
        cy.get('.utillities > .cursor-pointer > .flex > a').click()
        cy.get('[type="text"]').clear()
        cy.get('[type="password"]').clear()
        cy.get('[type="text"]').type('student')
        cy.get('.bg-transparent').click()
        cy.get('.ant-message-custom-content > :nth-child(2)')
            .should('have.text', 'เข้าสู่ระบบแล้ว')
        cy.get('.utillities > .cursor-pointer > .flex > a')
            .then(button => {
                if (button.text() === 'ออกจากระบบ') {
                    cy.get('.utillities > .cursor-pointer > .flex > a').click()
                    cy.get('.ant-message-custom-content > :nth-child(2)')
                        .should('have.text', 'ออกจากระบบเรียบร้อย')
                }
            })
    })
})
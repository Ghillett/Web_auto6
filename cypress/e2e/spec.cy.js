describe('login page', () => {

  beforeEach(()=>{
    cy.visit('/')
  })

  it('logins successfully', () => {
    cy.login('test@test.com', 'test')
    cy.contains('Добро пожаловать test@test.com').should('be.visible')
    cy.contains('Log out').should('be.visible')
  })

  it('logins error on empty login', () => {
    cy.login(null, 'test')
    cy.get('#mail').then(el =>{
      expect(el[0].checkValidity()).to.be.false
      expect(el[0].validationMessage).to.be.eql('Заполните это поле.')
    })
  })

  it('logins error on empty password', () => {
    cy.login('test@test.com', null)
    cy.get('#pass').then(el =>{
      expect(el[0].checkValidity()).to.be.false
      expect(el[0].validationMessage).to.be.eql('Заполните это поле.')
    })
  })

  it('adds a book', () => {
    cy.login('test@test.com', 'test')
    //cy.addBook('test title', 'test description', 'test authors')
    //expect('.card-body .card-title').to.be.eql('test title')
    //expect('.card-body .card-text').to.be.eql('test authors')
    cy.get('.card-body .card-title').should('have.text', 'test title')
    cy.get('.card-body .card-text').should('have.text', 'test authors')
  })

  it('downloads a book', () => {
    cy.login('test@test.com', 'test')
    cy.contains('test title').click()
    cy.location().then(url => {
      let getUrl = url.pathname
      getUrl = getUrl.replace('book', 'books')
      cy.request('http://localhost:7071/api' + getUrl + '/download').then(response =>{
        expect(response.status).to.eq(200)
        expect(response.body).to.eq('a fake book here')
      })
    })
  })
  
  it('adds and removes favorite', () => {
    cy.login('test@test.com', 'test');
    cy.contains('test title').get('.btn-success').click()
    cy.visit('http://localhost:3000/favorites')
    cy.get('.h-100.card').should('contain', 'test title')
    cy.contains('Delete from favorite').click()
    cy.contains('Please add some book to favorit on home page!').should('be.visible')
  })
})
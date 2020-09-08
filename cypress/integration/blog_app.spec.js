describe('Blog App', function () {

  const user = {
    name: 'testuser',
    username: 'testuser',
    password: 'testpassword'
  }

  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('login form is shown on initial page load', function () {
    cy.contains('Login')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type(user.username)
      cy.get('#password').type(user.password)
      cy.get('#login-button').click()
      cy.contains(`${user.username} logged in`)
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type(user.username + 'a')
      cy.get('#password').type(user.password + 'a')
      cy.get('#login-button').click()
      cy.contains(`wrong credentials`)
    })
  })

  describe('when logged in', function () {
    beforeEach(function () {
      cy.request('POST', 'http://localhost:3001/api/login', {
        username: user.username, password: user.password
      }).then(response => {
        localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
        cy.visit('http://localhost:3000')
      })
    })

    it('a new blog can be created', function () {
      cy.contains('create blog').click()
      cy.get('.blog-form-title').type('test title')
      cy.get('.blog-form-author').type('test author')
      cy.get('.blog-form-url').type('test url')
      cy.get('button[type="submit"]').click()
      cy.contains('test author')
      cy.contains('test title')
    })


    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.contains('create blog').click()
        cy.get('.blog-form-title').type('test title')
        cy.get('.blog-form-author').type('test author')
        cy.get('.blog-form-url').type('test url')
        cy.get('button[type="submit"]').click()
        cy.contains('test author')
        cy.contains('test title')
      })

      it('the blog can be liked', function () {
        cy.get('.blog').contains('show').click()
        cy.get('.like-button').click()
        cy.contains('likes: 1')
      })

      it('can be deleted by creator', function () {
        cy.contains('delete').click()
        cy.on('window:confirm', () => true)
        cy.get('.blog').should('not.exist')
      })

      it('can be deleted by creator', function () {
        cy.contains('delete').click()
        cy.on('window:confirm', () => true)
        cy.get('.blog').should('not.exist')
      })

    })

    describe('when multiple blogs exist', function () {
      beforeEach(function () {
        for (let i = 0; i < 4; i++) {
          cy.contains('create blog').click()
          cy.get('.blog-form-title').type('test title' + i)
          cy.get('.blog-form-author').type('test author' + i)
          cy.get('.blog-form-url').type('test url' + i)
          cy.get('button[type="submit"]').click()
          cy.contains('test author' + i)
          cy.contains('test title' + i)
        }
      })

      it.only('they are sorted by likes (descending)', function () {
        cy.get('.blog').each(($blogElement, index, $list) => {
          cy.wrap($blogElement).contains('show').click()
        })

        cy.get('.blog').each(($blogElement, index, $list) => {
          console.log($blogElement, $blogElement[0].innerHTML)
          let likeButton = $blogElement.find('.like-button')
          console.log(likeButton)
          if (index === 0) {
            cy.wrap(likeButton).click()
            cy.wrap(likeButton).click()
            cy.wrap(likeButton).click()
            cy.wrap($blogElement).contains('likes: 3')
          } else if (index === 1) {
            cy.wrap(likeButton).click()
            cy.wrap(likeButton).click()
            cy.wrap($blogElement).contains('likes: 2')
          }
        })

        cy.get('.blog:first').then(($blog) => {
          let text = $blog.find('.blog-likes').text()
          let likes = parseInt(text.split(" ")[1])
          cy.expect(likes).to.equal(3)
        })
      })
    })
  })
})
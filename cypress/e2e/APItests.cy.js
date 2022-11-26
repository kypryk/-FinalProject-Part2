import {faker} from "@faker-js/faker"

let userAccessToken
let createdPostId

describe('empty spec', () => {

  it('1. Get all posts. Verify HTTP response status code and content type.', () => {
    cy.request('GET', '/posts').then(response => {
      console.log(response);
      expect(response.status).to.be.eq(200);
      expect(response.headers['content-type']).to.be.eq("application/json; charset=utf-8");
    })
  })

  it('2. Get only first 10 posts. Verify HTTP response status code. Verify that only first posts are returned.', () => {
    cy.request('GET', '/posts?_limit=10').then(response => {
      console.log(response);
      expect(response.status).to.be.eq(200);
      expect(response.body).to.have.length(10);
    })
  })

  it('3. Get posts with id = 55 and id = 60. Verify HTTP response status code. Verify id values of returned records.', () => {
    cy.request('GET', '/posts?id=55&id=60').then(response => {
      console.log(response);
      expect(response.status).to.be.eq(200);
      expect(response.body[0].id).to.be.eq(55);
      expect(response.body[1].id).to.be.eq(60);
    })
  })

  it('4. Create a post. Verify HTTP response status code.', () => {

    let body = {
      "title": faker.color.human(),
      "body": faker.animal.bird()
    }

    cy.request({
      method: 'POST',
      url: '/664/posts',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: body,
      failOnStatusCode: false
    }).then( response => {
      expect(response.status).to.be.eq(401);
      
    })
  })

  it('Before 5. Registration', () => {
  
    let requestBody = {
      "email": faker.internet.email(),
      "password": faker.internet.password()
    }

    cy.request('POST', '/register', requestBody).then((response) => {
      userAccessToken = response.body.accessToken  
      cy.log(userAccessToken)
    })

  })

  it('5. Create post with adding access token in header. Verify HTTP response status code. Verify post is created.', () => {

    let body = {
      "title": faker.color.human(),
      "body": faker.animal.bird()
    }
    console.log(body)

    cy.request({
      method: 'POST',
      url: '/664/posts',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${userAccessToken}`,
      },
      body: body
    }).then( (response) => {

      //console.log(response)
      expect(response.status).to.be.eq(201);
      createdPostId = response.body.id
      
    }).then(() => {
      cy.request('GET', `/posts?id=${createdPostId}`).then(response => {
        //console.log(response);
        expect(response.status).to.be.eq(200);
      })
    })
  })
  
  it('6. Create post entity and verify that the entity is created. Verify HTTP response status code. Use JSON in body.', () => {

    let body = {
      "title": faker.color.human(),
      "body": faker.animal.bird()
    }

    cy.request({
      method: 'POST',
      url: '/posts',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: body,
    }).then( response => {
      console.log(response);
      expect(response.status).to.be.eq(201);
      
    })
  })

  it('7. Update non-existing entity. Verify HTTP response status code.', () => {

    let randomId = faker.database.mongodbObjectId()

    let body = {
      "title": faker.color.human()
    }

    cy.request({
      method: 'PUT',
      url: `/posts/${randomId}`,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: body,
      failOnStatusCode: false
    }).then( response => {
      expect(response.status).to.be.eq(404);
      
    })
  })
  
  it('8. Create post entity and update the created entity. Verify HTTP response status code and verify that the entity is updated.', () => {

    let body = {
      "title": faker.color.human(),
      "body": faker.animal.bird()
    }
    let changedBody = {
      "title": faker.color.human(),
      "body": faker.animal.bird()
    }

    cy.request({
      method: 'POST',
      url: '/posts',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: body,
    }).then( response => {
      expect(response.status).to.be.eq(201);
      createdPostId = response.body.id
    }).then(() => {
      cy.request({
        method: 'PUT',
        url: `/posts/${createdPostId}`,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: changedBody
      }).then( response => {
        console.log(response);
        expect(response.status).to.be.eq(200);
        expect(response.body.title).to.be.eq(changedBody.title)
        expect(response.body.body).to.be.eq(changedBody.body)
      })
    })
    
  })

  it('9. Delete non-existing post entity. Verify HTTP response status code.', () => {

    let randomId = faker.database.mongodbObjectId()

    cy.request({
      method: 'DELETE',
      url: `/posts/${randomId}`,
      failOnStatusCode: false
    }).then( response => {
      console.log(response);
      expect(response.status).to.be.eq(404);
      
    })
  })

  it('10. Create post entity, update the created entity, and delete the entity. Verify HTTP response status code and verify that the entity is deleted.', () => {

    let body = {
      "title": faker.color.human(),
      "body": faker.animal.bird()
    }
    let changedBody = {
      "title": faker.color.human(),
      "body": faker.animal.bird()
    }

    cy.request({
      method: 'POST',
      url: '/posts',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: body,
    }).then( response => {
      expect(response.status).to.be.eq(201);
      createdPostId = response.body.id
    }).then(() => {
      cy.request({
        method: 'PUT',
        url: `/posts/${createdPostId}`,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: changedBody
      }).then( response => {
        //console.log(response);
        expect(response.status).to.be.eq(200);
        expect(response.body.title).to.be.eq(changedBody.title)
        expect(response.body.body).to.be.eq(changedBody.body)
      })
    }).then(() => {
      cy.request({
        method: 'DELETE',
        url: `/posts/${createdPostId}`
      }).then( response => {
        console.log(response);
        expect(response.status).to.be.eq(200);
        
      })
    })

  })

})
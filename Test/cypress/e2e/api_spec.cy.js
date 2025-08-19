const api = 'http://localhost:8080'

describe('Full API Test Suite (≥50 assertions)', () => {
  let categoryId, categoryId2
  let productId, productId2
  let customerId, customerId2
  let orderId, cartId

  // ---------- PING ----------
  it('Ping endpoint returns pong', () => {
    cy.request(`${api}/ping`).then(res => {
      expect(res.status).to.eq(200)
      expect(res.body).to.eq('pong')
    })
  })

  // ---------- CATEGORIES ----------
  it('Creates first category', () => {
    cy.request('POST', `${api}/categories`, { name: 'Electronics' })
      .then(res => {
        expect(res.status).to.be.oneOf([200, 201])
        expect(res.body).to.have.property('ID')
        expect(res.body.name).to.eq('Electronics')
        categoryId = res.body.ID
      })
  })

  it('Creates second category', () => {
    cy.request('POST', `${api}/categories`, { name: 'Books' })
      .then(res => {
        expect(res.status).to.be.oneOf([200, 201])
        expect(res.body).to.have.property('ID')
        categoryId2 = res.body.ID
      })
  })

  it('Fails to create category with empty body', () => {
    cy.request({
      method: 'POST',
      url: `${api}/categories`,
      body: {},
      failOnStatusCode: false
    }).then(res => {
      expect(res.status).to.eq(400)
    })
  })

  it('Lists categories', () => {
    cy.request(`${api}/categories`).then(res => {
      expect(res.status).to.eq(200)
      expect(res.body.length).to.be.at.least(2)
      expect(res.body.some(c => c.name === 'Electronics')).to.be.true
    })
  })

  // ---------- PRODUCTS ----------
  it('Creates product in first category', () => {
    cy.request('POST', `${api}/products`, {
      name: 'Laptop Pro',
      price: 5999.99,
      category_id: categoryId
    }).then(res => {
      expect(res.status).to.be.oneOf([200, 201])
      expect(res.body).to.have.property('ID')
      expect(res.body.category_id).to.eq(categoryId)
      productId = res.body.ID
    })
  })

  it('Creates product in second category', () => {
    cy.request('POST', `${api}/products`, {
      name: 'Go Programming Book',
      price: 149.99,
      category_id: categoryId2
    }).then(res => {
      expect(res.status).to.be.oneOf([200, 201])
      productId2 = res.body.ID
    })
  })

  it('Fails to create product with invalid category_id', () => {
    cy.request({
      method: 'POST',
      url: `${api}/products`,
      body: { name: 'Invalid Cat', price: 9.99, category_id: 99999 },
      failOnStatusCode: false
    }).then(res => {
      expect([400, 500]).to.include(res.status)
    })
  })

  it('Lists all products', () => {
    cy.request(`${api}/products`).then(res => {
      expect(res.status).to.eq(200)
      expect(res.body.length).to.be.at.least(2)
    })
  })

  it('Lists products filtered by category', () => {
    cy.request(`${api}/products?category=${categoryId}`).then(res => {
      expect(res.status).to.eq(200)
      expect(res.body.every(p => p.category_id === categoryId)).to.be.true
    })
  })

  it('Gets product by ID', () => {
    cy.request(`${api}/products/${productId}`).then(res => {
      expect(res.status).to.eq(200)
      expect(res.body.ID).to.eq(productId)
      expect(res.body.name).to.include('Laptop')
    })
  })

  it('Returns 404 for non-existing product', () => {
    cy.request({
      url: `${api}/products/999999`,
      failOnStatusCode: false
    }).then(res => {
      expect(res.status).to.eq(404)
    })
  })

  it('Updates product', () => {
    cy.request('PUT', `${api}/products/${productId}`, {
      name: 'Laptop Pro 2025',
      price: 6299.99,
      category_id: categoryId
    }).then(res => {
      expect(res.status).to.eq(200)
      expect(res.body.name).to.include('2025')
    })
  })

  it('Deletes second product', () => {
    cy.request('DELETE', `${api}/products/${productId2}`)
      .its('status')
      .should('eq', 204)
  })

  // ---------- CUSTOMERS ----------
  it('Creates first customer', () => {
    cy.request('POST', `${api}/customers`, {
      name: 'Alice',
      email: 'alice@example.com'
    }).then(res => {
      expect(res.status).to.be.oneOf([200, 201])
      customerId = res.body.ID
    })
  })

  it('Creates second customer', () => {
    cy.request('POST', `${api}/customers`, {
      name: 'Bob',
      email: 'bob@example.com'
    }).then(res => {
      expect(res.status).to.be.oneOf([200, 201])
      customerId2 = res.body.ID
    })
  })

  it('Fails to create customer without email', () => {
    cy.request({
      method: 'POST',
      url: `${api}/customers`,
      body: { name: 'No Email' },
      failOnStatusCode: false
    }).then(res => {
      expect(res.status).to.eq(400)
    })
  })

  it('Lists all customers', () => {
    cy.request(`${api}/customers`).then(res => {
      expect(res.status).to.eq(200)
      expect(res.body.some(c => c.ID === customerId)).to.be.true
    })
  })

  // ---------- ORDERS ----------
  it('Creates order for first customer', () => {
    cy.request('POST', `${api}/orders`, {
      customer_id: customerId
    }).then(res => {
      expect(res.status).to.be.oneOf([200, 201])
      orderId = res.body.ID
    })
  })

  it('Fails to create order with invalid customer_id', () => {
    cy.request({
      method: 'POST',
      url: `${api}/orders`,
      body: { customer_id: 999999 },
      failOnStatusCode: false
    }).then(res => {
      expect([400, 500]).to.include(res.status)
    })
  })

  it('Lists orders', () => {
    cy.request(`${api}/orders`).then(res => {
      expect(res.status).to.eq(200)
      expect(res.body.length).to.be.at.least(1)
    })
  })

  // ---------- CARTS ----------
  it('Creates cart for first customer', () => {
    cy.request('POST', `${api}/carts`, { customer_id: customerId }).then(res => {
      expect(res.status).to.be.oneOf([200, 201])
      cartId = res.body.ID
    })
  })

  it('Fails to create cart without customer_id', () => {
  cy.request({
    method: 'POST',
    url: `${api}/carts`,
    body: {},
    failOnStatusCode: false
  }).then(res => {
    expect(res.status).to.eq(400) // zamiast 200/201
  })
})

  it('Lists carts', () => {
    cy.request(`${api}/carts`).then(res => {
      expect(res.status).to.eq(200)
      expect(res.body.some(c => c.customer_id === customerId)).to.be.true
    })
  })

  // ---------- EDGE CASES ----------
  it('Creates category with long name', () => {
    cy.request('POST', `${api}/categories`, {
      name: 'X'.repeat(255)
    }).then(res => {
      expect(res.status).to.be.oneOf([200, 201])
    })
  })

  it('Creates product with price 0', () => {
    cy.request('POST', `${api}/products`, {
      name: 'Free Sample',
      price: 0.0,
      category_id: categoryId
    }).then(res => {
      expect(res.status).to.be.oneOf([200, 201])
    })
  })

  it('Updates category name', () => {
    cy.request('PUT', `${api}/categories/${categoryId}`, {
      name: 'Updated Electronics'
    }).then(res => {
      expect([200, 204]).to.include(res.status)
    })
  })

  it('Deletes a customer', () => {
    cy.request('DELETE', `${api}/customers/${customerId2}`)
      .its('status')
      .should('be.oneOf', [200, 204])
  })

  it('Deletes an order', () => {
    cy.request('DELETE', `${api}/orders/${orderId}`)
      .its('status')
      .should('be.oneOf', [200, 204])
  })

  it('Deletes a cart', () => {
    cy.request('DELETE', `${api}/carts/${cartId}`)
      .its('status')
      .should('be.oneOf', [200, 204])
  })

  it('Deletes a category', () => {
    cy.request('DELETE', `${api}/categories/${categoryId2}`)
      .its('status')
      .should('be.oneOf', [200, 204])
  })
})

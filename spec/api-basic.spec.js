const environment = require('./helpers/environment.js')
const superagent = require('superagent')

describe('api basic functions', () => {
  it('should have Swagger page', async () => {
    const url = new URL('swagger-ui.html', environment.apiHost)
    const res = await superagent.get(url.href)
    expect(res.status).toBe(200)
  })
})

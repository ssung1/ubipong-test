const environment = require('./helpers/environment.js')
const superagent = require('superagent')

describe('api basic functions', () => {
  it('should have Swagger page', async () => {
    const url = new URL('swagger-ui/index.html', environment.apiHost)
    const res = await superagent.get(url.href)
    expect(res.status).toBe(200)
  })

  it('should work', async () => {
    const url = new URL('http://example.com')
    const res = await superagent.get(url.href)
    expect(res.status).toBe(200)
  })
})

const environment = require('./helpers/environment.js')

describe('canary', () => {
  it('poo-tee-weet', () => {
    expect(true).toBe(true)
  })
  it('can load environment', () => {
    expect(environment.apiHost).toBeTruthy()
  })
})

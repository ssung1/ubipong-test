const environment = require('./helpers/environment.js')

var http = require('http')
describe('api basic functions', () => {
  it('can respond', () => {
    http.get('http://example.com')    
  })
})

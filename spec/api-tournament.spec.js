const environment = require('./helpers/environment.js')
const superagent = require('superagent')
const handler = require('./helpers/handler.js')

// Tournament setup
//
// Chattanooga Open       Jan 30, 2020
// EC Sports Summer Open  Jun 23, 2020

describe('api services for tournament management', () => {
  const tournamentContext = '/tournaments'

  it('should be able to add and retrieve a tournament', async () => {
    const tournamentResponse = await handler.dispatch(async () => {
      const url = new URL(tournamentContext, environment.apiHost)

      const tournamentRequest = {
        name: 'Chattanooga Open',
        date: '2020-01-30'
      }
      const tournamentResponse = await superagent.post(url).send(tournamentRequest)


      expect(tournamentResponse.status).toBe(200)

      return response.text      
    })

    await handler.dispatch(async () => {
      const url = new URL(tournamentContext, environment.apiHost)
      superagent.get(url)

      expect(response.status).toBe(200)
    })
  })

  it('should be able to get tournament details', async () => {
    pending('finish later')
  })

  it('should be able to get a list of events in a tournament', async() => {
    pending('finish later')
  })

  it('should be able to create an event', async() => {
    pending('finish later')
  })

  it('should be able to get an event details', async() => {
    pending('finish later')
  })

  it('should be able to get players in an event', async () => {
    pending('finish later')
  })

  it('should be able to send event to challonge.com', async() => {
    pending('finish later')
  })

  it('should be able to get match results from challonge.com', async() => {
    pending('finish later')
  })

  it('should be able to build round robin grid from match results', async() => {
    pending('finish later')
  })

  it('should be able to build single elimination bracket', async() => {
    pending('finish later')
  })
})


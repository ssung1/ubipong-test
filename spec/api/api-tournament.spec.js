const environment = require('../config/environment.js')
const superagent = require('superagent')
const handler = require('../util/handler.js')

// Tournament setup
//
// Eat Sleep Pong Open 2019      Mar 15, 2019
// Bikini Bottom Open 2019       Jun 23, 2019

const eatSleepPongOpen = {
  name: 'Eat Sleep Pong Open 2019',
  tournamentDate: '2019-03-15T00:00:00-0500'
}
const bikiniBottomOpen = {
  name: 'Bikini Bottom Open 2019',
  tournamentDate: '2019-06-23T00:00:00-0500'
}

describe('api services for tournament management', () => {
  const tournamentContext = '/rest/v0/tournaments'

  it('should be able to add and get a tournament', async () => {
    const addResponse = await handler.dispatch(async () => {
      const url = new URL(tournamentContext, environment.apiHost)
      const response = await superagent.post(url).send(eatSleepPongOpen)

      expect(response.status).toBe(201)

      return response
    })

    await handler.dispatch(async () => {
      const url = `${tournamentContext}/${addResponse.body.id}`
      const response = await superagent.get(url)

      expect(response.status).toBe(200)
      expect(response.body.name).toBe(eatSleepPongOpen.name)
    })
  })
})

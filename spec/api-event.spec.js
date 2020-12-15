const environment = require('./helpers/environment.js')
const superagent = require('superagent')
const handler = require('./helpers/handler.js')

// Tournament setup
//
// Eat Sleep Pong Open 2019      Mar 15, 2019
//   Event 1: Preliminary Group 1 (Round Robin)
//   Event 2: Preliminary Group 2 (Round Robin)
//   Event 3: Championship (Single Elimination)
// Bikini Bottom Open 2019       Jun 23, 2019

const eatSleepPongOpen = {
  name: 'Eat Sleep Pong Open 2019',
  tournamentDate: '2019-03-15T00:00:00-0500',
}
const prelimGroup1 = {
  name: 'Preliminary Group 1',
}
const prelimGroup2 = {
  name: 'Preliminary Group 2',
}
const championship = {
  name: 'Championship',
}
const bikiniBottomOpen = {
  name: 'Bikini Bottom Open 2019',
  tournamentDate: '2019-06-23T00:00:00-0500',
}

describe('api services for event management', () => {
  const tournamentCrudContext = '/crud/tournaments'
  const eventCrudContext = '/crud/events'
  let tournamentId

  beforeEach(async () => {
    await handler.dispatch(async () => {
      const url = new URL(tournamentCrudContext, environment.apiHost)
      const response = await superagent.post(url).send(eatSleepPongOpen)

      expect(response.status).toBe(201)

      const tournament = await superagent.get(response.header.location)
      tournamentId = tournament.body.tournamentId
    })
  })

  it('should be able to get a list of events in a tournament', async() => {
    pending('finish later')
  })

  it('should be able to create an event', async() => {
    await handler.dispatch(async () => {
      const url = new URL(eventCrudContext, environment.apiHost)
      const response = await superagent.post(url).send(
        {
          ...prelimGroup1,
          tournamentId
        }
      )

      expect(response.status).toBe(201)

      const event = await superagent.get(response.header.location)

      expect(event.body.tournamentId).toBe(tournamentId)
    })
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


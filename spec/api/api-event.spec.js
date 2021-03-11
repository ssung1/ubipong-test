const environment = require('../config/environment.js')
const superagent = require('superagent')
const handler = require('../util/handler.js')

// Tournament setup
//
// Eat Sleep Pong Open 2019      Mar 15, 2019
//   Event 1: Preliminary Group 1 (Round Robin)
//   Event 2: Preliminary Group 2 (Round Robin)
//   Event 3: Championship (Single Elimination)
// Bikini Bottom Open 2019       Jun 23, 2019

const eatSleepPongOpen = {
  name: 'Eat Sleep Pong Open 2019',
  tournamentDate: '2019-03-15T00:00:00Z',
}
const prelimGroup1 = {
  name: 'Preliminary Group 1',
  challongeUrl: 'esp_201903_pg_rr_1'
}
const prelimGroup2 = {
  name: 'Preliminary Group 2',
  challongeUrl: 'esp_201903_pg_rr_2'
}
const championship = {
  name: 'Championship',
}
const bikiniBottomOpen = {
  name: 'Bikini Bottom Open 2019',
  tournamentDate: '2019-06-23T00:00:00Z',
}

describe('api services for event management', () => {
  const tournamentContext = '/rest/v0/tournaments'
  const eventContext = '/rest/v0/events'
  let tournamentId
  let originalTimeout

  beforeEach(async () => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

    await handler.dispatch(async () => {
      const url = new URL(tournamentContext, environment.apiHost)
      const response = await superagent.post(url).send(eatSleepPongOpen)

      expect(response.status).toBe(201)

      // const tournament = await superagent.get(response.header.location)
      tournamentId = response.body.id
    })
  })

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  })

  async function deleteChallongeTournament(challongeUrl) {
    try {
      await superagent.delete(`${environment.challongeHost}/v1/tournaments/${challongeUrl}.json`)
        .query({
          api_key: environment.challongeApiKey
        })
    } catch (err) {
      if(err.status != 404) {
        throw err
      }
    }
  }

  it('should be able to create an event on challonge.com', async() => {
    await deleteChallongeTournament(prelimGroup1.challongeUrl)
    await handler.dispatch(async () => {
      const url = new URL(eventContext, environment.apiHost)
      const response = await superagent.post(url).send(
        {
          ...prelimGroup1,
          tournamentId
        }
      )

      expect(response.status).toBe(201)
      expect(response.body.tournamentId).toBe(tournamentId)
      expect(response.body.name).toBe(prelimGroup1.name)
    })
  })
})


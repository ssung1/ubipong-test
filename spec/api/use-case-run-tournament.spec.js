const environment = require('../config/environment.js')
const superagent = require('superagent')
const handler = require('../util/handler')

describe('can set up and run a tournament from start to finish, with a report of final results', () => {
  let originalTimeout

  // Tournament Setup:
  //
  // Bikini Bottom Open 2019       Jun 23, 2019
  // Event: Preliminary Group 1
  // Players: spongebob, patrick, and squidward
  // Scores:
  // spongebob vs patrick: patrick wins 3 5 1
  // spongebob vs squidward: spongebob wins 13 -5 9 9
  // patrick vs squidward: patrick wins 3 3 3

  const bikiniBottomOpen = {
    name: 'Bikini Bottom Open 2019',
    tournamentDate: '2019-06-23T00:00:00-05:00'
  }

  const preliminaryGroup1 = {
    name: "Preliminary Group 1",
    challongeUrl: "bb_201906_pg_rr_1"
  }

  const spongebob = {
    name: 'spongebob'
  }
  const patrick = {
    name: 'patrick'
  }
  const squidward = {
    name: 'squidward'
  }

  const patrickVsSquidward = {
    player1Name: 'patrick',
    player2Name: 'squidward',
    scores: '11-3,11-3,11-3',
    winner: 'patrick'
  }
  const spongbobVsPatrick = {
    player1Name: 'spongebob',
    player2Name: 'patrick',
    scores: '11-3,11-5,11-1',
    winner: 'spongebob'
  }
  const squidwardVsSpongebob = {
    player1Name: 'squidward',
    player2Name: 'spongebob',
    scores: '11-13,11-5,9-11,9-11',
    winner: 'spongebob'
  }

  const tournamentCrudContext = '/crud/tournaments'
  const tournamentContext = 'rest/v0/tournaments'
  const eventCrudContext = 'crud/events'
  const eventContext = '/rest/v0/events'

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

  async function addTournament(tournament) {
    const addedTournament = await handler.dispatch(async () => {
      const url = new URL(tournamentCrudContext, environment.apiHost)
      const response = await superagent.post(url).send(bikiniBottomOpen)

      expect(response.status).toBe(201)

      return response.body
    })

    expect(addedTournament).toBeTruthy()
    with(addedTournament) {
      expect(tournamentId).toBeTruthy()
      expect(name).toBe(tournament.name)
    }

    return addedTournament
  }

  async function addEvent(event, tournamentId) {
    const addedEvent = await handler.dispatch(async () => {
      const url = new URL(eventContext, environment.apiHost)
      const response = await superagent.post(url).send(
        Object.freeze({
          ...event,
          tournamentId
        })
      )

      expect(response.status).toBe(201)

      return response.body
    })


    expect(addedEvent).toBeTruthy()
    with(addedEvent) {
      expect(eventId).toBeTruthy()
      expect(name).toBe(event.name)
      expect(tournamentId).toBe(tournamentId)
      expect(challongeUrl).toBe(event.challongeUrl)
    }

    return addedEvent
  }

  async function getEventListByTournamentId(tournamentId) {
    return await handler.dispatch(async () => {
      const url = new URL(`${eventCrudContext}/search/findByTournamentId`,
        environment.apiHost)
      const response = await superagent.get(url)
        .query({
          tournamentId
        })

      expect(response.status).toBe(200)

      return response.body._embedded.events
    })
  }

  /**
   * returns event from our own API, which calls the challonge API
   */
  async function getEvent(challongeUrl) {
    return await handler.dispatch(async () => {
      const url = new URL(`${eventContext}/${challongeUrl}`, environment.apiHost)
      const response = await superagent.get(url)

      expect(response.status).toBe(200)

      return response.body
    })
  }

  /**
   * returns the event directly from challonge API
   * @param {*} challongeUrl 
   */
  async function getEventOnChallonge(challongeUrl) {
    return await handler.dispatch(async () => {
      const url = new URL(`v1/tournaments/${challongeUrl}.json`,
        environment.challongeHost)
      const response = await superagent.get(url)
        .query({
          api_key: environment.challongeApiKey
        })

      expect(response.status).toBe(200)

      return response.body
    })
  }

  async function addPlayerList(players, challongeUrl) {
    const addedPlayers = await handler.dispatch(async () => {
      const url = new URL(
        `v1/tournaments/${challongeUrl}/participants/bulk_add.json`,
        environment.challongeHost)
      const response = await superagent.post(url)
        .query({
          api_key: environment.challongeApiKey
        })
        .send({
          participants: players
        })

      expect(response.status).toBe(200)

      return response.body
    })

    expect(addedPlayers.map(p => p.participant.name))
      .toEqual(players.map(p => p.name))

    return addedPlayers
  }

  async function startEvent(challongeUrl) {
    await handler.dispatch(async () => {
      const url = new URL(
        `v1/tournaments/${challongeUrl}/start.json`,
        environment.challongeHost)
      const response = await superagent.post(url)
        .query({
          api_key: environment.challongeApiKey
        })

      expect(response.status).toBe(200)
    })
  }

  async function getEventMatchList(challongeUrl) {
    return await handler.dispatch(async () => {
      const url = new URL(
        `${eventContext}/${challongeUrl}/roundRobinMatchList`,
        environment.apiHost)
      const response = await superagent.get(url)

      expect(response.status).toBe(200)

      return response.body
    })
  }

  // find the correct ID of the match we want from matchList
  // then submit score
  async function submitMatchResult(match, challongeUrl) {
    // get the entire list
    const matchList = await getEventMatchList(challongeUrl)

    // find the match for which we want to submit the scores
    const thisMatchFromList = matchList.find(m => {
      return m.player1Name == match.player1Name
        && m.player2Name == match.player2Name
    })

    // need to get the ID for the winner
    function getWinnerId() {
      if (thisMatchFromList.player1Name == match.winner) {
        return thisMatchFromList.player1Id
      } else {
        return thisMatchFromList.player2Id
      }
    }

    const updatedMatch = await handler.dispatch(async () => {
      const url = new URL(
        `v1/tournaments/${challongeUrl}/matches/${thisMatchFromList.matchId}.json`,
        environment.challongeHost)
      const response = await superagent.put(url)
        .query({
          api_key: environment.challongeApiKey
        })
        .send({
          match: {
            scores_csv: match.scores,
            // the match is complete when we set winner
            winner_id: getWinnerId()
          }
        })

      expect(response.status).toBe(200)

      return response.body
    })

    return updatedMatch
  }

  async function completeEvent(challongeUrl) {
    await handler.dispatch(async () => {
      const url = new URL(
        `v1/tournaments/${challongeUrl}/finalize.json`,
        environment.challongeHost)
      const response = await superagent.post(url)
        .query({
          api_key: environment.challongeApiKey
        })

      expect(response.status).toBe(200)
    })
  }

  async function getTournamentResult(tournamentId) {
    return await handler.dispatch(async () => {
      const url = new URL(
        `rest/v0/tournaments/${tournamentId}/result`,
        environment.apiHost)
      const response = await superagent.get(url)
        .query({
          api_key: environment.challongeApiKey
        })

      expect(response.status).toBe(200)

      return response.body
    })
  }

  beforeEach(async () => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
    await deleteChallongeTournament(preliminaryGroup1.challongeUrl)
  })

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  })

  it('run a tournament', async () => {
    const tournament = await addTournament(bikiniBottomOpen);
    const event = await addEvent(preliminaryGroup1, tournament.tournamentId)

    // verify that our event is in the tournament
    const eventsInTournament =
      await getEventListByTournamentId(tournament.tournamentId)
    expect(eventsInTournament.length).toBe(1)
    expect(eventsInTournament.map(e => e.eventId)).toContain(event.eventId)

    // event management is done on challonge.com, so we want to get event
    // information by challongeUrl
    // 
    // this makes sure that our event is linked to challonge.com
    const eventWithoutPlayers = await getEvent(event.challongeUrl)

    const eventOnChallongeWithoutPlayers = 
      await getEventOnChallonge(event.challongeUrl)

    // add some participants (done on challonge.com)
    const playerList = await addPlayerList([
      spongebob, patrick, squidward
    ], event.challongeUrl)

    const eventOnChallongeWithPlayers =
      await getEventOnChallonge(event.challongeUrl)

    await startEvent(event.challongeUrl)

    // on challonge, tournament state would be 'underway' after starting
    const eventOnChallongeStarted = 
      await getEventOnChallonge(event.challongeUrl)

    // once event starts, we can print some match sheets
    const matchList = await getEventMatchList(event.challongeUrl)

    expect(matchList.length).toBe(3)
    const simplifiedMatchListJustForVerification = matchList.map(
      m => Object.freeze({
        player1Seed: m.player1Seed,
        player2Seed: m.player2Seed,
        player1Name: m.player1Name,
        player2Name: m.player2Name,
    }))
    expect(simplifiedMatchListJustForVerification).toContain({
      player1Seed: 'A',
      player2Seed: 'B',
      player1Name: spongebob.name,
      player2Name: patrick.name,
    })
    expect(simplifiedMatchListJustForVerification).toContain({
      player1Seed: 'B',
      player2Seed: 'C',
      player1Name: patrick.name,
      player2Name: squidward.name,
    })
    expect(simplifiedMatchListJustForVerification).toContain({
      player1Seed: 'C',
      player2Seed: 'A',
      player1Name: squidward.name,
      player2Name: spongebob.name,
    })

    // start match (set underway_at)
    // do this on challonge.  not critical for now

    // players play and enter scores
    // when we can return the correct match ID from our own API,
    // we will not need challongeUrl anymore
    await submitMatchResult(spongbobVsPatrick, event.challongeUrl)
    await submitMatchResult(patrickVsSquidward, event.challongeUrl)
    await submitMatchResult(squidwardVsSpongebob, event.challongeUrl)

    // end match (remove underway_at)
    // do this on challonge.  not critical for now

    completeEvent(event.challongeUrl)

    // report scores
    const tournamentResult = await getTournamentResult(tournament.tournamentId)

    expect(tournamentResult.tournamentName).toBe(bikiniBottomOpen.name)
    expect(tournamentResult.tournamentResultList).toContain({
      winner: patrick.name,
      loser: squidward.name,
      eventName: preliminaryGroup1.name,
      resultString: '3 3 3',
    })
    expect(tournamentResult.tournamentResultList).toContain({
      winner: spongebob.name,
      loser: patrick.name,
      eventName: preliminaryGroup1.name,
      resultString: '3 5 1',
    })
    expect(tournamentResult.tournamentResultList).toContain({
      winner: spongebob.name,
      loser: squidward.name,
      eventName: preliminaryGroup1.name,
      resultString: '11 -5 9 9',
    })
  })
})
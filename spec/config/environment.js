const environment = {
  apiHost: process.env.UBIPONG_API_HOST,
  challongeHost: 'https://api.challonge.com',
  // if using jasmine explorer, set jasmineExplorer.env in settings.json
  // if using standard launch, set env to include api-key and set console to intergratedTerminal
  challongeApiKey: process.env.CHALLONGE_API_KEY,
}

module.exports = environment

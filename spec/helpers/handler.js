const handler = {
  // dispatch work for the agent
  // param: agentWork is a function that calls superagent
  dispatch: async function (agentWork) {
    try {
      return await agentWork()
    } catch (err) {
      if (err.response && err.response.text) {
        throw new Error(err.response.text)
      } else {
        throw err
      }
    }
  }
}

module.exports = handler
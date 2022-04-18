const jasmineReporters = require('jasmine-reporters')

const junitReporter = new jasmineReporters.JUnitXmlReporter({
  savePath: 'reports',
  consolidateAll: false
})

const terminalReporter = new jasmineReporters.TerminalReporter({
  verbosity: 3,
  color: true,
  showStack: true,
})
jasmine.getEnv().addReporter(junitReporter)
jasmine.getEnv().addReporter(terminalReporter)

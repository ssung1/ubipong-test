const jasmineReporters = require('jasmine-reporters')

const junitReporter = new jasmineReporters.JUnitXmlReporter({
    savePath: 'reports',
    consolidateAll: false
})
jasmine.getEnv().addReporter(junitReporter)

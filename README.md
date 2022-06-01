UbiPong Tester
==============

For the tests to work, the API service must be running.

Set environment `UBIPONG_API_HOST` to the API host.  Alternatively, edit
`spec/config/environment.js`.

Run

```
npm test
```

Reporting
---------

Settings are found in `spec/helpers/reports.js`.
For VS Code, `terminalReporter` is not needed.  Use a `jasmine runner` instead.

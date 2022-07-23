# Ubipong Tournament Manager API Tester

Part of <https://github.com/ssung1/ubipong-ecosystem>.

## Test

This test is for [Ubipong API](https://github.com/ssung1/ubipong-api),
so make sure it is running before testing.

Make sure the environment variables are set:

- `UBIPONG_API_HOST`: host of Ubipong API (usually localhost)
- `CHALLONGE_API_KEY`: API key on <https://challonge.com> (need to have
an account)

Alternatively, edit `spec/config/environment.js`.

Run

```
npm test
```

### Reporting

Settings are found in `spec/helpers/reports.js`.
For VS Code, `terminalReporter` is not needed.  Use a `jasmine runner` instead.

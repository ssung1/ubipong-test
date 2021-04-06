const roundRobinCellType = {
  get NAME() { return 10 },
  get EMPTY() { return 11 },
  get MATCH_COMPLETE() { return 12 },
  get MATCH_INCOMPLETE() { return 13 },
  get TEXT() { return 14 }
}

module.exports = roundRobinCellType
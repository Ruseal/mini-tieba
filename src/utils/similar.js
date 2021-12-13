export default (str1, str2, decimal) => {
  if (!str1 || !str2) {
    return 0
  }
  let l = str1.length > str2.length ? str1.length : str2.length
  let n = str1.length
  let m = str2.length
  let d = []
  decimal = decimal || 3
  let min = (a, b, c) => {
    return a < b ? (a < c ? a : c) : (b < c ? b : c)
  }
  let i, j, si, tj, cost
  if (n === 0) return m
  if (m === 0) return n
  for (i = 0; i <= n; i++) {
    d[i] = []
    d[i][0] = i
  }
  for (j = 0; j <= m; j++) {
    d[0][j] = j
  }
  for (i = 1; i <= n; i++) {
    si = str1.charAt(i - 1)
    for (j = 1; j <= m; j++) {
      tj = str2.charAt(j - 1)
      if (si === tj) {
        cost = 0
      } else {
        cost = 1
      }
      d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
    }
  }
  let res = (1 - d[n][m] / l)
  return res.toFixed(decimal)
}
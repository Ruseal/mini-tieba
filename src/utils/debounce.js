export default (func, dealy) => {
  let timer = null
  return () => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply()
    }, dealy)
  }
}

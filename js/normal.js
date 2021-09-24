/* 节流，控制执行的频率，N次触发，执行 N / delay 次 */
// 1. 时间戳
function throttleOne(fn, delay) {
  let prev = 0
  return function () {
    let now = Number(new Date()),
      space = now - prev
    if (space > delay) {
      fn.call(this, arguments)
      prev = now
    }
  }
}

// 2. 定时器
function throttleTwo(fn, delay) {
  let timer = null,
    lock = false
  return function () {
    if (lock) return

    lock = true

    timer = setTimeout(() => {
      fn.call(this, arguments)
      clearTimeout(timer)
      lock = false
    }, delay)
  }
}

/* 防抖，在用户停止触发后得 delay 后 执行，N次触发，只执行最后一次 */
function debounce(fn, delay) {
  let timer = null
  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.call(this, arguments)
    }, delay)
  }
}

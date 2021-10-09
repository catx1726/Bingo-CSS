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
  console.log('debounce!', delay)
  let timer = null
  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      console.log('debounce running fn!')
      fn.call(this, arguments)
    }, delay)
  }
}

const checkTypeEnum = {
    function: { index: 0, tag: '[object Function]' },
    number: { index: 1, tag: '[object Number]' },
    string: { index: 2, tag: '[object String]' },
    boolean: { index: 3, tag: '[object Boolean]' },
    object: { index: 4, tag: '[object Object]' }
  },
  checkTypes = [checkTypeEnum.function, checkTypeEnum.string]
function typeValidator(checkTypes, val) {
  let forInIndex = 0
  for (let key in checkTypeEnum) {
    forInIndex++
    if (checkTypeEnum[key].tag === checkTypes[forInIndex].tag) return checkTypes[forInIndex].tag
  }
}
typeValidator(checkTypes, 0)

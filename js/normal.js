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
    c_function: { index: 0, tag: '[object Function]' },
    c_number: { index: 1, tag: '[object Number]' },
    c_string: { index: 2, tag: '[object String]' },
    c_boolean: { index: 3, tag: '[object Boolean]' },
    c_array: { index: 4, tag: '[object Array]' },
    c_object: { index: 5, tag: '[object Object]' },
    c_null: { index: 6, tag: '[object Null]' },
    c_undefined: { index: 7, tag: '[object Undefined]' },
    c_NaN: { index: 8, tag: 'NaN' }
  },
  checkTypes = [checkTypeEnum.c_function, false, checkTypeEnum.c_string, checkTypeEnum.c_null, checkTypeEnum.c_number]
/**
 *
 * @description 根据你传入的允许类型 checkTypes 进行匹配，只要有一个满足就返回 true
 * @param {Array} checkTypes 允许通过的类型
 * @param {String} val 需要校验的值
 * @param {Boolean} checkTypesPramsValid 是否开启对 checkTypes 的校验
 * @returns {Object} { valid:boolean , msg:string }
 */
function typeValidator(checkTypes, val, checkTypesPramsValid) {
  /* 对 checkTypes 容器进行检查 */
  if (!checkTypes || Object.prototype.toString.call(checkTypes) !== checkTypeEnum.c_array.tag || !checkTypes.length)
    return { valid: false, msg: 'checkTypes 容器内容有误，请检查!' }

  let typsCheckInfo = handleCheckTypesValidator(checkTypes)
  /* 是否开启对 checkTypes 每项参数的校验 */
  if (checkTypesPramsValid && !typsCheckInfo.valid) return typsCheckInfo.msg

  /* 对特殊内容单独进行校验，如 NaN */
  if (Number.isNaN(val)) return { valid: true, msg: checkTypeEnum.c_NaN.tag }

  let curValType = Object.prototype.toString.call(val)
  for (let index = 0; index < checkTypes.length; index++) {
    if (!checkTypes[index].tag) continue
    let curType = checkTypes[index].tag
    if (curValType === curType) return { valid: true, msg: curType }
  }

  return { valid: false, msg: '未匹配到指定的类型!' }
}

function handleCheckTypesValidator(typesList) {
  let lock = false
  /* 校验 typesList 的所有参数 */
  for (let index = 0; index < typesList.length; index++) {
    let curType = typesList[index]
    for (const key in checkTypeEnum) {
      if (curType === checkTypeEnum[key]) {
        lock = false
        break
      }
      lock = true
    }
    if (lock) return { valid: false, msg: `checkTypes[${index}] 有误!` }
  }
  return { valid: true }
}

function handleValidtorRes(valid, msg, data) {
  return { valid, msg, data }
}

console.log(typeValidator(checkTypes, ';', true))

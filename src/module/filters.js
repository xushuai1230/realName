export const priceFilter = price => {
  let ret
  if (!price) {
    ret = 0
  } else {
    ret = price / 100
  }
  return ret.toFixed(2)
}
// 取整数位
export const priceFront = price => {
  let ret
  if (!price) {
    ret = 0
  } else {
    ret = String((price / 100).toFixed(2)).split('.')
  }
  return ret[0]
}

export const cashFilter = price => {
  let ret
  if (!price) {
    ret = 0
  } else {
    ret = price / 100
  }
  return ret.toFixed(0)
}

export const freeFilter = num => {
  let ret
  if (!num) {
    ret = 0
  } else {
    ret = num / 30
  }
  return ret.toFixed(0)
}

export const turnData = time => {
  // 时间戳转换 月、日格式
  if (time === undefined) return ''
  let cDate = new Date(time)
  return cDate.getMonth() + 1 + '月' + cDate.getDate() + '日'
}

export const timeFilter = times => {
  let time = new Date(times)
  let year = time.getFullYear()
  let month = time.getMonth() + 1
  let date = time.getDate()
  let hour = time.getHours()
  let minute = time.getMinutes()
  let second = time.getSeconds() // 秒 根据具体情况调用
  month = month < 10 ? '0' + month : month
  date = date < 10 ? '0' + date : date
  hour = hour < 10 ? '0' + hour : hour
  minute = minute < 10 ? '0' + minute : minute
  second = second < 10 ? '0' + second : second // 秒 根据具体情况调用
  return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
}
export const priceFilters = (val) => {
  val = val / 100
  return val.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}

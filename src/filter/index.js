import Vue from 'vue'
/**
 * 全局使用过滤器
 *
 */

//  主订单
let OStatusEnum = {
  '0': '等待付款',
  '21': '已取消',
  '22': '已取消',
  '94': '审核中',
  '95': '审核中',
  '96': '审核中',
  '91': '审核未通过',
  '40': '审核通过,待绑卡',
  '86': '审核通过,待付首付',
  '41': '备货中',
  '51': '已发货',
  '61': '交易成功',
  '102': '交易取消'
}

// 情侣卡 订单
let LovetatusEnum = {
  '0': '等待付款',
  '21': '已取消',
  '22': '已取消',
  '94': '订单确认中',
  '95': '订单确认中',
  '96': '订单确认中',
  '91': '审核未通过',
  '40': '待绑卡',
  '86': '待付首付',
  '41': '备货中',
  '51': '已发货',
  '61': '交易成功',
  '102': '交易取消'
}

// 颜值卡 订单
let facetatusEnum = {
  '0': '等待付款',
  '21': '已取消',
  '22': '已取消',
  '94': '处理中',
  '95': '处理中',
  '96': '处理中',
  '91': '审核未通过',
  '40': '待绑卡',
  '86': '待付首付',
  '41': '备货中',
  '51': '已发货',
  '61': '交易成功',
  '102': '交易取消'
}

// 子订单
let OItemStatusEnum = {
  '0': '待发货',
  '2': '取消',
  '4': '备货中',
  '5': '待收货',
  '6': '已完成',
  '7': '已收货',
  '8': '退货中',
  '9': '退货完成',
  '10': '审核不通过',
  '12': '删除',
  '102': '交易取消'
}

// 砍价
let bargainStatusEnum = {
  '1': ' 砍价进行中',
  // '2':'砍价成功，备货中',
  // '51':'砍价成功，已发货',
  // '61':'砍价成功，已确认收货',
  '3': '砍价成功',
  '4': '砍价失败！'
}

const globalFilters = {
  // 时间转换
  timeFilter (time) {
    const orderDate = new Date(time)
    const yyyy = orderDate.getFullYear()
    const MM = (orderDate.getMonth() + 1) < 10 ? '0' + (orderDate.getMonth() + 1) : (orderDate.getMonth() + 1)
    const dd = orderDate.getDate() < 10 ? '0' + orderDate.getDate() : orderDate.getDate()
    const HH = orderDate.getHours() < 10 ? '0' + orderDate.getHours() : orderDate.getHours()
    const mm = orderDate.getMinutes() < 10 ? '0' + orderDate.getMinutes() : orderDate.getMinutes()
    return yyyy + '-' + MM + '-' + dd + ' ' + HH + ':' + mm
  },
  // 日期转换
  dateFilter (time) {
    const orderDate = new Date(time)
    const yyyy = orderDate.getFullYear()
    const MM = (orderDate.getMonth() + 1) < 10 ? '0' + (orderDate.getMonth() + 1) : (orderDate.getMonth() + 1)
    const dd = orderDate.getDate() < 10 ? '0' + orderDate.getDate() : orderDate.getDate()
    return yyyy + '年' + MM + '月' + dd + '日'
  },
  // 主订单状态转化
  orderStatusFilter (val, loveCardOrder, lookingCardOrder) {
    if (typeof val === 'undefined') {
      return ''
    }
    if (filterLoveAndFacesOrder(val, loveCardOrder, lookingCardOrder)) { // 如果用颜值卡和情侣卡下单且是 94 95 96订单转态返回订单确认中
      return '订单确认中'
    }
    return OStatusEnum[val.toString()]
  },
  // 颜值卡 订单
  faceStatusFilter (val) {
    if (typeof val === 'undefined') {
      return ''
    }
    return facetatusEnum[val.toString()]
  },
  // 情侣卡 订单 审核中 表示为备货中
  loveStatusFilter (val) {
    if (typeof val === 'undefined') {
      return ''
    }
    return LovetatusEnum[val.toString()]
  },
  // 对于所有的审核未通过，增加描述
  noPassOrder (val) {
    if (val === '审核未通过') {
      return '审核未通过(由于您近期综合信用评估不足，审核未通过)'
    } else {
      return val
    }
  },
  // 砍价
  barGainStatusFilter (val, orderStatus) {
    if (typeof val === 'undefined') {
      return ''
    }
    if (val === 3) {
      if (orderStatus === 41) {
        return '砍价成功，备货中'
      } else if (orderStatus === 0) {
        return '砍价成功，等待付款'
      } else if (orderStatus === 51) {
        return '砍价成功，已发货'
      } else if (orderStatus === 61) {
        return '砍价成功，已确认收货'
      }
    } else if (val === 2) {
      if (orderStatus === 0) {
        return '砍价成功，等待付款'
      } else if (orderStatus === 41) {
        return '砍价成功，备货中'
      } else if (orderStatus === 51) {
        return '砍价成功，已发货'
      } else if (orderStatus === 61) {
        return '砍价成功，已确认收货'
      } else if (orderStatus === 22 || orderStatus === 21) {
        return '已取消'
      }
    }
    return bargainStatusEnum[val.toString()]
  },
  // 去掉审核通过
  loveNoCheckFilter (val) {
    return val.replace('审核通过,', '')
  },
  // 子订单状态转化
  orderItemStatusFilter (val) {
    if (!val) return
    return OItemStatusEnum[val.toString()]
  },
  // 分转千分位元
  priceFilter (val) {
    val = val / 100
    return val.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
  },
  // sku转换
  skuPropsFilter (arr) {
    if (!arr) return
    let result = ''
    arr.forEach(function (item, index, array) {
      result += item.pname + ':'
      result += item.pvalue + '; '
    })
    return result.slice(0, result.length - 2)
  },
  // 超过99显示99+
  limitCntFilter (val) {
    return val <= 99 ? val : '99+'
  }
}

for (let key in globalFilters) {
  Vue.filter(key, globalFilters[key])
}

Vue.filter('toDecimal2', function (num) {
  // debugger
  var numStr = num + ''
  var dian = numStr.indexOf('.')
  var result = ''
  if (dian === -1) {
    result = Number(num).toFixed(2)
  } else {
    var cc = numStr.substring(dian + 1, numStr.length)
    if (cc.length > 2) {
      num += 0.01
      num = num * 100000000000 / 100000000000
      num += ''
      num = num.substring(0, num.indexOf('.') + 3)
    } else if (cc.length === 2) {
      num += ''
    } else {
      num += '0'
    }
    result = num
  }
  return result
})

// 返回日期 11-05
Vue.filter('toMD', function (date) {
  return String(date).substr(5, 5)
})

// 返回时间  06:55
Vue.filter('toTime', function (date) {
  return String(date).substr(11, 5)
})

// 火车票 周一到周日
Vue.filter('toDay', function (date) {
  let ndate = String(date).substr(0, 10).replace(/-/g, '')
  let year = ndate.substr(0, 4)
  let month, day
  if (ndate.length === 8) {
    month = ndate.substr(4, 2)
    day = ndate.substr(6, 2)
  } else if (ndate.length === 7) {
    month = ndate.substr(4, 1)
    day = ndate.substr(5, 2)
  }
  let ms = new Date(year + '/' + month + '/' + day).getTime()
  let time = new Date(ms).getDay()
  let relDay = ''
  switch (time) {
    case 0:
      relDay = '周日'
      break
    case 1:
      relDay = '周一'
      break
    case 2:
      relDay = '周二'
      break
    case 3:
      relDay = '周三'
      break
    case 4:
      relDay = '周四'
      break
    case 5:
      relDay = '周五'
      break
    case 6:
      relDay = '周六'
      break
  }
  return relDay
})

// 倒计时
Vue.filter('addTime0', function (date) {
  let d = date + ''
  if (d.length === 1) {
    return '0' + d
  } else {
    return d
  }
})

// 身份证 显示
Vue.filter('resetId', function (data) {
  // let id = data + ''
  let area = data.substr(0, 6)
  let num = data.substr(14, 4)
  return area + '********' + num
})

Vue.filter('skuElemeFilter', function (data) {
  let retStr = ''
  if (data instanceof Array) {
    data.forEach(item => {
      retStr += item + ' '
    })
  }
  return retStr
})

let filterLoveAndFacesOrder = (status, loveCardOrder, lookingCardOrder) => {
  if (loveCardOrder && (status === 94 || status === 95 || status === 96)) {
    return true
  } else if (lookingCardOrder && (status === 94 || status === 95 || status === 96)) {
    return true
  } else {
    return false
  }
}
// 汽车票火车票 订单状态 独占转化 订单列表
Vue.filter('carTrainStatus', function (status, instalment, loveCardOrder, lookingCardOrder) {
  if (filterLoveAndFacesOrder(status, loveCardOrder, lookingCardOrder)) { // 如果用颜值卡和情侣卡下单且是 94 95 96订单转态返回订单确认中
    return '订单确认中'
  }
  if (instalment && status === 41) {
    return '审核通过,出票中'
  } else if (!instalment && status === 41) {
    return '出票中'
  }
  switch (status) {
    case 0:
      return '等待付款'
    case 94:
    case 95:
    case 96:
      return '审核中'
    case 91:
      return '审核未通过'
    case 40:
      return '审核通过,待绑卡'
    case 61:
      return '已出票'
    case 21:
    case 22:
      return '已取消'
    case 102:
      return '交易取消'
  }
})

Vue.filter('trainTicktStatus', function (data) {
  switch (data) {
    case 'O':
      return '退票失败'
    case 'C':
      return '退票中'
    case 'T':
      return '退票成功'
    case 'N':
      return '出票失败'
    case 'R':
      return '退款中'
  }
})

// 列表页 酒店 状态描述
Vue.filter('autoHotelStatus', function (status, loveCardOrder, lookingCardOrder) {
  if (filterLoveAndFacesOrder(status, loveCardOrder, lookingCardOrder)) { // 如果用颜值卡和情侣卡下单且是 94 95 96订单转态返回订单确认中
    return '订单确认中'
  }
  switch (status) {
    case 0:
      return '等待付款'
    case 95:
    case 96:
    case 94:
      return '审核中'
    case 91:
      return '审核未通过'
    case 40:
      return '审核通过,待绑卡'
    case 41:
      return '审核通过,预订中'
    case 61:
      return '预订成功'
    case 22:
    case 21:
      return '订单取消'
    case 102:
      return '交易取消'
    case 93:
      return '已完成删除'
  }
})
Vue.filter('accuracyMinute', function (dateStr) {
  if (dateStr) {
    const inx = dateStr.lastIndexOf(':')
    return dateStr.slice(0, inx)
  }
  return dateStr
})
// 列表 酒店时间转换 2017/1/1 ==> 2017-01-01
Vue.filter('autoHotelTime', function (date) {
  let t = date.split('/')
  let m = +t[1]
  let d = +t[2]
  if (m <= 9) m = '0' + m
  if (d <= 9) d = '0' + d
  return t[0] + '-' + m + '-' + d
})

Vue.filter('localTime', function (date) {
  let dateObj = new Date(date)
  return dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString()
})

Vue.filter('Fen2Yuan', function (num) {
  num = +num
  if (typeof num !== 'number' || isNaN(num)) return null
  return (num / 100).toFixed(2)
})
Vue.filter('Fen2Yuan0', function (num) {
  num = +num
  if (typeof num !== 'number' || isNaN(num)) return null
  return (num / 100).toFixed(0)
})

Vue.filter('filterPinker', function (status) {
  // console.log(status);
  const arr = status.split('|')
  const orderStatus = arr[0]
  const pinkStatus = arr[1]
  if (orderStatus === '21' || orderStatus === '22') {
    return '已取消'
  } else if (orderStatus === '102') {
    return '交易取消'
  }
  if (pinkStatus === '3') {
    return '未支付'
  } else if (pinkStatus === '1') {
    return '拼团中，等待好友参团'
  } else if (pinkStatus === '2') {
    if (orderStatus === '41') {
      return '拼团成功，备货中'
    } else if (orderStatus === '51') {
      return '拼团成功，已发货'
    } else if (orderStatus === '61') {
      return '拼团成功，已收货'
    }
  } else if (pinkStatus === '-1') {
    return '拼团失败'
  } else {
    return '未知状态'
  }
})
Vue.filter('filterZeroPinker', function (status) {
  status = Number(status)
  let ret
  switch (status) {
    case 0:
      ret = '助力进行中'
      break
    case 22:
      ret = '助力失败'
      break
    case 41:
      ret = '助力成功,备货中'
      break
    case 51:
      ret = '助力成功,已发货'
      break
    case 61:
      ret = '助力成功,已收货'
      break
    case 101:
      ret = '助力成功,实名领取'
      break
  }
  return ret
})

// 3C回收
Vue.filter('recoveryFilter', function (status, loveCardOrder, lookingCardOrder) {
  status = Number(status)
  if (filterLoveAndFacesOrder(status, loveCardOrder, lookingCardOrder)) { // 如果用颜值卡和情侣卡下单且是 94 95 96订单转态返回订单确认中
    return '订单确认中'
  }
  let ret
  switch (status) {
    case 0:
      ret = '等待付款'
      break
    case 21:
    case 22:
      ret = '已取消'
      break
    case 41:
      ret = '商品寄售中'
      break
    case 61:
      ret = '回收成功'
      break
    case 40:
      ret = '审核通过,待绑卡'
      break
    case 94:
    case 95:
    case 96:
      ret = '快速审核中'
      break
    case 91:
      ret = '审核未通过'
      break
  }
  return ret
})
Vue.filter('digitalRecycleOrderStatusFilter', (status, loveCardOrder, lookingCardOrder) => {
  if (filterLoveAndFacesOrder(status, loveCardOrder, lookingCardOrder)) { // 如果用颜值卡和情侣卡下单且是 94 95 96订单转态返回订单确认中
    return '订单确认中'
  }
  let ret
  switch (status) {
    case 0:
      ret = '等待付款'
      break
    case 94:
    case 95:
    case 96:
      ret = '正在为您快速审核...'
      break
    case 2:
      ret = '已取消'
      break
    case 91:
      ret = '审核未通过'
      break

    case 21:
    case 22:
      ret = '已取消'
      break

    case 41:
      ret = '商品寄售中'
      break

    case 40:
      ret = '审核通过,待绑卡'
      break

    case 61:
      ret = '回收成功'
      break
  }
  return ret
})
export let priceFilter = (val) => {
  console.log('8888')
  val = val / 100
  return val.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}

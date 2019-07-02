/**
 * 对某个对象进行排序
 * @param {Object} object 基本对象
 *
 */
function sortObjectKey (object) {
  let sortkeys = Object.keys(object).sort()
  let retObj = {}
  sortkeys.forEach(item => {
    retObj[item] = object[item]
  })
  return retObj
}

/**
 * 求下一个月第一天
 * @param {Date|String} date 日期
 * @param {Date|String} date 日期
 */
function nextMonth (date) {
  let nowDate, next
  if (date instanceof Date) {
    nowDate = date
  } else {
    nowDate = new Date(date)
  }
  let nowYear = nowDate.getFullYear()
  let nowMonth = nowDate.getMonth()
  if (nowDate.getMonth === 11) {
    // 月底， 选择下明年
    next = new Date(nowYear + 1, 1, 1)
  } else {
    next = new Date(nowYear, nowMonth + 1, 1)
  }
  return next
}
/**
 * 让滚动条回滚到顶部
 */
export function scrollTop () {
  document.body.scrollTop = 0
}
/**
 * 将一个日期分解为年，月，日
 * @param {Date|String} date 日期
 *
 */
function resolveDate (date) {
  if (typeof date === 'string') date = parseInt(date)
  if (typeof date === 'number') date = new Date(date)
  if (date instanceof Date) {
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      date: date.getDate()
    }
  } else {
    return null
  }
}

/**
 * 返回 2017-08-18 的日期格式
 * @param {Object} dateObj  分解后的日期格式
 */
function dateFormatBar (dateObj) {
  dateObj = resolveDate(dateObj)
  // debugger
  let month = dateObj.month + 1
  let date = dateObj.date
  if (month < 10) month = '0' + month
  if (date < 10) date = '0' + date
  return dateObj.year + '-' + month + '-' + date
}

/**
 * 返回 20170818 的日期格式
 * @param {Object} dateObj  分解后的日期格式
 */
function dateFormatMMdd (dateObj) {
  dateObj = resolveDate(dateObj)
  // debugger
  let month = dateObj.month + 1
  let date = dateObj.date
  if (month < 10) month = '0' + month
  if (date < 10) date = '0' + date
  return dateObj.year + '' + month + '' + date
}
// App右上角图标2x,3x图判断
function checktellCancelRight (imgName) {
  // 获取适口大小
  let phoneviewport = window.devicePixelRatio

  let iconurl = {
    urlLowversion:
      'https://cdn.xiaoxiangyoupin.com/image/' + imgName + '@2x.png',
    url2x: 'https://cdn.xiaoxiangyoupin.com/image/' + imgName + '@2x.png',
    url3x: 'https://cdn.xiaoxiangyoupin.com/image/' + imgName + '@3x.png'
  }
  // 获取app版本号
  let ua = navigator.userAgent
  let reg = /instalment\/([\d]+)\.([\d]+)\.([\d]+)/
  let rets = ua.match(reg)
  if (!rets) {
    return iconurl.urlLowversion
  }
  let ret1 = Number(rets[1])
  let ret2 = Number(rets[2])
  let ret3 = Number(rets[3])
  if (
    ret1 < 3 ||
    (ret1 === 3 && ret2 < 5) ||
    (ret1 === 3 && ret2 === 5 && ret3 < 8)
  ) {
    return iconurl.urlLowversion
  } else {
    if (phoneviewport >= 3) {
      return iconurl.url3x
    } else if (phoneviewport >= 2) {
      return iconurl.url2x
    } else if (phoneviewport < 2) {
      return iconurl.urlLowversion
    }
  }
}
// 移动端滚动穿透问题解决方案
const ModalHelper = (function (bodyCls) {
  var scrollTop
  return {
    afterOpen: function () {
      scrollTop = (document.scrollingElement && document.scrollingElement.scrollTop) || 0
      document.body.classList.add(bodyCls)
      document.body.style.top = -scrollTop + 'px'
    },
    beforeClose: function () {
      document.body.classList.remove(bodyCls)
      if (document.scrollingElement) document.scrollingElement.scrollTop = scrollTop
    }
  }
})('modal-open')

function assert (condition, msg) {
  if (!condition) throw new Error(`[Apior] ${msg}`)
}

function forceJump () {
  let url = location.href
  let targetUrl
  if (url.indexOf('?') !== -1) {
    targetUrl = url.slice(0, url.indexOf('?'))
  } else {
    targetUrl = url
  }
  let transferPage = `https://cdn.basestonedata.com/app/wxauth/index.html?redirect_uri=${encodeURIComponent(targetUrl)}` // 中间页面
  let sharePage = `https://${process.env.VUE_APP_SERVEN.toLocaleLowerCase()}.xiaoxiangyoupin.com/v2/redirect?url=${encodeURIComponent(transferPage)}`
  location.href = sharePage
}

function getScrollTop () {
  let scrollTop = 0
  if (document.documentElement && document.documentElement.scrollTop) {
    scrollTop = document.documentElement.scrollTop
  } else if (document.body) {
    scrollTop = document.body.scrollTop
  }
  return scrollTop
}

/**
 * @param {array} versionArr
 * [3,6,7]
 */
function getAppVersion (versionArr) {
  // 获取app版本号
  let ua = navigator.userAgent
  let reg = /instalment\/([\d]+)\.([\d]+)\.([\d]+)/
  let rets = ua.match(reg)
  if (!rets) {
    return false
  }
  let arr0 = +versionArr[0]
  let arr1 = +versionArr[1]
  let arr2 = +versionArr[2]
  let ret1 = Number(rets[1])
  let ret2 = Number(rets[2])
  let ret3 = Number(rets[3])
  if (ret1 < arr0 || (ret1 === arr0 && ret2 < arr1) || (ret1 === arr0 && ret2 === arr1 && ret3 < arr2)) {
    return false
  } else {
    return true
  }
}

/**
 * 获取参数
 * @param name
 * @returns {null}
 */
export function getQueryString (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = window.location.search.substr(1).match(reg)
  if (r !== null) return unescape(r[2])
  return null
}
/**
 * 判断是否非空数组
 * @param {*} arr
 */
export function noEmptyArr (arr) {
  return !!(arr instanceof Array && arr.length > 0)
}
// 订单分类筛选
let orderScreen = (orderList, itemId) => {
  let getstatus = state => {
    let orderstatus = orderList.filter(v => {
      for (let i = 0; i < state.length; i++) {
        return v.orderStatus === state[i]
      }
    })
    return orderstatus
  }
  let type = itemId
  switch (type) {
    case 1:
      return getstatus([0])
    case 2:
      return getstatus([41, 40, 86])
    case 3:
      return getstatus([51])
    default:
      //  '全部'
      break
  }
}

/**
 * 检测用户APP的版本是否在3.5.2(包括)以上
 *
 */
export function checktellCancel () {
  let ua = navigator.userAgent
  let reg = /instalment\/(\d+)\.(\d+)\.(\d+)/
  let rets = ua.match(reg)
  if (rets) {
    let rev1 = Number(rets[1])
    let rev2 = Number(rets[2])
    let rev3 = Number(rets[3])
    if (rev1 > 3) { // 主版本号大于3
      return true
    } else if (rev1 === 3 && rev2 > 5) { // 主版本号等于3且次版本号大于5 都可以
      return true
    } else if (rev1 === 3 && rev2 === 5 && rev3 >= 2) { // 修订版本号大于等于2 也ok
      return true
    }
  }
  return false
}
export {
  getScrollTop,
  sortObjectKey,
  nextMonth,
  dateFormatBar,
  dateFormatMMdd,
  checktellCancelRight,
  ModalHelper,
  assert,
  forceJump,
  getAppVersion,
  orderScreen
}

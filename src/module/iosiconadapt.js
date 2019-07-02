function checktellCancel () {
  // 获取适口大小
  let phoneviewport = window.devicePixelRatio

  let iconurl = {
    urlLowversion: 'https://cdn.xiaoxiangyoupin.com/image/nav_icon_order_kind@2x.png',
    url2x: 'https://cdn.xiaoxiangyoupin.com/image/nav_icon_order_kind@2x.png',
    url3x: 'https://cdn.xiaoxiangyoupin.com/image/nav_icon_order_kind@3x.png'
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
  if (ret1 < 3 || (ret1 === 3 && ret2 < 5) || (ret1 === 3 && ret2 === 5 && ret3 < 8)) {
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

export {
  checktellCancel
}

export default function initLinkme (config) {
  // 环境配置
  let currHref = location.href
  let env = currHref.indexOf('h5-dev') !== -1 ? 'dev' : 'prod'
  if (env === 'prod') {
    config.type = 'live'
  } else {
    config.type = 'test'
  }
  let linkedme = window.linkedme
  if (linkedme) {
    linkedme.init('69910da011e66261cd3aa2c27f5b9688', config, function (err, response) {
      if (err) {
        window.linkErr = err
      }
    })
  } else {
    window.linkErr = 'notfind'
  }
}

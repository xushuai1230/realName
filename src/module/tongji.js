/**
 * 数据统计
 *
 */

export default function tongji (prefix, listenType) {
  let env
  if (location.href.indexOf('prod') !== -1) {
    env = 'prod'
  } else {
    env = 'dev'
  }
  try {
    console.log('prefix: ', prefix)
    console.log('env: ', env)
    console.log('tongji: ', listenType)
    _czc.push(['_trackEvent', prefix + '_' + env + '_', listenType])
  } catch (error) {
    console.log(error.message)
  }
}

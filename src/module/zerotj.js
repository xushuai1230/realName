/**
 * 数据统计
 *
 */

export default function zerotj (listenType) {
  let env
  if (location.href.indexOf('prod') !== -1) {
    env = 'prod'
  } else {
    env = 'dev'
  }
  try {
    console.log('tongji: ', listenType)
    _czc.push(['_trackEvent', 'zero_' + env + '_', listenType])
  } catch (error) {
    console.log(error.message)
  }
}

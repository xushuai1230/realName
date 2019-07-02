import MTAH5 from 'mta-h5-analysis'
export default function tongji (eventID, data) {
  try {
    console.log('事件数据：', eventID, data)
    MTAH5.clickStat(eventID, data)
  } catch (error) {
    console.log('统计错误: ', error)
  }
}

/**
 * 初始化Mta统计
 *
 */
export function initMta () {
  let sid, cid
  if (process.env.VUE_APP_SERVEN === 'DEV') {
    sid = '500662772'
    cid = '500662773'
  } else {
    sid = '500662768'
    cid = '500662774'
  }
  MTAH5.init({
    sid, // 必填，统计用的appid
    cid, // 如果开启自定义事件，此项目为必填，否则不填
    autoReport: 1, // 是否开启自动上报(1:init完成则上报一次,0:使用pgv方法才上报)
    senseHash: 0, // hash锚点是否进入url统计
    senseQuery: 0, // url参数是否进入url统计
    'performanceMonitor': 1 // 是否开启性能监控
  })
  MTAH5.pgv()
}

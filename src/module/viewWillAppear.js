import { wbBridgeSetup } from './appbridge.js'
// 回调函数列表
let callBackLists = []

// webview页面被重新调用
wbBridgeSetup('viewWillAppear', (data, callback) => {
  callBackLists.map(item => {
    item.fn(data)
  })
  callBackLists = []
  if (callback) {
    callback()
  }
})

// 将回调插入回调函数列表中，等待viewWillAppear事件发生，调用回调函数
export function pushCall (call) {
  for (let [index, item] of callBackLists.entries()) {
    if (item.key === call.key) {
      console.log('回调重复，删除已有回调: ', call.key)
      callBackLists.splice(index, 1, call)
      return
    }
  }
  console.log('新回调插入 ', call.key)
  callBackLists.push(call)
}

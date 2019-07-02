import layer from './layer/layer.js'
/**
 * alert
 * @param {String} content 输出内容
 */
export default function (content) {
  layer.open({
    content,
    className: 'fix-layer'
  })
}

/**
 * confirm
 * @param {String} content 输出内容
 */
export function confirm (content) {
  return new Promise(function (resolve, reject) {
    layer.open({
      content,
      className: 'fix-layer',
      btn: ['确定', '取消'],
      yes: function (index) {
        layer.close(index)
        resolve()
      }
    })
  })
}

/**
 * confirm
 * @param {String} content 输出内容
 * @param {Array} btns 按钮内容
 * @param {int} order 按钮顺序 确定在右边 1 确定在左边 -1
 */
export function confirmdy (content, btns = ['确定', '取消'], order = 1, fixName = 'fix-layer') {
  return new Promise(function (resolve, reject) {
    layer.open({
      content,
      className: fixName,
      btn: btns,
      yes: function (index) {
        layer.close(index)
        resolve(true)
      },
      no: function (index) {
        layer.close(index)
        resolve(false)
      }
    })
  })
}

/**
 * confirm
 * @param {String} content 输出内容
 * @param {Array} btns 按钮内容
 * @param {int} order 按钮顺序 确定在右边 1 确定在左边 -1
 */
export function btnModal (content, fixName = 'fix-dom-layer') {
  return new Promise(function (resolve, reject) {
    layer.open({
      content,
      className: fixName,
      btn: '我知道了',
      yes: function (index) {
        layer.close(index)
        resolve(true)
      }
    })
  })
}

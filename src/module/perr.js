import layer from './layer/layer.js'

/**
 * 请求错误处理
 * @param {Object} err 错误对象
 */
function reqError(err) { // eslint-disable-line
  layer.open({
    content: '请求错误',
    skin: 'msg',
    time: 2
  })
}

/**
 * 业务错误, 请求错误 此时post请求是成功的
 * @param {*String} err  错误原因短语
 *
 */
function businessError (err) {
  layer.open({
    content: err,
    skin: 'msg',
    time: 2
  })
}

export {
  reqError,
  businessError
}

export default [
  {
    name: 'getOrderDetail',
    method: 'GET',
    desc: '获取订单详情',
    path: 'v2/order/query/:code.json',
    mockPath: '',
    params: {
      token: '',
      code: ''
    }
  },
  {
    name: 'getOrderList',
    method: 'POST',
    desc: '获取订单列表',
    path: 'v2/order/queryOrderList.json',
    mockPath: '',
    params: {
      token: '',
      startNum: '',
      status: '',
      type: '',
      orderCode: '',
      orderSource: 8
    }
  },
  {
    name: 'orderDelete',
    method: 'POST',
    desc: '获取订单列表',
    path: 'v2/order/delete/:code.json',
    mockPath: '',
    params: {
      token: '',
      code: ''
    }
  },
  {
    name: 'confirm',
    method: 'GET',
    desc: '确认收货',
    path: 'v2/order/confirm/:code.json',
    mockPath: '',
    params: {
      code: ''
    }
  },
  {
    name: 'cancel',
    method: 'GET',
    desc: '取消订单',
    path: 'v2/order/cancel/:code.json',
    mockPath: '',
    params: {
      code: '',
      token: '',
      reason: ''
    }
  },
  {
    name: 'getReas',
    method: 'GET',
    desc: '获取取消原因',
    path: 'v2/config/getSystemParam.json?paramName=ORDER_CANCEL_REASON',
    mockPath: '',
    params: {}
  },
  {
    name: 'isSuppJobinfo',
    method: 'POST',
    desc: '是否需要补偿信息',
    path: 'v2/authorize/isSuppJobinfo.json',
    mockPath: '',
    params: {
      token: '',
      reqType: 2
    }
  },
  {
    name: 'queryOrderListByOrderCode',
    method: 'POST',
    desc: '查询订单是否被删除',
    path: '/v2/order/queryOrderListByOrderCode.json',
    mockPath: '',
    params: {
      token: '',
      orderCode: ''
    }
  },
  {
    name: 'getLogisticsGold',
    method: 'GET',
    desc: '物流',
    path: '/v2/logistics/getLogisticsGold.json',
    mockPath: '',
    params: {
      orderItemCode: ''
    }
  }
]

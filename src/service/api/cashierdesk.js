export default [
  {
    name: 'calDownpayAmount',
    method: 'POST',
    desc: '小象组合付首付金额接口',
    path: 'v2/assets/downpay/calDownpayAmount.json',
    mockPath: '',
    params: {
      token: '',
      amount: '',
      cardCode: ''
    }
  },
  {
    name: 'queryOrderAmountInfo',
    method: 'GET',
    desc: '小象收银台',
    path: 'v2/order/queryOrderAmountInfo/:orderCode.json',
    mockPath: '',
    params: {
      orderCode: '',
      token: ''
    }
  },
  {
    name: 'submitPeriodsNoReviewMerge',
    method: 'POST',
    desc: '合并支付申请分期接口',
    path: 'v2/assetsNoReview/submitPeriodsNoReviewMerge.json',
    mockPath: '',
    params: {
      token: '',
      batchOrderCode: '',
      payPwd: '',
      payMethod: '',
      periods: '',
      realOrders: []
    }
  },
  {
    name: 'submit_periods_noreview',
    method: 'POST',
    desc: '卡类申请分期接口',
    path: 'v2/assetsNoReview/submit_periods_noreview.json',
    mockPath: '',
    params: {
      token: '',
      orderCode: '',
      payPwd: '',
      couponCode: '',
      periods: '',
      downPayment: '',
      payMethod: ''
    }
  },
  {
    name: 'scheme',
    method: 'GET',
    desc: '四种分期价格详细',
    path: 'v2/assets/installment/scheme.json',
    mockPath: '',
    params: {
      token: '',
      orderCode: '',
      amount: ''
    }
  },
  {
    name: 'batchCheck',
    method: 'POST',
    desc: '苏宁收货地价格发生变动通知批量查询',
    path: 'v2/order/ahead/price/batchCheck.json',
    mockPath: '',
    params: {
      skuIds: null,
      deliverAddressId: ''
    }
  },
  {
    name: 'getAvailableCoupons',
    method: 'POST',
    desc: '获取可用优惠券',
    path: 'v2/coupon/getAvailableCoupons.json',
    mockPath: '',
    params: {
      type: '',
      token: ''
    }
  }
]

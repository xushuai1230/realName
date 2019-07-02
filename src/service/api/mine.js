export default [
  {
    name: 'setPayPassword',
    method: 'POST',
    desc: '设置支付密码',
    path: '/v2/user/setPayPassword.json',
    mockPath: '',
    params: {
      token: '',
      payPassword: ''
    }
  },
  {
    name: 'checkVerCode',
    method: 'POST',
    desc: '验证验证码',
    path: '/v2/sms/checkVerCode.json',
    mockPath: '',
    params: {
      mobile: '',
      verCode: ''
    }
  },
  {
    name: 'changePassword',
    method: 'POST',
    desc: '修改支付密码',
    path: '/v2/user/changePassword.json',
    mockPath: '',
    params: {
      mobile: '',
      verCode: '',
      newPass: '',
      type: '2' // 1 登录密码   2   支付密码
    }
  },
  {
    name: 'getCode',
    method: 'GET',
    desc: '获取短信验证码',
    path: '/v2/sms/getLoginSmsCode.json',
    mockPath: '',
    params: {
      mobile: '',
      authCodeName: '', // 图片验证码
      type: '' // 0 短信验证码  1 语音验证码
    }
  },
  {
    name: 'getDeductByUserId',
    method: 'POST',
    desc: '查询抵扣金',
    path: 'v2/flowers/getDeductByUserId.json',
    mockPath: '',
    params: {
      token: ''
    }
  },
  {
    name: 'getDeductDetails',
    method: 'POST',
    desc: '抵扣金详情',
    path: 'v2/flowers/getDeductDetails.json',
    mockPath: '',
    params: {
      token: ''
    }
  },
  {
    name: 'getBannersByType',
    method: 'Get',
    desc: '抵扣金页面活动页面',
    path: 'v2/good/getBannersByType.json',
    mockPath: '',
    params: {
      type: ''
    }
  },
  {
    name: 'getUserInfo',
    method: 'GET',
    desc: '获取用户信息',
    path: '/v2/user/getUserInfo.json',
    mockPath: '',
    params: {
      token: ''
    }
  },
  {
    name: 'getAllCouponsV2',
    method: 'POST',
    desc: '获取优惠券列表',
    path: 'v2/coupon/getAllCouponsV2.json',
    mockPath: '',
    params: {
      token: '',
      queryType: 1 // 1 未使用 2 已使用 3 已过期
    }
  },
  {
    name: 'getOrderInfo',
    method: 'POST',
    desc: '查询红点点',
    path: 'v2/weibo/myPageInfo.json',
    mockPath: '',
    params: {
      token: '',
      unpaidOrderCount: '', // 待支付订单数，用于比对是否发生变化
      preparedOrderCount: '', // 待发货订单数，用于比对是否发生变化
      deliveredOrderCount: '', // 待收货订单数，用于比对是否发生变化
      couponPreview: '', // 优惠券预览文字，用于比对是否发生变化
      billCount: '', // 账单数，用于比对是否发生变化
      billType: '' // 账单类型，用于比对是否发生变化 1：待还；2：逾期；
    }
  }
]

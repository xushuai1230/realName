export default [
  {
    name: 'cancel',
    method: 'POST',
    desc: '取消订单',
    path: '/v2/order/cancel/:code.json',
    mockPath: '',
    params: {
      token: '',
      code: ''
    }
  },
  {
    name: 'getUserAuthStatus',
    method: 'POST',
    desc: '用户状态查询接口',
    path: '/v2/paicai/getUserAuthStatus.json',
    mockPath: '',
    params: {
      token: '',
      orderCode: ''
    }
  },
  {
    name: 'getUserInfo',
    method: 'GET',
    desc: '用户信息查询',
    path: '/v2/user/getUserInfo.json',
    mockPath: '',
    params: {
      token: ''
    }
  },
  {
    name: 'loanRecordList',
    method: 'POST',
    desc: '借款记录',
    path: '/v2/loverCard/loanRecordList.json',
    mockPath: '',
    params: {
      token: '',
      typeIndex: 2
    }
  },
  {
    name: 'getjumpurl',
    method: 'POST',
    desc: '聚帆返回认证或者补充资料的url供客户端跳转（订单状态42,43）',
    path: '/v2/jf/getjumpurl.json',
    mockPath: '',
    params: {
      token: '',
      orderCode: ''
    }
  },
  {
    name: 'setsinapaypass',
    method: 'POST',
    desc: '设置支付密码接口',
    path: '/v2/paicai/setsinapaypass.json',
    mockPath: '',
    params: {
      token: '',
      orderCode: ''
    }
  },
  {
    name: 'getBindcardChannelInfo',
    method: 'POST',
    desc: '根据订单号查询该订单对应的绑卡渠道',
    path: '/v2/assets/bindcard/getBindcardChannelInfo.json',
    mockPath: '',
    params: {
      token: '',
      orderCode: ''
    }
  },
  {
    name: 'withdraw',
    method: 'POST',
    desc: '提现接口',
    path: '/v2/paicai/withdraw.json',
    mockPath: '',
    params: {
      token: '',
      orderCode: ''
    }
  },
  // 绑卡
  {
    name: 'getAuthInfo',
    method: 'POST',
    desc: '获取实名信息接口',
    path: '/v2/paicai/getAuthInfo.json',
    mockPath: '',
    params: {
      token: ''
    }
  },
  {
    name: 'getByCode',
    method: 'POST',
    desc: '省市区',
    path: '/v2/order/address/getByCode.json',
    mockPath: '',
    params: {
      code: ''
    }
  },
  {
    name: 'getsupportbanks',
    method: 'POST',
    desc: '获取支持银行列表',
    path: '/v2/paicai/getsupportbanks.json',
    mockPath: '',
    params: {
      token: ''
    }
  },
  {
    name: 'regAndAuth',
    method: 'POST',
    desc: '创建会员&实名接口',
    path: '/v2/paicai/regAndAuth.json',
    mockPath: '',
    params: {
      orderCode: '',
      token: ''
    }
  },
  {
    name: 'bindcard',
    method: 'POST',
    desc: '获取短信验证码',
    path: '/v2/paicai/bindcard.json',
    mockPath: '',
    params: {
      prov: '',
      city: '',
      accountNo: '',
      bankName: '',
      branchName: '',
      bindPhone: '',
      orderCode: '',
      token: ''
    }
  },
  {
    name: 'bindcardadvance',
    method: 'POST',
    desc: '绑卡推进接口',
    path: '/v2/paicai/bindcardadvance.json',
    mockPath: '',
    params: {
      verifyCode: '',
      orderCode: '',
      token: ''
    }
  },
  // 工作信息
  {
    name: 'isSuppJobinfo',
    method: 'POST',
    desc: '用户是否需要补充工作/学校信息确认接口',
    path: '/v2/authorize/isSuppJobinfo.json',
    mockPath: '',
    params: {
      reqType: '1',
      token: ''
    }
  },
  {
    name: 'getDictList',
    method: 'POST',
    desc: '字典列表下载接口',
    path: '/v2/authorize/getDictList.json',
    mockPath: '',
    params: {
      dictType: '',
      token: ''
    }
  },
  {
    name: 'suppJobInfo',
    method: 'POST',
    desc: '工作信息补充接口',
    path: '/v2/suppJobInfo.json',
    mockPath: '',
    params: {
      occupation: '',
      unitName: '',
      duties: '',
      salary: '',
      address: '',
      tel: '',
      imgUrl: '',
      token: ''
    }
  },
  {
    name: 'uploadImgFile',
    method: 'POST',
    desc: '身份证信息获取',
    path: '/v2/ossUtil/uploadImgFile',
    params: {
      token: null,
      imgMultipartFile: null
    }
  },
  // 运营商授权
  {
    name: 'getMobileOperator',
    method: 'POST',
    desc: '手机号码运营商和归属地查询',
    path: '/v2/user/getMobileOperator.json',
    mockPath: '',
    params: {
      mobile: ''
    }
  },
  {
    name: 'getUserCreditV3',
    method: 'GET',
    desc: '查询用户信用信息V3',
    path: '/v2/assets/userCredit/getUserCreditV3.json',
    mockPath: '',
    params: {
      token: ''
    }
  },
  {
    name: 'submitNetOperatorAuth',
    method: 'POST',
    desc: '用户运营商通话详单授权接口',
    path: '/v2/riskControl/submitNetOperatorAuth.json?token=:token',
    mockPath: '',
    params: {
      token: '',
      account: '',
      password: '',
      type: '',
      captcha: '',
      regMobileFlag: ''
    }
  }
]

export default [
  {
    name: 'getBalance',
    method: 'POST',
    desc: '获取用户余额',
    path: 'v2/public/getBalance.json',
    mockPath: '',
    params: {
      token: '',
      subject: '' // guess (竞猜) ； electric (来电) ； cardrecycle (卡券回收)；loves(情侣卡现金)
    }
  },
  {
    name: 'getXxypSecretUserId',
    method: 'POST',
    desc: '用户id加密',
    path: 'v2/user/getXxypSecretUserId.json',
    mockPath: '',
    params: {
      token: ''
    }
  },
  {
    name: 'getUserAuthStatus',
    method: 'POST',
    desc: '判断用户是否实名',
    path: 'v2/user/getUserAuthStatus.json',
    mockPath: '',
    params: {
      token: '',
      authCode: 65
    }
  },
  {
    name: 'gustLogin',
    method: 'POST',
    desc: '用户登录',
    path: 'v2/user/gustLogin.json',
    mockPath: '',
    params: {
      mobile: '', // 手机号
      verCode: '', // 短信验证码
      registerType: '', // 注册渠道
      inviterId: '' // 邀请人id
    }
  },
  {
    name: 'bindingMoble',
    method: 'POST',
    desc: '微信Openiid绑定手机号',
    path: 'v2/user/wechat/bindingMoble.json',
    mockPath: '',
    params: {
      phoneNo: '', // 手机号
      openId: '', // 微信openId
      code: '', // 短信验证码
      registerType: '' // 注册渠道
    }
  },
  {
    name: 'getImgAuthCode',
    method: 'get',
    desc: '获取图形验证码',
    path: 'v2/writeImages',
    mockPath: '',
    params: {
      mobile: '' // 手机号
    },
    responseType: 'blob'
  },
  {
    name: 'imgSendVerCode',
    method: 'GET',
    desc: '发送图形验证码',
    path: 'v2/sms/imgSendVerCode.json',
    mockPath: '',
    params: {
      mobile: '', // 手机号
      authCodeName: '' // 图形验证码
    }
  },
  {
    name: 'creditCheckV4',
    method: 'POST',
    desc: '用户实名补偿',
    path: 'v2/assets/userCredit/creditCheckV4.json',
    mockPath: '',
    params: {
      token: ''
    }
  },
  {
    name: 'isMarkUpMobileAuthV2',
    method: 'POST',
    desc: '小象收银台判断是否需要补偿授权信息',
    path: 'v2/user/isMarkUpMobileAuthV2.json',
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
    path: 'v2/user/getUserInfo.json',
    mockPath: '',
    params: {
      token: ''
    }
  },
  {
    name: 'weiboBind',
    desc: '微博uid绑定手机号码',
    method: 'POST',
    path: '/v2/weibo/bind',
    params: {
      tmpToken: null,
      mobile: null,
      verCode: null
    }
  },
  {
    name: 'weiboBaseInfo',
    desc: '获取微博头像和昵称',
    method: 'POST',
    path: '/v2/weibo/baseInfo',
    params: {
      token: null
    }
  },
  {
    name: 'getBalanceRedPackets',
    method: 'POST',
    desc: '可提现余额查询',
    path: '/v2/public/getBalance.json',
    mockPath: '',
    params: {
      subject: 'guess',
      // subject: 'loves',
      token: ''
    }
  },
  {
    name: 'submitWithdrawApply',
    method: 'POST',
    desc: '可提现余额查询',
    path: '/v2/public/submitWithdrawApply.json',
    mockPath: '',
    params: {
      token: '',
      subject: '',
      amount: '',
      payPwd: '',
      alipayAccount: ''
    }
  },
  {
    name: 'payPwdCount',
    method: 'POST',
    desc: '用户支付密码剩余输入次数接口',
    path: 'v2/assets/user/payPwdCount.json',
    mockPath: '',
    params: {
      token: ''
    }
  },
  {
    name: 'withdrawList',
    method: 'POST',
    desc: '提现记录',
    path: 'v2/public/withdrawList.json',
    mockPath: '',
    params: {
      token: '',
      subject: ''
    }
  }
]

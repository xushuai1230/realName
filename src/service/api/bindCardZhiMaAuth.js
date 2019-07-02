export default [
  {
    name: 'getAuthInfo',
    method: 'POST',
    desc: '获取用户基本信息',
    path: '/v2/paicai/getAuthInfo.json',
    params: {
      token: ''
    }
  },
  {
    name: 'getsmsCode',
    method: 'POST',
    desc: '获取短信验证码',
    path: 'v2/assets/bindcard/yeepay/yeepayRequest.json',
    params: {
      token: '',
      cardno: '',
      idcardno: '',
      username: '',
      phone: '',
      bankName: '',
      bankCode: ''
    }
  },
  {
    name: 'signAdvance',
    method: 'POST',
    desc: '提交绑卡',
    path: 'v2/assets/bindcard/yeepay/yeepayConfirm.json',
    params: {
      token: '',
      cardno: '',
      idcardno: '',
      username: '',
      phone: '',
      validatecode: '',
      bankName: '',
      bankCode: ''
    }
  },
  {
    name: 'refreshImgCode',
    method: 'POST',
    desc: '刷新图片验证码',
    path: 'v2/riskControl/zhima/refreshImgCode.json',
    params: {
      token: ''
    }
  },
  {
    name: 'submitChannelSms',
    method: 'POST',
    desc: '提交渠道短信验证码',
    path: 'v2/riskControl/zhima/submitChannelSms.json',
    params: {
      token: '',
      sms: '',
      tk: ''
    }
  },
  {
    name: 'submitZhimaSms',
    method: 'POST',
    desc: '提交芝麻信用短信验证码',
    path: 'v2/riskControl/zhima/submitZhimaSms.json',
    params: {
      token: '',
      sms: '',
      tk: ''
    }
  },
  {
    name: 'channel',
    method: 'POST',
    desc: '获取在使用授权渠道',
    path: 'v2/riskControl/zhima/channel.json',
    params: {
      token: ''
    }
  },
  {
    name: 'getChannelSms',
    method: 'POST',
    desc: '获取在使用授权渠道短信验证码',
    path: 'v2/riskControl/zhima/getChannelSms.json',
    params: {
      token: '',
      tk: '',
      cpc: ''
    }
  },
  {
    name: 'getPhoneNum',
    method: 'GET',
    desc: '获取手机号',
    path: 'v2/user/getUserByToken.json',
    params: {
      token: ''
    }
  },
  {
    name: 'checkZhiMaAuth',
    method: 'POST',
    desc: '芝麻信用是否已授权',
    path: 'v2/riskControl/checkZhiMaAuth.json',
    params: {
      token: ''
    }
  },

  {
    name: 'signRequest',
    method: 'POST',
    desc: '网联签约',
    path: 'v2/assets/xiaoying/signRequest.json',
    params: {
      token: '',
      orderCode: ''
    }
  },
  {
    name: 'signAdvanceSina',
    method: 'POST',
    desc: '网联签约推进',
    path: 'v2/assets/xiaoying/signAdvance.json',
    params: {
      token: '',
      validateCode: '',
      orderCode: ''
    }
  },
  {
    name: 'getUserCard',
    method: 'POST',
    desc: '新浪卡信息',
    path: 'v2/assets/xiaoying/getUserCard.json',
    params: {
      token: ''
    }
  },
  {
    name: 'checkInsureInfo',
    method: 'POST',
    desc: '投保信息',
    path: 'v2/mykLoan/checkInsureInfo.json',
    params: {
      token: '',
      orderCode: ''
    }
  },
  {
    name: 'getInsuranceInfo',
    method: 'POST',
    desc: '协议填入信息',
    path: 'v2/assets/xiaoying/getInsuranceInfo.json',
    params: {
      token: '',
      orderCode: ''
    }
  },
  {
    name: 'getByCode',
    method: 'POST',
    desc: '获取省市',
    path: 'v2/order/address/getByCode.json',
    params: {
      code: ''
    }
  },
  {
    name: 'bindingBankCard',
    method: 'POST',
    desc: '新浪绑卡获取验证码',
    path: 'v2/sinapay/bindingBankCard.json',
    params: {
      token: '',
      bankCode: '',
      bankName: '',
      bankAccountNo: '',
      phoneNo: '',
      provinceName: '',
      cityName: '',
      provinceCode: '',
      cityCode: ''
    }
  },
  {
    name: 'bindingBankCardAdvance',
    method: 'POST',
    desc: '新浪绑卡推进',
    path: 'v2/sinapay/bindingBankCardAdvance.json',
    params: {
      token: '',
      validCode: ''
    }
  }
]

export default [
  {
    name: 'getRealNameListv3',
    method: 'GET',
    desc: '获取实名认证列表接口',
    path: '/v2/authorize/realName/getRealNameListv3.json',
    params: {
      token: null
    }
  },
  {
    name: 'submitIdentityInfoV3',
    method: 'POST',
    desc: '新实名认证流程-身份识别接口 增加了用户的紧急联系人相关信息',
    path: 'v2/authorize/realName/submitIdentityInfoV3.json',
    params: {
      token: null,
      realName: null,
      papersCode: null,
      emergency_contact: null,
      emergency_mobile: null,
      emergency_title: null
    }
  },
  {
    name: 'getCardsInfo',
    method: 'POST',
    desc: '身份证信息获取',
    path: 'v2/cards/getCardsInfo.json',
    params: {
      token: null,
      file: null
    }
  },
  {
    name: 'checkCardsInfo',
    method: 'POST',
    desc: '身份证信息校验',
    path: 'v2/cards/checkCardsInfo.json',
    params: {
      token: null
    }
  },
  {
    name: 'updateEmergencyInfo',
    method: 'POST',
    desc: '更新紧急联系人',
    path: 'v2/authorize/updateEmergencyInfo.json',
    params: {
      token: null,
      emergency_contact: null,
      emergency_mobile: null,
      emergency_title: null
    }
  },
  {
    name: 'selAddressOne',
    method: 'POST',
    path: '/v2/order/address/selAddressOne.json',
    desc: '查询用户已上传的身份证照片',
    params: {
      token: null,
      id: null
    }
  },
  {
    name: 'submitDianshangTaskId',
    method: 'POST',
    path: 'v2/authorize/submitDianshangTaskId.json',
    desc: '提交电商授权',
    params: {
      token: null,
      taskId: null
    }
  },
  {
    name: 'submitVideoAuth',
    method: 'POST',
    path: '/v2/authorize/realName/h5/submitVideoAuth.json',
    desc: '视频实名认证',
    params: {
      token: null,
      videoFile: null
    }
  },
  {
    name: 'perfetInformation',
    method: 'POST',
    path: 'v2/order/address/perfetInformation.json',
    desc: '增加补全收货地址收货人的身份证号码， 正反面照片接口',
    params: {
      token: null,
      addressId: null,
      idCard: null,
      cardFrontImg: null,
      cardBackImg: null
    }
  }
]

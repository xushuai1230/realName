export default [
  {
    name: 'queryFreight',
    method: 'POST',
    desc: '批量查询商品运费',
    path: 'v2/jd/newFreight/query.json',
    mockPath: '',
    params: {
      'deliverAddressId': '',
      'goods': null
    }
  },
  {
    name: 'orderSubmit',
    method: 'POST',
    desc: '普通订单下单',
    path: 'v2/order/save.json',
    mockPath: '',
    params: {
      'couponCodeList': null,
      'deliverAddressId': '',
      'goods': null,
      'source': '',
      'skuCode': '',
      'remark': '',
      'shoppingCartFlag': false
    }
  },
  {
    name: 'mergeOrderSubmit',
    method: 'POST',
    desc: '合并订单下单',
    path: 'v2/order/createMergeOrder.json',
    mockPath: '',
    params: {
      'deliverAddressId': '', // 收货地址id
      'couponCodeList': null, // 优惠券编号数组，目前合并订单只支持使用一张优惠券
      'goods': null,
      'source': ''
    }
  },
  {
    name: 'getElephantPayInfo',
    method: 'GET',
    desc: '根据分期信息获取分期计划V3.0',
    path: 'v2/assets/installment/getElephantPayInfo.json',
    mockPath: '',
    params: {
      'orderCode': '', // 订单号
      'amount': '', // 分期金额
      'freeDay': '', // 免息天数
      'periods': '', // 分期期数
      'token': ''
    }
  },
  {
    name: 'calDownpayAmount',
    method: 'POST',
    desc: '计算小象组合付首付金额接口',
    path: 'v2/assets/downpay/calDownpayAmount.json',
    mockPath: '',
    params: {
      'token': '', // 订单号
      'amount': '', // 支付金额
      'cardCode': '' // 卡号
    }
  },
  {
    name: 'getUsableByGoodsV2',
    method: 'POST',
    desc: '按商品信息查询用户可用优惠券列表.',
    path: 'v2/coupon/getUsableByGoodsV2.json',
    mockPath: '',
    params: {
      'token': '',
      'couponType': '',
      'prodParamList': ''
    }
  }
]

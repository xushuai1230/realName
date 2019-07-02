export default [
  {
    name: 'getDeductByUserId',
    method: 'POST',
    desc: '抵扣金总额',
    path: '/v2/flowers/getDeductByUserId.json',
    mockPath: '',
    params: {
      token: ''
    }
  },
  {
    name: 'getNotClearedBillV2',
    method: 'POST',
    desc: '未结清账单 合并',
    path: '/v2/assets/userBill/getNotClearedBillV2.json',
    mockPath: '',
    params: {
      token: ''
    }
  },
  {
    name: 'getClearedBillV2',
    method: 'POST',
    desc: '已结清账单 合并',
    path: '/v2/assets/userBill/getClearedBillV2.json',
    mockPath: '',
    params: {
      token: ''
    }
  },
  {
    name: 'orderRepayDeail',
    method: 'POST',
    desc: '未结清账单还款',
    path: 'v2/assets/userCredit/getNotClearedBillDetail.json',
    mockPath: '',
    params: {
      token: '',
      orderCode: ''
    }
  },
  {
    name: 'orderAlRepayDetail',
    method: 'POST',
    desc: '已结清账单还款',
    path: '/v2/assets/userCredit/getClearedBillDetail.json',
    mockPath: '',
    params: {
      token: '',
      orderCode: ''
    }
  },
  {
    name: 'getTotalBillDetail',
    method: 'POST',
    desc: '合并账单详情',
    path: '/v2/assets/userBill/getMergeBillDetail.json',
    mockPath: '',
    params: {
      token: '',
      billId: '',
      billNum: ''
    }
  },
  {
    name: 'getBannersByType',
    method: 'POST',
    desc: '抵扣金页面活动页面',
    path: 'v2/good/getBannersByType.json',
    mockPath: '',
    params: {
      type: ''
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
    name: 'getParamValue',
    method: 'POST',
    desc: '获取百花活动',
    path: 'v2/config/getSystemParam.json?paramName=BAIHUA_URL',
    mockPath: '',
    params: {
    }
  },
  {
    name: 'checkOldZaidai',
    method: 'POST',
    desc: '通过token查询是否有旧账号的在贷待还款账单',
    path: 'v2/weibo/checkOldZaidai',
    params: {
      token: ''
    }
  },
  {
    name: 'getRepaymentTypeByOrderCodeV2',
    method: 'POST',
    desc: '独立资产获取还款方式V2',
    path: 'v2/assets/repayment/getRepaymentTypeByOrderCodeV2.json',
    mockPath: '',
    params: {
      token: '',
      orderCode: ''
    }
  },
  {
    name: 'getRepaymentTypeByMergeBillIdV2',
    method: 'POST',
    desc: '合并账单获取还款方式V2',
    path: 'v2/assets/repayment/getRepaymentTypeByMergeBillIdV2.json',
    mockPath: '',
    params: {
      token: '',
      billNum: '',
      billId: ''
    }
  },
  {
    name: 'repayMergeWeb',
    method: 'POST',
    desc: '账单合并的博远还款接口',
    path: 'v2/assets/bypay/repayMergeWeb.json',
    mockPath: '',
    params: {
      token: '',
      billNum: '',
      billId: '',
      id: ''
    }
  },
  {
    name: 'repayPlanWeb',
    method: 'POST',
    desc: '独立资产的博远还款接口',
    path: 'v2/assets/bypay/repayPlanWeb.json',
    mockPath: '',
    params: {
      orderCode: '',
      periods: '',
      id: '',
      token: ''
    }
  }
]

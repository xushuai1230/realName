export default[
  {
    name: 'queryGetRobCardInfo',
    method: 'POST',
    desc: '查询万能卡抢卡信息',
    path: 'v2/activity/cardCollect/getRobCardInfo.json',
    mockPath: '',
    params: {
      token: ''
    }
  },
  {
    name: 'lookCardPlaceOrderStatus',
    method: 'POST',
    desc: '是否用颜值卡下单得到万能卡',
    path: 'v2/activity/cardCollect/lookCardPlaceOrderStatus.json',
    mockPath: '',
    params: {
      token: ''
    }
  },
  {
    name: 'lookCardStatus',
    method: 'POST',
    desc: '是否开通颜值卡',
    path: 'v2/activity/cardCollect/lookCardStatus.json',
    mockPath: '',
    params: {
      token: ''
    }
  },
  {
    name: 'getDrawCrad',
    method: 'POST',
    desc: '领取抽卡机会',
    path: 'v2/activity/cardCollect/getDrawCrad.json',
    mockPath: '',
    params: {
      token: ''
    }
  },
  {
    name: 'setRemind',
    method: 'POST',
    desc: '设置提醒/取消提醒',
    path: 'v2/activity/cardCollect/setRemind.json',
    mockPath: '',
    params: {
      token: ''
    }
  },
  {
    name: 'robCard',
    method: 'POST',
    desc: '抢万能卡',
    path: 'v2/activity/cardCollect/robCard.json',
    mockPath: '',
    params: {
      token: ''
    }
  },
  {
    name: 'surplusDrawCardCount',
    method: 'POST',
    desc: '查询抢卡次数',
    path: 'v2/activity/cardCollect/surplusDrawCardCount.json',
    mockPath: '',
    params: {
      token: ''
    }
  },
  {
    name: 'changeCardInterface',
    method: 'POST',
    desc: '万能卡换卡',
    path: 'v2/activity/cardCollect/changeCard.json',
    mockPath: '',
    params: {
      token: '',
      cardCode:	''
    }
  }
]

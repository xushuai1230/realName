export default [
  {
    name: 'hotBanners',
    method: 'POST',
    desc: 'APP首页的查询',
    path: 'v2/good/home/hotBanners.json',
    mockPath: '',
    params: {}
  },
  {
    name: 'getAppHomePageImgV2',
    method: 'GET',
    desc: '获取首页nav',
    path: 'v2/good/getAppHomePageImgV2.json',
    mockPath: '',
    params: {}
  },
  {
    name: 'getBannerByPage',
    method: 'GET',
    desc: '获取专场信息',
    path: 'v2/good/home/getBannerByPage.json',
    mockPath: '',
    params: {
      titleId: '',
      pageNum: ''
    }
  },
  {
    name: 'getBannerGoodsByPage',
    method: 'GET',
    desc: '获取专场信息',
    path: '/v2/good/h5/getBannerGoodsByPage.json',
    mockPath: '',
    params: {
      pageNum: ''
    }
  },
  {
    name: 'hongbaofeiPrizeNum',
    method: 'POST',
    desc: '【红包飞】推广奖品数量查询接口',
    path: 'v2/weibo/hongbaofeiPrizeNum.json',
    mockPath: '',
    params: {
      token: '',
      prizeCode: ''
    }
  },
  {
    name: 'gustLogin',
    method: 'POST',
    desc: '红包飞活动登录并领券接口',
    path: 'v2/user/weibo/gustLogin.json',
    mockPath: '',
    params: {
      mobile: '',
      verCode: '',
      registerType: '',
      token: ''
    }
  },
  {
    name: 'newUserPrizeCheck',
    method: 'POST',
    desc: '新人奖品优惠券是否有效',
    path: 'v2/weibo/newUserPrizeCheck.json',
    mockPath: '',
    params: {
      token: ''
    }
  }
]

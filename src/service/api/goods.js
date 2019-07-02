export default [
  {
    name: 'platforminfo',
    method: 'GET',
    desc: '获取商品售后相关信息',
    path: 'v2/good/platforminfo.json',
    mockPath: '',
    params: {}
  },
  {
    name: 'recommend',
    method: 'GET',
    desc: '获取同类商品列表',
    path: 'v2/good/detail/recommend.json',
    mockPath: '',
    params: {
      goodsCode: '',
      goodSource: ''
    }
  },
  {
    name: 'getSystemTime',
    method: 'POST',
    desc: '获取系统时间,判断秒杀',
    path: 'v2/systemtime/getSystemTime.json',
    mockPath: '',
    params: {
      goodsCode: ''
    }
  },
  {
    name: 'getGoodCoupon',
    method: 'GET',
    desc: '获取商品优惠券',
    path: 'v2/good/getGoodCoupon.json',
    mockPath: '',
    params: {
      categoryTwoId: '',
      goodsCode: ''
    }
  },
  {
    name: 'getGoodsDetail',
    method: 'GET',
    desc: '获取商品详细信息',
    path: 'v2/good/:goodsId.json',
    mockPath: '',
    params: {
      goodSource: '',
      goodsId: '',
      token: ''
    }
  },
  {
    name: 'childBanners',
    method: 'GET',
    desc: '获取专场分类信息',
    path: 'v2/good/banner/childBanners/:id.json',
    mockPath: '',
    params: {
      id: ''
    }
  },
  {
    name: 'queryGoodsByBannerIdV2',
    method: 'GET',
    desc: '获取单个专场分类信息',
    path: 'v2/good/queryGoodsByBannerIdV2/:childId.json',
    mockPath: '',
    params: {
      childId: ''
    }
  },
  {
    name: 'getCategoryCoupon',
    method: 'POST',
    desc: '按类目领取优惠券',
    path: 'v2/coupon/getCategoryCoupon.json',
    mockPath: '',
    params: {
      grantChannels: '',
      discountNumber: '',
      token: '',
      goodsCouponId: ''
    }
  }
]

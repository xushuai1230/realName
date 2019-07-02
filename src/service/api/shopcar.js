export default [
  {
    name: 'getShopCarList',
    method: 'POST',
    desc: '查询购物车列表',
    path: 'v2/shopping/cart/queryShoppingCarts.json',
    mockPath: '',
    params: {
      'token': ''
    }
  },
  {
    name: 'deleteGoods',
    method: 'POST',
    desc: '删除购物车商品',
    path: 'v2/shopping/cart/deleteGood.json',
    mockPath: '',
    params: {
      'skuGoodsVoList': null
    }
  },
  {
    name: 'updateGoods',
    method: 'POST',
    desc: '增减购物车商品',
    path: 'v2/shopping/cart/updateShoppingGoodsCount.json',
    mockPath: '',
    params: {
      'goodsSource': '',
      'goodsCode': '',
      'skuCode': '',
      'mode': 0
    }
  },
  {
    name: 'joinCart',
    method: 'POST',
    desc: '加入购物车',
    path: 'v2/shopping/cart/joinCart.json',
    mockPath: '',
    params: {
      'goodsSource': '1',
      'goodsCode': '',
      'skuCode': '',
      'goodsCount': ''
    }
  },
  {
    name: 'goodsRecommend',
    method: 'POST',
    desc: '购物车商品推荐',
    path: 'v2/shopping/cart/goodsRecommend.json',
    mockPath: '',
    params: {
      'pageNum': '',
      'skuGoodsVoList': null
    }
  }
]

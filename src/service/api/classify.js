export default [
  {
    name: 'brandClassify',
    method: 'POST',
    desc: 'app增加品牌分类 一级分类',
    path: 'v2/antistop/brandClassify.json',
    mockPath: '',
    params: {}
  },
  {
    name: 'goodsClassName',
    method: 'POST',
    desc: 'app 增加分类接口',
    path: 'v2/antistop/goodsClassName.json',
    mockPath: '',
    params: {
      brandId: ''
    }
  },
  {
    name: 'queryGoods',
    method: 'POST',
    desc: 'app首页增加搜索词查询列表',
    path: 'v2/antistop/queryGoods.json',
    mockPath: '',
    params: {
      brandId: '',
      sort: '',
      from: '',
      pageNum: ''
    }
  },
  {
    name: 'searchSkload',
    method: 'POST',
    desc: '大家都在搜',
    path: 'v2/?method=search.user.skload.new',
    mockPath: '',
    params: {
      app_params: null
    }
  },
  {
    name: 'autocompletion',
    method: 'POST',
    desc: '搜索补全',
    path: 'v2/?method=search.goods.autocompletion',
    mockPath: '',
    params: {
      app_params: null
    }
  },
  {
    name: 'defaultSearchGoods',
    method: 'POST',
    desc: '默认搜索',
    path: 'v2/?method=search.defaultSearchGoods',
    mockPath: '',
    params: {}
  },
  {
    name: 'searchGoods',
    method: 'POST',
    desc: 'APP-商品全文检索',
    path: 'v2/?method=search.goods',
    mockPath: '',
    params: {
      app_params: null
    }
  }
]

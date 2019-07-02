export default [
  {
    name: 'submitImgCode',
    method: 'POST',
    desc: '【学信网H5授权】提交图像验证码',
    path: '/v2/riskControl/edu/submitImgCode.json',
    mockPath: '',
    params: {
      token: '',
      tk: '',
      cpc: ''
    }
  },
  {
    name: 'submitAccount',
    method: 'POST',
    desc: '【学信网H5授权】提交账户信息',
    path: '/v2/riskControl/edu/submitAccount.json',
    mockPath: '',
    params: {
      token: '',
      account: '',
      password: ''
    }
  },
  {
    name: 'refreshImgCode',
    method: 'POST',
    desc: '【学信网H5授权】刷新图像验证码',
    path: '/v2/riskControl/edu/refreshImgCode.json',
    mockPath: '',
    params: {
      token: '',
      tk: ''
    }
  }
]

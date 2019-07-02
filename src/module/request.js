import axios from 'axios'
import qs from 'qs'
import store from '@/plugins/store'
import Qs from 'querystring'
import { CHANNEL_WEIBOBIND, CHANNEL_BOBO } from '@/const/constdata'
const ajx = axios.create({
  baseURL: process.env.VUE_APP_API_BASEURL, // 设定请求环境(测试or生产)，由DefinePlugin 插件定义
  timeout: 36000
})
const ajaxReq = axios.create({
  baseURL: process.env.VUE_APP_APIURL,
  timeout: 60000,
  transformRequest: [function (data) {
    data = Qs.stringify(data)
    return data
  }]
})
const get = ajx.get
const post = ajx.post
const api = {
  // 颜值卡接口start
  userCreditV4: '/v2/assets/userCredit/creditCheckV4.json', // 判断实名
  getLoginSmsCode: 'v2/sms/getLoginSmsCode.json', // 获取短信验证码
  bindingMoble: 'v2/user/wechat/bindingMoble.json', // 微信绑定
  getImgAuthCode: 'v2/writeImages',
  gustLogin: 'v2/user/gustLogin.json',
  wxAuth: 'elephant/api/public/auth', // 微信认证
  useLog: 'v2/lookingCard/useLog.json', // 使用记录
  getUserInfo: '/v2/user/getUserInfo.json', // 查询是否有支付密码
  getBalanceByToken: '/v2/public/getBalance.json', // 查询余额
  getZeroList: 'v2/pinkerFree/queryPinkerFreeList.json', // 测试列表
  getAuthorizationInfoByCode: 'v2/authorize/getAuthorizationInfoByCode/69.json', // 运营商授权
  cardUseList: 'v2/loverCard/cardUseList.json', // 颜值卡使用轮播信息
  giftList: 'v2/loverCard/giftList.json', // 礼品列表
  bindUserForInvitingNewCard: 'v2/loverCard/bindUserForInvitingNewCard.json', // 建立绑定关系
  accumulativeMoney: 'v2/public/getAddUpReward.json', // 累计金额查询
  isMarkUpMobileAuthV2: 'v2/user/isMarkUpMobileAuthV2.json', // 是否需要补偿授权信息,支付宝，运营商是否需要授权
  photoStatus: '/v2/lookingCard/photoStatus.json', // 颜值卡拍照状态校验
  lookingCardState: 'v2/lookingCard/userCradDetail.json', // 颜值卡状态
  openUpCard: 'v2/lookingCard/openUpCardWeiBo.json', // 颜值卡申请开卡
  invitationCard: '/v2/lookingCard/invitation.json', // 颜值卡邀请开卡查询用户姓名
  getXxypSecretUserId: 'v2/user/getXxypSecretUserId.json', // token转换为加密的userId
  takeGift: 'v2/lookingCard/takeGift.json', // 领取颜值卡礼品
  openStatus: '/v2/lookingCard/openStatus.json', // 微信开卡状态
  invitationName: '/v2/lookingCard/invitation.json', // 查询用户姓名
  imporeFile: 'v2/lookingCard/imporeFile.json', // 上传图片
  reOpenCard: 'v2/lookingCard/reOpenCard.json', // 重新开卡
  recordUserWatchTips: 'v2/lookingCard/recordUserWatchTips.json', // 记录是否看过蒙层
  hadWatchedTips: 'v2/lookingCard/hadWatchedTips.json', // 查询用户是否看过蒙层
  errorUpload: '/v2/riskControl/app/error.json',
  queryLookingCardIncreaseAmountList: '/v2/lookingCard/queryLookingCardIncreaseAmountList.json', // 提额列表
  calcRefundAmountWithSeq: '/v2/mykLoan/calcRefundAmountWithSeq.json', // 计算每期应还金额
  createLoanOrder: 'v2/loverCard/createLoanOrder.json', // 创建颜值卡借款订单
  checkPassword: 'v2/assetsNoReview/submit_periods_noreview.json', // 用户支付密码校验接口
  limitAmount: '/v2/mykLoan/limitAmount.json', // 计算美颜卡可借金额接口
  mykloaninfo: 'v2/loan/mykloaninfo.json', // 获取美颜卡借款信息接口 获取分期数
  // 颜值卡接口end

  // 订单接口start
  neworderList: '/v2/order/queryOrderList.json',
  orderList: 'v2/order/all.json',
  orderDetail: 'v2/order/query/',
  orderCancel: 'v2/order/cancel/',
  orderDelete: 'v2/order/delete/',
  receive: 'v2/order/confirm/', // 确认收货
  isSuppJobinfo: 'v2/authorize/isSuppJobinfo.json', // 补充信息
  bindCardType: 'v2/assets/bindcard/getBindcardChannelInfo.json', // 判断绑卡跳转方式
  orderRepayDeail: 'v2/assets/userCredit/getNotClearedBillDetail.json', // 底层 未结清账单还款
  orderAlRepayDetail: '/v2/assets/userCredit/getClearedBillDetail.json', // 底层 已结清账单还款
  orderNowBill: '/v2/assets/userCredit/getNotClearedBill.json', // 未结清账单
  orderOverBill: '/v2/assets/userCredit/getClearedBill.json', // 已结清账单
  getTrainStopInfo: 'v2/train/searchTrainStopStation.json', // 火车停靠信息查询
  checkTrainStatus: 'v2/train/getTrainTicketState.json', // 火车票状态查询
  nowSystemTime: '/v2/systemtime/getSystemTime.json', // 服务器返回来的时间
  getTrainTeturnPrice: 'v2/train/trainApplyRefundOrder.json', // 火车票申请退票
  getClearedBillV2: '/v2/assets/userBill/getClearedBillV2.json', // 已结清账单 合并
  getNotClearedBillV2: '/v2/assets/userBill/getNotClearedBillV2.json', // 未结清账单 合并
  getTotalBillDetail: '/v2/assets/userBill/getMergeBillDetail.json', // 合并账单详情
  getLaunchUrl: 'v2/eleme/getLaunchUrl.json', // 获取饿了么订单详情
  getCarTicketNum: 'v2/busTicket/getScheduleVerifyPageView.json', //  汽车票余票校验
  getHotelDetail: '/v2/hotel/searchHotelDetail.json', // 酒店详情接口
  getHotelDetail1: '/v2/elonghotel/searchHotelDetail.json', // 酒店详情接口---艺龙
  checkHotelNum: '/v2/hotel/hotelRoomStockAndPriceCheck.json', // 酒店库存,价格校验
  checkHotelNum1: '/v2/elonghotel/hotelDataValidate.json', // 酒店库存,价格校验-----艺龙
  getJfRepaymentInfo: 'v2/jf/repayment/getJfRepaymentInfo.json', // 聚帆还款
  airPlaneSeat: 'v2/planeTicket/getCarrierAndCode.json', // 机票舱位描述
  // applyHotelOrder: '/v2/hotel/applyRefund.json', // 酒店申请退订接口
  applyHotelOrder: '/v2/elonghotel/cancelOrder.json', // 酒店申请退订接口---艺龙
  getReas: 'v2/config/getSystemParam.json?paramName=ORDER_CANCEL_REASON', // 获取取消原因
  checkoutAirPlaneNum: '/v2/planeTicket/getAVInfoPageView.json', // 机票余票校验
  planeTicket: 'v2/planeTicket/getCarrierAndCode.json', // 退改签说明
  getCardList: '/v2/order/card/getCardList.json', // 查询平台支持使用的支付卡，如情侣卡，狼人卡。
  detail: '/v2/loverCard/detail.json', // 查询剩余额度用，
  getDeductByUserId: '/v2/flowers/getDeductByUserId.json', // 抵扣金的总额
  getDeductDetails: 'v2/flowers/getDeductDetails.json', // 抵扣金详情
  getBannersByType: 'v2/good/getBannersByType.json', // 抵扣金页面活动页面
  getParamValue: 'v2/config/getSystemParam.json?paramName=BAIHUA_URL', // 获取百花活动
  pinkerFreeDetail: 'v2/pinkerFree/pinkerFreeDetail.json',
  loadMarketShow: 'v2/loanMarket/showLoanMarketBtn.json', // 是否展示导流按钮 (小象贷款)
  checkCouponBeforeCancel: 'v2/order/checkCouponBeforeCancel.json', // 合并订单子订单取消前验证
  logout: '/v2/user/logout.json' // 用户退出登录
  // 订单接口end
}
ajx.interceptors.request.use(function (config) {
  // config.headers.common.cas = 'true'
  let tokenHeader = store.state.userIdentity.token
  if (tokenHeader) {
    config.headers.common.token = tokenHeader
  }
  return config
})

ajx.interceptors.response.use(function (res) {
  if (!res.data) {
    throw new Error('数据为空')
  }
  let heads = res.data.heads
  if (!heads) {
    return Promise.reject(new Error('无返回数据'))
  }
  let message = heads.message || heads.errorMsg || `业务错误:${heads.code}`
  if (heads.code === 10001 || /没登录/.test(heads.message)) {
    let expiredToast = message
    const ch = store.state.loginChannel
    if (ch !== CHANNEL_WEIBOBIND && CHANNEL_BOBO !== ch) {
      store.commit('setLoginStatus', true)
    } else {
      expiredToast = '哎呀，丢失您的信息了哦，请退出重试吧！'
      if (process.env.VUE_APP_SERVEN === 'DEV') {
        expiredToast = message + ' ' + expiredToast
      }
    }
    return Promise.reject(expiredToast)
  } else if (heads.code !== 200) {
    return Promise.reject(message)
  }
  return res.data.body
}, function (error) {
  // 这里 不reject 导致 promise变成 resolve 状态
  if (error) {
    return Promise.reject(String(error))
  }
})

/**
 * 将对象转,方便 x-www-from-urlencoded格式数据传输
 */
export function fromUrlcode (body) {
  return qs.stringify(body)
}

export {
  ajx,
  get,
  post,
  api,
  ajaxReq
}

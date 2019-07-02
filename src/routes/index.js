import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/HomePage/Home.vue' // 底部tab切换区域
import shopHome from '@/views/ShoppingMall/ShoppingMall.vue' // 商城
import UserCenter from '@/views/UserCenter/UserCenter.vue' // 我的页面
import Facescard from '@/views/Facescard/Facescard.vue' // 颜值卡入口

const GoodsDetail = () => import(/* webpackChunkName: "goods" */'@/views/GoodsDetailPage/GoodsDetailPage.vue') // 商品详情
const Ground = () => import(/* webpackChunkName: "goods" */'@/views/Ground/Ground') // 嵌套专场
const GroundNormal = () => import(/* webpackChunkName: "goods" */'@/views/Ground/Ground_normal') // 普通专场
const OrderFill = () => import(/* webpackChunkName: "goods" */'@/views/OrderFill/OrderFill.vue') // 订单填写
const OrderFillCoupon = () => import(/* webpackChunkName: "goods" */'@/views/OrderFill/OrderFillCoupon.vue') // 订单填写
const Address = () => import(/* webpackChunkName: "goods" */'@/views/Address/Address.vue') // 地址列表
const AddressEdit = () => import(/* webpackChunkName: "goods" */'@/views/Address/AddressEdit.vue') // 地址编辑
const OrderPay = () => import(/* webpackChunkName: "goods" */'@/views/OrderPay/OrderPay.vue') // 分期订单确认
const OrderPayInfoList = () => import(/* webpackChunkName: "goods" */'@/views/OrderPay/OrderPayInfoList.vue') // 分期计划
const OrderPayFreeList = () => import(/* webpackChunkName: "goods" */'@/views/OrderPay/OrderPayFreeList.vue') // 分期计划
const OrderDirectPay = () => import(/* webpackChunkName: "goods" */'@/views/OrderPay/OrderDirectPay.vue') // 收银台
const OrderPaySuccess = () => import(/* webpackChunkName: "goods" */'@/views/OrderPay/OrderPaySuccess.vue') // 支付成功提示页面

const shopCar = () => import('@/views/ShopCar/ShopCar.vue') // 购物车

const OrderList = () => import(/* webpackChunkName: "order" */'@/views/OrderList/OrderList') // 订单
const OrderDetail = () => import(/* webpackChunkName: "order" */'@/views/OrderDetail/OrderDetail') // 订单详情
const OrderRepayment = () => import(/* webpackChunkName: "order" */'@/views/OrderRepayment/OrderRepayment.vue') // 订单分期计划
const orderLogistics = () => import(/* webpackChunkName: "order" */'@/views/OrderDetail/orderLogistics')
const InvitationOther = () => import(/* webpackChunkName: "facecard" */'@/views/Facescard/InvitationOther.vue') // 邀请其他人
const UseRecords = () => import(/* webpackChunkName: "facecard" */'@/views/Facescard/UseRecords.vue') // 额度使用记录
const InvitationSuccess = () => import(/* webpackChunkName: "facecard" */'@/views/Facescard/InvitationSuccess.vue') // 邀请成功上报功能

const IdCardAuth = () => import('@/views/Auth/IdCardAuth.vue') // 身份证OCR上传
const UserCardAuth = () => import('@/views/Auth/UserCardAuth.vue') // 实名认证
const EmergencyContact = () => import('@/views/Auth/EmergencyContact.vue') // 紧急联系人上传
const OperatorAccredit = () => import('@/views/Auth/OperatorAccredit/OperatorAccredit.vue') // 运营商授权
const ForgetPassword = () => import('@/views/Auth/OperatorAccredit/ForgetPassword.vue') // 运营商授权 忘记服务密码
const OffenUseAccredit = () => import('@/views/Auth/OperatorAccredit/OffenUseAccredit.vue') // 运营商授权-常用手机号
const BindingCard = () => import('@/views/Auth/BindingCard/BindingCard.vue') // 新浪绑卡
const GetCode = () => import('@/views/SetPassword/GetCode') // 忘记支付密码
const SetPassword = () => import('@/views/SetPassword/SetPassword') // 设置支付密码
const WorkMsg = () => import('@/views/Auth/WorkMsg/WorkMsg.vue') // 补充工作信息
const BindCardYiBao = () => import('@/views/Auth/bindCardYiBao/bindCard.vue') // 易宝绑卡(订单里面的绑卡)
const BankList = () => import('@/views/Auth/bindCardYiBao/BankList.vue') // 银行列表
const ZhiMaAuth = () => import('@/views/Auth/ZhiMaAuth/ZhiMaAuth.vue') // 自研芝麻信用
const StudentAuth = () => import('@/views/Auth/StudentAuth/StudentAuth') // 学信网授权
const MyCoupon = () => import('@/views/MyCoupon/MyCoupon') // 我的优惠券

const XiaoyingSign = () => import(/* webpackChunkName: "xiaoyingSign" */'@/views/Auth/XiaoyingSign/XiaoyingSign.vue') // 小赢签约 银行认证
const ShowHtml = () => import(/* webpackChunkName: "xiaoyingSign" */'@/views/Auth/XiaoyingSign/ShowHtml.vue')
const JieKuanQueRenShu = () => import(/* webpackChunkName: "xiaoyingSign" */'@/views/Auth/XiaoyingSign/JieKuanQueRenShu.vue')

const BindCardSina = () => import(/* webpackChunkName: "cardSina" */'@/views/Auth/bindCardSina/bindCardSina.vue') // 新浪—代扣通道-绑卡
const ProvinceSina = () => import(/* webpackChunkName: "cardSina" */'@/views/Auth/bindCardSina/province.vue')
const CitySina = () => import(/* webpackChunkName: "cardSina" */'@/views/Auth/bindCardSina/city.vue')
const BankListSina = () => import(/* webpackChunkName: "cardSina" */'@/views/Auth/bindCardSina/bankList.vue')

const BorrowMoney = () => import('@/views/borrowMoney/index.vue') // 借款页
const BorrowSubmit = () => import('@/views/borrowMoney/borrowSubmit.vue') // 借款审核中
const HistoryPage = () => import('@/views/HistoryPage/HistoryPage.vue') // 账单 已结清

const myBill = () => import(/* webpackChunkName: "bill" */'@/views/MyBill/MyBill') // 我的账单
const OrderPlanDetailSet = () => import(/* webpackChunkName: "bill" */'@/views/MyBill/OrderPlanDetailSet') // 合并账单详情
const OrderPlanDetail = () => import(/* webpackChunkName: "bill" */'@/views/MyBill/OrderPlanDetail') // 独立账单详情
const MyBillPaySuccess = () => import('@/views/MyBill/MyBillPaySuccess.vue') // 账单还款成功页

const Classify = () => import(/* webpackChunkName: "class" */'@/views/Classify/Classify.vue') // 分类
const ClassifyList = () => import(/* webpackChunkName: "class" */'@/views/Classify/ClassifyList.vue')
const ClassifyRank = () => import(/* webpackChunkName: "class" */'@/views/Classify/ClassifyRank.vue')
const ClassifySearch = () => import(/* webpackChunkName: "class" */'@/views/Classify/ClassifySearch.vue') // 我的页面

const ProtocolList = () => import('@/views/UserCenter/protocolList.vue') // 相关协议
const moreProtocol = () => import('@/views/UserCenter/moreProtocol.vue') // 水母相关协议

const RedPackets = () => import('@/views/RedPackets/RedPackets.vue') // 红包入口

const WithdrawPage = () => import('@/views/RedPackets/WithdrawPage/WithdrawPage.vue') // 提现页面

const couponRule = () => import('@/views/ShoppingMall/couponRule.vue') // 领券规则
Vue.use(Router)
const deployName = process.env.VUE_APP_DEPLOY_ROUTER_PATH
const router = new Router({
  mode: 'history',
  base: deployName,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    {
      path: '/',
      redirect: {
        name: 'shopHome'
      },
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        keepAlive: true
      },
      children: [
        {
          path: '/home/shopHome/:flag?', // flag 制作一个中间页面
          name: 'shopHome',
          component: shopHome,
          meta: {
            keepAlive: true,
            title: '分期商城'
          }
        },
        {
          path: '/home/facescard',
          name: 'Facescard',
          component: Facescard,
          meta: {
            title: '颜值卡'
          }
        },
        {
          path: '/home/userCenter',
          name: 'userCenter',
          component: UserCenter,
          meta: {
            title: '我的'
          }
        }
      ]
    },
    {
      path: '/address',
      name: 'Address',
      component: Address,
      meta: {
        title: '收货地址'
      }
    },
    {
      path: '/addressEdit',
      name: 'AddressEdit',
      component: AddressEdit,
      meta: {
        title: '编辑收货地址'
      }
    },
    {
      path: '/shopCar',
      name: 'shopCar',
      component: shopCar,
      meta: {
        title: '购物车'
      }
    },
    {
      path: '/orderfill',
      name: 'OrderFill',
      component: OrderFill,
      meta: {
        title: '订单填写',
        keepAlive: true,
        isBack: false
      }
    },
    {
      path: '/orderfillCoupon',
      name: 'OrderFillCoupon',
      component: OrderFillCoupon,
      meta: {
        title: '我的优惠券'
      }
    },
    {
      path: '/pay/:orderCode',
      name: 'OrderPay',
      component: OrderPay,
      meta: {
        keepAlive: true,
        isBack: false,
        title: '小象收银台'
      }
    },
    {
      path: '/freeList',
      name: 'OrderPayFreeList',
      component: OrderPayFreeList,
      meta: {
        title: '我的优惠券'
      }
    },
    {
      path: '/payInfoList',
      name: 'OrderPayInfoList',
      component: OrderPayInfoList,
      meta: {
        title: '分期计划明细'
      }
    },
    {
      path: '/directPay/:orderCode',
      name: 'OrderDirectPay',
      component: OrderDirectPay,
      meta: {
        title: '小象收银台'
      }
    },
    {
      path: '/paysuccess',
      name: 'OrderPaySuccess',
      component: OrderPaySuccess,
      meta: {
        title: '支付成功'
      }
    },
    {
      path: '/detail/:id/:goodSource',
      name: 'GoodsDetail',
      component: GoodsDetail,
      meta: {
        title: '商品详情'
      }
    },
    {
      path: '/group/:id/type/:category',
      name: 'Ground',
      component: Ground,
      meta: {
        keepAlive: true,
        isBack: false,
        title: '分期商城'
      }
    },
    {
      path: '/group/:id',
      name: 'GroundNormal',
      component: GroundNormal,
      meta: {
        keepAlive: true,
        isBack: false,
        title: '分期商城'
      }
    },
    {
      path: '/classify',
      name: 'Classify',
      component: Classify,
      redirect: { name: 'ClassifyList' },
      children: [
        {
          path: '/classify/list',
          name: 'ClassifyList',
          component: ClassifyList,
          meta: {
            title: '搜索'
          }
        },
        {
          path: '/classify/rank/:id',
          name: 'ClassifyRank',
          component: ClassifyRank,
          meta: {
            keepAlive: true,
            isBack: false
          }
        },
        {
          path: '/classify/search',
          name: 'ClassifySearch',
          component: ClassifySearch,
          meta: {
            title: '搜索'
          }
        }
      ]
    },
    {
      path: '/InvitationOther', // 分享邀请
      name: 'InvitationOther',
      component: InvitationOther,
      meta: {
        title: '小象颜值卡'
      }
    },
    {
      path: '/invitationSuccess', // 分享邀请
      name: 'InvitationSuccess',
      component: InvitationSuccess,
      meta: {
        title: '小象颜值卡'
      }
    },
    {
      path: '/GetCode', // 忘记支付密码
      name: 'GetCode',
      component: GetCode,
      meta: {
        title: '手机安全验证'
      }
    },
    {
      path: '/SetPassword', // 设置支付密码
      name: 'SetPassword',
      component: SetPassword,
      meta: {
        title: '设置密码'
      }
    },
    {
      path: '/MyCoupon', // 我的优惠券
      name: 'MyCoupon',
      component: MyCoupon,
      meta: {
        title: '我的优惠券'
      }
    },
    {
      path: '/UserCardAuth',
      name: 'UserCardAuth',
      component: UserCardAuth,
      meta: {
        title: '实名认证'
      }
    },
    {
      path: '/emergencyContact', // 紧急联系人
      name: 'EmergencyContact',
      component: EmergencyContact,
      meta: {
        title: '紧急联系人上传'
      }
    },
    {
      path: '/IdCardAuth',
      name: 'IdCardAuth',
      component: IdCardAuth,
      meta: {
        title: '清关信息'
      }
    },
    {
      path: '/BorrowMoney', // 借款
      name: 'BorrowMoney',
      component: BorrowMoney,
      meta: {
        title: '颜值卡借款'
      }
    },
    {
      path: '/borrowSubmit', // 借款提交中
      name: 'borrowSubmit',
      component: BorrowSubmit,
      meta: {
        title: '颜值卡借款'
      }
    },
    {
      path: '/UseRecords', // 使用记录
      name: 'UseRecords',
      component: UseRecords,
      meta: {
        title: '额度明细'
      }
    },
    {
      path: '/HistoryPage', // 借款记录
      name: 'HistoryPage',
      component: HistoryPage,
      meta: {
        title: '借款记录'
      }
    },
    {
      path: '/WorkMsg', // 工作信息
      name: 'WorkMsg',
      component: WorkMsg,
      meta: {
        title: '工作信息'
      }
    },
    {
      path: '/OperatorAccredit', // 运营商授权
      name: 'OperatorAccredit',
      component: OperatorAccredit,
      meta: {
        title: '运营商实名认证授权'
      }
    },
    {
      path: '/OffenUseAccredit', // 常用手机号授权
      name: 'OffenUseAccredit',
      component: OffenUseAccredit,
      meta: {
        title: '运营商补充认证'
      }
    },
    {
      path: '/ForgetPassword', // 忘记服务密码
      name: 'ForgetPassword',
      component: ForgetPassword
    },
    {
      path: '/BindingCard', // 新浪绑卡
      name: 'BindingCard',
      component: BindingCard,
      meta: {
        title: '绑卡'
      }
    },
    {
      path: '/BindCardYiBao', // 易宝绑卡
      name: 'BindCardYiBao',
      component: BindCardYiBao,
      meta: {
        title: '绑卡',
        keepAlive: true
      }
    },
    {
      path: '/BankList', // 易宝绑卡银行列表
      name: 'BankList',
      component: BankList,
      meta: {
        title: '绑卡'
      }
    },
    {
      path: '/ZhiMaAuth', // 芝麻信用授权
      name: 'ZhiMaAuth',
      component: ZhiMaAuth,
      meta: {
        title: '芝麻信用授权'
      }
    },
    {
      path: '/StudentAuth',
      name: 'StudentAuth',
      component: StudentAuth,
      meta: {
        title: '学信网授权'
      }
    },
	  {
		  path: '/XiaoyingSign', // 小赢签约
		  name: 'XiaoyingSign',
		  component: XiaoyingSign,
      meta: {
        title: '小赢资料补充'
      }
	  },
	    {
		  path: '/JieKuanQueRenShu', // 借款确认书
		  name: 'JieKuanQueRenShu',
		  component: JieKuanQueRenShu
	  },
    {
		  path: '/ShowHtml', // 协议展示
		  name: 'ShowHtml',
		  component: ShowHtml
	  },
	  // 新浪代扣通道绑卡
	  {
		  path: '/BindCardSina',
		  name: 'BindCardSina',
		  component: BindCardSina,
      meta: {
        title: '绑卡'
      }
	  },
    {
		  path: '/ProvinceSina', // 省列表
		  name: 'ProvinceSina',
		  component: ProvinceSina,
      meta: {
        title: '绑卡'
      }
	  },
    {
		  path: '/CitySina', // 市列表
		  name: 'CitySina',
		  component: CitySina,
      meta: {
        title: '绑卡'
      }
	  },
	  {
		  path: '/BankListSina', // 银行
		  name: 'BankListSina',
		  component: BankListSina,
      meta: {
        title: '绑卡'
      }
	  },

    // 颜值卡组件end
    // 订单组件start
    {
      path: '/orderlist/:type',
      name: 'OrderList',
      component: OrderList,
      meta: {
        keepAlive: true,
        isBack: false
      }
    },
    {
      name: 'OrderDetail',
      path: '/order/detail/:orderCode',
      component: OrderDetail,
      meta: {
        title: '订单详情'
      }
    },
    {
      name: 'OrderRepayment',
      path: '/OrderRepayment',
      component: OrderRepayment
    },
    {
      name: 'orderLogistics', // 物流信息
      path: '/order/orderLogistics/:orderCode',
      component: orderLogistics,
      meta: {
        title: '物流信息'
      }
    },
    {
      path: '/orderPlanDetail/:orderCode/:type/:status',
      name: 'orderPlanDetail',
      component: OrderPlanDetail
    },
    {
      path: '/orderPlanDetailSet/:id/:billNum/:status',
      name: 'orderPlanDetailSet',
      component: OrderPlanDetailSet
    },
    {
      path: '/myBill', // 我的账单
      name: 'myBill',
      component: myBill,
      meta: {
        title: '我的账单'
      }
    },
    {
      path: '/MyBillPaySuccess', // 还款成功
      name: 'MyBillPaySuccess',
      component: MyBillPaySuccess,
      meta: {
        title: '还款成功'
      }
    },
    {
      path: '/protocolList', // 协议列表
      name: 'protocolList',
      component: ProtocolList,
      meta: {
        title: '相关服务协议'
      }
    },
    {
      path: '/moreProtocol', // 水母相关协议
      name: 'moreProtocol',
      component: moreProtocol,
      meta: {
        title: '水母相关协议'
      }
    },
    {
      path: '/RedPackets', // 分期商城红包提现
      name: 'RedPackets',
      component: RedPackets,
      meta: {
        title: '分期商城红包提现'
      }
    },
    {
      path: '/WithdrawPage', // 分期商城红包提现
      name: 'WithdrawPage',
      component: WithdrawPage,
      meta: {
        title: '分期商城红包提现'
      }
    },
    {
      path: '/couponRule', // 活动规则
      name: 'couponRule',
      component: couponRule,
      meta: {
        title: '活动规则'
      }
    }
  ]
})

// const persistentQuerys = ['ADTAG', '']

// 注册一个全局前置守卫,确保要调用 next 方法，否则钩子就不会被 resolved
// router.beforeEach((to, from, next) => {
//   // 判断该页面有channel
//   if (from.query.ADTAG) {
//     // 路由切换时，如果没有就添加，有就跳过执行，添加固定参数
//     if (!to.query.ADTAG) {
//       // 准备一个跳转的query对象
//       let query = to.query
//       query.ADTAG = from.query.ADTAG
//       next({
//         path: to.path,
//         query: query
//       })
//     } else {
//       next()
//     }
//   } else {
//     next()
//   }
// })

export default router

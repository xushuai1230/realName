import { api, post, get, fromUrlcode } from '@/module/request'
import { businessError } from '@/module/perr'

export default {
  state: {
    userIdentity: {
      // 用户信息
      token: '',
      userId: null
    },
    uid: null,
    userMark: null,
    // 颜值卡start
    linkMeLoadStatus: false, // 加载深度链接状态
    fileImg: null,
    isPhotograph: null,
    authorization: null, // 是否授权
    wxSign: null,
    isWxAuth: false,
    listHeight: null,
    listHeightLimit: false,
    nextTickListHeight: null,
    wxBindUser: false, // 区别老用户,true微信端是老用户
    searchName: '',
    // 颜值卡end
    // 订单start
    orderList: [],
    orderList2: [],
    OrderRepayment: {},
    isCarMask: false,
    tabPaneIndex: 0,
    userJonMsg: null,
    nowSysTemTime: null, // 服务器时间戳
    updateInfoContrl: false, // 控制orderDetil 页面的刷新
    trainCancelOrder: false, // 倒计时时间归0时取消订单
    trainReturnInfo: null,
    trainLoadingContrl: null, // 控制火车票刷新loading
    hotelEveryDayInfo: null, // 酒店每天价格数据
    deductAmount: null, // 抵扣金总额
    orderFilters: { // 订单过滤条件
      orderStatus: 0,
      orderClass: 0
    },
    loadMarketBtnShow: false,
    pageTotal: null,
    changOrderCode: '',
    scrollTop: 0,
    loginStatus: false,
    bankYibao: '', // 易宝银行
    VuexShopHomeScrollTop: 0,
    provinceSina: '', // 新浪代扣卡省
    provinceCodesSina: '', // 新浪代扣卡省编号
    citySina: '', // 新浪代扣卡市
    cityCodesSina: '', // 新浪代扣卡市编号
    bankNameSina: '', // 新浪代扣卡银行名称
    bankCodeSina: '', // 新浪代扣卡银行编号
    iphoneX: false,
    loginChannel: null, // 登录渠道号
    youmenChannel: null, // 友盟统计渠道号
    oldEntryDialogStatus: false, // 老入口弹窗状态
    oldEntryStatus: null, // 老入口状态 1: 老用户还款提醒. 2: 您的账单即将到期. 3: 您的账单已逾期
    sinaFenqiH5Url: null,
    couponPrizeCode: null, // 红包飞优惠券类型--页面渠道标识
    showCouponDialog: false, // 显示红包飞优惠券弹框
    weiboExchangeStatus: null, // 微博红包飞活动领取状态（只有是红包飞活动渠道才返回此字段） 1：领取成功；2：已领取过；3：红包已发完；4：老用户不能领取现金红包，改为发现金券
    redPacketsLogin: false, // 红包领取登录状态
    showOldUserDialog: false, // 优惠券页老用户弹框
    dragStatus: false, // 控制小把手显示隐藏
    dragPos: {
      right: 0,
      bottom: 0
    },
    couponDialogLogin: false, // 用于首页红包飞登录
    newUserDragStatus: false, // 新人用户小把手显示
    newUserDragPos: {
      right: 0,
      bottom: 0
    },
    showNewUserDialogStatus: false, // 新人领券弹框展示
    showCouponToUseDialog: false, // 你有以下优惠券待使用弹框 展示
    loginFlag: '', // 标记从新人领券登录，用于跳转优惠券
    hadCouponFlag: '', // 新人福利包已获取弹框 判断规则
    showHadCouponDialog: false, // 新人福利包已获取弹框
    mianxiActive: false, // 新人免息券是否有效
    firstOpenFlag: true // 待使用弹框 控制
  },
  getters: {
    userToken: state => {
      return state.userIdentity.token
    },
    userId: state => {
      return state.userIdentity.userId
    },
    userWeiboMark (state) {
      return state.userMark
    },
    // 订单start
    loadMarketBtnShow: state => {
      return state.loadMarketBtnShow
    },
    getNowSysTemTime: state => {
      return state.nowSysTemTime
    },
    juxtaposeTime: (store) => (inputTime) => {
      // 对比时间
      if (store.nowSysTemTime === null) {
        return true
      } else if (store.nowSysTemTime > inputTime) {
        return true
      } else {
        return false
      }
    },
    getCouponPrizeCode: (store) => {
      // 红包飞优惠券类型--页面渠道标识
      return store.couponPrizeCode
    },
    getShowCouponDialogStatus: (store) => {
      return store.showCouponDialog
    },
    haveRedPackets: (store) => {
      // 判断是否是 领取的是 红包 且领取成功
      let weiboExchangeStatus = store.weiboExchangeStatus
      let loginChannel = store.loginChannel
      if (loginChannel === '353' && weiboExchangeStatus === 1) {
        return true
      } else {
        return false
      }
    }
    // 订单end
  },
  mutations: {
    setDragPos (state, dragPos) {
      state.dragPos = dragPos
    },
    setDragStatus (state, status) {
      state.dragStatus = status
    },
    setSinaFenqiH5Url (state, status) {
      state.sinaFenqiH5Url = status
    },
    setOldEntryStatus (state, status) {
      state.oldEntryStatus = status
    },
    setOldDialogEntryStatus (state, status) {
      state.oldEntryDialogStatus = status
    },
    setLoginChannel (state, data) {
      state.loginChannel = data
    },
    setYoumenChannel (state, data) {
      state.youmenChannel = data
    },
    setIphoneX (state, data) {
      state.iphoneX = data
    },
    muUserMetaInfo (state, userInfo) {
      state.userIdentity = { ...state.userIdentity, ...userInfo }
    },
    muWxSign (state, data) {
      state.wxSign = data
    },
    muIsWxAuth (state, data) {
      state.isWxAuth = data
    },
    muWxBindUser (state, data) {
      state.wxBindUser = data
    },
    muListHeight (store, data) {
      if (store.listHeightLimit) return
      store.listHeight = data
      store.listHeightLimit = true
    },
    muNextTickListHeight (store, data) {
      store.nextTickListHeight = data
    },
    setFileImg (store, data) {
      store.fileImg = data
    },
    setPhotograph (store, data) {
      store.isPhotograph = data
    },
    setSearchName (store, obj) {
      console.log('setSearchName', obj)
      let data = obj.name
      let tag = obj.tag
      if (!tag) {
        let historySearchList = window.sessionStorage.getItem('historySearchList')
        if (historySearchList) {
          historySearchList = JSON.parse(historySearchList)
          if (historySearchList.indexOf(data) === -1) historySearchList.push(data)
        } else {
          historySearchList = []
          historySearchList.push(data)
        }
        historySearchList = JSON.stringify(historySearchList)
        window.sessionStorage.setItem('historySearchList', historySearchList)
      }
      store.searchName = data
    },
    // 订单start
    syncTabPaneIndex (store, ind) {
      store.tabPaneIndex = ind
    },
    syncisCarMask (store, data) {
      store.isCarMask = data
    },
    setScrollTop (store, data) {
      store.scrollTop = data
    },
    // 替换list
    setOrderList (state, data) {
      state.orderList = data
    },
    // 拼接list数据
    setOrderListPush (state, data) {
      state.orderList.push(...data)
    },
    setOrderListChange (state, data) {
      let tempArr = JSON.parse(JSON.stringify(state.orderList))
      console.log(tempArr, 'oldtempArr')
      if (data.length === 0) {
        for (let i = 0; i < tempArr.length; i++) {
          let item = tempArr[i]
          if (item.orderCode === state.changOrderCode) {
            tempArr.splice(i, 1)
            break
          }
        }
      } else {
        for (let i = 0; i < tempArr.length; i++) {
          let item = tempArr[i]
          if (item.orderCode === state.changOrderCode) {
            item = data[0]
            break
          }
        }
      }
      console.log(tempArr, 'newtempArr')
      state.orderList = tempArr
      state.changOrderCode = ''
    },
    // 点击订单详情订单号记录
    setChangOrderCode (state, data) {
      state.changOrderCode = data
    },
    // 总条数
    setPageTotal (state, data) {
      console.log(data, 'setPageTotal')
      state.pageTotal = data
    },
    setOrderList2 (state, data) {
      state.orderList2 = data
    },
    muUserIdentity (state, data) {
      state.userIdentity = {
        ...state.userIdentity,
        ...data
      }
    },
    getOrderRepayment (state, data) {
      state.OrderRepayment = data
    },
    muUserJonMsg (store, data) {
      store.userJonMsg = data
    },

    syncNowSysTemTime (store, data) {
      store.nowSysTemTime = data
    },
    syncUpdateTrainInfo (store, data) {
      store.updateTrainInfo = !store.updateTrainInfo
    },
    updateInfo (store) {
      store.updateInfoContrl = !store.updateInfoContrl
    },
    updateTrainCancelOrder (store) {
      store.trainCancelOrder = !store.trainCancelOrder
    },
    synctrainReturnInfo (store, data) {
      store.trainReturnInfo = data
    },
    syncTrainLoadingContrl (store) {
      store.trainLoadingContrl = !store.trainLoadingContrl
    },
    synchotelEveryDayInfo (store, data) {
      store.hotelEveryDayInfo = data
    },
    muDeductAmount (store, data) {
      store.deductAmount = data
    },
    muOrderFilters (store, data) {
      console.log(store.orderFilters, 'orderFilters')
      console.log(data, 'data')
      store.orderFilters = { ...store.orderFilters, ...data }
      console.log(store.orderFilters, 'store.orderFilters')
    },
    setloadMarketBtn (store, data) {
      store.loadMarketBtnShow = data
    },
    setLinkMeLoadStatus (state, status) {
      state.linkMeLoadStatus = status
    },
    setLoginStatus (state, status) {
      state.loginStatus = status
    },
    tokenLoginOut (state, status) {
      // 用户退出，清空token
      state.userIdentity.token = null
      state.userIdentity.userId = null
    },
    setUserId (state, status) {
      state.userIdentity.userId = status
    },
    // 订单end
    // 易宝银行mutation
    backYiBaoBindCard (state, item) {
      state.bankYibao = item.value
    },
    // 首页
    // 记录滚动条
    setVuexShopHomeScrollTop (state, item) {
      state.VuexShopHomeScrollTop = item
    },
    // 绑新浪代扣 省份
	  chooseProvinceSina (state, item) {
      state.provinceSina = item.fullName
      state.provinceCodesSina = item.code
    },
	  // 绑新浪代扣 城市
	  chooseCitySina (state, item) {
		  state.citySina = item.fullName
		  state.cityCodesSina = item.code
	  },
    // 绑新浪代扣 城市
	  bankSina (state, item) {
		  state.bankNameSina = item.bankName
		  state.bankCodeSina = item.bankCode
    },
    muUserMark (state, data) {
      state.userMark = data
    },
    muUid (state, data) {
      state.uid = data
    },
    setCouponPrizeCode (state, data) {
      // 修改红包飞 展示券类型
      state.couponPrizeCode = data
    },
    setShowCouponDialogStatus (state, status) {
      console.log('setShowCouponDialogStatus', status)
      // 修改优惠券弹框状态
      state.showCouponDialog = status
    },
    setWeiboExchangeStatus: (state, data) => {
      // 红包飞领券状态
      state.weiboExchangeStatus = data
    },
    setRedPacketsLogin: (state, data) => {
      // 红包领取登录状态修改
      state.redPacketsLogin = data
    },
    setOldUserDialog: (state, data) => {
      state.showOldUserDialog = data
    },
    setCouponDialogLogin: (state, data) => {
      state.couponDialogLogin = data
    },
    setNewUserDragStatus: (state, data) => {
      state.newUserDragStatus = data
    },
    setNewUserDragPos: (state, data) => {
      state.newUserDragPos = data
    },
    setShowNewUserDialogStatus: (state, data) => {
      // 首页新人领券弹框
      state.showNewUserDialogStatus = data
    },
    setshowCouponToUseDialog: (state, data) => {
      // 待使用弹框
      state.showCouponToUseDialog = data
    },
    setLoginFlag: (state, data) => {
      state.loginFlag = data
    },
    setHadCouponFlag: (state, data) => {
      state.hadCouponFlag = data
    },
    setShowHadCouponDialog: (state, data) => {
      state.showHadCouponDialog = data
    },
    setMianxiActive: (state, data) => {
      // 新人免息券是否有效
      state.mianxiActive = data
    },
    setFirstOpenFlag: (state, data) => {
      state.firstOpenFlag = data
    }
  },
  actions: {
    // 订单start
    apiPushList (context, params) {
      console.log(context, 'context')
      console.log(params, 'params')
      return npromise(function (resolve, reject) {
        post(api.neworderList, fromUrlcode(params)).then(res => {
          if (res.data.list) {
            console.log(res.data, 'res.data')
            res.data.list.forEach(item => { item.typeShow = true; item.stateShow = true })
            context.commit('setOrderListPush', res.data.list)
            context.commit('setPageTotal', res.data.total)
            resolve()
          } else {
            reject('err')
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    apiNewOrderList (context, params) {
      console.log(context, 'context')
      console.log(params, 'params')
      return npromise(function (resolve, reject) {
        post(api.neworderList, fromUrlcode(params)).then(res => {
          if (res.data.list) {
            console.log(res.data, 'res.data')
            res.data.list.forEach(item => { item.typeShow = true; item.stateShow = true })
            console.log(context.state.changOrderCode, 'context.state.changOrderCode')
            if (context.state.changOrderCode) {
              context.commit('setOrderListChange', res.data.list)
              context.commit('setPageTotal', res.data.total)
            } else {
              context.commit('setOrderList', res.data.list)
              context.commit('setOrderList2', res.data.list)
              context.commit('setPageTotal', res.data.total)
            }
            resolve()
          } else {
            reject('err')
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    apiGetOrderList (context, params) {
      console.log(context, 'context')
      console.log(params, 'params')
      return npromise(function (resolve, reject) {
        get(api.orderList, { params }).then(res => {
          // console.log(res)
          if (res.orders) {
            res.orders.forEach(item => { item.typeShow = true; item.stateShow = true })
            console.log(res.orders, 'res.orders')
            context.commit('setOrderList', res.orders)
            context.commit('setOrderList2', res.orders)
            resolve()
          } else {
            reject('err')
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    apiCheckUserJobInfo (context, token) {
      return npromise(function (resolve, reject) {
        post(api.isSuppJobinfo, fromUrlcode({
          token,
          reqType: 2
        })).then(body => {
          context.commit('muUserJonMsg', body)

          resolve()
        }).catch(businessError)
      })
    },
    apiloadMarketShow (context, token) {
      post(api.loadMarketShow + '?token=' + token)
        .then(res => {
          context.commit('setloadMarketBtn', res.data)
        })
        .catch(err => {
          console.log(err)
        })
    }
    // 订单end
  }
}
/**
 * 创建 Promise 对象
 * @param {*Function} fn
 */
function npromise (fn) {
  return new Promise(function (resolve, reject) {
    fn(resolve, reject)
  })
}

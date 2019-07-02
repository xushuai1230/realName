<template>
	<div class="OrderList">
		<van-pull-refresh v-model="pullRefreshLoading" @refresh="onRefresh" ref="refresh">
			<van-tabs v-model="status" sticky swipeable @change="navChange" @scroll="scroll">
				<van-tab :title="item" v-for="(item, index) in tabsData" :key="index">
					<div slot="title" ref="title">
						{{item}}
					</div>
					<div class="OrderList__container" :class="{ifTipsShow: index === 0 && isSupp && reqReady}" ref="container" v-show="reqReady && !pageLoadErr">
						<div class="tips clearfix" v-show="index === 0 && isSupp" ref="tips" @click="jumpToSupp">
							<div class="left fl">
								<img src="~@/assets/img/order/list_disclosure_indicator_nol_brown@3x.png" alt="">
							</div>
							<div class="middle fl">
								{{rmkInfo}}
							</div>
							<div class="right fr">
								<img src="~@/assets/img/order/list_disclosure_indicator_nol_zong@3x.png" alt="">
							</div>
						</div>
						<div class="list" v-if="_orderList && _orderList.length">
							<van-list v-model="loading" :finished="finished" @load="onLoad" class="list">
								<order-list-item v-for="(item, index) in _orderList" :key="index" :order="item" :type="type"></order-list-item>
							</van-list>
						</div>
						<no-order v-else></no-order>
					</div>
					<div class="pageLoadErr" v-show="pageLoadErr" ref="pageLoadErr">
						<img src="~@/assets/img/order/blankpage_img_order@3x.png">
						<p>{{pageLoadErr}}<br>请尝试更换新的网络或者至"我的"-"联系客服"，联系客服处理</p>
					</div>
				</van-tab>
			</van-tabs>
		</van-pull-refresh>
	</div>
</template>

<script>
import NoOrder from '@/components/NoOrder/NoOrder'
import OrderListItem from './components/OrderListItem'
import loginMixin from '@/mixins/login'

export default {
  name: 'OrderList',
  mixins: [loginMixin],
  data () {
    return {
      tabsData: [
        '全部',
        '待付款',
        '待发货',
        '待收货'
      ],
      type: 0,
      status: '',
      startNum: 0,
      pageCount: '',
      reqReady: false,
      pullRefreshLoading: false, // 下拉刷星
      loading: false,
      finished: false,
      orderList: null,
      realNameData: null,
      pageLoadErr: '',
      SuppJobinfo: null,
      isFirstEnter: false,
      isEnter: true,
      changOrderCode: null
    }
  },
  computed: {
    isSupp () {
      return this.SuppJobinfo && this.SuppJobinfo.isSupp
    },
    rmkInfo () {
      return this.SuppJobinfo && this.SuppJobinfo.rmkInfo
    },
    isFilterEmpty () {
      let status = true
      for (let item of this.orderList) {
        if (item.typeShow && item.stateShow) {
          status = false
          break
        }
      }
      return status
    },
    xiangyongjiBol () {
      let ua = navigator.userAgent.toLocaleLowerCase()
      return !ua.match('xiangyongji')
    },
    _orderList () {
      const list = this.orderList && this.orderList.filter(item => {
        switch (this.status) {
          case 1: // 待付款
            return item.orderStatus === 0
          case 2: // 待发货
            return item.orderStatus === 40 || item.orderStatus === 41 || item.orderStatus === 46
          case 3: // 待收货
            return item.orderStatus === 51
          default: // 全部订单 1
            return true
        }
      })
      return list
    }
  },
  async created () {
    this.isFirstEnter = true
  },
  mounted () {
    global.vbus.$on('setChangOrderCode', (resData) => {
      console.log('我拿到数据了', resData)
      this.changOrderCode = resData
      if (resData !== null) {
        this.queryOrderListByOrderCode(resData)
      }
    })
    this.$nextTick(() => {
      this.$refs.refresh.$el.children[0].style.transform = 'none'
      let bodyHeight = document.documentElement.clientHeight
      let titleHeight = this.$refs.title[0].offsetHeight
      this.$refs.container[0].style.minHeight = bodyHeight - titleHeight + 'px'
      this.$refs.pageLoadErr[0].style.minHeight = bodyHeight - titleHeight + 'px'
      this.$refs.tips[0].style.top = titleHeight + 'px'
    })
  },
  async activated () {
    try {
      if (!this.$route.meta.isBack || this.isFirstEnter) {
        let type = 1
        if (this.$route.params.type) type = Number(this.$route.params.type)
        this.status = type - 1
        if (this.status === 0) {
          document.title = '全部'
          this.reqReady = false
          this.reqReset()
          await this.getOrderList(false)
          await this.isSuppJobinfo()
          this.reqReady = true
        } else {
          await this.isSuppJobinfo()
        }
        this.isFirstEnter = false
      }
    } catch (error) {
      this.isFirstEnter = false
      this.reqReady = true
    }
    this.$route.meta.isBack = false
  },
  methods: {
    jumpToSupp () {
      let routerData = JSON.stringify({
        name: this.$route.name,
        path: this.$route.path,
        query: this.$route.query,
        params: this.$route.params
      })
      this.$router.push({
        name: 'WorkMsg',
        query: {
          type: 'router',
          routerData: routerData
        }
      })
    },
    async navChange (index) {
      this.$router.replace({
        name: 'OrderList',
        params: {
          type: index + 1
        }
      })
      let titleArr = ['全部', '待付款', '待发货', '待收货']
      document.title = titleArr[index]
      this.status = index
      this.reqReset()
      this.reqReady = false
      await this.getOrderList(false)
      this.reqReady = true
      window.scrollTo(0, 0)
      this.$nextTick(() => {
        let bodyHeight = document.documentElement.clientHeight
        let titleHeight = this.$refs.title[0].offsetHeight
        this.$refs.container.forEach((item, index) => {
          if (!item.getAttribute('minHeight')) {
            item.style.minHeight = bodyHeight - titleHeight + 'px'
            this.$refs.pageLoadErr[index].style.minHeight = bodyHeight - titleHeight + 'px'
          }
        })
      })
    },
    scroll (obj) {
      if (obj.isFixed && this.$refs.refresh.$el.children[0].style.transform !== 'none') {
        this.$refs.refresh.$el.children[0].style.transform = 'none'
      }
    },
    reqReset () {
      this.startNum = 0
      this.orderList = null
    },
    async onRefresh () {
      // 下拉刷新
      this.reqReset()
      this.reqReady = false
      await this.getOrderList()
      this.reqReady = true
      this.pullRefreshLoading = false
    },
    async onLoad () {
      // 上拉加载
      await this.getOrderList()
    },
    getOrderList (noShowLoading = true) {
      console.log('noShowLoading', noShowLoading)
      if (!this.userToken) {
        this.handlerLogin()
        return false
      }
      return this.$api['order/getOrderList']({
        token: this.userToken,
        startNum: this.startNum,
        status: this.status,
        type: this.type
      }, {
        noShowLoading: noShowLoading
      }).then(res => {
        this.startNum += res.data.pageSize
        this.froms = res.data.froms
        this.finished = res.data.list.length === 0
        if (!this.orderList) this.orderList = res.data.list
        else this.orderList = [...this.orderList, ...res.data.list]
        this.loading = false
      }).catch(err => {
        if (typeof err === 'object') {
          err = String(err)
        }
        this.pageLoadErr = err
      })
    },
    catchErr (promise) {
      return promise.then(data => {
        return [null, data]
      }).catch(err => [err])
    },
    /**
     * 查询数据库是否有该订单
     */
    async queryOrderListByOrderCode (changOrderCode) {
      let err, res
      [err, res] = await this.catchErr(this.$api['order/queryOrderListByOrderCode']({
        token: this.userToken,
        orderCode: changOrderCode
      }))
      if (err) {
        let error = err
        if (err.message) {
          error = err.message
        }
        this.$toast(error)
        return
      }
      if (res && res.data) {
        console.log('查询是否有该数组', res.data.list)
        this.setOrderListChange(res.data.list)
      }
    },
    setOrderListChange (data) {
      let orderList = this.orderList
      let changOrderCode = this.changOrderCode
      let i = 0
      console.log('orderList', orderList)
      if (data.length === 0) { // 如果删除订单,就截取掉该订单
        while (i < orderList.length) {
          console.log(i)
          if (orderList[i].orderCode === changOrderCode) {
            this.orderList.splice(i, 1)
            break
          }
          i++
        }
      } else { // 如果取消订单就更换该订单状态
        while (i < orderList.length) {
          console.log(i)
          if (orderList[i].orderCode === changOrderCode) {
            this.orderList.splice(i, 1, data[0])
            break
          }
          i++
        }
      }
      this.changOrderCode = null
    },
    // 获取是否需要请求实名信息补偿接口
    isSuppJobinfo () {
      return this.$api['order/isSuppJobinfo']({
        token: this.userToken
      }).then(res => {
        this.SuppJobinfo = res
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    console.log('beforeRouteEnter')
    if (from.name === 'OrderDetail') {
      to.meta.isBack = true
    }
    to.meta.keepAlive = true
    next()
  },
  beforeRouteLeave (to, from, next) {
    if (to.name !== 'OrderDetail') {
      global.appIns.alive = false
      from.meta.keepAlive = false
      this.$nextTick(() => {
        global.appIns.alive = true
      })
    }
    next()
  },
  components: {
    NoOrder,
    OrderListItem
  }
}
</script>

<style lang="scss">
.OrderList {
  .van-tab {
    font-size: 0.346667rem;
    line-height: 0.96rem;
    &--active {
      color: #ed145b;
    }
  }
  .van-tabs {
    &--line {
      padding-top: 0.96rem;
    }
    &__wrap {
      height: 0.96rem !important;
    }
    &__line {
      background-color: rgba(245, 75, 120, 1);
      height: 0.066667rem;
      border-radius: 0.053333rem;
    }
  }
}
</style>
<style lang="scss" scoped>
.OrderList {
  box-sizing: border-box;
  &__container {
    background-color: #f2f2f2;
    &.ifTipsShow {
      padding-top: 70px;
    }
    .tips {
      position: fixed;
      top: 0.96rem;
      left: 0;
      width: 100%;
      height: 70px;
      padding: 13px 30px;
      background: #FFF5D9;
      font-size: 0;
      text-align: left;
      z-index: 100;
      box-sizing: border-box;
      .left {
        margin-right: 10px;
      }
      .left,
      .right {
        width: 44px;
        height: 44px;
        img {
          display: block;
        }
      }
      .middle {
        font-size: 28px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: #C8732C;
        line-height: 44px;
      }
    }
    .list {
      margin-top: 20px;
    }
  }
  .pageLoadErr {
    text-align: center;
    margin-top: 1rem;
    font-size: 0.38rem;
    img {
      width: 4.8rem;
      height: 4.8rem;
    }
    p {
      width: 600px;
      margin: 0 auto;
    }
  }
}
</style>

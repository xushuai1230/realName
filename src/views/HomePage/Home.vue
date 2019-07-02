<template>
	<div class="home">
		<router-view></router-view>
		<div class="tabColumn" ref="tabs">
			<ul class="border border-top">
				<li @click="switchTabName('shopHome', 0)" :class="{red: tabIndex === 0}">
					<p>
						<img v-if="tabIndex === 0" src="../../assets/img/shoppingmall2@3x.png" alt="">
						<img v-else src="../../assets/img/shoppingmall@3x.png" alt="">
					</p>
					商城
				</li>
				<!-- <li @click="switchTabName('Classify', 1)" :class="{red: tabIndex === 1}">
            <p>
              <img v-if="tabIndex === 1" src="../../assets/img/shoppingmall2@3x.png" alt="">
              <img v-else src="../../assets/img/shoppingmall@3x.png" alt="">
            </p>
            分类
          </li> -->
				<li @click="switchTabName('facescard' , 2)" :class="{red: tabIndex === 2}">
					<p>
						<img v-if="tabIndex === 2" src="../../assets/img/facecard2@3x.png" alt="">
						<img v-else src="../../assets/img/facecard@3x.png" alt="">
					</p>
					颜值卡
				</li>
				<li @click="switchTabName('userCenter', 3)" :class="{red: tabIndex === 3}">
					<p>
						<img v-if="tabIndex === 3" src="../../assets/img/mine2@3x.png" alt="">
						<img v-else src="../../assets/img/mine@3x.png" alt="">
						<span v-if="isChange"></span>
					</p>
					我的
				</li>
			</ul>
		</div>
		<dragBtn v-show="dragStatus && tabIndex === 0" :parentH="parentH"></dragBtn>
    <newUserDragBtn v-show="newUserDragStatus && tabIndex === 0" :parentH="parentH"></newUserDragBtn>
	</div>
</template>

<script>
import { getScrollTop } from '@/module/common'
import { mapMutations, mapState } from 'vuex'
import dragBtn from '@/components/dragBtn/dragBtn'
import newUserDragBtn from '@/components/dragBtn/newUserDragBtn'
export default {
  name: 'Home',
  data () {
    return {
      componentId: 'ShoppingMall',
      tabIndex: 0,
      isChange: false, // 我的页面是否有状态更改
      isIphoneX: false,
      parentH: 0
    }
  },
  computed: {
    ...mapState(['dragStatus', 'dragPos', 'newUserDragStatus', 'showHadCouponDialog'])
  },
  mounted () {
    this.getBottomHeight()
    // 存储新人福利包已获取的打开状态
    let firstHadCoupon = localStorage.getItem('firstHadCoupon')
    if (firstHadCoupon === null) {
      localStorage.setItem('firstHadCoupon', 'true')
    }
  },
  activated () {
    if (this.userToken) {
      this.getOrderInfo()
    }
    this.getBottomHeight()
  },
  watch: {
    '$route.name': {
      handler (val) {
        if (val === 'shopHome') {
          this.tabIndex = 0
        } else if (val === 'Facescard') {
          this.tabIndex = 2
        } else if (val === 'userCenter') {
          this.tabIndex = 3
          this.isChange = false
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations([
      'setVuexShopHomeScrollTop',
      'setDragPos'
    ]),
    switchTabName (name, index) {
      let tabBarRouter = ['shopHome', 'facescard', 'userCenter'] // 需要底部tab的路由组件
      if (name === 'facescard' || name === 'userCenter') {
        const scrollTop = getScrollTop()
        this.setVuexShopHomeScrollTop(scrollTop)
      }
      if (tabBarRouter.indexOf(name) !== -1) {
        this.$router.push({
          path: `/home/${name}`,
          query: {
            noCache: Date.now()
          }
        })
      } else {
        this.$router.push({
          name,
          query: {
            noCache: Date.now()
          }
        })
      }
    },
    getOrderInfo () {
      let storage = window.localStorage
      let changeData = {
        token: this.userToken,
        unpaidOrderCount: storage.getItem('unpaidOrderCount'),
        preparedOrderCount: storage.getItem('preparedOrderCount'),
        deliveredOrderCount: storage.getItem('deliveredOrderCount'),
        couponPreview: storage.getItem('couponPreview'),
        billCount: storage.getItem('billCount'),
        billType: storage.getItem('billType')
      }
      this.$api['mine/getOrderInfo'](changeData).then(res => {
        storage.setItem('unpaidOrderCount', res.data.unpaidOrderCount)
        storage.setItem('preparedOrderCount', res.data.preparedOrderCount)
        storage.setItem('deliveredOrderCount', res.data.deliveredOrderCount)
        if (res.data.couponPreview) {
          storage.setItem('couponPreview', res.data.couponPreview)
        } else if (storage.getItem('couponPreview')) {
          storage.removeItem('couponPreview')
        }
        if (res.data.billCount) {
          storage.setItem('billCount', res.data.billCount)
        } else if (storage.getItem('billCount')) {
          storage.removeItem('billCount')
        }
        if (res.data.billType) {
          storage.setItem('billType', res.data.billType)
        } else if (storage.getItem('billType')) {
          storage.removeItem('billType')
        }
        this.isChange = res.data.changed
      })
    },
    getBottomHeight () {
      let u = navigator.userAgent
      let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
      let safeHeight = 0
      if (isIOS) {
        if ((screen.height === 812 && screen.width === 375) || (screen.height === 896 && screen.width === 414)) {
          safeHeight = 40
        }
      }
      let styler = window.getComputedStyle(this.$refs.tabs, null)
      this.parentH = Number(styler.height.match(/[0-9].*[0-9]/)[0]) + safeHeight
      this.setDragPos({
        right: 0,
        bottom: this.parentH
      })
    }
  },
  components: {
    dragBtn,
    newUserDragBtn
  }
}
</script>

<style lang="scss" scoped>
.pb68 {
  padding-bottom: 68px;
}
.tabColumn {
  position: fixed;
  width: 100%;
  height: 1.306667rem;
  background: #fff;
  bottom: 0;
  left: 0;
  z-index: 999;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  ul {
    font-size: 0;
    text-align: center;
  }
  .red {
    color: #ed145b;
  }
  li {
    display: inline-block;
    font-size: 20px;
    width: 33.3%;
    text-align: center;
    color: #636363;
    p {
      position: relative;
      width: 0.693333rem;
      height: 0.693333rem;
      margin: 0.08rem auto 8px;
      span {
        position: absolute;
        width: 16px;
        height: 16px;
        background: #fe445a;
        border-radius: 50%;
        top: 0;
        right: 0;
      }
    }
  }
}
.border {
  position: relative;
}

.border::after {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  pointer-events: none;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.border-top::after {
  border-top: 1px solid #ccc;
}
</style>

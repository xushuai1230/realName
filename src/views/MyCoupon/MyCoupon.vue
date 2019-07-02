<template>
  <div class="myCoupons">
    <van-tabs v-model="active" @change="tabChange">
      <van-tab :title="'未使用('+num1+')'">
        <span class="illustration" @click="goToUseIllustration">
          <img src="~@/assets/img/shuoming-icon-ab@3x.png" alt="">
          优惠券使用说明
        </span>
        <div class="coupon" v-if="list1.length > 0" v-for="(item, i) in list1" :key="i" :class="{'coupon1':item.type === 1, 'coupon2':item.type === 2}" @click="toUse(item.gotoUrl)">
          <div class="left">
            <h3>{{item.couponName}}</h3>
            <div class="scribe">
              <p v-for="(scribe, index) in item.ruleList" :key="index">{{scribe}}</p>
            </div>
            <p class="time">有效期至：{{item.useDeadline}}</p>
          </div>
          <div class="right">
            <p class="money" v-if="item.type === 1">
              <span>&yen;</span>{{item.unit | cashFilter}}
            </p>
            <p class="money" v-else>
              {{item.unit | freeFilter}}<span>期</span>
            </p>
            <p class="use">去使用</p>
          </div>
        </div>
        <div class="empty" v-if="list1.length === 0">
          <div class="img">
            <img src="~@/assets/img/blankpage_img_search@3x.png" alt="">
          </div>
          <p>暂无数据</p>
        </div>
      </van-tab>
      <van-tab :title="'已使用('+num2+')'">
        <span class="illustration" @click="goToUseIllustration">
          <img src="~@/assets/img/shuoming-icon-ab@3x.png" alt="">
          优惠券使用说明
        </span>
        <div class="coupon coupon3" v-if="list2.length > 0" v-for="(item, i) in list2" :key="i">
          <div class="left">
            <h3>{{item.couponName}}</h3>
            <div class="scribe">
              <p v-for="(scribe, index) in item.ruleList" :key="index">{{item.ruleList.length > 1 ? index + 1 + '.' + scribe : '' + scribe}}</p>
            </div>
            <p class="time">有效期至：{{item.useDeadline}}</p>
          </div>
          <div class="right">
            <p class="money" v-if="item.type === 1">
              <span>&yen;</span>{{item.unit | cashFilter}}
            </p>
            <p class="money" v-else>
              {{item.unit | freeFilter}}<span>期</span>
            </p>
          </div>
        </div>
        <div class="empty" v-if="list2.length === 0">
          <div class="img">
            <img src="~@/assets/img/blankpage_img_search@3x.png" alt="">
          </div>
          <p>暂无数据</p>
        </div>
      </van-tab>
      <van-tab :title="'已过期('+num3+')'">
        <span class="illustration" @click="goToUseIllustration">
          <img src="~@/assets/img/shuoming-icon-ab@3x.png" alt="">
          优惠券使用说明
        </span>
        <div class="coupon coupon3" v-if="list3.length > 0" v-for="(item, i) in list3" :key="i">
          <div class="left">
            <h3>{{item.couponName}}</h3>
            <div class="scribe">
              <p v-for="(scribe, index) in item.ruleList" :key="index">{{item.ruleList.length > 1 ? index + 1 + '.' + scribe : '' + scribe}}</p>
            </div>
            <p class="time">有效期至：{{item.useDeadline}}</p>
          </div>
          <div class="right">
            <p class="money" v-if="item.type === 1">
              <span>&yen;</span>{{item.unit | cashFilter}}
            </p>
            <p class="money" v-else>
              {{item.unit | freeFilter}}<span>期</span>
            </p>
          </div>
        </div>
        <div class="empty" v-if="list3.length === 0">
          <div class="img">
            <img src="~@/assets/img/blankpage_img_search@3x.png" alt="">
          </div>
          <p>暂无数据</p>
        </div>
      </van-tab>
    </van-tabs>
    <oldUser></oldUser>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import oldUser from '../ShoppingMall/oldUser'
export default {
  name: 'MyCoupon',
  data () {
    return {
      active: 0,
      num1: 0, // 未使用总数
      num2: 0, // 已使用总数
      num3: 0, // 已过期总数
      list1: [], // 未使用
      list2: [], // 已使用
      list3: [], // 已过期
      hasGet1: false, // 是否请求过
      hasGet2: false,
      hasGet3: false
    }
  },
  computed: {
    ...mapGetters(['userToken'])
  },
  mounted () {
    this.getList(1)
    window.scrollTo(0, 0)
  },
  methods: {
    getList (a) {
      if ((a === 1 && this.hasGet1) || (a === 2 && this.hasGet2) || (a === 3 && this.hasGet3)) return
      global.vbus.$emit('loading_show', true)
      this.$api['mine/getAllCouponsV2']({
        token: this.userToken,
        queryType: a
      }).then(res => {
        this.num1 = res.couponNumMap.unUseCouponNum
        this.num2 = res.couponNumMap.usedCouponNum
        this.num3 = res.couponNumMap.expiredCouponNum
        if (res.data) {
          if (a === 1) {
            this.list1 = res.data
            this.hasGet1 = true
          } else if (a === 2) {
            this.list2 = res.data
            this.hasGet2 = true
          } else {
            this.list3 = res.data
            this.hasGet3 = true
          }
        } else {
          if (a === 1) {
            this.hasGet1 = true
          } else if (a === 2) {
            this.hasGet2 = true
          } else {
            this.hasGet3 = true
          }
        }
        global.vbus.$emit('loading_show', false)
      })
    },
    goToUseIllustration () {
      location.href = 'https://cdn.basestonedata.com/app/service/newcoupon.html'
    },
    toUse (gotoUrl) {
      console.log(gotoUrl)
      if (gotoUrl.indexOf('tabIndex') !== -1) { // 跳首页
        this.$router.push({
          name: 'shopHome'
        })
      } else if (gotoUrl.indexOf('bannerId') !== -1) { // 跳专场
        let id = gotoUrl.split('=')[1]
        this.$router.push({
          path: `/group/${id}`,
          query: {
            type: 'router',
            method: 'replace',
            routerData: JSON.stringify({
              name: 'MyCoupon'
            }),
            noCache: Date.now()
          }
        })
      } else {
        let id = gotoUrl.split('=')[1]
        this.$router.push({
          path: `/detail/${id}/1`,
          query: {
            type: 'router',
            method: 'replace',
            routerData: JSON.stringify({
              name: 'MyCoupon'
            }),
            noCache: Date.now()
          }
        })
      }
    },
    tabChange (index) {
      console.log(index)
      this.getList(index + 1)
    }
  },
  watch: {
    userToken (val) {
      if (val) {
        this.hasGet1 = false
        this.active = 0
        this.getList(1)
      }
    }
  },
  components: {
    oldUser
  }
}
</script>
<style lang="scss" scoped>
.myCoupons {
  .illustration {
    display: inline-block;
    margin: 28px 269px 23px 270px;
    font-size: 24px;
    line-height: 30px;
    color: #939393;
    img {
      width: 28px;
      height: 28px;
      margin-right: 5px;
    }
  }
  .coupon {
    width: 722px;
    height: 212px;
    margin: 0 auto 12px;
    .left {
      width: 505px;
      float: left;
      height: 100%;
      box-sizing: border-box;
      padding: 26px 0 0 46px;
      h3 {
        font-size: 30px;
        color: #333;
        font-family:PingFangSC-Medium;
        font-weight:500;
        line-height: 42px;
      }
      .scribe {
        height: 70px;
        line-height: 35px;
        font-size: 24px;
        color: #939393;
        font-family:PingFangSC-Regular;
        font-weight:400;
        margin: 6px 0 5px 0;
      }
      .time {
        line-height: 33px;
        font-size: 24px;
        color: #939393;
        font-family:PingFangSC-Regular;
        font-weight:400;
      }
    }
    .right {
      width: 210px;
      height: 100%;
      float: right;
      text-align: center;
      box-sizing: border-box;
      padding-top: 28px;
      .money {
        font-size: 68px;
        height: 95px;
        line-height: 95px;
        font-family:PingFangSC-Semibold;
        font-weight:600;
        span {
          font-size: 28px;
        }
      }
      .use {
        width: 128px;
        height: 40px;
        line-height: 42px;
        border-radius: 22px;
        margin: 5px auto;
      }
    }
  }
  .empty {
    .img {
      width: 360px;
      height: 360px;
      margin: 100px auto 12px;
    }
    p {
      font-size: 28px;
      color: #333;
      text-align: center;
    }
  }
  .coupon1 {
    background: url('~@/assets/img/list_goods_cash_coupon_nol@3x.png') left top no-repeat;
    background-size: 100% 100%;
    .right {
      color: #FF3A6F;
      span {
        margin-right: 4px;
      }
      .use {
        border: 0.01433rem solid #FF3467;
      }
    }
  }
  .coupon2 {
    background: url('~@/assets/img/list_goods_interest_nol@3x.png') left top no-repeat;
    background-size: 100% 100%;
    .right {
      color: #F38347;
      span {
        margin-left: 4px;
      }
      .use {
        border: 0.01433rem solid #F38347;
      }
    }
  }
  .coupon3 {
    background: url('~@/assets/img/list_goods_cash_coupon_gra@3x.png') left top no-repeat;
    background-size: 100% 100%;
    .right {
      color:#BDBDBD;
      padding-top: 0;
      .money {
        height: 200px;
        line-height: 200px;
      }
    }
  }
}
</style>

<style lang="scss">
.myCoupons {
  .van-tab--active {
    color: #ED145B;
  }
  .van-tabs__line {
    background-color: #F54B78;
  }
  .van-tabs__wrap {
    position: fixed;
  }
}
</style>

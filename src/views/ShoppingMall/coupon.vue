<template>
  <div class="coupon">
    <div class="mask" v-if="showCouponDialog">
      <div class="coupon-box" ref="couponBox" :class="{no: getCouponPrizeCode === 'nocoupon'}">
        <i class="coupon-rule" @click="goCouponRule"></i>
        <div class="nocoupon" v-if="getCouponPrizeCode === 'nocoupon'"></div>
        <div class="coupon10" v-else-if="getCouponPrizeCode === '354'"></div>
        <div class="coupon20" v-else-if="getCouponPrizeCode === '356'"></div>
        <div class="coupon100" v-else-if="getCouponPrizeCode === '355'"></div>
        <div class="coupin888" v-else-if="getCouponPrizeCode === '353'"></div>
        <div class="coupon-submit" @click="afterSubmit"></div>
        <div class="couponClose" @click="couponClose"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import redPacket from '@/mixins/redPacket'
export default {
  name: 'coupon',
  mixins: [redPacket],
  props: {
    showCouponDialog: {
      type: Boolean,
      default: false
    },
    prizeCode: {
      type: String
    }
  },
  computed: {
    ...mapState(['loginChannel']),
    ...mapGetters(['getCouponPrizeCode'])
  },
  methods: {
    couponClose () {
      // 取消优惠券弹框
      // this.$emit('couponClose')
      window.localStorage.setItem('couponFirstOpen', '1')
      this.setShowCouponDialogStatus(false)
      this.setDragStatus(true)
      this.setCouponDialogLogin(false)
    },
    goCouponRule () {
      // 优惠券规则
      this.$router.push({
        name: 'couponRule'
      })
    },
    verticalCenter () {
      console.log(window.screen.availHeight, 'window.screen.availHeight')
      this.$nextTick(() => {
        const el = this.$refs['couponBox']
        const elHeight = getComputedStyle(el).height.match(/([\d.]*)/)[1]
        if (parseFloat(elHeight) === Number(elHeight)) {
          let halfHeight = (window.screen.availHeight - Number(elHeight)) / 2
          let hrefTitleHeight = (window.screen.availHeight - window.innerHeight)
          el.style.marginTop = (halfHeight - hrefTitleHeight) + 'px'
        }
      })
    },
    ...mapMutations(['setLoginStatus', 'setCouponDialogLogin'])
  },
  watch: {
    showCouponDialog (newValue) {
      if (newValue) {
        this.verticalCenter()
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.65);
    z-index: 1000;
  }
  .coupon-box {
    width: 560px;
    height: 740px;
    background: url('~@/assets/img/page@2x.png') no-repeat;
    background-size: cover;
    margin: 2rem auto 0;
    position: relative;
    transition: all .5s;
    &.no {
      width: 560px;
      height: 740px;
      background: url('~@/assets/img/page@2x.png') no-repeat;
      background-size: 100% 100%;
      margin: 2rem auto 0;
      position: relative;
    }
  }
  .couponClose {
    display: inline-block;
    width: 64px;
    height: 64px;
    background: url('~@/assets/img/close@2x.png') no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
    position: absolute;
    bottom: -100px;
    transform-origin: center bottom;
    transform: scaleY(-1);
    left: 248px;
  }
  .coupon-title {
    overflow: hidden;
    position: relative;
  }
  .coupon-title-text {
    margin: 0.4rem;
    text-align: center;
    font-size: .346667rem;
  }
  .coupon-rule {
    display: inline-block;
    width: .586667rem;
    height: .586667rem;
    background: url('~@/assets/img/wenhao@2x.png') no-repeat;
    background-size: 100% 100%;
    position: absolute;
    right: .626667rem;
    top: .253333rem;
  }
  .coupon-submit {
    background: url('~@/assets/img/couponbottom@2x.png') no-repeat;
    background-size: 100% 100%;
    width: 295px;
    height: 98px;
    line-height:  98px;
    text-align: center;
    position: absolute;
    bottom: 15px;
    left: 133px;
  }
  .nocoupon {
    background: url('~@/assets/img/nocoupon.png') no-repeat;
    background-size: 100% 100%;
    width: 464px;
    height: 148px;
    position: absolute;
    top: 128px;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
  .coupon10 {
    background: url('~@/assets/img/10coupon.png') no-repeat;
    background-size: cover;
    width: 464px;
    height: 152px;
    position: absolute;
    top: 123px;
    left: 49px;
  }
  .coupon20 {
    background: url('~@/assets/img/20coupon.png') no-repeat;
    background-size: cover;
    width: 464px;
    height: 152px;
    position: absolute;
    top: 123px;
    left: 49px;
  }
  .coupon100 {
    background: url('~@/assets/img/100coupon.png') no-repeat;
    background-size: cover;
    width: 464px;
    height: 152px;
    position: absolute;
    top: 123px;
    left: 49px;
  }
  .coupin888 {
    background: url('~@/assets/img/888redbag.png') no-repeat;
    background-size: cover;
    width: 464px;
    height: 152px;
    position: absolute;
    top: 123px;
    left: 49px;
  }

</style>

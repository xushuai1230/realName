<template>
	<div class="coupon">
		<div class="mask" v-if="showNewUserDialog">
			<div class="coupon-box" ref="couponBox">
        <ul class="coupon-list">
          <li class="coupon-li">
            <div class="coupon-left">
              <h3>60天免息券</h3>
              <div class="scribe">
                <p>全场通用</p>
              </div>
            </div>
            <div class="coupon-right">
              <p class="money">
                <span class="coupon-count">2</span>
                <span class="little">期</span>
              </p>
            </div>
          </li>
          <li class="coupon-li">
            <div class="coupon-left">
              <h3 class="brown">满500减30</h3>
              <div class="scribe">
                <p class="brown">全场通用</p>
              </div>
            </div>
            <div class="coupon-right">
              <p class="money">
                <span class="little brown">&yen;</span>
                <span class="coupon-count brown">30</span>
              </p>
            </div>
          </li>
        </ul>
        <div class="coupon-submit" @click="afterSubmit"></div>
        <div class="couponClose" @click="couponClose"></div>
      </div>
		</div>
	</div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import newUser from '@/mixins/newUser'
export default {
  name: 'newUser',
  mixins: [newUser],
  props: {
    showNewUserDialog: {
      type: Boolean,
      default: false
    },
    prizeCode: {
      type: String
    }
  },
  computed: {
    ...mapState(['loginChannel']),
    ...mapGetters(['userToken'])
  },
  methods: {
    couponClose () {
      // 取消优惠券弹框
      // this.$emit('couponClose')
      this.setShowNewUserDialogStatus(false)
      this.setNewUserDragStatus(true)
    },
    goToCoupon () {
      this.$router.push({
        name: 'MyCoupon'
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
    ...mapMutations(['setLoginStatus'])
  },
  watch: {
    showNewUserDialog (newValue) {
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
  background-color: rgba(0, 0, 0, 0.65);
  z-index: 1000;
}
.coupon-box {
  width: 560px;
  height: 690px;
  background: url("~@/assets/img/h5_popup_ticket1@3x.png") no-repeat center;
  background-size: 100%;
  margin: 2rem auto 0;
  position: relative;
  box-sizing: border-box;
  &.no {
    width: 592px;
    height: 711px;
    background: url("~@/assets/img/home/page@3x.png") no-repeat;
    background-size: 100% 100%;
    margin: 3rem auto 0;
    position: relative;
  }
  margin-bottom: 100px;
}
.couponClose {
  display: inline-block;
  width: 64px;
  height: 64px;
  background: url("~@/assets/img/close@2x.png") no-repeat;
  background-size: 100% 100%;
  margin: 0 auto;
  position: absolute;
  bottom: 0px;
  transform-origin: center bottom;
  transform: scaleY(-1);
  left: 248px;
  bottom: -100px;
}
.coupon-title {
  overflow: hidden;
  position: relative;
}
.coupon-title-text {
  margin: 0.4rem;
  text-align: center;
  font-size: 0.346667rem;
}
.coupon-submit {
  background: url("~@/assets/img/button_get_ticket@3x.png") no-repeat;
  background-size: 100% 100%;
  width: 4.106667rem;
  height: 1.066667rem;
  line-height: 1.306667rem;
  text-align: center;
  position: absolute;
  bottom: 41px;
  left: 126px;
}
.newuser-2 {
  width: 7.76rem;
  height: 9.706667rem;
  background: url("~@/assets/img/h5_popup_ticket2@3x.png") no-repeat;
  background-size: cover;
  margin: 3rem auto 0;
  position: relative;
  .newuser-2-close {
    background: url("~@/assets/img/button_ok@3x.png") no-repeat;
    background-size: 100% 100%;
    width: 4.106667rem;
    height: 1.066667rem;
    line-height: 1.306667rem;
    text-align: center;
    position: absolute;
    bottom: 0.426667rem;
    left: 1.986667rem;
  }
  .newuser-2-title {
    background: url("~@/assets/img/h5_popup_title1@3x.png") no-repeat;
    background-size: 100% 100%;
    width: 6rem;
    height: .746667rem;
    line-height: 1.306667rem;
    text-align: center;
    position: absolute;
    top: .933333rem;
    left: .88rem;
  }
  .newuser-2-text {
    text-align: center;
    // position: absolute;
    // top: 1.893333rem;
    // left: 1.653333rem;
    font-size:24px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(144,82,42,1);
    padding-top: 1.9rem;
  }
}
  .newuser-3-title {
    background: url("~@/assets/img/h5_popup_title2@3x.png") no-repeat;
    background-size: 100% 100%;
    width: 6rem;
    height: .746667rem;
    line-height: 1.306667rem;
    text-align: center;
    position: absolute;
    top: .933333rem;
    left: .88rem;
  }

  .coupon-list {
    padding: 1.8rem 0;
  }
  .coupon-li {
    width: 6.426667rem;
    height: 1.866667rem;
    margin: 0.6rem auto 0.2rem;
  }
  .coupon-left {
    width: 4rem;
    float: left;
    height: 100%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0.4rem  0 0 0.5333rem;
  }
  .coupon-left h3 {
    font-size: .453333rem;
    font-family:PingFangSC-Medium;
    font-weight:600;
    color:rgba(242,25,68,1);
    line-height:48px;
  }
  .coupon-left .scribe {
    font-size: .293333rem;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(242,25,68,1);
    line-height:30px;
    margin: 0.08rem 0 0.06667rem 0;
  }
  .coupon-left .time {
    line-height: 0.44rem;
    font-size: 0.32rem;
    color: #939393;
    font-family: PingFangSC-Regular;
    font-weight: 400;
  }
  .coupon-right {
    width: 2rem;
    height: 100%;
    float: right;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding-top: 0.37333rem;
  }
  .coupon-right .money {
    font-size: .906667rem;
    height: 1.26667rem;
    line-height: 1.26667rem;
    font-family:PingFangSC-Medium;
    font-weight: 600;
    color:rgba(242,25,68,1);
    padding-right: 18px;
  }
   .coupon-right .money .coupon-count {
     font-size: .906667rem;
     font-family:PingFangSC-Medium;
     font-weight:600;
     color:rgba(242,25,68,1);
  }
  .coupon-right .money .little {
    font-size:28px;
    font-family:PingFangSC-Medium;
    font-weight:500;
    color:rgba(242,25,68,1);
    line-height:40px;
  }
  .brown {
    color:rgba(145,75,31,1) !important;
  }
  .coupon-list-2 {
    padding: 0.8rem 0;
  }
  .coupon-li:nth-child(2) {
    margin: 0.3rem auto 0.2rem;
  }
</style>

<template>
	<div class="oldEntry" v-show="oldEntryDialogStatus">
    <div class="oldEntry__center">
      <img v-if="oldEntryStatus === 1 || !oldEntryStatus" class="oldentrytite1" src="~@/assets/img/oldentrytite1.png" alt="">
      <img v-if="oldEntryStatus === 2" class="oldentrytite2" src="~@/assets/img/oldentrytite2.png" alt="">
      <img v-if="oldEntryStatus === 3" class="oldentrytite3" src="~@/assets/img/oldentrytite3.png" alt="">
      <div>{{firstTxt}}</div>
      <div>2、您可以在“我的-老版本还款“进行历史账单还款；</div>
      <div>3、分期商城全新特权，颜值卡12999免审额度，全网购物97折，购物不用等！</div>
      <div class="go-old-entry" @click="goOldRntryFn"></div>
      <div class="closebtn" @click="closeFn"></div>
    </div>
	</div>
</template>

<script type="text/ecmascript-6">
import { mapState, mapMutations } from 'vuex'
export default {
  name: '',
  props: [],
  data () {
    return {
      titleTxt: '',
      firstTxt: ''
    }
  },
  created () {
    // console.log(this.$store.state.oldEntryStatus)
  },
  computed: {
    ...mapState(['oldEntryDialogStatus', 'oldEntryStatus', 'sinaFenqiH5Url'])
  },
  methods: {
    ...mapMutations(['setOldDialogEntryStatus']),
    closeFn () {
      this.setOldDialogEntryStatus(false)
    },
    goOldRntryFn () {
      this.$tj('returnalertclick')
      this.setOldDialogEntryStatus(false)
      setTimeout(() => {
        if (this.sinaFenqiH5Url) {
          location.href = this.sinaFenqiH5Url
        }
      }, 200)
    }
  },
  watch: {
    oldEntryStatus: {
      handler (val) {
        console.log(val)
        if (val === 1) {
          this.firstTxt = '1、您还有未结清的账单，及时还款将助力您享受分期商城全新特权；'
        } else if (val === 2) {
          this.firstTxt = '1、您的账单即将到期，及时还款将助力您享受分期商城全新特权；'
        } else if (val === 3) {
          this.firstTxt = '1、您的账单已逾期，及时还款将助力您享受分期商城全新特权；'
        } else {
          this.firstTxt = '1、您还有未结清的账单，及时还款将助力您享受分期商城全新特权；'
        }
      },
      immediate: true
    }
  },
  destroyed () {
  }
}
</script>

<style lang="scss" scoped>
.oldEntry {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 1999;
  background-color: rgba(0, 0, 0, 0.5);
  &__center {
    position:absolute;
    top:50%;
    left:50%;
    margin:-370px 0 0 -285px;
    width: 560px;
    height: 740px;
    background: #fff;
    border-radius: 4px;
    box-sizing: border-box;
    // padding: 20px 40px;
    background: url('~@/assets/img/oldentrybg.png');
    background-size: 100% 100%;
    box-sizing: border-box;
    padding: 247px 65px 35px;
    img {
      position:absolute;
      top:20px;
      left:50%;
      width: 325px;
      margin-left: -163px;
      height: 86px;
    }
    div {
      font-size:26px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(255,255,255,1);
      line-height:40px;
      margin-top: 24px;
    }
    .go-old-entry {
      margin-top: 34px;
      background: url('~@/assets/img/oldentrybtn.png');
      background-size: 100% 100%;
      width: 100%;
      height: 88px;
    }
    .closebtn {
      position:absolute;
      width: 64px;
      height: 64px;
      left:50%;
      bottom: -181px;
      margin-left: -32px;
      margin-top: 0;
      background: url('~@/assets/img/oldentryclose.png');
      background-size: 100% 100%;
    }
  }
}
</style>

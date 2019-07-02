<template>
  <div>
    <div class="mask" v-if="showOldUserDialog">
      <div class="oldUser" ref="couponBox">
        <div class="olduser-button" @click.stop="goMyCoupon">知道了</div>
                <div class="couponClose" @click="goMyCoupon"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ModalHelper } from '@/module/common.js'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'olduser',
  computed: {
    ...mapState([
      'showOldUserDialog'
    ])
  },
  methods: {
    ...mapMutations([
      'setOldUserDialog'
    ]),
    goMyCoupon () {
      this.setOldUserDialog(false)
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
    }
  },
  destroyed () {
    ModalHelper.beforeClose()
  },
  watch: {
    showOldUserDialog (val) {
      if (val) {
        this.verticalCenter()
        ModalHelper.afterOpen()
      } else {
        ModalHelper.beforeClose()
      }
    }
  }
}
</script>

<style scoped>
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.65);
    z-index: 1000;
  }
  .oldUser {
    position: relative;
    width: 560px;
    height: 740px;
    margin: 2rem auto;
    background: url('~@/assets/img/olduser-bg.png') no-repeat;
    background-size: 100% 100%;
    top: 0;
  }
  .olduser-button {
    position: absolute;
    width: 459px;
    height: 79px;
    background:linear-gradient(90deg,rgba(254,240,213,1) 0%,rgba(246,185,125,1) 100%);
    border-radius: .52rem;
    font-size: .373333rem;
    font-family:PingFangSC-Medium;
    font-weight:500;
    color:rgba(207,30,24,1);
    text-align: center;
    line-height:  79px;
    bottom: 77px;
    left: 52px;
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
</style>

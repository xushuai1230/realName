<template>
  <div class="main" v-extend-height>
    <div class="content" v-if="tip === 0">
      <h3>您已预约开通成功！</h3>
      <p>下载APP后，在开通颜值卡页面完成开卡，立享4大尊享特权！</p>
    </div>
    <div class="content" v-else-if="tip===1">
      <h3>您已经预约过了！</h3>
      <p>下载APP后，在开通颜值卡页面完成开卡，立享4大尊享特权！</p>
    </div>
    <div class="content" v-else-if="tip===2">
      <h3>您已经开卡成功了！</h3>
      <p>您已经开卡成功了，快去APP里使用尊享特权吧。</p>
    </div>
    <a :href="linkHref">
      <div class="button" >
        <img src="~@/assets/img/facecard/downLoad@3x.png" alt="">
      </div>
    </a>
    <div class="bottom">
      <img src="~@/assets/img/facecard/bowen@3x.png" alt="">
    </div>
  </div>
</template>
<script>
import { api, post } from '@/module/request'
import { initLink } from 'insfns'
export default {
  data () {
    return {
      tip: 0,
      linkHref: 'javascript:;', // 深度链接
      inviterId: ''
    }
  },
  async created () {
    this.inviterId = this.getQueryString('inviteId')
    await this.bindUserForInviting()
    if (!/WeiBo/i.test(navigator.userAgent)) {
      let currHref = location.href
      let env = currHref.indexOf('h5-dev') !== -1 ? 'dev' : 'prod'
      this.linkHref = await initLink(`bsdlks://cdn.basestonedata.com/${env}/facecard/index.html#/`)
    }
  },
  methods: {
    bindUserForInviting () {
      // 接受邀请
      if (this.inviterId) {
        post(api.openStatus + '?token=' + this.userToken + '&shareUserId=' + this.inviterId)
          .then(res => {
            let status = res.openStatus
            status = Number(status)
            this.tip = status
          })
          .catch(err => {
            this.$toast(err)
          })
      }
    }
  }
}
</script>
<style scoped lang='scss'>
.main {
  width: 100%;
  height: 100%;
  background: #363044 url('../../assets/img/facecard/bj2@3x.png') no-repeat;
  background-size: 100%;
  box-sizing: border-box;
  padding-top: 2.4rem;
  padding-bottom:.4rem;
  a{
    display: block;
    width: 8.773333rem;
    height: 1.6rem;
    margin: 0 auto;
  }
  .content {
    width: 5.373333rem;
    margin: 0 auto;
    padding-bottom: 7.6rem;
    h3 {
      text-align: center;
      font-size: .453333rem;
      color: #333;
    }
    p {
      font-size: .373333rem;
      color: #333;
      line-height: .933333rem;
      text-align: left;
      margin-top: .4rem;
    }
  }
  .button {
    width: 8.773333rem;
    height: 1.6rem;
    z-index: 10;
  }
}
.bottom {
  width: 100%;
  height: 1.36rem;
  position: fixed;
  bottom: 0;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>

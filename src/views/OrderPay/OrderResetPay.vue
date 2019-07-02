<template>
  <div class="resetpay" @click="close">
    <div class="reset" @click.stop>
      <div class="close" @click="close"></div>
      <div class="topbox">
        <div class="title">支付密码被锁定</div>
        <div class="txt">由于您输入密码错误次数过多，您需要重置支付密码后才可继续</div>
      </div>
      <div class="bottombox" @click="resetpassword">重置支付密码</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

export default {
  name: '',
  data () {
    return {
    }
  },
  methods: {
    resetpassword () {
      this.$emit('close')
      setTimeout(() => {
        let routerData = JSON.stringify({
          name: this.$route.name,
          query: this.$route.query,
          params: this.$route.params
        })
        this.$router.push({ // 重置密码
          name: 'GetCode',
          query: {
            type: 'router',
            method: 'replace',
            routerData: routerData,
            noCache: Date.now()
          }
        })
      }, 300)
    },
    close () {
      this.$emit('close')
    }
  },
  watch: {
  }
}
</script>

<style lang="scss">
.resetpay {
  width: 100%;
  height: 100%;
  background: rgba(00, 00, 00, .5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
}
.reset {
  background: #fff;
  position: absolute;
  width: 550px ;
  height: 345px;
  margin: 0 auto;
  box-sizing: border-box;
  bottom: 620px;
  left: 0;
  right: 0;
  border-radius: 16px;
  .topbox {
    height: 256px;
    box-sizing: border-box;
    border-bottom: 1Px solid #e5e5e5;
    .title {
      display: inline-block;
      width: 100%;
      text-align: center;
      height:45px;
      font-size:32px;
      font-family:PingFangSC-Medium;
      font-weight:500;
      color:rgba(51,51,51,1);
      line-height:45px;
      margin: 40px 0 50px;
    }
    .txt {
      margin: 0 40px;
      height:80px;
      font-size:28px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:40px;
      text-align: left;
    }
  }
  .bottombox {
    text-align: center;
    height:88px;
    font-size:30px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(0,118,255,1);
    line-height:88px;
  }
  .close {
    background: url('~@/assets/img/list_btn_delete_nol.png') no-repeat center;
    background-size: 100% 100%;
    width: 44px;
    height: 44px;
    position:absolute;
    right: 20px;
    top: 20px;
  }

}

</style>

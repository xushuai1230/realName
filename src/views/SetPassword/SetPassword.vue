<template>
  <div class="setpassword">
    <div class="input_wrap border border-top border-bottom">
      <div class="img">
        <img src="../../assets/img/bindcard/list_icon_password@3x.png" alt="">
      </div>
      <input v-model="password" v-if="!ifSee" type="password" maxlength="6" placeholder="请输入6位数字" onfocus="this.style.color='#333'">
      <input v-model="password" v-else type="text" maxlength="6" placeholder="请输入6位数字" onfocus="this.style.color='#333'">
      <div class="eye" @click="seePassWord">
        <img v-if="ifSee" src="../../assets/img/list_icon_open_password@3x.png" alt="">
        <img v-else src="../../assets/img/list_icon_close_password@3x.png" alt="">
      </div>
    </div>
    <button class="btn" :class="{sure: !sure}" :disabled=!sure @click="sureSet">确定</button>
  </div>
</template>

<script>
import { getQueryString } from '@/module/common'

export default {
  data () {
    return {
      password: '',
      phone: '',
      sms: '',
      sure: false,
      ifSee: false,
      cb: '',
      cbMethod: '',
      cbType: '',
      cbrouterData: ''
    }
  },
  mounted () {
    this.getUserInfo()
    this.sms = this.getQueryString('sms') || null
    this.cb = decodeURIComponent(getQueryString('cb')) // 回跳地址 并解码
    this.cbMethod = getQueryString('method') || 'replace'// 回跳方式 push/replace 默认replace
    this.cbType = getQueryString('type') || 'url' // 回跳类型 router/url 默认url
    this.cbrouterData = getQueryString('routerData')// 回跳类型为router时回跳路由数据
  },
  watch: {
    password (val) {
      let temp = val.replace(/[^0-9]/ig, '')
      this.password = temp
      if (temp.length === 6) {
        this.sure = true
      }
    }
  },
  methods: {
    seePassWord () {
      this.ifSee = !this.ifSee
    },
    getUserInfo () {
      global.vbus.$emit('setloadingStatus', true)
      this.$api['mine/getUserInfo']({
        token: this.userToken
      }).then(res => {
        global.vbus.$emit('setloadingStatus', false)
        this.phone = res.data.mobilePhone
      })
    },
    sureSet () {
      global.vbus.$emit('setloadingStatus', true)
      // if (this.sms) {
      this.$api['mine/changePassword']({
        mobile: this.phone,
        newPass: this.password,
        verCode: this.sms,
        type: '2'
      }, { headers: { token: this.userToken } }).then(res => {
        this.$toast('密码设置成功')
        this.hrefBack()
      })
      // } else {
      //   this.$api['mine/setPayPassword']({
      //     token: this.userToken,
      //     payPassword: this.password
      //   }).then(res => {
      //     this.hrefBack()
      //   })
      // }
    },
    hrefBack () {
      if (this.cbType === 'router') { // vue-router 跳转
        if (this.cbMethod === 'push') {
          this.$router.push(JSON.parse(this.cbrouterData))
        } else {
          this.$router.replace(JSON.parse(this.cbrouterData))
        }
      } else { // location url 跳转
        if (this.cbMethod === 'push') {
          location.href = this.cb
        } else {
          location.replace(this.cb)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.setpassword {
  height: 100%;
  background: #f2f2f2;
  box-sizing: border-box;
  padding-top: .266667rem;
  .input_wrap {
    height: 100px;
    box-sizing: border-box;
    padding: .266667rem .266667rem .266667rem 1.333333rem;
    background: #fff;
    position: relative;
    .img {
      width: .773333rem;
      height: .773333rem;
      position: absolute;
      left: .266667rem;
      top: .266667rem;
    }
    input {
      display: inline-block;
      width: 350px;
      height: 50px;
      margin-top: 5px;
      padding: 0;
      font-size: 28px;
      font-family: PingFangSC-Regular;
      color: #939393;
      line-height: 50px;
    }
    .eye {
      width: .773333rem;
      height: .773333rem;
      position: absolute;
      right: .266667rem;
      top: .266667rem;
    }
  }
  .btn {
    width: 94%;
    display: block;
    border: 0;
    text-align: center;
    margin: 1.466667rem auto 0;
    background-color: #F54B78;
    border-radius: 4px;
    height: 84px;
    font-size: .426667rem;
    font-family: PingFangSC-Regular;
    color: #fff;
    line-height: 84px;
  }
  .sure {
    background: #ffabc1;
  }
  .border {
    position: relative;
  }

  .border::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    right: -50%;
    bottom: -50%;
    -webkit-transform: scale(.5);
    transform: scale(.5);
    pointer-events: none;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .border-bottom::after {
    border-bottom: 1px solid #e6e6e6;
  }
  .border-top::after {
    border-top: 1px solid #e6e6e6;
  }
}
</style>

<template>
  <div class="content">
    <div class="userInfo">
      <div class="line userName">
        <span class="icon"><img src="~@/assets/img/studentAuth/userName.png"/></span>
        <div class="input">
          <input type="text" v-model="userName" placeholder="请输入用户名（邮箱/手机号/身份证号）"/>
          <i class="clear" v-if="userName" @click="clearUserName()"></i>
        </div>
      </div>
      <div class="line password">
        <span class="icon"><img src="~@/assets/img/studentAuth/password.png"/></span>
        <div class="input">
          <input type="text" v-model="userPassword" v-if="isOpenEye" placeholder="请输入密码"/>
          <input type="password" v-model="userPassword" v-else placeholder="请输入密码">
        </div>
        <i class="openEye" :class="{'open':isOpenEye}" @click="openEye()"></i>
      </div>
      <div class="line checkCode" v-if="isCheckCode">
        <span class="icon"><img src="~@/assets/img/studentAuth/code.png"/></span>
        <div class="input">
          <input type="text" v-model="checkCode" placeholder="请输入图片验证码"/>
        </div>
        <span class="codeImg" @click="refreshCode()">
          <img :src="checkImg" />
        </span>
      </div>
    </div>
    <div class="comfirmAuth" :class="{selectall:isSelectAll}" @click="comfirmAuth()">确认授权</div>
    <div class="other">
      <div class="rules">
        <i class="agree" :class="{'select':isSelectArgee}" @click="agreeRules()"></i>
        <span @click="goRules()">同意<em>《学信网信息授权协议》</em></span>
      </div>
      <div class="helps" @click="goHelps()">如何授权</div>
    </div>
    <div v-if="isLoading">
      <loading></loading>
    </div>
  </div>
</template>
<script>
import Vuex from 'vuex'
import Loading from '@/components/Loading/Loading.vue'
import { getQueryString } from '@/module/common'
export default {
  name: 'studentAuth',
  data () {
    return {
      userName: '',
      userPassword: '',
      checkCode: '',
      isOpenEye: false,
      isSelectArgee: true,
      isLoading: false,
      isCheckCode: false, // 是否显示验证码
      getTk: '',
      checkImg: '',
      cb: '', // 成功回调地址
      cbMethod: '', // 回跳方式 push/replace 默认replace
      cbType: '', // 回跳类型 router/url 默认url
      cbrouterData: ''// 回跳类型为router时回跳路由数据
    }
  },
  computed: {
    isSelectAll () {
      let result = false
      if (this.isCheckCode) {
        if (this.userName && this.userPassword && this.isSelectArgee && this.checkCode) {
          result = true
        }
      } else {
        if (this.userName && this.userPassword && this.isSelectArgee) {
          result = true
        }
      }
      return result
    },
    ...Vuex.mapGetters([
      'userToken'
    ])
  },
  mounted () {
    this.cb = decodeURIComponent(getQueryString('cb')) // 回跳地址 并解码
    this.cbMethod = getQueryString('method') || 'replace'// 回跳方式 push/replace 默认replace
    this.cbType = getQueryString('type') || 'url' // 回跳类型 router/url 默认url
    this.cbrouterData = getQueryString('routerData')// 回跳类型为router时回跳路由数据
  },
  methods: {
    comfirmAuth () {
      if (this.isSelectAll) {
        if (this.isCheckCode) {
          this.submitImgCode()
        } else {
          this.submitAccount()
        }
      } else {
        this.getValidation()
      }
    },
    getValidation () {
      if (!this.userName) {
        this.$toast('请输入用户名')
        return
      }
      if (!this.userPassword) {
        this.$toast('请输入密码')
        return
      }
      if (!this.checkCode) {
        this.$toast('请输入图片验证码')
        return
      }
      if (!this.isSelectArgee) {
        this.$toast('请先勾选授权服务协议')
      }
    },
    refreshCode () {
      this.checkCode = ''
      this.$api['studentAuth/refreshImgCode']({
        token: this.userToken,
        tk: this.getTk || ''
      }).then(res => {
        if (res) {
          this.checkImg = 'data:image/png;base64,' + res.captcha
          this.getTk = res.tk
        }
      }).catch(err => {
        this.$toast(err)
      })
    },
    submitImgCode () {
      this.isLoading = true
      this.$api['studentAuth/submitImgCode']({
        token: this.userToken,
        tk: this.getTk || '',
        cpc: this.checkCode
      }).then(res => {
        this.isLoading = false
        if (res) {
			    this.$toast('授权成功')
          this.backHandle()
        }
      }).catch(err => {
        this.$toast(err)
        this.refreshCode()
        this.isLoading = false
      })
    },
    submitAccount () {
      this.isLoading = true
      this.$api['studentAuth/submitAccount']({
        token: this.userToken,
        account: this.userName,
        password: this.userPassword
      }).then(res => {
        this.isLoading = false
        if (res) {
          if (res.captcha) {
            this.isCheckCode = true
            this.checkImg = 'data:image/png;base64,' + res.captcha
            this.getTk = res.tk
          } else {
            this.$toast('授权成功')
            this.backHandle()
          }
        } else {
          this.$toast(res.heads.message)
        }
      }).catch(err => {
        this.$toast(err)
        this.isLoading = false
      })
    },
    clearUserName () {
      this.userName = ''
    },
    openEye () {
      this.isOpenEye = !this.isOpenEye
    },
    agreeRules () {
      this.isSelectArgee = !this.isSelectArgee
    },
    goRules () {
      location.href = 'http://cdn.basestonedata.com/app/service/xuexingproto.html'
    },
    goHelps () {
      location.href = 'http://cdn.basestonedata.com/app/service/xuexing.html'
    },
	  backHandle () {
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
  },
  components: {
    Loading
  }
}
</script>

<style scoped lang="scss">
@import '~@/assets/scss/mixin.scss';
.content{
  width:100%;
  height: 100%;
  padding-top: 20px;
  // background-color:#fafafa;
  font-family:'PingFangSC-Regular';
  @include dprFont(14)
  .userInfo{
    width:100%;
    display:flex;
    flex-direction:column;
    background-color:#fff;
    border-top:1px solid rgba(239,239,239,1);
    .line{
      height: 88px;
      display:flex;
      align-items:center;
      padding:0 20px;
      border-bottom:1px solid rgba(239,239,239,1);
      .icon{
        margin-right:10px;
        img{
          width:58px;
          height:58px;
        }
      }
      .input{
        display:flex;
        align-items: center;
        flex:1;
        height: 100%;
        input{
          @include mid (70px);
          display: flex;
          align-items: center;
          flex:1;
          color:#333;
          &::-webkit-input-placeholder,&::-moz-placeholder {
            @include dprFont(14)
            color: #999;
          }
        }
        .clear{
          display:block;
          width:28px;
          height:28px;
          background:url('~@/assets/img/studentAuth/delete.png') no-repeat;
          background-size:100% 100%;
          margin-right:10px;
        }
      }
      .openEye{
        width:58px;
        height:58px;
        background:url('~@/assets/img/studentAuth/close.png') no-repeat;
        background-size:100% 100%;
        &.open{
          background:url('~@/assets/img/studentAuth/open.png') no-repeat;
          background-size:100% 100%;
        }
      }
      .codeImg{
        img{
          width:178px;
          height:62px;
        }
      }
    }
  }
  .comfirmAuth{
    height:88px;
    border-radius:8px;
    margin:110px 20px 0;
    display:flex;
    align-items:center;
    justify-content: center;
    @include dprFont(16)
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:45px;
    background-color:#FFABC1;
    &.selectall{
    background:rgba(245,75,120,1);
    }
  }
  .other{
    display:flex;
    justify-content: space-between;
    align-items:center;
    margin: 32px 20px 0 30px;
    .rules{
      @include dprFont(12)
      font-weight:400;
      color:rgba(0,0,0,1);
      line-height:33px;
      display:flex;
      align-items:center;
      .agree{
        display:block;
        width:26px;
        height:26px;
        background:url('~@/assets/img/studentAuth/selectNo.png') no-repeat;
        background-size:100% 100%;
        &.select{
          background:url('~@/assets/img/studentAuth/select.png') no-repeat;
          background-size:100% 100%;
        }
      }
      span{
        margin-left:20px;
        em{
          color:#ED145B;
        }
      }
    }
    .helps{
      font-weight:400;
      color:rgba(153,153,153,1);
      line-height:29px;
    }
  }
}
</style>

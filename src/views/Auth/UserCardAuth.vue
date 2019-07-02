<template>
  <div class="user-card-auth-root">
    <template v-if="realNameState">
      <div class="already-real-name">
        <header>
          <h1>身份信息已完善</h1>
          <img src="~@/assets/img/icon_authentification@2x.png">
        </header>
        <ul>
          <li>
            <span>姓名</span>
            {{userName}}
          </li>
          <li>
            <span>身份证</span>
            {{userIdCard}}
          </li>
        </ul>
      </div>
    </template>
    <template v-else>
      <header class="auth-step">
        <div class="icon-area">
          <span class="left-identity" :class="{ complete: realNameBol }">
            <i class="desc">身份识别</i>
          </span>
          <span class="line" :class="{ complete: realNameBol && !realNameBol }"></span>
          <span class="right-face" :class="{ complete:  !realNameBol && liveFaceBol }">
            <i class="desc">刷脸</i>
          </span>
        </div>
      </header>
      <!-- 身份识别 -->
      <template v-if="realNameBol">
        <div class="safe">
          <i class="safe-logo"></i>
          <span>小象将为您的信息提供银行级安全保护</span>
        </div>
        <section class="form-area user-msssage bt1 bb1">
          <div class="item-input user-name bb1">
            <input tabindex="1" type="text" placeholder="您的真实姓名" v-model.trim="userData.realName">
          </div>
          <div class="item-input user-card-id">
            <input tabindex="2" type="text" placeholder="您的身份证号码（将加密处理）" v-model.trim="userData.papersCode">
          </div>
        </section>
        <section class="form-area bt1">
          <div class="item-input user-contacts-name bb1">
            <input tabindex="3" type="text" placeholder="填写紧急联系人姓名" v-model.trim="userData.emergency_contact">
          </div>
          <div class="item-input user-contacts-phone bb1">
            <input tabindex="4" type="phone" placeholder="紧急联系人手机号" v-model.trim="userData.emergency_mobile">
          </div>
          <div class="item-input user-contacts-relation bb1" @click="showRelation = !showRelation">
            <span :class="userData.emergency_title ? 'istxt' : ''">{{userData.emergency_title || '请选择你与紧急联系人的关系'}}</span>
            <span class="right-icon"></span>
          </div>
        </section>
        <section class="form-area submit-area">
          <button class="submit-btn" @click="submitRealNameData">下一步</button>
        </section>
        <!-- 上拉列表 -->
        <van-actionsheet v-model="showRelation">
          <div class="btns">
            <span @click="sureRelation(false)">取消</span>
            <span @click="sureRelation(true)">确定</span>
          </div>
          <van-picker ref="picker" :columns="relationColumns" />
        </van-actionsheet>
      </template>
      <template v-else-if="liveFaceBol">
        <!-- 引导流程 -->
        <div class="live-auth-step-notic" v-extend-height v-if="liveFaceState === 'waitUpload'">
          <img src="~@/assets/img/image_face@2x.png" alt="">
          <p>上传一段不超过<span>5s</span>的视频</p>
          <p>视频中的你只有<span>眨眨眼</span>才能刷脸通过</p>
          <div class="inner-btn-wrap">
            <!-- <div class="upload-inner-wrap">
            <button>本地上传</button>
            <input type="file" ref="photoFile" name="filet"  @change="upLoadLiveVideo('photoFile')">
          </div> -->
            <div class="upload-inner-wrap">
              <input @click="$toast('请确保系统对微博开启了相机权限')" type="file" ref="videoFile" name="file" accept="video/*" capture="camera" @change="upLoadLiveVideo('videoFile')">
              <button>拍摄上传</button>
            </div>
          </div>
        </div>
        <!-- 上传过程引导 -->
        <div class="live-upload" v-else-if="liveFaceState === 'uploading'">
          <img src="~@/assets/img/img_data_upload@3x.png">
          <p>资料正在快速上传中...</p>
        </div>
        <!-- 失败重试引导 -->
        <div class="live-fail" v-else-if="liveFaceState === 'uploadFail'">
          <img src="~@/assets/img/blankpage_img_search4@3x.png">
          <p>刷脸识别失败，请重新检测</p>
          <p>请正对手机，保持光线充足</p>
          <button @click="resetState">重新检测</button>
        </div>
      </template>
    </template>
    <!-- <div class="bottom-redpackets" v-if="bottomShow">您可以在“微博-我的-微博钱包-分期商城”中进行提现操作</div> -->
  </div>
</template>
<script>
// 组件使用的静态变量
const REAL_NAME_CODE = '6501' // 身份认证
const LIVE_FACE_CODE = '6503' // 活体检测
const CARD_REG_15 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$/ // 15位的身份证号
const CARD_REG_18 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/ // 18位的身份证号
const CHANA_NAME_REG = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/
const PHONE_REG = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
export default {
  name: 'UserCardAuth',
  data () {
    return {
      showRelation: false,
      relationColumns: ['父母', '亲戚', '配偶', '情侣'],
      relation: null,
      authSatus: null,
      userData: {
        realName: null,
        papersCode: null,
        emergency_contact: null,
        emergency_mobile: null,
        emergency_title: null
      },
      liveFaceState: 'waitUpload', // uploading uploadfail uploadsuccess
      userName: '',
      userIdCard: '',
      bottomShow: false
    }
  },
  async created () {
    await this.ajaxDataForRealName()
    if (this.liveFaceBol) {
      this.liveFaceState = 'waitUpload'
    }
    if (this.realNameBol) {
      document.title = '实名认证'
    } else {
      document.title = '刷脸'
    }
    if (this.realNameState) {
      this.fetchUserInfo()
    }
    if (this.$route.query.redpackets) {
      this.bottomShow = this.$route.query.redpackets
    }
  },
  computed: {
    realNameBol () {
      if (!this.authSatus) {
        return false
      }
      for (let [, item] of this.authSatus.entries()) {
        let { dictCode, status } = item
        if (dictCode === REAL_NAME_CODE && (status === 0 || status === 3 || status === 4 || status === 5)) {
          return true
        }
      }
      return false
    },
    liveFaceBol () {
      if (!this.authSatus) {
        return false
      }
      for (let [, item] of this.authSatus.entries()) {
        let { dictCode, status } = item
        if (dictCode === LIVE_FACE_CODE && (status === 0 || status === 3 || status === 4 || status === 5)) {
          return true
        }
      }
      return false
    },
    realNameState () {
      return !this.realNameBol && !this.liveFaceBol
    }
  },
  methods: {
    /**
     * 身份认证步骤
     * TODO: 确认无需授权的时候，是否跳出当前页面呢！需要APP支持
     *
     */
    realNameStep (data) {
      const { status, dictValue } = data
      if (dictValue === 0) {
        this.$toast('实名认证功能已关闭, 无需授权')
        return
      }
      switch (status) {
        case 2:
          this.$toast('授权中')
          break
        case 1:
          this.$toast('授权成功')
          break
        case 5:
          this.$toast('通道关闭')
          break
      }
    },
    /**
     * 上传视频进行活体验证
     *
     */
    async upLoadLiveVideo (refName) {
      const formData = new FormData()
      const file = this.$refs[refName].files[0]
      formData.append('videoFile', file)
      formData.append('token', this.userToken)
      try {
        this.liveFaceState = 'uploading'
        await this.$api['auth/submitVideoAuth'](formData, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 72000 })
        this.liveFaceState = 'uploadsuccess'
      } catch (error) {
        this.liveFaceState = 'uploadFail'
      }
      // TODO: 缺少成功页面 user/getUserInfo.json
      if (this.liveFaceState === 'uploadsuccess') {
        const type = this.getQueryString('type') || 'url'
        const routerData = this.getQueryString('routerData')
        const method = this.getQueryString('method') || 'replace'
        const cb = this.getQueryString('cb')
        if (cb || routerData) {
          if (type === 'router') {
            this.$router[method](JSON.parse(routerData))
          } else {
            if (method === 'push') {
              location.href = decodeURIComponent(cb)
            } else if (method === 'replace') {
              location.replace(decodeURIComponent(cb))
            }
          }
        }
      }
    },
    /**
     * 活体检测步骤
     *
     */
    liveFaceStep (data) {

    },
    /**
     * 提交用户数据
     *
     */
    async submitRealNameData () {
      // TODO: 验证环境需要抽象出来，写起来太费事了 使用vue的自定义指令
      for (let [key, item] of Object.entries(this.userData)) {
        if (key === 'realName' && !CHANA_NAME_REG.test(item)) {
          this.$toast('请输入真实姓名')
          return
        } else if (key === 'papersCode' && (!CARD_REG_15.test(item) && !CARD_REG_18.test(item))) {
          this.$toast('请输入正确的身份证号')
          return
        } else if (key === 'emergency_contact' && !CHANA_NAME_REG.test(item)) {
          this.$toast('请填写正确的紧急联系人姓名')
          return
        } else if (key === 'emergency_mobile' && !PHONE_REG.test(item)) {
          this.$toast('请填写正确的联系人手机号')
          return
        } else if (key === 'emergency_title' && !item) {
          this.$toast('请选择你与紧急联系人的关系')
          return
        }
      }
      let postBody = this.userData
      postBody.token = this.userToken
      await this.$api['auth/submitIdentityInfoV3'](postBody)
      this.ajaxDataForRealName()
    },
    /**
     * 确认紧急联系人关系
     *
     */
    sureRelation (btnFunType) {
      if (btnFunType) {
        this.userData.emergency_title = this.$refs.picker.getValues()[0]
      }
      this.showRelation = false
    },
    /**
     * 获取个人授权情况
     *
     */
    async ajaxDataForRealName () {
      let data = await this.$api['auth/getRealNameListv3']({ token: this.userToken })
      this.authSatus = data.data
    },
    /**
     * 重置状态
     *
     */
    async resetState () {
      await this.ajaxDataForRealName()
      if (this.liveFaceBol) {
        this.liveFaceState = 'waitUpload'
      }
    },
    /**
     * 获取视口高度
     *
     */
    getClientHeight () {
      return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    },
    async fetchUserInfo () {
      let data = await this.$api['user/getUserInfo']({ token: this.userToken })
      this.userName = data.data && data.data.realname
      let idCard = data.data && data.data.idCard
      this.userIdCard = idCard[0] + '*************' + idCard[idCard.length - 1]
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.liveFaceState === 'uploading') {
      this.$toast('活体验证中，请稍后哦~')
      next(false)
    } else {
      next()
    }
  },
  watch: {
    realNameState (val) {
      console.log('waht')
      if (val) {
        this.fetchUserInfo()
      }
    }
  }
}
</script>
<style scoped lang="scss">
.bt1 {
  border-top: 1px solid #e6e6e6;
}
.bb1 {
  border-bottom: 1px solid #e6e6e6;
}
.user-card-auth-root {
  overflow: hidden;
}
.auth-step {
  padding: 40px 0 80px;
  background-color: #fff;
  border-top: 1px solid #e6e6e6;
  border-bottom: 1px solid #e6e6e6;
}
.auth-step .icon-area {
  font-size: 0;
  white-space: nowrap;
  text-align: center;
}
.auth-step .icon-area span {
  display: inline-block;
  width: 58px;
  height: 58px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
  vertical-align: middle;
  font-size: 24px;
  text-align: center;
}
.left-identity {
  background-image: url("~@/assets/img/list_icon_identify_lighten_black@2x.png");
}
.left-identity.complete {
  background-image: url("~@/assets/img/list_icon_identify_unlighten@2x.png");
}
.right-face {
  background-image: url("~@/assets/img/list_icon_face_lighten@2x.png");
}
.right-face.complete {
  background-image: url("~@/assets/img/list_icon_face_unlighten@2x.png");
}
.auth-step .icon-area span.line {
  width: 458px;
  height: 3px;
  margin-top: 6px;
  background-color: #cecece;
}
.auth-step .icon-area span.line.complete {
  background-color: rgb(65, 199, 145);
}
.desc-area {
  font-size: 0;
  text-align: center;
}
.desc-area span:first-child {
  font-size: 24px;
}
.desc-area .line {
  display: inline-block;
  width: 458px;
  height: 4px;
}
.desc-area span:last-child {
  font-size: 24px;
}
.left-identity .desc {
  display: inline-block;
  margin: 75px 0 0 -0.8em;
  color: #939393;
  font-size: 24px;
}
.right-face .desc {
  display: inline-block;
  margin-top: 75px;
  color: #939393;
  font-size: 24px;
}
.complete.left-identity .desc, .complete.right-face .desc {
  color: #333;
}
.form-area.user-msssage {
  margin: 20px 0 20px;
}
.item-input {
  padding-left: 88px;
  padding-top: 15px;
  padding-bottom: 15px;
  background-repeat: no-repeat;
  background-position: left 20px center;
  background-size: 58px;
  background-color: #fff;
  font-size: 28px;
  color: #999999;
}
.item-input.user-name {
  background-image: url("~@/assets/img/list_icon_name_usercard@3x.png");
}
.item-input.user-card-id {
  background-image: url("~@/assets/img/bindcard/list_icon_identity_card@3x.png");
}
.item-input.user-contacts-name {
  background-image: url("~@/assets/img/list_icon_linkman_01@2x.png");
}
.item-input.user-contacts-phone {
  background-image: url("~@/assets/img/list_icon_linkman_02@2x.png");
}
.item-input.user-contacts-relation {
  box-sizing: border-box;
  background-image: url("~@/assets/img/list_icon_linkman_03@2x.png");
  height: 99px;
  line-height: 99px;
  padding-top: 0;
  padding-bottom: 0;
  vertical-align: middle;
  span {
    height: 99px;
    line-height: 99px;
    float: left;
  }
  .right-icon {
    margin-top: 28px;
    margin-right: 30px;
    height: 44px;
    width: 44px;
    float: right;
    background-image: url("~@/assets/img/list_icon_enter_nol@3x.png");
    background-size: 100% 100%;
  }
}
.item-input > input {
  display: inline-block;
  height: 58px;
  line-height: 58px;
  font-size: 28px;
  background: rgba(0, 0, 0, 0);
  width: 100%;
  color: #333333;
}
.item-input > input::placeholder {
  font-size: 28px;
  color: #939393;
}
.submit-area {
  margin-top: 114px;
}
.form-area .submit-btn {
  display: block;
  margin: 0 auto;
  background-color: #f54b78;
  width: 710px;
  height: 84px;
  color: #fff;
  font-size: 32px;
  border: none;
  outline: none;
  border-radius: 4px;
}
.btns {
  color: #b8b8b8;
  font-size: 32px;
}
.btns::after {
  display: block;
  content: "";
  clear: both;
}
.btns span {
  margin: 25px;
}
.btns span:first-child {
  float: left;
}
.btns span:last-child {
  float: right;
}
.live-auth-step-notic {
  text-align: center;
  padding-top: 123px;
}
.live-auth-step-notic > img {
  display: inline-block;
  width: 300px;
  height: auto;
}
.live-auth-step-notic > p {
  font-size: 28px;
  color: #333;
  margin: 24px;
  span {
    color: #ff8200;
  }
}
.live-auth-step-notic > p:nth-child(2) {
  margin-top: 60px;
}
.live-auth-step-notic .inner-btn-wrap {
  text-align: center;
  margin-top: 110px;
  margin: 110px auto;
}
.live-auth-step-notic .upload-inner-wrap {
  position: relative;
  margin: 0 20px;
}
.live-auth-step-notic .upload-inner-wrap > input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
.live-auth-step-notic .upload-inner-wrap > button {
  display: inline-block;
  background-color: rgba(245, 75, 120, 1);
  color: #fff;
  height: 84px;
  font-size: 32px;
  line-height: 84px;
  width: 100%;
  border: none;
  border-radius: 4px;
}
.live-auth-step-notic .upload-inner-wrap > button:first-child {
  border: 2px solid rgba(245, 75, 120, 1);
  color: rgba(245, 75, 120, 1);
  background: #fff;
}
.live-upload,
.live-fail {
  text-align: center;
  margin-top: 120px;
  padding-bottom: 50px;
}
.live-upload > img,
.live-fail > img {
  display: inline-block;
  width: 360px;
  height: auto;
}
.live-upload > p,
.live-fail > p {
  font-size: 34px;
  color: #333;
  margin-top: 70px;
}
.live-fail > p:nth-child(3) {
  color: #939393;
  font-size: 28px;
  margin-top: 24px;
}
.live-fail > button {
  display: inline-block;
  width: 95%;
  height: 84px;
  line-height: 84px;
  color: #fff;
  background-color: #f54b78;
  margin-top: 110px;
  font-size: 32px;
  border: none;
  border-radius: 4px;
}

.btns {
  :nth-child(1) {
    color: #636363;
  }
  :nth-child(2) {
    color: #507daf;
  }
}

.istxt {
  color: #333333;
}
.already-real-name header {
  background: #FFF;
  text-align: center;
}
.already-real-name header h1 {
  color: #333;
  font-size: 34px;
  padding: 65px 0 28px;
}
.already-real-name header img {
  display: inline-block;
  vertical-align: top;
  width: 441px;
  min-height: 402px;
}
.already-real-name ul {
  margin-top: 20px;
}
.already-real-name ul li {
  position: relative;
  height: 88px;
  line-height: 88px;
  padding-left: 88px;
  background: #FFF url("~@/assets/img/bindcard/list_icon_name@3x.png") no-repeat left 20px center;
  background-size: 58px;
  font-size: 28px;
  color: #939393;
  text-align: right;
  padding-right: 20px;
}
.already-real-name ul li span:first-child {
  position: absolute;
  height: 88px;
  left: 88px;
  top: 0;
  line-height: 88px;
}
.already-real-name ul li:last-child {
  background-image: url("~@/assets/img/bindcard/list_icon_identity_card@3x.png");
}
.safe {
  font-size:.346667rem;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(170,170,170,1);
  margin: .4rem 0;
  text-align: center;
}
.safe-logo {
  display: inline-block;
  width: .586667rem;
  height: .586667rem;
  background-image: url("~@/assets/img/list_disclosure_indicator_nol_brown copy@2x.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  vertical-align: -0.15rem;
}

.bottom-redpackets {
  font-size:24px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(147,147,147,1);
  line-height:33px;
  text-align: center;
  // position: fixed;
  // bottom: 40px;
  // left: 0;
  display: flex;
  width: 100%;
  justify-content: center;
  position: fixed;
  bottom: 40px;
}
</style>

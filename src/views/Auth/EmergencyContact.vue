<template>
  <div class="user-card-auth-root" v-extend-height>
    <!-- 身份识别 -->
      <section class="form-area">
        <div class="item-input user-contacts-name">
          <input tabindex="3" type="text" placeholder="填写紧急联系人姓名" v-model.trim="userData.emergency_contact">
        </div>
        <div class="item-input user-contacts-phone">
          <input tabindex="4" type="phone" placeholder="紧急联系人手机号" v-model.trim="userData.emergency_mobile">
        </div>
        <div class="item-input user-contacts-relation" @click="showRelation = !showRelation">
          {{userData.emergency_title || '请选择你与紧急联系人的关系'}}
          <span class="right-arrow"></span>
        </div>
      </section>
      <section class="form-area submit-area">
        <button class="submit-btn" @click="submitRealNameData">确认</button>
      </section>
      <p class="notic">您的紧急联系人信息已过期，请及时更新</p>
      <!-- 上拉列表 -->
      <van-actionsheet v-model="showRelation">
        <div class="btns">
          <span @click="sureRelation(false)">取消</span>
          <span @click="sureRelation(true)">确定</span>
        </div>
        <van-picker ref="picker" :columns="relationColumns" />
      </van-actionsheet>
  </div>
</template>
<script>
// 组件使用的静态变量
const CHANA_NAME_REG = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/
const PHONE_REG = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
export default {
  name: 'UserCardAuth',
  data () {
    return {
      showRelation: false,
      relationColumns: ['父母', '亲戚', '配偶', '情侣'],
      relation: null,
      userData: {
        emergency_contact: null,
        emergency_mobile: null,
        emergency_title: null
      }
    }
  },
  async created () {
  },
  computed: {
  },
  methods: {
    /**
     * 提交用户数据
     *
     */
    async submitRealNameData () {
      // TODO: 验证环境需要抽象出来，写起来太费事了 使用vue的自定义指令
      for (let [key, item] of Object.entries(this.userData)) {
        if (key === 'emergency_contact' && !CHANA_NAME_REG.test(item)) {
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
      await this.$api['auth/updateEmergencyInfo'](postBody)
      this.$toast('补充成功')
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
    }
  }
}
</script>
<style scoped>
.user-card-auth-root {
  background-color: #f2f2f2;
  overflow: hidden;
  padding-top: 20px;
}
.auth-step {
  padding: 50px 0;
  background-color: #fff;
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
  height: 5px;
  background-color: rgb(199, 199, 199);
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
  margin: 65px 0 0 -0.8em;
}
.right-face .desc {
  display: inline-block;
  margin-top: 65px;
}
.form-area.user-msssage {
  margin: 15px 0 61px;
}
.item-input {
  padding-left: 78px;
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
  background-image: url("~@/assets/img/bindcard/list_icon_name@3x.png");
}
.item-input.user-card-id {
  background-image: url("~@/assets/img/list_icon_identity_card@2x.png");
}
.item-input.user-contacts-name {
  background-image: url("~@/assets/img/bindcard/list_icon_name@3x.png");
}
.item-input.user-contacts-phone {
  background-image: url("~@/assets/img/bindcard/list_icon_linkman_02@3x.png");
  border: 0.5px solid #e6e6e6;
  border-left:  none;
  border-right: none;
}
.item-input.user-contacts-relation {
  position: relative;
  box-sizing: border-box;
  background-image: url("~@/assets/img/bindcard/list_icon_linkman_03@3x.png") ;
  height: 88px;
  line-height: 88px;
  padding-top: 0;
  padding-bottom: 0;
  vertical-align: middle;
  padding-left: 1.2rem;
}
.item-input > input {
  display: inline-block;
  height: 58px;
  line-height: 58px;
  font-size: 28px;
  background: rgba(0, 0, 0, 0);
  width: 100%;
  color: #333;
  margin-left: 16px;
}
.item-input > input::placeholder {
  font-size: 28px;
  color: #939393;
}
.submit-area {
  margin-top: 120px;
}
.form-area .submit-btn {
  display: block;
  margin: 0 auto;
  background-color: #f54b78;
  width: 710px;
  height: 84px;
  line-height: 84px;
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
  font-size: 32px;
  color: #636363;
}
.btns span:last-child {
  float: right;
  font-size: 32px;
  color: #507daf;
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
  font-size: 36px;
  color: #333;
  margin:  24px;
}
.live-auth-step-notic > p:nth-child(2) {
  margin-top: 60px;
}
.notic {
  margin: 24px;
  color: #939393;
  padding-left: 34px;
  margin-top: 16px;
  background: url("~@/assets/img/icon_exclamation_point@2x.png") no-repeat left center;
  background-size: 24px;
  font-size: 24px;
}
.right-arrow {
  position: absolute;
  top: 0;
  right: 30px;
  width: 44px;
  height: 84px;
  background: url("~@/assets/img/list_disclosure_indicator_nol_black@2x.png") no-repeat left center;
  background-size: 44px;
}
</style>

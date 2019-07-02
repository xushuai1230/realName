<template>
  <div class="id-card" v-extend-height>
    <header>海关政策要求，购买跨境商品需要上传{{personName || ''}}的身份证照片用于清关，我们承诺严格保密</header>
    <div class="upload-btns">
      <div class="btn-front"  :style="frontBgUrl" @click="noticUploadRule('front')">
        <img ref="frontImg" v-if="frontImgUrl" class="user-front-img" :src="frontImgUrl" @load="frontOnload">
        <img v-if="!frontImgUrl" src="~@/assets/img/icon_add_idcard@2x.png">
        <p>
          <span :class="{ 're-select' : frontImgUrl }">{{ frontImgUrl ? '重新上传身份证正面' : '上传身份证正面'}}</span>
        </p>
      </div>
      <div class="btn-backend" :style="backendBgUrl" @click="noticUploadRule('backend')">
        <img ref="backendImg" v-if="backendImgUrl" class="user-backend-img" :src="backendImgUrl" @load="backendOnload">>
        <img v-if="!backendImgUrl" src="~@/assets/img/icon_add_idcard@2x.png">
        <p>
          <span :class="{ 're-select' : backendImgUrl }">{{ backendImgUrl ? '重新上传身份证反面' : '上传身份证反面'}}</span>
        </p>
      </div>
    </div>
    <div class="form-area">
      <button :class="{ active: buttonActive }" @click="sureUserCard">确认提交</button>
    </div>
    <van-popup v-model="frontLogBol">
      <div class="pop-inner-warp">
        <h1>正面照片示范</h1>
          <img src="~@/assets/img/img_idcard_face@2x.png">
          <section class="van-hairline--bottom">
            <p>
              <span></span>
              确保身份证边框完整，字迹清晰，亮度均匀，否则会影响清关；
            </p>
            <p>
              <span></span>
              资料仅应用于海关清关，我们承诺严格保密。
            </p>
          </section>
          <div class="input-file-area">
            我知道了
            <input @click="$toast('请确保系统对微博开启了相机权限')" :class="{ 're-select': frontImgUrl }" type="file" ref="frontFile" @change="fileSelectHandler('front')" class="front-file" accept="image/*" />
          </div>
      </div>
    </van-popup>
    <van-popup v-model="backendLogBol">
      <div class="pop-inner-warp">
        <h1>反面照片示范</h1>
          <img src="~@/assets/img/img_idcard_con@2x.png">
          <section class="van-hairline--bottom">
            <p>注意证件上的“签证机关”和“有效期”要清晰，否则可能会影响清关；</p>
            <p>资料仅应用于海关清关，我们承诺严格保密。</p>
          </section>
          <div class="input-file-area">
            我知道了
            <input @click="$toast('请确保系统对微博开启了相机权限')" :class="{ 're-select': backendImgUrl }" type="file" ref="backendFile" @change="fileSelectHandler('backend')" class="backend-file" accept="image/*" />
          </div>
      </div>
    </van-popup>
    <!-- 拍照，或者图片上传 -->
  </div>
</template>
<script>
export default {
  name: 'IdCardAuth',
  data () {
    return {
      userName: null,
      userCard: null,
      userValidDate: null,
      frontImgUrl: '',
      backendImgUrl: '',
      addressId: null,
      idCard: null,
      frontReady: false, // 前端文件数据是否准备好
      backendReady: false,
      frontLogBol: false, // 展示正面模板
      backendLogBol: false, // 展示背面模板
      logBol: false, // 是否展示模板
      frontFile: null, // 正面照片文件
      backendFile: null, // 背面照片文件
      personName: '' // 用户名称
    }
  },
  computed: {
    frontBgUrl () {
      if (this.frontImgUrl) {
        return {
          backgroundImage: `url(${this.frontImgUrl})`
        }
      } else {
        return ''
      }
    },
    backendBgUrl () {
      if (this.backendImgUrl) {
        return {
          backgroundImage: `url(${this.backendImgUrl})`
        }
      } else {
        return ''
      }
    },
    buttonActive () {
      return this.frontReady && this.backendReady
    }
  },
  mounted () {
    this.fetchIdCardUpload()
  },
  methods: {
    /**
     * 将文件句柄转换成url的形式， 方便在页面上预览
     * TODO: 如果用户上传的文件大小超过后端限制了怎么办，是否有前端压缩的方式。
     *
     */
    fileSelectHandler (type) {
      let file
      if (type === 'front') {
        this.userSureUpload('front')
        file = this.$refs.frontFile.files[0]
        this.frontFile = file
        this.frontImgUrl = window.URL.createObjectURL(file)
      } else if (type === 'backend') {
        this.userSureUpload('backend')
        file = this.$refs.backendFile.files[0]
        this.backendFile = file
        this.backendImgUrl = window.URL.createObjectURL(file)
      }
    },
    /**
     * 用户身份证正面图片load后
     *
     */
    frontOnload () {
      this.uploadFile('front')
      this.frontReady = true
    },
    /**
     * 用户身份证背面图片load后
     *
     */
    backendOnload () {
      this.uploadFile('backend')
      this.backendReady = true
    },
    /**
     * 文件上传
     *
     */
    async uploadFile (type) {
      const formData = new FormData()
      let imgBlob
      if (type === 'front') {
        let width = this.getSomeComputedStyle(this.$refs.frontImg, 'width')
        let height = this.getSomeComputedStyle(this.$refs.frontImg, 'height')
        imgBlob = await this.compressImageToBlob(this.$refs.frontImg, width * 2, height * 2)
      } else if (type === 'backend') {
        let width = this.getSomeComputedStyle(this.$refs.backendImg, 'width')
        let height = this.getSomeComputedStyle(this.$refs.backendImg, 'height')
        imgBlob = await this.compressImageToBlob(this.$refs.backendImg, width * 2, height * 2)
      }
      formData.append('file', imgBlob, 'img.png')
      formData.append('token', this.userToken)
    },
    /**
     * 获取指定元素的的指定计算属性，去掉单位部分
     *
     */
    getSomeComputedStyle (el, property) {
      return getComputedStyle(el)[property].match(/(\d+)/)[1]
    },
    /**
     * 将图像进行压缩
     *
     */
    compressImageToBlob (image, width, height, qua) {
      console.log('width, height', width, height)
      let quality = qua ? qua / 100 : 0.8
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      let w = image.naturalWidth
      let h = image.naturalHeight
      canvas.width = width || w
      canvas.height = height || h
      ctx.drawImage(image, 0, 0, w, h, 0, 0, width || w, height || h)
      return new Promise(resolve => {
        canvas.toBlob(blob => {
          resolve(blob)
        }, 'image/png', quality)
      })
    },
    /**
     * 用户确定选择身份证信息
     *
     */
    async sureUserCard () {
      if (this.buttonActive) {
        global.vbus.$emit('loading_show', true)
        const formData = new FormData()
        formData.append('token', this.userToken)
        formData.append('idCard', this.idCard)
        formData.append('addressId', this.addressId)
        formData.append('cardFrontImg', this.frontFile)
        formData.append('cardBackImg', this.backendFile)
        await this.$api['auth/perfetInformation'](formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        global.vbus.$emit('loading_show', false)
        const type = this.getQueryString('type') || 'url'
        const routerDataStr = this.getQueryString('routerData')
        let routerData
        if (type === 'router') {
          routerData = JSON.parse(routerDataStr)
        }
        if (routerData.name === 'OrderFill') {
          await this.userAlert({ message: '清关信息提交成功，您还需前往结算页提交订单', cancelButtonText: '我再想想', confirmButtonText: '前往提交' })
        } else {
          await this.userAlert({ message: '清关信息提交成功', showCancelButton: false, confirmButtonText: '确认' })
        }
        const method = this.getQueryString('method') || 'replace'
        const cb = this.getQueryString('cb')
        if (cb || routerData) {
          if (type === 'router') {
            if (routerData.query) {
              routerData.query.haitao = 'complete'
            } else {
              routerData.query = {
                haitao: 'complete'
              }
            }
            this.$router[method](routerData)
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
     * 文件上传情况
     *
     */
    async fetchIdCardUpload () {
      const addressId = this.getQueryString('addressId')
      let addressObj
      if (addressId) {
        let res = await this.$api['auth/selAddressOne']({ token: this.userToken, id: addressId })
        addressObj = res.addresses
        if (addressObj) {
          this.addressId = addressObj.id
          this.idCard = addressObj.idCard
          this.personName = addressObj.person
        }
      }
    },
    /**
     * 告诉用户上传规则
     *
     */
    noticUploadRule (type) {
      if (!this.logBol) {
        if (type === 'front') {
          this.frontLogBol = true
        } else if (type === 'backend') {
          this.backendLogBol = true
        }
      }
    },
    /**
     * 用户确认上传
     *
     */
    userSureUpload (type) {
      if (type === 'front') {
        setTimeout(() => {
          this.frontLogBol = false
        }, 100)
      } else if (type === 'backend') {
        this.$nextTick(() => {
          setTimeout(() => {
            this.backendLogBol = false
          }, 100)
        })
      }
    },
    /**
     * 询问用户是否确认
     *
     */
    userAlert ({ message, showConfirmButton = true, showCancelButton = true, confirmButtonText, cancelButtonText }) {
      return new Promise((resolve, reject) => {
        this.$dialog.alert({
          message,
          showConfirmButton,
          showCancelButton,
          cancelButtonText,
          confirmButtonText,
          beforeClose: (action, done) => {
            done()
            if (action === 'confirm') {
              resolve('confirm')
            } else {
              // eslint-disable-next-line prefer-promise-reject-errors
              reject('cancel')
            }
          }
        })
      })
    }
  }
}
</script>
<style scoped lang="scss">
.id-card {
  background: #FFF;
}
header {
  font-size: 24px;
  color: #C8732C;
  padding: 20px 30px;
  background-color: #FFF5D9;
  line-height: 1.6em;
  text-align: justify;
}
.upload-btns {
  text-align: center;
  font-size: 0;
  padding: 90px 0 142px;
  background-color: #FFF;
}
.upload-btns > div {
  width: 420px;
  display: block;
  margin: 0 auto;
}
.upload-btns > div:first-child {
  margin-bottom: 116px;
}
.btn-front, .btn-backend {
  position: relative;
  background: url('~@/assets/img/img_idcard_face@2x.png') no-repeat center center;
  background-size: 100%;
  width: 420px;
  height: 265px;
  line-height: 265px;
  text-align: center;
}
.front-file, .backend-file {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
.front-file.re-select, .backend-file.re-select {
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.btn-backend {
  background-image: url('~@/assets/img/img_idcard_con@2x.png');
}
.btn-front > img, .btn-backend > img {
  display: inline-block;
  width: 80px;
  height: auto;
  vertical-align: middle;
  border-radius: 12px;
}
.btn-front > p, .btn-backend > p {
  position: absolute;
  left: 0;
  bottom: -50px;
  font-size: 28px;
  color: #333;
  width: 100%;
  line-height: 1em;
  text-align: center;
}
.btn-front > p span.re-select, .btn-backend > p span.re-select {
  background: url('~@/assets/img/list_icon_refresh_black@2x.png') no-repeat left center;
  background-size: 44px;
  padding-left: 50px;
}
.form-area {
  text-align: center;
  div {
    border-bottom: 1px solid #e6e6e6;
    box-sizing: border-box;
  }
  .bt1 {
    border-top: 1px solid #e6e6e6;
  }
}
.form-area > h1 {
  font-size: 24px;
  color: #333;
  background-color: #f2f2f2;
  margin: 30px;
  text-align: left;
}
.form-area > div {
  background-color: #FFF;
  font-size: 28px;
  color: #333;
  height: 84px;
  white-space: nowrap;
  overflow: hidden;
  position: relative;
}
.form-area > div > input {
  display: inline-block;
  height: 100%;
  width: 100%;
  margin-left: 217px;
  font-size: 28px;
  color: #333;
}
.form-area > div > span {
  position: absolute;
  height: 100%;
  line-height: 88px;
  padding-left: 30px;
}
.form-area > div > input::placeholder {
  font-size: 28px;
  color: #939393;
}
.form-area > button {
  display: inline-block;
  background: #FFABC1;
  height: 84px;
  line-height: 84px;
  color: #FFF;
  width: 95%;
  border: none;
  border-radius: 4px;
  font-size: 32px;
}
.form-area > button.active {
  background: #F54B78;
}
.btn-front > img.user-front-img, .btn-backend > img.user-backend-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.user-front-img, .user-backend-img {
  border-radius: 12px;
}
.pop-inner-warp {
  text-align: center;
  color: #333;
}
.pop-inner-warp > h1 {
  font-size: 32px;
  margin: 46px 0 42px;
  text-align: center;
  font-weight: 600;
}
.pop-inner-warp > img {
  display: inline-block;
  width: 420px;
}
.pop-inner-warp > section {
  padding: 34px 50px 62px;
  font-size: 28px;
  width: 500px;
  color: #333;
}
.pop-inner-warp > section > p {
  margin-bottom: 16px;
  line-height: 1.5em;
  text-align: justify;
}
.pop-inner-warp > section > p > span {
  float: left;
  vertical-align: middle;
  background-color: #F54B78;
  width: 8px;
  height: 8px;
  margin: 15px 0 50px;
  border-radius: 50%;
  margin-right: 20px;
}
.pop-inner-warp .input-file-area {
  position: relative;
  display: block;
  color: #507DAF;
  font-size: 32px;
  height: 88px;
  line-height: 88px;
}
</style>

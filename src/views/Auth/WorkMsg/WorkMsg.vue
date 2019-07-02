<template>
  <div class="WorkMsg">
    <div class="inputMsg">
      <div class="noInput__box" @click="vocationSelectShowFn" :class="!vocationName ? 'noMsgcolor' : ''">
        <div class="left-icon"></div>
        {{vocationName ? vocationName : '行业'}}
        <div class="right-icon"></div>
      </div>
      <div class="Input__box">
        <div class="left-icon"></div>
        <form>
          <input type="text" v-model="unitName" placeholder="单位名称" />
        </form>
      </div>
      <div class="noInput__box" @click="dutiesSelectShowFn" :class="!duties ? 'noMsgcolor' : ''">
        <div class="left-icon"></div>
        {{duties ? duties : '职务'}}
        <div class="right-icon"></div>
      </div>
      <div class="Input__box">
        <div class="left-icon"></div>
        <form>
          <input type="text" v-model="salary" placeholder="月薪" />
        </form>
      </div>
      <div class="Input__box" :class="!address ? 'noMsgcolor' : ''" @click="areaSelectFn">
        <div class="left-icon"></div>
        {{address ? address : '单位地址'}}
        <!-- <form>
          <input type="text" v-model="address" :class="!address ? 'noMsgcolor' : ''" placeholder="单位地址" />
        </form> -->
        <div class="right-icon"></div>
      </div>
      <div class="Input__box">
        <div class="left-icon"></div>
        <form>
          <input type="text" v-model="detailAddress" placeholder="详细地址（如门牌号）" />
        </form>
      </div>
      <div class="Input__box">
        <div class="left-icon"></div>
        <form>
          <input type="text" v-model="tel" placeholder="单位固定电话（可选）" />
        </form>
      </div>
    </div>
    <div class="uploadImg">
      <img ref="frontImg" v-show="workImgUrl" class="user-front-img" :src ="workImgUrl">
      <img v-show="!workImgUrl" src="~@/assets/img/list_image_with_id_card@3x.png">
      <input :class="{ 're-select': workImgUrl }"
             type="file"
             ref="frontFile"
             @change="fileSelectHandler"
             class="front-file"
             accept="image/*" />
    </div>
    <div class="uploadImg-txt">上传工作牌照片(可选)</div>
    <div class="post-data-box">
      <div class="btn" @click="postFn">确定</div>
    </div>
    <!-- 行业弹窗 -->
    <div class="vocation-select-dialog" v-if="vocationSelectShow">
      <div class="vocation-box">
        <div v-for="(vocationItem, index) in vocationList" :key="'vocation' + index" @click="selectVocationFn(vocationItem.dictValue)">
          {{vocationItem.dictValue}}
        </div>
      </div>
    </div>
    <!-- 职务弹窗 -->
    <div class="duties-select-dialog" v-if="dutiesSelectShow">
      <div class="duties-box">
        <div v-for="(dutiesItem, index) in dutiesList" :key="'duties' + index" @click="selectDutiesFn(dutiesItem.dictValue)">
          {{dutiesItem.dictValue}}
        </div>
      </div>
    </div>
    <!-- 省市区组件 -->
		<address-area :show="showSelectAddress" @select-submit="handleAreaSelect"></address-area>
  </div>
</template>

<script>
import addressArea from './AddressArea'
export default {
  name: 'WorkMsg',
  data () {
    return {
      workImgUrl: '', // 上传照片url
      vocationName: '', // 行业
      unitName: '', // 单位名称
      duties: '', // 职务
      salary: '', // 月薪
      address: '', // 单位地址
      detailAddress: '', // 详细地址
      tel: '', // 单位固定电话
      vocationSelectShow: false, // 行业弹窗
      vocationList: [],
      dutiesSelectShow: false,
      dutiesList: [],
      showSelectAddress: false
    }
  },
  watch: {
  },
  computed: {
  },
  async mounted () {
  },
  async created () {
    this.getDictList()
  },
  methods: {
    areaSelectFn () {
      this.showSelectAddress = true
    },
    handleAreaSelect (address) {
      this.showSelectAddress = false
      console.log(address, 'address')
      if (address.area && address.city && address.province) {
        this.address = address.province.fullName + ' ' + address.city.fullName + ' ' + address.area.fullName
      } else {
        this.address = ''
      }
    },
    postFn () {
      if (!this.address) {
        this.$toast('请选择单位地址')
        return false
      }
      if (!this.detailAddress) {
        this.$toast('请输入详细地址')
        return false
      }
      if (!this.vocationName) {
        this.$toast('请选择行业')
        return false
      }
      if (!this.unitName) {
        this.$toast('请输入单位名称')
        return false
      }
      let postaddress = this.address + this.detailAddress
      this.$api['borrowHistory/suppJobInfo']({
        occupation: this.vocationName,
        unitName: this.unitName,
        duties: this.duties,
        salary: this.salary,
        address: postaddress,
        tel: this.tel,
        imgUrl: this.workImgUrl,
        token: this.userToken
      }).then(res => {
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
        } else {
          this.$router.push({ name: 'HistoryPage' })
        }
      })
    },
    // 获取职务
    getDutiesList () {
      this.$api['borrowHistory/getDictList']({
        token: this.userToken,
        dictType: 'Position'
      }).then(res => {
        this.dutiesList = res.data
      })
    },
    dutiesSelectShowFn () {
      this.getDutiesList()
      this.dutiesSelectShow = true
    },
    selectDutiesFn (duties) {
      this.duties = duties
      this.dutiesSelectShow = false
    },
    // 获取行业
    getDictList (dictType) {
      this.$api['borrowHistory/getDictList']({
        token: this.userToken,
        dictType: 'Industry'
      }).then(res => {
        this.vocationList = res.data
      })
    },
    selectVocationFn (vocationName) {
      this.vocationName = vocationName
      this.vocationSelectShow = false
    },
    vocationSelectShowFn () {
      this.vocationSelectShow = true
    },
    async fileSelectHandler () {
      let file
      file = this.$refs.frontFile.files[0]
      console.log(file, 'file')
      const formData = new FormData()
      formData.append('imgMultipartFile', file, 'img.png')
      formData.append('token', this.userToken)
      let res = await this.$api['borrowHistory/uploadImgFile'](formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      console.log('res: ', res)
      if (res.imgNewUrl) {
        this.workImgUrl = res.imgNewUrl
      }
    }
  },
  components: {
    addressArea
  },
  destroyed () {
  }
}
</script>

<style lang="scss" scoped>
.WorkMsg {
  display: inline-block;
  width: 100%;
  background: #f2f2f2;
  .inputMsg {
    margin-top: 20px;
    font-size: 28px;
    line-height: 58px;
    .noMsgcolor {
      color:rgba(153,153,153,1);
    }
    .noInput__box {
      border-bottom: 1px solid #efefef;
      height: 88px;
      line-height: 58px;
      width: 100%;
      box-sizing: border-box;
      padding: 15px 0 15px 20px;
      background: #fff;
      .left-icon {
        height: 58px;
        width: 58px;
        float: left;
        margin-right: 10px;
      }
    }
    .Input__box {
      border-bottom: 1px solid #efefef;
      height: 88px;
      width: 100%;
      box-sizing: border-box;
      padding: 15px 0 15px 20px;
      background: #fff;
      .left-icon {
        height: 58px;
        width: 58px;
        float: left;
        margin-right: 10px;
      }
      input {
        height: 58px;
        width: 76%;
        float: left;
        padding: 14px 0 14px 0;
        box-sizing: border-box;
        color: #333333;
      }
      input::-webkit-input-placeholder{
        padding-top: 12px;
        font-size: 28px;
        line-height:normal;
        color: #939393;
      }
    }
    .right-icon {
      margin-top: 7px;
      height: 44px;
      width: 44px;
      float: right;
      background: url('~@/assets/img/list_icon_enter_nol@3x.png') no-repeat;
      background-size: 100%;
      margin-right: 30px;
    }
    :nth-child(1) {
      line-height: 58px;
      .left-icon {
        background: url('~@/assets/img/list_icon_graduation_work@3x.png') no-repeat;
        background-size: 100%;
      }
    }
    :nth-child(2) {
      input {
        width: 86%;
        // height: 28px;
      }
      .left-icon {
        background: url('~@/assets/img/list_icon_company_name@3x.png') no-repeat;
        background-size: 100%;
      }
    }
    :nth-child(3) {
      line-height: 58px;
      .left-icon {
        background: url('~@/assets/img/list_icon_post_company@3x.png') no-repeat;
        background-size: 100%;
      }
    }
    :nth-child(4) {
      line-height: 58px;
      margin-bottom: 20px;
      input {
        width: 86%;
      }
      .left-icon {
        background: url('~@/assets/img/list_icon_Salary@3x.png') no-repeat;
        background-size: 100%;
      }
    }
    :nth-child(5) {
      line-height: 58px;
      border-top: 1px solid #efefef;
      input {
        width: 76%;
      }
      .left-icon {
        background: url('~@/assets/img/list_icon_company_address@3x.png') no-repeat;
        background-size: 100%;
      }
      .right-icon {
        background: url('~@/assets/img/list_icon_enter_nol@3x.png') no-repeat;
        background-size: 100%;
      }
    }
    :nth-child(6) {
      line-height: 58px;
      margin-bottom: 20px;
      border-top: 1px solid #efefef;
      input {
        // padding-top: 10px;
        width: 86%;
      }
      input::-webkit-input-placeholder{
        padding-top: 6px;
        font-size: 28px;
        line-height:normal;
        color: #939393;
      }
    }
    :nth-child(7) {
      line-height: 58px;
      border-top: 1px solid #efefef;
      input {
        width: 86%;
      }
      input::-webkit-input-placeholder{
        font-size: 28px;
        line-height:normal;
        color: #939393;
      }
      .left-icon {
        background: url('~@/assets/img/list_icon_graduation_company_phone@3x.png') no-repeat;
        background-size: 100%;
      }
    }
  }
  .uploadImg {
    width: 225px;
    min-height: 320px;
    margin: 45px auto 0;
    position: relative;
    img {
      width: 225px;
      height: 300px;
      display: inline-block;
      margin-bottom: 20px;
    }
    .front-file {
      position: absolute;
      top: 0;
      left: 0;
      width: 225px;
      height: 300px;
      opacity: 0;
    }
    .user-front-img {
      width: 225px;
      height: 300px;
      display: inline-block;
      margin-bottom: 20px;
    }
  }
  .uploadImg-txt {
    width: 100%;
    height:28px;
    text-align: center;
    font-size: 24px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:#333333;
    line-height:28px;
    margin-bottom: 40px;
  }
  .post-data-box {
    width: 100%;
    height: 84px;
    box-sizing: border-box;
    padding: 0 20px;
    margin-bottom: 140px;
    .btn {
      width: 100%;
      height: 84px;
      background:rgba(245,75,120,1);
      font-size:32px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(255,255,255,1);
      line-height:84px;
      text-align: center;
      border-radius:4px;
    }
  }
  .vocation-select-dialog {
    width: 100%;
    height: 100%;
    overflow: scroll;
    position: fixed;
    left: 0;
    top: 0;
    background: #fff;
    box-sizing: border-box;
    .vocation-box {
      position: relative;
      left: 0;
      top: 0;
      width: 100%;
      margin-top: 20px;
      margin-bottom: 20px;
      div {
        height: 88px;
        width: 100%;
        background: #fff;
        box-sizing: border-box;
        padding: 15px 0 15px 30px;
        line-height: 58px;
        font-size:28px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        border-bottom: 1px solid #e6e6e6;
        color: #333333;
      }
      :nth-child(1) {
        border-top: 1px solid #e6e6e6;
      }
    }
  }
  .duties-select-dialog {
    width: 100%;
    height: 100%;
    overflow: scroll;
    position: fixed;
    left: 0;
    top: 0;
    background: #fff;
    box-sizing: border-box;
    .duties-box {
      position: relative;
      left: 0;
      top: 0;
      width: 100%;
      margin-top: 20px;
      margin-bottom: 20px;
      div {
        height: 88px;
        width: 100%;
        background: #fff;
        box-sizing: border-box;
        padding: 15px 0 15px 30px;
        line-height: 58px;
        font-size:28px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        border-bottom: 1px solid #e6e6e6;
        color: #333333;
      }
      :nth-child(1) {
        border-top: 1px solid #e6e6e6;
      }
    }
  }
}
</style>

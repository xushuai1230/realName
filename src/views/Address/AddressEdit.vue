<template>
	<div class="addressEdit" ref="addressEdit">
		<div class="tip">
			<div>分期的商品请填写详细的收货地址，否则无法进行派送</div>
		</div>
		<!-- <div class="cellGroup">
			<van-cell-group>
				<van-field v-model="addressData.person" required clearable label="收 件 人：" placeholder="姓名" />
				<van-field v-model="addressData.mobilePhone" required clearable type="tel" label="手机号码:" placeholder="手机或固定电话" />
				<van-field v-model="provinceAndCityAndCounty" required readonly label="省 市 区：" @click="openAddressArea" />
				<van-field v-model="addressData.address" required clearable label="详细地址：" placeholder="如街道、楼层、门牌号等" />
			</van-cell-group>
		</div> -->
    <div class="infoItem van-hairline--top-bottom">
      <div class="wrap clearfix">
        <span>*</span>
        <span class="label">收 件 人：</span>
        <input type="text" placeholder="姓名" v-model="addressData.person">
      </div>
    </div>
    <div class="infoItem van-hairline--bottom">
      <div class="wrap clearfix">
        <span>*</span>
        <span class="label">手机号码：</span>
        <input type="text" placeholder="手机或固定电话" v-model="addressData.mobilePhone">
      </div>
    </div>
    <div class="infoItem van-hairline--bottom" @click.stop.prevent="openAddressArea">
      <div class="wrap clearfix">
        <span>*</span>
        <span class="label">省 市 区：</span>
        <input type="text" readonly v-model="provinceAndCityAndCounty">
        <div class="img">
          <img src="~@/assets/img/address/list_address_gray@3x.png" alt="">
        </div>
      </div>
    </div>
    <div class="infoItem van-hairline--bottom">
      <div class="wrap clearfix">
        <span>*</span>
        <span class="label">详细地址：</span>
        <input type="text" placeholder="如街道、楼层、门牌号等" v-model="addressData.address">
      </div>
    </div>
		<div class="switch van-hairline--bottom">
			<div class="wrap clearfix">
				<span class="fl">设为默认</span>
				<div class="fr">
					<van-switch v-model="checked" active-color="#44DB5E" inactive-color="#DADADA" />
				</div>
			</div>
		</div>
		<div class="saveAddress van-hairline--top" @click="onSave">
			<span>{{addressData.id ? '保存地址' : '保存新地址'}}</span>
		</div>
		<address-area :show="showSelectAddress" @select-submit="handleAreaSelect"></address-area>
	</div>

</template>

<script type="text/ecmascript-6">
import formChecker from '@/module/formChecker'
import addressArea from './AddressArea'
export default {
  name: 'AddressEdit',
  props: {},
  data () {
    return {
      errArr: ['新疆', '内蒙', '西藏', '青海', '广西', '贵州', '甘肃', '北京', '香港', '澳门', '台湾', '海南', '海外'],
      addressData: {
        address: '',
        city: '',
        cityCode: '',
        county: '',
        countyCode: '',
        id: null,
        isDefault: false,
        mobilePhone: '',
        person: '',
        province: '',
        provinceCode: ''
      },
      checked: false,
      showSelectAddress: false,
      from: ''
    }
  },
  computed: {
    provinceAndCityAndCounty () {
      if (this.addressData.province && this.addressData.city && this.addressData.county) {
        return this.addressData.province + ' ' + this.addressData.city + ' ' + this.addressData.county
      } else {
        return ''
      }
    }
  },
  created () {
    console.log('params', this.$route.params)
    this.from = this.$route.query['from']
    this.fetchData()
  },
  methods: {
    transferAddressData (address) {
      this.addressData.province = address.province.fullName
      this.addressData.provinceCode = address.province.code
      this.addressData.city = address.city.fullName
      this.addressData.cityCode = address.city.code
      this.addressData.county = address.area.fullName
      this.addressData.countyCode = address.area.code
    },
    openAddressArea () {
      this.showSelectAddress = true
    },
    onSave () {
      // 验证保存条件
      if (!this.validate()) {
        return
      }
      if (this.checked) this.addressData.isDefault = this.checked
      global.ajax.post('v2/order/address/save.json', this.addressData, { params: { token: this.userToken } }).then(res => {
        if (this.from === 'OrderFill') {
          this.$router.replace({
            name: 'OrderFill',
            params: {
              currentSelectAddress: res.address
            }
          })
        } else {
          this.$router.go(-1)
        }
      }).catch(err => {
        console.log(err)
        this.$router.go(-1)
      })
    },
    validate () {
      if (!this.addressData.person) {
        this.$toast('请填写收件人')
        return false
      }
      if (!formChecker.checkPhone(this.addressData.mobilePhone)) {
        this.$toast('请填写正确的手机号')
        return false
      }
      if (!this.provinceAndCityAndCounty) {
        this.$toast('请选择省市区')
        return false
      }
      if (!this.addressData.address) {
        this.$toast('请填写详细地址')
        return false
      }
      // if (!this.checkProvince()) {
      //   this.$toast('暂不支持偏远地区物流')
      //   return false
      // }
      return true
    },
    checkProvince () {
      for (let i = 0; i < this.errArr.length; i++) {
        if (this.provinceAndCityAndCounty.indexOf(this.errArr[i]) !== -1) {
          return false
        }
      }
      return true
    },
    handleAreaSelect (address) {
      this.showSelectAddress = false
      this.transferAddressData(address)
    },
    fetchData () {
      const addressData = this.$route.params.addressData
      if (addressData && addressData.id) {
        document.title = '编辑收货地址'
        this.addressData = addressData
      } else {
        document.title = '添加新地址'
      }
    }
  },
  components: { addressArea }
}
</script>
<style lang="scss">
html {
  background: #f9f9f9;
}
.addressEdit {
  background-color: #f9f9f9;
  .van-cell {
    padding: 26px 60px;
  }
  .van-field__body {
    height: 48px;
  }
  .van-cell__title {
    text-align: left;
    span {
      font-family: PingFangSC-Regular;
      color: #333;
    }
  }
  // .cellGroup {
  //   [class*="van-hairline"]::after {
  //     display: none;
  //   }
  // }

  .van-field__control::-webkit-input-placeholder {
    color: #939393;
  }
  .van-cell--required::before {
    left: 20px;
    top: 35px;
    width: 40px;
    font-size: 28px;
    font-family: PingFangSC-Regular;
    color: #333;
    line-height: 40px;
  }
  .van-cell::after,
  .van-cell:not(:last-child)::after {
    left: 0;
    right: 0;
    width: auto;
    -webkit-transform: scale(1, 0.5);
    transform: scale(1, 0.5);
    border-bottom-width: 1px;
    border-color: #e6e6e6;
  }
}
</style>

<style lang="scss" scoped>
.addressEdit {
  text-align: center;
  .tip {
    height: 70px;
    background: #FFF5D9;
    margin-bottom: 20px;
    div {
      font-size: 28px;
      font-family: PingFangSC-Regular;
      color: #C8732C;
      line-height: 70px;
    }
  }
  .saveAddress {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 98px;
    background-color: #fff;
    padding: constant(safe-area-inset-top) constant(safe-area-inset-right)
    constant(safe-area-inset-bottom) constant(safe-area-inset-left);
    padding: env(safe-area-inset-top) env(safe-area-inset-right)
    env(safe-area-inset-bottom) env(safe-area-inset-left);
    span {
      display: inline-block;
      margin-top: 24px;
      font-size: 36px;
      font-family: PingFangSC-Regular;
      color: rgba(237, 20, 91, 1);
      line-height: 50px;
    }
  }
  .switch {
    height: 100px;
    padding: 19px 30px;
    box-sizing: border-box;
    background-color: #fff;
    span {
      display: inline-block;
      height: 62px;
      font-size: 28px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(0, 0, 0, 1);
      line-height: 62px;
      margin-left: 30px;
    }
  }
  .infoItem {
    padding: 26px 20px;
    height: 100px;
    box-sizing: border-box;
    background-color: #fff;
    text-align: left;
    font-size: 0;
    position: relative;
    span {
      float: left;
      display: inline-block;
      font-size: 28px;
      font-weight:400;
      &:nth-of-type(1) {
        width: 40px;
        height: 48px;
        text-align: left;
        line-height: 48px;
      }
      &.label {
        width: 156px;
        color: #333;
        font-size: 28px;
        line-height: 48px;
      }
    }
    input {
      float: left;
      height: 48px;
      line-height: normal;
      width: 450px;
      color: #333;
      box-sizing: border-box;
      font-size: 28px;
    }
    input::-webkit-input-placeholder{
      color: #939393;
    }
    .cityname {
      width: 450px;
      color: #333;
      font-size: 28px;
      line-height: 48px;
      height: 48px;
    }
    .img {
      position: absolute;
      top: 28px;
      right: 30px;
      img {
        width: 58px;
        height: 58px;
      }
    }
  }
}
</style>

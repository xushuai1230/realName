<template>
	<div class="address" ref="address" v-show="reqReady">
		<div class="address__wrap" v-if="addresses && addresses.length">
			<ul class="address__list">
				<li class="address__item" v-for="item in addresses" :key="item.id" @click.stop.prevent="selectCurAdress(item)">
					<div class="address__user van-hairline--bottom">
						<div class="address__nameInfo">
							<span class="name">{{item.person}}</span>
							<span class="phone">{{item.mobilePhone}}</span>
							<span class="default" v-if="item.isDefault">默认</span>
						</div>
						<div class="address__detail">
							{{item.province}} {{item.city}} {{item.county}} {{item.address}}
						</div>
					</div>
					<div class="address__fnBar fnBar clearfix">
						<div class="fnBar__left fl" @click.stop.prevent="changeDefaultAddress(item)">
							<img src="~@/assets/img/list_icon_sel@3x.png" v-if="item.isDefault" />
							<img src="~@/assets/img/list_icon_selec_nol1@3x.png" v-else />
							<span>{{item.isDefault ? '默认': '设置默认'}}地址</span>
						</div>
						<div class="fnBar__right fr">
							<div @click.stop.prevent="editAddress(item)" class="edit">
								<img src="~@/assets/img/list_btn_edit_nol1@3x.png">
								<span>编辑</span>
							</div>
							<div @click.stop.prevent="delAddress(item.id)" class="del">
								<img src="~@/assets/img/list_btn_delelt_nol1@3x.png">
								<span>删除</span>
							</div>
						</div>
					</div>
				</li>
			</ul>
			<div class="address__add" @click="addNewAddress">
				<span>添加新地址</span>
			</div>
		</div>
		<div class="address__wrap noData" v-else>
			<img src="~@/assets/img/blankpage_img_search@3x.png" alt="">
			<p>别忘了填写您的收货地址哦</p>
			<div class="btn" @click="addNewAddress">添加收货地址</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
import { initLink } from 'insfns'
export default {
  name: 'Address',
  props: {},
  data () {
    return {
      addresses: null,
      orderCode: '',
      reqReady: false,
      from: ''
    }
  },
  async created () {
    this.orderCode = this.$route.params['orderCode']
    this.from = this.$route.query['from']
    try {
      this.addresses = await this.getAddressList()
      this.reqReady = true
    } catch (error) {
      this.reqReady = true
    }
  },
  methods: {
    selectCurAdress (address) { // 用户选择新的收货地址
      if (!this.from) return false
      console.log('更换收货地址')
      // let currentSelectAddress = JSON.stringify(address)
      // window.sessionStorage.setItem('currentSelectAddress', currentSelectAddress)
      this.$router.replace({
        name: 'OrderFill',
        params: {
          currentSelectAddress: address
        },
        query: {
          noCache: Date.now()
        }
      })
    },
    editAddress (addressData) {
      this.$router.push({
        name: 'AddressEdit',
        params: {
          addressData: addressData
        },
        query: {
          from: this.from
        }
      })
    },
    delAddress (id) {
      this.$api['address/deleteAddress']({
        token: this.userToken,
        id
      }).then(async res => {
        this.$toast('删除地址成功')
        this.addresses = await this.getAddressList()
      })
    },
    changeDefaultAddress (addressData) {
      // 更换默认收货地址
      this.$api['address/setDefaultAddress']({
        token: this.userToken,
        id: addressData.id
      }).then(async res => {
        this.$toast('默认地址更换成功')
        this.addresses = await this.getAddressList()
      })
    },
    addNewAddress () {
      this.$router.push({
        name: 'AddressEdit',
        query: {
          from: this.from
        }
      })
    },
    async jumpTo () {
      let href = `bsd://xxyp/pay/cashier?orderCode=${this.orderCode}`
      if (this.isApp) {
        location.href = href
      } else {
        let linkHref = await initLink(href)
        var el = document.createElement('a')
        document.body.appendChild(el)
        el.href = linkHref
        el.click()
      }
    },
    getAddressList () {
      return this.$api['address/getAllAddress']({
        token: this.userToken ? this.userToken : window.sessionStorage.getItem('token')
      }).then(res => {
        let addresses = res.addresses
        res.addresses.map((item, index) => {
          if (item.isDefault) {
            addresses.splice(index, 1)
            addresses.unshift(item)
          }
        })
        return addresses
      })
    }
  }
}
</script>
<style lang="scss">
.van-dialog__message {
  text-align: center;
}
</style>

<style scoped lang="scss">
.address {
  margin-top: 20px;
  &__wrap {
    padding-bottom: 88px;
  }
  &__item {
    background-color: #fff;
    margin-bottom: 20px;
  }
  &__user {
    padding: 22px 30px;
    text-align: left;
  }
  &__nameInfo {
    margin-bottom: 13px;
    span {
      display: inline-block;
      height: 40px;
      font-size: 28px;
      font-family: PingFangSC-Semibold;
      color: #333;
      line-height: 40px;
    }
    .name,
    .phone {
      margin-right: 40px;
    }
    .default {
      background-color: #f54b78;
      font-size: 24px;
      line-height: 30px;
      height: 30px;
      color: #fff;
      padding: 0 5px;
      display: inline-block;
      border-radius: 4px;
    }
  }
  &__detail {
    font-size: 24px;
    font-family: PingFangSC-Regular;
    color: #636363;
    line-height: 33px;
  }
  &__fnBar {
    padding: 10px 30px;
  }
  &__add {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 84px;
    background: rgba(255, 255, 255, 1);
    padding: constant(safe-area-inset-top) constant(safe-area-inset-right)
    constant(safe-area-inset-bottom) constant(safe-area-inset-left);
    padding: env(safe-area-inset-top) env(safe-area-inset-right)
    env(safe-area-inset-bottom) env(safe-area-inset-left);
    span {
      display: block;
      height: 84px;
      font-size: 34px;
      font-family: PingFangSC-Regular;
      color: rgba(237, 20, 91, 1);
      line-height: 84px;
      text-align: center;
    }
  }
}
.noData {
  padding: 270px 195px 0;
  img {
    width: 360px;
    height: 360px;
    margin-bottom: 12px;
  }
  p {
    height: 40px;
    font-size: 28px;
    font-weight: 400;
    color: #636363;
    line-height: 40px;
    margin-bottom: 38px;
    text-align: center;
  }
  .btn {
    width: 240px;
    height: 70px;
    font-size:28px;
    font-weight:400;
    color: #fff;
    background: #f54b78;
    border-radius:4px;
    margin: 0 auto;
    text-align: center;
    line-height: 70px;
  }
}
.fnBar {
  font-size: 28px;
  color: rgba(102, 102, 102, 1);
  line-height: 58px;
  &__left {
    height: 58px;
    img {
      width: 36px;
      height: 36px;
      margin: 11px 30px 11px 0;
    }
  }
  &__right {
    > div {
      display: inline-block;
      height: 58px;
      color: #636363;
      img {
        width: 58px;
      }
    }
    .edit {
      margin-right: 20px;
    }
  }
}
</style>

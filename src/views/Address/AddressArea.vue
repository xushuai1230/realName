
<template>
  <div class="ProvCityBoxWarp">
		<transition name="fade">
			<div class="ProvCityBoxBg" v-show="show" @click="submit(false)"></div>
		</transition>
		<transition name="van-slide-bottom">
			<div class="ProvCityBox" v-show="show">
				<div class="ProvCityHeader bb1">
          选择地区
          <div class="ProvCityHeaderConfirm" @touchstart.stop @click.stop="submit(false)">
            <img src="~@/assets/img/list_btn_delete_nol@3x.png" alt="">
          </div>
				</div>
				<div class="ProvCityContent" ref="provCityBox">
					<div class="ProvCityContentList">
            <div class="title bb1">
              <div class="seleted" :class="{'show': click===1 || provinceClick}">
                <p v-if="provinceClick" @click="click=1">
                  <span :class="{'red-bottom': click===1}">{{provinceClick}}</span>
                </p>
                <p v-else><span class="red-bottom">请选择</span></p>
              </div>
              <div class="seleted" :class="{'show': click===2 || cityClick}">
                <p v-if="cityClick" @click="click=2">
                  <span :class="{'red-bottom': click===2}">{{cityClick}}</span>
                </p>
                <p v-else><span class="red-bottom">请选择</span></p>
              </div>
              <div class="seleted" :class="{'show': click===3 || areaClick}">
                <p v-if="areaClick" @click="click=3">
                  <span :class="{'red-bottom': click===3}">{{areaClick}}</span>
                </p>
                <p v-else><span class="red-bottom">请选择</span></p>
              </div>
            </div>
            <ul>
              <li class="bb1" v-if="click===1" v-for="(item, index) in province.data" :key="index" :data-name="item.fullName" :data-id="item.code" @click="selectProvince(item.fullName, item.code, index)" :class="{'red': item.fullName === provinceClick}">{{item.fullName}}</li>
              <li class="bb1" v-if="click===2" v-for="(item, index) in city.data" :key="index" :data-name="item.fullName" :data-id="item.code" @click="selectCity(item.fullName, item.code, index)" :class="{'red': item.fullName === cityClick}">{{item.fullName}}</li>
              <li class="bb1" v-if="click===3" v-for="(item, index) in area.data" :key="index" :data-name="item.fullName" :data-id="item.code" @click="selectArea(item.fullName, item.code, index)" :class="{'red': item.fullName === areaClick}">{{item.fullName}}</li>
            </ul>
					</div>
        </div>
			</div>
		</transition>
	</div>
</template>

<script type="text/javascript">
export default {
  data: function () {
    return {
      provinceClick: '',
      cityClick: '',
      areaClick: '',
      click: 1,
      province: {
        data: null,
        code: null,
        index: 0
      },
      city: {
        data: null,
        code: null,
        index: 0
      },
      area: {
        data: null,
        code: null,
        index: 0
      },
      cityData: {},
      result: {
        'province': '',
        'city': '',
        'area': ''
      }
    }
  },
  mounted: function () {
    this.init()
  },
  methods: {
    async init () { // 请求省
      let provinceResult = await this.$api['address/getAddressArea']({
        code: 0
      })
      let provinceData = provinceResult.data
      provinceData = provinceData.slice(0, provinceData.length - 3)
      this.cityData = provinceData
      this.province.data = provinceData
    },
    submit (submit) { // 确定
      if (submit) {
        this.result = {
          'province': this.province.data[this.province.index],
          'city': this.city.data[this.city.index],
          'area': this.area.data[this.area.index]
        }
      } else {
        this.result = {
          'province': '',
          'city': '',
          'area': ''
        }
      }
      this.$emit('select-submit', this.result)
    },
    async selectProvince (name, code, i) { // 请求市
      this.provinceClick = name
      this.cityClick = ''
      this.areaClick = ''
      this.province.index = i
      this.province.code = code
      this.click = 2
      let cityData
      if (this.cityData[i].data) {
        // 当前市数据已存在
        cityData = this.cityData[i].data
      } else {
        let cityResult = await this.$api['address/getAddressArea']({
          code: code
        })
        cityData = cityResult.data
        this.cityData[i].data = cityData
      }
      this.city.data = cityData
    },
    async selectCity (name, code, i) { // 请求区
      this.cityClick = name
      this.areaClick = ''
      this.city.index = i
      this.city.code = code
      this.click = 3
      let areaData
      if (this.cityData[this.province.index].data[i].data) {
        areaData = this.cityData[this.province.index].data[i].data
      } else {
        let areaResult = await this.$api['address/getAddressArea']({
          code: code
        })
        areaData = areaResult.data
        this.cityData[this.province.index].data[i].data = areaData
      }
      this.area.data = areaData
    },
    selectArea (name, code, i) {
      this.areaClick = name
      this.area.index = i
      this.submit(true)
    }
  },
  props: {
    'show': Boolean,
    'title': {
      type: String,
      default: '请选择'
    },
    'confirm': {
      type: String,
      default: '确定'
    },
    'cancel': {
      type: String,
      default: '取消'
    }
  }
}
</script>

<style lang="scss" scoped>
.ProvCityBoxBg {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(51, 36, 36, 0.5);
  z-index: 200;
}

.scale-1px{
  position: relative;
  border:none;
}
.scale-1px:after{
  content: '';
  position: absolute;
  bottom: 0;
  background: #000;
  width: 100%;
  height: 1px;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}

.ProvCityBox {
  position: fixed;
  z-index: 300;
  background: #fff;
  bottom: 0;
  left: 0;
  right: 0;
}

.red-bottom {
  color: #E31436;
  border-bottom: 5px solid #E31436;
  display: inline-block;
  height: 65px;
  box-sizing: border-box;
}

.red {
  color: #E31436;
}

.ProvCityHeader {
  background-color: #fff;
  color: #333;
  font-weight: 500;
  height: 98px;
  line-height: 98px;
  overflow: hidden;
  text-align: center;
  font-size: 32px !important;
  position: relative;
}

.ProvCityHeaderCancle {
  float: left;
  padding: 0 40px;
  color: #1aad19;
  font-size: 32px !important;
}

.ProvCityHeaderConfirm {
  width: 44px;
  height: 44px;
  position: absolute;
  top: 27px;
  right: 30px;
}

.ProvCityContent {
  width: 100%;
  margin: 0 auto;
  background: #fff;
  overflow: hidden;
  height: 480px;
}

.ProvCityContentList {
  float: left;
  width: 100%;
  height: 100%;
  font-size: 28px;
  overflow: hidden;
  padding: 0 30px;
  box-sizing: border-box;
  text-align: left;
  .seleted {
    display: inline-block;
    opacity: 0;
    text-align: left;
    width: 33%;
    text-align: center;
  }
  .show {
    opacity: 1;
  }
  p {
    line-height: 70px;
    height: 70px;
    span {
      text-indent: 0;
    }
  }
  ul {
    // -webkit-transition: all 0.3s ease;
    // transition: all 0.3s ease;
    height: 400px;
    overflow-y: scroll;
    overflow-x: hidden;
    li {
      text-align: left;
      border-color: #e6e6e6;
    }
  }
  .province_dragging,
  .city_dragging,
  .area_dragging {
    -webkit-transition: none;
    transition: none;
  }
}

.ProvCityContentList li {
  line-height: 80px;
  height: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 28px !important;
  font-family: PingFangSC-Regular;
  border-color: #e6e6e6;
  &.current {
    font-size: 32px !important;
    font-weight: bold;
    font-family: PingFangSC-Semibold;
  }
  &.node1 {
    font-size: 30px !important;
    opacity: 0.7;
  }
  &.node2 {
    font-size: 28px !important;
    opacity: 0.5;
  }
  &.node3 {
    font-size: 24px !important;
    opacity: 0.3;
  }
}

.ProvCitySelected {
  width: 100%;
  border: none;
  position: absolute;
  bottom: 200px;
  margin: 0;
  height: 70px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.expand-select-enter-active,
.expand-select-leave-active {
  transition: all 0.4s ease;
  bottom: 0px;
}

.expand-select-enter,
.expand-select-leave-active {
  transform: translate(0, 480px);
}

.bb1 {
  font-size: 28px;
  color: #333333;
}

.ProvCityHeader {
  .bb1 {
    font-size: 32px;
    color: #333333;
  }
}
</style>

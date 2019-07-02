
<template>
	<div class="ProvCityBoxWarp">
		<transition name="fade">
			<div class="ProvCityBoxBg" v-show="show" @click="submit(false)" @touchmove="_stopDef" @mousewheel="_stopDef"></div>
		</transition>
		<transition name="van-slide-bottom">
			<div class="ProvCityBox" v-show="show" @mousewheel="_stopDef">
				<div class="ProvCityHeader">
					<div class="ProvCityHeaderCancle" @touchstart.stop @click.stop="submit(false)">{{cancel}}</div>
					{{title}}
					<div class="ProvCityHeaderConfirm" @touchstart.stop @click.stop="submit(true)">{{confirm}}</div>
				</div>
				<div class="ProvCityContent" ref="provCityBox">
					<div class="ProvCityContentList">
						<ul :class="{'province_dragging': province.dragging}" @touchstart="_onTouchStart('province', $event)" @mousedown="_onTouchStart('province', $event)" :style="{'transform' : 'translate3d(0,' + province.translateY + 'px, 0)'}">
							<li></li>
							<li></li>
							<li></li>
							<li v-for="(item, index) in province.data" :key="index" :data-name="item.fullName" :data-id="item.code" :class="{
                                    'current': item.code === province.code,
                                    'node1':  Math.abs(index - province.index) == 1,
                                    'node2':  Math.abs(index - province.index) == 2,
                                    'node3':  Math.abs(index - province.index) >= 3
                                }">{{item.fullName}}
							</li>
							<li></li>
							<li></li>
							<li></li>
						</ul>
					</div>
					<div class="ProvCityContentList">
						<ul :class="{'city_dragging': city.dragging}" @touchstart="_onTouchStart('city', $event)" @mousedown="_onTouchStart('city', $event)" :style="{'transform' : 'translate3d(0,' + city.translateY + 'px, 0)'}">
							<li></li>
							<li></li>
							<li></li>
							<li v-for="(item, index) in city.data" :key="index" :data-name="item.fullName" :data-id="item.code" :data-parentid="item.parentid" :class="{
                                    'current': item.code === city.code,
                                    'node1':  Math.abs(index - city.index) == 1,
                                    'node2':  Math.abs(index - city.index) == 2,
                                    'node3':  Math.abs(index - city.index) >= 3
                            }">{{item.fullName}}
							</li>
							<li></li>
							<li></li>
							<li></li>
						</ul>
					</div>
					<div class="ProvCityContentList">
						<ul :class="{'area_dragging': area.dragging}" @touchstart="_onTouchStart('area', $event)" @mousedown="_onTouchStart('area', $event)" :style="{'transform' : 'translate3d(0,' + area.translateY + 'px, 0)'}">
							<li></li>
							<li></li>
							<li></li>
							<li v-for="(item, index) in area.data" :key="index" :data-name="item.fullName" :data-id="item.code" :data-parentid="item.parentid" :class="{
                            'current': item.code === area.code,
                            'node1':  Math.abs(index - area.index) == 1,
                            'node2':  Math.abs(index - area.index) == 2,
                            'node3':  Math.abs(index - area.index) >= 3
                        }">{{item.fullName}}
							</li>
							<li></li>
							<li></li>
							<li></li>
						</ul>
					</div>
				</div>
				<div class="ProvCitySelected border border-bottom ">

				</div>
			</div>
		</transition>
	</div>
</template>

<script type="text/javascript">
export default {
  data: function () {
    return {
      target: '',
      province: {
        data: null,
        code: null,
        index: 0,
        startPos: null,
        translateY: 0,
        startTranslateY: 0,
        dragging: false
      },
      city: {
        data: null,
        code: null,
        index: 0,
        startPos: null,
        translateY: 0,
        startTranslateY: 0,
        dragging: false
      },
      area: {
        data: null,
        code: null,
        index: 0,
        startPos: null,
        translateY: 0,
        startTranslateY: 0,
        dragging: false
      },
      delta: 0,
      cityData: {},
      slideEls: null,
      result: {
        'province': '',
        'city': '',
        'area': ''
      }
    }
  },
  mounted: function () {
    this.init()
    this._onTouchMove = this._onTouchMove.bind(this)
    this._onTouchEnd = this._onTouchEnd.bind(this)
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
      this.province.code = provinceData[0].code
      await this.filterCity()
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
    async filterCity () { // 请求市
      let provinceIndex = this.province.index // 市index
      let provinceCode = this.province.code // 市code
      let cityData, cityCode
      if (this.cityData[provinceIndex].data) {
        // 当前市数据已存在
        cityCode = this.cityData[provinceIndex].code
        cityData = this.cityData[provinceIndex].data
      } else {
        let cityResult = await this.$api['address/getAddressArea']({
          code: provinceCode
        })
        cityData = cityResult.data
        cityCode = cityData[0].code // 当前区code
        this.cityData[provinceIndex].data = cityData
      }
      this.city.code = cityCode
      this.city.data = cityData
      await this.filterArea()
    },
    async filterArea () { // 请求区
      let provinceIndex = this.province.index
      let cityIndex = this.city.index
      let areaData
      if (this.cityData[provinceIndex].data[cityIndex].data) {
        areaData = this.cityData[provinceIndex].data[cityIndex].data
      } else {
        let cityCode = this.city.code
        let areaResult = await this.$api['address/getAddressArea']({
          code: cityCode
        })
        areaData = areaResult.data
        this.cityData[provinceIndex].data[cityIndex].data = areaData
      }
      this.area.data = areaData
    },
    getSelectedData (index) { // 滑动选择
      // 滑动省时
      let target = this.target
      let thisData = this[target]
      if (target === 'province') {
        this.city.data = []
        this.area.data = []
        this.province.code = thisData.data[index].code
        console.log('this.province.code', this.province.code)
        this.city.translateY = 0
        this.area.translateY = 0
        this.filterCity()
      }
      if (target === 'city') {
        this.area.data = []
        this.city.code = thisData.data[index].code
        this.area.translateY = 0
        this.filterArea()
      }
    },
    setPage () {
      console.log('setPage')
      let target = this.target
      let thisData = this[target]
      let clientHeight = this.slideEls[0]['clientHeight']
      let total = thisData.data.length
      let goPage = Math.round((thisData.translateY / clientHeight).toFixed(1))
      if (goPage > 0) {
        goPage = 0
      }
      goPage = total - 1 >= Math.abs(goPage) ? goPage : -(total - 1)
      let index = Math.abs(goPage)
      thisData.index = index
      this.getSelectedData(index)
      thisData.translateY = goPage * clientHeight
    },
    _getTouchPos (e) {
      return e.changedTouches ? e.changedTouches[0]['pageY'] : e['pageY']
    },
    _getElem (e) {
      return Array.from(e.currentTarget.children).slice(3, -3)
    },
    _onTouchStart (target, e) {
      console.log('target', 'touch')
      console.log(target)
      // 调整省区时,清空市与区的列表数据
      // 调整市区时清空区的列表数据
      if (target === 'province') {
        this.city = {
          data: null,
          code: null,
          index: 0,
          startPos: null,
          translateY: 0,
          startTranslateY: 0,
          dragging: false
        }
        this.area = {
          data: null,
          code: null,
          index: 0,
          startPos: null,
          translateY: 0,
          startTranslateY: 0,
          dragging: false
        }
      }
      if (target === 'city') {
        this.area = {
          data: null,
          code: null,
          index: 0,
          startPos: null,
          translateY: 0,
          startTranslateY: 0,
          dragging: false
        }
      }
      e.stopPropagation()
      let thisData = this[target]
      this.target = target
      this.slideEls = this._getElem(e)
      this.delta = 0
      thisData.startPos = this._getTouchPos(e)
      thisData.startTranslateY = thisData.translateY
      thisData.dragging = true
      this.$refs['provCityBox'].addEventListener('touchmove', this._onTouchMove, false)
      this.$refs['provCityBox'].addEventListener('touchend', this._onTouchEnd, false)
      this.$refs['provCityBox'].addEventListener('mousemove', this._onTouchMove, false)
      this.$refs['provCityBox'].addEventListener('mouseup', this._onTouchEnd, false)
    },
    _onTouchMove (e) {
      console.log('target', 'touchmove')
      e.stopPropagation()
      let target = this.target
      let thisData = this[target]
      this.delta = this._getTouchPos(e) - thisData.startPos
      thisData.translateY = thisData.startTranslateY + this.delta
      if (Math.abs(this.delta) > 0) {
        e.preventDefault()
      }
    },
    _onTouchEnd (e) {
      e.stopPropagation()
      let target = this.target
      let thisData = this[target]
      thisData.dragging = false
      this.setPage()
      document.removeEventListener('touchmove', this._onTouchMove)
      document.removeEventListener('touchend', this._onTouchEnd)
      document.removeEventListener('mousemove', this._onTouchMove)
      document.removeEventListener('mouseup', this._onTouchEnd)
    },
    _stopDef (e) {
      e.preventDefault()
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

.ProvCityBox {
  position: fixed;
  z-index: 300;
  background: #fff;
  bottom: 0;
  left: 0;
  right: 0;
}

.ProvCityHeader {
  background-color: #eee;
  height: 88px;
  line-height: 88px;
  overflow: hidden;
  text-align: center;
  font-size: 32px !important;
}

.ProvCityHeaderCancle {
  float: left;
  padding: 0 40px;
  color: #636363;
  font-size: 32px !important;
}

.ProvCityHeaderConfirm {
  float: right;
  padding: 0 40px;
  color: #507daf;
  font-size: 32px !important;
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
  width: 33.333333%;
  text-align: center;
  overflow: hidden;
  ul {
    -webkit-transition: all 0.3s ease;
    transition: all 0.3s ease;
  }
  .province_dragging,
  .city_dragging,
  .area_dragging {
    -webkit-transition: none;
    transition: none;
  }
}

.ProvCityContentList li {
  line-height: 70px;
  height: 70px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 28px !important;
  font-family: PingFangSC-Regular;
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
</style>

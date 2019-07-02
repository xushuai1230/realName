<template>
	<div id="sku-sel-root" @click.stop @touchstart.stop @touchmove.stop @touchend.stop @touchcanel.stop>
		<div class="sku-bg" v-show="isShow" :class="skubgShow" @click="closeSku"></div>
		<div class="sku-area"  v-show="isShow" :class="skuPlaneShow">
			<div class="sku-inner-area">
				<div class="select-good-area van-hairline--bottom">
					<div class="sku-good-pic">
						<img class="" :src="curSkuImg || goodsImg">
					</div>
					<p class="sku-good-tar">
						<!-- {{(skuFinalPrice || skuPrice) | toPrice2}} -->
						<span v-if="!orderSku" class="sku-good-price"><span :style="{color: '#333'}">月供: </span>&yen;
							<i>{{skuPeroidInstalmentAmount*buyGoodsNum | priceFilter}}</i> <span :style="{color: '#333'}"> 起</span>
						</span>
            <span v-else class="sku-good-price"><span :style="{color: '#333'}">月供: </span>&yen;
							<i>{{skuFinalPrice*buyGoodsNum | priceFilter}}</i> <span :style="{color: '#333'}"> 起</span>
						</span>
            <br>
						<span class="sku-already-property">
							{{skuGoodsputPreOrder}}
						</span>
					</p>
				</div>
				<div class="sku-property-wrap">
					<div v-for="(type,index) in skuProp" class="sku-property van-hairline--bottom" :key="index">
						<h1 :pid="type.pid" class="sku-property-title">{{type.pname}}</h1>
						<div class="sku-box-area clearfix">
							<div v-for="(prop, index2) in type.values" :key="index2" :vid="prop.vid" @click="selectProp(type,prop,index)" :class="{selbox:prop.match,noselect: prop.nouse || prop.nopitch}" class="sku-box">{{prop.vname}}</div>
						</div>
					</div>
				</div>
				<div class="sku-buynum-area">
          <h1 class="sku-buynum-title">购买数量</h1>
          <div class="sku-select-fun">
            <div @click="changeBuyNum('reduce')" class="sku-reduce van-hairline--right">-</div>
            <div class="sku-buynum">{{buyGoodsNum}}</div>
            <div @click="changeBuyNum('add')"  class="sku-add van-hairline--left">+</div>
          </div>
        </div>
			</div>
			<div @click.prevent="closeSku" class="sku-close"></div>
			<div @click="buyThisSkuGoods" class="sku-true" :class="{canbuy: canBuy}">确定</div>
		</div>
	</div>
</template>
<script>

export default {
  data () {
    return {
      open: false,
      pitchProp: [], // 存储选中的属性
      currProp: {}, // 现在/或者以前存储带有imgUrl属性的sku属性。,
      buyGoodsNum: 1, // 预想购买数量
      canBuy: false,
      orderSku: null // 最终选择的sku属性对象
    }
  },
  props: ['sku', 'startSku', 'skuPrice', 'goodsImg', 'joinCar', 'categoryTowCode'],
  computed: {
    isShow () {
      return this.startSku
    },
    skuPeroidInstalmentAmount () {
      return this.sku && this.sku.peroidInstalmentAmount
    },
    tax () {
      return this.sku && this.sku.tax
    },
    goodsCode () {
      return this.sku && this.sku.goodsCode
    },
    goodSource () {
      return this.sku && this.sku.goodSource
    },
    goodsName () {
      return this.sku && this.sku.goodsName
    },
    skuList () {
      return this.sku && this.sku.skuList
    },
    goodSourceName () {
      return this.sku && this.sku.goodSourceName
    },
    haitaoFlag () {
      return this.sku && this.sku.haitaoFlag
    },
    skuProp () {
      // 添加一个属性
      if (this.sku && this.sku.skuProps) {
        this.sku.skuProps.forEach(type => {
          type.values.forEach(item => {
            this.$set(item, 'nopitch', false) // 标记这个属性是否可以选择 true 不可
            this.$set(item, 'match', false) // 标记这个属性是否已经被选中 false 未选中
            this.$set(item, 'cancom', true) // 这种属性是可以组合的
          })
        })
        return this.sku.skuProps
      } else {
        return []
      }
    },
    skubgShow () {
      let _this = this
      for (let prop of _this.pitchProp) {
        if (!prop.pid) {
          _this.orderSku = null
          return _this.startSku ? '' : 'sku-bg-close'
        }
      }
      return this.startSku ? '' : 'sku-bg-close'
    },
    skuPlaneShow () {
      return this.startSku ? 'sku-open-state' : 'sku-close-state'
    },
    curSkuImg () {
      return (this.currProp && this.currProp.imgUrl) ? this.currProp.imgUrl : ''
    },
    hasSkuImg () {
      if (this.currProp && this.currProp.imgUrl) {
        return true
      } else {
        return false
      }
    },
    skuFinalPrice () {
      return this.orderSku && this.orderSku.peroidInstalmentAmount
    },
    // sku商品 描述
    skuGoodsputPreOrder () {
      var str = ''
      let tempArr = []
      let flag = false
      // 用户未选择的时候
      if (this.pitchProp.length === 0) {
        let pidNames = this.skuProp.map(item => item.pname).join(' ')
        this.$emit('selectTxt', '请选择: ' + pidNames, null, flag)
        return '请选择: ' + pidNames
      }
      this.pitchProp.forEach((item, index) => {
        if (!item.pid) {
          if (!str) str = '请选择: '
          str += this.skuProp[index].pname + ' '
        } else {
          tempArr.push(`“${item.vid.vname}”`)
        }
      })
      if (!str) {
        str = '已选: ' + tempArr.map(item => item).join('')
        flag = true
      }
      this.$emit('selectTxt', str, this.orderSku, flag)
      return str
    },
    // sku商品 描述
    skuFillStr () {
      let str = ''
      for (let prop of this.pitchProp) {
        if (!prop.pid) {
          continue
        }
        str += `${prop.pid.pname}: ${prop.vid.vname}; `
      }
      return str
    },
    // 生成已拿到属性的正则表达式
    propReg () {
      var regStr = ''
      this.pitchProp.forEach(item => {
        if (typeof item.pid !== 'object') {
          regStr += ';?(\\d+):(\\d+)'
        } else {
          regStr += ';?' + item.pid.pid + ':' + item.vid.vid
        }
      })
      return regStr
    }
  },
  methods: {
    // 将不可能出现的sku属性清除
    cleanNoUseProp () {
      const skuProps = this.sku && this.sku.skuProps
      const skuList = this.sku && this.sku.skuList
      let pvStr = ''
      let hasPv = false // 是否可以找到此种匹配
      for (let pid of skuProps) {
        for (let vid of pid.values) {
          pvStr = pid.pid + ':' + vid.vid
          hasPv = false
          for (let com of skuList) {
            if (com.skuPvStrs.indexOf(pvStr) !== -1) {
              hasPv = true
              break
            }
          }
          vid.nouse = !hasPv
        }
      }
    },
    // 用户选择某个sku属性
    selectProp (type, prop, index) {
      if (prop.nopitch || prop.nouse) {
        return
      }
      if (prop.match) {
        prop.match = false
        this.removeFetchProp(index)
        this.checkCanBuy()
        for (let pidProp of this.skuProp) {
          if (pidProp.pid === type.pid) {
            continue
          }
          for (let vidProp of pidProp.values) {
            vidProp.nopitch = false
          }
        }
        return
      }
      let arr = type.values
      for (let i = 0, len = arr.length; i < len; i++) {
        arr[i].match = false
      }
      this.addFetchProp(type, prop, index)
    },
    joinCart () {
      return this.$api['shopcar/joinCart']({
        'goodsSource': this.goodSource,
        'goodsCode': this.goodsCode,
        'skuCode': this.orderSku.skuCode,
        'goodsCount': this.buyGoodsNum
      }, {
        noStringify: true,
        headers: {
          token: this.userToken
        }
      }).then(res => {
        console.log(res)
      })
    },
    // 购买此商品
    async buyThisSkuGoods () {
      if (!this.userToken) {
        this.handlerLogin()
        return false
      }
      if (this.canBuy) {
        if (this.joinCar) {
          console.log('请求joinCart')
          await this.joinCart()
          this.$router.push({
            name: 'shopCar'
          })
          return false
        }
        // 将购买数据存储在sessionstorage中
        let currentBuyData = {
          code: this.goodsCode,
          skuCode: this.orderSku.skuCode,
          goodsNum: this.buyGoodsNum,
          goodSource: this.goodSource,
          skuFillStr: this.skuFillStr,
          promotionPrice: this.orderSku.skuPrice,
          instalmentAmount: this.orderSku.peroidInstalmentAmount,
          goodsImageUrl: this.goodsImg,
          curSkuImg: this.curSkuImg,
          goodsName: this.goodsName,
          tax: this.tax,
          goodSourceName: this.goodSourceName,
          haitaoFlag: this.haitaoFlag,
          productCategoryId: this.categoryTowCode
        }
        window.sessionStorage.setItem('currentBuyData', JSON.stringify(currentBuyData))
        this.$router.push({
          path: '/orderfill'
        })
      }
    },
    // 关闭sku窗口
    closeSku (evt) {
      for (let prop of this.pitchProp) {
        if (!prop.pid) {
          let tempOrderSku = null
          this.$emit('openSku', false, tempOrderSku, this.buyGoodsNum)
          return
        }
      }
      console.log(this.orderSku, 'orderSku close')
      this.$emit('openSku', false, this.orderSku, this.buyGoodsNum)
    },
    // 购买数量加减
    changeBuyNum (type) {
      if (type === 'reduce') {
        this.buyGoodsNum > 0 && this.buyGoodsNum--
      } else if (type === 'add') {
        this.buyGoodsNum++
      }
    },
    // 帮助用户预选择
    preSelctProp () {
      if (this.pitchProp.length > 0) return
      let type = this.skuProp[0]
      let prop = this.skuProp[0].values[0]
      this.selectProp(type, prop, 0)
    },
    // 根据 pid，vid，返回pid/vid对象，
    findPvProp (pid, vid) {
      var retPidProp
      var retVidProp
      var index
      for (let pidProp of this.skuProp) {
        if (pidProp.pid === pid) {
          retPidProp = pidProp
          index = this.skuProp.indexOf(retPidProp)
          break
        }
      }
      for (let vidProp of retPidProp.values) {
        if (vidProp.vid === vid) {
          retVidProp = vidProp
          break
        }
      }
      return {
        retPidProp,
        retVidProp,
        index
      }
    },
    // 添加属性到选择器中
    // type 列表属性， prop 商品某类别下具体属性，index 类别所在商品属性数组中的位置。
    addFetchProp (type, prop, index) {
      // 如果数据为空的时候，
      if (this.pitchProp.length === 0) {
        this.pitchProp = []
        this.skuProp.forEach((item, inx) => {
          // this.pitchProp[inx] = item
          this.$set(this.pitchProp, inx, {})
        })
      }
      // 同类别属性被选择 只能是单选
      prop.match = true
      if (prop.imgUrl && prop.imgUrl.length > 0) {
        this.currProp = prop
      }
      this.pitchProp.splice(index, 1, { pid: type, vid: prop })
      this.matchRepertory(type.pid)// 开始测试
      this.checkCanBuy()
    },
    // 确定是否可以购买
    checkCanBuy () {
      for (let pidProp of this.pitchProp) {
        if (!pidProp.pid) {
          this.canBuy = false
          return
        }
      }
      this.canBuy = true
      this.mapSkuOrder()
    },
    // 选择完成后，在skuList列表中拿出来
    mapSkuOrder () {
      let regs = []
      this.pitchProp.forEach((item, inx) => {
        regs.push(item.pid.pid + ':' + item.vid.vid)
      })
      let skuStr = ''
      for (let skuObj of this.skuList) {
        skuStr = skuObj.skuPvStrs
        let nomatch = false
        for (let regstr of regs) {
          if (!(new RegExp(regstr)).test(skuStr)) {
            nomatch = true
          }
        }
        if (!nomatch) {
          this.orderSku = skuObj
          return true
        }
      }
    },
    // 从属性选择器中移除属性
    removeFetchProp (index) {
      this.pitchProp.splice(index, 1, {})
    },
    // 判断这种组合是否可以通过测试,不通过的话设为不允许选择的状态。
    // ownPid 用户 点击属性所在类别的pid，此pid下的属性不用遍历
    matchRepertory (ownPid) {
      for (let pidProp of this.skuProp) {
        let inx = this.skuProp.indexOf(pidProp)
        if (pidProp.pid === ownPid) {
          continue
        }
        for (let vidProp of pidProp.values) {
          let unitRegs = this.createUnitReg(inx, pidProp.pid, vidProp.vid)
          if (this.unitAvailable(unitRegs)) {
            vidProp.nopitch = false
          } else {
            vidProp.nopitch = true
            // console.log('发现无法匹配项： ', inx, pidProp.pid, vidProp.vid)
          }
        }
      }
    },
    // 根据正则遍历商品属性组合列表，查看可能性
    unitAvailable (regs) {
      let skuStr = ''
      for (let skuObj of this.skuList) {
        skuStr = skuObj.skuPvStrs
        let nomatch = false
        // console.log('match: ', skuStr)
        for (let regstr of regs) {
          // console.log('str', regstr, skuStr)
          if (!(new RegExp(regstr)).test(skuStr)) {
            // console.log('不配')
            nomatch = true
          }
        }
        // console.log('nomatch ', nomatch)
        if (!nomatch) {
          return true
        }
      }
      return false
    },
    // 根据index 替换掉pitchProp数组相等的某个属性的pid，vid，就得到测试用的正则
    // 可以验证这index的属性是否通过有货验证。
    createUnitReg (unitIndex, pid, vid) {
      var regs = []
      this.pitchProp.forEach((item, inx) => {
        // pid 为空，说明pitchProp这个位置为空，inx === unitIndex 的时候，就是用户当前点击的SKU属性。当然不能为 (\\d+):(\\d+)
        if (typeof item.pid !== 'object' && (inx !== unitIndex)) {
          regs.push('(\\d+):(\\d+)')
        } else {
          // console.log(inx, unitIndex)
          if (inx === unitIndex) {
            regs.push(pid + ':' + vid)
          } else {
            regs.push(item.pid.pid + ':' + item.vid.vid)
          }
        }
      })
      // console.log('生成的测试正则：', regs)
      return regs
    }
  },
  watch: {
    skuProps (val) {
      if (this.val) {
        this.sku.skuProps.forEach(type => {
          type.values.forEach(item => {
            this.$set(item, 'nopitch', false) // 标记这个属性是否可以选择 true 不可
            this.$set(item, 'match', false) // 标记这个属性是否已经被选中 false 未选中
            this.$set(item, 'cancom', true) // 这种属性是可以组合的
          })
        })
      }
    },
    sku: function () {
      if (this.sku.skuFlag) {
        this.cleanNoUseProp()
      }
    },
    orderSku (val) {
      if (!val) {
        console.log(1)
      }
    },
    buyGoodsNum (val) {
      if (val < 1) {
        this.buyGoodsNum = 1
      }
    },
    '$route' (to, from) { // 监听路由是否变化
      if (this.$route.params.id) {
        this.pitchProp = []
        this.currProp = {}
        this.buyGoodsNum = 1
        this.canBuy = false
        this.orderSku = null
      }
    }
  }
}
</script>
<style scoped>
.sku-bg {
  position: fixed;
  z-index: 888;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
}

.sku-bg.sku-bg-close {
  display: none;
}

.sku-area {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 888;
  background-color: #fff;
  font-size: 0.34666rem;
  transition: transform 0.3s;
  text-align: left;
  color: #333;
  padding: constant(safe-area-inset-top) constant(safe-area-inset-right)
  constant(safe-area-inset-bottom) constant(safe-area-inset-left);
  padding: env(safe-area-inset-top) env(safe-area-inset-right)
  env(safe-area-inset-bottom) env(safe-area-inset-left);
}

.sku-close-state {
  transform: translatey(6rem);
  opacity: 0;
  z-index: 0;
}

.sku-open-state {
  transform: translatey(0);
  opacity: 1;
  z-index: 888;
}

.sku-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 64px;
  height: 64px;
  background: url('~@/assets/img/detail_list_btn_delete@3x.png') no-repeat;
  background-size: contain;
  font-size: 0.57rem;
  background-color: #fff;
}

.sku-inner-area {
  padding: 0 30px;
}

.select-good-area {
  position: relative;
  padding: 0.426666rem 0 0.57333rem 0;
}

.sku-good-pic {
  position: relative;
  float: left;
  width: 2.56rem;
  height: 2.56rem;
  overflow: hidden;
  display: inline-block;
  margin-top: -1rem;
  margin-right: 0.4rem;
  border: 2px solid rgba(147,147,147, .6);
  box-sizing: border-box;
  border-radius: 4px;
  background-color: #fff;
}
.sku-good-pic > img {
  display: block;
}
.sku-good-price {
  font-size: inherit;
  color: #ed145b;
  line-height: 2.5em;
}
.sku-good-price i {
  font-style: normal;
  font-size: 0.48rem;
}
.sku-already-property {
  display: inline-block;
  font-size: inherit;
  width: 426px;
  height: 30px;
  line-height: 30px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.select-good-area:after {
  content: '';
  display: block;
  clear: both;
}

.sku-property-title {
  font-size: inherit;
  color: #939393;
  line-height: 3.2em;
  font-weight: normal;
}

.sku-box {
  float: left;
  min-height: 54px;
  line-height: 54px;
  padding: 0 24px;
  border-radius: 4px;
  margin: 0 24px 24px 0;
  background-color: #fff;
  border: 2px solid rgba(147,147,147, .6);
  color: #636363;
  box-sizing: border-box;
}

.sku-box.noselect {
  color: #939393;
  border-color: #c4c4c4;
  background-color: #fff;
}

.sku-box.selbox {
  color: #fff;
  border-color: #F54B78;
  background-color: #F54B78;
}

.sku-property {
  /* border-bottom: 1px solid #e5e5e5; */
}

.sku-buynum-area {
  margin-top: 0.4rem;
  height: 50px;
}

.sku-buynum-title {
  display: inline-block;
  color: #939393;
  margin: 0;
  font-size: 0.373333rem;
  line-height: 0.64rem;
  font-weight: normal;
}

.sku-property-wrap {
  max-height: 8rem;
  overflow-y: scroll;
}

.sku-select-fun {
  float: right;
}

.sku-select-fun {
  border-radius: 3px;
  vertical-align: top;
  font-size: 0;
  box-sizing: border-box;
  border: 2px solid rgba(147,147,147, .6);
}

.sku-select-fun div {
  display: inline-block;
  width: 0.9rem;
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-size: 24px;
}

.sku-buynum {
  width: 4em !important;
  border-left: 2px solid rgba(147,147,147, .6);
  border-right: 2px solid rgba(147,147,147, .6);
}

.sku-reduce {
  /* background: url("../../assets/img/jianfuhao.png") no-repeat center; */
  background-size: 0.5rem;
}

.sku-add {
  /* background: url("../../assets/img/addfuhao.png") no-repeat center; */
  background-size: 0.5rem;
}

.sku-true {
  clear: both;
  margin-top: 0.4rem;
  width: 100%;
  background-color: #ffabc1;
  line-height: 84px;
  color: #fff;
  font-size: 0.48rem;
  text-align: center;
  height: 84px;
  font-size: 34px;
}

.sku-true.canbuy {
  background-color: #F54B78;
}
</style>

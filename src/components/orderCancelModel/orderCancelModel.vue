<template>
  <!-- 弹窗样式修改,增加弹窗原因 -->
  <div class="cancelModel" @click.self="$emit('toggleCancelModelShow', false)" @touchmove.prevent>
    <div class="cancelModel__container" v-if="reqReady">
      <div class='cancelModel__content'>
        <div class="cancelModel__title">亲,为什么要取消呢?</div>
        <div class="cancelModel__desc" v-for="(item,index) in reasArr"  @click="changeReason(index)" :key="index">
            <img src="~@/assets/img/order/list_rd_select_nol@3x.png" v-if="item.isShow">
            <img src="~@/assets/img/order/list_rd_select_sel@3x.png" v-else>
            <span>{{item.content}}</span>
        </div>
        <div class="cancelModel__otherDesc">
          <input type="text"
                  placeholder="请输入取消原因"
                  @change="changeReason(66)"
                  @keydown="changeReason(66)"
                  @keyup="changeReason(66)"
                  ref="otherdesc"
                  maxlength="100"
                  :class="[otherVal===''?'':'c9']">
        </div>
      </div>
      <div class="cancelModel__footer van-hairline--top">
        <div class="btn van-hairline--right" @click="$emit('toggleCancelModelShow', false)">我再想想</div>
        <div class="btn" :class="{gray: btnFlag}" @click.stop="cancelOrder(orderCode)">狠心取消</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: '',
  props: ['orderCode'],
  data () {
    return {
      btnFlag: true, // 是否允许取消
      othFlag: true, // 其他原因是否为空
      reason: '', // 取消原因描述
      reqReady: false,
      otherVal: '', // 其他原因
      reasArr: []
    }
  },
  created () {
    this.reqReasonArr()
  },
  methods: {
    changeReason (type) {
      if (type === 66) {
        if (this.$refs.otherdesc.value === '') {
          this.othFlag = true
          this.otherVal = this.$refs.otherdesc.value
        } else {
          this.othFlag = false
          if (this.$refs.otherdesc.value.length === 100) {
            this.$toast('最多只能输入100字哦')
          }
        }
        this.otherVal = this.$refs.otherdesc.value
      } else {
        this.reasArr[type].isShow = !this.reasArr[type].isShow
      }
      for (let i = 0; i < this.reasArr.length; i++) {
        if (this.reasArr[i].isShow === false || this.othFlag === false) {
          this.btnFlag = false
          break
        } else {
          this.btnFlag = true
        }
      }
    },
    getReason () {
      this.reason = ''
      for (let i = 0; i < this.reasArr.length; i++) {
        if (this.reasArr[i].isShow === false) {
          this.reason += this.reasArr[i].content + ';'
        }
      }
      if (this.$refs.otherdesc.value !== '') {
        this.reason += this.$refs.otherdesc.value + ';'
      }
    },
    cancelOrder () {
      if (this.btnFlag) return false
      this.getReason()
      this.$api['order/cancel']({
        code: this.orderCode,
        token: this.userToken,
        reason: this.reason
      }).then(res => {
        this.$router.push({
          name: 'OrderList',
          params: {
            type: 1
          },
          query: {
            noCache: Date.now()
          }
        })
        global.vbus.$emit('setChangOrderCode', this.orderCode)
        // global.vbus.$emit('initList')
      })
    },
    reqReasonArr () {
      this.$api['order/getReas']()
        .then(res => {
          var arr = res.paramValue.split(';')
          for (let i = 0; i < arr.length; i++) {
            this.reasArr.push({ content: arr[i], isShow: true })
          }
          this.reqReady = true
        })
    }
  }
}
</script>
<style lang="scss">
.cancelModel {
  &__footer {
    [class*="van-hairline"]::after {
      border-color: #d0d0d0;
    }
  }
}
</style>

<style scoped lang="scss">
.cancelModel {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9;
  &__container {
    position: absolute;
    top: 2.56rem;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 7.2rem;
    background-color: #fff;
    border-radius: 24px;
  }
  &__content {
    padding: 0.586667rem 0.533333rem 0.533333rem;
  }
  &__title {
    height: 0.6rem;
    margin-bottom: 0.546667rem;
    font-size: 0.426667rem;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    line-height: 0.6rem;
    text-align: center;
  }
  &__desc {
    height: 0.533333rem;
    line-height: 0.533333rem;
    text-align: left;
    margin-bottom: 0.4rem;
    img {
      width: 0.346667rem;
      height: 0.346667rem;
      // margin:.106667rem 0.4rem 0 0;
      margin: .053333rem .4rem 0 0;
    }
    span {
      font-size: 0.373333rem;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 0.533333rem;
    }
  }
  &__desc:last-of-type {
    margin-bottom: 0;
  }
  &__otherDesc {
    margin-top: 40px;
    height: 76px;
    background: #f2f2f2;
    display: flex;
    justify-content: center;
    align-items: center;
    input {
      height: 40px;
      width: 400px;
      font-size: 28px;
      color: #333333;
      background: #f2f2f2;
      box-sizing: border-box;
      padding: 0;
      line-height:normal;
    }
    input::-webkit-input-placeholder{
      // line-height:normal;
      color: #939393;
    }
  }
  &__footer {
    display: flex;
    .btn {
      padding: 0.28rem 0;
      flex: 1 1 50%;
      box-sizing: border-box;
      text-align: center;
      height: 1.173333rem;
      font-size: 0.426667rem;
      font-weight: 400;
      color: #507DAF;
      line-height: 0.6rem;
      &.gray {
        color: #636363;
      }
    }
  }
}
</style>

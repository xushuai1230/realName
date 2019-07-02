<template>
  <div>
    <div class="mask" v-if="isOpenOard">
      <div class="openCard">
        <div class="banner">
          <img src="~@/assets/img/facecard/popup_img02@3x.png" alt="">
        </div>
        <div class="openCard_msg">
          <h3>如何开卡</h3>

          <div class="content">
            <!-- <div class="bgc"></div> -->
            <p>完成实名认证、电商授权等相关授权，审核通过即开卡成功</p>
          </div>

          <div class="rule_msg_border"></div>
          <p class="rule_msg_bottom"  @click="closeOpenOard">我知道了</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HowOpenCard',
  data () {
    return {
      isOpenOard: true
    }
  },
  methods: {
    closeOpenOard () {
      this.isOpenOard = false
      this.$emit('isCard', this.isOpenOard)
    }
  }
}
</script>

<style scoped lang="scss">
.mask {
  position: fixed;
  top: 0%;
  left: 0%;
  z-index: 1000;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  .openCard {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 7.866667rem;
    margin-left: -3.933333rem;
    margin-top: -3.84rem;
    border-radius: .053333rem;
    .banner {
      width: 100%;
      height: 2.933333rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
    //内容start
    .openCard_msg {
      background: #fff;
      border-bottom-left-radius: 0.266667rem;
      border-bottom-right-radius: 0.266667rem;
      h3 {
        font-size: .426667rem;
        font-family: PingFangSC;
        color: #333;
        font-weight: 600;
        text-align: center;
        padding: .613333rem 0 .48rem;
      }
      .content {
        padding: 0 0.586667rem;
        position: relative;
        text-align: justify;
        font-size: .373333rem;
        color: #333;
        .bgc {
          position: absolute;
          left: .533333rem;
          top: .266667rem;
        }
        p {
          text-align: left;
          // margin-left: .266667rem;
          font-size: 0.373333rem;
          color: #333;
          font-family: PingFangSC;
        }
      }
      .content:nth-of-type(1) {
        .bgc {
         width:.106667rem;
         height:.106667rem;
         background:rgba(119,132,255,1);
        border-radius: 50%;
        }
        p{
          line-height: .533333rem;
        }
      }
      .content:nth-of-type(2) {
        margin-top:.266667rem;
        .bgc {
         width:.106667rem;
         height:.106667rem;
         background:rgba(119,132,255,1);
        border-radius: 50%;
        }
        p{
          line-height: .533333rem;
        }
      }
    }

    //内容end
    .rule_msg_border {
      margin-top:.8rem;
      background: #d0d0d0;
      width: 100%;
      height: 0.03rem;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
    }
    .rule_msg_bottom {
      color:#507daf;
      font-size: .426667rem;
      font-family:PingFangSC-Regular;
      width: 100%;
      text-align: center;
      line-height: 1.186667rem;
    }
  }
}
</style>

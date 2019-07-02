<template>
  <div class="borrowSubmit" ref="borrowSubmit">
    <div class="empty-div"></div>
    <div class="borrow-bg"></div>
    <p class="submit-text">借款申请已提交，系统处理中...</p>
    <p class="submit-text-short">请注意查收短信，按照短信提示进行下一步操作</p>
    <!-- <p class="submit-text-short">审核结果将会以短信的方式通知到您，请注意查收</p> -->
    <div class="submit-bottom">
      <div class="left-button" @click="goHomePage">继续逛逛</div>
      <div class="right-button" @click="goHistoryPage">查看借款</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'borrowSubmit',
  mounted () {
    let bodyHeight = document.documentElement.clientHeight
    this.$refs.borrowSubmit.style.minHeight = bodyHeight + 'px'
  },
  methods: {
    goHistoryPage () {
      this.$tj('clickycardrecord')
      this.$router.push({
        name: 'HistoryPage',
        query: {
          noCache: Date.now()
        }
      })
    },
    goHomePage () {
      this.$router.push({
        name: 'Facescard',
        query: {
          noCache: Date.now()
        }
      })
    }
  }
}
</script>

<style scoped>
.empty-div {
  height: 1.04rem;
  width: 100%;
}
.borrow-bg {
  display: block;
  width: 5.88rem;
  height: 5.36rem;
  background-image: url("../../assets/img/icon_auditing@2x.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin: 0 auto;
}
.submit-text-short {
  font-size: 0.373333rem;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(147, 147, 147, 1);
  margin-bottom: 0.2rem;
}
.borrowSubmit {
  height: 100%;
  background-color: #f2f2f2;
}
.submit-text {
  margin-top: .72rem;
  margin-bottom: 0.533333rem;
  text-align: center;
  font-size: .453333rem;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: #333;
}
.submit-text-short {
  text-align: center;
}
.submit-bottom {
  margin-top: 1.173333rem;
  text-align: center;
}
.submit-bottom div {
  display: inline-block;
  width: 4.133333rem;
  height: 1.12rem;
  line-height: 1.12rem;
  border-radius: .053333rem;
  color: #fff;
  font-size: .426667rem;
  font-family:PingFangSC-Regular;
  font-weight:400;
}
.left-button {
  margin-right: 0.4rem;
  background:rgba(255,148,80,1);
}
.right-button {
  background:rgba(245,75,120,1);
}
.borrowSubmit {
  background-color: #fff;
}
</style>

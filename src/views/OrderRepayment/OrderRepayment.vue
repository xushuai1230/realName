<template>
  <div class="repayment">
    <header class="user-job-notic" @click="gotoHuankuan">
      还款说明
      <span class="left-img-wrap"></span>
    </header>
    <ul class="repayment_content">
      <li class="repayment_list">
        <span class="list_title"> 期数</span>
        <span class="list_fenqi">每期应还</span>
      </li>
      <li class="repayment_item" v-for="(tiem, timeIndex) in repaymentLsit" :key="timeIndex">
        <div>
          <span class="rempayment_item_date"> {{tiem.bsCode}}/{{repaymentLsit.length}}</span>
          <span class="rempayment_item_money">&yen; {{tiem.repaymentAmount | priceFilter}}&nbsp;
            <span v-if=" tiem.counterFee == 0 ? true:false" :class="{active: tiem.counterFee == 0 ? true: false }">(已免手续手费)</span>
            <span v-else>(已含手续费 &yen;{{tiem.counterFee | priceFilter}})</span>
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data () {
    return {
      installmentPlan: null
    }
  },
  computed: {
    repaymentLsit () {
      return this.installmentPlan && this.installmentPlan.installmentPlan
    }
  },
  created () {
    this.installmentPlan = JSON.parse(window.sessionStorage.getItem('instalmentPlan'))
  },
  methods: {
    // 还款说明界面
    gotoHuankuan () {
      location.href = 'https://cdn.basestonedata.com/app/service/repay.html'
    }
  }
}
</script>
<style scoped>
.repayment_content .repayment_list,
.repayment_item {
  font-size: .373333rem;
  color: #333;
  width: 100%;
  height: 1.173333rem;
  line-height: 1.1733333rem;
  background: #FFFFFF;
  border-top: 1px solid #EFEFEF;
}

.repayment_item {
  position: relative;
}

.repayment_content .list_fenqi {
  margin-left: 3.653333rem;
}

.list_title {
  margin-left: 1.413333rem;
}

.rempayment_item_money {
  position: absolute;
  left: 2rem;
}

.repayment_list {
  font-weight: 700;
  color: #333;
}

.rempayment_item_date {
  font-size: .373333rem;
  color: #333;
  margin-left: 1.506667rem;
}

.rempayment_item_money {
  margin-left: 1.653333rem;
  font-size: .373333rem;
}

li:nth-last-child(1) {
  border-bottom: 1px solid #e5e5e5;
}

.active {
  color: #F6547F;
}
.user-job-notic {
  height: 1.173333rem;
  line-height: 1.173333rem;
  padding-left: 1.413333rem;
  background-size: .586667rem;
  font-size: 28px;
  color: #333;
  background-color: #fff;
  border-top: 1px solid #efefef;
  border-bottom: 1px solid #efefef;
  margin: .266667rem 0;
}
.user-job-notic>span {
  float: right;
  height: 100%;
  width: .986667rem;
  background: url('~@/assets/img/userOrder/list_disclosure_indicator_nol_black@2x.png') no-repeat left center;
  background-size: .586667rem;
}
</style>

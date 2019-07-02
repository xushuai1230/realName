<template>
  <div class="loseCredit" ref="loseCredit">
   <ul class="loseCredit-ul">
     <li class="lose-item">
       <span class="item-left">A.</span>
       <span class="item-right">
        请不要相信分期后无需还款的言论，谨防黑中介诈骗
       </span>
     </li>
     <li class="lose-item">
       <span class="item-left">B.</span>
       <span class="item-right">逾期风险:</span>
       <ul class="two-ul">
         <li class="two-item">1.产生滞纳金，加重成本</li>
         <li class="two-item">2.影响社会信誉</li>
         <li class="two-item">3.上传征信，影响其他借款，如房贷，车贷</li>
         <li class="two-item">4.承担对应的民事责任或刑事责任</li>
       </ul>
     </li>
     <li class="lose-item">
       <span class="item-left">C.</span>
       <span class="item-right">被列入失信被执行名单将不得有以下以其财产支付费用的行为:</span>
       <ul class="two-ul">
         <li class="two-item">1.乘坐交通工具时，选择飞机、列车软卧、轮船二等意思舱位</li>
         <li class="two-item">2.在星级以上宾馆、酒店、夜总会、高尔夫球场等场所进行高消费</li>
         <li class="two-item">3.购买不动产或者新建、扩建、高档装修房屋</li>
         <li class="two-item">4.租赁高档写字楼、宾馆、公寓等场所办公</li>
         <li class="two-item">5.购买非经营必需车辆</li>
         <li class="two-item">6.旅游、度假</li>
         <li class="two-item">7.子女就读高收费私立学校</li>
         <li class="two-item">8.支付高额保费购买保险理财产品</li>
        <li class="two-item">9.其他非生活和工作必需的高消费行为</li>
       </ul>
     </li>
   </ul>
  </div>
</template>

<script>
export default {
  name: 'loseCredit',
  mounted () {
    let bodyHeight = document.documentElement.clientHeight
    this.$refs.loseCredit.style.minHeight = bodyHeight + 'px'
  }
}
</script>

<style scoped>
.loseCredit {
  padding: 0 0.4rem;
  background: #fff;
  font-size: .373333rem;
}
.loseCredit-ul {
  padding-top: 0.4rem;
}
.lose-item {
  font-size: .373333rem;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:#ED145B;
  margin-top: .133333rem;
}
.lose-item::after {
  content: '';
  display: inline-block;
  clear: both;
}
.lose-item:nth-child(1) {
  margin-top: 0;
}
.item-left {
  display: inline-block;
}
.item-right {
  display: inline-block;
  margin-left: .2rem;
  width: 90%;
  vertical-align: top;
  line-height: 1.2em;
  font-size: .373333rem;
}
.two-ul {
  margin: .266667rem 0 0 .4rem;
  color: #333;
}
.two-item {
  margin-top: .033333rem;
  line-height: 1.3em;
  color: #636363;
}
</style>

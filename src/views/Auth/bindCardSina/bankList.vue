<template>
  <transition name="fadeInRight">
  <div id="BankList">
    <ul>
      <li v-for="(item, index) in bankList" :key="index" @click.stop.prevent="bankSina(item)">
        <span class="bankname" v-text="item.bankName"></span>
      </li>
    </ul>
  </div>
  </transition>
</template>

<script>
import bankList from '@/module/bankListSina'
export default {
  name: 'BankList',
  data () {
    return {
      bankList: bankList
    }
  },
  methods: {
	  bankSina (item) {
      this.$store.commit('bankSina', item)
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="scss">
  .bankname{
    vertical-align: middle;
  }
  .icon{
    width:0.58rem;
    height:0.58rem;
    margin:0 .1rem 0 .4rem;
    vertical-align: middle;
  }
li{
  height:1.2rem;
  background: #FFFFFF;
  line-height: 1.2rem;
  border-bottom: solid 1px #E6E6E6;
  list-style: none;
  padding-left: .6rem;
  font-size: .373rem;
}
  .fadeInRight-enter-active {
    animation: fadeInRight .3s;
  }
  @keyframes fadeInRight {
    from {
      opacity: 0;
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
    }
    to {
      opacity: 1;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }
  #BankList {
    margin-top: 20px;
    background: #f2f2f2;
  }
</style>

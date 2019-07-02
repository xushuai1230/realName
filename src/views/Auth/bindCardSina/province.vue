<template>
  <transition name="fadeInRight">
    <div id="asd">
        <div class="provinceItem" v-for="(item, index) in proVinceInfo" :key="index" @click.stop.prevent="chooseProvinceSina(item)">
            <span>{{item.fullName}}</span>
        </div>
    </div>
  </transition>
</template>

<script>
export default {
  data () {
    return {
      proVinceInfo: []
    }
  },
  methods: {
    chooseProvinceSina (item) {
    	console.log(item)
      this.$store.commit('chooseProvinceSina', item)
      this.$router.go(-1)
    },
    getProvince () {
	      this.$api['bindCardZhiMaAuth/getByCode']().then(res => {
		      this.proVinceInfo = res.data
	      }).catch((err) => {
		      this.$toast(err)
	      })
    }
  },
  mounted () {
  	this.getProvince()
  }
}
</script>

<style scoped lang="scss">
    .provinceItem{
        width:100%;
        height:1.173rem;
        background: #FFFFFF;
        line-height: 1.173rem;
        border-bottom: solid 1px #e6e6e6;
        text-indent: 2em;
        font-size: 28px;
    }
    .provinceItem span{
        margin-left: .15rem;
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
    #asd {
      margin-top: 20px;
      background: #f2f2f2;
    }
</style>

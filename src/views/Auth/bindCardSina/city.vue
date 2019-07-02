<template>
  <transition name="fadeInRight">
  <div id="city">
    <div class="provinceItem" v-for="(item, index) in cityInfo" :key="index" @click.stop.prevent="chooseCitySina(item)">
      <span>{{item.fullName}}</span>
    </div>
  </div>
  </transition>
</template>

<script>
export default {
  name: 'CitySina',
  data () {
    return {
      cityInfo: []
    }
  },
  computed: {
	  provinceCodesSina () {
		  return this.$store.state.provinceCodesSina
	  }
  },
  methods: {
    chooseCitySina (item) {
      this.$router.go(-1)
      this.$store.commit('chooseCitySina', item)
    },
	  getCity () {
		  this.$api['bindCardZhiMaAuth/getByCode']({
			      code: this.provinceCodesSina
			    }).then(res => {
			    	console.log(res)
			  this.cityInfo = res.data
		  }).catch((err) => {
			  this.$toast(err)
		  })
	  }
  },
  mounted () {
	  this.getCity()
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
      font-size: .373rem;
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
    #city {
      margin-top: 20px;
      background: #f2f2f2;
    }
</style>

<template>
  <div style="padding: 1rem 0">
    <htmTemp :url="url"></htmTemp>
  </div>
</template>
<style scoped>
  *{
    font-size: .37rem;
    line-height: 1.5;
  }
  p{
    padding: 0 .5rem;
  }
  a{
    text-decoration: none;
  }
  ol li{
    padding: .5rem !important;
  }
</style>
<script>
import htmTemp from './htmTemp'
export default{
  data () {
    return {
      url: ''
      // : ''
    }
  },
  mounted () {
    this.url = this.$route.params.url
    // this.title = this.$route.params.title
  },
  methods: {
  },
  components: {
    htmTemp
  }
}
</script>

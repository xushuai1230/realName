<template>
  <div>
    <div v-html="html"></div>
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
import { ajaxReq } from '@/module/request'
export default{
  props: {
    url: {
      required: true
    }
  },
  data () {
    return {
      html: ''
    }
  },
  watch: {
    url (value) {
      this.load(value)
    }
  },
  mounted () {
    this.load(this.url)
  },
  methods: {
	  load (url) {
		  if (url && url.length > 0) {
			  let param = {
				  accept: 'text/html, text/plain'
			  }
			  ajaxReq.get(url, param).then((response) => {
				  this.html = response.data
			  }).catch(() => {
				  this.html = '加载失败'
			  })
		  }
	  }
  }
}
</script>

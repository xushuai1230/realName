<template>
	<div class="Classify clearfix" ref="Classify">
		<div class="Classify__search" ref="search">
			<div class="search" @click="goSearch">
				<img src="~@/assets/img/classify/search_bar_icon@3x.png" alt="" class="searchImg">
				<form @submit.prevent="handlerSubmit" action="">
          <input type="search" :placeholder="placeholder" :value="searchName" @compositionstart="handleComposition" @compositionupdate="handleComposition" @compositionend="handleComposition" @input="handleChange" ref="input" @search="checkForm" autofocus autocomplete="off">
        </form>
				<img src="~@/assets/img/classify/list_icon_delelt@3x.png" alt="" class="delete" @click="deleteSearchName">
			</div>
		</div>
		<ul class="Classify__searchList" ref="searchList" v-show="autoListShow">
			<li class="van-hairline--top" v-for="(item, index) in autoList" :key="index" @click.stop.prevent="searchNameGo(item)">{{item}}</li>
		</ul>
		<router-view class="router-view" ref="list"></router-view>
	</div>
</template>

<script type="text/ecmascript-6">
import { mapState, mapMutations } from 'vuex'
import _debounce from 'lodash/debounce'
const PAGESIZE = 10
export default {
  name: 'Classify',
  props: {},
  data () {
    return {
      autoList: null,
      autoListShow: false,
      placeholder: '',
      isOnComposition: false
    }
  },
  computed: {
    ...mapState(['searchName'])
  },
  mounted () {
    let searchHeight = this.$refs.search.getBoundingClientRect().height
    let bodyHeight = document.documentElement.clientHeight
    let listHeight = bodyHeight - searchHeight
    this.$refs.list.$el.style.height = listHeight + 'px'
    this.$refs.searchList.style.height = listHeight + 'px'
    this.$refs.Classify.style.height = document.documentElement.clientHeight + 'px'
    let placeholder = this.$route.query.placeholder
    if (!placeholder) this.defaultSearchGoods()
    else this.placeholder = placeholder
    if (this.$route.name === 'ClassifySearch') {
      this.$refs.input.focus()
    }
  },
  methods: {
    handleComposition (event) {
      if (event.type === 'compositionend') {
        this.isOnComposition = false
        this.handleChange(event)
      } else {
        this.isOnComposition = true
      }
    },
    handleChange (event) {
      let value = event.target.value
      if (!this.isOnComposition) {
        if (value) this.autoListShow = true
        else this.autoListShow = false
        this.setSearchName({
          name: value,
          tag: 1
        })
        this.$refs.input.focus()
        this.autocompletion(value)
      }
    },
    checkForm (e) {
      e.preventDefault()
      // 手机端点击搜索 搜索对应商品列表
      let name = this.$refs.input.value
      if (!name) name = this.placeholder
      this.setAutoListShow(false)
      this.goRank(name)
      this.$refs.input.blur()
    },
    setAutoListShow (val) {
      this.autoListShow = val
    },
    deleteSearchName () {
      this.setSearchName({
        name: '',
        tag: 1
      })
      this.setAutoListShow(false)
      this.$refs.input.focus()
    },
    searchNameGo (name) {
      // autolist 点击,跳转对应商品列表
      this.setAutoListShow(false)
      this.goRank(name)
      this.$refs.input.blur()
    },
    goRank (name) {
      this.setSearchName({
        name: name
      })
      this.$router.replace({
        name: 'ClassifyRank',
        query: {
          sk: this.searchName,
          searchType: 1
        },
        params: {
          id: 1
        }
      })
    },
    goSearch () {
      this.$router.replace({
        name: 'ClassifySearch'
      })
    },
    autocompletion: _debounce(function (search) {
      return this.$api['classify/autocompletion']({
        'app_params': {
          'skPrefix': this.searchName,
          'size': PAGESIZE
        }
      }, {
        noShowLoading: true,
        noStringify: true
      }).then(res => {
        let result = res.data
        if (result) this.autoList = result
        else this.autoList = []
      })
    }),
    defaultSearchGoods () {
      this.$api['classify/defaultSearchGoods'](
        {}, {
          noShowLoading: true
        }
      ).then(res => {
        this.placeholder = res.data[0]
      })
    },
    handlerSubmit (evt) {
      evt.preventDefault()
      return false
    },
    ...mapMutations(['setSearchName'])
  }
}
</script>
<style>
input[type="search"] {
  -webkit-appearance: textfield;
  -webkit-box-sizing: content-box;
  font-family: inherit;
  font-size: 100%;
}
input::-webkit-search-decoration,
input::-webkit-search-cancel-button {
  display: none;
}
</style>
<style scoped lang="scss">
@import "../../assets/scss/mixin.scss";
.Classify {
  position: relative;
  background-color: #f2f2f2;
  &__search {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 300;
    width: 100%;
    padding: 24px 30px;
    background-color: #fff;
    box-sizing: border-box;
    height: 108px;
    .search {
      position: relative;
      height: 60px;
      background: rgba(244, 244, 244, 1);
      border-radius: 30px;
      padding: 0 20px 0 68px;
      box-sizing: border-box;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .searchImg {
        position: absolute;
        left: 20px;
        top: 6px;
        width: 48px;
        height: 48px;
      }
      .delete {
        position: absolute;
        right: 20px;
        top: 16px;
        width: 28px;
        height: 28px;
      }
      input {
        display: block;
        font-size: 28px;
        font-weight: 400;
        color: #333;
        height: 42px;
        padding: 0;
        line-height: normal;
        width: 560px;
        @include text-overflow(1);
        background: rgba(244, 244, 244, 1);
        -webkit-appearance: none;
      }
      input::-webkit-input-placeholder {
        color: #939393;
      }
      input::-webkit-search-cancel-button {
        display: none;
      }
      // #form {
      //   display: flex;
      //   justify-content: flex-start;
      //   align-items: center;
      //   margin-left: 8px;
      // }
    }
  }
  &__searchList {
    position: fixed;
    top: 108px;
    left: 0;
    width: 100%;
    z-index: 300;
    background-color: #fff;
    li {
      height: 88px;
      background: rgba(255, 255, 255, 1);
      font-size: 28px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: #333;
      line-height: 88px;
      padding: 0 30px;
      box-sizing: border-box;
    }
  }
  .router-view {
    position: absolute;
    left: 0;
    top: 108px;
    width: 100%;
  }
}
</style>

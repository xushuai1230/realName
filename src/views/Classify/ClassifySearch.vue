<template>
	<div class="classifySearch">
		<div class="section van-hairline--bottom">
			<div class="title clearfix">
				<span class="fl">最近搜索</span>
				<img src="~@/assets/img/classify/search_list_btn_delelt@3x.png" alt="" class="fr" @click="deleteHistorySearch">
			</div>
			<ul class="list" v-if="historySearchList && historySearchList.length">
				<li class="item" v-for="(item, index) in historySearchList" :key="index" @click="goRank({
          sk: item
        })">{{item}}</li>
			</ul>
			<div v-else class="noList">暂无搜索记录</div>
		</div>
		<div class="section">
			<div class="normal clearfix">
				<span class="fl">大家都在搜</span>
			</div>
			<ul class="list">
				<li class="item" :class="{active: item.sk.indexOf('<red>') !== -1}" v-for="item in hotSks" :key="item.id" @click="goRank(item)">
					<span>{{item.sk | nameFilter}}</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
import { mapMutations } from 'vuex'

export default {
  name: 'ClassifySearch',
  props: {},
  data () {
    return {
      historySearchList: null,
      hotSks: null
    }
  },
  created () {
    this.$tj('entersearch')
    let historySearchList = JSON.parse(window.sessionStorage.getItem('historySearchList'))
    if (Array.isArray(historySearchList)) this.historySearchList = historySearchList.reverse()
    this.goSearch()
  },
  methods: {
    deleteHistorySearch () {
      window.sessionStorage.setItem('historySearchList', '[]')
      this.historySearchList = []
    },
    goSearch () {
      this.$api['classify/searchSkload']({
        'app_params': {
          'deviceNo': '',
          'userId': ''
        }
      }, {
        noShowLoading: true
      }).then(res => {
        this.hotSks = res.data.hotSks
      })
    },
    goRank (item) {
      let sk = ''
      let id = item.id
      if (item.sk.indexOf('<red>') === -1) {
        sk = item.sk
      } else {
        sk = item.sk.substr(5)
      }
      this.setSearchName({
        name: sk
      })
      if (!id) id = 0
      this.$router.replace({
        name: 'ClassifyRank',
        params: {
          id
        },
        query: {
          sk,
          searchType: 1
        }
      })
    },
    ...mapMutations(['setSearchName'])
  },
  filters: {
    nameFilter (val) {
      if (val.indexOf('<red>') === -1) {
        return val
      } else {
        return val.substr(5)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.classifySearch {
  height: 100%;
  padding: 0 30px;
  background-color: #fff;
  box-sizing: border-box;
  .section {
    .title {
      height: 58px;
      margin-bottom: 14px;
      span {
        font-size: 28px;
        font-weight: 400;
        color: #939393;
        line-height: 58px;
      }
      img {
        width: 58px;
        height: 58px;
      }
    }
    .normal {
      padding: 24px 0;
      span {
        line-height: 37px;
        font-size: 28px;
        font-weight: 400;
        color: #939393;
      }
    }
    .noList {
      height: 37px;
      font-size: 28px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: #939393;
      line-height: 37px;
      text-align: center;
      padding-bottom: 34px;
    }
  }
  .list {
    display: flex;
    justify-content: flex-start;
    flex-flow: wrap;
    margin-right: -24px;
    .item {
      height: 50px;
      background: rgba(245, 244, 244, 1);
      border-radius: 4px;
      padding: 7px 24px;
      box-sizing: border-box;
      margin: 0 24px 24px 0;
      font-size: 24px;
      line-height: 36px;
      color: #333;
      &.active {
        color: #ed145b;
      }
    }
  }
}
</style>

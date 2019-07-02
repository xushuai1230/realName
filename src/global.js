import Vue from 'vue'
import * as filters from '@/module/filters'
import base from '@/mixins/default'
import login from '@/mixins/login'
import inject from '@/plugins/inject'
import directs from '@/directives/index'
import {
  Toast,
  Loading,
  Icon,
  Tab,
  Tabs,
  Swipe,
  SwipeItem,
  List,
  PullRefresh,
  Lazyload,
  CellGroup,
  Field,
  Dialog,
  SwipeCell,
  GoodsAction,
  GoodsActionBigBtn,
  GoodsActionMiniBtn,
  PasswordInput,
  NumberKeyboard,
  Actionsheet,
  Picker,
  Switch,
  Popup
} from 'vant' // 注册eventBus
// 订单部分start
import './filter'
import './module/layer/need/layer.css'
import './assets/css/layer.reset.css'
import '@/module/layer/need/layer.css'
import layer from '@/module/layer/layer.js'
import clipboard from 'clipboard'
import VueDraggableResizable from 'vue-draggable-resizable'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

Vue.prototype.$clipboard = clipboard
Vue.prototype.$la = layer
Vue.prototype.$toast = (object) => {
  if (object.heads) {
    Toast(object.heads.message)
  } else {
    Toast(String(object))
  }
}
Vue.use(VueAwesomeSwiper)
Vue.component('vue-draggable-resizable', VueDraggableResizable)

// 订单部分end

/**
 * @description 由于懒加载需要各种图片尺寸，根据url返回的尺寸修改svg文件的尺寸
 * @author name xuxiding
 * @date 2018-12-22
 * @param {number} [width=100]
 * @param {number} [height=100]
 * @returns svg base64字符串
 */
function dyCreateSvg (width = 100, height = 100) {
  let svg =
  `
  <svg version="1.1" id="图层_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
   width="${width}"
   height="${height}"
	 viewBox="0 0 500 500" style="enable-background:new 0 0 500 500;" xml:space="preserve">
<style type="text/css">
	.st0{fill:%23F54B78;}
	.st1{fill:%23f2f2f2;}
	.st2{fill:%23E0E0E0;}
</style>
<rect class="st1" width="500" height="500"/>
<g id="XMLID_410_">
	<g id="XMLID_411_">
		<g id="XMLID_422_">
			<path id="XMLID_423_" class="st2" d="M167,395.2L167,395.2c-2.1-0.8-4.2-1.7-6.2-2.6C162.8,393.6,164.9,394.4,167,395.2z"/>
		</g>
		<g id="XMLID_420_">
			<path id="XMLID_421_" class="st2" d="M167,395.2L167,395.2c-2.1-0.8-4.2-1.7-6.2-2.6C162.8,393.6,164.9,394.4,167,395.2z"/>
		</g>
		<path id="XMLID_418_" class="st2" d="M227.5,179.8l5.3-9.8c0.8-1.5,2.4-2.5,4-2.5h10.4c3,0,4.6,3.2,2.8,5.9l-5.6,8.7
			c-1.7,2.7-0.2,5.9,2.8,5.9h0.1c2.2,0,3.8,1.8,3.5,4l0,0c-0.3,2.2-2.3,4-4.5,4h-8.5c-1.5,0-3.1,0.9-3.9,2.3l-0.2,0.3
			c-1.6,2.7,0,5.8,2.9,5.8h8.7c2.2,0,3.8,1.8,3.5,4l0,0c-0.3,2.2-2.3,4-4.5,4h-12c-2.2,0-4.2,1.8-4.5,4l-1.1,8.7
			c-0.3,2.2-2.3,4-4.5,4h-9.7c-2.2,0-3.8-1.8-3.5-4l1.1-8.7c0.3-2.2-1.3-4-3.5-4h-11.7c-2.2,0-3.8-1.8-3.5-4l0,0
			c0.3-2.2,2.3-4,4.5-4h8.7c3,0,5.3-3.1,4.3-5.8l-0.1-0.3c-0.5-1.4-1.8-2.3-3.3-2.3h-8.5c-2.2,0-3.8-1.8-3.5-4l0,0
			c0.3-2.2,2.3-4,4.5-4h0.1c3,0,5.4-3.2,4.3-5.9l-3.5-8.7c-1.1-2.7,1.3-5.9,4.3-5.9h10.5c1.6,0,2.9,0.9,3.4,2.4l3.3,10
			C221.2,183.1,225.7,183,227.5,179.8z"/>
		<g id="XMLID_412_">
			<path id="XMLID_417_" class="st2" d="M167,395.2L167,395.2c-2.1-0.8-4.2-1.7-6.2-2.6C162.8,393.6,164.9,394.4,167,395.2z"/>
			<path id="XMLID_413_" class="st2" d="M388.2,347.6c-3,10-6.5,13.7-6.5,13.7c-1.9,2.8-6.7,5.2-9.9,4.6c-3.8-0.7-5.7-3.1-6.8-5.8
				c-0.8-2.1-1-6.1,0.9-12.3c0,0,3-9.6,7.9-19.4c0,0,10.4-23.9,17.8-41.3c0.3-0.5,0.5-1.1,0.8-1.6c6.4-14.3,10.1-30.6,10.1-47.8
				c0-58.3-41.7-105.5-93.1-105.5c-4.9,0-9.7,0.5-14.4,1.3c8.7,14.5,13.7,31.5,13.7,49.7c0,0.5-0.1,1.1-0.1,1.6
				c-2.2-48.4-42.1-87-91.1-87c-50.4,0-91.3,40.9-91.3,91.3c0,8.2,1.1,16.1,3.1,23.6c1,3.7,2.2,7.4,3.7,10.9
				c13.3,32.5,44.8,55.6,81.8,56.7c-1.1,0-2.2,0.1-3.3,0.1c-36.8,0-68.7-20.4-85.2-50.5c-11.9,11.8-21,26.4-26.4,42.6
				c-3.6,10.8-5.6,22.4-5.6,34.4c0,7.2,0.7,14.3,2.1,21.1c1.3,15.5,4.9,30.4,10.5,44.4c1,2.4,2.5,4.2,4.9,3.9
				c2.3-0.3,3.8-2.4,3.6-4.7c0-0.2-0.1-0.5-0.2-0.7c0,0,0,0,0,0c-2.2-8.3-3.7-16.9-4.3-25.7c6.1,11.9,14.1,22.7,23.7,31.8
				c9.7,9.2,20.9,16.8,33.3,22.2c0,0,0,0,0,0c0.4,0.3,0.9,0.4,1.4,0.4c1.6,0,2.8-1.2,2.9-2.8c0-0.6-0.2-1.2-0.5-1.6v0h0c0,0,0,0,0,0
				l0,0c-0.3-0.6-0.6-1.2-0.9-1.8c0-0.1-0.1-0.1-0.1-0.2c-0.3-0.6-0.6-1.2-0.9-1.8c-0.3-0.6-0.6-1.3-0.8-1.9c0,0,0,0,0,0
				c0,0,0,0,0,0c0,0,0-0.1-0.1-0.1c-0.1-0.2-0.2-0.4-0.2-0.6c-0.2-0.7-0.5-1.3-0.7-2c-0.1-0.3-0.2-0.7-0.3-1c0-0.2-0.1-0.3-0.1-0.5
				c-0.1-0.4-0.2-0.8-0.3-1.2c-0.2-0.7-0.4-1.4-0.5-2.1c-0.1-0.3-0.1-0.5-0.2-0.8c-0.1-0.4-0.1-0.7-0.2-1.1
				c-0.1-0.8-0.2-1.6-0.3-2.4c0-0.3-0.1-0.6-0.1-0.9c0-0.2,0-0.4,0-0.6c-0.1-1.3-0.2-2.6-0.2-3.9v0c0-26.1,21.2-47.3,47.3-47.3
				c1.3,0,2.5,0.1,3.7,0.2c0.2,0,0.4,0,0.6,0c1.2,0.1,2.4,0.3,3.6,0.5c0.1,0,0.3,0.1,0.4,0.1c2.5,0.5,5,1.1,7.4,1.9h0
				c1.1,0.4,2.2,0.8,3.3,1.3c0,0,0.1,0,0.1,0.1c2.1,1,4.2,2.1,6.2,3.3c0.1,0,0.1,0.1,0.2,0.1c1.9,1.2,3.8,2.6,5.5,4.1
				c0.1,0.1,0.1,0.1,0.2,0.2c0.9,0.8,1.7,1.5,2.5,2.3c0,0,0.1,0.1,0.1,0.1c0.8,0.8,1.5,1.6,2.2,2.5c0,0,0.1,0.1,0.1,0.1
				c0.7,0.9,1.4,1.7,2,2.6c0.1,0.1,0.2,0.2,0.3,0.4c1.3,1.8,2.4,3.7,3.4,5.6c0.1,0.2,0.2,0.3,0.3,0.5c0.5,1,0.9,2,1.4,3
				c0,0.1,0.1,0.2,0.1,0.3c0.4,0.9,0.7,1.9,1.1,2.9c0.1,0.2,0.1,0.4,0.2,0.6c0.3,1,0.6,2.1,0.9,3.1c0,0.2,0.1,0.4,0.1,0.6
				c0.2,1,0.4,1.9,0.6,2.9c0,0.2,0.1,0.3,0.1,0.5c0.2,1.1,0.3,2.2,0.4,3.3c0,0.2,0,0.5,0.1,0.7c0.1,1.1,0.1,2.3,0.1,3.4
				c0,1,0,2.1-0.1,3.1c0,0.3,0,0.5-0.1,0.8c0,0.2,0,0.4-0.1,0.7c0,0.1,0,0.1,0,0.2c-0.1,0.6-0.1,1.2-0.2,1.8c0,0.1,0,0.3-0.1,0.4
				c-0.1,0.7-0.2,1.4-0.4,2.1c0,0.1,0,0.2,0,0.2c0,0.2-0.1,0.5-0.1,0.7c0,0.2-0.1,0.3-0.1,0.5c-0.2,0.9-0.4,1.8-0.7,2.7
				c0,0.1-0.1,0.2-0.1,0.4c0,0.1,0,0.1-0.1,0.2c-0.4,1.4-0.9,2.7-1.4,4c0,0.1-0.1,0.1-0.1,0.2c-0.2,0.5-0.4,1-0.7,1.5
				c0,0.1-0.1,0.1-0.1,0.2c-0.3,0.7-0.7,1.5-1.1,2.2c0,0,0,0.1-0.1,0.1c-0.6,1.1-1.2,2.2-1.9,3.3c-0.1,0.1-0.2,0.3-0.3,0.4
				c0,0,0,0,0,0.1c0,0,0,0,0,0c0,0,0,0,0,0c-0.4,0.5-0.7,1-0.7,1.7c0,1.4,1.1,2.6,2.6,2.7c0.5,0,1-0.2,1.4-0.4c0,0,0,0,0,0
				c23.3-13,41.3-34.3,50-60c-0.6-3-1.1-6.1-1.4-9.3c-0.3-4.4-0.3-8.7,0.2-12.9c1.8,1.5,3.7,2.9,5.7,4.1c9.6,6.2,21.2,9.5,33.5,8.6
				c11.4-0.9,21.8-5.3,30-12c-8.7,14.5-24,24.7-42.2,26.1c-2.3,0.2-4.6,0.2-6.9,0.1c3.4,29.2,20.5,51.4,41.1,51.4
				c18.6,0,34.4-18.2,39.8-43.3C401.9,352.7,393.4,349.5,388.2,347.6z M222,252.6c-30.9,0-55.9-25-55.9-55.9
				c0-30.9,25-55.9,55.9-55.9c30.9,0,55.9,25,55.9,55.9C277.9,227.6,252.9,252.6,222,252.6z M355.5,255.6c-7.1,0-12.8-5.7-12.8-12.8
				c0-7.1,5.7-12.8,12.8-12.8s12.8,5.7,12.8,12.8C368.3,249.9,362.6,255.6,355.5,255.6z"/>
		</g>
	</g>
</g>
</svg>`
  return `data:image/svg+xml;utf8,${svg}`
}

// 注册eventBus
global.vbus = new Vue()
// 注册组件
Vue.use(inject)
  .use(Dialog)
  .use(Loading)
  .use(Icon)
  .use(Tab)
  .use(Tabs)
  .use(Actionsheet)
  .use(Picker)
  .use(Dialog)
  .use(Tab)
  .use(Tabs)
  .use(Swipe)
  .use(SwipeItem)
  .use(List)
  .use(PullRefresh)
  .use(CellGroup)
  .use(Field)
  .use(Switch)
  .use(SwipeCell)
  .use(GoodsAction)
  .use(GoodsActionBigBtn)
  .use(GoodsActionMiniBtn)
  .use(PasswordInput)
  .use(NumberKeyboard)
  .use(PullRefresh)
  .use(Popup)
  .use(Lazyload, {
    loading: dyCreateSvg(),
    filter: {
      progressive (listener, options) {
        let url = listener.src
        let matchData = url && url.match(/img\.xiaoxiangyoupin\.com\/image\/(\d+)x(\d+)_(\d+)/)
        let width, height
        if (matchData) {
          width = matchData[1]
          height = matchData[2]
          let srcBase64 = dyCreateSvg(width, height)
          listener.loading = srcBase64
        }
      }
    }
  })
// 处理全局过滤器
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]))

// 添加全局的mixin函数
Vue.mixin(base).mixin(login)

/**
 * 添加自定义指令
 *
 */
for (let moduleKey in directs) {
  let module = directs[moduleKey]
  for (let direct in module) {
    Vue.directive(direct, module[direct])
  }
}

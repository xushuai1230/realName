<template>
	<div class="drag" ref="drag" :style="dragStyle">
		<img src="~@/assets/img/dragBtn@3x.png" alt="" @load="getElRect">
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'DragBtn',
  data () {
    return {
      dragStyle: null,
      tap_time: null,
      startClientX: null,
      startClientY: null,
      elWidth: 70,
      elHeight: 70
    }
  },
  created () {
    if (this.dragPos.right !== 0 || this.dragPos.bottom !== 0) {
      this.dragStyle = {
        right: this.dragPos.right + 'px',
        bottom: this.dragPos.bottom + 'px'
      }
    }
  },
  props: ['parentH'],
  computed: {
    ...mapState(['dragPos'])
  },
  mounted () {
    this.dragHandler(this.$refs.drag)
  },
  methods: {
    getElRect () {
      let styler = window.getComputedStyle(this.$refs.drag, null)
      let widthMatch = styler.width.match(/[0-9].*[0-9]/)
      let heightMatch = styler.height.match(/[0-9].*[0-9]/)
      this.elWidth = widthMatch && widthMatch[0]
      this.elHeight = heightMatch && heightMatch[0]
    },
    dragHandler (bashou) {
      let viewportWidth = document.documentElement.clientWidth
      let viewportHeight = document.documentElement.clientHeight
      let disWidth, disHeight, gouguDis, tempTouch
      bashou.addEventListener('touchstart', (evt) => {
        evt.preventDefault()
        viewportWidth = document.documentElement.clientWidth
        viewportHeight = document.documentElement.clientHeight
        let rect = bashou.getBoundingClientRect()
        let targetTouch = evt.targetTouches[0]
        this.startClientX = targetTouch.clientX
        this.startClientY = targetTouch.clientY
        disWidth = rect.right - this.startClientX
        disHeight = rect.bottom - this.startClientY
        this.tap_time = Date.now()
      })
      bashou.addEventListener('touchmove', (evt) => {
        let right = viewportWidth - (evt.targetTouches[0].clientX + disWidth)
        let bottom = viewportHeight - (evt.targetTouches[0].clientY + disHeight)
        console.log('right', right, viewportWidth)
        if (right <= 0) {
          right = 0
        } else if (right >= viewportWidth - this.elWidth) {
          right = viewportWidth - this.elWidth
        }
        if (bottom <= this.parentH) {
          bottom = this.parentH
        } else if (bottom >= viewportHeight - this.elHeight) {
          bottom = viewportHeight - this.elHeight
        }
        this.dragStyle = {
          right: right + 'px',
          bottom: bottom + 'px'
        }
      })
      bashou.addEventListener('touchend', (evt) => {
        if (this.dragStyle) {
          this.setDragPos(this.dragStyle)
        }
        this.tap_time = Date.now() - this.tap_time
        tempTouch = evt.changedTouches[0]
        gouguDis = Math.sqrt(Math.pow(Math.abs(tempTouch.clientX - this.startClientX), 2) + Math.pow(Math.abs(tempTouch.clientY - this.startClientY), 2))
        if (this.tap_time < 700 && gouguDis < 12) {
          this.$tj('floverlayclick')
          this.setShowCouponDialogStatus(true)
          this.setDragStatus(false)
        }
      })
    },
    ...mapMutations(['setShowCouponDialogStatus', 'setDragPos', 'setDragStatus'])
  },
  watch: {
    dragPos (newVal) {
      if (this.dragPos.right !== 0 || this.dragPos.bottom !== 0) {
        this.dragStyle = {
          right: this.dragPos.right + 'px',
          bottom: this.dragPos.bottom + 'px'
        }
      }
    }
  }
}

</script>

<style scoped lang="scss">
body {
  .drag {
    position: fixed;
    right: 0;
    bottom: 1.2rem;
    z-index: 100;
    img {
      display: block;
      width: 2.2rem;
      height: auto;
    }
  }
}
</style>

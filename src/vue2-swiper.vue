<template>
  <div class="swiper"
       :class="[direction, {'dragging': dragging,'tabmode': tabMode}]"
       @touchstart="_onTouchStart"
       @mousedown="_onTouchStart"
       @wheel="_onWheel">
    <div v-if="tabMode" class="swiper-tabnav">
      <span v-for="(tab , index) in tabMode" @click="setPage(index + 1)">{{tab}}</span>
    </div>
    <div class="swiper-wrapper"
         ref="swiperWrapper"
         :style="{
                'transform' : 'translate3d(' + translateX + 'px,' + translateY + 'px, 0)',
                'transition-duration': transitionDuration + 'ms'
             }"
         @transitionend="_onTransitionEnd">
      <slot></slot>
    </div>
    <div class="swiper-pagination"
         v-show="paginationVisible">
            <span class="swiper-pagination-bullet"
                  :class="{'active': index+1===currentPage}"
                  v-for="(slide , index) in slideEls"
                  @click="paginationClickable && setPage(index+1)"></span>
    </div>
  </div>
</template>
<style lang="scss" src="./vue2-swiper.scss"></style>
<script type="text/babel">
  import { addClass, removeClass, getElementsByAttribute, on, off } from './utils/dom'

  const VERTICAL = 'vertical'
  const HORIZONTAL = 'horizontal'
  export default {
    name: 'Swiper',
    props: {
      direction: {
        type: String,
        default: HORIZONTAL,
        validator: (value) => [VERTICAL, HORIZONTAL].indexOf(value) > -1
      },
      mousewheelControl: {
        type: Boolean,
        default: false
      },
      performanceMode: {
        type: Boolean,
        default: false
      },
      paginationVisible: {
        type: Boolean,
        default: false
      },
      paginationClickable: {
        type: Boolean,
        default: false
      },
      loop: {
        type: Boolean,
        default: false
      },
      speed: {
        type: Number,
        default: 500
      },
      activeIndex: {
        type: Number,
        default: 1
      },
      customizePagination: String, //自定义分页器，值为dom选择器
      customizePaginationActiveClass: {
        type: String,
        default: 'active'
      },
      inner: {
        type: Boolean,
        default: false
      },
      tabMode: {
        type: [Boolean, Array],
        default: false
      }
    },
    data () {
      return {
        currentPage: 1,
        lastPage: 1,
        pageCount: 0,
        translateX: 0,
        translateY: 0,
        startTranslate: 0,
        delta: 0,
        dragging: false,
        startPos: null,
        transitioning: false,
        slideEls: [],
        translateOffset: 0,
        transitionDuration: 0
      }
    },
    mounted () {
      let self = this
      this._onTouchMove = this._onTouchMove.bind(this)
      this._onTouchEnd = this._onTouchEnd.bind(this)
      this.slideEls = [].map.call(this.$refs.swiperWrapper.children, el => el)
      this.currentPage = this.activeIndex
      //获取自定义的pagination
      if (this.customizePagination) {
        const pagination = document.querySelector(this.customizePagination)
        if (!pagination) {
          throw new Error('cannot find customizePagination in dom, customizePagination must be a select')
        } else {
          this.customize = pagination
        }
        //为自定义的pagination 添加点击事件
        if (this.paginationClickable) {
          on(this.customize, 'click', function (ev) {
            ev = ev || window.event
            let target = ev.target || ev.srcElement
            const index = target.getAttribute('index')
            if (index) {
              self.setPage(Number(index))
            }
          })
        }
      }

      //如果嵌套，将不支持loop和mousewheel, TODO 解决污染问题
      if (this.inner) {
        this.loop = false
        this.mousewheelControl = false
      }
      if (this.loop) {
        this.$nextTick(function () {
          this._createLoop()
          this.setPage(this.currentPage, true)
        })
      } else {
        this.setPage(this.currentPage, true)
      }
    },
    methods: {
      next () {
        const page = this.currentPage
        if (page < this.slideEls.length || this.loop) {
          this.setPage(page + 1)
        } else {
          this._revert()
        }
      },
      prev () {
        const page = this.currentPage
        if (page > 1 || this.loop) {
          this.setPage(page - 1)
        } else {
          this._revert()
        }
      },
      setPage (page, noAnimation) {
        let self = this
        this.lastPage = this.currentPage
        if (page === 0) {
          this.currentPage = this.slideEls.length
        } else if (page === this.slideEls.length + 1) {
          this.currentPage = 1
        } else {
          this.currentPage = page
        }
        if (this.loop) {
          if (this.delta === 0) {
            this._setTranslate(self._getTranslateOfPage(this.lastPage))
          }
          setTimeout(function () {
            self._setTranslate(self._getTranslateOfPage(page))
            if (noAnimation) return
            self._onTransitionStart()
          }, 0)
        } else {
          this._setTranslate(this._getTranslateOfPage(page))
          if (noAnimation) return
          this._onTransitionStart()
        }
      },
      isHorizontal () {
        return this.direction === HORIZONTAL
      },
      isVertical () {
        return this.direction === VERTICAL
      },
      _onTouchStart (e) {
        e = e || window.event
        this.startPos = this._getTouchPos(e)
        this.delta = null
        this.startTranslate = this._getTranslateOfPage(this.currentPage)
        this.startTime = new Date().getTime()
        this.dragging = true
        this.firstMove = true
        this.transitionDuration = 0
        console.log('touchstart')
        on(document, 'touchmove', this._onTouchMove)
        on(document, 'touchend', this._onTouchEnd)
        on(document, 'mousemove', this._onTouchMove)
        on(document, 'mouseup', this._onTouchEnd)
      },
      _onTouchMove (e) {
        e = e || window.event
        const deltaX = this._getTouchPos(e).x - this.startPos.x
        const deltaY = this._getTouchPos(e).y - this.startPos.y
        this.delta = {
          x: deltaX,
          y: deltaY
        }
        //解决内部不能滑动的问题,第一次滑动判断滑动方向
        if (this.firstMove) {
          this.firstMove = false
          if ((Math.abs(deltaY) >= Math.abs(deltaX) && this.isHorizontal()) || (Math.abs(deltaY) <
              Math.abs(deltaX) && this.isVertical())) {
            off(document, 'touchmove', this._onTouchMove)
            off(document, 'touchend', this._onTouchEnd)
            off(document, 'mousemove', this._onTouchMove)
            off(document, 'mouseup', this._onTouchEnd)
            if (this.inner) {
              const parent = this.$parent
              off(document, 'touchmove', parent._onTouchMove)
              off(document, 'touchend', parent._onTouchEnd)
              off(document, 'mousemove', parent._onTouchMove)
              off(document, 'mouseup', parent._onTouchEnd)
            }
            this.dragging = false
            return
          }
        }
        this.delta = this.isHorizontal() ? this.delta.x : this.delta.y
        if (this.inner && this.slideEls.length > 1 && ((this.delta > 0 && this.currentPage > 1) || (this.delta
            < 0 && this.currentPage < this.slideEls.length))) {
          const parent = this.$parent
          parent.dragging = false
          off(document, 'touchmove', parent._onTouchMove)
          off(document, 'touchend', parent._onTouchEnd)
          off(document, 'mousemove', parent._onTouchMove)
          off(document, 'mouseup', parent._onTouchEnd)
        } else if (this.inner) {
          this.dragging = false
          off(document, 'touchmove', this._onTouchMove)
          off(document, 'touchend', this._onTouchEnd)
          off(document, 'mousemove', this._onTouchMove)
          off(document, 'mouseup', this._onTouchEnd)
          return
        }
        if (!this.performanceMode) {
          this._setTranslate(this.startTranslate + this.delta)
          this.$emit('slider-move', this._getTranslate())
        }
//                if (this.isVertical() || this.isHorizontal() && Math.abs(this.delta) > 0) {
//                    e.preventDefault()
//                }
      },
      _onTouchEnd () {
        this.dragging = false
        this.transitionDuration = this.speed
        const isQuickAction = new Date().getTime() - this.startTime < 600
        if (this.delta < -100 || (isQuickAction && this.delta < -30)) {
          this.next()
        } else if (this.delta > 100 || (isQuickAction && this.delta > 30)) {
          this.prev()
        } else {
          this._revert()
        }
        off(document, 'touchmove', this._onTouchMove)
        off(document, 'touchend', this._onTouchEnd)
        off(document, 'mousemove', this._onTouchMove)
        off(document, 'mouseup', this._onTouchEnd)
      },
      _onWheel (e) {
        e = e || window.event
        if (this.mousewheelControl) {
          // TODO Support apple magic mouse and trackpad.
          if (!this.transitioning) {
            if (e.deltaY > 0) {
              this.next()
            } else {
              this.prev()
            }
          }

          if (this._isPageChanged()) e.preventDefault()
        }
      },
      _revert () {
        this.setPage(this.currentPage)
      },
      _getTouchPos (e) {
//                const key = this.isHorizontal() ? 'pageX' : 'pageY'
//                return e.changedTouches ? e.changedTouches[0][key] : e[key]
        const x = e.changedTouches ? e.changedTouches[0].pageX : e.pageX
        const y = e.changedTouches ? e.changedTouches[0].pageY : e.pageY
        return {
          x: x,
          y: y
        }
      },
      _onTransitionStart () {
        this.transitioning = true
        this.transitionDuration = this.speed
        if (this._isPageChanged()) {
          this.$emit('slide-change-start', this.currentPage)
        } else {
          this.$emit('slide-revert-start', this.currentPage)
        }
      },
      _onTransitionEnd () {
        this.transitioning = false
        this.transitionDuration = 0
        this.delta = 0
        if (this._isPageChanged()) {
          this.$emit('slide-change-end', this.currentPage)
        } else {
          this.$emit('slide-revert-end', this.currentPage)
        }
      },
      _isPageChanged () {
        return this.lastPage !== this.currentPage
      },
      _setTranslate (value) {
        const translateName = this.isHorizontal() ? 'translateX' : 'translateY'
        this[translateName] = value
      },
      _getTranslate () {
        const translateName = this.isHorizontal() ? 'translateX' : 'translateY'
        return this[translateName]
      },
      _getTranslateOfPage (page) {
        if (page === 0) return 0
        const propName = this.isHorizontal() ? 'clientWidth' : 'clientHeight'
        return -[].reduce.call(this.slideEls, function (total, el, i) {
          return i > page - 2 ? total : total + el[propName]
        }, 0) + this.translateOffset
      },
      _createLoop () {
        const propName = this.isHorizontal() ? 'clientWidth' : 'clientHeight'
        let swiperWrapEl = this.$refs.swiperWrapper
        const duplicateFirstChild = swiperWrapEl.firstElementChild.cloneNode(true)
        const duplicateLastChild = swiperWrapEl.lastElementChild.cloneNode(true)
        swiperWrapEl.insertBefore(duplicateLastChild, swiperWrapEl.firstElementChild)
        swiperWrapEl.appendChild(duplicateFirstChild)
        this.translateOffset = -duplicateLastChild[propName]
      }
    },
    watch: {
      currentPage (val) {
        if (!this.customize) return
        const activeClass = this.customizePaginationActiveClass
        const pagination = this.customize.getElementsByClassName(activeClass)
        if (pagination) {
          for (let i = 0; i < pagination.length; i++) {
            removeClass(pagination[i], activeClass)
          }
        }
        const active = getElementsByAttribute(this.customize, 'index', val + '')[0]
        addClass(active, activeClass)
      }
    }
  }
</script>

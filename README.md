# vue2-swiper
 一个简单的vue2 swiper 插件

## Getting start
### NPM
```bush
npm install --save vue2-swiper
```
```javascrit
import {Swiper} from 'vue2-swiper'

new Vue({
    el: '#app',
    components: {
        Swiper
    }
})
```
```html
<swiper>
<div v-for="n in 3">page {{n}}</div>
</swiper>
```
or you can import vue2Swiper in `main.js`
```javascript
import Vue from 'vue'
import vue2Swiper from 'vue2-swiper'
Vue.use(vue2Swiper)
```
### HTML
```html
<script type="text/javascript" src="path/to/vue.js"></script>
<script type="text/javascript" src="path/to/vue2Swiper.js"></script>
<script>
Vue.use(vue2Swiper)
var vm = new Vue({
  el: '#app'
 })
</script>
```

## Demo & Document
- `git clone https://github.com/fchengjin/vue2-swiper`
- `cd vue2-swiper`
- `npm install`
- `npm run dev`
- it will open the demo at `127.0.0.1:3030`
- or you can see the [DEMO here](https://fchengjin.github.io/vue2-swiper/)

## Api
### props
| Name                 | Type      | Default      | Description                                                        |
|----------------------|-----------|--------------|--------------------------------------------------------------------|
| direction            | `String`  | `"horizontal"` | Could be 'horizontal' or 'vertical' (for vertical slider).         |
| mousewheel-control   | `Boolean` | `false`       | Set to true to enable navigation through slides using mouse wheel. |
| pagination-visible   | `Boolean` | `false`      | Toggle (hide/true) pagination container visibility when click on Slider's container    |
| pagination-clickable | `Boolean` | `false`      | If true then clicking on pagination button will cause transition to appropriate slide. |
| performace-mode      | `Boolean` | `false`      | Disable advance effect for better performance.                     |
| loop                 | `Boolean` | `false`      | Set true to enable the loop mode                         |
| speed                | `Boolean` | `500`        | swiper switching speed |
| active-index          | `Number`  |    `1`       | The active page when initializing |
| no-bounds            | `Boolean` | `false`      | If you want the first page can not slide to left ,or the last page can not slide to right , you should set noBounds to true. |
| forbidden-slide      | `Boolean` | `false`      | If true, you can not change the swiper by sliding  |
| tab-mode  | `Array`  |    -       | f you set tabMode , it will add a tabnav above the swiper-slider. |
| tab-mode-animation   | `Boolean` | `false`      |  If you just use the tab as a nav, you can set tabModeAnimation to true. |
| customize-nav  | `String`  | -| customize-nav is a dom selector, you can place it anywhere you want.  |
| customize-nav-active-class | `String`  |   `active`   |  customize-nav-active-class |
| nested                | `Boolean` |    `false`   | f you want nest the swiper , you should add nested property to the children |

### Methods
| Method            | Description              |
|-------------------|--------------------------|
| next()            | switch to next slider            |
| prev()            | switch to previous slider        |
| setPage(`pageNumber : Number`,`noAnimation : Boolean`) | NoAnimation is optional parameter, if set true, there is no transition animation when switching|

### Events
| Name                            | Parameters | Description                                                                                                                                                  |
|--------------------|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| slide-change-start | `pageNumber`     | Fire in the beginning of animation to other slide (next or previous).                                                                                        |
| slide-change-end   | `pageNumber`     | Will be fired after animation to other slide (next or previous).                                                                                             |
| slide-revert-start | `pageNumber`     | Fire in the beginning of animation to revert slide (no change).                                                                                              |
| slide-revert-end   | `pageNumber`     | Will be fired after animation to revert slide (no change).                                                                                                   |
| slider-move        | `offset`         | Callback function, will be executed when user touch and move finger over Swiper and move it. Receives swiper instance and 'touchmove' event as an arguments. |
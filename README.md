# vue2-swiper
> 一个简单的vue2 swiper 插件

## Api
### props
| Name                 | Type      | Default      | Description                                                        |
|----------------------|-----------|--------------|--------------------------------------------------------------------|
| direction            | `String`  | `"horizontal"` | Could be 'horizontal' or 'vertical' (for vertical slider).         |
| mousewheel-control   | `Boolean` | `false`       | Set to true to enable navigation through slides using mouse wheel. |
| pagination-visible   | `Boolean` | `false`      | Toggle (hide/true) pagination container visibility when click on Slider's container    |
| pagination-clickable | `Boolean` | `false`      | If true then clicking on pagination button will cause transition to appropriate slide. |
| performace-mode      | `Boolean` | `false`      | Disable advance effect for better performance.                     |
| loop                 | `Boolean` | `false`      | 设置为true来启用循环模式                         |
| customizePagination  | `String`  |              | 自定义分页的选择器，需要在分页中添加index属性来指明对应的页码，序列从1开始 |
| customizePaginationActiveClass | `String`  |   `active`   |  自定义分页中活动页的class |
| activeIndex          | `Number`  |    `1`       | 初始化时活动的页面 |
| inner                | `Boolean` |    `false`   | 如果需要swiper 嵌套，在嵌套的swiper 上添加inner属性,注意：如果`inner = true`,则该swiper的loop 和 mousewheel-control 属性将自动变为false |

### Methods
| Method            | Description              |
|-------------------|--------------------------|
| next()            | 跳转到下一页            |
| prev()            | 跳转到上一页        |
| setPage(`pageNumber : Number`,`noAnimation : Boolean`) | 设置当前活动页，noAnimation为可选参数，设为false则不启用动画过渡|

### Events
| Name                            | Parameters | Description                                                                                                                                                  |
|--------------------|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| slide-change-start | `pageNumber`     | Fire in the beginning of animation to other slide (next or previous).                                                                                        |
| slide-change-end   | `pageNumber`     | Will be fired after animation to other slide (next or previous).                                                                                             |
| slide-revert-start | `pageNumber`     | Fire in the beginning of animation to revert slide (no change).                                                                                              |
| slide-revert-end   | `pageNumber`     | Will be fired after animation to revert slide (no change).                                                                                                   |
| slider-move        | `offset`         | Callback function, will be executed when user touch and move finger over Swiper and move it. Receives swiper instance and 'touchmove' event as an arguments. |
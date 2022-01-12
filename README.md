# vue-dcjs
A custom built binding for dc in vue. Comes with built in Vue component charts as well as bindings for `dc` `d3` and `crossfilter` for you to customize and create your own charts as necessary.

Check out the [DEMO PAGE](https://geodav-tech.github.io/vue-dcjs/) or follow the api reference links below.

### cli
```npm install --save vue-dcjs```

### main.js
```
import { VueDc } from 'vue-dcjs'
Vue.use(VueDc)
```

### Vue.use option
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| registerComponents | boolean | true | Automatically register all vue-dcjs charts with Vue.component(everything). Charts will be kebab-case as shown below in the components list. |
| defaultColors | string[] | d3.schemeCategory20c | this sets dc's defaultColors for ordinal charts |
| useWindowResize | boolean | true | add an event listener to the window which watches for resize events. when the window is resized: re-render all the charts to resize them automatically. |
| resizeTimeout | number | 100 | to avoid re-rendering too much, there is a timeout on the resize handler. how long should the wait be. too short may re-render too much. too long may feel delayed |
| useResetListener | boolean | true | automatically attach a dom element(s) using `resetSelector`. the button will only be visible when the connected chart has filters. the button is clickable and will clear all filters on the chart. |
| resetSelector | (chart) => element(s) | `chart => document.querySelector(chart.anchor()).closest('.example-container').querySelectorAll('.example-reset-button')` | define how we retrieve the reset button to connect our chart to. This should be the result of `querySelector` or `querySelectorAll` |

### anywhere in vue instance
- `this.$dc` [dc instance](https://dc-js.github.io/dc.js/) with added [AxisChart](./src/plugins/axis-chart.class.js)
- `this.$d3` [d3 instance](https://github.com/d3/d3/blob/main/API.md)
- `this.$crossfilter` [crossfilter2 instance](https://github.com/crossfilter/crossfilter/wiki/API-Reference) use this to make `ndx` prop on charts

### available components
- [`<dc-bar-chart>`](./src/components/dc-bar-chart)
- [`<dc-checklist>`](./src/components/dc-checklist)
- [`<dc-composite-line-chart>`]('./src/components/dc-composite-line-chart')
- [`<dc-date-chart`](./src/components/dc-date/chart)
- [`<dc-pie-chart>`](./src/components/dc-pie-chart)
- [`<dc-row-chart>`](./src/components/dc-row-chart)
- [`<dc-stacked-bar-chart>`]('./src/components/dc-stacked-bar-chart')
- [`<dc-number-display>`]('./src/components/dc-number-display)

### mixins
- [BaseChartMixin](./src/mixins#base-chart)
- [DimensionMixin](./src/mixins/#dimension)
- [GroupMixin]('./src/mixins/#group)
- [AxisMixin]('./src/mixins/#axis)
- [LegendMixin]('./src/mixins/#axis)

#


## Project setup
```
npm ci
```

#### Compiles and hot-reloads for development
```
npm run serve
or
npm run dev
```

### how to build npm bundle
- bump npm package version in package.json
```
npm run bundle
```
- commit your changes
```
npm npm publish
```

### how to build demo for github pages
- commit changes
```
npm run publish-pages
```


### how to build both demo and github pages
- commit all changes before building
- bump the package version (you can probably just commit that with the build that you're gonna do next)
```
npm run build-all
```
- commit the build with a meaningful message
```
npm run publish-all
```
boom, you're done

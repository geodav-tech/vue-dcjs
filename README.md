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

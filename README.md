# vue-dcjs
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
-`this.$crossfilter` [crossfilter2 instance](https://github.com/crossfilter/crossfilter/wiki/API-Reference) use this to make `ndx` prop on charts

### available components
- [`<dc-bar-chart>`](./src/components/dc-bar-chart)
- [`<dc-checklist>`](./src/components/dc-checklist)
- [`<dc-pie-chart>`](./src/components/dc-pie-chart)
- [`<dc-row-chart>`](./src/components/dc-row-chart)


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

#### Compiles and minifies (the demo) for production
```
npm run build
```

#### compiles the components for npm
```
npm run bundle
```

#### Run your end-to-end tests
```
npm run test:e2e
```

#### Lints and fixes files
```
npm run lint
```

#### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

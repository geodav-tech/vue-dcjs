# vue-dcjs
# Install
### npm
```
npm install --save vue-dcjs
```
### main.js
```
import { VueDc } from 'vue-dcjs'
Vue.use(VueDc)
```
### anywhere in vue instance
```
this.$dc: the dc instance
this.$d3: the d3 instance
this.$crossfilter: the crossfilter instance. use to make `ndx` prop shared between charts
```

### available components
```
<dc-row-chart>
```


# Development setup
## Project setup
```
npm ci
```

### Compiles and hot-reloads for development
```
npm run serve

or

npm run dev
```

### Compiles and minifies (the demo) for production
```
npm run build
```

### compiles the components for npm
```
npm run bundle
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

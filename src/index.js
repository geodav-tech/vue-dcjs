// it seems important to use FULL filenames with extensions
import { DcPlugin, dc, d3, crossfilter } from './plugins/dc.plugin.js'
import {
  DcBarChart,
  DcChecklist,
  DcCompositeLineChart,
  DcDateChart,
  DcNumberDisplay,
  DcPieChart,
  DcRowChart,
  DcStackedBarChart
} from './components'

const defaultOptions = {
  registerComponents: true // Vue.component(everything) by default? will use dc-chart-name for prefixes
  // defaultColors: for dc.defaultOptions.defaultColors
  // useWindowResize: window.addEventListener(resize => dc.renderAll())
  // resizeTimeout how long to wait before calling the renderAll. prevents glitchy re-rendering if lots of resize events fire
}

const VueDc = {
  install(Vue, _options) {
    const options = Object.assign({}, defaultOptions, options)
    // hmm do we prevent this from polluting the namespace?
    // what if the user overrides $super in their code??
    // https://forum.vuejs.org/t/call-the-overrided-method-from-extend-mixin-think-super/1469
    // https://github.com/iashraful/vue-super-call/blob/master/index.js
    Vue.prototype.$super = function (options) {
      return new Proxy(options, {
        get: (options, name) => {
          if (options.methods && name in options.methods) {
            return options.methods[name].bind(this)
          }
        }
      })
    }

    // register $dc, $d3, $crossfilter
    // also set up window resize watcher if specified
    Vue.use(DcPlugin, options)

    // register out of the box components
    if (options.registerComponents) {
      Vue.component('dc-bar-chart', DcBarChart)
      Vue.component('dc-checklist', DcChecklist)
      Vue.component('dc-composite-line-chart', DcCompositeLineChart)
      Vue.component('dc-date-chart', DcDateChart)
      Vue.component('dc-number-display', DcNumberDisplay)
      Vue.component('dc-pie-chart', DcPieChart)
      Vue.component('dc-row-chart', DcRowChart)
      Vue.component('dc-stacked-bar-chart', DcStackedBarChart)
    }
  }
}

// fix warning prefer_named_exports by naming this export
export * from './components'
export { VueDc, dc, d3, crossfilter }
export default VueDc

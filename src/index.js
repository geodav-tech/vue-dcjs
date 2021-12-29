// it seems important to use FULL filenames with extensions
import DcPlugin from './plugins/dc.plugin.js'
import DcRowChart from './components/dc-row-chart.vue'

const VueDc = {
  install (Vue, options) {
    // register $dc, $d3, $crossfilter
    Vue.use(DcPlugin, options)

    // register out of the box components
    Vue.component('dc-row-chart', DcRowChart)
  }
}

// fix warning prefer_named_exports by naming this export
export {
  VueDc
}
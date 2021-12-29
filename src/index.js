// it seems important to use FULL filenames with extensions
import DcPlugin from './plugins/dc.plugin.js'
import DcRowChart from './components/dc-row-chart.vue'

const VueDc = {
  install (Vue, options) {
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
        },
      })
    }

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
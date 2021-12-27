import dc from 'dc'

export default {
  install (Vue, options) {
    // Vue.component('dc-bar-chart', DcBarChart)
    Vue.prototype.$dc = dc
  }
}
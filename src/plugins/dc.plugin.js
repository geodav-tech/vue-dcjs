import * as dc from 'dc'
import * as d3 from 'd3'
import crossfilter from 'crossfilter2'
import { AxisChart } from './axis-chart.class'

dc.AxisChart = AxisChart

/**
 * import DcPlugin from 'this.file'
 * Vue.use(DcPlugin)
 * 
 * binds dc, d3, and crossfilter to vue via $dc, $d3, $crossfilter
 */
const DcPlugin = {
  install (Vue, options) {
    if (options?.defaultColors) {
      dc.config.defaultColors = options.defaultColors
    }

    Vue.prototype.$dc = dc
    Vue.prototype.$d3 = d3
    Vue.prototype.$crossfilter = crossfilter
  }
}

export default DcPlugin
export {
  DcPlugin,
  dc,
  d3,
  crossfilter
}
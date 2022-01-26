import * as dc from 'dc'
import * as d3 from 'd3'
import crossfilter from 'crossfilter2'
import { AxisChart } from './axis-chart.class'
require('dc/dist/style/dc.min.css')

const renderAllNoTransitions = () => {
  dc.chartRegistry.list().forEach(chart => {
    // this will set the transition duration to 0 while we render
    // this makes the resize less flashy/distracting
    let lastTransitionDuration = chart.transitionDuration()
    chart.transitionDuration(0)
    chart.render()
    // but then put the duration back to whatever it was before the render
    chart.transitionDuration(lastTransitionDuration)
  })
}

// assign extras via Object.assign to prevent module mutated warning
Object.assign(dc, { AxisChart,  renderAllNoTransitions })

const defaultOptions = {
  // defaultColors: string[] of colors for ordinal charts
  useWindowResize: true, // on window resize, resize the charts to best fit their space
  resizeTimeout: 100, // wait at least this many ms to resize the charts (prevents glitching when slowly resizing the window)
  // default this to work in the example
  useResetListener: true, // use this.chart.on('filtered.reset') and the resetSelector to determine show/hide the reset button
  resetSelector: chart => {
    return document.querySelector(chart.anchor()).closest('.example-container')?.querySelectorAll('.example-reset-button') || []
  }
}

let dcConfig = Object.assign({}, defaultOptions)
const setOptions = (options) => { dcConfig = options }

/**
 * import DcPlugin from 'this.file'
 * Vue.use(DcPlugin)
 *
 * binds dc, d3, and crossfilter to vue via $dc, $d3, $crossfilter
 */
const DcPlugin = {
  install(Vue, _options) {
    const options = Object.assign({}, defaultOptions, _options)
    setOptions(options)

    if (options?.defaultColors) {
      dc.config.defaultColors(options.defaultColors)
    }

    Vue.prototype.$dc = dc
    Vue.prototype.$d3 = d3
    Vue.prototype.$crossfilter = crossfilter

    if (options.useWindowResize) {
      let resizeTimeout = null
      let lastWidth = window.innerWidth
      // I don't think there's really any way for us to know when/how to destroy this, so I'm assuming vue will figure it out
      // most likely this is only destroyed when you leave the page and everything is destroyed anyway
      window.addEventListener('resize', () => {
        if (resizeTimeout) {
          clearTimeout(resizeTimeout)
        }
        if (lastWidth !== window.innerWidth) {
          resizeTimeout = setTimeout(() => {
            dc.renderAllNoTransitions()
            resizeTimeout = null
            lastWidth = window.innerWidth
          }, options.resizeTimeout)
        }
      })
    }
  }
}

export default DcPlugin
export { DcPlugin, dc, d3, crossfilter, dcConfig, setOptions }

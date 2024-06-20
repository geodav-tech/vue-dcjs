<script>
import { accessorFunc } from '../dc-utils.js'
import { dcConfig } from '../plugins/dc.plugin.js'

export default {
  name: 'BaseChartMixin',
  dimension: null, //crossfilter.dimension
  props: {
    ndx: {
      // crossfilter object. e.g. this.$crossfilter(dataArray)
      type: Object,
      required: true
    },
    name: {
      type: String
    },
    options: {
      type: Object
    },
    hasResetListener: {
      type: Boolean,
      default: true
    }
  },
  baseDefaultOptions: {
    disposeDimension: true,
    render: true // set false to stop rendering on startup
    // beforeDestroy: dimension.dispose()
    // valueAccessor: string, function,
    // margins: {top, left, bottom, right},
    // keyAccessor: string, function,
    // title: string, function,
    // label: string, function
  },
  data() {
    return {
      chart: null,
      resetButtonFunction: null,
      resetButtons: []
    }
  },
  mounted() {
    this.drawChart()
  },
  methods: {
    reset() {
      if (this.chart) {
        this.chart.filter(null)
      }
    },
    async drawChart() {
      // clear chart?
      await this.createChart()
      this.addChartExtras()

      this.callOnCreate()

      if (this.computedOptions.onFilter) {
        this.chart.on('filtered', this.computedOptions.onFilter)
      }
      if (this.computedOptions.onClick) {
        this.chart.on('click', this.computedOptions.onClick)
      }

      if (dcConfig.useResetListener && typeof dcConfig.resetSelector === 'function' && this.hasResetListener) {
        this.setupResetListener()
      }

      if (this.computedOptions.render) {
        this.renderChart()
      }
    },
    /**
     * you are able to call this.$super(BaseChartMixin).drawChart()
     * but you must create the chart first
     */
    createChart() {
      const { valueAccessor, margins, keyAccessor, title, label, height, width, digits, titleSuffix } = this.computedOptions
      const titleDigits =  digits || digits === 0 ? digits : dcConfig.titleRoundDigits
      function defaultTitleAccessor(d) {
        const key = keyAccessor ? accessorFunc(keyAccessor)(d) : d.key
        let value = valueAccessor ? accessorFunc(valueAccessor)(d) : d.value
        if (value?.toFixed && titleDigits >= 0) {
          value = value.toFixed(titleDigits)
        }
        let title = `${key}: ${value}`
        if (titleSuffix) {
          title += titleSuffix
        }
        return title
      }
      this.chart.title(accessorFunc(title || defaultTitleAccessor))

      if (valueAccessor) {
        this.chart.valueAccessor(accessorFunc(valueAccessor))
      }
      if (margins && this.chart.margins) {
        this.chart.margins(this.computedMargins)
      }
      if (keyAccessor) {
        this.chart.keyAccessor(accessorFunc(keyAccessor))
      }
      if (title) {
        this.chart.title(accessorFunc(title))
      }
      if (label) {
        this.chart.label(accessorFunc(label))
      }

      if (height) {
        this.chart.height(height)
      }
      if (width) {
        this.chart.width(width)
      }

      // allow our custom `renderAllNoTransitions` to call the overridden render func for vue-based charts
      this.chart.vueRender = () => this.render()
    },
    onResetButtonClick() {},
    // allows children to hook into pre/post render hooks
    renderChart() {
      return new Promise((resolve) => {
        this.$emit('pre-render', this.chart)
        this.$nextTick(() => {
          this.render()
          this.$nextTick(() => {
            this.$emit('post-render', this.chart)
            return resolve(this.chart)
          })
        })
      })
    },
    render() {
      // to be extended by children if needed
      this.chart.render()
    },
    addChartExtras() {
      if (this.name || this.computedOptions.name) {
        this.chart.name = this.name || this.computedOptions.name
      }
      // set chart.vueOptions to be able to pass chart without having to additionally pass it's computedOptions
      this.chart.vueOptions = this.computedOptions
    },
    callOnCreate() {
      // charts with multiple components may wish to pass extras. make this an overridable function
      this.computedOptions?.onCreate?.(this.chart)
      this.$emit('create', this.chart)
    },
    setupResetListener() {
      let charts = this.chart?.children ? [this.chart, ...this.chart.children()] : [this.chart]
      try {
        const { resetSelector } = dcConfig
        this.resetButtons = charts.reduce((buttons, chart) => {
          let result = resetSelector(chart)
          if (typeof result.forEach !== 'function') {
            buttons.push(result)
          } else {
            result.forEach((res) => {
              buttons.push(res)
            })
          }
          return buttons
        }, [])

        // ensure we can remove this later
        this.resetButtonFunction = () => {
          charts.forEach((chart) => {
            chart.filterAll()
          })
          this.$dc.redrawAll()
        }

        this.resetButtons.forEach((button) => {
          button.addEventListener('click', this.resetButtonFunction)
        })
        const updateButtonVisibility = () => {
          let hasFilter = charts.some((chart) => chart.hasFilter())
          this.resetButtons.forEach((instance) => {
            if (hasFilter) {
              instance.classList.remove('dc-reset-is-hidden')
            } else {
              instance.classList.add('dc-reset-is-hidden')
            }
          })
        }

        charts.forEach((chart) => {
          chart.on('filtered.reset', updateButtonVisibility)
        })
        updateButtonVisibility() // update this on startup as well
      } catch (e) {
        console.error('Could not attach reset listener using resetSelector', e)
      }
    }
  },
  computed: {
    computedMargins() {
      if (typeof this.computedOptions.margins === 'number') {
        let margin = this.computedOptions.margins
        return { top: margin, left: margin, right: margin, bottom: margin }
      } else {
        return Object.assign({ top: 30, right: 30, bottom: 30, left: 30 }, this.$options.defaultOptions?.margins, this.options?.margins)
      }
    },
    computedOptions() {
      return Object.assign({}, this.$options.baseDefaultOptions, this.$options.defaultOptions, this.options)
    }
  },
  beforeDestroy() {
    if (this.chart) {
      // fix problems where things that change keys have filters that you can never recover data from
      // clear all filters from dimension when chart is destroyed.
      // this may want to become optional if:
      //    charts share a dimension where:
      //        one or more is expected to be destroyed
      //        and one or more is expected to retain filtered state
      const dim = this.chart.dimension()
      if (dim) {
        // FIXME store these and reapply filters?
        dim.filterAll()
      }
      // we also cannot dispose of dimensions for this reason.
      // though some charts should have an option for this
      // all dc instances share a registry. take care of yourself
      this.$dc.chartRegistry.deregister(this.chart)
    }
    if (this.computedOptions.disposeDimension && this.$options.dimension) {
      this.$options.dimension.dispose()
    }
  }
}
</script>

<style>
.dc-reset-is-hidden {
  display: none !important;
}
</style>

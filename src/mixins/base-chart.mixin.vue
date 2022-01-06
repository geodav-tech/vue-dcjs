<script>
import { accessorFunc } from '../dc-utils.js'
export default {
  name: 'BaseChartMixin',
  dimension: null, //crossfilter.dimension
  myName: 'baseChart',
  props: {
    ndx: { // crossfilter object. e.g. this.$crossfilter(dataArray)
      type: Object,
      required: true
    },
    name: {
      type: String
    },
    options: {
      type: Object
    }
  },
  baseDefaultOptions: {
    disposeDimension: true, // beforeDestroy: dimension.dispose()
    // valueAccessor: string, function,
    // margins: {top, left, bottom, right},
    // keyAccessor: string, function,
    // title: string, function,
    // label: string, function
  },
  data () {
    return {
      chart: null
    }
  },
  mounted () {
    this.drawChart()
  },
  methods: {
    reset () {
      if (this.chart) {
        this.chart.filter(null)
      }
    },
    drawChart() {
      // clear chart?
      this.createChart()
      this.addChartExtras()
      this.renderChart()
    },
    /**
     * you are able to call this.$super(BaseChartMixin).drawChart()
     * but you must create the chart first
     */
    createChart() {
      const { valueAccessor, margins, keyAccessor, title, label, height, width } = this.computedOptions
      if (valueAccessor) {
        this.chart.valueAccessor(accessorFunc(valueAccessor))
      }
      if (margins) {
        this.chart.margins(margins)
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
    },
    // allows children to hook into pre/post render hooks
    renderChart () {
      return new Promise((resolve) => {
        this.$emit('pre-render', this.chart)
        this.$nextTick(() => {
          this.render()
          this.$nextTick(() => {
            this.$emit('post-render', this.chart)
            return resolve()
          })
        })
      })
    },
    render () { // to be extended by children if needed
      this.chart.render()
    },
    addChartExtras () {
      if (this.name || this.computedOptions.name) {
        this.chart.name = this.name || this.computedOptions.name
      }
      // set chart.vueOptions to be able to pass chart without having to additionally pass it's computedOptions
      this.chart.vueOptions = this.computedOptions
    }
  },
  computed: {
    computedMargins () {
      return Object.assign({ top: 30, right: 30, bottom: 30, left: 30 }, this.$options.defaultOptions?.margins, this.options?.margins)
    },
    computedOptions () {
      return Object.assign({}, this.$options.baseDefaultOptions, this.$options.defaultOptions, this.options)
    }
  },
  beforeDestroy () {
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

</style>
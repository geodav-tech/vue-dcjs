<template>
  <div class="dc-chart-container dc-row-chart-container">
    <div :id="`chart-${_uid}`" class="dc-chart dc-row-chart" :class="{'is-scrollable': axisChart}" :style="computedStyle"></div>
    <div v-if="computedOptions.scrollable" :id="`chart-${_uid}-axis`" class="dc-chart dc-axis-chart dc-row-axis-chart"></div>
  </div>
</template>

<script>
import { BaseChartMixin, DimensionMixin, GroupMixin } from '../../mixins'
import { accessorFunc } from '../../dc-utils.js'

export default {
  name: 'DcRowChart',
  mixins: [BaseChartMixin, DimensionMixin, GroupMixin],
  defaultOptions: {
    elastic: true,
    scrollable: true,
    minHeight: 150,
    barHeight: 20,
    axisChartheight: 50,
    scrollHeight: '200px',
    scrollbarPadding: 0 // about the width of the scroll bar we are padding
  },
  data() {
    return {
      axisChart: null
    }
  },
  methods: {
    createChart() {
      // merge in default options
      let { elastic, scrollable, minHeight, barHeight, axisChartHeight, valueAccessor, keyAccessor } = this.computedOptions
      this.$options.dimension = this.createDimension()
      const group = this.createGroup(this.$options.dimension)

      this.chart = new this.$dc.RowChart(`#chart-${this._uid}`).dimension(this.$options.dimension).group(group)

      this.$super(BaseChartMixin).createChart()
      let rowChartMargin = scrollable ? Object.assign({}, this.computedMargins, { bottom: -1 }) : this.computedMargins
      this.chart.margins(rowChartMargin)

      if (elastic) {
        this.chart.elasticX(true)
      }

      if (scrollable) {
        this.chart.height(Math.max(minHeight, group.size() * barHeight))
        this.chart.transitionDuration(1000)

        let axisChartMargin = Object.assign({}, this.computedMargins, { top: 0 }) // enforce top margin
        this.axisChart = new this.$dc.AxisChart(`#chart-${this._uid}-axis`)
          .dimension(this.$options.dimension)
          .group(group)
          .height(axisChartHeight)
          .margins(axisChartMargin)
        if (valueAccessor) {
          this.axisChart.valueAccessor(accessorFunc(valueAccessor))
        }
        if (keyAccessor) {
          this.axisChart.keyAccessor(accessorFunc(keyAccessor))
        }
        if (elastic) {
          this.axisChart.elastic(true)
        }
      }
    },
    render() {
      this.$super(BaseChartMixin).render()
      this.axisChart?.render()
    },
    callOnCreate() {
      this.computedOptions?.onCreate?.(this.chart, this.axisChart)
      this.$emit('create', this.chart, this.axisChart)
    }
  },
  computed: {
    computedStyle() {
      let styles = []
      if (this.computedOptions.scrollable) {
        styles.push('overflow-y: auto; overflow-x: hidden;')
        if (this.computedOptions.scrollHeight) {
          styles.push(`max-height: ${this.computedOptions.scrollHeight}`)
        }
      }
      return styles.join('; ')
    },
    computedMargins() {
      let margins = Object.assign(
        { top: 30, right: 30, bottom: 30, left: 30 },
        this.$options.defaultOptions?.margins,
        this.options?.margins
      )
      const { scrollable, scrollbarPadding } = this.computedOptions
      if (scrollable && scrollbarPadding) {
        margins.right += scrollbarPadding
      }
      return margins
    }
  }
}
</script>

<style>
.dc-chart.dc-row-chart.is-scrollable .axis path,
.dc-chart.dc-row-chart.is-scrollable .axis g.tick line:not(.grid-line)  {
  display: none;
  stroke: none;
}
</style>

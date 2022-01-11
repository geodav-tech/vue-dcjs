<template>
  <div class="dc-chart-container dc-composite-line-container">
    <div class="dc-chart dc-composite-line-chart" :id="`chart-${_uid}`"></div>
  </div>
</template>

<script>
import { BaseChartMixin, DimensionMixin, GroupMixin, AxisMixin, LegendMixin } from '../../mixins'
import { accessorFunc } from '../../dc-utils.js'

export default {
  name: 'DcCompositeLineChart',
  mixins: [BaseChartMixin, DimensionMixin, GroupMixin, AxisMixin, LegendMixin],
  defaultOptions: {
    elastic: true,
    showLegend: true,
    legendOptions: {
      x: 50
    }
  },
  props: {
    /**
     * {
     *    name: string (will be displayed)
     *    valueAccessor: string | ((d) => value)
     *    color: string
     * }
     */
    groups: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      groupCharts: []
    }
  },
  methods: {
    createChart() {
      this.$options.dimension = this.createDimension()
      const group = this.createGroup(this.$options.dimension)

      let { elastic, keyAccessor, renderArea } = this.computedOptions

      this.chart = new this.$dc.CompositeChart(`#chart-${this._uid}`).dimension(this.$options.dimension)

      this.$super(BaseChartMixin).createChart()
      this.applyAxisOptions()

      if (elastic) {
        this.chart.elasticY(true)
      }

      if (!this.computedAxisOptions.x?.x) {
        let keyAccessor = accessorFunc(this.computedOptions.keyAccessor || ((d) => d.key))
        let top = keyAccessor(this.$options.dimension.top(1)[0])
        let bottom = keyAccessor(this.$options.dimension.bottom(1)[0])
        this.chart.x(this.$d3.scaleLinear().domain([bottom, top]))
      }

      this.groupCharts = this.groups.map((chartGroup) => {
        let groupChart = new this.$dc.LineChart(this.chart)
          .group(group, chartGroup.name)
          .valueAccessor(accessorFunc(chartGroup.valueAccessor || ((d) => d.value)))
          .keyAccessor(accessorFunc(keyAccessor || ((d) => d.key)))
        if (renderArea || chartGroup.renderArea) {
          groupChart.renderArea(true)
        }
        if (chartGroup.color) {
          groupChart.colors(chartGroup.color)
        }
        return groupChart
      })

      this.chart.compose(this.groupCharts)
      this.applyLegendOptions()
    },
    callOnCreate() {
      this.$emit('on-create', this.chart, this.groupCharts)
    }
  }
}
</script>

<style></style>
